import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import {
  assessAdversarialComparison,
  createAdversarialBlindResult,
  createAdversarialComparisonResult,
} from './adversarialReview'
import type { ReviewPacketPair } from './packets'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  createReviewAssignment,
  reviewerConfigurationId,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'

const DEFAULT_WORKSPACE = path.join('.cache', 'aos4', 'review')
const DEFAULT_OUTPUT = path.join(DEFAULT_WORKSPACE, 'adversarial-review')

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
    reviewerId: 'aos4-deterministic-adversarial-reviewer-v1',
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
  const root = path.resolve(DEFAULT_WORKSPACE)
  const resolved = path.resolve(value)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Adversarial review artifacts must remain under ${DEFAULT_WORKSPACE}`)
  }
  return resolved
}

const timestamp = (campaignAt: string, minutes: number): string =>
  new Date(new Date(campaignAt).valueOf() + minutes * 60_000).toISOString()

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const calibrationFor = (
  reviewer: ReviewerMetadata,
  pairs: ReviewPacketPair[],
  calibratedAt: string
): ReviewCalibration => {
  const defects = pairs.filter(pair => pair.calibrationKind === 'defect')
  const insufficient = pairs.filter(pair => pair.calibrationKind === 'insufficient-evidence')
  const foundDefects = defects.filter(pair => assessAdversarialComparison(pair).outcome === 'finding').length
  const correctCannotVerify = insufficient.filter(
    pair => assessAdversarialComparison(pair).outcome === 'cannot-verify'
  ).length
  const unsupportedExpectedValues = pairs
    .filter(pair => pair.calibrationKind !== 'defect')
    .flatMap(pair => assessAdversarialComparison(pair).findings).length
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
  const outputExists = await access(output)
    .then(() => true)
    .catch(() => false)
  if (outputExists) throw new Error(`Adversarial review output already exists: ${arguments_.output}`)

  const manifest = await readJson<WorkspaceManifest>(path.join(workspace, 'workspace.json'))
  if (
    manifest.schemaVersion !== 1 ||
    manifest.protocolVersion !== AOS4_REVIEW_PROTOCOL_VERSION ||
    manifest.rubricVersion !== AOS4_REVIEW_RUBRIC_VERSION
  ) {
    throw new Error('Prepared review workspace does not match the current protocol and rubric')
  }
  const reviewer: ReviewerMetadata = {
    id: arguments_.reviewerId,
    kind: 'agent',
    tool: 'aos4-deterministic-evidence-auditor',
    model: 'evidence-auditor/v1',
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    promptVersion: 'aos4-review-prompt/v1',
  }
  const calibrationPairs: ReviewPacketPair[] = []
  const livePacketIds: ReviewerResult['packetId'][] = []
  let livePairCount = 0
  for (const shard of manifest.shards) {
    const packetShard = await readJson<PacketShard>(path.join(workspace, shard.path))
    calibrationPairs.push(...packetShard.pairs.filter(pair => pair.calibration))
    packetShard.pairs
      .filter(pair => pair.countsTowardCoverage)
      .forEach(pair => {
        livePairCount += 1
        livePacketIds.push(pair.blindPacket.id, pair.comparisonPacket.id)
      })
  }
  const calibration = calibrationFor(reviewer, calibrationPairs, timestamp(arguments_.campaignAt, 1))
  if (!calibration.passed) {
    throw new Error(
      `Adversarial reviewer calibration failed: ${calibration.foundSeededBlockerMajorDefects}/` +
        `${calibration.seededBlockerMajorDefects} material defects, ` +
        `${calibration.unsupportedExpectedValues} unsupported expected values, ` +
        `${calibration.correctCannotVerifyCases}/${calibration.insufficientEvidenceCases} cannot-verify`
    )
  }
  const assignment = createReviewAssignment({
    packetIds: livePacketIds,
    reviewer,
    execution: 'local',
    assignedAt: timestamp(arguments_.campaignAt, 0),
  })

  await Promise.all([
    mkdir(path.join(output, 'blind-results'), { recursive: true }),
    mkdir(path.join(output, 'results'), { recursive: true }),
  ])
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
  for (let shardIndex = 0; shardIndex < manifest.shards.length; shardIndex += 1) {
    const packetShard = await readJson<PacketShard>(path.join(workspace, manifest.shards[shardIndex].path))
    const pairs = packetShard.pairs.filter(pair => pair.countsTowardCoverage)
    const blindResults = pairs.map(pair =>
      createAdversarialBlindResult(
        pair,
        assignment.id,
        reviewer,
        timestamp(arguments_.campaignAt, 2)
      )
    )
    const blindResultPath = path.join(
      'blind-results',
      `shard-${String(shardIndex + 1).padStart(4, '0')}.json`
    )
    await writeFile(
      path.join(output, blindResultPath),
      stableJson({
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        revision: manifest.revision,
        results: blindResults,
      }),
      'utf8'
    )
    const savedBlindResults = await readJson<{ results: ReviewerResult[] }>(
      path.join(output, blindResultPath)
    )
    const savedBlindByPacketId = new Map(
      savedBlindResults.results.map(result => [result.packetId, result])
    )
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
          timestamp(arguments_.campaignAt, 3)
        ),
      ]
    })
    results.forEach(result => {
      outcomeCounts[result.outcome] += 1
      allFindings.push(...result.findings)
    })
    const resultPath = path.join('results', `shard-${String(shardIndex + 1).padStart(4, '0')}.json`)
    await writeFile(
      path.join(output, resultPath),
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
  allFindings.sort((left, right) => left.id.localeCompare(right.id))
  await Promise.all([
    writeFile(path.join(output, 'assignment.json'), stableJson(assignment), 'utf8'),
    writeFile(path.join(output, 'calibration.json'), stableJson(calibration), 'utf8'),
    writeFile(path.join(output, 'findings.json'), stableJson(allFindings), 'utf8'),
    writeFile(
      path.join(output, 'results-index.json'),
      stableJson({
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        revision: manifest.revision,
        reviewer,
        assignmentId: assignment.id,
        resultShards,
        outcomeCounts,
      }),
      'utf8'
    ),
  ])
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
