import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import {
  assessAdversarialComparison,
  createAdversarialBlindResult,
  createAdversarialComparisonResult,
} from './adversarialReview'
import {
  calibrationControlOutcomes,
  type CalibrationCaseKind,
  type ReviewPacketBatch,
  type ReviewPacketPair,
} from './packets'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  createReviewAssignment,
  reviewerConfigurationId,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewPacketId,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'
import { assertCreateOnlyDirectoryComplete, writeCreateOnlyDirectory } from './reviewWorkspace'

const REVIEW_CACHE = path.join('.cache', 'aos4', 'review')
const DEFAULT_WORKSPACE = path.join(REVIEW_CACHE, 'workspace')
const DEFAULT_OUTPUT = path.join(REVIEW_CACHE, 'adversarial-review')

interface Arguments {
  workspace: string
  output: string
  reviewerId: string
  campaignAt: string
}

interface PacketShard {
  schemaVersion: 1
  revision: string
  pairs: ReviewPacketPair[]
}

interface WorkspaceManifest {
  schemaVersion: 1
  revision: string
  protocolVersion: string
  rubricVersion: string
  batches: ReviewPacketBatch[]
  shards: Array<{ path: string; checksum: string; pairCount: number }>
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseAdversarialReviewArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    workspace: DEFAULT_WORKSPACE,
    output: DEFAULT_OUTPUT,
    reviewerId: 'aos4-deterministic-adversarial-reviewer-v2',
    campaignAt: '',
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--workspace') {
      parsed.workspace = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.output = nextValue(values, index, value)
      index += 1
    } else if (value === '--reviewer-id') {
      parsed.reviewerId = nextValue(values, index, value)
      index += 1
    } else if (value === '--campaign-at') {
      parsed.campaignAt = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!parsed.campaignAt || Number.isNaN(new Date(parsed.campaignAt).valueOf())) {
    throw new Error('--campaign-at requires an ISO timestamp')
  }
  return parsed
}

const withinReviewCache = (value: string): string => {
  const root = path.resolve(REVIEW_CACHE)
  const resolved = path.resolve(value)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Adversarial review artifacts must remain under ${REVIEW_CACHE}`)
  }
  return resolved
}

const timestamp = (campaignAt: string, sequence: number): string =>
  new Date(new Date(campaignAt).valueOf() + sequence * 1_000).toISOString()

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

export const assertInterspersedCalibrationControls = (
  batches: ReviewPacketBatch[],
  liveBlindPacketIds: ReadonlySet<ReviewPacketId>,
  calibrationBlindPacketIds: ReadonlySet<ReviewPacketId>
): void => {
  if (!batches.length && liveBlindPacketIds.size) {
    throw new Error('Adversarial review workspace has no controlled review batches')
  }
  const batchIds = new Set<string>()
  const batchedLivePacketIds = new Set<ReviewPacketId>()
  batches.forEach(batch => {
    if (batchIds.has(batch.id)) throw new Error(`Duplicate adversarial review batch: ${batch.id}`)
    batchIds.add(batch.id)
    const control = batch.calibrationControlPacketId
    if (!control || !calibrationBlindPacketIds.has(control)) {
      throw new Error(`Adversarial review batch has no valid calibration control: ${batch.id}`)
    }
    if (batch.packetIds.filter(packetId => packetId === control).length !== 1) {
      throw new Error(`Adversarial review batch does not intersperse its control exactly once: ${batch.id}`)
    }
    batch.packetIds
      .filter(packetId => packetId !== control)
      .forEach(packetId => {
        if (!liveBlindPacketIds.has(packetId)) {
          throw new Error(`Adversarial review batch references an unknown live packet: ${batch.id}`)
        }
        if (batchedLivePacketIds.has(packetId)) {
          throw new Error(`Adversarial review live packet appears in multiple batches: ${packetId}`)
        }
        batchedLivePacketIds.add(packetId)
      })
  })
  if (
    batchedLivePacketIds.size !== liveBlindPacketIds.size ||
    Array.from(liveBlindPacketIds).some(packetId => !batchedLivePacketIds.has(packetId))
  ) {
    throw new Error(
      `Adversarial review batches cover ${batchedLivePacketIds.size}/${liveBlindPacketIds.size} live packets`
    )
  }
}

export const assertCalibrationControlOutcomes = (
  kind: CalibrationCaseKind,
  blindOutcome: ReviewerResult['outcome'],
  comparisonOutcome: ReviewerResult['outcome']
): void => {
  const [expectedBlind, expectedComparison] = calibrationControlOutcomes(kind)
  if (blindOutcome !== expectedBlind || comparisonOutcome !== expectedComparison) {
    throw new Error(
      `Adversarial review calibration control ${kind} drifted: ` +
        `${blindOutcome}/${comparisonOutcome}, expected ${expectedBlind}/${expectedComparison}`
    )
  }
}

const calibrationFor = (
  reviewer: ReviewerMetadata,
  pairs: ReviewPacketPair[],
  calibratedAt: string
): ReviewCalibration => {
  const assessmentByPairKey = new Map(
    pairs.map(pair => [pair.pairKey, assessAdversarialComparison({ ...pair, calibrationKind: undefined })])
  )
  const assessment = (pair: ReviewPacketPair) => assessmentByPairKey.get(pair.pairKey)!
  const defects = pairs.filter(pair => pair.calibrationKind === 'defect')
  const insufficient = pairs.filter(pair => pair.calibrationKind === 'insufficient-evidence')
  const foundDefects = defects.filter(pair => assessment(pair).outcome === 'finding').length
  const correctCannotVerify = insufficient.filter(pair => assessment(pair).outcome === 'cannot-verify').length
  const unsupportedExpectedValues = pairs
    .filter(pair => pair.calibrationKind !== 'defect')
    .flatMap(pair => assessment(pair).findings).length
  const passed =
    foundDefects === defects.length &&
    unsupportedExpectedValues === 0 &&
    correctCannotVerify === insufficient.length
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    reviewerConfigurationId: reviewerConfigurationId(reviewer),
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    calibratedAt,
    seededBlockerMajorDefects: defects.length,
    foundSeededBlockerMajorDefects: foundDefects,
    unsupportedExpectedValues,
    insufficientEvidenceCases: insufficient.length,
    correctCannotVerifyCases: correctCannotVerify,
    passed,
  }
}

const run = async (): Promise<void> => {
  const arguments_ = parseAdversarialReviewArguments(process.argv.slice(2))
  const workspace = withinReviewCache(arguments_.workspace)
  const output = withinReviewCache(arguments_.output)

  const manifest = await readJson<WorkspaceManifest>(path.join(workspace, 'workspace.json'))
  await assertCreateOnlyDirectoryComplete(workspace)
  if (
    manifest.schemaVersion !== 1 ||
    manifest.protocolVersion !== AOS4_REVIEW_PROTOCOL_VERSION ||
    manifest.rubricVersion !== AOS4_REVIEW_RUBRIC_VERSION ||
    !Array.isArray(manifest.batches)
  ) {
    throw new Error('Prepared review workspace does not match the current protocol and rubric')
  }
  const reviewer: ReviewerMetadata = {
    id: arguments_.reviewerId,
    kind: 'agent',
    tool: 'aos4-deterministic-evidence-auditor',
    model: 'evidence-auditor/v2',
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    promptVersion: 'aos4-review-prompt/v1',
  }
  const campaignTimes = {
    assigned: timestamp(arguments_.campaignAt, 0),
    calibrationBlind: timestamp(arguments_.campaignAt, 2),
    calibrationComparison: timestamp(arguments_.campaignAt, 3),
    calibrated: timestamp(arguments_.campaignAt, 4),
    liveBlind: timestamp(arguments_.campaignAt, 5),
    liveComparison: timestamp(arguments_.campaignAt, 6),
  }
  const calibrationPairs: ReviewPacketPair[] = []
  const calibrationBlindPacketIds = new Set<ReviewPacketId>()
  const liveBlindPacketIds = new Set<ReviewPacketId>()
  const livePacketIds: ReviewerResult['packetId'][] = []
  let livePairCount = 0
  for (const shard of manifest.shards) {
    const packetShard = await readJson<PacketShard>(path.join(workspace, shard.path))
    packetShard.pairs
      .filter(pair => pair.calibration)
      .forEach(pair => {
        if (calibrationBlindPacketIds.has(pair.blindPacket.id)) {
          throw new Error(`Duplicate calibration blind packet: ${pair.blindPacket.id}`)
        }
        calibrationPairs.push(pair)
        calibrationBlindPacketIds.add(pair.blindPacket.id)
      })
    packetShard.pairs
      .filter(pair => pair.countsTowardCoverage)
      .forEach(pair => {
        if (liveBlindPacketIds.has(pair.blindPacket.id)) {
          throw new Error(`Duplicate live blind packet: ${pair.blindPacket.id}`)
        }
        livePairCount += 1
        liveBlindPacketIds.add(pair.blindPacket.id)
        livePacketIds.push(pair.blindPacket.id, pair.comparisonPacket.id)
      })
  }
  assertInterspersedCalibrationControls(
    manifest.batches,
    liveBlindPacketIds,
    calibrationBlindPacketIds
  )
  const calibrationPacketIds = calibrationPairs.flatMap(pair => [
    pair.blindPacket.id,
    pair.comparisonPacket.id,
  ])
  const assignment = createReviewAssignment({
    packetIds: [...livePacketIds, ...calibrationPacketIds],
    reviewer,
    execution: 'local',
    assignedAt: campaignTimes.assigned,
  })
  const calibrationResults = calibrationPairs.flatMap(pair => {
    if (!pair.calibrationKind) {
      throw new Error(`Calibration pair is missing its control kind: ${pair.pairKey}`)
    }
    const blind = createAdversarialBlindResult(
      pair,
      assignment.id,
      reviewer,
      campaignTimes.calibrationBlind
    )
    const comparison = createAdversarialComparisonResult(
      pair,
      blind,
      assignment.id,
      reviewer,
      campaignTimes.calibrationComparison
    )
    assertCalibrationControlOutcomes(pair.calibrationKind, blind.outcome, comparison.outcome)
    return [blind, comparison]
  })
  const calibration = calibrationFor(reviewer, calibrationPairs, campaignTimes.calibrated)
  if (!calibration.passed) {
    throw new Error(
      `Adversarial reviewer calibration failed: ${calibration.foundSeededBlockerMajorDefects}/` +
        `${calibration.seededBlockerMajorDefects} material defects, ` +
        `${calibration.unsupportedExpectedValues} unsupported expected values, ` +
        `${calibration.correctCannotVerifyCases}/${calibration.insufficientEvidenceCases} cannot-verify`
    )
  }

  const resultShards: Array<{
    path: string
    resultCount: number
    findingCount: number
  }> = []
  const allFindings: ReviewFinding[] = []
  const outcomeCounts: Record<ReviewerResult['outcome'], number> = {
    pass: 0,
    finding: 0,
    'cannot-verify': 0,
  }
  await writeCreateOnlyDirectory(output, async staging => {
    await Promise.all([
      mkdir(path.join(staging, 'blind-results'), { recursive: true }),
      mkdir(path.join(staging, 'results'), { recursive: true }),
    ])
    let processedBlindResults = 0
    for (let shardIndex = 0; shardIndex < manifest.shards.length; shardIndex += 1) {
      const packetShard = await readJson<PacketShard>(path.join(workspace, manifest.shards[shardIndex].path))
      const pairs = packetShard.pairs.filter(pair => pair.countsTowardCoverage)
      const blindResults = pairs.map(pair =>
        createAdversarialBlindResult(pair, assignment.id, reviewer, campaignTimes.liveBlind)
      )
      processedBlindResults += blindResults.length
      const blindResultPath = path.join(
        'blind-results',
        `shard-${String(shardIndex + 1).padStart(4, '0')}.json`
      )
      await writeFile(
        path.join(staging, blindResultPath),
        stableJson({
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          revision: manifest.revision,
          results: blindResults,
        }),
        'utf8'
      )
      const savedBlindResults = await readJson<{ results: ReviewerResult[] }>(
        path.join(staging, blindResultPath)
      )
      const savedBlindByPacketId = new Map(savedBlindResults.results.map(result => [result.packetId, result]))
      const results = pairs.flatMap(pair => {
        const blind = savedBlindByPacketId.get(pair.blindPacket.id)
        if (!blind) throw new Error(`Saved blind result is missing for ${pair.blindPacket.id}`)
        return [
          blind,
          createAdversarialComparisonResult(
            pair,
            blind,
            assignment.id,
            reviewer,
            campaignTimes.liveComparison
          ),
        ]
      })
      results.forEach(result => {
        outcomeCounts[result.outcome] += 1
        allFindings.push(...result.findings)
      })
      const resultPath = path.join('results', `shard-${String(shardIndex + 1).padStart(4, '0')}.json`)
      await writeFile(
        path.join(staging, resultPath),
        stableJson({
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          revision: manifest.revision,
          results,
        }),
        'utf8'
      )
      resultShards.push({
        path: resultPath.replaceAll(path.sep, '/'),
        resultCount: results.length,
        findingCount: results.reduce((total, result) => total + result.findings.length, 0),
      })
    }
    if (processedBlindResults !== livePairCount) {
      throw new Error(
        `Adversarial review produced ${processedBlindResults}/${livePairCount} live blind results`
      )
    }
    allFindings.sort((left, right) => left.id.localeCompare(right.id))
    await Promise.all([
      writeFile(path.join(staging, 'assignment.json'), stableJson(assignment), 'utf8'),
      writeFile(path.join(staging, 'calibration.json'), stableJson(calibration), 'utf8'),
      writeFile(
        path.join(staging, 'calibration-results.json'),
        stableJson(calibrationResults),
        'utf8'
      ),
      writeFile(path.join(staging, 'findings.json'), stableJson(allFindings), 'utf8'),
      writeFile(
        path.join(staging, 'results-index.json'),
        stableJson({
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          revision: manifest.revision,
          reviewer,
          assignmentId: assignment.id,
          calibrationResultPath: 'calibration-results.json',
          calibrationResultCount: calibrationResults.length,
          calibrationResultsChecksum: checksumReviewRecord(calibrationResults),
          resultShards,
          outcomeCounts,
        }),
        'utf8'
      ),
    ])
  })
  console.log(
    `Adversarial review complete: ${livePairCount} pairs, ${outcomeCounts.pass} pass, ` +
      `${outcomeCounts.finding} finding, ${outcomeCounts['cannot-verify']} cannot-verify, ` +
      `${allFindings.length} findings`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
