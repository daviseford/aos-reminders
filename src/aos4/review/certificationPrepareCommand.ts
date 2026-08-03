import { copyFile, link, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArtifactManifest } from '../data'
import { stableCompactJson, stableJson } from '../generate/serialization'
import { assertAgentBlindDerivations } from './adversarialReview'
import {
  calibrationEvidenceIssues,
  certificationChronologyIssues,
  checksumCertificationText,
  createCalibrationEvidenceReceipt,
  createCertificationManifest,
  evaluateCertification,
  reviewLedgerWithResults,
  type ReviewProtocolDefinition,
  type ReviewRubricDefinition,
  type SourceInventory,
} from './certification'
import { validateReviewLedger } from './findings'
import { loadCertificationReviewerResults } from './certificationEvidence'
import { assertReviewIndexMatchesPacketPairs, type ReviewPacketSafeIndex } from './packets'
import {
  assertCreateOnlyDirectoryComplete,
  loadReviewPacketPairs,
  loadReviewPacketPairsByKey,
  writeCreateOnlyDirectory,
  writeCreateOnlyFilesDirectory,
} from './reviewWorkspace'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_PROMPT_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  reviewerConfigurationId,
  type CertificationInput,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewCampaignExecution,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'
import {
  certificationExecutionProjection,
  createCertificationReuseIndex,
  createIncrementalCertificationReuseIndex,
  createReviewCampaignExecution,
  reviewerResultsFromReuseIndex,
  reviewCampaignExecutionIssues,
  loadReusableCertificationEvidence,
  type LoadedReusableCertificationEvidence,
} from './reviewReuse'

const DEFAULT_INDEX = path.join('.cache', 'aos4', 'review', 'workspace', 'index.json')
const DEFAULT_WORKSPACE = path.join('.cache', 'aos4', 'review', 'workspace', 'workspace.json')
const DEFAULT_REVIEW_OUTPUT = path.join('.cache', 'aos4', 'review', 'adversarial-review')
const DEFAULT_INVENTORY = path.join('.cache', 'aos4', 'review', 'source-inventory.json')

const EXISTING_INPUTS = {
  'accepted-manifest': path.join('data', 'aos4', 'manifests', 'accepted-2026-08-02.json'),
  'corpus-review': path.join('data', 'aos4', 'reviews', 'corpus-2026-08-02c.json'),
  'audit-catalog': path.join('data', 'aos4', 'catalog', 'catalog.json'),
  'reconciliation-report': path.join('data', 'aos4', 'reports', 'corpus-2026-08-02c-reconciliation.json'),
  'official-ledger': path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json'),
  'runtime-catalog': path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json'),
  'source-observation-classifications': path.join(
    'data',
    'aos4',
    'reviews',
    'source-observation-classifications-2026-07-29.json'
  ),
} as const

const GENERATED_INPUT_FILES = {
  'review-protocol': 'protocol.json',
  'review-rubric': 'rubric.json',
  'review-index': 'review-index.json',
  'review-assignments': 'assignments.json',
  'review-calibrations': 'calibrations.json',
  'review-calibration-results': 'calibration-results.json',
  'review-results': 'results.json',
  'review-findings': 'findings.json',
  'review-resolutions': 'resolutions.json',
  'review-verifications': 'verifications.json',
  'review-execution': 'execution.json',
  'review-reuse-index': 'reuse-index.json',
  'source-inventory': 'source-inventory.json',
} as const

const CERTIFICATION_SHARD_SIZE = 5_000
const MAX_INCREMENTAL_OVERLAY_DEPTH = 3

export const shouldCompactCertificationOverlay = (sourceDepth: number): boolean =>
  sourceDepth >= MAX_INCREMENTAL_OVERLAY_DEPTH

export const canReuseCertificationShards = (input: {
  hasReuseIndex: boolean
  freshPairs: number
  sourceReviewIndexChecksum?: string
  currentReviewIndexChecksum: string
  sourceInventoryChecksum?: string
  currentInventoryChecksum: string
  sourceAcceptedManifestChecksum?: string
  currentAcceptedManifestChecksum: string
}): boolean =>
  input.hasReuseIndex &&
  input.freshPairs === 0 &&
  input.sourceReviewIndexChecksum === input.currentReviewIndexChecksum &&
  input.sourceInventoryChecksum === input.currentInventoryChecksum &&
  input.sourceAcceptedManifestChecksum === input.currentAcceptedManifestChecksum

interface CertificationPreparationArguments {
  output: string
  reviewOutput: string
  inventory: string
  index: string
  workspace: string
  evaluatedAt: string
}

interface AdversarialResultIndex {
  schemaVersion: 1
  revision: string
  reviewer: ReviewerMetadata
  assignmentId?: ReviewAssignment['id']
  assignmentIds?: ReviewAssignment['id'][]
  assignmentsPath?: string
  calibrationsPath?: string
  calibrationResultPath: string
  calibrationResultCount: number
  calibrationResultsChecksum: string
  executionPath?: string
  executionChecksum?: string
  reuseSource?: {
    directory: string
    manifestChecksum: string
  }
  resultShards: Array<{
    path: string
    resultCount: number
    findingCount: number
  }>
  outcomeCounts: Record<ReviewerResult['outcome'], number>
}

interface ReviewerResultShard {
  schemaVersion: 1
  revision: string
  results: ReviewerResult[]
}

interface ShardedReviewIndex {
  schemaVersion: 1
  kind: 'review-index-shards'
  revision: string
  protocolVersion: string
  rubricVersion: string
  coverage: ReviewPacketSafeIndex['coverage']
  shards: Array<{ inputName: string; entries: number }>
}

interface ShardedReviewResults {
  schemaVersion: 1
  kind: 'review-result-shards'
  revision: string
  shards: Array<{ inputName: string; results: number }>
}

interface OverlayReviewResults {
  schemaVersion: 1
  kind: 'review-result-overlay'
  revision: string
  reuseSource: { directory: string; manifestChecksum: string }
  reusedPacketIds: string[]
  reusedResults: number
  shards: Array<{ inputName: string; results: number }>
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseCertificationPreparationArguments = (
  values: string[]
): CertificationPreparationArguments => {
  const parsed: CertificationPreparationArguments = {
    output: '',
    reviewOutput: DEFAULT_REVIEW_OUTPUT,
    inventory: DEFAULT_INVENTORY,
    index: DEFAULT_INDEX,
    workspace: DEFAULT_WORKSPACE,
    evaluatedAt: '',
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (
      value === '--output' ||
      value === '--review-output' ||
      value === '--inventory' ||
      value === '--index' ||
      value === '--workspace' ||
      value === '--evaluated-at'
    ) {
      const next = nextValue(values, index, value)
      if (value === '--output') parsed.output = next
      else if (value === '--review-output') parsed.reviewOutput = next
      else if (value === '--inventory') parsed.inventory = next
      else if (value === '--index') parsed.index = next
      else if (value === '--workspace') parsed.workspace = next
      else parsed.evaluatedAt = next
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!parsed.output) throw new Error('--output requires a repository-relative directory')
  if (
    !parsed.evaluatedAt ||
    Number.isNaN(new Date(parsed.evaluatedAt).valueOf()) ||
    new Date(parsed.evaluatedAt).toISOString() !== parsed.evaluatedAt
  ) {
    throw new Error('--evaluated-at requires a canonical ISO timestamp')
  }
  return parsed
}

const withinDirectory = (directory: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Review result shard path must be relative: ${relativePath}`)
  }
  const resolved = path.resolve(directory, relativePath)
  if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`Review result shard path escapes its directory: ${relativePath}`)
  }
  return resolved
}

const withinRepository = (repoRoot: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Certification path must be repository-relative: ${relativePath}`)
  }
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification path escapes the repository: ${relativePath}`)
  }
  return resolved
}

const repositoryPath = (repoRoot: string, absolutePath: string): string => {
  const relative = path.relative(repoRoot, absolutePath)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Certification input is outside the repository: ${absolutePath}`)
  }
  return relative.replaceAll(path.sep, '/')
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const collectionCounts = (results: ReviewerResult[]) =>
  results.reduce<Record<ReviewerResult['outcome'], number>>(
    (counts, result) => {
      counts[result.outcome] += 1
      return counts
    },
    { pass: 0, finding: 0, 'cannot-verify': 0 }
  )

const sameJson = (left: unknown, right: unknown): boolean =>
  stableCompactJson(left) === stableCompactJson(right)

const loadAdversarialLedger = async (
  reviewOutput: string,
  revision: string
): Promise<{
  ledger: ReviewLedger
  calibrationResults: ReviewerResult[]
  execution?: ReviewCampaignExecution
  reuseSource?: LoadedReusableCertificationEvidence
}> => {
  await assertCreateOnlyDirectoryComplete(reviewOutput)
  const [resultIndex, persistedFindings] = await Promise.all([
    readJson<AdversarialResultIndex>(path.join(reviewOutput, 'results-index.json')),
    readJson<ReviewFinding[]>(path.join(reviewOutput, 'findings.json')),
  ])
  if (resultIndex.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION || resultIndex.revision !== revision) {
    throw new Error('Adversarial review output does not match the prepared review index')
  }
  const multiAssignment = Boolean(
    resultIndex.assignmentsPath && resultIndex.calibrationsPath && resultIndex.assignmentIds
  )
  const [assignments, calibrations, execution] = multiAssignment
    ? await Promise.all([
        readJson<ReviewAssignment[]>(withinDirectory(reviewOutput, resultIndex.assignmentsPath!)),
        readJson<ReviewCalibration[]>(withinDirectory(reviewOutput, resultIndex.calibrationsPath!)),
        resultIndex.executionPath
          ? readJson<ReviewCampaignExecution>(withinDirectory(reviewOutput, resultIndex.executionPath))
          : Promise.resolve(undefined),
      ])
    : await Promise.all([
        readJson<ReviewAssignment>(path.join(reviewOutput, 'assignment.json')).then(value => [value]),
        readJson<ReviewCalibration>(path.join(reviewOutput, 'calibration.json')).then(value => [value]),
        Promise.resolve(undefined),
      ])
  const assignmentIds = assignments.map(value => value.id).sort()
  const indexedAssignmentIds = (resultIndex.assignmentIds ?? [resultIndex.assignmentId!]).sort()
  if (stableCompactJson(assignmentIds) !== stableCompactJson(indexedAssignmentIds)) {
    throw new Error('Adversarial review assignments do not match their result index')
  }
  if (
    execution &&
    (!resultIndex.executionChecksum || checksumReviewRecord(execution) !== resultIndex.executionChecksum)
  ) {
    throw new Error('Adversarial review execution does not match its result index')
  }

  const calibrationResults = await readJson<ReviewerResult[]>(
    withinDirectory(reviewOutput, resultIndex.calibrationResultPath)
  )
  if (
    calibrationResults.length !== resultIndex.calibrationResultCount ||
    checksumReviewRecord(calibrationResults) !== resultIndex.calibrationResultsChecksum
  ) {
    throw new Error('Adversarial calibration results do not match their result index')
  }
  const results: ReviewerResult[] = []
  let reuseSource: LoadedReusableCertificationEvidence | undefined
  let syntheticReuseOnly = false
  let skipResultSort = false
  if (resultIndex.reuseSource) {
    if (
      !execution?.reuseSource ||
      stableCompactJson(resultIndex.reuseSource) !== stableCompactJson(execution.reuseSource)
    ) {
      throw new Error('Adversarial reuse source does not match its execution record')
    }
    const reused = await loadReusableCertificationEvidence(
      withinRepository(path.resolve('.'), resultIndex.reuseSource.directory)
    )
    reuseSource = reused
    if (checksumReviewRecord(reused.manifest) !== resultIndex.reuseSource.manifestChecksum) {
      throw new Error('Adversarial reuse source manifest checksum has changed')
    }
    const reusedPairKeys = new Set(execution.pairSets.reused)
    const reusedPacketIds = new Set(
      (reused.reuseIndex?.entries ?? reused.index.entries)
        .filter(entry => reusedPairKeys.has(entry.pairKey))
        .flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId])
    )
    const sourceResults = reused.reuseIndex
      ? reviewerResultsFromReuseIndex(reused.reuseIndex, reusedPairKeys)
      : reused.results
    syntheticReuseOnly = Boolean(reused.reuseIndex && resultIndex.resultShards.length === 0)
    skipResultSort = Boolean(reused.reuseIndex)
    results.push(...sourceResults.filter(result => reusedPacketIds.has(result.packetId)))
  }
  for (const reference of resultIndex.resultShards) {
    const shard = await readJson<ReviewerResultShard>(withinDirectory(reviewOutput, reference.path))
    const findingCount = shard.results.reduce((total, result) => total + result.findings.length, 0)
    if (
      shard.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
      shard.revision !== revision ||
      shard.results.length !== reference.resultCount ||
      findingCount !== reference.findingCount
    ) {
      throw new Error(`Adversarial result shard is invalid: ${reference.path}`)
    }
    results.push(...shard.results)
  }
  if (!skipResultSort) {
    results.sort(
      (left, right) =>
        left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
    )
  }
  const countsMatch = syntheticReuseOnly
    ? resultIndex.outcomeCounts.pass === results.length &&
      resultIndex.outcomeCounts.finding === 0 &&
      resultIndex.outcomeCounts['cannot-verify'] === 0
    : sameJson(collectionCounts(results), resultIndex.outcomeCounts)
  if (!countsMatch) throw new Error('Adversarial review outcome counts do not match its result shards')
  const findings = syntheticReuseOnly
    ? []
    : results.flatMap(result => result.findings).sort((left, right) => left.id.localeCompare(right.id))
  if (!sameJson(findings, persistedFindings)) {
    throw new Error('Adversarial review findings do not match its result shards')
  }
  return {
    ledger: {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      assignments,
      calibrations,
      results,
      findings,
      resolutions: [],
      verifications: [],
    },
    calibrationResults,
    execution,
    ...(reuseSource ? { reuseSource } : {}),
  }
}

interface InterpretationShape {
  arrays: number
  booleans: number
  nulls: number
  numbers: number
  objects: number
  strings: number
  fieldPaths: string[]
}

const interpretationShape = (value: unknown): InterpretationShape => {
  const shape: InterpretationShape = {
    arrays: 0,
    booleans: 0,
    nulls: 0,
    numbers: 0,
    objects: 0,
    strings: 0,
    fieldPaths: [],
  }
  const visit = (child: unknown, parentPath: string): void => {
    if (child === null) {
      shape.nulls += 1
    } else if (Array.isArray(child)) {
      shape.arrays += 1
      child.forEach(value_ => visit(value_, `${parentPath}[]`))
    } else if (typeof child === 'object') {
      shape.objects += 1
      Object.entries(child)
        .sort(([left], [right]) => left.localeCompare(right))
        .forEach(([key, value_]) => {
          const childPath = parentPath ? `${parentPath}.${key}` : key
          shape.fieldPaths.push(childPath)
          visit(value_, childPath)
        })
    } else if (typeof child === 'string') {
      shape.strings += 1
    } else if (typeof child === 'number') {
      shape.numbers += 1
    } else if (typeof child === 'boolean') {
      shape.booleans += 1
    }
  }
  visit(value, '')
  shape.fieldPaths = Array.from(new Set(shape.fieldPaths)).sort()
  return shape
}

export const sourceSafeReviewerResults = (results: ReviewerResult[]): ReviewerResult[] =>
  results.map(result =>
    result.blindExpectedInterpretation === undefined
      ? result
      : typeof result.blindExpectedInterpretation === 'object' &&
          result.blindExpectedInterpretation !== null &&
          'interpretationChecksum' in result.blindExpectedInterpretation &&
          'shape' in result.blindExpectedInterpretation
        ? result
        : {
            ...result,
            blindExpectedInterpretation: {
              interpretationChecksum: checksumReviewRecord(result.blindExpectedInterpretation),
              shape: interpretationShape(result.blindExpectedInterpretation),
            },
          }
  )

export const sourceSafeReviewLedger = (ledger: ReviewLedger): ReviewLedger => ({
  ...ledger,
  results: sourceSafeReviewerResults(ledger.results),
})

const protocolDefinition = (): ReviewProtocolDefinition => ({
  schemaVersion: 1,
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  promptVersion: AOS4_REVIEW_PROMPT_VERSION,
  evidenceHandling: 'untrusted-source-data',
  blindInterpretationRequired: true,
})

const rubricDefinition = (): ReviewRubricDefinition => ({
  schemaVersion: 1,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  allowedOutcomes: ['pass', 'finding', 'cannot-verify'],
  materialSeverities: ['blocker', 'major'],
  acceptedLimitationPolicy:
    'No automated finding or cannot-verify outcome may remain in a passing beta certification; correct the pipeline or auditor and rerun.',
})

const textInput = (name: string, filePath: string, content: string): CertificationInput => ({
  name,
  path: filePath,
  checksum: checksumCertificationText(content),
})

const chunked = <T>(values: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }
  return chunks
}

const shardedCertificationFiles = (
  index: ReviewPacketSafeIndex,
  results: ReviewerResult[]
): {
  indexManifest: ShardedReviewIndex | ReviewPacketSafeIndex
  resultManifest: ShardedReviewResults | OverlayReviewResults
  files: Map<string, string>
  inputs: Array<{ name: string; fileName: string; checksum?: string }>
  linkedFiles?: Map<string, string>
} => {
  const files = new Map<string, string>()
  const inputs: Array<{ name: string; fileName: string }> = []
  const indexShards = chunked(index.entries, CERTIFICATION_SHARD_SIZE).map((entries, shardIndex) => {
    const suffix = String(shardIndex + 1).padStart(4, '0')
    const name = `review-index-shard-${suffix}`
    const fileName = `${name}.json`
    files.set(fileName, stableCompactJson(entries))
    inputs.push({ name, fileName })
    return { inputName: name, entries: entries.length }
  })
  const resultShards = chunked(results, CERTIFICATION_SHARD_SIZE).map((values, shardIndex) => {
    const suffix = String(shardIndex + 1).padStart(4, '0')
    const name = `review-results-shard-${suffix}`
    const fileName = `${name}.json`
    files.set(fileName, stableCompactJson(values))
    inputs.push({ name, fileName })
    return { inputName: name, results: values.length }
  })
  return {
    indexManifest: {
      schemaVersion: 1,
      kind: 'review-index-shards',
      revision: index.revision,
      protocolVersion: index.protocolVersion,
      rubricVersion: index.rubricVersion,
      coverage: index.coverage,
      shards: indexShards,
    },
    resultManifest: {
      schemaVersion: 1,
      kind: 'review-result-shards',
      revision: index.revision,
      shards: resultShards,
    },
    files,
    inputs,
  }
}

const reusableShardedCertificationFiles = async (
  source: LoadedReusableCertificationEvidence,
  repoRoot: string
): Promise<ReturnType<typeof shardedCertificationFiles>> => {
  const bindings = source.manifest.inputs.filter(
    input => input.name.startsWith('review-index-shard-') || input.name.startsWith('review-results-shard-')
  )
  const inputByName = new Map(source.manifest.inputs.map(input => [input.name, input]))
  const indexBinding = inputByName.get('review-index')
  const resultBinding = inputByName.get('review-results')
  if (!indexBinding || !resultBinding) {
    throw new Error('Certification reuse source is missing sharded review evidence')
  }
  const [indexText, resultText] = await Promise.all([
    readFile(withinRepository(repoRoot, indexBinding.path), 'utf8'),
    readFile(withinRepository(repoRoot, resultBinding.path), 'utf8'),
  ])
  if (
    checksumCertificationText(indexText) !== indexBinding.checksum ||
    checksumCertificationText(resultText) !== resultBinding.checksum
  ) {
    throw new Error('Certification reuse source shard manifest checksum mismatch')
  }
  const linkedFiles = new Map<string, string>()
  const inputs = bindings.map(binding => {
    const fileName = path.basename(binding.path)
    linkedFiles.set(fileName, withinRepository(repoRoot, binding.path))
    return { name: binding.name, fileName, checksum: binding.checksum }
  })
  return {
    indexManifest: JSON.parse(indexText) as ShardedReviewIndex | ReviewPacketSafeIndex,
    resultManifest: JSON.parse(resultText) as ShardedReviewResults | OverlayReviewResults,
    files: new Map(),
    inputs,
    linkedFiles,
  }
}

const incrementalShardedCertificationFiles = (
  index: ReviewPacketSafeIndex,
  results: ReviewerResult[],
  execution: ReviewCampaignExecution,
  source: LoadedReusableCertificationEvidence
): ReturnType<typeof shardedCertificationFiles> => {
  if (!execution.reuseSource || !source.reuseIndex) {
    throw new Error('Incremental certification is missing its compact reuse source')
  }
  const freshPairKeys = new Set(execution.pairSets.fresh)
  const freshPacketIds = new Set(
    index.entries
      .filter(entry => freshPairKeys.has(entry.pairKey))
      .flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId])
  )
  const freshResults = results.filter(result => freshPacketIds.has(result.packetId))
  if (freshResults.length !== execution.pairSets.fresh.length * 2) {
    throw new Error('Incremental certification fresh result population is incomplete')
  }
  const files = new Map<string, string>()
  const inputs: Array<{ name: string; fileName: string }> = []
  const freshShards = chunked(freshResults, CERTIFICATION_SHARD_SIZE).map((values, shardIndex) => {
    const suffix = String(shardIndex + 1).padStart(4, '0')
    const name = `review-results-shard-${suffix}`
    const fileName = `${name}.json`
    files.set(fileName, stableCompactJson(values))
    inputs.push({ name, fileName })
    return { inputName: name, results: values.length }
  })
  const reusedPairKeys = new Set(execution.pairSets.reused)
  const reusedPacketIds = source.reuseIndex.entries
    .filter(entry => reusedPairKeys.has(entry.pairKey))
    .flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId])
    .sort()
  if (reusedPacketIds.length !== execution.pairSets.reused.length * 2) {
    throw new Error('Incremental certification reused result population is incomplete')
  }
  return {
    indexManifest: index,
    resultManifest: {
      schemaVersion: 1,
      kind: 'review-result-overlay',
      revision: index.revision,
      reuseSource: execution.reuseSource,
      reusedPacketIds,
      reusedResults: reusedPacketIds.length,
      shards: freshShards,
    },
    files,
    inputs,
    linkedFiles: new Map(),
  }
}

const compactedCertificationResults = async (
  index: ReviewPacketSafeIndex,
  ledger: ReviewLedger,
  execution: ReviewCampaignExecution,
  source: LoadedReusableCertificationEvidence,
  repoRoot: string
): Promise<ReviewerResult[]> => {
  if (!source.reuseIndex) throw new Error('Certification compaction requires a compact reuse source')
  const reusedPairKeys = new Set(execution.pairSets.reused)
  const expectedReusedAssignmentByPacket = new Map<string, string>()
  source.reuseIndex.entries
    .filter(entry => reusedPairKeys.has(entry.pairKey))
    .forEach(entry => {
      expectedReusedAssignmentByPacket.set(entry.blindPacketId, entry.assignmentId)
      expectedReusedAssignmentByPacket.set(entry.comparisonPacketId, entry.assignmentId)
    })
  if (expectedReusedAssignmentByPacket.size !== execution.pairSets.reused.length * 2) {
    throw new Error('Certification compaction reuse population is incomplete')
  }
  const reusedResults = (await loadCertificationReviewerResults(source.directory, repoRoot)).filter(
    result => expectedReusedAssignmentByPacket.get(result.packetId) === result.assignmentId
  )
  if (reusedResults.length !== expectedReusedAssignmentByPacket.size) {
    throw new Error('Certification compaction result evidence is incomplete')
  }
  const freshPairKeys = new Set(execution.pairSets.fresh)
  const freshPacketIds = new Set(
    index.entries
      .filter(entry => freshPairKeys.has(entry.pairKey))
      .flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId])
  )
  const freshResults = ledger.results.filter(result => freshPacketIds.has(result.packetId))
  if (freshResults.length !== execution.pairSets.fresh.length * 2) {
    throw new Error('Certification compaction fresh result evidence is incomplete')
  }
  return [...reusedResults, ...freshResults].sort(
    (left, right) =>
      left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
  )
}

export const runCertificationPreparation = async (
  arguments_: CertificationPreparationArguments,
  repoRoot = process.cwd()
) => {
  const resolvedRoot = path.resolve(repoRoot)
  const output = withinRepository(resolvedRoot, arguments_.output)
  const reviewOutput = withinRepository(resolvedRoot, arguments_.reviewOutput)
  const indexPath = withinRepository(resolvedRoot, arguments_.index)
  const workspacePath = withinRepository(resolvedRoot, arguments_.workspace)
  const inventoryPath = withinRepository(resolvedRoot, arguments_.inventory)

  const [indexText, inventory, acceptedManifestText] = await Promise.all([
    readFile(indexPath, 'utf8'),
    readJson<SourceInventory>(inventoryPath),
    readFile(withinRepository(resolvedRoot, EXISTING_INPUTS['accepted-manifest']), 'utf8'),
  ])
  const acceptedManifest = JSON.parse(acceptedManifestText) as ArtifactManifest
  const index = JSON.parse(indexText) as ReviewPacketSafeIndex
  if (
    index.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
    index.protocolVersion !== AOS4_REVIEW_PROTOCOL_VERSION ||
    index.rubricVersion !== AOS4_REVIEW_RUBRIC_VERSION ||
    inventory.revision !== index.revision
  ) {
    throw new Error('Review index, source inventory, protocol, rubric, or revision do not match')
  }
  const loadedReview = await loadAdversarialLedger(reviewOutput, index.revision)
  const calibrationResults = sourceSafeReviewerResults(loadedReview.calibrationResults)
  const reviewLedger = sourceSafeReviewLedger({
    ...loadedReview.ledger,
    calibrations: loadedReview.ledger.calibrations.map(calibration => {
      const assignments = calibration.evidence
        ? loadedReview.ledger.assignments.filter(value => value.id === calibration.evidence?.assignmentId)
        : loadedReview.ledger.assignments.filter(
            value =>
              reviewerConfigurationId(value.reviewer) === calibration.reviewerConfigurationId &&
              calibrationResults.some(result => result.assignmentId === value.id)
          )
      if (assignments.length !== 1) {
        throw new Error('Calibration has no matching adversarial reviewer assignment')
      }
      return {
        ...calibration,
        evidence: createCalibrationEvidenceReceipt(
          assignments[0].id,
          index,
          calibrationResults.filter(result => result.assignmentId === assignments[0].id)
        ),
      }
    }),
  })
  const execution =
    loadedReview.execution ??
    createReviewCampaignExecution({
      revision: index.revision,
      campaignAt: reviewLedger.assignments[0].assignedAt,
      reviewer: reviewLedger.assignments[0].reviewer,
      reusedPairKeys: [],
      freshPairKeys: index.entries
        .filter(entry => entry.countsTowardCoverage && !entry.calibration)
        .map(entry => entry.pairKey),
      freshAssignmentId: reviewLedger.assignments[0].id,
      contributingAssignmentIds: reviewLedger.assignments.map(value => value.id),
    })
  const validationPairKeys =
    execution.mode === 'incremental'
      ? new Set([
          ...execution.pairSets.fresh,
          ...index.entries.filter(entry => entry.calibration).map(entry => entry.pairKey),
        ])
      : undefined
  const pairs = validationPairKeys
    ? await loadReviewPacketPairsByKey(
        workspacePath,
        validationPairKeys,
        index.entries.map(entry => entry.pairKey)
      )
    : await loadReviewPacketPairs(workspacePath)
  const validationIndex = validationPairKeys
    ? { ...index, entries: index.entries.filter(entry => validationPairKeys.has(entry.pairKey)) }
    : index
  assertReviewIndexMatchesPacketPairs(validationIndex, pairs)
  const packets = pairs.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
  const validationLedger = reviewLedgerWithResults(reviewLedger, calibrationResults)
  const ledgerIssues = validateReviewLedger(validationLedger)
  if (!ledgerIssues.length && validationPairKeys) {
    const packetIds = new Set(packets.map(packet => packet.id))
    ledgerIssues.push(
      ...validateReviewLedger(
        {
          ...validationLedger,
          results: validationLedger.results.filter(result => packetIds.has(result.packetId)),
        },
        packets
      )
    )
  } else if (!ledgerIssues.length) {
    ledgerIssues.push(...validateReviewLedger(validationLedger, packets))
  }
  if (ledgerIssues.length) {
    throw new Error(
      `Adversarial review ledger is invalid: ${ledgerIssues[0].code} ` +
        `${ledgerIssues[0].path}: ${ledgerIssues[0].message}`
    )
  }
  const calibrationIssues = calibrationEvidenceIssues(index, reviewLedger, calibrationResults)
  if (calibrationIssues.length) {
    throw new Error(
      `Adversarial calibration evidence is invalid: ${calibrationIssues[0].code} ` +
        `${calibrationIssues[0].path}: ${calibrationIssues[0].message}`
    )
  }
  const executionIssues = reviewCampaignExecutionIssues(
    execution,
    index,
    reviewLedger.assignments,
    reviewLedger.results
  )
  if (executionIssues.length) {
    throw new Error(`Adversarial review execution is invalid: ${executionIssues[0]}`)
  }
  const chronologyIssues = certificationChronologyIssues(
    arguments_.evaluatedAt,
    reviewLedger,
    calibrationResults,
    inventory.observedAt
  )
  if (chronologyIssues.length) {
    throw new Error(
      `Certification timestamp is invalid: ${chronologyIssues[0].code} ` +
        `${chronologyIssues[0].path}: ${chronologyIssues[0].message}`
    )
  }
  assertAgentBlindDerivations(validationLedger, pairs)
  const ledger = reviewLedger

  const protocol = protocolDefinition()
  const rubric = rubricDefinition()
  const reviewIndexChecksum = checksumCertificationText(indexText)
  const sourceReuseIndex = loadedReview.reuseSource?.reuseIndex
  const sourceInventoryBinding = loadedReview.reuseSource?.manifest.inputs.find(
    input => input.name === 'source-inventory'
  )
  const sourceAcceptedManifestBinding = loadedReview.reuseSource?.manifest.inputs.find(
    input => input.name === 'accepted-manifest'
  )
  const currentInventoryChecksum = checksumCertificationText(stableJson(inventory))
  const canReuseShards = canReuseCertificationShards({
    hasReuseIndex: Boolean(sourceReuseIndex),
    freshPairs: execution.pairSets.fresh.length,
    sourceReviewIndexChecksum: sourceReuseIndex?.reviewIndexChecksum,
    currentReviewIndexChecksum: reviewIndexChecksum,
    sourceInventoryChecksum: sourceInventoryBinding?.checksum,
    currentInventoryChecksum,
    sourceAcceptedManifestChecksum: sourceAcceptedManifestBinding?.checksum,
    currentAcceptedManifestChecksum: checksumCertificationText(acceptedManifestText),
  })
  const evaluation = canReuseShards
    ? {
        ok: true,
        status: 'pass' as const,
        issues: [],
        summary: sourceReuseIndex!.summary,
      }
    : evaluateCertification(
        {
          index,
          ledger,
          inventory,
          acceptedArtifactChecksums: acceptedManifest.artifacts.map(artifact => artifact.checksum),
        },
        {
          prevalidatedPassingLedger: Boolean(sourceReuseIndex),
        }
      )
  if (!evaluation.ok) {
    throw new Error(
      `Certification preparation found a blocker: ${evaluation.issues[0].code} ` +
        `${evaluation.issues[0].path}: ${evaluation.issues[0].message}`
    )
  }
  const usesIncrementalOverlay = Boolean(
    !canReuseShards && loadedReview.reuseSource?.reuseIndex && execution.pairSets.reused.length > 0
  )
  const compactsIncrementalOverlay = Boolean(
    usesIncrementalOverlay &&
      loadedReview.reuseSource &&
      shouldCompactCertificationOverlay(loadedReview.reuseSource.overlayDepth)
  )
  const certificationLedger = compactsIncrementalOverlay
    ? {
        ...ledger,
        results: await compactedCertificationResults(
          index,
          ledger,
          execution,
          loadedReview.reuseSource!,
          resolvedRoot
        ),
      }
    : ledger
  const reuseIndex = canReuseShards
    ? sourceReuseIndex!
    : usesIncrementalOverlay && !compactsIncrementalOverlay
      ? createIncrementalCertificationReuseIndex(
          index,
          ledger,
          calibrationResults,
          evaluation.summary,
          reviewIndexChecksum,
          execution
        )
      : createCertificationReuseIndex(
          index,
          certificationLedger,
          calibrationResults,
          evaluation.summary,
          reviewIndexChecksum
        )
  const sharded = canReuseShards
    ? await reusableShardedCertificationFiles(loadedReview.reuseSource!, resolvedRoot)
    : usesIncrementalOverlay && !compactsIncrementalOverlay
      ? incrementalShardedCertificationFiles(index, ledger.results, execution, loadedReview.reuseSource!)
      : shardedCertificationFiles(index, certificationLedger.results)
  const sourceReuseIndexBinding = canReuseShards
    ? loadedReview.reuseSource!.manifest.inputs.find(input => input.name === 'review-reuse-index')
    : undefined
  const sourceReviewIndexBinding = canReuseShards
    ? loadedReview.reuseSource!.manifest.inputs.find(input => input.name === 'review-index')
    : undefined
  if (canReuseShards && (!sourceReuseIndexBinding || !sourceReviewIndexBinding)) {
    throw new Error('Certification reuse source is missing its reusable index bindings')
  }
  const generatedValues = {
    'review-protocol': protocol,
    'review-rubric': rubric,
    'review-index': sharded.indexManifest,
    'review-assignments': ledger.assignments,
    'review-calibrations': ledger.calibrations,
    'review-calibration-results': calibrationResults,
    'review-results': sharded.resultManifest,
    'review-findings': ledger.findings,
    'review-resolutions': ledger.resolutions,
    'review-verifications': ledger.verifications,
    'review-execution': execution,
    'review-reuse-index': reuseIndex,
    'source-inventory': inventory,
  } as const
  const outputRelative = repositoryPath(resolvedRoot, output)
  const generatedTexts = new Map<string, string>([
    ...Array.from(sharded.files),
    ...Object.entries(generatedValues).map(
      ([name, value]) =>
        [GENERATED_INPUT_FILES[name as keyof typeof GENERATED_INPUT_FILES], stableJson(value)] as [
          string,
          string,
        ]
    ),
  ])
  if (sourceReuseIndexBinding && sharded.linkedFiles) {
    generatedTexts.delete(GENERATED_INPUT_FILES['review-reuse-index'])
    sharded.linkedFiles.set(
      GENERATED_INPUT_FILES['review-reuse-index'],
      withinRepository(resolvedRoot, sourceReuseIndexBinding.path)
    )
  }
  if (sourceReviewIndexBinding && sharded.linkedFiles) {
    generatedTexts.delete(GENERATED_INPUT_FILES['review-index'])
    sharded.linkedFiles.set(
      GENERATED_INPUT_FILES['review-index'],
      withinRepository(resolvedRoot, sourceReviewIndexBinding.path)
    )
  }
  let linkedReviewIndexChecksum: string | undefined
  if (usesIncrementalOverlay && sharded.linkedFiles) {
    linkedReviewIndexChecksum = reviewIndexChecksum
    generatedTexts.delete(GENERATED_INPUT_FILES['review-index'])
    sharded.linkedFiles.set(GENERATED_INPUT_FILES['review-index'], indexPath)
  }
  const generatedInputs = Object.entries(GENERATED_INPUT_FILES).map(([name, fileName]) =>
    name === 'review-reuse-index' && sourceReuseIndexBinding
      ? {
          name,
          path: `${outputRelative}/${fileName}`,
          checksum: sourceReuseIndexBinding.checksum,
        }
      : name === 'review-index' && linkedReviewIndexChecksum
        ? {
            name,
            path: `${outputRelative}/${fileName}`,
            checksum: linkedReviewIndexChecksum,
          }
        : name === 'review-index' && sourceReviewIndexBinding
          ? {
              name,
              path: `${outputRelative}/${fileName}`,
              checksum: sourceReviewIndexBinding.checksum,
            }
          : textInput(name, `${outputRelative}/${fileName}`, generatedTexts.get(fileName)!)
  )
  generatedInputs.push(
    ...sharded.inputs.map(({ name, fileName, checksum }) =>
      checksum
        ? { name, path: `${outputRelative}/${fileName}`, checksum }
        : textInput(name, `${outputRelative}/${fileName}`, generatedTexts.get(fileName)!)
    )
  )
  const existingInputs: CertificationInput[] = []
  for (const [name, relativePath] of Object.entries(EXISTING_INPUTS)) {
    const content = await readFile(withinRepository(resolvedRoot, relativePath), 'utf8')
    existingInputs.push(textInput(name, relativePath.replaceAll(path.sep, '/'), content))
  }
  const inputs = [...existingInputs, ...generatedInputs]
  const inventoryInput = generatedInputs.find(input => input.name === 'source-inventory')!
  const manifest = {
    ...createCertificationManifest({
      evaluation,
      inputs,
      ledger: certificationLedger,
      inventory: {
        checksum: inventoryInput.checksum,
        observedAt: inventory.observedAt,
        complete: inventory.complete,
      },
      certifiedAt: arguments_.evaluatedAt,
      protocolVersion: protocol.protocolVersion,
      rubricVersion: rubric.rubricVersion,
    }),
    execution: certificationExecutionProjection(execution),
  }
  generatedTexts.set('manifest.json', stableJson(manifest))
  generatedTexts.set(
    'summary.json',
    stableJson({
      ...evaluation.summary,
      boundChecksums: manifest.inputs,
      execution: manifest.execution,
    })
  )
  if (sharded.linkedFiles) {
    const linkedFiles = sharded.linkedFiles
    await writeCreateOnlyDirectory(output, async staging => {
      await Promise.all([
        ...Array.from(generatedTexts, async ([fileName, content]) => {
          const target = withinDirectory(staging, fileName)
          await mkdir(path.dirname(target), { recursive: true })
          await writeFile(target, content, 'utf8')
        }),
        ...Array.from(linkedFiles, async ([fileName, source]) => {
          const target = withinDirectory(staging, fileName)
          await mkdir(path.dirname(target), { recursive: true })
          await link(source, target).catch(async error => {
            if (!['EXDEV', 'EPERM', 'EACCES'].includes((error as NodeJS.ErrnoException).code ?? '')) {
              throw error
            }
            await copyFile(source, target)
          })
        }),
      ])
    })
  } else {
    await writeCreateOnlyFilesDirectory(output, generatedTexts)
  }
  return { output: outputRelative, manifest, evaluation }
}

const run = async (): Promise<void> => {
  const result = await runCertificationPreparation(
    parseCertificationPreparationArguments(process.argv.slice(2))
  )
  console.log(
    `Prepared AoS 4 certification ${result.manifest.revision} at ${result.output}: ` +
      `${result.evaluation.status}, ${result.evaluation.issues.length} issue(s)`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
