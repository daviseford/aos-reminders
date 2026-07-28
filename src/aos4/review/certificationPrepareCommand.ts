import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ArtifactManifest } from '../data'
import { stableCompactJson, stableJson } from '../generate/serialization'
import {
  checksumCertificationText,
  createCertificationManifest,
  evaluateCertification,
  type ReviewProtocolDefinition,
  type ReviewRubricDefinition,
  type SourceInventory,
} from './certification'
import { parseReviewLedgerSupplement, validateReviewLedger } from './findings'
import type { ReviewPacketSafeIndex } from './packets'
import {
  assertCreateOnlyDirectoryComplete,
  loadReviewPacketPairs,
  writeCreateOnlyFilesDirectory,
} from './reviewWorkspace'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  type CertificationInput,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'

const DEFAULT_INDEX = path.join('.cache', 'aos4', 'review', 'workspace', 'index.json')
const DEFAULT_WORKSPACE = path.join('.cache', 'aos4', 'review', 'workspace', 'workspace.json')
const DEFAULT_REVIEW_OUTPUT = path.join('.cache', 'aos4', 'review', 'adversarial-review')
const DEFAULT_INVENTORY = path.join('.cache', 'aos4', 'review', 'source-inventory.json')

const EXISTING_INPUTS = {
  'accepted-manifest': path.join('data', 'aos4', 'manifests', 'accepted-2026-07-27.json'),
  'corpus-review': path.join('data', 'aos4', 'reviews', 'corpus-2026-07-27.json'),
  'audit-catalog': path.join('data', 'aos4', 'catalog', 'catalog.json'),
  'reconciliation-report': path.join('data', 'aos4', 'reports', 'corpus-2026-07-27-reconciliation.json'),
  'official-ledger': path.join('data', 'aos4', 'catalog', 'official-battle-profiles.json'),
  'runtime-catalog': path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json'),
  'source-observation-classifications': path.join(
    'data',
    'aos4',
    'reviews',
    'source-observation-classifications-2026-07-28.json'
  ),
} as const

const GENERATED_INPUT_FILES = {
  'review-protocol': 'protocol.json',
  'review-rubric': 'rubric.json',
  'review-index': 'review-index.json',
  'review-assignments': 'assignments.json',
  'review-calibrations': 'calibrations.json',
  'review-results': 'results.json',
  'review-findings': 'findings.json',
  'review-resolutions': 'resolutions.json',
  'review-verifications': 'verifications.json',
  'review-signoffs': 'signoffs.json',
  'source-inventory': 'source-inventory.json',
  'human-sample': 'human-sample.json',
} as const

const CERTIFICATION_SHARD_SIZE = 5_000

interface CertificationPreparationArguments {
  output: string
  reviewOutput: string
  inventory: string
  index: string
  workspace: string
  humanLedger?: string
  evaluatedAt: string
  requirePass: boolean
}

interface AdversarialResultIndex {
  schemaVersion: 1
  revision: string
  reviewer: ReviewerMetadata
  assignmentId: ReviewAssignment['id']
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
    requirePass: false,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (
      value === '--output' ||
      value === '--review-output' ||
      value === '--inventory' ||
      value === '--index' ||
      value === '--workspace' ||
      value === '--human-ledger' ||
      value === '--evaluated-at'
    ) {
      const next = nextValue(values, index, value)
      if (value === '--output') parsed.output = next
      else if (value === '--review-output') parsed.reviewOutput = next
      else if (value === '--inventory') parsed.inventory = next
      else if (value === '--index') parsed.index = next
      else if (value === '--workspace') parsed.workspace = next
      else if (value === '--human-ledger') parsed.humanLedger = next
      else parsed.evaluatedAt = next
      index += 1
    } else if (value === '--require-pass') {
      parsed.requirePass = true
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

const loadAdversarialLedger = async (reviewOutput: string, revision: string): Promise<ReviewLedger> => {
  await assertCreateOnlyDirectoryComplete(reviewOutput)
  const [assignment, calibration, resultIndex, persistedFindings] = await Promise.all([
    readJson<ReviewAssignment>(path.join(reviewOutput, 'assignment.json')),
    readJson<ReviewCalibration>(path.join(reviewOutput, 'calibration.json')),
    readJson<AdversarialResultIndex>(path.join(reviewOutput, 'results-index.json')),
    readJson<ReviewFinding[]>(path.join(reviewOutput, 'findings.json')),
  ])
  if (
    resultIndex.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
    resultIndex.revision !== revision ||
    resultIndex.assignmentId !== assignment.id
  ) {
    throw new Error('Adversarial review output does not match the prepared review index')
  }

  const results: ReviewerResult[] = []
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
  results.sort(
    (left, right) =>
      left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
  )
  if (!sameJson(collectionCounts(results), resultIndex.outcomeCounts)) {
    throw new Error('Adversarial review outcome counts do not match its result shards')
  }
  const findings = results
    .flatMap(result => result.findings)
    .sort((left, right) => left.id.localeCompare(right.id))
  if (!sameJson(findings, persistedFindings)) {
    throw new Error('Adversarial review findings do not match its result shards')
  }
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: [assignment],
    calibrations: [calibration],
    results,
    findings,
    resolutions: [],
    verifications: [],
    signoffs: [],
  }
}

const byId = <T>(values: T[], id: (value: T) => string): T[] =>
  [...values].sort((left, right) => id(left).localeCompare(id(right)))

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

export const sourceSafeReviewLedger = (ledger: ReviewLedger): ReviewLedger => ({
  ...ledger,
  results: ledger.results.map(result =>
    result.blindExpectedInterpretation === undefined
      ? result
      : {
          ...result,
          blindExpectedInterpretation: {
            interpretationChecksum: checksumReviewRecord(result.blindExpectedInterpretation),
            shape: interpretationShape(result.blindExpectedInterpretation),
          },
        }
  ),
})

export const mergeReviewLedgers = (machine: ReviewLedger, human?: ReviewLedger): ReviewLedger => {
  if (!human) return machine
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    assignments: byId([...machine.assignments, ...human.assignments], value => value.id),
    calibrations: byId(
      [...machine.calibrations, ...human.calibrations],
      value => `${value.reviewerConfigurationId}:${value.calibratedAt}`
    ),
    results: byId([...machine.results, ...human.results], value => `${value.assignmentId}:${value.packetId}`),
    findings: byId([...machine.findings, ...human.findings], value => value.id),
    resolutions: byId(
      [...machine.resolutions, ...human.resolutions],
      value => `${value.findingId}:${value.resolvedAt}`
    ),
    verifications: byId(
      [...machine.verifications, ...human.verifications],
      value => `${value.findingId}:${value.verifiedAt}`
    ),
    signoffs: byId([...machine.signoffs, ...human.signoffs], value => value.id),
  }
}

const protocolDefinition = (): ReviewProtocolDefinition => ({
  schemaVersion: 1,
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  promptVersion: 'aos4-review-prompt/v1',
  evidenceHandling: 'untrusted-source-data',
  blindInterpretationRequired: true,
})

const rubricDefinition = (): ReviewRubricDefinition => ({
  schemaVersion: 1,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  allowedOutcomes: ['pass', 'finding', 'cannot-verify'],
  materialSeverities: ['blocker', 'major'],
  acceptedLimitationPolicy:
    'Only minor limitations that cannot mislead runtime game meaning may be accepted, and each requires explicit human sign-off.',
})

const humanSample = (index: ReviewPacketSafeIndex) => {
  const entries = index.entries.filter(entry => entry.humanSample)
  const factionContextStrata = Array.from(
    new Set(
      entries.flatMap(entry =>
        entry.factionIds.flatMap(factionId =>
          entry.rulesContextIds.map(rulesContextId => `${factionId}|${rulesContextId}`)
        )
      )
    )
  ).sort()
  const highRiskCohorts = Array.from(
    new Set(
      entries.flatMap(entry =>
        entry.cohortIds.filter(cohort => index.coverage.highRiskCohorts.includes(cohort))
      )
    )
  ).sort()
  if (
    !index.coverage.factionContextStrata.every(stratum => factionContextStrata.includes(stratum)) ||
    !index.coverage.highRiskCohorts.every(cohort => highRiskCohorts.includes(cohort))
  ) {
    throw new Error('Human sample does not cover every required faction/context and high-risk cohort')
  }
  return {
    schemaVersion: 1,
    revision: index.revision,
    protocolVersion: index.protocolVersion,
    rubricVersion: index.rubricVersion,
    rationale:
      'Deterministic stratified sample covering every faction/context stratum and every required high-risk cohort; no item was selected from its generated outcome.',
    sampleSize: entries.length,
    factionContextStrata,
    highRiskCohorts,
    entries,
  }
}

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
  indexManifest: ShardedReviewIndex
  resultManifest: ShardedReviewResults
  files: Map<string, string>
  inputs: Array<{ name: string; fileName: string }>
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
  const humanLedgerPath = arguments_.humanLedger
    ? withinRepository(resolvedRoot, arguments_.humanLedger)
    : undefined

  const [index, inventory, acceptedManifest, pairs] = await Promise.all([
    readJson<ReviewPacketSafeIndex>(indexPath),
    readJson<SourceInventory>(inventoryPath),
    readJson<ArtifactManifest>(withinRepository(resolvedRoot, EXISTING_INPUTS['accepted-manifest'])),
    loadReviewPacketPairs(workspacePath),
  ])
  if (
    index.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
    index.protocolVersion !== AOS4_REVIEW_PROTOCOL_VERSION ||
    index.rubricVersion !== AOS4_REVIEW_RUBRIC_VERSION ||
    inventory.revision !== index.revision
  ) {
    throw new Error('Review index, source inventory, protocol, rubric, or revision do not match')
  }
  const machineLedger = await loadAdversarialLedger(reviewOutput, index.revision)
  const humanLedger = humanLedgerPath
    ? parseReviewLedgerSupplement(await readJson<unknown>(humanLedgerPath))
    : undefined
  const reviewLedger = mergeReviewLedgers(machineLedger, humanLedger)
  const packets = pairs.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
  const ledgerIssues = validateReviewLedger(reviewLedger, packets)
  if (ledgerIssues.length) {
    throw new Error(
      `Adversarial review ledger is invalid: ${ledgerIssues[0].code} ` +
        `${ledgerIssues[0].path}: ${ledgerIssues[0].message}`
    )
  }
  const ledger = sourceSafeReviewLedger(reviewLedger)

  const protocol = protocolDefinition()
  const rubric = rubricDefinition()
  const sharded = shardedCertificationFiles(index, ledger.results)
  const generatedValues = {
    'review-protocol': protocol,
    'review-rubric': rubric,
    'review-index': sharded.indexManifest,
    'review-assignments': ledger.assignments,
    'review-calibrations': ledger.calibrations,
    'review-results': sharded.resultManifest,
    'review-findings': ledger.findings,
    'review-resolutions': ledger.resolutions,
    'review-verifications': ledger.verifications,
    'review-signoffs': ledger.signoffs,
    'source-inventory': inventory,
    'human-sample': humanSample(index),
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
  const generatedInputs = Object.entries(GENERATED_INPUT_FILES).map(([name, fileName]) =>
    textInput(name, `${outputRelative}/${fileName}`, generatedTexts.get(fileName)!)
  )
  generatedInputs.push(
    ...sharded.inputs.map(({ name, fileName }) =>
      textInput(name, `${outputRelative}/${fileName}`, generatedTexts.get(fileName)!)
    )
  )
  const existingInputs: CertificationInput[] = []
  for (const [name, relativePath] of Object.entries(EXISTING_INPUTS)) {
    const content = await readFile(withinRepository(resolvedRoot, relativePath), 'utf8')
    existingInputs.push(textInput(name, relativePath.replaceAll(path.sep, '/'), content))
  }
  const inputs = [...existingInputs, ...generatedInputs]
  const evaluation = evaluateCertification({
    index,
    ledger,
    inventory,
    acceptedArtifactChecksums: acceptedManifest.artifacts.map(artifact => artifact.checksum),
  })
  const nonHumanIssues = evaluation.issues.filter(
    issue => issue.code !== 'missing-human-review' && issue.code !== 'missing-human-signoff'
  )
  if (nonHumanIssues.length) {
    throw new Error(
      `Certification preparation found a non-human blocker: ${nonHumanIssues[0].code} ` +
        `${nonHumanIssues[0].path}: ${nonHumanIssues[0].message}`
    )
  }
  if (arguments_.requirePass && !evaluation.ok) {
    throw new Error(
      `Certification is ${evaluation.status}; ${evaluation.issues.length} human review or sign-off issues remain`
    )
  }
  const inventoryInput = generatedInputs.find(input => input.name === 'source-inventory')!
  const manifest = createCertificationManifest({
    evaluation,
    inputs,
    ledger,
    inventory: {
      checksum: inventoryInput.checksum,
      observedAt: inventory.observedAt,
      complete: inventory.complete,
    },
    certifiedAt: arguments_.evaluatedAt,
    protocolVersion: protocol.protocolVersion,
    rubricVersion: rubric.rubricVersion,
  })
  generatedTexts.set('manifest.json', stableJson(manifest))
  generatedTexts.set(
    'summary.json',
    stableJson({
      ...evaluation.summary,
      boundChecksums: manifest.inputs,
    })
  )
  await writeCreateOnlyFilesDirectory(output, generatedTexts)
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
