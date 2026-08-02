import type { ReviewPacketIndexEntry, ReviewPacketSafeIndex } from './packets'
import {
  calibrationEvidenceIssues,
  certificationChronologyIssues,
  evaluateCertification,
  verifyCertificationManifest,
  type CertificationInventoryBinding,
} from './certification'
import { loadCertificationEvidence } from './certificationEvidence'
import {
  AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
  reviewerConfigurationId,
  reviewCalibrationForAssignment,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewerMetadata,
  type ReviewerResult,
  type CertificationManifest,
} from './records'

export interface PriorCertificationReviewEvidence {
  index: ReviewPacketSafeIndex
  assignments: ReviewAssignment[]
  calibrations: ReviewCalibration[]
  calibrationResults: ReviewerResult[]
  results: ReviewerResult[]
}

export interface ReusableReviewEvidence {
  reusedEntries: ReviewPacketIndexEntry[]
  freshEntries: ReviewPacketIndexEntry[]
  assignments: ReviewAssignment[]
  calibrations: ReviewCalibration[]
  calibrationResults: ReviewerResult[]
  results: ReviewerResult[]
}

export interface LoadedReusableCertificationEvidence extends PriorCertificationReviewEvidence {
  manifest: CertificationManifest
  directory: string
}

export const loadReusableCertificationEvidence = async (
  directory: string,
  repoRoot = process.cwd()
): Promise<LoadedReusableCertificationEvidence> => {
  const loaded = await loadCertificationEvidence(directory, repoRoot, true)
  const inventoryInput = loaded.currentInputs.find(value => value.name === 'source-inventory')
  if (!inventoryInput) throw new Error('Certification reuse source inventory binding is missing')
  const inventoryBinding: CertificationInventoryBinding = {
    checksum: inventoryInput.checksum,
    observedAt: loaded.inventory.observedAt,
    complete: loaded.inventory.complete,
  }
  const evaluation = evaluateCertification({
    index: loaded.index,
    ledger: loaded.ledger,
    inventory: loaded.inventory,
    acceptedArtifactChecksums: loaded.acceptedManifest.artifacts.map(artifact => artifact.checksum),
  })
  const issues = [
    ...evaluation.issues,
    ...calibrationEvidenceIssues(loaded.index, loaded.ledger, loaded.calibrationResults),
    ...certificationChronologyIssues(
      loaded.manifest.certifiedAt,
      loaded.ledger,
      loaded.calibrationResults,
      loaded.inventory.observedAt
    ),
    ...verifyCertificationManifest({
      manifest: loaded.manifest,
      evaluation,
      currentInputs: loaded.currentInputs,
      ledger: loaded.ledger,
      inventory: inventoryBinding,
      protocolVersion: loaded.protocol.protocolVersion,
      rubricVersion: loaded.rubric.rubricVersion,
    }),
  ]
  if (loaded.manifest.status !== 'pass' || !evaluation.ok || issues.length) {
    const first = issues[0]
    throw new Error(
      first
        ? `Certification reuse source is invalid: ${first.code} ${first.path}: ${first.message}`
        : `Certification reuse source is not passing: ${loaded.manifest.status}`
    )
  }
  return {
    manifest: loaded.manifest,
    directory,
    index: loaded.index,
    assignments: loaded.ledger.assignments,
    calibrations: loaded.ledger.calibrations,
    calibrationResults: loaded.calibrationResults,
    results: loaded.ledger.results,
  }
}

const resultEligible = (
  result: ReviewerResult,
  packetId: string,
  packetChecksum: string,
  reviewerConfiguration: string,
  blindDerivationRequired: boolean
): boolean =>
  result.packetId === packetId &&
  result.packetChecksum === packetChecksum &&
  result.reviewerConfigurationId === reviewerConfiguration &&
  result.outcome === 'pass' &&
  result.findings.length === 0 &&
  (!blindDerivationRequired || result.blindExpectedInterpretation !== undefined)

const exactPriorEntry = (
  current: ReviewPacketIndexEntry,
  prior: ReviewPacketIndexEntry | undefined
): prior is ReviewPacketIndexEntry =>
  prior !== undefined &&
  !prior.calibration &&
  prior.pairKey === current.pairKey &&
  prior.blindPacketId === current.blindPacketId &&
  prior.blindPacketChecksum === current.blindPacketChecksum &&
  prior.comparisonPacketId === current.comparisonPacketId &&
  prior.comparisonPacketChecksum === current.comparisonPacketChecksum

export const partitionReusableReviewEvidence = (
  currentIndex: ReviewPacketSafeIndex,
  prior: PriorCertificationReviewEvidence,
  currentReviewer: ReviewerMetadata
): ReusableReviewEvidence => {
  const liveEntries = currentIndex.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  const freshEntries: ReviewPacketIndexEntry[] = []
  const reusedEntries: ReviewPacketIndexEntry[] = []
  const reusedResults: ReviewerResult[] = []
  const retainedAssignmentIds = new Set<ReviewAssignment['id']>()
  const expectedConfiguration = reviewerConfigurationId(currentReviewer)
  const compatibleIndex =
    prior.index.protocolVersion === currentIndex.protocolVersion &&
    prior.index.rubricVersion === currentIndex.rubricVersion &&
    currentReviewer.model === AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION
  const priorEntries = new Map<string, ReviewPacketIndexEntry[]>()
  prior.index.entries
    .filter(entry => !entry.calibration)
    .forEach(entry => priorEntries.set(entry.pairKey, [...(priorEntries.get(entry.pairKey) ?? []), entry]))
  const resultsByPacket = new Map<string, ReviewerResult[]>()
  prior.results.forEach(result =>
    resultsByPacket.set(result.packetId, [...(resultsByPacket.get(result.packetId) ?? []), result])
  )

  liveEntries.forEach(entry => {
    const candidates = priorEntries.get(entry.pairKey) ?? []
    const priorEntry = candidates.length === 1 ? candidates[0] : undefined
    if (!compatibleIndex || !exactPriorEntry(entry, priorEntry)) {
      freshEntries.push(entry)
      return
    }
    const eligibleAssignments = prior.assignments.filter(assignment => {
      if (
        reviewerConfigurationId(assignment.reviewer) !== expectedConfiguration ||
        assignment.reviewer.model !== AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION ||
        assignment.reviewer.protocolVersion !== currentIndex.protocolVersion ||
        !assignment.packetIds.includes(entry.blindPacketId) ||
        !assignment.packetIds.includes(entry.comparisonPacketId)
      ) {
        return false
      }
      const blind = (resultsByPacket.get(entry.blindPacketId) ?? []).filter(
        result => result.assignmentId === assignment.id
      )
      const comparison = (resultsByPacket.get(entry.comparisonPacketId) ?? []).filter(
        result => result.assignmentId === assignment.id
      )
      if (
        blind.length !== 1 ||
        comparison.length !== 1 ||
        !resultEligible(
          blind[0],
          entry.blindPacketId,
          entry.blindPacketChecksum,
          expectedConfiguration,
          entry.blindDerivationRequired
        ) ||
        !resultEligible(
          comparison[0],
          entry.comparisonPacketId,
          entry.comparisonPacketChecksum,
          expectedConfiguration,
          false
        )
      ) {
        return false
      }
      const calibration = reviewCalibrationForAssignment(
        prior.calibrations,
        assignment.id,
        expectedConfiguration,
        currentIndex.rubricVersion,
        prior.assignments.length
      )
      return (
        calibration?.passed === true &&
        calibration.reviewerConfigurationId === expectedConfiguration &&
        calibration.rubricVersion === currentIndex.rubricVersion &&
        new Date(calibration.calibratedAt) <= new Date(blind[0].reviewedAt) &&
        new Date(blind[0].reviewedAt) < new Date(comparison[0].reviewedAt)
      )
    })
    if (eligibleAssignments.length !== 1) {
      freshEntries.push(entry)
      return
    }
    const assignment = eligibleAssignments[0]
    const blind = (resultsByPacket.get(entry.blindPacketId) ?? []).find(
      result => result.assignmentId === assignment.id
    )!
    const comparison = (resultsByPacket.get(entry.comparisonPacketId) ?? []).find(
      result => result.assignmentId === assignment.id
    )!
    retainedAssignmentIds.add(assignment.id)
    reusedEntries.push(entry)
    reusedResults.push(blind, comparison)
  })

  const retainedAssignments = prior.assignments.filter(assignment => retainedAssignmentIds.has(assignment.id))
  const retainedCalibrations = retainedAssignments.flatMap(assignment => {
    const calibration = reviewCalibrationForAssignment(
      prior.calibrations,
      assignment.id,
      reviewerConfigurationId(assignment.reviewer),
      currentIndex.rubricVersion,
      prior.assignments.length
    )
    return calibration ? [calibration] : []
  })
  return {
    reusedEntries,
    freshEntries,
    assignments: retainedAssignments,
    calibrations: retainedCalibrations,
    calibrationResults: prior.calibrationResults.filter(result =>
      retainedAssignmentIds.has(result.assignmentId)
    ),
    results: reusedResults.sort(
      (left, right) =>
        left.assignmentId.localeCompare(right.assignmentId) || left.packetId.localeCompare(right.packetId)
    ),
  }
}
