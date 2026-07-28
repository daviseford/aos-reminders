import { access, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import { emptyReviewLedger, importReviewerResultsAtomic } from './certification'
import { validateReviewLedger } from './findings'
import { createComparisonTask, type ReviewPacketPair, type ReviewPacketSafeIndex } from './packets'
import { loadReviewPacketPairs } from './reviewWorkspace'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  createReviewAssignment,
  reviewerConfigurationId,
  type HumanReviewSignoff,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewLedger,
  type ReviewPacket,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'

const REVIEW_CACHE = path.resolve('.cache', 'aos4', 'review')
const DEFAULT_INDEX = path.join(REVIEW_CACHE, 'index.json')
const DEFAULT_WORKSPACE = path.join(REVIEW_CACHE, 'workspace.json')

interface PrepareArguments {
  command: 'prepare'
  output: string
  reviewerId: string
  assignedAt: string
  index: string
  workspace: string
}

interface CompareArguments {
  command: 'compare'
  reviewDirectory: string
  blindResults: string
  workspace: string
}

interface CalibrationCompareArguments extends Omit<CompareArguments, 'command'> {
  command: 'calibrate'
}

interface StartArguments {
  command: 'start'
  reviewDirectory: string
  comparisonResults: string
  workspace: string
}

interface SubmitArguments {
  command: 'submit'
  reviewDirectory: string
  comparisonResults: string
  signedAt: string
  statement: string
  workspace: string
}

type Arguments =
  | PrepareArguments
  | CalibrationCompareArguments
  | StartArguments
  | CompareArguments
  | SubmitArguments

interface HumanReviewWorkspace {
  schemaVersion: 1
  revision: string
  assignment: ReviewAssignment
  samplePairKeys: string[]
  calibrationPairKeys: string[]
}

interface ResultCollection {
  schemaVersion: 1
  results: ReviewerResult[]
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

const canonicalInstant = (value: string, flag: string): string => {
  if (!value || Number.isNaN(new Date(value).valueOf()) || new Date(value).toISOString() !== value) {
    throw new Error(`${flag} requires a canonical ISO timestamp`)
  }
  return value
}

const optionMap = (values: string[], allowed: ReadonlySet<string>): Map<string, string> => {
  const options = new Map<string, string>()
  for (let index = 1; index < values.length; index += 1) {
    const flag = values[index]
    if (!allowed.has(flag)) throw new Error(`Unknown argument: ${flag}`)
    options.set(flag, nextValue(values, index, flag))
    index += 1
  }
  return options
}

export const parseHumanReviewArguments = (values: string[]): Arguments => {
  const command = values[0]
  if (
    command !== 'prepare' &&
    command !== 'calibrate' &&
    command !== 'start' &&
    command !== 'compare' &&
    command !== 'submit'
  ) {
    throw new Error('Human review command must be prepare, calibrate, start, compare, or submit')
  }
  if (command === 'prepare') {
    const options = optionMap(
      values,
      new Set(['--output', '--reviewer-id', '--assigned-at', '--index', '--workspace'])
    )
    const output = options.get('--output')
    const reviewerId = options.get('--reviewer-id')
    const assignedAt = options.get('--assigned-at')
    if (!output || !reviewerId || !assignedAt) {
      throw new Error('prepare requires --output, --reviewer-id, and --assigned-at')
    }
    return {
      command,
      output,
      reviewerId,
      assignedAt: canonicalInstant(assignedAt, '--assigned-at'),
      index: options.get('--index') ?? DEFAULT_INDEX,
      workspace: options.get('--workspace') ?? DEFAULT_WORKSPACE,
    }
  }

  const common = new Set([
    '--review-dir',
    '--workspace',
    ...(command === 'compare' || command === 'calibrate'
      ? ['--blind-results']
      : [
          '--comparison-results',
          ...(command === 'submit' ? ['--signed-at', '--statement'] : []),
        ]),
  ])
  const options = optionMap(values, common)
  const reviewDirectory = options.get('--review-dir')
  const workspace = options.get('--workspace') ?? DEFAULT_WORKSPACE
  if (!reviewDirectory) throw new Error(`${command} requires --review-dir`)
  if (command === 'compare' || command === 'calibrate') {
    const blindResults = options.get('--blind-results')
    if (!blindResults) throw new Error(`${command} requires --blind-results`)
    return { command, reviewDirectory, blindResults, workspace }
  }
  const comparisonResults = options.get('--comparison-results')
  if (command === 'start') {
    if (!comparisonResults) throw new Error('start requires --comparison-results')
    return { command, reviewDirectory, comparisonResults, workspace }
  }
  const signedAt = options.get('--signed-at')
  const statement = options.get('--statement')
  if (!comparisonResults || !signedAt || !statement) {
    throw new Error('submit requires --comparison-results, --signed-at, and --statement')
  }
  return {
    command,
    reviewDirectory,
    comparisonResults,
    signedAt: canonicalInstant(signedAt, '--signed-at'),
    statement,
    workspace,
  }
}

const insideReviewCache = (value: string): string => {
  const resolved = path.resolve(value)
  if (resolved !== REVIEW_CACHE && !resolved.startsWith(`${REVIEW_CACHE}${path.sep}`)) {
    throw new Error(`Human review artifacts must remain under ${REVIEW_CACHE}`)
  }
  return resolved
}

const withinDirectory = (directory: string, value: string): string => {
  const resolved = path.isAbsolute(value) ? path.resolve(value) : path.resolve(directory, value)
  if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`Human review input escapes its review directory: ${value}`)
  }
  return resolved
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const atomicDirectory = async (output: string, files: ReadonlyMap<string, string>): Promise<void> => {
  const exists = await access(output)
    .then(() => true)
    .catch(() => false)
  if (exists) throw new Error(`Human review output already exists: ${output}`)
  await mkdir(path.dirname(output), { recursive: true })
  const staging = `${output}.tmp-${process.pid}`
  try {
    await mkdir(staging)
    await Promise.all(
      Array.from(files, ([fileName, content]) => writeFile(path.join(staging, fileName), content, 'utf8'))
    )
    await rename(staging, output)
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    throw error
  }
}

const selectedPairs = (index: ReviewPacketSafeIndex, pairs: ReviewPacketPair[]): ReviewPacketPair[] => {
  const required = new Set(index.entries.filter(entry => entry.humanSample).map(entry => entry.pairKey))
  const selected = pairs.filter(pair => required.has(pair.pairKey))
  if (selected.length !== required.size) {
    throw new Error(`Prepared workspace contains ${selected.length}/${required.size} human sample pairs`)
  }
  return selected.sort((left, right) => left.pairKey.localeCompare(right.pairKey))
}

const calibrationPairs = (pairs: ReviewPacketPair[]): ReviewPacketPair[] =>
  pairs.filter(pair => pair.calibration).sort((left, right) => left.pairKey.localeCompare(right.pairKey))

const reviewer = (id: string): ReviewerMetadata => ({
  id,
  kind: 'human',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: 'aos4-review-prompt/v1',
})

const templateResult = (assignment: ReviewAssignment, packet: ReviewPacket, blind: boolean) => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignmentId: assignment.id,
  packetId: packet.id,
  packetChecksum: packet.packetChecksum,
  reviewerConfigurationId: reviewerConfigurationId(assignment.reviewer),
  reviewedAt: null,
  outcome: null,
  rationale: '',
  ...(blind ? { blindExpectedInterpretation: null } : {}),
  findings: [],
})

const blindTasks = (pairs: ReviewPacketPair[]) =>
  pairs.map(pair => ({
    pairKey: pair.pairKey,
    factionIds: pair.factionIds,
    rulesContextIds: pair.blindPacket.rulesContextIds,
    blindPacket: pair.blindPacket,
    evidence: pair.evidence,
  }))

const prepare = async (arguments_: PrepareArguments): Promise<void> => {
  const output = insideReviewCache(arguments_.output)
  const [index, pairs] = await Promise.all([
    readJson<ReviewPacketSafeIndex>(path.resolve(arguments_.index)),
    loadReviewPacketPairs(path.resolve(arguments_.workspace)),
  ])
  const selected = selectedPairs(index, pairs)
  const calibration = calibrationPairs(pairs)
  if (!calibration.length) throw new Error('Prepared workspace contains no reviewer calibration cases')
  const assignedPairs = [...selected, ...calibration].sort((left, right) =>
    left.pairKey.localeCompare(right.pairKey)
  )
  const assignment = createReviewAssignment({
    packetIds: assignedPairs.flatMap(pair => [pair.blindPacket.id, pair.comparisonPacket.id]),
    reviewer: reviewer(arguments_.reviewerId),
    execution: 'human',
    assignedAt: arguments_.assignedAt,
  })
  const workspace: HumanReviewWorkspace = {
    schemaVersion: 1,
    revision: index.revision,
    assignment,
    samplePairKeys: selected.map(pair => pair.pairKey),
    calibrationPairKeys: calibration.map(pair => pair.pairKey),
  }
  await atomicDirectory(
    output,
    new Map([
      ['workspace.json', stableJson(workspace)],
      [
        'calibration-blind-tasks.json',
        stableJson({
          schemaVersion: 1,
          revision: index.revision,
          instructions:
            'Interpret only the delimited source evidence. Calibration expectations are concealed until every blind result is saved.',
          tasks: blindTasks(calibration),
        }),
      ],
      [
        'calibration-blind-results.template.json',
        stableJson({
          schemaVersion: 1,
          results: calibration.map(pair => templateResult(assignment, pair.blindPacket, true)),
        }),
      ],
    ])
  )
  console.log(
    `Prepared ${calibration.length} concealed calibration tasks before ${selected.length} sample pairs in ${output}`
  )
}

const reviewContext = async (reviewDirectory: string, workspacePath: string) => {
  const directory = insideReviewCache(reviewDirectory)
  const [humanWorkspace, pairs] = await Promise.all([
    readJson<HumanReviewWorkspace>(path.join(directory, 'workspace.json')),
    loadReviewPacketPairs(path.resolve(workspacePath)),
  ])
  const pairByKey = new Map(pairs.map(pair => [pair.pairKey, pair]))
  const resolvePairs = (pairKeys: string[]) =>
    pairKeys.map(pairKey => {
      const pair = pairByKey.get(pairKey)
      if (!pair) throw new Error(`Human review pair is stale or missing: ${pairKey}`)
      return pair
    })
  const selected = resolvePairs(humanWorkspace.samplePairKeys)
  const calibration = resolvePairs(humanWorkspace.calibrationPairKeys)
  const assigned = [...selected, ...calibration].sort((left, right) =>
    left.pairKey.localeCompare(right.pairKey)
  )
  if (calibration.some(pair => !pair.calibration)) {
    throw new Error('Human calibration pair no longer matches the prepared workspace')
  }
  if (selected.some(pair => pair.calibration)) {
    throw new Error('Human sample pair is incorrectly marked as calibration')
  }
  return { directory, humanWorkspace, selected, calibration, assigned }
}

const importedHumanLedger = (
  assignment: ReviewAssignment,
  results: ReviewerResult[],
  pairs: ReviewPacketPair[]
): ReviewLedger =>
  importReviewerResultsAtomic(
    {
      ...emptyReviewLedger(),
      assignments: [assignment],
    },
    results,
    pairs.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
  )

const compare = async (arguments_: CompareArguments): Promise<void> => {
  const { directory, humanWorkspace, assigned } = await reviewContext(
    arguments_.reviewDirectory,
    arguments_.workspace
  )
  const target = path.join(directory, 'comparison-tasks.json')
  if (
    await access(target)
      .then(() => true)
      .catch(() => false)
  ) {
    throw new Error(`Comparison tasks already exist: ${target}`)
  }
  const blindCollection = await readJson<ResultCollection>(
    withinDirectory(directory, arguments_.blindResults)
  )
  const ledger = importedHumanLedger(humanWorkspace.assignment, blindCollection.results, assigned)
  const blindByPacketId = new Map(ledger.results.map(result => [result.packetId, result]))
  const tasks = assigned.map(pair => {
    const blindResult = blindByPacketId.get(pair.blindPacket.id)
    if (!blindResult) throw new Error(`Blind result is missing: ${pair.blindPacket.id}`)
    return {
      ...createComparisonTask(pair, blindResult),
      comparisonPacket: pair.comparisonPacket,
    }
  })
  await Promise.all([
    writeFile(path.join(directory, 'blind-results.json'), stableJson(blindCollection), 'utf8'),
    writeFile(target, stableJson({ schemaVersion: 1, tasks }), 'utf8'),
    writeFile(
      path.join(directory, 'comparison-results.template.json'),
      stableJson({
        schemaVersion: 1,
        results: assigned.map(pair =>
          templateResult(humanWorkspace.assignment, pair.comparisonPacket, false)
        ),
      }),
      'utf8'
    ),
  ])
  console.log(`Prepared ${tasks.length} comparison tasks after blind results were saved`)
}

const assertCompleteSequence = (results: ReviewerResult[], selected: ReviewPacketPair[]): void => {
  const byPacketId = new Map(results.map(result => [result.packetId, result]))
  selected.forEach(pair => {
    const blind = byPacketId.get(pair.blindPacket.id)
    const comparison = byPacketId.get(pair.comparisonPacket.id)
    if (!blind || !comparison) {
      throw new Error(`Human review pair is incomplete: ${pair.pairKey}`)
    }
    if (
      pair.blindDerivationRequired &&
      (blind.blindExpectedInterpretation === undefined || blind.blindExpectedInterpretation === null)
    ) {
      throw new Error(`Blind interpretation is missing: ${pair.blindPacket.id}`)
    }
    if (blind.reviewedAt >= comparison.reviewedAt) {
      throw new Error(`Comparison was not recorded after blind review: ${pair.pairKey}`)
    }
  })
}

const humanCalibration = (
  assignment: ReviewAssignment,
  pairs: ReviewPacketPair[],
  results: ReviewerResult[]
): ReviewCalibration => {
  const resultByPacketId = new Map(results.map(result => [result.packetId, result]))
  const blind = (pair: ReviewPacketPair): ReviewerResult => {
    const result = resultByPacketId.get(pair.blindPacket.id)
    if (!result) throw new Error(`Calibration blind result is missing: ${pair.pairKey}`)
    return result
  }
  const comparison = (pair: ReviewPacketPair): ReviewerResult => {
    const result = resultByPacketId.get(pair.comparisonPacket.id)
    if (!result) throw new Error(`Calibration comparison result is missing: ${pair.pairKey}`)
    return result
  }
  const defects = pairs.filter(pair => pair.calibrationKind === 'defect')
  const insufficient = pairs.filter(pair => pair.calibrationKind === 'insufficient-evidence')
  const foundDefects = defects.filter(pair => {
    const result = comparison(pair)
    return (
      result.outcome === 'finding' &&
      result.findings.some(finding => finding.severity === 'blocker' || finding.severity === 'major')
    )
  }).length
  const unsupportedExpectedValues = pairs
    .filter(pair => pair.calibrationKind !== 'defect')
    .reduce((total, pair) => total + comparison(pair).findings.length, 0)
  const correctCannotVerify = insufficient.filter(pair => comparison(pair).outcome === 'cannot-verify').length
  const correctBlindOutcomes = pairs.every(pair =>
    pair.calibrationKind === 'insufficient-evidence'
      ? blind(pair).outcome === 'cannot-verify'
      : blind(pair).outcome === 'pass'
  )
  const correctComparisonOutcomes = pairs.every(pair => {
    if (pair.calibrationKind === 'defect') return comparison(pair).outcome === 'finding'
    if (pair.calibrationKind === 'insufficient-evidence') {
      return comparison(pair).outcome === 'cannot-verify'
    }
    return comparison(pair).outcome === 'pass'
  })
  const calibratedAt = pairs
    .map(pair => comparison(pair).reviewedAt)
    .sort()
    .at(-1)!
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    reviewerConfigurationId: reviewerConfigurationId(assignment.reviewer),
    rubricVersion: pairs[0]?.comparisonPacket.rubricVersion ?? '',
    calibratedAt,
    seededBlockerMajorDefects: defects.length,
    foundSeededBlockerMajorDefects: foundDefects,
    unsupportedExpectedValues,
    insufficientEvidenceCases: insufficient.length,
    correctCannotVerifyCases: correctCannotVerify,
    passed:
      foundDefects === defects.length &&
      unsupportedExpectedValues === 0 &&
      correctCannotVerify === insufficient.length &&
      correctBlindOutcomes &&
      correctComparisonOutcomes,
  }
}

const submit = async (arguments_: SubmitArguments): Promise<void> => {
  const { directory, humanWorkspace, selected, calibration, assigned } = await reviewContext(
    arguments_.reviewDirectory,
    arguments_.workspace
  )
  const [blindCollection, comparisonCollection] = await Promise.all([
    readJson<ResultCollection>(path.join(directory, 'blind-results.json')),
    readJson<ResultCollection>(withinDirectory(directory, arguments_.comparisonResults)),
  ])
  const results = [...blindCollection.results, ...comparisonCollection.results]
  const reviewed = importedHumanLedger(humanWorkspace.assignment, results, assigned)
  if (reviewed.results.length !== assigned.length * 2) {
    throw new Error(`Human review is incomplete: ${reviewed.results.length}/${assigned.length * 2} results`)
  }
  assertCompleteSequence(reviewed.results, assigned)
  const calibrationRecord = humanCalibration(humanWorkspace.assignment, calibration, reviewed.results)
  if (!calibrationRecord.passed) {
    throw new Error(
      `Human reviewer calibration failed: ${calibrationRecord.foundSeededBlockerMajorDefects}/` +
        `${calibrationRecord.seededBlockerMajorDefects} material defects, ` +
        `${calibrationRecord.unsupportedExpectedValues} unsupported expected values, ` +
        `${calibrationRecord.correctCannotVerifyCases}/` +
        `${calibrationRecord.insufficientEvidenceCases} cannot-verify`
    )
  }
  const samplePacketIds = new Set(selected.flatMap(pair => [pair.blindPacket.id, pair.comparisonPacket.id]))
  const sampleResults = reviewed.results.filter(result => samplePacketIds.has(result.packetId))
  const ledger = importedHumanLedger(humanWorkspace.assignment, sampleResults, assigned)
  const firstSampleReviewedAt = [...ledger.results].map(result => result.reviewedAt).sort()[0]
  if (calibrationRecord.calibratedAt >= firstSampleReviewedAt) {
    throw new Error('Human sample review must begin only after reviewer calibration passes')
  }
  const nonPass = ledger.results.filter(result => result.outcome !== 'pass')
  if (nonPass.length) {
    throw new Error(
      `Human review has ${nonPass.length} finding or cannot-verify outcome(s); adjudicate them before sign-off`
    )
  }
  const lastReviewedAt = [...ledger.results]
    .map(result => result.reviewedAt)
    .sort()
    .at(-1)!
  if (arguments_.signedAt <= lastReviewedAt) {
    throw new Error('--signed-at must be later than every reviewed result')
  }
  const signoffIdentity = {
    reviewerId: humanWorkspace.assignment.reviewer.id,
    packetIds: selected.map(pair => pair.comparisonPacket.id),
    factionIds: Array.from(new Set(selected.flatMap(pair => pair.factionIds))).sort(),
    rulesContextIds: Array.from(
      new Set(selected.flatMap(pair => pair.comparisonPacket.rulesContextIds))
    ).sort(),
    acceptedLimitationFindingIds: [],
    statement: arguments_.statement,
  }
  const signoff: HumanReviewSignoff = {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    id: `human-signoff:sha256:${checksumReviewRecord(signoffIdentity)}`,
    ...signoffIdentity,
    signedAt: arguments_.signedAt,
  }
  const submissionLedger: ReviewLedger = {
    ...ledger,
    calibrations: [calibrationRecord],
    signoffs: [signoff],
  }
  const issues = validateReviewLedger(
    submissionLedger,
    selected.flatMap(pair => [pair.blindPacket, pair.comparisonPacket])
  )
  if (issues.length) {
    throw new Error(`Human submission is invalid: ${issues[0].code} ${issues[0].path}: ${issues[0].message}`)
  }
  const target = path.join(directory, 'ledger.json')
  if (
    await access(target)
      .then(() => true)
      .catch(() => false)
  ) {
    throw new Error(`Human ledger already exists: ${target}`)
  }
  await writeFile(target, stableJson(submissionLedger), 'utf8')
  console.log(`Prepared signed human ledger for ${selected.length} review pairs`)
}

const run = async (): Promise<void> => {
  const arguments_ = parseHumanReviewArguments(process.argv.slice(2))
  if (arguments_.command === 'prepare') await prepare(arguments_)
  else if (arguments_.command === 'compare') await compare(arguments_)
  else await submit(arguments_)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
