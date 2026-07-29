import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { CanonicalId, RulesContextId } from '../domain'
import { stableJson } from '../generate/serialization'
import {
  REVIEW_EVIDENCE_BEGIN,
  REVIEW_EVIDENCE_END,
  type ReviewPacketPair,
  type UntrustedReviewEvidence,
} from './packets'
import type {
  ReviewAssignmentId,
  ReviewAuthority,
  ReviewerConfigurationId,
  ReviewerResult,
  ReviewPacket,
  ReviewPacketId,
} from './records'
import { expectedReviewPacketChecksum } from './records'
import { loadReviewPacketPairsByKey, writeCreateOnlyFile } from './reviewWorkspace'

export type GuidedBlindStage = 'calibration-blind' | 'sample-blind'
export type GuidedBlindAuthority = ReviewAuthority | 'insufficient-evidence'

interface GuidedBlindTask {
  pairKey: string
  factionIds: CanonicalId<'faction'>[]
  rulesContextIds: RulesContextId[]
  blindPacket: ReviewPacket
  evidence: UntrustedReviewEvidence[]
}

export interface GuidedBlindTaskCollection {
  schemaVersion: 1
  revision: string
  instructions: string
  tasks: GuidedBlindTask[]
}

interface GuidedResultTemplateEntry {
  schemaVersion: 1
  assignmentId: ReviewAssignmentId
  packetId: ReviewPacketId
  packetChecksum: string
  reviewerConfigurationId: ReviewerConfigurationId
  reviewedAt: null
  outcome: null
  rationale: string
  blindExpectedInterpretation: null
  findings: []
}

export interface GuidedResultTemplate {
  schemaVersion: 1
  results: GuidedResultTemplateEntry[]
}

export interface GuidedBlindResponse {
  packetId: ReviewPacketId
  outcome: 'pass' | 'cannot-verify'
  field: string
  expectedValue: string
  authority: GuidedBlindAuthority
  rationale: string
  reviewedAt: string
}

export interface GuidedBlindStageFiles {
  tasks: string
  template: string
  output: string
}

export interface GuidedBlindReviewSession {
  stage: GuidedBlindStage
  assignmentId: ReviewAssignmentId
  revision: string
  instructions: string
  tasks: GuidedBlindTask[]
  outputExists: boolean
}

const REVIEW_CACHE = path.resolve('.cache', 'aos4', 'review')
const CANONICAL_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
const ALLOWED_AUTHORITIES = new Set<GuidedBlindAuthority>([
  'official',
  'secondary',
  'community',
  'unknown',
  'insufficient-evidence',
])

const isCanonicalInstant = (value: string): boolean =>
  CANONICAL_INSTANT.test(value) && new Date(value).toISOString() === value

const parseReviewerValue = (value: string): unknown => {
  const trimmed = value.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

const resolveReviewDirectory = (reviewDirectory: string): string => {
  const resolved = path.resolve(reviewDirectory)
  if (resolved !== REVIEW_CACHE && !resolved.startsWith(`${REVIEW_CACHE}${path.sep}`)) {
    throw new Error(`Guided review artifacts must remain under ${REVIEW_CACHE}`)
  }
  return resolved
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const fileExists = async (filePath: string): Promise<boolean> =>
  access(filePath)
    .then(() => true)
    .catch(() => false)

export const guidedBlindStagePaths = (
  reviewDirectory: string,
  stage: GuidedBlindStage
): GuidedBlindStageFiles => {
  const directory = path.resolve(reviewDirectory)
  if (stage === 'calibration-blind') {
    return {
      tasks: path.join(directory, 'calibration-blind-tasks.json'),
      template: path.join(directory, 'calibration-blind-results.template.json'),
      output: path.join(directory, 'calibration-blind-results.json'),
    }
  }
  return {
    tasks: path.join(directory, 'sample-blind', 'tasks.json'),
    template: path.join(directory, 'sample-blind', 'results.template.json'),
    output: path.join(directory, 'sample-blind', 'results.json'),
  }
}

export const parseGuidedEvidenceContent = (content: string): unknown => {
  const trimmed = content.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

const validateTaskTemplateBindings = (
  tasks: GuidedBlindTaskCollection,
  template: GuidedResultTemplate,
  pairs?: ReviewPacketPair[]
): void => {
  if (tasks.schemaVersion !== 1 || template.schemaVersion !== 1) {
    throw new Error('Guided review tasks and template must use schema version 1')
  }
  if (!tasks.tasks.length) {
    throw new Error('Guided review requires at least one blind task')
  }
  if (template.results.length !== tasks.tasks.length) {
    throw new Error('Guided review responses do not cover every task')
  }

  const taskByPacket = new Map(tasks.tasks.map(task => [task.blindPacket.id, task]))
  const templatePacketIds = new Set(template.results.map(result => result.packetId))
  if (taskByPacket.size !== tasks.tasks.length || templatePacketIds.size !== template.results.length) {
    throw new Error('Guided review contains a duplicate packet')
  }

  const assignmentId = template.results[0]?.assignmentId
  const reviewerConfigurationId = template.results[0]?.reviewerConfigurationId
  if (
    !assignmentId ||
    !reviewerConfigurationId ||
    template.results.some(
      result =>
        result.assignmentId !== assignmentId || result.reviewerConfigurationId !== reviewerConfigurationId
    )
  ) {
    throw new Error('Guided review template mixes reviewer assignments')
  }

  if (pairs) {
    const pairByKey = new Map(pairs.map(pair => [pair.pairKey, pair]))
    if (pairs.length !== tasks.tasks.length || pairByKey.size !== pairs.length) {
      throw new Error('Guided blind tasks do not cover every sealed workspace pair')
    }
    tasks.tasks.forEach(task => {
      const pair = pairByKey.get(task.pairKey)
      if (
        !pair ||
        stableJson(task.blindPacket) !== stableJson(pair.blindPacket) ||
        stableJson(task.evidence) !== stableJson(pair.evidence)
      ) {
        throw new Error('Guided blind task does not match its sealed workspace pair')
      }
    })
  }

  template.results.forEach(result => {
    const task = taskByPacket.get(result.packetId)
    if (!task) {
      throw new Error('Result template does not match its blind task')
    }
    const expectedPacketChecksum = expectedReviewPacketChecksum(task.blindPacket)
    if (
      task.blindPacket.packetChecksum !== expectedPacketChecksum ||
      task.blindPacket.id !== `review-packet:sha256:${expectedPacketChecksum}`
    ) {
      throw new Error('Guided blind task packet checksum is stale')
    }
    const excerptRefs = task.blindPacket.sourceEvidence.flatMap(evidence =>
      evidence.excerptRef ? [evidence.excerptRef] : []
    )
    const evidenceRefs = task.evidence.map(evidence => evidence.ref)
    if (
      new Set(excerptRefs).size !== excerptRefs.length ||
      new Set(evidenceRefs).size !== evidenceRefs.length ||
      stableJson(excerptRefs.sort()) !== stableJson(evidenceRefs.sort()) ||
      task.evidence.some(
        evidence =>
          evidence.trust !== 'untrusted-source-data' ||
          evidence.beginDelimiter !== REVIEW_EVIDENCE_BEGIN ||
          evidence.endDelimiter !== REVIEW_EVIDENCE_END
      )
    ) {
      throw new Error('Guided blind task evidence references are invalid')
    }
    if (
      !task.blindPacket.blind ||
      task.blindPacket.generatedDestinations.length !== 0 ||
      result.packetChecksum !== task.blindPacket.packetChecksum ||
      result.packetId !== task.blindPacket.id ||
      result.outcome !== null ||
      result.reviewedAt !== null ||
      result.blindExpectedInterpretation !== null ||
      result.findings.length !== 0
    ) {
      throw new Error('Result template does not match its blind task')
    }
  })
}

export const buildGuidedBlindResultCollection = (
  tasks: GuidedBlindTaskCollection,
  template: GuidedResultTemplate,
  responses: GuidedBlindResponse[]
): { schemaVersion: 1; results: ReviewerResult[] } => {
  if (responses.length !== tasks.tasks.length) {
    throw new Error('Guided review responses do not cover every task')
  }

  validateTaskTemplateBindings(tasks, template)
  const responseByPacket = new Map(responses.map(result => [result.packetId, result]))
  if (responseByPacket.size !== responses.length) {
    throw new Error('Guided review contains a duplicate packet')
  }

  const results = template.results.map((result): ReviewerResult => {
    const response = responseByPacket.get(result.packetId)
    if (!response) throw new Error('Guided review responses do not cover every task')
    if (response.outcome !== 'pass' && response.outcome !== 'cannot-verify') {
      throw new Error('Blind review outcome must be pass or cannot-verify')
    }
    if (!ALLOWED_AUTHORITIES.has(response.authority)) {
      throw new Error(`Blind review authority is unsupported: ${response.authority}`)
    }
    if (!response.field.trim()) throw new Error('Blind review field is required')
    if (!isCanonicalInstant(response.reviewedAt)) {
      throw new Error('reviewedAt must be a canonical ISO timestamp')
    }
    if (response.rationale.trim().length < 20) {
      throw new Error('Blind review rationale must explain what the evidence establishes')
    }

    const insufficient = response.outcome === 'cannot-verify'
    if (insufficient !== (response.authority === 'insufficient-evidence')) {
      throw new Error('Cannot-verify outcomes must identify insufficient evidence')
    }
    if (!insufficient && !response.expectedValue.trim()) {
      throw new Error('A passing blind review requires a source-derived expected value')
    }

    return {
      schemaVersion: 1,
      assignmentId: result.assignmentId,
      packetId: result.packetId,
      packetChecksum: result.packetChecksum,
      reviewerConfigurationId: result.reviewerConfigurationId,
      reviewedAt: response.reviewedAt,
      outcome: response.outcome,
      rationale: response.rationale.trim(),
      blindExpectedInterpretation: insufficient
        ? {
            field: response.field.trim(),
            status: 'insufficient-evidence',
          }
        : {
            authority: response.authority,
            expectedValue: parseReviewerValue(response.expectedValue),
            field: response.field.trim(),
          },
      findings: [],
    }
  })

  return { schemaVersion: 1, results }
}

export const loadGuidedBlindReview = async (
  reviewDirectory: string,
  stage: GuidedBlindStage,
  workspacePath: string
): Promise<{
  session: GuidedBlindReviewSession
  tasks: GuidedBlindTaskCollection
  template: GuidedResultTemplate
  output: string
}> => {
  const directory = resolveReviewDirectory(reviewDirectory)
  const workspace = resolveReviewDirectory(workspacePath)
  const files = guidedBlindStagePaths(directory, stage)
  const [tasks, template, outputExists] = await Promise.all([
    readJson<GuidedBlindTaskCollection>(files.tasks),
    readJson<GuidedResultTemplate>(files.template),
    fileExists(files.output),
  ])
  const pairs = await loadReviewPacketPairsByKey(workspace, new Set(tasks.tasks.map(task => task.pairKey)))
  validateTaskTemplateBindings(tasks, template, pairs)
  return {
    session: {
      stage,
      assignmentId: template.results[0].assignmentId,
      revision: tasks.revision,
      instructions: tasks.instructions,
      tasks: tasks.tasks,
      outputExists,
    },
    tasks,
    template,
    output: files.output,
  }
}

export const saveGuidedBlindReview = async (
  reviewDirectory: string,
  stage: GuidedBlindStage,
  workspacePath: string,
  responses: GuidedBlindResponse[]
): Promise<string> => {
  const loaded = await loadGuidedBlindReview(reviewDirectory, stage, workspacePath)
  const collection = buildGuidedBlindResultCollection(loaded.tasks, loaded.template, responses)
  await writeCreateOnlyFile(loaded.output, stableJson(collection))
  return loaded.output
}
