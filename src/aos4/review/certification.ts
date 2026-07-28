import { createHash } from 'node:crypto'
import {
  AOS4_CERTIFICATION_SCHEMA_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  reviewerConfigurationId,
  type CertificationCoverage,
  type CertificationInput,
  type CertificationManifest,
  type FindingResolution,
  type FindingVerification,
  type HumanReviewSignoff,
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
import type { ReviewCandidateCategory, ReviewPacketIndexEntry, ReviewPacketSafeIndex } from './packets'

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
  'review-results',
  'review-findings',
  'review-resolutions',
  'review-verifications',
  'review-signoffs',
  'source-inventory',
] as const
export const REQUIRED_CERTIFICATION_INPUT_NAMES = REQUIRED_CERTIFICATION_INPUTS

export type RequiredCertificationInputName = (typeof REQUIRED_CERTIFICATION_INPUTS)[number]

export type CertificationIssueCode =
  | 'invalid-review-index'
  | 'invalid-ledger'
  | 'protocol-mismatch'
  | 'missing-calibration'
  | 'failed-calibration'
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
  | 'missing-human-review'
  | 'missing-human-signoff'
  | 'unsigned-limitation'
  | 'invalid-source-inventory'
  | 'incomplete-source-inventory'
  | 'unmatched-source-artifact'
  | 'missing-certification-input'
  | 'duplicate-certification-input'
  | 'stale-input'
  | 'stale-bound-input'
  | 'stale-ledger'
  | 'stale-signoff'
  | 'stale-inventory'
  | 'stale-protocol'
  | 'stale-coverage'
  | 'manifest-not-passing'

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
  signoffIds: string[]
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
  outcomeCounts: Record<ReviewOutcome, number>
  outcomes: {
    pass: number
    finding: number
    cannotVerify: number
  }
  severityCounts: Record<ReviewSeverity, number>
  findings: {
    total: number
    resolved: number
    open: number
  }
  openLimitations: CertificationOpenLimitation[]
  correctionVerification: {
    materialFindings: number
    verified: number
    rejected: number
    missing: number
  }
  humanSignoffs: {
    count: number
    reviewerIds: string[]
    packetCount: number
    factionIds: string[]
    rulesContextIds: string[]
  }
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
  | 'matched'
  | 'explicit-non-material'
  | 'missing'
  | 'unexpected'
  | 'inaccessible'
  | 'ambiguous'

export interface SourceInventoryEntry {
  publisher: 'games-workshop' | 'wahapedia'
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

export interface CertificationEvaluation {
  ok: boolean
  status: CertificationManifest['status']
  issues: CertificationIssue[]
  summary: CertificationSummary
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
      typeof entry.countsTowardCoverage === 'boolean' &&
      typeof entry.humanSample === 'boolean' &&
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
      ['games-workshop', 'wahapedia'].includes(entry.publisher) &&
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

const reviewerKind = (
  result: ReviewerResult,
  assignments: Map<string, ReviewAssignment>
): 'human' | 'agent' | undefined => assignments.get(result.assignmentId)?.reviewer.kind

const reviewerId = (result: ReviewerResult, assignments: Map<string, ReviewAssignment>): string | undefined =>
  assignments.get(result.assignmentId)?.reviewer.id

const matchingResults = (
  packetId: ReviewPacketId,
  packetChecksum: string,
  kind: 'human' | 'agent',
  resultIndex: Map<ReviewPacketId, ReviewerResult[]>,
  assignments: Map<string, ReviewAssignment>
): ReviewerResult[] =>
  (resultIndex.get(packetId) ?? []).filter(
    result =>
      result.packetChecksum === packetChecksum &&
      result.outcome !== 'cannot-verify' &&
      reviewerKind(result, assignments) === kind
  )

const blindSequenceIssues = (
  entry: ReviewPacketIndexEntry,
  kind: 'human' | 'agent',
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
          `${kind} comparison was recorded before a blind interpretation by the same reviewer`
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
  const blind = matchingResults(
    entry.blindPacketId,
    entry.blindPacketChecksum,
    'agent',
    resultIndex,
    assignments
  )
  const comparison = matchingResults(
    entry.comparisonPacketId,
    entry.comparisonPacketChecksum,
    'agent',
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
        reviewerKind(result, assignments) === 'agent'
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
        reviewerKind(result, assignments) === 'agent'
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
  issues.push(
    ...blindSequenceIssues(entry, 'agent', blind, comparison, assignments, `${entryPath}.comparison`)
  )
  return issues
}

const isEntryReviewed = (
  entry: ReviewPacketIndexEntry,
  resultIndex: Map<ReviewPacketId, ReviewerResult[]>,
  assignments: Map<string, ReviewAssignment>
): boolean => !packetOutcomeIssues(entry, resultIndex, assignments).length

const coverageByValues = (
  entries: ReviewPacketIndexEntry[],
  values: (entry: ReviewPacketIndexEntry) => string[],
  reviewed: (entry: ReviewPacketIndexEntry) => boolean
): Record<string, CertificationCoverageDetail> => {
  const keys = uniqueSorted(entries.flatMap(values))
  return Object.fromEntries(
    keys.map(key => {
      const matching = entries.filter(entry => values(entry).includes(key))
      return [key, count(matching.filter(reviewed).length, matching.length)]
    })
  )
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
  const calibrations = new Map(
    ledger.calibrations.map(calibration => [
      `${calibration.reviewerConfigurationId}:${calibration.rubricVersion}`,
      calibration,
    ])
  )
  ledger.results.forEach((result, resultIndex) => {
    const assignment = assignments.get(result.assignmentId)
    if (!assignment) return
    const expectedConfiguration = reviewerConfigurationId(assignment.reviewer)
    const calibration = calibrations.get(`${expectedConfiguration}:${index.rubricVersion}`)
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
  const issues: CertificationIssue[] = []
  const resolutions = new Map(ledger.resolutions.map(resolution => [resolution.findingId, resolution]))
  const signoffsByLimitation = new Map<ReviewFinding['id'], HumanReviewSignoff[]>()
  ledger.signoffs.forEach(signoff =>
    signoff.acceptedLimitationFindingIds.forEach(findingId =>
      signoffsByLimitation.set(findingId, [...(signoffsByLimitation.get(findingId) ?? []), signoff])
    )
  )
  const openLimitations: CertificationOpenLimitation[] = []
  let materialFindings = 0
  let verified = 0
  let rejected = 0
  let missing = 0
  ledger.findings.forEach((finding, findingIndex) => {
    const resolution = resolutions.get(finding.id)
    if (!resolution) {
      issues.push(
        issue('open-finding', `ledger.findings[${findingIndex}]`, `Finding ${finding.id} has no disposition`)
      )
      return
    }
    if (resolution.disposition === 'accepted-limitation') {
      const signoffs = signoffsByLimitation.get(finding.id) ?? []
      if (!signoffs.length) {
        issues.push(
          issue(
            'unsigned-limitation',
            `ledger.findings[${findingIndex}]`,
            `Accepted limitation ${finding.id} has no human sign-off`
          )
        )
      }
      openLimitations.push({
        findingId: finding.id,
        subject: finding.subject,
        rationale: finding.rationale,
        resolutionRationale: resolution.rationale,
        signoffIds: signoffs.map(signoff => signoff.id).sort(compareText),
      })
    }
    if (finding.severity !== 'blocker' && finding.severity !== 'major') return
    materialFindings += 1
    const verifications = ledger.verifications.filter(verification => verification.findingId === finding.id)
    if (verifications.some(verification => verification.outcome === 'verified')) {
      verified += 1
    } else if (verifications.some(verification => verification.outcome === 'rejected')) {
      rejected += 1
      issues.push(
        issue(
          'rejected-verification',
          `ledger.findings[${findingIndex}]`,
          `Material finding ${finding.id} has a rejected resolution verification`
        )
      )
    } else {
      missing += 1
      issues.push(
        issue(
          'missing-verification',
          `ledger.findings[${findingIndex}]`,
          `Material finding ${finding.id} has no independent verified resolution`
        )
      )
    }
  })
  return {
    issues,
    openLimitations: openLimitations.sort((left, right) => compareText(left.findingId, right.findingId)),
    verification: { materialFindings, verified, rejected, missing },
  }
}

const humanReviewIssues = (
  entries: ReviewPacketIndexEntry[],
  ledger: ReviewLedger,
  resultIndex: Map<ReviewPacketId, ReviewerResult[]>,
  assignments: Map<string, ReviewAssignment>
): CertificationIssue[] => {
  const issues: CertificationIssue[] = []
  const knownPacketIds = new Set(entries.flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId]))
  ledger.signoffs.forEach((signoff, signoffIndex) => {
    signoff.packetIds.forEach(packetId => {
      if (!knownPacketIds.has(packetId)) {
        issues.push(
          issue(
            'missing-human-signoff',
            `ledger.signoffs[${signoffIndex}].packetIds`,
            `Sign-off references unknown or stale packet ${packetId}`,
            'stale'
          )
        )
      }
    })
  })
  entries
    .filter(entry => entry.humanSample)
    .forEach(entry => {
      const path = `index.entries.${entry.pairKey}.humanSample`
      const blind = matchingResults(
        entry.blindPacketId,
        entry.blindPacketChecksum,
        'human',
        resultIndex,
        assignments
      )
      const comparison = matchingResults(
        entry.comparisonPacketId,
        entry.comparisonPacketChecksum,
        'human',
        resultIndex,
        assignments
      )
      if (!comparison.length || (entry.blindDerivationRequired && !blind.length)) {
        issues.push(
          issue(
            'missing-human-review',
            path,
            'Human sample packet does not have the required blind and comparison review outcomes'
          )
        )
        return
      }
      issues.push(
        ...blindSequenceIssues(entry, 'human', blind, comparison, assignments, `${path}.comparison`)
      )
      const humanReviewerIds = new Set(
        [...blind, ...comparison]
          .map(result => assignments.get(result.assignmentId)?.reviewer)
          .filter(reviewer => reviewer?.kind === 'human')
          .map(reviewer => reviewer!.id)
      )
      const signoff = ledger.signoffs.find(
        value =>
          value.packetIds.includes(entry.comparisonPacketId) &&
          humanReviewerIds.has(value.reviewerId) &&
          entry.factionIds.every(factionId => value.factionIds.includes(factionId)) &&
          entry.rulesContextIds.every(contextId => value.rulesContextIds.includes(contextId))
      )
      if (!signoff) {
        issues.push(
          issue(
            'missing-human-signoff',
            path,
            'Human sample packet is not covered by a matching reviewer sign-off'
          )
        )
      }
    })
  const resolutionByFindingId = new Map(
    ledger.resolutions.map(resolution => [resolution.findingId, resolution])
  )
  ledger.findings
    .filter(
      finding =>
        finding.severity === 'blocker' ||
        finding.severity === 'major' ||
        resolutionByFindingId.get(finding.id)?.disposition === 'accepted-limitation'
    )
    .forEach((finding, index) => {
      const candidatePacketIds = [
        finding.packetId,
        ...ledger.verifications
          .filter(verification => verification.findingId === finding.id)
          .map(verification => verification.packetId),
      ]
      const inspected = candidatePacketIds.some(packetId => {
        const entry = entries.find(
          value => value.blindPacketId === packetId || value.comparisonPacketId === packetId
        )
        if (!entry) return false
        const checksum =
          entry.blindPacketId === packetId ? entry.blindPacketChecksum : entry.comparisonPacketChecksum
        const humanResults = matchingResults(packetId, checksum, 'human', resultIndex, assignments)
        const reviewerIds = new Set(
          humanResults
            .map(result => assignments.get(result.assignmentId)?.reviewer)
            .filter(reviewer => reviewer?.kind === 'human')
            .map(reviewer => reviewer!.id)
        )
        return ledger.signoffs.some(
          signoff => signoff.packetIds.includes(packetId) && reviewerIds.has(signoff.reviewerId)
        )
      })
      if (!inspected) {
        issues.push(
          issue(
            'missing-human-signoff',
            `ledger.findings[${index}]`,
            `Material finding or accepted limitation ${finding.id} lacks a matching human review and sign-off`
          )
        )
      }
    })
  return issues
}

const coverageIssues = (
  coverage: CertificationCoverage,
  index: ReviewPacketSafeIndex,
  summary: Omit<CertificationSummary, 'issues' | 'status'>
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

export const evaluateCertification = (input: CertificationEvaluationInput): CertificationEvaluation => {
  const index = input.index
  const ledger = input.ledger
  const inventory = input.inventory
  const inventoryEntries = Array.isArray(inventory?.entries) ? inventory.entries : []
  const assignments = assignmentById(ledger)
  const resultIndex = resultsByPacket(ledger)
  const liveEntries = index.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  const reviewed = (entry: ReviewPacketIndexEntry): boolean =>
    isEntryReviewed(entry, resultIndex, assignments)
  const machineIssues = liveEntries.flatMap(entry => packetOutcomeIssues(entry, resultIndex, assignments))
  const partialImports = liveEntries.filter(entry => {
    const blind = matchingResults(
      entry.blindPacketId,
      entry.blindPacketChecksum,
      'agent',
      resultIndex,
      assignments
    )
    const comparison = matchingResults(
      entry.comparisonPacketId,
      entry.comparisonPacketChecksum,
      'agent',
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
  const factionContextCoverage = Object.fromEntries(
    index.coverage.factionContextStrata.map(stratum => {
      const [factionId, contextId] = stratum.split('|')
      const entries = liveEntries.filter(
        entry =>
          entry.factionIds.includes(factionId as never) && entry.rulesContextIds.includes(contextId as never)
      )
      return [stratum, count(entries.filter(reviewed).length, entries.length)]
    })
  )
  const highRiskCoverage = Object.fromEntries(
    index.coverage.highRiskCohorts.map(cohort => {
      const entries = liveEntries.filter(entry => entry.cohortIds.includes(cohort))
      return [cohort, count(entries.filter(reviewed).length, entries.length)]
    })
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
    pass: ledger.results.filter(result => result.outcome === 'pass').length,
    finding: ledger.results.filter(result => result.outcome === 'finding').length,
    'cannot-verify': ledger.results.filter(result => result.outcome === 'cannot-verify').length,
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
  const summaryWithoutStatusAndIssues: Omit<CertificationSummary, 'status' | 'issues'> = {
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
    humanSignoffs: {
      count: ledger.signoffs.length,
      reviewerIds: uniqueSorted(ledger.signoffs.map(signoff => signoff.reviewerId)),
      packetCount: new Set(ledger.signoffs.flatMap(signoff => signoff.packetIds)).size,
      factionIds: uniqueSorted(ledger.signoffs.flatMap(signoff => signoff.factionIds)),
      rulesContextIds: uniqueSorted(ledger.signoffs.flatMap(signoff => signoff.rulesContextIds)),
    },
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
    ...ledgerIssues(ledger),
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
    ...calibrationIssues(ledger, index),
    ...machineIssues,
    ...partialImports.map(entry =>
      issue(
        'partial-review-import',
        entry.pairKey,
        'Only one half of the blind/comparison review pair was imported'
      )
    ),
    ...findingEvaluation.issues,
    ...humanReviewIssues(liveEntries, ledger, resultIndex, assignments),
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
  ledgerChecksum: checksumReviewRecord(input.ledger),
  signoffChecksum: checksumReviewRecord(input.ledger.signoffs),
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
  if (input.manifest.ledgerChecksum !== checksumReviewRecord(input.ledger)) {
    issues.push(issue('stale-ledger', 'manifest.ledgerChecksum', 'Review ledger has changed', 'stale'))
  }
  if (input.manifest.signoffChecksum !== checksumReviewRecord(input.ledger.signoffs)) {
    issues.push(issue('stale-signoff', 'manifest.signoffChecksum', 'Human sign-offs have changed', 'stale'))
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

export const appendHumanReviewSignoff = (
  ledger: ReviewLedger,
  signoff: HumanReviewSignoff,
  packets?: ReviewPacket[]
): ReviewLedger =>
  assertLedgerCandidate(
    {
      ...ledger,
      signoffs: [...ledger.signoffs, signoff].sort((left, right) => compareText(left.id, right.id)),
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
  signoffs: [],
})
