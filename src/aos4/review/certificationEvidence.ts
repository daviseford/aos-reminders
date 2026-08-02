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

const reviewResultsFromInputs = (
  inputs: CertificationInput[],
  files: ReadonlyMap<string, string>
): ReviewerResult[] => {
  const results = namedJson<ReviewerResult[] | ShardedReviewResults>('review-results', inputs, files)
  if (Array.isArray(results)) return results
  if (
    results.schemaVersion !== 1 ||
    results.kind !== 'review-result-shards' ||
    !Array.isArray(results.shards)
  ) {
    throw new Error('Certification review-results shard manifest is invalid')
  }
  return results.shards.flatMap(reference => {
    const shard = namedJson<ReviewerResult[]>(reference.inputName, inputs, files)
    if (!Array.isArray(shard) || shard.length !== reference.results) {
      throw new Error(`Certification review-results shard is invalid: ${reference.inputName}`)
    }
    return shard
  })
}

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
  const ledger = parseReviewLedger({
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: namedJson<ReviewAssignment[]>('review-assignments', manifest.inputs, files),
    calibrations: namedJson<ReviewCalibration[]>('review-calibrations', manifest.inputs, files),
    results: reviewResultsFromInputs(manifest.inputs, files),
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
