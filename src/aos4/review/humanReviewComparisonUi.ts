import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { stableJson } from '../generate/serialization'
import type { ReviewPacketPair, UntrustedReviewEvidence } from './packets'
import {
  checksumReviewRecord,
  createReviewFinding,
  expectedReviewPacketChecksum,
  type ReviewConfidence,
  type ReviewerResult,
  type ReviewPacket,
  type ReviewPacketId,
  type ReviewSeverity,
} from './records'
import { loadReviewPacketPairsByKey, writeCreateOnlyFile } from './reviewWorkspace'

export type GuidedComparisonStage = 'calibration-comparison' | 'sample-comparison'

interface GuidedComparisonTask {
  pairKey: string
  blindInterpretation: unknown
  blindPacketId: ReviewPacketId
  blindPacketChecksum: string
  comparisonPacketId: ReviewPacketId
  comparisonPacketChecksum: string
  comparisonPacket: ReviewPacket
}

interface GuidedComparisonDisplayTask extends GuidedComparisonTask {
  evidence: UntrustedReviewEvidence[]
}

interface GuidedComparisonTaskCollection {
  schemaVersion: 1
  blindResultsChecksum: string
  tasks: GuidedComparisonTask[]
}

interface GuidedComparisonTemplateEntry {
  schemaVersion: 1
  assignmentId: ReviewerResult['assignmentId']
  packetId: ReviewPacketId
  packetChecksum: string
  reviewerConfigurationId: ReviewerResult['reviewerConfigurationId']
  reviewedAt: null
  outcome: null
  rationale: string
  findings: []
}

interface GuidedComparisonTemplate {
  schemaVersion: 1
  results: GuidedComparisonTemplateEntry[]
}

interface GuidedBlindResultCollection {
  schemaVersion: 1
  results: ReviewerResult[]
}

export interface GuidedComparisonResponse {
  packetId: ReviewPacketId
  outcome: 'pass' | 'finding' | 'cannot-verify'
  rationale: string
  reviewedAt: string
  findingField?: string
  expectedValue?: string
  actualValue?: string
  severity?: ReviewSeverity
  confidence?: ReviewConfidence
}

export interface GuidedComparisonSession {
  mode: 'comparison'
  stage: GuidedComparisonStage
  assignmentId: ReviewerResult['assignmentId']
  tasks: GuidedComparisonDisplayTask[]
  outputExists: boolean
}

const REVIEW_CACHE = path.resolve('.cache', 'aos4', 'review')
const CANONICAL_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
const ALLOWED_SEVERITIES = new Set<ReviewSeverity>(['blocker', 'major', 'minor'])
const ALLOWED_CONFIDENCES = new Set<ReviewConfidence>(['high', 'medium', 'low'])

const isCanonicalInstant = (value: string): boolean =>
  CANONICAL_INSTANT.test(value) && new Date(value).toISOString() === value

const parseReviewerValue = (value: string | undefined): unknown => {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  try {
    return JSON.parse(trimmed)
  } catch {
    return trimmed
  }
}

const insideReviewCache = (requestedPath: string, label: string): string => {
  const resolved = path.resolve(requestedPath)
  if (resolved !== REVIEW_CACHE && !resolved.startsWith(`${REVIEW_CACHE}${path.sep}`)) {
    throw new Error(`${label} must remain under ${REVIEW_CACHE}`)
  }
  return resolved
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const fileExists = async (filePath: string): Promise<boolean> =>
  access(filePath)
    .then(() => true)
    .catch(() => false)

const stageDirectory = (reviewDirectory: string, stage: GuidedComparisonStage): string =>
  path.join(reviewDirectory, stage)

const validateComparisonBindings = (
  tasks: GuidedComparisonTaskCollection,
  template: GuidedComparisonTemplate,
  blindResults: GuidedBlindResultCollection,
  pairs: ReviewPacketPair[]
): Map<ReviewPacketId, { task: GuidedComparisonTask; pair: ReviewPacketPair; blind: ReviewerResult }> => {
  if (tasks.schemaVersion !== 1 || template.schemaVersion !== 1 || blindResults.schemaVersion !== 1) {
    throw new Error('Guided comparison artifacts must use schema version 1')
  }
  if (
    !tasks.tasks.length ||
    template.results.length !== tasks.tasks.length ||
    blindResults.results.length !== tasks.tasks.length ||
    pairs.length !== tasks.tasks.length
  ) {
    throw new Error('Guided comparison artifacts do not cover every task')
  }
  if (tasks.blindResultsChecksum !== checksumReviewRecord(blindResults)) {
    throw new Error('Guided comparison blind results do not match their sealed checksum')
  }

  const pairByKey = new Map(pairs.map(pair => [pair.pairKey, pair]))
  const blindByPacket = new Map(blindResults.results.map(result => [result.packetId, result]))
  const templateByPacket = new Map(template.results.map(result => [result.packetId, result]))
  const bindings = new Map<
    ReviewPacketId,
    { task: GuidedComparisonTask; pair: ReviewPacketPair; blind: ReviewerResult }
  >()
  if (
    pairByKey.size !== pairs.length ||
    blindByPacket.size !== blindResults.results.length ||
    templateByPacket.size !== template.results.length
  ) {
    throw new Error('Guided comparison contains a duplicate packet or pair')
  }

  tasks.tasks.forEach(task => {
    const pair = pairByKey.get(task.pairKey)
    const blind = blindByPacket.get(task.blindPacketId)
    const result = templateByPacket.get(task.comparisonPacketId)
    const expectedComparisonChecksum = expectedReviewPacketChecksum(task.comparisonPacket)
    if (
      !pair ||
      !blind ||
      !result ||
      task.comparisonPacket.blind ||
      task.comparisonPacket.packetChecksum !== expectedComparisonChecksum ||
      task.comparisonPacket.id !== `review-packet:sha256:${expectedComparisonChecksum}` ||
      stableJson(task.comparisonPacket) !== stableJson(pair.comparisonPacket) ||
      stableJson(task.blindInterpretation) !== stableJson(blind.blindExpectedInterpretation) ||
      task.blindPacketId !== pair.blindPacket.id ||
      task.blindPacketChecksum !== pair.blindPacket.packetChecksum ||
      task.comparisonPacketId !== pair.comparisonPacket.id ||
      task.comparisonPacketChecksum !== pair.comparisonPacket.packetChecksum ||
      task.comparisonPacket.packetChecksum !== pair.comparisonPacket.packetChecksum ||
      blind.packetChecksum !== pair.blindPacket.packetChecksum ||
      result.packetChecksum !== pair.comparisonPacket.packetChecksum ||
      result.assignmentId !== blind.assignmentId ||
      result.reviewerConfigurationId !== blind.reviewerConfigurationId ||
      result.outcome !== null ||
      result.reviewedAt !== null ||
      result.findings.length !== 0
    ) {
      throw new Error('Guided comparison task does not match its sealed review pair')
    }
    bindings.set(task.comparisonPacketId, { task, pair, blind })
  })
  if (bindings.size !== tasks.tasks.length) {
    throw new Error('Guided comparison contains a duplicate comparison packet')
  }
  return bindings
}

const customFinding = (
  pair: ReviewPacketPair,
  response: GuidedComparisonResponse
): ReviewerResult['findings'][number] => {
  const source = pair.comparisonPacket.sourceEvidence[0]
  if (!source) {
    throw new Error('A material discrepancy requires source evidence')
  }
  const field = response.findingField?.trim()
  if (!field) {
    throw new Error('A material discrepancy requires an affected field')
  }
  const expectedValue = parseReviewerValue(response.expectedValue)
  const actualValue = parseReviewerValue(response.actualValue)
  return createReviewFinding({
    packetId: pair.comparisonPacket.id,
    subject: {
      ...(pair.comparisonPacket.canonicalEntityId
        ? { canonicalEntityId: pair.comparisonPacket.canonicalEntityId }
        : {}),
      sourceRecordId: source.sourceRecordId,
      field,
    },
    ...(expectedValue === undefined ? {} : { expectedValue }),
    ...(actualValue === undefined ? {} : { actualValue }),
    severity: response.severity ?? 'major',
    confidence: response.confidence ?? 'high',
    rationale: response.rationale.trim(),
    evidence: pair.comparisonPacket.sourceEvidence.map(evidence => ({
      sourceRecordId: evidence.sourceRecordId,
      recordChecksum: evidence.recordChecksum,
      locator: evidence.locator,
    })),
  })
}

export const buildGuidedComparisonResultCollection = (
  tasks: GuidedComparisonTaskCollection,
  template: GuidedComparisonTemplate,
  blindResults: GuidedBlindResultCollection,
  pairs: ReviewPacketPair[],
  responses: GuidedComparisonResponse[]
): { schemaVersion: 1; results: ReviewerResult[] } => {
  if (responses.length !== tasks.tasks.length) {
    throw new Error('Guided comparison responses do not cover every task')
  }
  const bindings = validateComparisonBindings(tasks, template, blindResults, pairs)
  const responseByPacket = new Map(responses.map(response => [response.packetId, response]))
  if (responseByPacket.size !== responses.length) {
    throw new Error('Guided comparison contains a duplicate response')
  }

  return {
    schemaVersion: 1,
    results: template.results.map(result => {
      const binding = bindings.get(result.packetId)
      const response = responseByPacket.get(result.packetId)
      if (!binding || !response) {
        throw new Error('Guided comparison responses do not cover every task')
      }
      if (!['pass', 'finding', 'cannot-verify'].includes(response.outcome)) {
        throw new Error('Guided comparison outcome is unsupported')
      }
      if (!isCanonicalInstant(response.reviewedAt)) {
        throw new Error('reviewedAt must be a canonical ISO timestamp')
      }
      if (new Date(response.reviewedAt) <= new Date(binding.blind.reviewedAt)) {
        throw new Error('Comparison must be recorded after the sealed blind result')
      }
      if (response.rationale.trim().length < 20) {
        throw new Error('Comparison rationale must explain the reviewer decision')
      }
      if (response.outcome === 'finding' && !response.findingField?.trim()) {
        throw new Error('A material discrepancy requires an affected field')
      }
      if (
        response.outcome === 'finding' &&
        (!ALLOWED_SEVERITIES.has(response.severity ?? 'major') ||
          !ALLOWED_CONFIDENCES.has(response.confidence ?? 'high'))
      ) {
        throw new Error('A material discrepancy has an unsupported severity or confidence')
      }

      const findings = response.outcome === 'finding' ? [customFinding(binding.pair, response)] : []
      return {
        schemaVersion: 1,
        assignmentId: result.assignmentId,
        packetId: result.packetId,
        packetChecksum: result.packetChecksum,
        reviewerConfigurationId: result.reviewerConfigurationId,
        reviewedAt: response.reviewedAt,
        outcome: response.outcome,
        rationale: response.rationale.trim(),
        findings,
      }
    }),
  }
}

export const loadGuidedComparisonReview = async (
  reviewDirectory: string,
  stage: GuidedComparisonStage,
  workspacePath: string
): Promise<{
  session: GuidedComparisonSession
  tasks: GuidedComparisonTaskCollection
  template: GuidedComparisonTemplate
  blindResults: GuidedBlindResultCollection
  pairs: ReviewPacketPair[]
  output: string
}> => {
  const directory = insideReviewCache(reviewDirectory, 'Guided review directory')
  const workspace = insideReviewCache(workspacePath, 'Guided review workspace')
  const stagePath = stageDirectory(directory, stage)
  const output = path.join(stagePath, 'results.json')
  const [tasks, template, blindResults, outputExists] = await Promise.all([
    readJson<GuidedComparisonTaskCollection>(path.join(stagePath, 'tasks.json')),
    readJson<GuidedComparisonTemplate>(path.join(stagePath, 'results.template.json')),
    readJson<GuidedBlindResultCollection>(path.join(stagePath, 'blind-results.json')),
    fileExists(output),
  ])
  const pairs = await loadReviewPacketPairsByKey(workspace, new Set(tasks.tasks.map(task => task.pairKey)))
  validateComparisonBindings(tasks, template, blindResults, pairs)
  const pairByKey = new Map(pairs.map(pair => [pair.pairKey, pair]))
  return {
    session: {
      mode: 'comparison',
      stage,
      assignmentId: template.results[0].assignmentId,
      tasks: tasks.tasks.map(task => ({
        ...task,
        evidence: pairByKey.get(task.pairKey)!.evidence,
      })),
      outputExists,
    },
    tasks,
    template,
    blindResults,
    pairs,
    output,
  }
}

export const saveGuidedComparisonReview = async (
  reviewDirectory: string,
  stage: GuidedComparisonStage,
  workspacePath: string,
  responses: GuidedComparisonResponse[]
): Promise<string> => {
  const loaded = await loadGuidedComparisonReview(reviewDirectory, stage, workspacePath)
  const collection = buildGuidedComparisonResultCollection(
    loaded.tasks,
    loaded.template,
    loaded.blindResults,
    loaded.pairs,
    responses
  )
  await writeCreateOnlyFile(loaded.output, stableJson(collection))
  return loaded.output
}
