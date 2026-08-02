import {
  AOS4_CERTIFICATION_SCHEMA_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  createReviewAssignment,
  createReviewFinding,
  expectedReviewPacketChecksum,
  reviewerConfigurationId,
  reviewCalibrationForAssignment,
  reviewCalibrationIdentity,
  type CertificationCoverage,
  type CertificationManifest,
  type FindingResolution,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewPacket,
  type ReviewerResult,
} from './records'

const SHA256_PATTERN = /^[0-9a-f]{64}$/i
const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/
const REVIEW_PACKET_ID_PATTERN = /^review-packet:sha256:[0-9a-f]{64}$/i
const REVIEW_ASSIGNMENT_ID_PATTERN = /^review-assignment:sha256:[0-9a-f]{64}$/i
const REVIEW_FINDING_ID_PATTERN = /^review-finding:sha256:[0-9a-f]{64}$/i
const REVIEWER_CONFIGURATION_ID_PATTERN = /^reviewer-configuration:sha256:[0-9a-f]{64}$/i

export type ReviewValidationIssueCode =
  | 'invalid-shape'
  | 'invalid-schema'
  | 'invalid-checksum'
  | 'invalid-timestamp'
  | 'duplicate-assignment'
  | 'duplicate-calibration'
  | 'duplicate-result'
  | 'duplicate-finding'
  | 'duplicate-resolution'
  | 'duplicate-verification'
  | 'unknown-assignment'
  | 'unknown-packet'
  | 'orphan-finding'
  | 'missing-ledger-finding'
  | 'packet-not-assigned'
  | 'stale-packet'
  | 'reviewer-configuration-mismatch'
  | 'missing-calibration'
  | 'failed-calibration'
  | 'unapproved-external-recipient'
  | 'outcome-finding-mismatch'
  | 'invalid-evidence'
  | 'unknown-finding'
  | 'material-accepted-limitation'
  | 'insufficient-role-separation'
  | 'invalid-resolution'

export interface ReviewValidationIssue {
  code: ReviewValidationIssueCode
  path: string
  message: string
}

export class ReviewValidationError extends Error {
  readonly issues: ReviewValidationIssue[]

  constructor(message: string, issues: ReviewValidationIssue[]) {
    super(message)
    this.name = 'ReviewValidationError'
    this.issues = issues
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'
const isNonEmptyString = (value: unknown): value is string => isString(value) && Boolean(value.trim())
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString)
const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
const isIsoInstant = (value: unknown): value is string =>
  isString(value) && ISO_INSTANT_PATTERN.test(value) && !Number.isNaN(new Date(value).valueOf())
const isChecksum = (value: unknown): value is string => isString(value) && SHA256_PATTERN.test(value)
const isSourceRecordId = (value: unknown): value is string =>
  isString(value) && value.startsWith('source-record:') && value.length > 'source-record:'.length
const isRulesContextId = (value: unknown): value is string =>
  isString(value) && /^rules-context:[0-9a-f-]{36}$/i.test(value)
const isArtifactId = (value: unknown): value is string =>
  isString(value) && /^artifact:sha256:[0-9a-f]{64}$/i.test(value)
const isRepoRelativePath = (value: unknown): value is string =>
  isNonEmptyString(value) && !/^[A-Za-z]:[\\/]|^[/\\]/.test(value) && !value.split(/[\\/]/).includes('..')

const isSourceLocator = (value: unknown): boolean => {
  if (!isRecord(value) || !isString(value.kind)) return false
  if (value.kind === 'page') {
    return (
      typeof value.page === 'number' &&
      Number.isSafeInteger(value.page) &&
      value.page > 0 &&
      (value.section === undefined || isNonEmptyString(value.section))
    )
  }
  if (value.kind === 'row') {
    return typeof value.row === 'number' && Number.isSafeInteger(value.row) && value.row > 0
  }
  if (value.kind === 'section') return isNonEmptyString(value.section)
  return value.kind === 'document'
}

const issue = (code: ReviewValidationIssueCode, path: string, message: string): ReviewValidationIssue => ({
  code,
  path,
  message,
})

const duplicateIssues = <T>(
  values: T[],
  key: (value: T) => string,
  code: ReviewValidationIssueCode,
  path: string
): ReviewValidationIssue[] => {
  const seen = new Set<string>()
  const issues: ReviewValidationIssue[] = []
  values.forEach((value, index) => {
    const identity = key(value)
    if (seen.has(identity)) {
      issues.push(issue(code, `${path}[${index}]`, `Duplicate ${identity}`))
    }
    seen.add(identity)
  })
  return issues
}

const reviewRecordBaseIssues = (value: unknown, path: string): ReviewValidationIssue[] => {
  if (!isRecord(value)) return [issue('invalid-shape', path, 'Expected an object')]
  return value.schemaVersion === AOS4_REVIEW_SCHEMA_VERSION
    ? []
    : [issue('invalid-schema', `${path}.schemaVersion`, 'Expected review schema version 1')]
}

const reviewerIssues = (assignment: ReviewAssignment, path: string): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(assignment, path)
  if (!isRecord(assignment)) return issues
  const packetIds = Array.isArray(assignment.packetIds) ? assignment.packetIds : []
  if (!REVIEW_ASSIGNMENT_ID_PATTERN.test(assignment.id)) {
    issues.push(issue('invalid-shape', `${path}.id`, 'Invalid review assignment ID'))
  }
  if (!packetIds.length || !packetIds.every(id => REVIEW_PACKET_ID_PATTERN.test(id))) {
    issues.push(issue('invalid-shape', `${path}.packetIds`, 'Assignment requires valid packet IDs'))
  }
  if (
    !isNonEmptyString(assignment.reviewer?.id) ||
    assignment.reviewer?.kind !== 'agent' ||
    !isNonEmptyString(assignment.reviewer?.protocolVersion) ||
    !isNonEmptyString(assignment.reviewer?.promptVersion)
  ) {
    issues.push(issue('invalid-shape', `${path}.reviewer`, 'Invalid reviewer metadata'))
  }
  if (!['local', 'external'].includes(assignment.execution)) {
    issues.push(issue('invalid-shape', `${path}.execution`, 'Invalid review execution kind'))
  }
  if (!isIsoInstant(assignment.assignedAt)) {
    issues.push(issue('invalid-timestamp', `${path}.assignedAt`, 'Invalid assignment timestamp'))
  }
  if (
    packetIds.length &&
    assignment.reviewer &&
    assignment.reviewer.kind === 'agent' &&
    ['local', 'external'].includes(assignment.execution)
  ) {
    const expectedId = createReviewAssignment({ ...assignment, packetIds, id: undefined }).id
    if (assignment.id !== expectedId) {
      issues.push(issue('invalid-checksum', `${path}.id`, 'Assignment ID does not match semantic content'))
    }
  }
  if (assignment.execution === 'external') {
    const approved = assignment.approvedRecipient
    if (
      !approved ||
      !isNonEmptyString(approved.provider) ||
      !isNonEmptyString(approved.recipient) ||
      !isNonEmptyString(approved.approvedBy) ||
      !isIsoInstant(approved.approvedAt) ||
      !isNonEmptyString(approved.sourceHandlingAttestation)
    ) {
      issues.push(
        issue(
          'unapproved-external-recipient',
          `${path}.approvedRecipient`,
          'External review requires an approved recipient and source-handling attestation'
        )
      )
    }
  }
  return issues
}

const calibrationIssues = (calibration: ReviewCalibration, path: string): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(calibration, path)
  if (!REVIEWER_CONFIGURATION_ID_PATTERN.test(calibration.reviewerConfigurationId)) {
    issues.push(
      issue('invalid-shape', `${path}.reviewerConfigurationId`, 'Invalid reviewer configuration ID')
    )
  }
  if (!isNonEmptyString(calibration.rubricVersion) || !isIsoInstant(calibration.calibratedAt)) {
    issues.push(issue('invalid-shape', path, 'Calibration requires rubric and timestamp'))
  }
  const counts = [
    calibration.seededBlockerMajorDefects,
    calibration.foundSeededBlockerMajorDefects,
    calibration.unsupportedExpectedValues,
    calibration.insufficientEvidenceCases,
    calibration.correctCannotVerifyCases,
  ]
  if (!counts.every(isNonNegativeInteger)) {
    issues.push(issue('invalid-shape', path, 'Calibration counts must be non-negative integers'))
  }
  const actuallyPassed =
    calibration.foundSeededBlockerMajorDefects === calibration.seededBlockerMajorDefects &&
    calibration.unsupportedExpectedValues === 0 &&
    calibration.correctCannotVerifyCases === calibration.insufficientEvidenceCases
  if (calibration.passed !== actuallyPassed) {
    issues.push(issue('invalid-shape', `${path}.passed`, 'Calibration pass flag does not match its evidence'))
  }
  if (calibration.evidence) {
    const { receiptChecksum, ...receipt } = calibration.evidence
    if (
      !REVIEW_ASSIGNMENT_ID_PATTERN.test(receipt.assignmentId) ||
      !isChecksum(receipt.blindResultsChecksum) ||
      !isChecksum(receipt.comparisonResultsChecksum) ||
      !isChecksum(receipt.controlPairKeysChecksum) ||
      !isChecksum(receiptChecksum) ||
      receiptChecksum !== checksumReviewRecord(receipt)
    ) {
      issues.push(issue('invalid-checksum', `${path}.evidence`, 'Calibration evidence receipt is invalid'))
    }
  }
  return issues
}

const findingShapeIssues = (finding: ReviewFinding, path: string): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(finding, path)
  if (!REVIEW_FINDING_ID_PATTERN.test(finding.id)) {
    issues.push(issue('invalid-shape', `${path}.id`, 'Invalid review finding ID'))
  }
  if (!REVIEW_PACKET_ID_PATTERN.test(finding.packetId)) {
    issues.push(issue('invalid-shape', `${path}.packetId`, 'Invalid packet ID'))
  }
  if (
    !isSourceRecordId(finding.subject?.sourceRecordId) ||
    !isNonEmptyString(finding.subject?.field) ||
    !['blocker', 'major', 'minor'].includes(finding.severity) ||
    !['high', 'medium', 'low'].includes(finding.confidence) ||
    !isNonEmptyString(finding.rationale) ||
    !Array.isArray(finding.evidence) ||
    !finding.evidence.length
  ) {
    issues.push(issue('invalid-shape', path, 'Finding is missing required evidence or metadata'))
    return issues
  }
  finding.evidence.forEach((evidence, index) => {
    if (
      !isSourceRecordId(evidence.sourceRecordId) ||
      !isChecksum(evidence.recordChecksum) ||
      !isSourceLocator(evidence.locator)
    ) {
      issues.push(
        issue('invalid-evidence', `${path}.evidence[${index}]`, 'Invalid finding evidence reference')
      )
    }
  })
  const expectedId = createReviewFinding({ ...finding, id: undefined }).id
  if (finding.id !== expectedId) {
    issues.push(issue('invalid-checksum', `${path}.id`, 'Finding ID does not match semantic content'))
  }
  return issues
}

const resultShapeIssues = (result: ReviewerResult, path: string): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(result, path)
  if (
    !REVIEW_ASSIGNMENT_ID_PATTERN.test(result.assignmentId) ||
    !REVIEW_PACKET_ID_PATTERN.test(result.packetId) ||
    !isChecksum(result.packetChecksum) ||
    !REVIEWER_CONFIGURATION_ID_PATTERN.test(result.reviewerConfigurationId) ||
    !isIsoInstant(result.reviewedAt) ||
    !['pass', 'finding', 'cannot-verify'].includes(result.outcome) ||
    !isNonEmptyString(result.rationale) ||
    !Array.isArray(result.findings)
  ) {
    issues.push(issue('invalid-shape', path, 'Invalid reviewer result'))
    return issues
  }
  result.findings.forEach((finding, index) =>
    issues.push(...findingShapeIssues(finding, `${path}.findings[${index}]`))
  )
  return issues
}

const packetIssues = (packet: ReviewPacket, path: string): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(packet, path)
  if (
    !REVIEW_PACKET_ID_PATTERN.test(packet.id) ||
    !isChecksum(packet.packetChecksum) ||
    !isNonEmptyString(packet.protocolVersion) ||
    !isNonEmptyString(packet.rubricVersion) ||
    !isStringArray(packet.cohortIds) ||
    !packet.cohortIds.length ||
    !Array.isArray(packet.sourceEvidence) ||
    !packet.sourceEvidence.length ||
    !Array.isArray(packet.generatedDestinations) ||
    !isStringArray(packet.rulesContextIds) ||
    !packet.rulesContextIds.every(isRulesContextId) ||
    typeof packet.blind !== 'boolean'
  ) {
    issues.push(issue('invalid-shape', path, 'Invalid review packet'))
    return issues
  }
  const expectedChecksum = expectedReviewPacketChecksum(packet)
  if (
    packet.packetChecksum !== expectedChecksum ||
    packet.id !== `review-packet:sha256:${expectedChecksum}`
  ) {
    issues.push(issue('invalid-checksum', path, 'Packet identity does not match semantic content'))
  }
  packet.sourceEvidence.forEach((evidence, index) => {
    if (
      !isSourceRecordId(evidence.sourceRecordId) ||
      !isChecksum(evidence.recordChecksum) ||
      !isSourceLocator(evidence.locator) ||
      (evidence.artifactId !== undefined && !isArtifactId(evidence.artifactId)) ||
      !['official', 'secondary', 'community', 'unknown'].includes(evidence.authority)
    ) {
      issues.push(issue('invalid-evidence', `${path}.sourceEvidence[${index}]`, 'Invalid packet evidence'))
    }
  })
  packet.generatedDestinations.forEach((destination, index) => {
    if (
      !isRepoRelativePath(destination.path) ||
      !isNonEmptyString(destination.field) ||
      (destination.canonicalEntityId !== undefined && !isNonEmptyString(destination.canonicalEntityId))
    ) {
      issues.push(
        issue('invalid-shape', `${path}.generatedDestinations[${index}]`, 'Invalid generated destination')
      )
    }
  })
  return issues
}

const resolutionIssues = (
  resolution: FindingResolution,
  finding: ReviewFinding | undefined,
  path: string
): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(resolution, path)
  if (
    !REVIEW_FINDING_ID_PATTERN.test(resolution.findingId) ||
    !['fixed', 'false-positive', 'accepted-limitation'].includes(resolution.disposition) ||
    !isNonEmptyString(resolution.rationale) ||
    !isNonEmptyString(resolution.resolvedBy) ||
    !isIsoInstant(resolution.resolvedAt) ||
    !isStringArray(resolution.upstreamChangeRefs)
  ) {
    issues.push(issue('invalid-resolution', path, 'Invalid finding resolution'))
  }
  if (!finding) {
    issues.push(issue('unknown-finding', `${path}.findingId`, 'Resolution references an unknown finding'))
  } else if (resolution.disposition === 'accepted-limitation' && finding.severity !== 'minor') {
    issues.push(
      issue(
        'material-accepted-limitation',
        `${path}.disposition`,
        'Blocker and major findings cannot be accepted limitations'
      )
    )
  }
  if (resolution.disposition === 'fixed' && !resolution.upstreamChangeRefs.length) {
    issues.push(
      issue('invalid-resolution', `${path}.upstreamChangeRefs`, 'Fixed findings require upstream changes')
    )
  }
  return issues
}

const sortedIssues = (issues: ReviewValidationIssue[]): ReviewValidationIssue[] =>
  issues.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message)
  )

export const validateReviewPacket = (packet: ReviewPacket): ReviewValidationIssue[] =>
  sortedIssues(packetIssues(packet, 'packet'))

export const validateReviewLedger = (
  ledger: ReviewLedger,
  packets?: ReviewPacket[]
): ReviewValidationIssue[] => {
  const issues = reviewRecordBaseIssues(ledger, 'ledger')
  if (
    !isRecord(ledger) ||
    !Array.isArray(ledger.assignments) ||
    !Array.isArray(ledger.calibrations) ||
    !Array.isArray(ledger.results) ||
    !Array.isArray(ledger.findings) ||
    !Array.isArray(ledger.resolutions) ||
    !Array.isArray(ledger.verifications)
  ) {
    return sortedIssues([
      ...issues,
      issue('invalid-shape', 'ledger', 'Review ledger collections are missing'),
    ])
  }

  issues.push(
    ...duplicateIssues(ledger.assignments, value => value.id, 'duplicate-assignment', 'assignments'),
    ...duplicateIssues(
      ledger.calibrations,
      reviewCalibrationIdentity,
      'duplicate-calibration',
      'calibrations'
    ),
    ...duplicateIssues(
      ledger.results,
      value => `${value.assignmentId}:${value.packetId}`,
      'duplicate-result',
      'results'
    ),
    ...duplicateIssues(ledger.findings, value => value.id, 'duplicate-finding', 'findings'),
    ...duplicateIssues(ledger.resolutions, value => value.findingId, 'duplicate-resolution', 'resolutions'),
    ...duplicateIssues(
      ledger.verifications,
      value => `${value.findingId}:${value.verifierId}`,
      'duplicate-verification',
      'verifications'
    )
  )

  const validatePacketReferences = packets !== undefined
  const packetById = new Map((packets ?? []).map(packet => [packet.id, packet]))
  ;(packets ?? []).forEach((packet, index) => issues.push(...packetIssues(packet, `packets[${index}]`)))

  ledger.assignments.forEach((assignment, index) =>
    issues.push(...reviewerIssues(assignment, `assignments[${index}]`))
  )
  ledger.calibrations.forEach((value, index) =>
    issues.push(...calibrationIssues(value, `calibrations[${index}]`))
  )
  ledger.results.forEach((value, index) => issues.push(...resultShapeIssues(value, `results[${index}]`)))
  ledger.findings.forEach((value, index) => issues.push(...findingShapeIssues(value, `findings[${index}]`)))

  const assignmentById = new Map(ledger.assignments.map(value => [value.id, value]))
  const packetIdsByAssignmentId = new Map(
    ledger.assignments.map(value => [value.id, new Set(value.packetIds)])
  )
  const findingById = new Map(ledger.findings.map(value => [value.id, value]))
  const originatingReviewerByFindingId = new Map<string, string>()
  const resultFindingIds = new Set<ReviewFinding['id']>()

  ledger.results.forEach((result, resultIndex) => {
    const path = `results[${resultIndex}]`
    const assignment = assignmentById.get(result.assignmentId)
    const packet = packetById.get(result.packetId)
    if (!assignment) {
      issues.push(
        issue('unknown-assignment', `${path}.assignmentId`, 'Result references an unknown assignment')
      )
      return
    }
    if (!packetIdsByAssignmentId.get(assignment.id)!.has(result.packetId)) {
      issues.push(issue('packet-not-assigned', `${path}.packetId`, 'Packet is not part of the assignment'))
    }
    if (validatePacketReferences) {
      if (!packet) {
        issues.push(issue('unknown-packet', `${path}.packetId`, 'Result references an unknown packet'))
      } else if (packet.packetChecksum !== result.packetChecksum) {
        issues.push(issue('stale-packet', `${path}.packetChecksum`, 'Result packet checksum is stale'))
      }
    }
    const configurationId = reviewerConfigurationId(assignment.reviewer)
    if (result.reviewerConfigurationId !== configurationId) {
      issues.push(
        issue(
          'reviewer-configuration-mismatch',
          `${path}.reviewerConfigurationId`,
          'Result does not match the assigned reviewer configuration'
        )
      )
    }
    const calibration = reviewCalibrationForAssignment(
      ledger.calibrations,
      result.assignmentId,
      result.reviewerConfigurationId,
      packet?.rubricVersion ?? ledger.calibrations[0]?.rubricVersion ?? '',
      ledger.assignments.length
    )
    if (!calibration) {
      issues.push(issue('missing-calibration', path, 'Agent result requires a matching calibration'))
    } else if (!calibration.passed) {
      issues.push(issue('failed-calibration', path, 'Agent calibration did not pass'))
    }
    if (assignment.execution === 'external' && !assignment.approvedRecipient) {
      issues.push(
        issue('unapproved-external-recipient', path, 'External result does not have an approved recipient')
      )
    }
    if ((result.outcome === 'finding') !== Boolean(result.findings.length)) {
      issues.push(
        issue(
          'outcome-finding-mismatch',
          `${path}.outcome`,
          'Finding outcome and finding collection disagree'
        )
      )
    }
    result.findings.forEach((finding, findingIndex) => {
      resultFindingIds.add(finding.id)
      originatingReviewerByFindingId.set(finding.id, assignment.reviewer.id)
      if (finding.packetId !== result.packetId) {
        issues.push(
          issue(
            'packet-not-assigned',
            `${path}.findings[${findingIndex}].packetId`,
            'Finding belongs to a different packet'
          )
        )
      }
      if (validatePacketReferences) {
        const packetEvidence = new Map(
          (packet?.sourceEvidence ?? []).map(evidence => [evidence.sourceRecordId, evidence.recordChecksum])
        )
        finding.evidence.forEach((evidence, evidenceIndex) => {
          if (packetEvidence.get(evidence.sourceRecordId) !== evidence.recordChecksum) {
            issues.push(
              issue(
                'invalid-evidence',
                `${path}.findings[${findingIndex}].evidence[${evidenceIndex}]`,
                'Finding evidence does not match the reviewed packet'
              )
            )
          }
        })
      }
    })
  })
  ledger.findings.forEach((finding, index) => {
    if (!resultFindingIds.has(finding.id)) {
      issues.push(
        issue('orphan-finding', `findings[${index}]`, 'Ledger finding is not owned by a reviewer result')
      )
    }
  })
  resultFindingIds.forEach(findingId => {
    if (!findingById.has(findingId)) {
      issues.push(
        issue(
          'missing-ledger-finding',
          'findings',
          `Reviewer result finding ${findingId} is missing from the ledger`
        )
      )
    }
  })

  ledger.resolutions.forEach((resolution, index) =>
    issues.push(
      ...resolutionIssues(resolution, findingById.get(resolution.findingId), `resolutions[${index}]`)
    )
  )
  const resolutionByFindingId = new Map(
    ledger.resolutions.map(resolution => [resolution.findingId, resolution])
  )
  ledger.verifications.forEach((verification, index) => {
    const path = `verifications[${index}]`
    const finding = findingById.get(verification.findingId)
    const packet = packetById.get(verification.packetId)
    const invalidShape =
      verification.schemaVersion !== AOS4_REVIEW_SCHEMA_VERSION ||
      !finding ||
      !['verified', 'rejected'].includes(verification.outcome) ||
      !isNonEmptyString(verification.rationale) ||
      !isNonEmptyString(verification.verifierId) ||
      !isIsoInstant(verification.verifiedAt) ||
      !REVIEW_PACKET_ID_PATTERN.test(verification.packetId) ||
      !isChecksum(verification.packetChecksum)
    if (invalidShape) {
      issues.push(issue('invalid-resolution', path, 'Invalid finding verification'))
      return
    }
    if (validatePacketReferences && (!packet || packet.packetChecksum !== verification.packetChecksum)) {
      issues.push(issue('invalid-resolution', path, 'Verification packet is missing or stale'))
    }
    if (
      finding.severity === 'blocker' ||
      finding.severity === 'major' ||
      resolutionByFindingId.get(finding.id)?.disposition === 'accepted-limitation'
    ) {
      const originator = originatingReviewerByFindingId.get(finding.id)
      const resolver = resolutionByFindingId.get(finding.id)?.resolvedBy
      if (
        !originator ||
        !resolver ||
        verification.verifierId === originator ||
        verification.verifierId === resolver
      ) {
        issues.push(
          issue(
            'insufficient-role-separation',
            path,
            'Required finding verification must be independent of reviewer and resolver'
          )
        )
      }
    }
  })

  return sortedIssues(issues)
}

const assertReviewerResult = (input: unknown): ReviewerResult => {
  if (!isRecord(input)) {
    throw new ReviewValidationError('Reviewer result is invalid', [
      issue('invalid-shape', 'result', 'Expected an object'),
    ])
  }
  const result = input as unknown as ReviewerResult
  const issues = resultShapeIssues(result, 'result')
  if (issues.length) throw new ReviewValidationError('Reviewer result is invalid', sortedIssues(issues))
  return result
}

export const importReviewerResultAtomic = (
  ledger: ReviewLedger,
  input: unknown,
  packets: ReviewPacket[]
): ReviewLedger => {
  const existingIssues = validateReviewLedger(ledger, packets)
  if (existingIssues.length) {
    throw new ReviewValidationError(
      `Existing review ledger is invalid: ${existingIssues[0].message}`,
      existingIssues
    )
  }
  const result = assertReviewerResult(input)
  const candidate: ReviewLedger = {
    ...ledger,
    results: [...ledger.results, result].sort(
      (left, right) =>
        left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
    ),
    findings: [...ledger.findings, ...result.findings].sort((left, right) => left.id.localeCompare(right.id)),
  }
  const issues = validateReviewLedger(candidate, packets)
  if (issues.length) {
    throw new ReviewValidationError(`Reviewer result cannot be imported: ${issues[0].message}`, issues)
  }
  return candidate
}

export const parseReviewLedger = (input: unknown): ReviewLedger => {
  if (!isRecord(input)) {
    throw new ReviewValidationError('Review ledger is invalid', [
      issue('invalid-shape', 'ledger', 'Expected an object'),
    ])
  }
  const ledger = input as unknown as ReviewLedger
  const issues = validateReviewLedger(ledger)
  if (issues.length) {
    throw new ReviewValidationError('Review ledger is invalid', issues)
  }
  return ledger
}

const coverageIssues = (coverage: unknown, path: string): ReviewValidationIssue[] => {
  if (!isRecord(coverage)) return [issue('invalid-shape', path, 'Expected coverage object')]
  const keys: Array<keyof CertificationCoverage> = [
    'officialRecords',
    'reconciliationDiscrepancies',
    'profileOnlyFacts',
    'sourceRecords',
    'ignoredRecords',
    'factionContextStrata',
    'highRiskCohorts',
  ]
  return keys.flatMap(key => {
    const value = coverage[key]
    if (!isRecord(value) || !isNonNegativeInteger(value.reviewed) || !isNonNegativeInteger(value.expected)) {
      return [issue('invalid-shape', `${path}.${key}`, 'Invalid certification coverage count')]
    }
    return []
  })
}

export const parseCertificationManifest = (input: unknown): CertificationManifest => {
  if (!isRecord(input)) {
    throw new ReviewValidationError('Certification manifest is invalid', [
      issue('invalid-shape', 'manifest', 'Expected an object'),
    ])
  }
  const manifest = input as unknown as CertificationManifest
  const issues: ReviewValidationIssue[] = []
  if (manifest.schemaVersion !== AOS4_CERTIFICATION_SCHEMA_VERSION) {
    issues.push(issue('invalid-schema', 'manifest.schemaVersion', 'Expected certification schema 1'))
  }
  if (
    !isNonEmptyString(manifest.revision) ||
    !['pass', 'blocked', 'stale'].includes(manifest.status) ||
    !isIsoInstant(manifest.certifiedAt) ||
    !Array.isArray(manifest.inputs) ||
    !isRecord(manifest.protocol) ||
    !isNonEmptyString(manifest.protocol.protocolVersion) ||
    !isNonEmptyString(manifest.protocol.rubricVersion) ||
    !isChecksum(manifest.protocol.checksum) ||
    !isChecksum(manifest.ledgerChecksum) ||
    (manifest.ledgerChecksumKind !== undefined && manifest.ledgerChecksumKind !== 'input-bindings/v1') ||
    !isChecksum(manifest.inventoryChecksum) ||
    !isIsoInstant(manifest.sourceObservedAt)
  ) {
    issues.push(issue('invalid-shape', 'manifest', 'Certification manifest fields are invalid'))
  }
  manifest.inputs?.forEach((inputValue, index) => {
    if (
      !isNonEmptyString(inputValue.name) ||
      !isNonEmptyString(inputValue.path) ||
      !isChecksum(inputValue.checksum) ||
      !isRepoRelativePath(inputValue.path)
    ) {
      issues.push(issue('invalid-shape', `manifest.inputs[${index}]`, 'Invalid certification input binding'))
    }
  })
  if (
    manifest.execution !== undefined &&
    (!isRecord(manifest.execution) ||
      !['full', 'incremental'].includes(manifest.execution.mode) ||
      !isNonNegativeInteger(manifest.execution.totalPairs) ||
      !isNonNegativeInteger(manifest.execution.reusedPairs) ||
      !isNonNegativeInteger(manifest.execution.freshPairs) ||
      manifest.execution.reusedPairs + manifest.execution.freshPairs !== manifest.execution.totalPairs ||
      !isChecksum(manifest.execution.checksum))
  ) {
    issues.push(issue('invalid-shape', 'manifest.execution', 'Invalid certification execution'))
  }
  issues.push(
    ...duplicateIssues(manifest.inputs ?? [], value => value.name, 'invalid-shape', 'manifest.inputs'),
    ...coverageIssues(manifest.coverage, 'manifest.coverage')
  )
  if (issues.length) {
    throw new ReviewValidationError('Certification manifest is invalid', sortedIssues(issues))
  }
  return manifest
}
