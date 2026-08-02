import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ArtifactManifest, WahapediaHtmlReconciliation } from '../data'
import type { Aos4Catalog } from '../domain'
import type { CorpusReview } from '../generate/corpus'
import type { OfficialBattleProfileCatalog } from '../generate/officialBattleProfiles'
import { checksumCertificationText, type SourceInventory } from './certification'
import { parseCertificationManifest, parseReviewLedger } from './findings'
import type { ReviewPacketIndexEntry, ReviewPacketSafeIndex } from './packets'
import { assertCreateOnlyDirectoryComplete } from './reviewWorkspace'
import {
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  type CertificationInput,
  type CertificationManifest,
  type FindingResolution,
  type FindingVerification,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewCampaignExecution,
  type ReviewerResult,
} from './records'

interface ProtocolFile {
  protocolVersion: string
}

interface RubricFile {
  rubricVersion: string
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

export interface LoadedCertificationEvidence {
  manifest: CertificationManifest
  currentInputs: CertificationInput[]
  index: ReviewPacketSafeIndex
  acceptedManifest: ArtifactManifest
  catalog: Aos4Catalog
  officialLedger: OfficialBattleProfileCatalog
  reconciliation: WahapediaHtmlReconciliation
  review: CorpusReview
  ledger: ReviewLedger
  calibrationResults: ReviewerResult[]
  protocol: ProtocolFile
  rubric: RubricFile
  inventory: SourceInventory
  execution?: ReviewCampaignExecution
}

const MAX_CERTIFICATION_OVERLAY_DEPTH = 256

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const repositoryPath = (repoRoot: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Certification path must be repository-relative: ${relativePath}`)
  }
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification path escapes the repository: ${relativePath}`)
  }
  return resolved
}

const namedJson = <T>(name: string, inputs: CertificationInput[], files: ReadonlyMap<string, string>): T => {
  const binding = inputs.find(value => value.name === name)
  if (!binding) throw new Error(`Certification input is missing: ${name}`)
  const content = files.get(binding.path)
  if (content === undefined) throw new Error(`Certification input file is missing: ${binding.path}`)
  return JSON.parse(content) as T
}

const reviewIndexFromInputs = (
  inputs: CertificationInput[],
  files: ReadonlyMap<string, string>
): ReviewPacketSafeIndex => {
  const index = namedJson<ReviewPacketSafeIndex | ShardedReviewIndex>('review-index', inputs, files)
  if ('entries' in index) return index
  if (index.schemaVersion !== 1 || index.kind !== 'review-index-shards' || !Array.isArray(index.shards)) {
    throw new Error('Certification review-index shard manifest is invalid')
  }
  const entries: ReviewPacketIndexEntry[] = []
  for (const reference of index.shards) {
    const shard = namedJson<ReviewPacketIndexEntry[]>(reference.inputName, inputs, files)
    if (!Array.isArray(shard) || shard.length !== reference.entries) {
      throw new Error(`Certification review-index shard is invalid: ${reference.inputName}`)
    }
    entries.push(...shard)
  }
  return { ...index, entries }
}

const reviewResultsFromInputs = async (
  inputs: CertificationInput[],
  files: ReadonlyMap<string, string>,
  repoRoot: string
): Promise<ReviewerResult[]> => {
  const results = namedJson<ReviewerResult[] | ShardedReviewResults | OverlayReviewResults>(
    'review-results',
    inputs,
    files
  )
  if (Array.isArray(results)) return results
  if (
    results.schemaVersion !== 1 ||
    !['review-result-shards', 'review-result-overlay'].includes(results.kind) ||
    !Array.isArray(results.shards)
  ) {
    throw new Error('Certification review-results shard manifest is invalid')
  }
  const fresh = results.shards.flatMap(reference => {
    const shard = namedJson<ReviewerResult[]>(reference.inputName, inputs, files)
    if (!Array.isArray(shard) || shard.length !== reference.results) {
      throw new Error(`Certification review-results shard is invalid: ${reference.inputName}`)
    }
    return shard
  })
  if (results.kind === 'review-result-shards') return fresh
  if (!Array.isArray(results.reusedPacketIds) || results.reusedPacketIds.length !== results.reusedResults) {
    throw new Error('Certification review-results overlay is invalid')
  }
  const sourceDirectory = repositoryPath(repoRoot, results.reuseSource.directory)
  const sourceManifest = parseCertificationManifest(
    await readJson<unknown>(path.join(sourceDirectory, 'manifest.json'))
  )
  if (checksumReviewRecord(sourceManifest) !== results.reuseSource.manifestChecksum) {
    throw new Error('Certification review-results overlay source manifest has changed')
  }
  const reusedPacketIds = new Set(results.reusedPacketIds)
  const reused = (await loadCertificationReviewerResults(sourceDirectory, repoRoot)).filter(result =>
    reusedPacketIds.has(result.packetId)
  )
  if (reused.length !== results.reusedResults) {
    throw new Error('Certification review-results overlay source population is incomplete')
  }
  return [...reused, ...fresh]
}

const loadCertificationReviewerResultsInternal = async (
  directory: string,
  repoRoot: string,
  ancestors: ReadonlySet<string>
): Promise<ReviewerResult[]> => {
  const resolvedDirectory = path.resolve(directory)
  if (ancestors.has(resolvedDirectory)) {
    throw new Error(`Certification review-results overlay cycle detected: ${resolvedDirectory}`)
  }
  if (ancestors.size >= MAX_CERTIFICATION_OVERLAY_DEPTH) {
    throw new Error(`Certification review-results overlay exceeds ${MAX_CERTIFICATION_OVERLAY_DEPTH} levels`)
  }
  const nextAncestors = new Set(ancestors).add(resolvedDirectory)
  await assertCreateOnlyDirectoryComplete(resolvedDirectory)
  const manifest = parseCertificationManifest(
    await readJson<unknown>(path.join(resolvedDirectory, 'manifest.json'))
  )
  const readInput = async (name: string): Promise<string> => {
    const binding = manifest.inputs.find(input => input.name === name)
    if (!binding) throw new Error(`Certification input is missing: ${name}`)
    const content = await readFile(repositoryPath(repoRoot, binding.path), 'utf8')
    if (checksumCertificationText(content) !== binding.checksum) {
      throw new Error(`Certification reuse source input checksum mismatch: ${name}`)
    }
    return content
  }
  const resultManifest = JSON.parse(await readInput('review-results')) as
    | ReviewerResult[]
    | ShardedReviewResults
    | OverlayReviewResults
  if (Array.isArray(resultManifest)) return resultManifest
  if (
    resultManifest.schemaVersion !== 1 ||
    !['review-result-shards', 'review-result-overlay'].includes(resultManifest.kind) ||
    !Array.isArray(resultManifest.shards)
  ) {
    throw new Error('Certification review-results shard manifest is invalid')
  }
  const shards = await Promise.all(
    resultManifest.shards.map(async reference => {
      const results = JSON.parse(await readInput(reference.inputName)) as ReviewerResult[]
      if (!Array.isArray(results) || results.length !== reference.results) {
        throw new Error(`Certification review-results shard is invalid: ${reference.inputName}`)
      }
      return results
    })
  )
  const fresh = shards.flat()
  if (resultManifest.kind === 'review-result-shards') return fresh
  if (
    !Array.isArray(resultManifest.reusedPacketIds) ||
    resultManifest.reusedPacketIds.length !== resultManifest.reusedResults
  ) {
    throw new Error('Certification review-results overlay is invalid')
  }
  const sourceDirectory = repositoryPath(repoRoot, resultManifest.reuseSource.directory)
  const sourceManifest = parseCertificationManifest(
    await readJson<unknown>(path.join(sourceDirectory, 'manifest.json'))
  )
  if (checksumReviewRecord(sourceManifest) !== resultManifest.reuseSource.manifestChecksum) {
    throw new Error('Certification review-results overlay source manifest has changed')
  }
  const reusedPacketIds = new Set(resultManifest.reusedPacketIds)
  const reused = (
    await loadCertificationReviewerResultsInternal(sourceDirectory, repoRoot, nextAncestors)
  ).filter(result => reusedPacketIds.has(result.packetId))
  if (reused.length !== resultManifest.reusedResults) {
    throw new Error('Certification review-results overlay source population is incomplete')
  }
  return [...reused, ...fresh]
}

export const loadCertificationReviewerResults = async (
  directory: string,
  repoRoot = process.cwd()
): Promise<ReviewerResult[]> =>
  loadCertificationReviewerResultsInternal(directory, path.resolve(repoRoot), new Set())

export const loadCertificationEvidence = async (
  directory: string,
  repoRoot = process.cwd(),
  strictChecksums = false
): Promise<LoadedCertificationEvidence> => {
  await assertCreateOnlyDirectoryComplete(directory)
  const manifest = parseCertificationManifest(await readJson<unknown>(path.join(directory, 'manifest.json')))
  const files = new Map<string, string>()
  const currentInputs: CertificationInput[] = []
  for (const input of manifest.inputs) {
    const content = await readFile(repositoryPath(repoRoot, input.path), 'utf8')
    const checksum = checksumCertificationText(content)
    if (strictChecksums && checksum !== input.checksum) {
      throw new Error(`Certification reuse source input checksum mismatch: ${input.name}`)
    }
    files.set(input.path, content)
    currentInputs.push({ name: input.name, path: input.path, checksum })
  }
  const index = reviewIndexFromInputs(manifest.inputs, files)
  const reviewResults = await reviewResultsFromInputs(manifest.inputs, files, repoRoot)
  const ledger = parseReviewLedger({
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: namedJson<ReviewAssignment[]>('review-assignments', manifest.inputs, files),
    calibrations: namedJson<ReviewCalibration[]>('review-calibrations', manifest.inputs, files),
    results: reviewResults,
    findings: namedJson<ReviewFinding[]>('review-findings', manifest.inputs, files),
    resolutions: namedJson<FindingResolution[]>('review-resolutions', manifest.inputs, files),
    verifications: namedJson<FindingVerification[]>('review-verifications', manifest.inputs, files),
  })
  return {
    manifest,
    currentInputs,
    index,
    acceptedManifest: namedJson<ArtifactManifest>('accepted-manifest', manifest.inputs, files),
    catalog: namedJson<Aos4Catalog>('audit-catalog', manifest.inputs, files),
    officialLedger: namedJson<OfficialBattleProfileCatalog>('official-ledger', manifest.inputs, files),
    reconciliation: namedJson<WahapediaHtmlReconciliation>('reconciliation-report', manifest.inputs, files),
    review: namedJson<CorpusReview>('corpus-review', manifest.inputs, files),
    ledger,
    calibrationResults: namedJson<ReviewerResult[]>('review-calibration-results', manifest.inputs, files),
    protocol: namedJson<ProtocolFile>('review-protocol', manifest.inputs, files),
    rubric: namedJson<RubricFile>('review-rubric', manifest.inputs, files),
    inventory: namedJson<SourceInventory>('source-inventory', manifest.inputs, files),
    ...(manifest.inputs.some(input => input.name === 'review-execution')
      ? {
          execution: namedJson<ReviewCampaignExecution>('review-execution', manifest.inputs, files),
        }
      : {}),
  }
}
