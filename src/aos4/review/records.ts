import { createHash } from 'node:crypto'
import type { ArtifactId, CanonicalId, RulesContextId, SourceLocator, SourceRecordId } from '../domain'
import { stableCompactJson, stableJson } from '../generate/serialization'

export const AOS4_REVIEW_SCHEMA_VERSION = 1 as const
export const AOS4_CERTIFICATION_SCHEMA_VERSION = 1 as const
export const AOS4_REVIEW_PROTOCOL_VERSION = 'aos4-review/v1' as const
export const AOS4_REVIEW_RUBRIC_VERSION = 'aos4-rubric/v2' as const
export const AOS4_REVIEW_PROMPT_VERSION = 'aos4-review-prompt/v1' as const
export const AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION = 'evidence-auditor/v3' as const

export type ReviewPacketId = `review-packet:sha256:${string}`
export type ReviewAssignmentId = `review-assignment:sha256:${string}`
export type ReviewFindingId = `review-finding:sha256:${string}`
export type ReviewerConfigurationId = `reviewer-configuration:sha256:${string}`

export type ReviewerKind = 'agent'
export type ReviewExecution = 'local' | 'external'
export type ReviewOutcome = 'pass' | 'finding' | 'cannot-verify'
export type ReviewSeverity = 'blocker' | 'major' | 'minor'
export type ReviewConfidence = 'high' | 'medium' | 'low'
export type FindingDisposition = 'fixed' | 'false-positive' | 'accepted-limitation'
export type VerificationOutcome = 'verified' | 'rejected'
export type CertificationStatus = 'pass' | 'blocked' | 'stale'
export type ReviewAuthority = 'official' | 'secondary' | 'community' | 'unknown'

export interface ReviewEvidenceReference {
  sourceRecordId: SourceRecordId
  recordChecksum: string
  locator: SourceLocator
}

export interface ReviewPacketSourceEvidence extends ReviewEvidenceReference {
  artifactId?: ArtifactId
  authority: ReviewAuthority
  structuredValue?: unknown
  excerptRef?: string
}

export interface ReviewGeneratedDestination {
  path: string
  canonicalEntityId?: CanonicalId
  field: string
  value?: unknown
}

export interface ReviewPacket {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  id: ReviewPacketId
  packetChecksum: string
  protocolVersion: string
  rubricVersion: string
  cohortIds: string[]
  canonicalEntityId?: CanonicalId
  sourceEvidence: ReviewPacketSourceEvidence[]
  generatedDestinations: ReviewGeneratedDestination[]
  rulesContextIds: RulesContextId[]
  blind: boolean
}

export interface ReviewerMetadata {
  id: string
  kind: ReviewerKind
  tool?: string
  model?: string
  protocolVersion: string
  promptVersion: string
}

export interface ApprovedReviewRecipient {
  provider: string
  recipient: string
  approvedBy: string
  approvedAt: string
  sourceHandlingAttestation: string
}

export interface ReviewAssignment {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  id: ReviewAssignmentId
  packetIds: ReviewPacketId[]
  reviewer: ReviewerMetadata
  execution: ReviewExecution
  assignedAt: string
  approvedRecipient?: ApprovedReviewRecipient
}

export interface ReviewFindingSubject {
  canonicalEntityId?: CanonicalId
  sourceRecordId: SourceRecordId
  field: string
}

export interface ReviewFinding {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  id: ReviewFindingId
  packetId: ReviewPacketId
  subject: ReviewFindingSubject
  expectedValue?: unknown
  actualValue?: unknown
  severity: ReviewSeverity
  confidence: ReviewConfidence
  rationale: string
  evidence: ReviewEvidenceReference[]
}

export interface ReviewerResult {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  assignmentId: ReviewAssignmentId
  packetId: ReviewPacketId
  packetChecksum: string
  reviewerConfigurationId: ReviewerConfigurationId
  reviewedAt: string
  outcome: ReviewOutcome
  rationale: string
  blindExpectedInterpretation?: unknown
  findings: ReviewFinding[]
}

export interface ReviewCalibration {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  reviewerConfigurationId: ReviewerConfigurationId
  rubricVersion: string
  calibratedAt: string
  seededBlockerMajorDefects: number
  foundSeededBlockerMajorDefects: number
  unsupportedExpectedValues: number
  insufficientEvidenceCases: number
  correctCannotVerifyCases: number
  passed: boolean
  evidence?: {
    assignmentId: ReviewAssignmentId
    blindResultsChecksum: string
    comparisonResultsChecksum: string
    controlPairKeysChecksum: string
    receiptChecksum: string
  }
}

export interface FindingResolution {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  findingId: ReviewFindingId
  disposition: FindingDisposition
  rationale: string
  resolvedBy: string
  resolvedAt: string
  upstreamChangeRefs: string[]
}

export interface FindingVerification {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  findingId: ReviewFindingId
  outcome: VerificationOutcome
  rationale: string
  verifierId: string
  verifiedAt: string
  packetId: ReviewPacketId
  packetChecksum: string
}

export interface ReviewLedger {
  schemaVersion: typeof AOS4_REVIEW_SCHEMA_VERSION
  assignments: ReviewAssignment[]
  calibrations: ReviewCalibration[]
  results: ReviewerResult[]
  findings: ReviewFinding[]
  resolutions: FindingResolution[]
  verifications: FindingVerification[]
}

export interface ReviewCampaignExecution {
  schemaVersion: 1
  revision: string
  mode: 'full' | 'incremental'
  campaignAt: string
  reviewerConfigurationId: ReviewerConfigurationId
  reviewEngineVersion: typeof AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION
  reuseSource?: {
    directory: string
    manifestChecksum: string
  }
  pairSets: {
    total: number
    reused: string[]
    fresh: string[]
    reusedChecksum: string
    freshChecksum: string
  }
  assignments: {
    fresh: ReviewAssignmentId
    contributing: ReviewAssignmentId[]
  }
  workers: {
    requestedJobs: number
    peakChildProcessCount: number
  }
}

export interface CertificationExecutionProjection {
  mode: ReviewCampaignExecution['mode']
  totalPairs: number
  reusedPairs: number
  freshPairs: number
  checksum: string
}

export const reviewCalibrationIdentity = (calibration: ReviewCalibration): string =>
  calibration.evidence
    ? `assignment:${calibration.evidence.assignmentId}`
    : `configuration:${calibration.reviewerConfigurationId}:${calibration.rubricVersion}`

export const reviewCalibrationForAssignment = (
  calibrations: ReviewCalibration[],
  assignmentId: ReviewAssignmentId,
  reviewerConfiguration: ReviewerConfigurationId,
  rubricVersion: string,
  assignmentCount: number
): ReviewCalibration | undefined =>
  calibrations.find(
    calibration =>
      calibration.evidence?.assignmentId === assignmentId &&
      calibration.reviewerConfigurationId === reviewerConfiguration &&
      calibration.rubricVersion === rubricVersion
  ) ??
  (assignmentCount === 1
    ? calibrations.find(
        calibration =>
          !calibration.evidence &&
          calibration.reviewerConfigurationId === reviewerConfiguration &&
          calibration.rubricVersion === rubricVersion
      )
    : undefined)

export interface CertificationInput {
  name: string
  path: string
  checksum: string
}

export interface CertificationCoverageCount {
  reviewed: number
  expected: number
}

export interface CertificationCoverage {
  officialRecords: CertificationCoverageCount
  reconciliationDiscrepancies: CertificationCoverageCount
  profileOnlyFacts: CertificationCoverageCount
  sourceRecords: CertificationCoverageCount
  ignoredRecords: CertificationCoverageCount
  factionContextStrata: CertificationCoverageCount
  highRiskCohorts: CertificationCoverageCount
}

export interface CertificationManifest {
  schemaVersion: typeof AOS4_CERTIFICATION_SCHEMA_VERSION
  revision: string
  status: CertificationStatus
  certifiedAt: string
  inputs: CertificationInput[]
  protocol: {
    protocolVersion: string
    rubricVersion: string
    checksum: string
  }
  coverage: CertificationCoverage
  ledgerChecksum: string
  ledgerChecksumKind?: 'input-bindings/v1'
  inventoryChecksum: string
  sourceObservedAt: string
  execution?: CertificationExecutionProjection
}

type ReviewPacketDraft = Omit<ReviewPacket, 'schemaVersion' | 'id' | 'packetChecksum'> & {
  schemaVersion?: typeof AOS4_REVIEW_SCHEMA_VERSION
  id?: ReviewPacketId
  packetChecksum?: string
}

type ReviewAssignmentDraft = Omit<ReviewAssignment, 'schemaVersion' | 'id'> & {
  schemaVersion?: typeof AOS4_REVIEW_SCHEMA_VERSION
  id?: ReviewAssignmentId
}

type ReviewFindingDraft = Omit<ReviewFinding, 'schemaVersion' | 'id'> & {
  schemaVersion?: typeof AOS4_REVIEW_SCHEMA_VERSION
  id?: ReviewFindingId
}

const compare = (left: string, right: string): number => left.localeCompare(right)

const uniqueSorted = <T extends string>(values: Iterable<T>): T[] => Array.from(new Set(values)).sort(compare)

const normalizedEvidence = <T extends ReviewEvidenceReference>(evidence: T[]): T[] =>
  [...evidence].sort(
    (left, right) =>
      left.sourceRecordId.localeCompare(right.sourceRecordId) ||
      left.recordChecksum.localeCompare(right.recordChecksum) ||
      stableCompactJson(left.locator).localeCompare(stableCompactJson(right.locator))
  )

const normalizedDestinations = (destinations: ReviewGeneratedDestination[]): ReviewGeneratedDestination[] =>
  [...destinations].sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.field.localeCompare(right.field) ||
      (left.canonicalEntityId ?? '').localeCompare(right.canonicalEntityId ?? '')
  )

export const serializeReviewRecord = (value: unknown): string => stableJson(value)

export const checksumReviewRecord = (value: unknown): string =>
  createHash('sha256').update(stableCompactJson(value), 'utf8').digest('hex')

export const reviewerConfigurationId = (reviewer: ReviewerMetadata): ReviewerConfigurationId =>
  `reviewer-configuration:sha256:${checksumReviewRecord({
    kind: reviewer.kind,
    tool: reviewer.tool ?? null,
    model: reviewer.model ?? null,
    protocolVersion: reviewer.protocolVersion,
    promptVersion: reviewer.promptVersion,
  })}`

export const normalizedReviewPacket = (
  input: ReviewPacketDraft
): Omit<ReviewPacket, 'schemaVersion' | 'id' | 'packetChecksum'> => ({
  protocolVersion: input.protocolVersion,
  rubricVersion: input.rubricVersion,
  cohortIds: uniqueSorted(input.cohortIds),
  ...(input.canonicalEntityId ? { canonicalEntityId: input.canonicalEntityId } : {}),
  sourceEvidence: normalizedEvidence(input.sourceEvidence),
  generatedDestinations: normalizedDestinations(input.generatedDestinations),
  rulesContextIds: uniqueSorted(input.rulesContextIds),
  blind: input.blind,
})

export const expectedReviewPacketChecksum = (packet: ReviewPacketDraft): string =>
  checksumReviewRecord(normalizedReviewPacket(packet))

export const createReviewPacket = (input: ReviewPacketDraft): ReviewPacket => {
  const normalized = normalizedReviewPacket(input)
  const packetChecksum = checksumReviewRecord(normalized)
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    id: `review-packet:sha256:${packetChecksum}`,
    packetChecksum,
    ...normalized,
  }
}

const assignmentIdentity = (input: ReviewAssignmentDraft) => ({
  packetIds: uniqueSorted(input.packetIds),
  reviewer: input.reviewer,
  execution: input.execution,
  ...(input.approvedRecipient
    ? {
        approvedRecipient: {
          provider: input.approvedRecipient.provider,
          recipient: input.approvedRecipient.recipient,
          approvedBy: input.approvedRecipient.approvedBy,
          sourceHandlingAttestation: input.approvedRecipient.sourceHandlingAttestation,
        },
      }
    : {}),
})

export const createReviewAssignment = (input: ReviewAssignmentDraft): ReviewAssignment => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  id: `review-assignment:sha256:${checksumReviewRecord(assignmentIdentity(input))}`,
  packetIds: uniqueSorted(input.packetIds),
  reviewer: input.reviewer,
  execution: input.execution,
  assignedAt: input.assignedAt,
  ...(input.approvedRecipient ? { approvedRecipient: input.approvedRecipient } : {}),
})

const findingIdentity = (input: ReviewFindingDraft) => ({
  packetId: input.packetId,
  subject: input.subject,
  expectedValue: input.expectedValue,
  actualValue: input.actualValue,
  severity: input.severity,
  evidence: normalizedEvidence(input.evidence),
})

export const createReviewFinding = (input: ReviewFindingDraft): ReviewFinding => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  id: `review-finding:sha256:${checksumReviewRecord(findingIdentity(input))}`,
  packetId: input.packetId,
  subject: input.subject,
  ...(input.expectedValue !== undefined ? { expectedValue: input.expectedValue } : {}),
  ...(input.actualValue !== undefined ? { actualValue: input.actualValue } : {}),
  severity: input.severity,
  confidence: input.confidence,
  rationale: input.rationale,
  evidence: normalizedEvidence(input.evidence),
})
