import { createHash } from 'node:crypto'
import {
  AOS4_CERTIFICATION_SCHEMA_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  reviewerConfigurationId,
  reviewCalibrationForAssignment,
  type CertificationCoverage,
  type CertificationInput,
  type CertificationManifest,
  type FindingResolution,
  type FindingVerification,
  type ReviewAssignment,
  type ReviewAuthority,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewOutcome,
  type ReviewPacket,
  type ReviewPacketId,
  type ReviewSeverity,
  type ReviewerResult,
} from './records'
import { ReviewValidationError, validateReviewLedger, type ReviewValidationIssue } from './findings'
import {
  CALIBRATION_CASE_KINDS,
  CALIBRATION_CONTROL_CANDIDATE_KEYS,
  calibrationControlOutcomes,
  type CalibrationCaseKind,
  type ReviewCandidateCategory,
  type ReviewPacketIndexEntry,
  type ReviewPacketSafeIndex,
  reviewIndexSamplingMetadataChecksum,
} from './packets'

const SHA256_PATTERN = /^[0-9a-f]{64}$/i
const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

export const REQUIRED_CERTIFICATION_INPUTS = [
  'accepted-manifest',
  'corpus-review',
  'audit-catalog',
  'reconciliation-report',
  'official-ledger',
  'runtime-catalog',
  'review-protocol',
  'review-rubric',
  'review-index',
  'review-assignments',
  'review-calibrations',
  'review-calibration-results',
  'review-results',
  'review-findings',
  'review-resolutions',
  'review-verifications',
  'source-inventory',
] as const
export const REQUIRED_CERTIFICATION_INPUT_NAMES = REQUIRED_CERTIFICATION_INPUTS

export type RequiredCertificationInputName = (typeof REQUIRED_CERTIFICATION_INPUTS)[number]

export type CertificationIssueCode =
  | 'invalid-review-index'
  | 'invalid-ledger'
  | 'stale-summary'
  | 'protocol-mismatch'
  | 'missing-calibration'
  | 'failed-calibration'
  | 'invalid-calibration-evidence'
  | 'certification-before-evidence'
  | 'calibration-after-review'
  | 'missing-blind-result'
  | 'missing-blind-interpretation'
  | 'missing-comparison-result'
  | 'comparison-before-blind'
  | 'cannot-verify'
  | 'stale-packet'
  | 'partial-import'
  | 'partial-review-import'
  | 'incomplete-coverage'
  | 'open-finding'
  | 'missing-verification'
  | 'unverified-material-finding'
  | 'rejected-verification'
  | 'invalid-source-inventory'
  | 'incomplete-source-inventory'
  | 'unmatched-source-artifact'
  | 'missing-certification-input'
  | 'duplicate-certification-input'
  | 'stale-input'
  | 'stale-bound-input'
  | 'stale-ledger'
  | 'stale-inventory'
  | 'stale-protocol'
  | 'stale-coverage'
  | 'manifest-not-passing'
  | 'unaccepted-profile-only-unit'
  | 'invalid-profile-only-deviation'
  | 'stale-profile-only-deviation'

export interface CertificationIssue {
  code: CertificationIssueCode
  state: 'blocked' | 'stale'
  path: string
  subject: string
  message: string
}

export interface CertificationCoverageDetail {
  reviewed: number
  expected: number
}

export interface CertificationOpenLimitation {
  findingId: ReviewFinding['id']
  subject: ReviewFinding['subject']
  rationale: string
  resolutionRationale: string
  owner: string
}

export interface CertificationSummary {
  schemaVersion: typeof AOS4_CERTIFICATION_SCHEMA_VERSION
  revision: string
  status: CertificationManifest['status']
  coverage: CertificationCoverage
  coverageByCohort: Record<string, CertificationCoverageDetail>
  coverageByFaction: Record<string, CertificationCoverageDetail>
  coverageByContext: Record<string, CertificationCoverageDetail>
  coverageBySourceClass: Record<ReviewAuthority, CertificationCoverageDetail>
  boundChecksums: CertificationInput[]
  outcomeCounts: Record<ReviewOutcome, number>
  outcomes: {
    pass: number
    finding: number
    cannotVerify: number
  }
  severityCounts: Record<ReviewSeverity, number>
  findingCountsByField: Record<string, number>
  findings: {
    total: number
    resolved: number
    open: number
  }
  openLimitations: CertificationOpenLimitation[]
  correctionVerification: {
    required: number
    verified: number
    rejected: number
    missing: number
  }
  regressionCases: CertificationCoverageDetail
  sourceInventory: {
    total: number
    matched: number
    explicitlyNonMaterial: number
    unresolved: number
  }
  issues: CertificationIssue[]
}

export interface CertificationInventoryBinding {
  checksum: string
  observedAt: string
  complete: boolean
}

export interface ReviewProtocolDefinition {
  schemaVersion: 1
  protocolVersion: string
  rubricVersion: string
  promptVersion: string
  evidenceHandling: 'untrusted-source-data'
  blindInterpretationRequired: boolean
}

export interface ReviewRubricDefinition {
  schemaVersion: 1
  rubricVersion: string
  allowedOutcomes: ReviewOutcome[]
  materialSeverities: Array<'blocker' | 'major'>
  acceptedLimitationPolicy: string
}

export type SourceInventoryStatus =
  'matched' | 'explicit-non-material' | 'missing' | 'unexpected' | 'inaccessible' | 'ambiguous'

export interface SourceInventoryEntry {
  publisher: 'games-workshop' | 'wahapedia' | 'bsdata'
  url: string
  title: string
  status: SourceInventoryStatus
  acceptedArtifactChecksum?: string
  disposition?: string
}

export interface SourceInventory {
  schemaVersion: 1
  revision: string
  observedAt: string
  producedBy: string
  independentFromAcceptedManifest: boolean
  complete: boolean
  entries: SourceInventoryEntry[]
}

export interface CertificationEvaluationInput {
  index: ReviewPacketSafeIndex
  ledger: ReviewLedger
  inventory: SourceInventory
  acceptedArtifactChecksums: string[]
}

export type CertificationEvaluationSummary = Omit<CertificationSummary, 'boundChecksums'>

export interface CertificationEvaluation {
  ok: boolean
  status: CertificationManifest['status']
  issues: CertificationIssue[]
  summary: CertificationEvaluationSummary
}

const compareText = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)

const uniqueSorted = <T extends string>(values: Iterable<T>): T[] =>
  Array.from(new Set(values)).sort(compareText)

const sortedIssues = (issues: CertificationIssue[]): CertificationIssue[] =>
  [...issues].sort(
    (left, right) =>
      compareText(left.path, right.path) ||
      compareText(left.code, right.code) ||
      compareText(left.message, right.message)
  )

const issue = (
  code: CertificationIssueCode,
  path: string,
  message: string,
  state: CertificationIssue['state'] = 'blocked',
  subject = path
): CertificationIssue => ({ code, state, path, subject, message })

export const checksumCertificationText = (value: string): string =>
  createHash('sha256').update(value.replaceAll('\r\n', '\n'), 'utf8').digest('hex')

export const certificationProtocolChecksum = (
  protocol: ReviewProtocolDefinition,
  rubric: ReviewRubricDefinition
): string => checksumReviewRecord({ protocol, rubric })

const count = (reviewed: number, expected: number): CertificationCoverageDetail => ({
  reviewed,
  expected,
})

const isChecksum = (value: unknown): value is string =>
  typeof value === 'string' && SHA256_PATTERN.test(value)

const isInstant = (value: unknown): value is string =>
  typeof value === 'string' && ISO_INSTANT_PATTERN.test(value) && !Number.isNaN(new Date(value).valueOf())

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim())

const sortedResults = (results: ReviewerResult[]): ReviewerResult[] =>
  [...results].sort(
    (left, right) =>
      compareText(left.assignmentId, right.assignmentId) || compareText(left.packetId, right.packetId)
  )

const calibrationControlEntries = (index: ReviewPacketSafeIndex): ReviewPacketIndexEntry[] =>
  index.entries
    .filter(entry => entry.calibration)
    .sort((left, right) => compareText(left.pairKey, right.pairKey))

export const calibrationControlSetChecksum = (index: ReviewPacketSafeIndex): string =>
  checksumReviewRecord(
    calibrationControlEntries(index).map(entry => ({
      pairKey: entry.pairKey,
      calibrationKind: entry.calibrationKind,
      blindPacketId: entry.blindPacketId,
      comparisonPacketId: entry.comparisonPacketId,
    }))
  )

export const createCalibrationEvidenceReceipt = (
  assignmentId: ReviewAssignment['id'],
  index: ReviewPacketSafeIndex,
  results: ReviewerResult[]
) => {
  const entries = calibrationControlEntries(index)
  const blindIds = new Set(entries.map(entry => entry.blindPacketId))
  const comparisonIds = new Set(entries.map(entry => entry.comparisonPacketId))
  const blindResults = sortedResults(results.filter(result => blindIds.has(result.packetId)))
  const comparisonResults = sortedResults(results.filter(result => comparisonIds.has(result.packetId)))
  const receipt = {
    assignmentId,
    blindResultsChecksum: checksumReviewRecord(blindResults),
    comparisonResultsChecksum: checksumReviewRecord(comparisonResults),
    controlPairKeysChecksum: calibrationControlSetChecksum(index),
  }
  return { ...receipt, receiptChecksum: checksumReviewRecord(receipt) }
}

const uniqueReviewFindings = (findings: ReviewFinding[]): ReviewFinding[] =>
  Array.from(new Map(findings.map(finding => [finding.id, finding])).values()).sort((left, right) =>
    left.id.localeCompare(right.id)
  )

export const reviewLedgerWithResults = (ledger: ReviewLedger, results: ReviewerResult[]): ReviewLedger => ({
  ...ledger,
  results: [...ledger.results, ...results],
  findings: uniqueReviewFindings([...ledger.findings, ...results.flatMap(result => result.findings)]),
})

export const calibrationEvidenceIssues = (
  index: ReviewPacketSafeIndex,
  ledger: ReviewLedger,
  calibrationResults: ReviewerResult[]
): CertificationIssue[] => {
  if (!Array.isArray(calibrationResults)) {
    return [
      issue(
        'invalid-calibration-evidence',
        'calibrationResults',
        'Calibration results must be a checksum-bound result array'
      ),
    ]
  }
  const issues: CertificationIssue[] = []
  const calibrationLedgerIssues = validateReviewLedger({
    schemaVersion: ledger.schemaVersion,
    assignments: ledger.assignments,
    calibrations: ledger.calibrations,
    results: calibrationResults,
    findings: uniqueReviewFindings(calibrationResults.flatMap(result => result.findings)),
    resolutions: [],
    verifications: [],
  })
  calibrationLedgerIssues.forEach(value =>
    issues.push(issue('invalid-calibration-evidence', `calibrationLedger.${value.path}`, value.message))
  )
  const entries = calibrationControlEntries(index)
  const entryByPacketId = new Map<
    ReviewPacketId,
    { entry: ReviewPacketIndexEntry; lane: 'blind' | 'comparison' }
  >(
    entries.flatMap(entry => [
      [entry.blindPacketId, { entry, lane: 'blind' as const }],
      [entry.comparisonPacketId, { entry, lane: 'comparison' as const }],
    ])
  )
  const actualKinds = entries.map(entry => entry.calibrationKind).filter(Boolean)
  if (
    entries.length !== CALIBRATION_CASE_KINDS.length ||
    CALIBRATION_CASE_KINDS.some(kind => !actualKinds.includes(kind))
  ) {
    issues.push(
      issue(
        'invalid-calibration-evidence',
        'index.calibrationControls',
        'Review index does not contain every required calibration control exactly once'
      )
    )
  }
  if (
    entries.some(
      entry =>
        !entry.calibrationKind ||
        entry.candidateKey !== CALIBRATION_CONTROL_CANDIDATE_KEYS[entry.calibrationKind] ||
        (entry.calibrationKind === 'disagreement'
          ? entry.category !== 'reconciliation-discrepancy'
          : entry.category !== 'official-record')
    )
  ) {
    issues.push(
      issue(
        'invalid-calibration-evidence',
        'index.calibrationControls',
        'Review index calibration controls do not match the required semantic control identities'
      )
    )
  }
  calibrationResults.forEach((result, resultIndex) => {
    const reference = entryByPacketId.get(result.packetId)
    if (
      !reference ||
      !isChecksum(result.packetChecksum) ||
      !isInstant(result.reviewedAt) ||
      !['pass', 'finding', 'cannot-verify'].includes(result.outcome) ||
      !Array.isArray(result.findings)
    ) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          `calibrationResults[${resultIndex}]`,
          'Calibration result is malformed or does not reference a bound control packet'
        )
      )
    } else {
      const expectedChecksum =
        reference.lane === 'blind'
          ? reference.entry.blindPacketChecksum
          : reference.entry.comparisonPacketChecksum
      if (result.packetChecksum !== expectedChecksum) {
        issues.push(
          issue(
            'invalid-calibration-evidence',
            `calibrationResults[${resultIndex}].packetChecksum`,
            'Calibration result packet checksum differs from the bound review index'
          )
        )
      }
    }
  })
  const assignments = assignmentById(ledger)
  ledger.calibrations.forEach((calibration, calibrationIndex) => {
    const path = `ledger.calibrations[${calibrationIndex}]`
    const evidence = calibration.evidence
    if (!evidence) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          `${path}.evidence`,
          'Agent calibration requires checksum-bound control results'
        )
      )
      return
    }
    const assignment = assignments.get(evidence.assignmentId)
    const relevantResults = calibrationResults.filter(result => result.assignmentId === evidence.assignmentId)
    if (
      !assignment ||
      reviewerConfigurationId(assignment.reviewer) !== calibration.reviewerConfigurationId ||
      relevantResults.length !== entries.length * 2 ||
      relevantResults.some(
        result =>
          result.reviewerConfigurationId !== calibration.reviewerConfigurationId ||
          !assignment.packetIds.includes(result.packetId)
      )
    ) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          `${path}.evidence.assignmentId`,
          'Calibration evidence is not bound to its reviewer assignment and control packets'
        )
      )
      return
    }
    const expectedReceipt = createCalibrationEvidenceReceipt(evidence.assignmentId, index, relevantResults)
    if (checksumReviewRecord(evidence) !== checksumReviewRecord(expectedReceipt)) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          `${path}.evidence`,
          'Calibration evidence receipt does not match the committed control results'
        )
      )
    }
    const resultFor = (entry: ReviewPacketIndexEntry, lane: 'blind' | 'comparison') =>
      relevantResults.find(
        result => result.packetId === (lane === 'blind' ? entry.blindPacketId : entry.comparisonPacketId)
      )
    entries.forEach(entry => {
      const blind = relevantResults.filter(result => result.packetId === entry.blindPacketId)
      const comparison = relevantResults.filter(result => result.packetId === entry.comparisonPacketId)
      const controlPath = `${path}.controls.${entry.pairKey}`
      if (blind.length !== 1 || comparison.length !== 1 || !entry.calibrationKind) {
        issues.push(
          issue(
            'invalid-calibration-evidence',
            controlPath,
            'Calibration control does not have exactly one blind and one comparison result'
          )
        )
        return
      }
      const [expectedBlind, expectedComparison] = calibrationControlOutcomes(entry.calibrationKind)
      if (blind[0].outcome !== expectedBlind || comparison[0].outcome !== expectedComparison) {
        issues.push(
          issue(
            'invalid-calibration-evidence',
            controlPath,
            `Calibration control ${entry.calibrationKind} has unexpected outcomes`
          )
        )
      }
    })
    const defects = entries.filter(entry => entry.calibrationKind === 'defect')
    const insufficient = entries.filter(entry => entry.calibrationKind === 'insufficient-evidence')
    const foundDefects = defects.filter(entry => {
      const result = resultFor(entry, 'comparison')
      return (
        result?.outcome === 'finding' &&
        result.findings.some(finding => ['blocker', 'major'].includes(finding.severity))
      )
    }).length
    const unsupportedExpectedValues = entries
      .filter(entry => entry.calibrationKind !== 'defect')
      .flatMap(entry => [resultFor(entry, 'blind'), resultFor(entry, 'comparison')])
      .reduce((total, result) => total + (result?.findings.length ?? 0), 0)
    const correctCannotVerify = insufficient.filter(
      entry =>
        resultFor(entry, 'blind')?.outcome === 'cannot-verify' &&
        resultFor(entry, 'comparison')?.outcome === 'cannot-verify'
    ).length
    if (
      calibration.seededBlockerMajorDefects !== defects.length ||
      calibration.foundSeededBlockerMajorDefects !== foundDefects ||
      calibration.unsupportedExpectedValues !== unsupportedExpectedValues ||
      calibration.insufficientEvidenceCases !== insufficient.length ||
      calibration.correctCannotVerifyCases !== correctCannotVerify ||
      !calibration.passed ||
      relevantResults.some(result => new Date(result.reviewedAt) > new Date(calibration.calibratedAt))
    ) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          path,
          'Calibration summary is not derivable from its committed control results'
        )
      )
    }
  })
  calibrationResults.forEach((result, resultIndex) => {
    const assignment = assignments.get(result.assignmentId)
    if (
      !assignment ||
      !reviewCalibrationForAssignment(
        ledger.calibrations,
        result.assignmentId,
        result.reviewerConfigurationId,
        index.rubricVersion,
        ledger.assignments.length
      )
    ) {
      issues.push(
        issue(
          'invalid-calibration-evidence',
          `calibrationResults[${resultIndex}].assignmentId`,
          'Calibration result has no assignment-scoped calibration'
        )
      )
    }
  })
  return sortedIssues(issues)
}

export const certificationChronologyIssues = (
  certifiedAt: string,
  ledger: ReviewLedger,
  calibrationResults: ReviewerResult[],
  sourceObservedAt?: string
): CertificationIssue[] => {
  if (!isInstant(certifiedAt)) {
    return [
      issue(
        'certification-before-evidence',
        'manifest.certifiedAt',
        'Certification time is not a canonical instant',
        'stale'
      ),
    ]
  }
  let latestEvidence: string | undefined
  const consider = (value: string): void => {
    if (isInstant(value) && (!latestEvidence || value > latestEvidence)) latestEvidence = value
  }
  ledger.assignments.forEach(value => consider(value.assignedAt))
  ledger.calibrations.forEach(value => consider(value.calibratedAt))
  ledger.results.forEach(value => consider(value.reviewedAt))
  ledger.resolutions.forEach(value => consider(value.resolvedAt))
  ledger.verifications.forEach(value => consider(value.verifiedAt))
  if (Array.isArray(calibrationResults)) {
    calibrationResults.forEach(value => consider(value.reviewedAt))
  }
  if (sourceObservedAt) consider(sourceObservedAt)
  if (!latestEvidence || new Date(latestEvidence) <= new Date(certifiedAt)) return []
  return [
    issue(
      'certification-before-evidence',
      'manifest.certifiedAt',
      `Certification time precedes bound review evidence at ${latestEvidence}`,
      'stale'
    ),
  ]
}

const indexIssues = (index: ReviewPacketSafeIndex): CertificationIssue[] => {
  const issues: CertificationIssue[] = []
  if (
    index?.schemaVersion !== 1 ||
    !isNonEmptyString(index?.revision) ||
    !isNonEmptyString(index?.protocolVersion) ||
    !isNonEmptyString(index?.rubricVersion) ||
    !Array.isArray(index?.entries) ||
    !index?.coverage
  ) {
    return [
      issue(
        'invalid-review-index',
        'index',
        'Review index is missing its schema, revision, protocol, entries, or coverage'
      ),
    ]
  }
  const seenPairs = new Set<string>()
  const seenBlindPackets = new Set<string>()
  const seenComparisonPackets = new Set<string>()
  index.entries.forEach((entry, entryIndex) => {
    const path = `index.entries[${entryIndex}]`
    const valid =
      isNonEmptyString(entry.pairKey) &&
      isNonEmptyString(entry.candidateKey) &&
      [
        'official-record',
        'reconciliation-discrepancy',
        'profile-only-fact',
        'source-record',
        'ignored-record',
        'golden-truth',
      ].includes(entry.category) &&
      entry.blindPacketId === `review-packet:sha256:${entry.blindPacketChecksum}` &&
      entry.comparisonPacketId === `review-packet:sha256:${entry.comparisonPacketChecksum}` &&
      isChecksum(entry.blindPacketChecksum) &&
      isChecksum(entry.comparisonPacketChecksum) &&
      Array.isArray(entry.cohortIds) &&
      entry.cohortIds.length > 0 &&
      entry.cohortIds.every(isNonEmptyString) &&
      Array.isArray(entry.authorityClasses) &&
      entry.authorityClasses.length > 0 &&
      entry.authorityClasses.every(value =>
        ['official', 'secondary', 'community', 'unknown'].includes(value)
      ) &&
      Array.isArray(entry.factionIds) &&
      Array.isArray(entry.rulesContextIds) &&
      typeof entry.blindDerivationRequired === 'boolean' &&
      (entry.blindDerivationRequired || isNonEmptyString(entry.blindExceptionReason)) &&
      entry.assignmentStatus === 'unassigned' &&
      typeof entry.calibration === 'boolean' &&
      (entry.calibration
        ? CALIBRATION_CASE_KINDS.includes(entry.calibrationKind as CalibrationCaseKind)
        : entry.calibrationKind === undefined) &&
      typeof entry.countsTowardCoverage === 'boolean' &&
      typeof entry.projectsToRuntime === 'boolean' &&
      isChecksum(entry.samplingMetadataChecksum) &&
      entry.samplingMetadataChecksum === reviewIndexSamplingMetadataChecksum(entry) &&
      entry.calibration !== entry.countsTowardCoverage
    if (!valid) {
      issues.push(issue('invalid-review-index', path, 'Review index entry is malformed'))
    }
    if (seenPairs.has(entry.pairKey)) {
      issues.push(issue('invalid-review-index', `${path}.pairKey`, 'Review pair is duplicated'))
    }
    if (seenBlindPackets.has(entry.blindPacketId)) {
      issues.push(issue('invalid-review-index', `${path}.blindPacketId`, 'Blind packet is duplicated'))
    }
    if (seenComparisonPackets.has(entry.comparisonPacketId)) {
      issues.push(
        issue('invalid-review-index', `${path}.comparisonPacketId`, 'Comparison packet is duplicated')
      )
    }
    seenPairs.add(entry.pairKey)
    seenBlindPackets.add(entry.blindPacketId)
    seenComparisonPackets.add(entry.comparisonPacketId)
  })
  const categoryBindings: Array<
    [
      keyof Pick<
        ReviewPacketSafeIndex['coverage'],
        | 'officialRecords'
        | 'reconciliationDiscrepancies'
        | 'profileOnlyFacts'
        | 'sourceRecords'
        | 'ignoredRecords'
      >,
      ReviewCandidateCategory,
    ]
  > = [
    ['officialRecords', 'official-record'],
    ['reconciliationDiscrepancies', 'reconciliation-discrepancy'],
    ['profileOnlyFacts', 'profile-only-fact'],
    ['sourceRecords', 'source-record'],
    ['ignoredRecords', 'ignored-record'],
  ]
  categoryBindings.forEach(([coverageKey, category]) => {
    const value = index.coverage[coverageKey]
    const actual = index.entries.filter(
      entry => entry.category === category && entry.countsTowardCoverage && !entry.calibration
    ).length
    if (
      !Number.isSafeInteger(value?.assigned) ||
      !Number.isSafeInteger(value?.expected) ||
      value.assigned !== actual ||
      value.expected !== actual
    ) {
      issues.push(
        issue(
          'invalid-review-index',
          `index.coverage.${coverageKey}`,
          `${coverageKey} coverage metadata does not match the safe index entries`
        )
      )
    }
  })
  if (
    !Array.isArray(index.coverage.factionContextStrata) ||
    !index.coverage.factionContextStrata.every(isNonEmptyString) ||
    !Array.isArray(index.coverage.highRiskCohorts) ||
    !index.coverage.highRiskCohorts.every(isNonEmptyString)
  ) {
    issues.push(
      issue(
        'invalid-review-index',
        'index.coverage',
        'Faction/context or high-risk coverage metadata is malformed'
      )
    )
  }
  return issues
}

const sourceInventoryIssues = (
  inventory: SourceInventory,
  revision: string,
  acceptedArtifactChecksums: string[]
): CertificationIssue[] => {
  if (
    inventory?.schemaVersion !== 1 ||
    !isNonEmptyString(inventory?.revision) ||
    !isInstant(inventory?.observedAt) ||
    !isNonEmptyString(inventory?.producedBy) ||
    typeof inventory?.independentFromAcceptedManifest !== 'boolean' ||
    typeof inventory?.complete !== 'boolean' ||
    !Array.isArray(inventory?.entries)
  ) {
    return [
      issue(
        'invalid-source-inventory',
        'inventory',
        'Source inventory is missing required provenance or entries'
      ),
    ]
  }
  const issues: CertificationIssue[] = []
  if (inventory.revision !== revision) {
    issues.push(
      issue(
        'invalid-source-inventory',
        'inventory.revision',
        'Source inventory revision does not match the review index'
      )
    )
  }
  if (!inventory.independentFromAcceptedManifest) {
    issues.push(
      issue(
        'invalid-source-inventory',
        'inventory.independentFromAcceptedManifest',
        'Source inventory was not produced independently from the accepted manifest'
      )
    )
  }
  if (!inventory.complete) {
    issues.push(
      issue('incomplete-source-inventory', 'inventory.complete', 'Source inventory is marked incomplete')
    )
  }
  const seenUrls = new Set<string>()
  inventory.entries.forEach((entry, entryIndex) => {
    const path = `inventory.entries[${entryIndex}]`
    let url: URL | undefined
    try {
      url = new URL(entry.url)
    } catch {
      // The shape diagnostic below handles invalid URLs.
    }
    const valid =
      ['games-workshop', 'wahapedia', 'bsdata'].includes(entry.publisher) &&
      url?.protocol === 'https:' &&
      isNonEmptyString(entry.title) &&
      ['matched', 'explicit-non-material', 'missing', 'unexpected', 'inaccessible', 'ambiguous'].includes(
        entry.status
      ) &&
      (entry.acceptedArtifactChecksum === undefined || isChecksum(entry.acceptedArtifactChecksum))
    if (!valid) {
      issues.push(issue('invalid-source-inventory', path, 'Source inventory entry is malformed'))
    }
    const normalizedUrl = url?.toString().toLowerCase()
    if (normalizedUrl && seenUrls.has(normalizedUrl)) {
      issues.push(issue('invalid-source-inventory', `${path}.url`, 'Source inventory URL is duplicated'))
    }
    if (normalizedUrl) seenUrls.add(normalizedUrl)
    if (entry.status === 'matched' && !entry.acceptedArtifactChecksum) {
      issues.push(
        issue(
          'unmatched-source-artifact',
          path,
          'Matched source inventory entry does not identify its accepted artifact checksum'
        )
      )
    }
    if (entry.status === 'explicit-non-material' && !isNonEmptyString(entry.disposition)) {
      issues.push(
        issue(
          'incomplete-source-inventory',
          path,
          'Non-material source inventory disposition requires a rationale'
        )
      )
    }
    if (['missing', 'unexpected', 'inaccessible', 'ambiguous'].includes(entry.status)) {
      issues.push(
        issue(
          'incomplete-source-inventory',
          path,
          `Source inventory contains unresolved ${entry.status} evidence`
        )
      )
    }
  })
  const matchedChecksums = new Set(
    inventory.entries
      .filter(entry => entry.status === 'matched')
      .map(entry => entry.acceptedArtifactChecksum)
      .filter((checksum): checksum is string => checksum !== undefined)
  )
  uniqueSorted(acceptedArtifactChecksums).forEach(checksum => {
    if (!matchedChecksums.has(checksum)) {
      issues.push(
        issue(
          'unmatched-source-artifact',
          `inventory.acceptedArtifacts.${checksum}`,
          'Accepted source artifact was not matched by independent discovery'
        )
      )
    }
  })
  return issues
}

const assignmentById = (ledger: ReviewLedger): Map<string, ReviewAssignment> =>
  new Map(ledger.assignments.map(assignment => [assignment.id, assignment]))

const resultsByPacket = (ledger: ReviewLedger): Map<ReviewPacketId, ReviewerResult[]> => {
  const results = new Map<ReviewPacketId, ReviewerResult[]>()
  ledger.results.forEach(result => {
    results.set(result.packetId, [...(results.get(result.packetId) ?? []), result])
  })
  return results
}

const hasExactPassingLedgerCorrespondence = (index: ReviewPacketSafeIndex, ledger: ReviewLedger): boolean => {
  const entries = index.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  if (
    ledger.findings.length !== 0 ||
    ledger.resolutions.length !== 0 ||
    ledger.verifications.length !== 0 ||
    ledger.results.length !== entries.length * 2
  ) {
    return false
  }
  const assignments = assignmentById(ledger)
  const results = resultsByPacket(ledger)
  if (results.size !== entries.length * 2) return false
  const valid = (result: ReviewerResult | undefined, checksum: string): result is ReviewerResult => {
    const assignment = result ? assignments.get(result.assignmentId) : undefined
    return Boolean(
      result &&
      assignment?.reviewer.kind === 'agent' &&
      result.packetChecksum === checksum &&
      result.reviewerConfigurationId === reviewerConfigurationId(assignment.reviewer) &&
      result.outcome === 'pass' &&
      result.findings.length === 0
    )
  }
  return entries.every(entry => {
    const blindResults = results.get(entry.blindPacketId)
    const comparisonResults = results.get(entry.comparisonPacketId)
    if (blindResults?.length !== 1 || comparisonResults?.length !== 1) return false
    const blind = blindResults[0]
    const comparison = comparisonResults[0]
    const assignment = assignments.get(blind.assignmentId)
    const calibration = assignment
      ? reviewCalibrationForAssignment(
          ledger.calibrations,
          assignment.id,
          reviewerConfigurationId(assignment.reviewer),
          index.rubricVersion,
          ledger.assignments.length
        )
      : undefined
    if (
      !valid(blind, entry.blindPacketChecksum) ||
      !valid(comparison, entry.comparisonPacketChecksum) ||
      (entry.blindDerivationRequired && blind.blindExpectedInterpretation === undefined) ||
      calibration?.passed !== true ||
      new Date(calibration.calibratedAt) > new Date(blind.reviewedAt)
    ) {
      return false
    }
    return (
      assignments.get(blind.assignmentId)?.reviewer.id ===
        assignments.get(comparison.assignmentId)?.reviewer.id &&
      new Date(blind.reviewedAt).valueOf() < new Date(comparison.reviewedAt).valueOf()
    )
  })
}

const reviewerId = (result: ReviewerResult, assignments: Map<string, ReviewAssignment>): string | undefined =>
  assignments.get(result.assignmentId)?.reviewer.id

const matchingResults = (
  packetId: ReviewPacketId,
  packetChecksum: string,
  resultIndex: Map<ReviewPacketId, ReviewerResult[]>,
  assignments: Map<string, ReviewAssignment>
): ReviewerResult[] =>
  (resultIndex.get(packetId) ?? []).filter(
    result =>
      result.packetChecksum === packetChecksum &&
      result.outcome !== 'cannot-verify' &&
      assignments.get(result.assignmentId)?.reviewer.kind === 'agent'
  )

const blindSequenceIssues = (
  entry: ReviewPacketIndexEntry,
  blind: ReviewerResult[],
  comparison: ReviewerResult[],
  assignments: Map<string, ReviewAssignment>,
  path: string
): CertificationIssue[] => {
  if (!entry.blindDerivationRequired || !blind.length || !comparison.length) return []
  const outOfSequence = comparison.filter(comparisonResult => {
    const comparisonReviewerId = reviewerId(comparisonResult, assignments)
    return !blind.some(
      blindResult =>
        reviewerId(blindResult, assignments) === comparisonReviewerId &&
        new Date(blindResult.reviewedAt).valueOf() < new Date(comparisonResult.reviewedAt).valueOf()
    )
  })
  return outOfSequence.length
    ? [
        issue(
          'comparison-before-blind',
          path,
          'Agent comparison was recorded before a blind interpretation by the same reviewer'
        ),
      ]
    : []
}

const packetOutcomeIssues = (
  entry: ReviewPacketIndexEntry,
  resultIndex: Map<ReviewPacketId, ReviewerResult[]>,
  assignments: Map<string, ReviewAssignment>
): CertificationIssue[] => {
  const issues: CertificationIssue[] = []
  const blindAll = resultIndex.get(entry.blindPacketId) ?? []
  const comparisonAll = resultIndex.get(entry.comparisonPacketId) ?? []
  const blind = matchingResults(entry.blindPacketId, entry.blindPacketChecksum, resultIndex, assignments)
  const comparison = matchingResults(
    entry.comparisonPacketId,
    entry.comparisonPacketChecksum,
    resultIndex,
    assignments
  )
  const entryPath = `index.entries.${entry.pairKey}`
  if (!blind.length) {
    const stale = blindAll.some(result => result.packetChecksum !== entry.blindPacketChecksum)
    const cannotVerify = blindAll.some(
      result =>
        result.packetChecksum === entry.blindPacketChecksum &&
        result.outcome === 'cannot-verify' &&
        assignments.get(result.assignmentId)?.reviewer.kind === 'agent'
    )
    issues.push(
      issue(
        stale ? 'stale-packet' : cannotVerify ? 'cannot-verify' : 'missing-blind-result',
        `${entryPath}.blind`,
        stale
          ? 'Blind review result is bound to a stale packet checksum'
          : cannotVerify
            ? 'Blind review could not verify the evidence'
            : 'Blind packet has no qualifying agent review result',
        stale ? 'stale' : 'blocked'
      )
    )
  } else if (
    entry.blindDerivationRequired &&
    !blind.some(result => result.blindExpectedInterpretation !== undefined)
  ) {
    issues.push(
      issue(
        'missing-blind-interpretation',
        `${entryPath}.blind`,
        'Blind result did not record an independently derived interpretation'
      )
    )
  }
  if (!comparison.length) {
    const stale = comparisonAll.some(result => result.packetChecksum !== entry.comparisonPacketChecksum)
    const cannotVerify = comparisonAll.some(
      result =>
        result.packetChecksum === entry.comparisonPacketChecksum &&
        result.outcome === 'cannot-verify' &&
        assignments.get(result.assignmentId)?.reviewer.kind === 'agent'
    )
    issues.push(
      issue(
        stale ? 'stale-packet' : cannotVerify ? 'cannot-verify' : 'missing-comparison-result',
        `${entryPath}.comparison`,
        stale
          ? 'Comparison result is bound to a stale packet checksum'
          : cannotVerify
            ? 'Comparison review could not verify the generated value'
            : 'Comparison packet has no qualifying agent review result',
        stale ? 'stale' : 'blocked'
      )
    )
  }
  issues.push(...blindSequenceIssues(entry, blind, comparison, assignments, `${entryPath}.comparison`))
  return issues
}

const coverageByValues = (
  entries: ReviewPacketIndexEntry[],
  values: (entry: ReviewPacketIndexEntry) => string[],
  reviewed: (entry: ReviewPacketIndexEntry) => boolean
): Record<string, CertificationCoverageDetail> => {
  const coverage = new Map<string, CertificationCoverageDetail>()
  entries.forEach(entry => {
    const keys = new Set(values(entry))
    if (!keys.size) return
    const entryReviewed = reviewed(entry)
    keys.forEach(key => {
      const current = coverage.get(key) ?? count(0, 0)
      coverage.set(key, count(current.reviewed + Number(entryReviewed), current.expected + 1))
    })
  })
  return Object.fromEntries(uniqueSorted(coverage.keys()).map(key => [key, coverage.get(key)!]))
}

const categoryCoverage = (
  entries: ReviewPacketIndexEntry[],
  category: ReviewCandidateCategory,
  reviewed: (entry: ReviewPacketIndexEntry) => boolean
): CertificationCoverageDetail => {
  const matching = entries.filter(entry => entry.category === category)
  return count(matching.filter(reviewed).length, matching.length)
}

const calibrationIssues = (ledger: ReviewLedger, index: ReviewPacketSafeIndex): CertificationIssue[] => {
  const issues: CertificationIssue[] = []
  const assignments = assignmentById(ledger)
  ledger.results.forEach((result, resultIndex) => {
    const assignment = assignments.get(result.assignmentId)
    if (!assignment) return
    const expectedConfiguration = reviewerConfigurationId(assignment.reviewer)
    const calibration = reviewCalibrationForAssignment(
      ledger.calibrations,
      result.assignmentId,
      expectedConfiguration,
      index.rubricVersion,
      ledger.assignments.length
    )
    const path = `ledger.results[${resultIndex}]`
    if (!calibration) {
      issues.push(
        issue(
          'missing-calibration',
          path,
          'Reviewer result has no calibration for the exact reviewer configuration and rubric'
        )
      )
    } else if (!calibration.passed) {
      issues.push(issue('failed-calibration', path, 'Reviewer result uses a failed calibration'))
    } else if (new Date(calibration.calibratedAt) > new Date(result.reviewedAt)) {
      issues.push(issue('calibration-after-review', path, 'Agent result predates its recorded calibration'))
    }
  })
  return issues
}

const findingIssues = (
  ledger: ReviewLedger
): {
  issues: CertificationIssue[]
  openLimitations: CertificationOpenLimitation[]
  verification: CertificationSummary['correctionVerification']
} => {
  const issues = ledger.findings.map((finding, findingIndex) =>
    issue(
      'open-finding',
      `ledger.findings[${findingIndex}]`,
      `Automated finding ${finding.id} must be cleared by correcting the pipeline and rerunning review`
    )
  )
  return {
    issues,
    openLimitations: [],
    verification: { required: 0, verified: 0, rejected: 0, missing: 0 },
  }
}

const coverageIssues = (
  coverage: CertificationCoverage,
  index: ReviewPacketSafeIndex,
  summary: Omit<CertificationEvaluationSummary, 'issues' | 'status'>
): CertificationIssue[] => {
  const issues: CertificationIssue[] = []
  const expectedByIndex: Array<
    [
      keyof Pick<
        CertificationCoverage,
        | 'officialRecords'
        | 'reconciliationDiscrepancies'
        | 'profileOnlyFacts'
        | 'sourceRecords'
        | 'ignoredRecords'
      >,
      number,
    ]
  > = [
    ['officialRecords', index.coverage.officialRecords.expected],
    ['reconciliationDiscrepancies', index.coverage.reconciliationDiscrepancies.expected],
    ['profileOnlyFacts', index.coverage.profileOnlyFacts.expected],
    ['sourceRecords', index.coverage.sourceRecords.expected],
    ['ignoredRecords', index.coverage.ignoredRecords.expected],
  ]
  expectedByIndex.forEach(([key, expected]) => {
    if (coverage[key].expected !== expected || coverage[key].reviewed !== expected) {
      issues.push(
        issue(
          'incomplete-coverage',
          `coverage.${key}`,
          `${key} coverage is ${coverage[key].reviewed}/${coverage[key].expected}; expected ${expected}/${expected}`,
          'blocked',
          key
        )
      )
    }
  })
  if (coverage.factionContextStrata.reviewed !== coverage.factionContextStrata.expected) {
    issues.push(
      issue(
        'incomplete-coverage',
        'coverage.factionContextStrata',
        'One or more faction/context strata lack complete agent review'
      )
    )
  }
  if (coverage.highRiskCohorts.reviewed !== coverage.highRiskCohorts.expected) {
    issues.push(
      issue(
        'incomplete-coverage',
        'coverage.highRiskCohorts',
        'One or more high-risk cohorts lack complete agent review'
      )
    )
  }
  Object.entries(summary.coverageBySourceClass).forEach(([authority, value]) => {
    if (value.reviewed !== value.expected) {
      issues.push(
        issue(
          'incomplete-coverage',
          `coverage.sourceClass.${authority}`,
          `${authority} source coverage is incomplete`
        )
      )
    }
  })
  return issues
}

const ledgerIssues = (ledger: ReviewLedger): CertificationIssue[] =>
  validateReviewLedger(ledger).map((validation: ReviewValidationIssue) =>
    issue('invalid-ledger', validation.path, `${validation.code}: ${validation.message}`)
  )

const statusFor = (issues: CertificationIssue[]): CertificationManifest['status'] =>
  issues.some(value => value.state === 'stale') ? 'stale' : issues.length ? 'blocked' : 'pass'

export const evaluateCertification = (
  input: CertificationEvaluationInput,
  options: { prevalidatedPassingLedger?: boolean } = {}
): CertificationEvaluation => {
  const index = input.index
  const ledger = input.ledger
  const inventory = input.inventory
  const liveEntries = index.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  const prevalidatedPassingLedger =
    options.prevalidatedPassingLedger === true && hasExactPassingLedgerCorrespondence(index, ledger)
  const inventoryEntries = Array.isArray(inventory?.entries) ? inventory.entries : []
  const assignments = assignmentById(ledger)
  const resultIndex = prevalidatedPassingLedger ? new Map() : resultsByPacket(ledger)
  const outcomeIssuesByPairKey = new Map(
    liveEntries.map(
      entry =>
        [
          entry.pairKey,
          prevalidatedPassingLedger ? [] : packetOutcomeIssues(entry, resultIndex, assignments),
        ] as const
    )
  )
  const machineIssues = liveEntries.flatMap(entry => outcomeIssuesByPairKey.get(entry.pairKey) ?? [])
  const reviewed = (entry: ReviewPacketIndexEntry): boolean =>
    outcomeIssuesByPairKey.get(entry.pairKey)?.length === 0
  const partialImports = prevalidatedPassingLedger
    ? []
    : liveEntries.filter(entry => {
        const blind = matchingResults(
          entry.blindPacketId,
          entry.blindPacketChecksum,
          resultIndex,
          assignments
        )
        const comparison = matchingResults(
          entry.comparisonPacketId,
          entry.comparisonPacketChecksum,
          resultIndex,
          assignments
        )
        return Boolean(blind.length) !== Boolean(comparison.length)
      })
  const coverageByCohort = coverageByValues(liveEntries, entry => entry.cohortIds, reviewed)
  const coverageByFaction = coverageByValues(liveEntries, entry => entry.factionIds, reviewed)
  const coverageByContext = coverageByValues(liveEntries, entry => entry.rulesContextIds, reviewed)
  const sourceCoverage = coverageByValues(liveEntries, entry => entry.authorityClasses, reviewed)
  const coverageBySourceClass: CertificationSummary['coverageBySourceClass'] = {
    official: sourceCoverage.official ?? count(0, 0),
    secondary: sourceCoverage.secondary ?? count(0, 0),
    community: sourceCoverage.community ?? count(0, 0),
    unknown: sourceCoverage.unknown ?? count(0, 0),
  }
  const factionContextCounts = new Map(
    index.coverage.factionContextStrata.map(stratum => [stratum, count(0, 0)] as const)
  )
  liveEntries.forEach(entry => {
    entry.factionIds.forEach(factionId =>
      entry.rulesContextIds.forEach(contextId => {
        const stratum = `${factionId}|${contextId}`
        const current = factionContextCounts.get(stratum)
        if (current) {
          factionContextCounts.set(
            stratum,
            count(current.reviewed + Number(reviewed(entry)), current.expected + 1)
          )
        }
      })
    )
  })
  const factionContextCoverage = Object.fromEntries(factionContextCounts)
  const highRiskCoverage = Object.fromEntries(
    index.coverage.highRiskCohorts.map(cohort => [cohort, coverageByCohort[cohort] ?? count(0, 0)])
  )
  const coverage: CertificationCoverage = {
    officialRecords: categoryCoverage(liveEntries, 'official-record', reviewed),
    reconciliationDiscrepancies: categoryCoverage(liveEntries, 'reconciliation-discrepancy', reviewed),
    profileOnlyFacts: categoryCoverage(liveEntries, 'profile-only-fact', reviewed),
    sourceRecords: categoryCoverage(liveEntries, 'source-record', reviewed),
    ignoredRecords: categoryCoverage(liveEntries, 'ignored-record', reviewed),
    factionContextStrata: count(
      Object.values(factionContextCoverage).filter(
        value => value.expected > 0 && value.reviewed === value.expected
      ).length,
      index.coverage.factionContextStrata.length
    ),
    highRiskCohorts: count(
      Object.values(highRiskCoverage).filter(value => value.expected > 0 && value.reviewed === value.expected)
        .length,
      index.coverage.highRiskCohorts.length
    ),
  }
  const findingEvaluation = findingIssues(ledger)
  const outcomeCounts: CertificationSummary['outcomeCounts'] = {
    pass: prevalidatedPassingLedger
      ? liveEntries.length * 2
      : ledger.results.filter(result => result.outcome === 'pass').length,
    finding: prevalidatedPassingLedger
      ? 0
      : ledger.results.filter(result => result.outcome === 'finding').length,
    'cannot-verify': prevalidatedPassingLedger
      ? 0
      : ledger.results.filter(result => result.outcome === 'cannot-verify').length,
  }
  const outcomes: CertificationSummary['outcomes'] = {
    pass: outcomeCounts.pass,
    finding: outcomeCounts.finding,
    cannotVerify: outcomeCounts['cannot-verify'],
  }
  const severityCounts: CertificationSummary['severityCounts'] = {
    blocker: ledger.findings.filter(finding => finding.severity === 'blocker').length,
    major: ledger.findings.filter(finding => finding.severity === 'major').length,
    minor: ledger.findings.filter(finding => finding.severity === 'minor').length,
  }
  const findingCountsByField = Object.fromEntries(
    uniqueSorted(ledger.findings.map(finding => finding.subject.field)).map(field => [
      field,
      ledger.findings.filter(finding => finding.subject.field === field).length,
    ])
  )
  const regressionEntries = liveEntries.filter(entry => entry.category === 'golden-truth')
  const summaryWithoutStatusAndIssues: Omit<CertificationEvaluationSummary, 'status' | 'issues'> = {
    schemaVersion: AOS4_CERTIFICATION_SCHEMA_VERSION,
    revision: index.revision,
    coverage,
    coverageByCohort,
    coverageByFaction,
    coverageByContext,
    coverageBySourceClass,
    outcomeCounts,
    outcomes,
    severityCounts,
    findingCountsByField,
    findings: {
      total: ledger.findings.length,
      resolved: ledger.findings.filter(finding =>
        ledger.resolutions.some(resolution => resolution.findingId === finding.id)
      ).length,
      open: ledger.findings.filter(
        finding => !ledger.resolutions.some(resolution => resolution.findingId === finding.id)
      ).length,
    },
    openLimitations: findingEvaluation.openLimitations,
    correctionVerification: findingEvaluation.verification,
    regressionCases: count(regressionEntries.filter(reviewed).length, regressionEntries.length),
    sourceInventory: {
      total: inventoryEntries.length,
      matched: inventoryEntries.filter(entry => entry.status === 'matched').length,
      explicitlyNonMaterial: inventoryEntries.filter(entry => entry.status === 'explicit-non-material')
        .length,
      unresolved: inventoryEntries.filter(entry =>
        ['missing', 'unexpected', 'inaccessible', 'ambiguous'].includes(entry.status)
      ).length,
    },
  }
  const preliminarySummary = {
    ...summaryWithoutStatusAndIssues,
    status: 'blocked' as const,
  }
  const issues = sortedIssues([
    ...indexIssues(index),
    ...(prevalidatedPassingLedger ? [] : ledgerIssues(ledger)),
    ...ledger.assignments.flatMap((assignment, assignmentIndex) =>
      assignment.reviewer.protocolVersion === index.protocolVersion
        ? []
        : [
            issue(
              'protocol-mismatch',
              `ledger.assignments[${assignmentIndex}]`,
              'Assignment reviewer protocol does not match the review index'
            ),
          ]
    ),
    ...(prevalidatedPassingLedger ? [] : calibrationIssues(ledger, index)),
    ...machineIssues,
    ...partialImports.map(entry =>
      issue(
        'partial-review-import',
        entry.pairKey,
        'Only one half of the blind/comparison review pair was imported'
      )
    ),
    ...findingEvaluation.issues,
    ...coverageIssues(coverage, index, preliminarySummary),
    ...sourceInventoryIssues(inventory, index.revision, input.acceptedArtifactChecksums),
  ])
  const status = statusFor(issues)
  return {
    ok: status === 'pass',
    status,
    issues,
    summary: {
      ...summaryWithoutStatusAndIssues,
      status,
      issues,
    },
  }
}

const normalizedInputs = (inputs: CertificationInput[]): CertificationInput[] =>
  [...inputs].sort(
    (left, right) =>
      compareText(left.name, right.name) ||
      compareText(left.path, right.path) ||
      compareText(left.checksum, right.checksum)
  )

const LEDGER_INPUT_NAMES = new Set([
  'review-assignments',
  'review-calibrations',
  'review-calibration-results',
  'review-results',
  'review-findings',
  'review-resolutions',
  'review-verifications',
])

const certificationLedgerInputChecksum = (inputs: CertificationInput[]): string =>
  checksumReviewRecord(normalizedInputs(inputs).filter(input => LEDGER_INPUT_NAMES.has(input.name)))

const requiredInputIssues = (inputs: CertificationInput[]): CertificationIssue[] => {
  const names = inputs.map(input => input.name)
  const issues = REQUIRED_CERTIFICATION_INPUTS.filter(name => !names.includes(name)).map(name =>
    issue(
      'missing-certification-input',
      `manifest.inputs.${name}`,
      `Certification is missing required input ${name}`,
      'stale'
    )
  )
  uniqueSorted(names)
    .filter(name => names.filter(value => value === name).length > 1)
    .forEach(name =>
      issues.push(
        issue(
          'duplicate-certification-input',
          `manifest.inputs.${name}`,
          `Certification input ${name} is duplicated`,
          'stale'
        )
      )
    )
  return issues
}

export interface CreateCertificationManifestInput {
  evaluation: CertificationEvaluation
  inputs: CertificationInput[]
  ledger: ReviewLedger
  inventory: CertificationInventoryBinding
  certifiedAt: string
  protocolVersion: string
  rubricVersion: string
}

export const createCertificationManifest = (
  input: CreateCertificationManifestInput
): CertificationManifest => ({
  schemaVersion: AOS4_CERTIFICATION_SCHEMA_VERSION,
  revision: input.evaluation.summary.revision,
  status: input.evaluation.status,
  certifiedAt: input.certifiedAt,
  inputs: normalizedInputs(input.inputs),
  protocol: {
    protocolVersion: input.protocolVersion,
    rubricVersion: input.rubricVersion,
    checksum: checksumReviewRecord({
      protocolVersion: input.protocolVersion,
      rubricVersion: input.rubricVersion,
    }),
  },
  coverage: input.evaluation.summary.coverage,
  ledgerChecksum: certificationLedgerInputChecksum(input.inputs),
  ledgerChecksumKind: 'input-bindings/v1',
  inventoryChecksum: input.inventory.checksum,
  sourceObservedAt: input.inventory.observedAt,
})

export interface VerifyCertificationManifestInput {
  manifest: CertificationManifest
  evaluation: CertificationEvaluation
  currentInputs: CertificationInput[]
  ledger: ReviewLedger
  inventory: CertificationInventoryBinding
  protocolVersion: string
  rubricVersion: string
}

export const verifyCertificationManifest = (
  input: VerifyCertificationManifestInput
): CertificationIssue[] => {
  const issues = requiredInputIssues(input.currentInputs)
  const currentInputs = new Map(input.currentInputs.map(value => [value.name, value]))
  input.manifest.inputs.forEach((bound, index) => {
    const current = currentInputs.get(bound.name)
    if (!current || current.path !== bound.path || current.checksum !== bound.checksum) {
      issues.push(
        issue(
          'stale-input',
          `manifest.inputs[${index}]`,
          `Bound input ${bound.name} is missing or has changed`,
          'stale'
        )
      )
    }
  })
  if (input.manifest.revision !== input.evaluation.summary.revision) {
    issues.push(issue('stale-input', 'manifest.revision', 'Certification revision has changed', 'stale'))
  }
  if (
    input.manifest.protocol.protocolVersion !== input.protocolVersion ||
    input.manifest.protocol.rubricVersion !== input.rubricVersion ||
    input.manifest.protocol.checksum !==
      checksumReviewRecord({
        protocolVersion: input.protocolVersion,
        rubricVersion: input.rubricVersion,
      })
  ) {
    issues.push(
      issue('stale-protocol', 'manifest.protocol', 'Review protocol or rubric has changed', 'stale')
    )
  }
  const expectedLedgerChecksum = input.manifest.ledgerChecksumKind
    ? certificationLedgerInputChecksum(input.currentInputs)
    : checksumReviewRecord(input.ledger)
  if (input.manifest.ledgerChecksum !== expectedLedgerChecksum) {
    issues.push(issue('stale-ledger', 'manifest.ledgerChecksum', 'Review ledger has changed', 'stale'))
  }
  if (
    input.manifest.inventoryChecksum !== input.inventory.checksum ||
    input.manifest.sourceObservedAt !== input.inventory.observedAt
  ) {
    issues.push(
      issue(
        'stale-inventory',
        'manifest.inventoryChecksum',
        'Source inventory or observation time has changed',
        'stale'
      )
    )
  }
  if (
    checksumReviewRecord(input.manifest.coverage) !== checksumReviewRecord(input.evaluation.summary.coverage)
  ) {
    issues.push(issue('stale-coverage', 'manifest.coverage', 'Certification coverage has changed', 'stale'))
  }
  if (input.manifest.status !== 'pass' || input.evaluation.status !== 'pass') {
    issues.push(
      issue(
        'manifest-not-passing',
        'manifest.status',
        'Both the stored manifest and current evaluation must pass'
      )
    )
  }
  return sortedIssues(issues)
}

const assertLedgerCandidate = (ledger: ReviewLedger, packets?: ReviewPacket[]): ReviewLedger => {
  const issues = validateReviewLedger(ledger, packets)
  if (issues.length) {
    throw new ReviewValidationError(`Review ledger update is invalid: ${issues[0].message}`, issues)
  }
  return ledger
}

export const importReviewerResultsAtomic = (
  ledger: ReviewLedger,
  inputs: unknown[],
  packets: ReviewPacket[]
): ReviewLedger => {
  assertLedgerCandidate(ledger, packets)
  const results = inputs as ReviewerResult[]
  const candidate: ReviewLedger = {
    ...ledger,
    results: [...ledger.results, ...results].sort(
      (left, right) =>
        compareText(left.assignmentId, right.assignmentId) || compareText(left.packetId, right.packetId)
    ),
    findings: [
      ...ledger.findings,
      ...results.flatMap(result => (Array.isArray(result?.findings) ? result.findings : [])),
    ].sort((left, right) => compareText(left.id, right.id)),
  }
  return assertLedgerCandidate(candidate, packets)
}

export const appendFindingResolution = (
  ledger: ReviewLedger,
  resolution: FindingResolution,
  packets?: ReviewPacket[]
): ReviewLedger =>
  assertLedgerCandidate(
    {
      ...ledger,
      resolutions: [...ledger.resolutions, resolution].sort((left, right) =>
        compareText(left.findingId, right.findingId)
      ),
    },
    packets
  )

export const appendFindingVerification = (
  ledger: ReviewLedger,
  verification: FindingVerification,
  packets?: ReviewPacket[]
): ReviewLedger =>
  assertLedgerCandidate(
    {
      ...ledger,
      verifications: [...ledger.verifications, verification].sort(
        (left, right) =>
          compareText(left.findingId, right.findingId) || compareText(left.verifierId, right.verifierId)
      ),
    },
    packets
  )

export const emptyReviewLedger = (): ReviewLedger => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignments: [],
  calibrations: [],
  results: [],
  findings: [],
  resolutions: [],
  verifications: [],
})
