import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArtifactManifest, WahapediaHtmlReconciliation } from '../data'
import type { Aos4Catalog } from '../domain'
import type { CorpusReview } from '../generate/corpus'
import type { OfficialBattleProfileCatalog } from '../generate/officialBattleProfiles'
import { stableCompactJson } from '../generate/serialization'
import { assertAgentBlindDerivations } from './adversarialReview'
import {
  calibrationEvidenceIssues,
  certificationChronologyIssues,
  evaluateCertification,
  checksumCertificationText,
  reviewLedgerWithResults,
  verifyCertificationManifest,
  type CertificationInventoryBinding,
  type CertificationIssue,
  type SourceInventory,
} from './certification'
import { parseCertificationManifest, parseReviewLedger, validateReviewLedger } from './findings'
import {
  assertReviewIndexMatchesPacketPairs,
  ignoredRecordCandidateKey,
  officialRecordCandidateKey,
  profileOnlyFactCandidateKey,
  reconciliationDiscrepancyCandidateKey,
  REQUIRED_HIGH_RISK_COHORTS,
  sourceRecordCandidateKey,
  type ReviewPacketIndexEntry,
  type ReviewPacketSafeIndex,
} from './packets'
import { AOS4_GOLDEN_TRUTH_CASES } from './pathology'
import { assertCreateOnlyDirectoryComplete, loadReviewPacketPairs } from './reviewWorkspace'
import {
  AOS4_REVIEW_SCHEMA_VERSION,
  type CertificationInput,
  type FindingResolution,
  type FindingVerification,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewerResult,
} from './records'

const DEFAULT_CURRENT = path.join('data', 'aos4', 'certifications', 'beta.json')
const DEFAULT_WORKSPACE_INDEX = path.join('.cache', 'aos4', 'review', 'workspace', 'index.json')
const DEFAULT_WORKSPACE = path.join('.cache', 'aos4', 'review', 'workspace', 'workspace.json')

export interface CertificationCommandArguments {
  currentPath: string
  certificationDirectory?: string
  full: boolean
  writeSummary: boolean
  workspaceIndexPath?: string
  workspacePath?: string
}

interface CertificationPointer {
  schemaVersion: 1
  directory: string
}

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

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const repoPath = (repoRoot: string, relativePath: string): string => {
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification path escapes the repository: ${relativePath}`)
  }
  return resolved
}

export const parseCertificationCommandArguments = (arguments_: string[]): CertificationCommandArguments => {
  const parsed: CertificationCommandArguments = {
    currentPath: DEFAULT_CURRENT,
    full: false,
    writeSummary: false,
  }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--full') {
      parsed.full = true
    } else if (argument === '--write-summary') {
      throw new Error(
        '--write-summary cannot mutate an immutable certification; prepare a new revision directory'
      )
    } else if (
      argument === '--current' ||
      argument === '--certification-dir' ||
      argument === '--workspace-index' ||
      argument === '--workspace'
    ) {
      const value = arguments_[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`)
      if (argument === '--current') parsed.currentPath = value
      else if (argument === '--certification-dir') parsed.certificationDirectory = value
      else if (argument === '--workspace-index') parsed.workspaceIndexPath = value
      else parsed.workspacePath = value
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return parsed
}

const certificationDirectory = async (
  repoRoot: string,
  arguments_: CertificationCommandArguments
): Promise<string> => {
  if (arguments_.certificationDirectory) {
    return repoPath(repoRoot, arguments_.certificationDirectory)
  }
  const pointerPath = repoPath(repoRoot, arguments_.currentPath)
  const pointer = await readJson<CertificationPointer>(pointerPath)
  if (pointer.schemaVersion !== 1 || !pointer.directory || path.isAbsolute(pointer.directory)) {
    throw new Error(`Invalid certification pointer: ${arguments_.currentPath}`)
  }
  return repoPath(repoRoot, pointer.directory)
}

const namedJson = <T>(
  name: string,
  inputs: Array<{ name: string; path: string }>,
  files: ReadonlyMap<string, string>
): T => {
  const binding = inputs.find(value => value.name === name)
  if (!binding) throw new Error(`Certification input is missing: ${name}`)
  const content = files.get(binding.path)
  if (content === undefined) {
    throw new Error(`Certification input file is missing: ${binding.path}`)
  }
  return JSON.parse(content) as T
}

const reviewIndexFromInputs = (
  inputs: Array<{ name: string; path: string }>,
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
  return {
    schemaVersion: index.schemaVersion,
    revision: index.revision,
    protocolVersion: index.protocolVersion,
    rubricVersion: index.rubricVersion,
    entries,
    coverage: index.coverage,
  }
}

const reviewResultsFromInputs = (
  inputs: Array<{ name: string; path: string }>,
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

const combinedStatus = (
  evaluationStatus: 'pass' | 'blocked' | 'stale',
  issues: CertificationIssue[]
): 'pass' | 'blocked' | 'stale' =>
  issues.some(value => value.state === 'stale')
    ? 'stale'
    : issues.length || evaluationStatus === 'blocked'
      ? 'blocked'
      : evaluationStatus

export const boundReviewPopulationIssues = (
  index: ReviewPacketSafeIndex,
  catalog: Aos4Catalog,
  officialLedger: OfficialBattleProfileCatalog,
  reconciliation: WahapediaHtmlReconciliation,
  review: CorpusReview
): CertificationIssue[] => {
  const liveEntries = index.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  const actualByCategory = new Map<string, Set<string>>()
  const liveCohorts = new Set<string>()
  liveEntries.forEach(entry => {
    const keys = actualByCategory.get(entry.category) ?? new Set<string>()
    keys.add(entry.candidateKey)
    actualByCategory.set(entry.category, keys)
    entry.cohortIds.forEach(cohort => liveCohorts.add(cohort))
  })
  const expected = new Map<string, Set<string>>([
    ['official-record', new Set(officialLedger.records.map(record => officialRecordCandidateKey(record.id)))],
    [
      'reconciliation-discrepancy',
      new Set(reconciliation.discrepancies.map((_, index_) => reconciliationDiscrepancyCandidateKey(index_))),
    ],
    [
      'profile-only-fact',
      new Set(
        reconciliation.unmatchedOfficialUnitFacts.map(fact => profileOnlyFactCandidateKey(fact.factChecksum))
      ),
    ],
    ['source-record', new Set(catalog.sourceRecords.map(record => sourceRecordCandidateKey(record.id)))],
    ['golden-truth', new Set(AOS4_GOLDEN_TRUTH_CASES.map(value => value.id))],
  ])
  const issues: CertificationIssue[] = []
  expected.forEach((expectedKeys, category) => {
    const actualKeys = actualByCategory.get(category) ?? new Set()
    const missing = Array.from(expectedKeys).filter(key => !actualKeys.has(key))
    const unexpected = Array.from(actualKeys).filter(key => !expectedKeys.has(key))
    if (actualKeys.size !== expectedKeys.size || missing.length || unexpected.length) {
      issues.push({
        code: 'invalid-review-index',
        state: 'blocked',
        path: `index.population.${category}`,
        subject: `index.population.${category}`,
        message:
          `${category} population differs from bound products: ` +
          `${actualKeys.size}/${expectedKeys.size}, ${missing.length} missing, ` +
          `${unexpected.length} unexpected`,
      })
    }
  })
  const missingRequiredHighRisk = REQUIRED_HIGH_RISK_COHORTS.filter(
    cohort => !index.coverage.highRiskCohorts.includes(cohort) || !liveCohorts.has(cohort)
  )
  if (missingRequiredHighRisk.length) {
    issues.push({
      code: 'invalid-review-index',
      state: 'blocked',
      path: 'index.population.high-risk',
      subject: 'index.population.high-risk',
      message: `Required high-risk cohorts are missing: ${missingRequiredHighRisk.join(', ')}`,
    })
  }
  const ignoredKeys = actualByCategory.get('ignored-record') ?? new Set()
  const explicitIgnoredKeys = review.ignoredSourceRecords.map(record =>
    ignoredRecordCandidateKey(record.sourceRecordId)
  )
  const expectedIgnoredCount = review.supersededSourceRecords?.expectedCount ?? explicitIgnoredKeys.length
  const ignoredSourceRecordIds = Array.from(ignoredKeys)
    .map(key => key.slice('ignored-record:'.length))
    .sort((left, right) => left.localeCompare(right))
  const ignoredChecksum = createHash('sha256').update(ignoredSourceRecordIds.join('\n'), 'utf8').digest('hex')
  const expectedIgnoredChecksum = review.supersededSourceRecords?.checksum
  if (
    ignoredKeys.size !== expectedIgnoredCount ||
    explicitIgnoredKeys.some(key => !ignoredKeys.has(key)) ||
    (expectedIgnoredCount > 0 && ignoredChecksum !== expectedIgnoredChecksum)
  ) {
    issues.push({
      code: 'invalid-review-index',
      state: 'blocked',
      path: 'index.population.ignored-record',
      subject: 'index.population.ignored-record',
      message:
        `ignored-record population differs from the bound corpus review: ` +
        `${ignoredKeys.size}/${expectedIgnoredCount}, checksum ${ignoredChecksum}/` +
        `${expectedIgnoredChecksum ?? 'missing'}`,
    })
  }
  const expectedFactionContextStrata = Array.from(
    new Set(
      catalog.entities
        .filter(entity => entity.kind === 'faction')
        .flatMap(entity => entity.rulesContextIds.map(contextId => `${entity.id}|${contextId}`))
    )
  ).sort((left, right) => left.localeCompare(right))
  const actualFactionContextStrata = Array.from(new Set(index.coverage.factionContextStrata)).sort(
    (left, right) => left.localeCompare(right)
  )
  const expectedFactionContextSet = new Set(expectedFactionContextStrata)
  const actualFactionContextSet = new Set(actualFactionContextStrata)
  if (
    expectedFactionContextStrata.length !== actualFactionContextStrata.length ||
    expectedFactionContextStrata.some(stratum => !actualFactionContextSet.has(stratum)) ||
    actualFactionContextStrata.some(stratum => !expectedFactionContextSet.has(stratum))
  ) {
    issues.push({
      code: 'invalid-review-index',
      state: 'blocked',
      path: 'index.population.faction-context',
      subject: 'index.population.faction-context',
      message:
        'Faction/context sampling population differs from the bound catalog: ' +
        `${actualFactionContextStrata.length}/${expectedFactionContextStrata.length}`,
    })
  }
  return issues
}

export const runCertificationCheck = async (
  arguments_: CertificationCommandArguments,
  repoRoot = process.cwd()
) => {
  const directory = await certificationDirectory(repoRoot, arguments_)
  await assertCreateOnlyDirectoryComplete(directory)
  const manifest = parseCertificationManifest(await readJson<unknown>(path.join(directory, 'manifest.json')))
  const files = new Map<string, string>()
  const currentInputs: CertificationInput[] = []
  for (const input of manifest.inputs) {
    const content = await readFile(repoPath(repoRoot, input.path), 'utf8')
    files.set(input.path, content)
    currentInputs.push({
      name: input.name,
      path: input.path,
      checksum: checksumCertificationText(content),
    })
  }

  const index = reviewIndexFromInputs(manifest.inputs, files)
  const acceptedManifest = namedJson<ArtifactManifest>('accepted-manifest', manifest.inputs, files)
  const catalog = namedJson<Aos4Catalog>('audit-catalog', manifest.inputs, files)
  const officialLedger = namedJson<OfficialBattleProfileCatalog>('official-ledger', manifest.inputs, files)
  const reconciliation = namedJson<WahapediaHtmlReconciliation>(
    'reconciliation-report',
    manifest.inputs,
    files
  )
  const review = namedJson<CorpusReview>('corpus-review', manifest.inputs, files)
  const ledger = parseReviewLedger({
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: namedJson<ReviewAssignment[]>('review-assignments', manifest.inputs, files),
    calibrations: namedJson<ReviewCalibration[]>('review-calibrations', manifest.inputs, files),
    results: reviewResultsFromInputs(manifest.inputs, files),
    findings: namedJson<ReviewFinding[]>('review-findings', manifest.inputs, files),
    resolutions: namedJson<FindingResolution[]>('review-resolutions', manifest.inputs, files),
    verifications: namedJson<FindingVerification[]>('review-verifications', manifest.inputs, files),
  })
  const calibrationResults = namedJson<ReviewerResult[]>('review-calibration-results', manifest.inputs, files)
  const protocol = namedJson<ProtocolFile>('review-protocol', manifest.inputs, files)
  const rubric = namedJson<RubricFile>('review-rubric', manifest.inputs, files)
  const inventoryFile = namedJson<SourceInventory>('source-inventory', manifest.inputs, files)
  const inventoryInput = currentInputs.find(value => value.name === 'source-inventory')
  if (!inventoryInput) throw new Error('Certification source inventory binding is missing')
  const inventoryBinding: CertificationInventoryBinding = {
    checksum: inventoryInput.checksum,
    observedAt: inventoryFile.observedAt,
    complete: inventoryFile.complete,
  }
  files.clear()

  const evaluation = evaluateCertification({
    index,
    ledger,
    inventory: inventoryFile,
    acceptedArtifactChecksums: acceptedManifest.artifacts.map(artifact => artifact.checksum),
  })
  const calibrationIssues = calibrationEvidenceIssues(index, ledger, calibrationResults)
  const chronologyIssues = certificationChronologyIssues(
    manifest.certifiedAt,
    ledger,
    calibrationResults,
    inventoryFile.observedAt
  )
  const populationIssues = boundReviewPopulationIssues(index, catalog, officialLedger, reconciliation, review)
  const manifestIssues = verifyCertificationManifest({
    manifest,
    evaluation,
    currentInputs,
    ledger,
    inventory: inventoryBinding,
    protocolVersion: protocol.protocolVersion,
    rubricVersion: rubric.rubricVersion,
  })
  const expectedCommittedSummary = {
    ...evaluation.summary,
    boundChecksums: manifest.inputs,
  }
  const summaryIssues: CertificationIssue[] = []
  try {
    const committedSummary = await readJson<unknown>(path.join(directory, 'summary.json'))
    if (stableCompactJson(committedSummary) !== stableCompactJson(expectedCommittedSummary)) {
      summaryIssues.push({
        code: 'stale-summary',
        path: 'summary.json',
        message: 'Checked-in certification summary does not match the evaluated evidence',
        state: 'stale',
        subject: 'summary.json',
      })
    }
  } catch {
    summaryIssues.push({
      code: 'stale-summary',
      path: 'summary.json',
      message: 'Checked-in certification summary is missing or malformed',
      state: 'stale',
      subject: 'summary.json',
    })
  }
  const issues = [
    ...evaluation.issues,
    ...calibrationIssues,
    ...chronologyIssues,
    ...populationIssues,
    ...manifestIssues,
    ...summaryIssues,
  ].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message)
  )
  const status = combinedStatus(evaluation.status, [
    ...calibrationIssues,
    ...chronologyIssues,
    ...populationIssues,
    ...manifestIssues,
    ...summaryIssues,
  ])
  const summary = { ...expectedCommittedSummary, status, issues }

  if (arguments_.full) {
    const workspaceIndex = await readJson<unknown>(
      repoPath(repoRoot, arguments_.workspaceIndexPath ?? DEFAULT_WORKSPACE_INDEX)
    )
    if (stableCompactJson(workspaceIndex) !== stableCompactJson(index)) {
      throw new Error('Prepared local review index differs from the checked-in certification index')
    }
    const pairs = await loadReviewPacketPairs(
      repoPath(repoRoot, arguments_.workspacePath ?? DEFAULT_WORKSPACE)
    )
    assertReviewIndexMatchesPacketPairs(index, pairs)
    const packets = pairs.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
    const fullLedger = reviewLedgerWithResults(ledger, calibrationResults)
    assertAgentBlindDerivations(fullLedger, pairs)
    const fullLedgerIssues = validateReviewLedger(fullLedger, packets)
    if (fullLedgerIssues.length) {
      throw new Error(
        `Full review evidence validation failed: ${fullLedgerIssues[0].code} ` +
          `${fullLedgerIssues[0].path}: ${fullLedgerIssues[0].message}`
      )
    }
  }
  return {
    ok: status === 'pass' && !issues.length,
    status,
    issues,
    summary,
    evaluation,
  }
}

const run = async (): Promise<void> => {
  const result = await runCertificationCheck(parseCertificationCommandArguments(process.argv.slice(2)))
  console.log(
    `AoS 4 certification ${result.status}: ` +
      `${result.summary.outcomeCounts.pass} pass, ` +
      `${result.summary.outcomeCounts.finding} finding, ` +
      `${result.summary.outcomeCounts['cannot-verify']} cannot-verify`
  )
  result.issues.forEach(value => console.error(`- ${value.code} ${value.path}: ${value.message}`))
  if (!result.ok) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
