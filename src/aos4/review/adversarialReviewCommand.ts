import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { availableParallelism } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { stableJson } from '../generate/serialization'
import {
  assessAdversarialComparison,
  createAdversarialBlindResult,
  createAdversarialComparisonResult,
} from './adversarialReview'
import { createCalibrationEvidenceReceipt } from './certification'
import {
  calibrationControlOutcomes,
  type CalibrationCaseKind,
  type ReviewPacketBatch,
  type ReviewPacketIndexEntry,
  type ReviewPacketPair,
  type ReviewPacketSafeIndex,
} from './packets'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_PROMPT_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
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
import {
  createReviewCampaignExecution,
  loadReusableCertificationEvidence,
  partitionReusableReviewEvidence,
} from './reviewReuse'
import type {
  AdversarialReviewWorkerReceipt,
  AdversarialReviewWorkerTask,
} from './adversarialReviewWorkerCommand'

const REVIEW_CACHE = path.join('.cache', 'aos4', 'review')
const DEFAULT_WORKSPACE = path.join(REVIEW_CACHE, 'workspace')
const DEFAULT_OUTPUT = path.join(REVIEW_CACHE, 'adversarial-review')

interface Arguments {
  workspace: string
  output: string
  reviewerId: string
  campaignAt: string
  reuseCertification?: string
  jobs?: number
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
  shards: Array<{ path: string; pairs: number }>
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
    } else if (value === '--reuse-certification') {
      parsed.reuseCertification = nextValue(values, index, value)
      index += 1
    } else if (value === '--jobs') {
      const jobs = Number(nextValue(values, index, value))
      if (!Number.isSafeInteger(jobs) || jobs < 1 || jobs > 32) {
        throw new Error('--jobs requires an integer from 1 to 32')
      }
      parsed.jobs = jobs
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

const withinRepository = (value: string): string => {
  const root = path.resolve('.')
  const resolved = path.resolve(value)
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Adversarial review path escapes the repository: ${value}`)
  }
  return resolved
}

const repositoryPath = (value: string): string => {
  const relative = path.relative(path.resolve('.'), path.resolve(value))
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Adversarial review path is not repository-relative: ${value}`)
  }
  return relative.replaceAll(path.sep, '/')
}

const timestamp = (campaignAt: string, sequence: number): string =>
  new Date(new Date(campaignAt).valueOf() + sequence * 1_000).toISOString()

export const deterministicReviewerMetadata = (id: string): ReviewerMetadata => ({
  id,
  kind: 'agent',
  tool: 'aos4-deterministic-evidence-auditor',
  model: AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: AOS4_REVIEW_PROMPT_VERSION,
})

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

interface FreshShardReference {
  index: number
  path: string
  freshPairKeys: string[]
}

interface FreshWorkerResultReference {
  path: string
  resultCount: number
  checksum: string
}

interface ReviewerResultShard {
  schemaVersion: 1
  revision: string
  results: ReviewerResult[]
}

export const balancedFreshShardGroups = (
  shards: FreshShardReference[],
  jobs: number
): FreshShardReference[][] => {
  if (!shards.length) return []
  const groups = Array.from({ length: Math.min(jobs, shards.length) }, () => ({
    pairs: 0,
    shards: [] as FreshShardReference[],
  }))
  ;[...shards]
    .sort((left, right) => right.freshPairKeys.length - left.freshPairKeys.length || left.index - right.index)
    .forEach(shard => {
      const group = [...groups].sort(
        (left, right) => left.pairs - right.pairs || groups.indexOf(left) - groups.indexOf(right)
      )[0]
      group.shards.push(shard)
      group.pairs += shard.freshPairKeys.length
    })
  return groups.map(group => group.shards.sort((left, right) => left.index - right.index))
}

export const defaultAdversarialReviewJobs = (parallelism = availableParallelism()): number =>
  Math.min(8, Math.max(1, parallelism - 1))

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)

// vite-node 6 dropped the root `vite-node.mjs` entry; `./cli` is the exported CLI path
// (the same `dist/cli.mjs` the package.json data scripts invoke directly).
const viteNodeRuntime = (): string => require.resolve('vite-node/cli')

const workerResultPath = (output: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Adversarial review worker result path must be relative: ${relativePath}`)
  }
  const resolved = path.resolve(output, relativePath)
  if (resolved !== output && !resolved.startsWith(`${output}${path.sep}`)) {
    throw new Error(`Adversarial review worker result path escapes its output: ${relativePath}`)
  }
  return resolved
}

export const runFreshWorkers = async (
  staging: string,
  task: Omit<AdversarialReviewWorkerTask, 'shards'>,
  groups: FreshShardReference[][]
): Promise<Map<number, FreshWorkerResultReference>> => {
  const viteNode = viteNodeRuntime()
  const workerCommand = fileURLToPath(new URL('./adversarialReviewWorkerCommand.ts', import.meta.url))
  const controller = new AbortController()
  const workers = groups.map(async (shards, workerIndex) => {
    const suffix = String(workerIndex + 1).padStart(4, '0')
    const taskPath = path.join(staging, `worker-task-${suffix}.json`)
    const output = path.join(staging, `worker-${suffix}`)
    await writeFile(taskPath, stableJson({ ...task, shards }), 'utf8')
    await execFileAsync(
      process.execPath,
      [viteNode, '--script', workerCommand, '--task', taskPath, '--output', output],
      { cwd: process.cwd(), windowsHide: true, maxBuffer: 64 * 1024 * 1024, signal: controller.signal }
    )
    await assertCreateOnlyDirectoryComplete(output)
    const receipt = await readJson<AdversarialReviewWorkerReceipt>(path.join(output, 'receipt.json'))
    if (receipt.schemaVersion !== 1 || receipt.revision !== task.revision) {
      throw new Error(`Adversarial review worker ${suffix} returned an invalid receipt`)
    }
    return {
      output,
      receipt,
    }
  })
  const guardedWorkers = workers.map(worker =>
    worker.catch(error => {
      controller.abort()
      throw error
    })
  )
  const settledWorkers = await Promise.allSettled(guardedWorkers)
  const failure = settledWorkers.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  )
  if (failure) throw failure.reason
  const receipts = settledWorkers.map(
    result => (result as PromiseFulfilledResult<Awaited<(typeof workers)[number]>>).value
  )
  const expectedShardIndexes = groups
    .flat()
    .map(shard => shard.index)
    .sort((left, right) => left - right)
  const actualShardIndexes = receipts
    .flatMap(value => value.receipt.shards.map(shard => shard.index))
    .sort((left, right) => left - right)
  if (stableJson(actualShardIndexes) !== stableJson(expectedShardIndexes)) {
    throw new Error('Adversarial review workers returned duplicate or missing shards')
  }
  return new Map(
    receipts.flatMap(({ output, receipt }) =>
      receipt.shards.map(
        shard =>
          [
            shard.index,
            {
              path: workerResultPath(output, shard.path),
              resultCount: shard.resultCount,
              checksum: shard.checksum,
            },
          ] as const
      )
    )
  )
}

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

const pairMatchesIndexEntry = (pair: ReviewPacketPair, entry: ReviewPacketIndexEntry): boolean =>
  pair.pairKey === entry.pairKey &&
  pair.blindPacket.id === entry.blindPacketId &&
  pair.blindPacket.packetChecksum === entry.blindPacketChecksum &&
  pair.comparisonPacket.id === entry.comparisonPacketId &&
  pair.comparisonPacket.packetChecksum === entry.comparisonPacketChecksum

export const runAdversarialReview = async (values = process.argv.slice(2)): Promise<void> => {
  const arguments_ = parseAdversarialReviewArguments(values)
  const workspace = withinReviewCache(arguments_.workspace)
  const output = withinReviewCache(arguments_.output)

  const [manifest, safeIndex] = await Promise.all([
    readJson<WorkspaceManifest>(path.join(workspace, 'workspace.json')),
    readJson<ReviewPacketSafeIndex>(path.join(workspace, 'index.json')),
  ])
  await assertCreateOnlyDirectoryComplete(workspace)
  if (
    manifest.schemaVersion !== 1 ||
    manifest.protocolVersion !== AOS4_REVIEW_PROTOCOL_VERSION ||
    manifest.rubricVersion !== AOS4_REVIEW_RUBRIC_VERSION ||
    safeIndex.revision !== manifest.revision ||
    safeIndex.protocolVersion !== manifest.protocolVersion ||
    safeIndex.rubricVersion !== manifest.rubricVersion ||
    !Array.isArray(manifest.batches)
  ) {
    throw new Error('Prepared review workspace does not match the current protocol and rubric')
  }
  const reviewer = deterministicReviewerMetadata(arguments_.reviewerId)
  const reuseSource = arguments_.reuseCertification
    ? await loadReusableCertificationEvidence(withinRepository(arguments_.reuseCertification))
    : undefined
  const reusable = reuseSource
    ? partitionReusableReviewEvidence(safeIndex, reuseSource, reviewer)
    : {
        reusedEntries: [],
        freshEntries: safeIndex.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration),
        assignments: [],
        calibrations: [],
        calibrationResults: [],
        results: [],
      }
  const freshPairKeys = new Set(reusable.freshEntries.map(entry => entry.pairKey))
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
  const freshPacketIds = reusable.freshEntries.flatMap(entry => [
    entry.blindPacketId,
    entry.comparisonPacketId,
  ])
  const freshShardReferences: FreshShardReference[] = []
  const livePairCount = safeIndex.entries.filter(
    entry => entry.countsTowardCoverage && !entry.calibration
  ).length
  let entryOffset = 0
  for (let shardIndex = 0; shardIndex < manifest.shards.length; shardIndex += 1) {
    const shard = manifest.shards[shardIndex]
    if (!Number.isSafeInteger(shard.pairs) || shard.pairs < 1) {
      throw new Error(`Prepared review workspace shard count is invalid: ${shard.path}`)
    }
    const shardEntries = safeIndex.entries.slice(entryOffset, entryOffset + shard.pairs)
    if (shardEntries.length !== shard.pairs) {
      throw new Error(`Prepared review workspace shard exceeds the safe index: ${shard.path}`)
    }
    const shardFreshPairKeys = shardEntries
      .filter(entry => freshPairKeys.has(entry.pairKey))
      .map(entry => entry.pairKey)
    if (shardFreshPairKeys.length) {
      freshShardReferences.push({ index: shardIndex, path: shard.path, freshPairKeys: shardFreshPairKeys })
    }
    const calibrationEntries = shardEntries.filter(entry => entry.calibration)
    if (calibrationEntries.length) {
      const packetShard = await readJson<PacketShard>(path.join(workspace, shard.path))
      if (packetShard.schemaVersion !== 1 || packetShard.pairs.length !== shard.pairs) {
        throw new Error(`Prepared review workspace shard is invalid: ${shard.path}`)
      }
      calibrationEntries.forEach(entry => {
        const pair = packetShard.pairs.find(value => value.pairKey === entry.pairKey)
        if (!pair || !pairMatchesIndexEntry(pair, entry)) {
          throw new Error(`Calibration pair does not match the safe index: ${entry.pairKey}`)
        }
        if (calibrationBlindPacketIds.has(pair.blindPacket.id)) {
          throw new Error(`Duplicate calibration blind packet: ${pair.blindPacket.id}`)
        }
        calibrationPairs.push(pair)
        calibrationBlindPacketIds.add(pair.blindPacket.id)
      })
    }
    entryOffset += shard.pairs
  }
  if (entryOffset !== safeIndex.entries.length) {
    throw new Error('Prepared review workspace shards do not cover the safe index')
  }
  const freshBlindPacketIds = new Set(reusable.freshEntries.map(entry => entry.blindPacketId))
  const freshBatches = manifest.batches.map(batch => ({
    ...batch,
    packetIds: batch.packetIds.filter(
      packetId => packetId === batch.calibrationControlPacketId || freshBlindPacketIds.has(packetId)
    ),
  }))
  assertInterspersedCalibrationControls(freshBatches, freshBlindPacketIds, calibrationBlindPacketIds)
  const calibrationPacketIds = calibrationPairs.flatMap(pair => [
    pair.blindPacket.id,
    pair.comparisonPacket.id,
  ])
  const assignment = createReviewAssignment({
    packetIds: [...freshPacketIds, ...calibrationPacketIds],
    reviewer,
    execution: 'local',
    assignedAt: campaignTimes.assigned,
  })
  const calibrationResults = calibrationPairs.flatMap(pair => {
    if (!pair.calibrationKind) {
      throw new Error(`Calibration pair is missing its control kind: ${pair.pairKey}`)
    }
    const blind = createAdversarialBlindResult(pair, assignment.id, reviewer, campaignTimes.calibrationBlind)
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
    pass: reusable.reusedEntries.length * 2,
    finding: 0,
    'cannot-verify': 0,
  }
  const freshCalibration: ReviewCalibration = {
    ...calibration,
    evidence: createCalibrationEvidenceReceipt(assignment.id, safeIndex, calibrationResults),
  }
  const assignments = [...reusable.assignments, assignment].sort((left, right) =>
    left.id.localeCompare(right.id)
  )
  const calibrations = [...reusable.calibrations, freshCalibration].sort((left, right) =>
    (left.evidence?.assignmentId ?? assignment.id).localeCompare(
      right.evidence?.assignmentId ?? assignment.id
    )
  )
  const allCalibrationResults = [...reusable.calibrationResults, ...calibrationResults].sort(
    (left, right) =>
      left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
  )
  const requestedJobs = arguments_.jobs ?? defaultAdversarialReviewJobs()
  const workerGroups = balancedFreshShardGroups(freshShardReferences, requestedJobs)
  const execution = createReviewCampaignExecution({
    revision: manifest.revision,
    campaignAt: arguments_.campaignAt,
    reviewer,
    reusedPairKeys: reusable.reusedEntries.map(entry => entry.pairKey),
    freshPairKeys,
    freshAssignmentId: assignment.id,
    contributingAssignmentIds: assignments.map(value => value.id),
    requestedJobs,
    peakChildProcessCount: workerGroups.length,
    ...(reuseSource
      ? {
          reuseSource: {
            directory: repositoryPath(reuseSource.directory),
            manifestChecksum: checksumReviewRecord(reuseSource.manifest),
          },
        }
      : {}),
  })
  await writeCreateOnlyDirectory(output, async staging => {
    await mkdir(path.join(staging, 'results'), { recursive: true })
    const workerResultPaths = await runFreshWorkers(
      staging,
      {
        schemaVersion: 1,
        revision: manifest.revision,
        workspace,
        assignmentId: assignment.id,
        reviewer,
        blindReviewedAt: campaignTimes.liveBlind,
        comparisonReviewedAt: campaignTimes.liveComparison,
      },
      workerGroups
    )
    for (let shardIndex = 0; shardIndex < manifest.shards.length; shardIndex += 1) {
      const freshResultReference = workerResultPaths.get(shardIndex)
      if (!freshResultReference) continue
      const freshResultShard = await readJson<ReviewerResultShard>(freshResultReference.path)
      if (
        freshResultShard.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
        freshResultShard.revision !== manifest.revision ||
        freshResultShard.results.length !== freshResultReference.resultCount ||
        checksumReviewRecord(freshResultShard.results) !== freshResultReference.checksum
      ) {
        throw new Error(`Adversarial review worker result is invalid for shard ${shardIndex + 1}`)
      }
      const results = freshResultShard.results
      results.forEach(result => {
        outcomeCounts[result.outcome] += 1
        allFindings.push(...result.findings)
      })
      const resultPath = path.relative(staging, freshResultReference.path)
      resultShards.push({
        path: resultPath.replaceAll(path.sep, '/'),
        resultCount: results.length,
        findingCount: results.reduce((total, result) => total + result.findings.length, 0),
      })
    }
    allFindings.sort((left, right) => left.id.localeCompare(right.id))
    await Promise.all([
      writeFile(path.join(staging, 'assignments.json'), stableJson(assignments), 'utf8'),
      writeFile(path.join(staging, 'calibrations.json'), stableJson(calibrations), 'utf8'),
      writeFile(path.join(staging, 'calibration-results.json'), stableJson(allCalibrationResults), 'utf8'),
      writeFile(path.join(staging, 'execution.json'), stableJson(execution), 'utf8'),
      writeFile(path.join(staging, 'findings.json'), stableJson(allFindings), 'utf8'),
      writeFile(
        path.join(staging, 'results-index.json'),
        stableJson({
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          revision: manifest.revision,
          reviewer,
          assignmentIds: assignments.map(value => value.id),
          assignmentsPath: 'assignments.json',
          calibrationsPath: 'calibrations.json',
          calibrationResultPath: 'calibration-results.json',
          calibrationResultCount: allCalibrationResults.length,
          calibrationResultsChecksum: checksumReviewRecord(allCalibrationResults),
          executionPath: 'execution.json',
          executionChecksum: checksumReviewRecord(execution),
          ...(reuseSource ? { reuseSource: execution.reuseSource } : {}),
          resultShards,
          outcomeCounts,
        }),
        'utf8'
      ),
    ])
  })
  console.log(
    `Adversarial review complete: ${livePairCount} pairs ` +
      `(${reusable.reusedEntries.length} reused, ${reusable.freshEntries.length} fresh), ` +
      `${outcomeCounts.pass} pass, ` +
      `${outcomeCounts.finding} finding, ${outcomeCounts['cannot-verify']} cannot-verify, ` +
      `${allFindings.length} findings`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runAdversarialReview().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
