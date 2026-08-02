import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ReviewPacketIndexEntry, ReviewPacketSafeIndex } from './packets'
import {
  calibrationControlSetChecksum,
  calibrationEvidenceIssues,
  certificationChronologyIssues,
  checksumCertificationText,
  evaluateCertification,
  verifyCertificationManifest,
  type CertificationEvaluationSummary,
  type CertificationInventoryBinding,
} from './certification'
import { loadCertificationEvidence } from './certificationEvidence'
import { parseCertificationManifest } from './findings'
import { assertCreateOnlyDirectoryComplete } from './reviewWorkspace'
import {
  AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
  checksumReviewRecord,
  reviewerConfigurationId,
  reviewCalibrationForAssignment,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewerMetadata,
  type ReviewerResult,
  type ReviewLedger,
  type CertificationManifest,
  type CertificationExecutionProjection,
  type ReviewCampaignExecution,
} from './records'

export interface PriorCertificationReviewEvidence {
  index: ReviewPacketSafeIndex
  assignments: ReviewAssignment[]
  calibrations: ReviewCalibration[]
  calibrationResults: ReviewerResult[]
  results: ReviewerResult[]
  reuseIndex?: CertificationReuseIndex
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
  overlayDepth: number
}

export interface CertificationReuseIndexEntry {
  pairKey: string
  blindPacketId: ReviewPacketIndexEntry['blindPacketId']
  blindPacketChecksum: string
  comparisonPacketId: ReviewPacketIndexEntry['comparisonPacketId']
  comparisonPacketChecksum: string
  assignmentId: ReviewAssignment['id']
  blindReviewedAt: string
  comparisonReviewedAt: string
  blindInterpretationChecksum?: string
}

export interface CertificationReuseIndex {
  schemaVersion: 1
  kind: 'certification-reuse-index'
  revision: string
  protocolVersion: string
  rubricVersion: string
  reviewEngineVersion: string
  reviewIndexChecksum: string
  assignments: ReviewAssignment[]
  calibrations: ReviewCalibration[]
  calibrationResults: ReviewerResult[]
  summary: CertificationEvaluationSummary
  entries: CertificationReuseIndexEntry[]
  reuseSource?: { directory: string; manifestChecksum: string }
  reusedPairKeys?: string[]
}

const MAX_CERTIFICATION_REUSE_DEPTH = 256

export const reviewerResultsFromReuseIndex = (
  index: CertificationReuseIndex,
  pairKeys: ReadonlySet<string>
): ReviewerResult[] => {
  const configurationByAssignment = new Map(
    index.assignments.map(assignment => [assignment.id, reviewerConfigurationId(assignment.reviewer)])
  )
  return index.entries
    .filter(entry => pairKeys.has(entry.pairKey))
    .flatMap(entry => {
      const reviewerConfigurationId = configurationByAssignment.get(entry.assignmentId)
      if (!reviewerConfigurationId) {
        throw new Error(`Certification reuse entry has no assignment: ${entry.pairKey}`)
      }
      const common = {
        schemaVersion: 1 as const,
        assignmentId: entry.assignmentId,
        reviewerConfigurationId,
        outcome: 'pass' as const,
        rationale: 'Passing result retained from checksum-bound certification evidence.',
        findings: [],
      }
      return [
        {
          ...common,
          packetId: entry.blindPacketId,
          packetChecksum: entry.blindPacketChecksum,
          reviewedAt: entry.blindReviewedAt,
          ...(entry.blindInterpretationChecksum
            ? {
                blindExpectedInterpretation: {
                  interpretationChecksum: entry.blindInterpretationChecksum,
                  shape: 'retained-certification-evidence',
                },
              }
            : {}),
        },
        {
          ...common,
          packetId: entry.comparisonPacketId,
          packetChecksum: entry.comparisonPacketChecksum,
          reviewedAt: entry.comparisonReviewedAt,
        },
      ]
    })
}

const sortedUnique = (values: Iterable<string>): string[] => Array.from(new Set(values)).sort()

export const reviewPairSetChecksum = (pairKeys: Iterable<string>): string =>
  checksumReviewRecord(sortedUnique(pairKeys))

export const certificationExecutionProjection = (
  execution: ReviewCampaignExecution
): CertificationExecutionProjection => ({
  mode: execution.mode,
  totalPairs: execution.pairSets.total,
  reusedPairs: execution.pairSets.reused.length,
  freshPairs: execution.pairSets.fresh.length,
  checksum: checksumReviewRecord(execution),
})

export const createReviewCampaignExecution = (input: {
  revision: string
  campaignAt: string
  reviewer: ReviewerMetadata
  reusedPairKeys: Iterable<string>
  freshPairKeys: Iterable<string>
  freshAssignmentId: ReviewAssignment['id']
  contributingAssignmentIds: Iterable<ReviewAssignment['id']>
  reuseSource?: { directory: string; manifestChecksum: string }
  requestedJobs?: number
  peakChildProcessCount?: number
}): ReviewCampaignExecution => {
  const reused = sortedUnique(input.reusedPairKeys)
  const fresh = sortedUnique(input.freshPairKeys)
  return {
    schemaVersion: 1,
    revision: input.revision,
    mode: input.reuseSource ? 'incremental' : 'full',
    campaignAt: input.campaignAt,
    reviewerConfigurationId: reviewerConfigurationId(input.reviewer),
    reviewEngineVersion: AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
    ...(input.reuseSource ? { reuseSource: input.reuseSource } : {}),
    pairSets: {
      total: reused.length + fresh.length,
      reused,
      fresh,
      reusedChecksum: reviewPairSetChecksum(reused),
      freshChecksum: reviewPairSetChecksum(fresh),
    },
    assignments: {
      fresh: input.freshAssignmentId,
      contributing: sortedUnique(input.contributingAssignmentIds) as ReviewAssignment['id'][],
    },
    workers: {
      requestedJobs: input.requestedJobs ?? 1,
      peakChildProcessCount: input.peakChildProcessCount ?? 0,
    },
  }
}

export const reviewCampaignExecutionIssues = (
  execution: ReviewCampaignExecution,
  index: ReviewPacketSafeIndex,
  assignments: ReviewAssignment[],
  results: ReviewerResult[]
): string[] => {
  const issues: string[] = []
  const liveEntries = index.entries.filter(entry => entry.countsTowardCoverage && !entry.calibration)
  const livePairKeys = sortedUnique(liveEntries.map(entry => entry.pairKey))
  const reused = sortedUnique(execution.pairSets?.reused ?? [])
  const fresh = sortedUnique(execution.pairSets?.fresh ?? [])
  const freshSet = new Set(fresh)
  const all = sortedUnique([...reused, ...fresh])
  const assignmentIds = sortedUnique(assignments.map(assignment => assignment.id))
  const freshAssignment = assignments.find(assignment => assignment.id === execution.assignments?.fresh)
  if (
    execution.schemaVersion !== 1 ||
    execution.revision !== index.revision ||
    execution.reviewEngineVersion !== AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION ||
    Number.isNaN(new Date(execution.campaignAt).valueOf()) ||
    freshAssignment?.reviewer.model !== AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION ||
    (freshAssignment &&
      reviewerConfigurationId(freshAssignment.reviewer) !== execution.reviewerConfigurationId) ||
    !Number.isSafeInteger(execution.workers?.requestedJobs) ||
    execution.workers.requestedJobs < 1 ||
    !Number.isSafeInteger(execution.workers?.peakChildProcessCount) ||
    execution.workers.peakChildProcessCount < 0 ||
    execution.workers.peakChildProcessCount > execution.workers.requestedJobs
  ) {
    issues.push('execution metadata does not match the current review engine and revision')
    return issues
  }
  if (
    execution.pairSets.total !== livePairKeys.length ||
    execution.pairSets.reused.join('\n') !== reused.join('\n') ||
    execution.pairSets.fresh.join('\n') !== fresh.join('\n') ||
    reused.length + fresh.length !== livePairKeys.length ||
    reused.some(pairKey => freshSet.has(pairKey)) ||
    all.join('\n') !== livePairKeys.join('\n') ||
    execution.pairSets.reusedChecksum !== reviewPairSetChecksum(reused) ||
    execution.pairSets.freshChecksum !== reviewPairSetChecksum(fresh)
  ) {
    issues.push('execution reused and fresh pair sets do not partition the current live population')
  }
  if (
    (execution.mode === 'incremental') !== Boolean(execution.reuseSource) ||
    (execution.mode === 'full' && reused.length > 0) ||
    (execution.mode === 'incremental' &&
      (!execution.reuseSource?.directory ||
        execution.reuseSource.directory.includes('..') ||
        execution.reuseSource.directory.startsWith('/') ||
        /^[A-Za-z]:/.test(execution.reuseSource.directory) ||
        !/^[0-9a-f]{64}$/.test(execution.reuseSource.manifestChecksum)))
  ) {
    issues.push('execution mode and reuse source are inconsistent')
  }
  if (
    assignmentIds.join('\n') !== sortedUnique(execution.assignments.contributing).join('\n') ||
    execution.assignments.contributing.join('\n') !== assignmentIds.join('\n') ||
    !assignmentIds.includes(execution.assignments.fresh)
  ) {
    issues.push('execution assignment provenance does not match the review ledger')
  }
  const assignmentById = new Map(assignments.map(assignment => [assignment.id, assignment]))
  const resultByPacketId = new Map<string, ReviewerResult[]>()
  results.forEach(result =>
    resultByPacketId.set(result.packetId, [...(resultByPacketId.get(result.packetId) ?? []), result])
  )
  liveEntries.forEach(entry => {
    const expectedAssignment = freshSet.has(entry.pairKey) ? execution.assignments.fresh : undefined
    const pairResults = [entry.blindPacketId, entry.comparisonPacketId].flatMap(
      packetId => resultByPacketId.get(packetId) ?? []
    )
    if (
      pairResults.length !== 2 ||
      new Set(pairResults.map(result => result.assignmentId)).size !== 1 ||
      (expectedAssignment !== undefined && pairResults[0]?.assignmentId !== expectedAssignment) ||
      !assignmentById.has(pairResults[0]?.assignmentId)
    ) {
      issues.push(`execution result assignment is invalid for ${entry.pairKey}`)
    }
  })
  return issues.sort()
}

const repositoryInputPath = (repoRoot: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Certification reuse input path must be repository-relative: ${relativePath}`)
  }
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification reuse input path escapes the repository: ${relativePath}`)
  }
  return resolved
}

const compactReuseIndexIssues = (
  value: CertificationReuseIndex,
  manifest: CertificationManifest
): string[] => {
  const issues: string[] = []
  const assignmentById = new Map(value.assignments.map(assignment => [assignment.id, assignment]))
  const assignedPackets = new Map(
    value.assignments.map(assignment => [assignment.id, new Set(assignment.packetIds)])
  )
  const pairKeys = new Set<string>()
  const packetIds = new Set<string>()
  if (
    value.schemaVersion !== 1 ||
    value.kind !== 'certification-reuse-index' ||
    value.revision !== manifest.revision ||
    value.protocolVersion !== manifest.protocol.protocolVersion ||
    value.rubricVersion !== manifest.protocol.rubricVersion ||
    value.reviewEngineVersion !== AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION ||
    !/^[0-9a-f]{64}$/.test(value.reviewIndexChecksum) ||
    !Array.isArray(value.assignments) ||
    !Array.isArray(value.calibrations) ||
    !Array.isArray(value.calibrationResults) ||
    value.summary?.status !== 'pass' ||
    value.summary.revision !== manifest.revision ||
    !Array.isArray(value.entries)
  ) {
    return ['reuse index metadata does not match its passing certification']
  }
  value.entries.forEach(entry => {
    const assignment = assignmentById.get(entry.assignmentId)
    const packets = assignedPackets.get(entry.assignmentId)
    if (
      pairKeys.has(entry.pairKey) ||
      packetIds.has(entry.blindPacketId) ||
      packetIds.has(entry.comparisonPacketId) ||
      !assignment ||
      !packets?.has(entry.blindPacketId) ||
      !packets.has(entry.comparisonPacketId) ||
      assignment.reviewer.model !== AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION ||
      assignment.reviewer.protocolVersion !== value.protocolVersion ||
      !entry.pairKey.startsWith('review-pair:sha256:') ||
      !entry.blindPacketId.startsWith('review-packet:sha256:') ||
      !entry.comparisonPacketId.startsWith('review-packet:sha256:') ||
      !/^[0-9a-f]{64}$/.test(entry.blindPacketChecksum) ||
      !/^[0-9a-f]{64}$/.test(entry.comparisonPacketChecksum) ||
      Number.isNaN(new Date(entry.blindReviewedAt).valueOf()) ||
      Number.isNaN(new Date(entry.comparisonReviewedAt).valueOf()) ||
      entry.blindReviewedAt >= entry.comparisonReviewedAt
    ) {
      issues.push(`reuse index entry is invalid: ${entry.pairKey}`)
    }
    pairKeys.add(entry.pairKey)
    packetIds.add(entry.blindPacketId)
    packetIds.add(entry.comparisonPacketId)
  })
  return issues
}

const loadCompactReusableCertificationEvidence = async (
  directory: string,
  repoRoot: string,
  manifest: CertificationManifest,
  binding: CertificationManifest['inputs'][number],
  ancestors: ReadonlySet<string>
): Promise<LoadedReusableCertificationEvidence> => {
  const content = await readFile(repositoryInputPath(repoRoot, binding.path), 'utf8')
  if (checksumCertificationText(content) !== binding.checksum) {
    throw new Error('Certification reuse index checksum mismatch')
  }
  const reuseIndex = JSON.parse(content) as CertificationReuseIndex
  const issues = compactReuseIndexIssues(reuseIndex, manifest)
  if (manifest.status !== 'pass' || issues.length) {
    throw new Error(
      issues[0]
        ? `Certification reuse source is invalid: ${issues[0]}`
        : `Certification reuse source is not passing: ${manifest.status}`
    )
  }
  let resolvedReuseIndex = reuseIndex
  let overlayDepth = 0
  if (reuseIndex.reuseSource || reuseIndex.reusedPairKeys) {
    if (!reuseIndex.reuseSource || !Array.isArray(reuseIndex.reusedPairKeys)) {
      throw new Error('Certification reuse index overlay is incomplete')
    }
    const sourceDirectory = repositoryInputPath(repoRoot, reuseIndex.reuseSource.directory)
    if (sourceDirectory === path.resolve(directory)) {
      throw new Error('Certification reuse index cannot reference itself')
    }
    const parent = await loadReusableCertificationEvidenceInternal(sourceDirectory, repoRoot, ancestors)
    if (
      !parent.reuseIndex ||
      checksumReviewRecord(parent.manifest) !== reuseIndex.reuseSource.manifestChecksum
    ) {
      throw new Error('Certification reuse index overlay source has changed')
    }
    const reusedPairKeys = new Set(reuseIndex.reusedPairKeys)
    overlayDepth = parent.overlayDepth + 1
    const reusedEntries = parent.reuseIndex.entries.filter(entry => reusedPairKeys.has(entry.pairKey))
    if (reusedEntries.length !== reusedPairKeys.size) {
      throw new Error('Certification reuse index overlay source population is incomplete')
    }
    const assignmentIds = new Set([
      ...reusedEntries.map(entry => entry.assignmentId),
      ...reuseIndex.entries.map(entry => entry.assignmentId),
    ])
    const assignments = [...parent.reuseIndex.assignments, ...reuseIndex.assignments]
      .filter(assignment => assignmentIds.has(assignment.id))
      .filter((assignment, index, values) => values.findIndex(value => value.id === assignment.id) === index)
    const calibrationAssignmentIds = new Set(assignments.map(assignment => assignment.id))
    resolvedReuseIndex = {
      ...reuseIndex,
      assignments,
      calibrations: [...parent.reuseIndex.calibrations, ...reuseIndex.calibrations].filter(
        (calibration, index, values) =>
          Boolean(
            calibration.evidence &&
              calibrationAssignmentIds.has(calibration.evidence.assignmentId) &&
              values.findIndex(
                value => value.evidence?.assignmentId === calibration.evidence?.assignmentId
              ) === index
          )
      ),
      calibrationResults: [...parent.reuseIndex.calibrationResults, ...reuseIndex.calibrationResults].filter(
        (result, index, values) =>
          calibrationAssignmentIds.has(result.assignmentId) &&
          values.findIndex(
            value => value.assignmentId === result.assignmentId && value.packetId === result.packetId
          ) === index
      ),
      entries: [...reusedEntries, ...reuseIndex.entries].sort((left, right) =>
        left.pairKey.localeCompare(right.pairKey)
      ),
      reuseSource: undefined,
      reusedPairKeys: undefined,
    }
  }
  return {
    manifest,
    directory,
    index: {
      schemaVersion: 1,
      revision: resolvedReuseIndex.revision,
      protocolVersion: resolvedReuseIndex.protocolVersion,
      rubricVersion: resolvedReuseIndex.rubricVersion,
      entries: [],
      coverage: {
        officialRecords: { expected: 0, assigned: 0 },
        reconciliationDiscrepancies: { expected: 0, assigned: 0 },
        profileOnlyFacts: { expected: 0, assigned: 0 },
        sourceRecords: { expected: 0, assigned: 0 },
        ignoredRecords: { expected: 0, assigned: 0 },
        factionContextStrata: [],
        highRiskCohorts: [],
      },
    },
    assignments: resolvedReuseIndex.assignments,
    calibrations: resolvedReuseIndex.calibrations,
    calibrationResults: resolvedReuseIndex.calibrationResults,
    results: [],
    reuseIndex: resolvedReuseIndex,
    overlayDepth,
  }
}

const loadReusableCertificationEvidenceInternal = async (
  directory: string,
  repoRoot: string,
  ancestors: ReadonlySet<string>
): Promise<LoadedReusableCertificationEvidence> => {
  const resolvedDirectory = path.resolve(directory)
  if (ancestors.has(resolvedDirectory)) {
    throw new Error(`Certification reuse index overlay cycle detected: ${resolvedDirectory}`)
  }
  if (ancestors.size >= MAX_CERTIFICATION_REUSE_DEPTH) {
    throw new Error(`Certification reuse index overlay exceeds ${MAX_CERTIFICATION_REUSE_DEPTH} levels`)
  }
  const nextAncestors = new Set(ancestors).add(resolvedDirectory)
  await assertCreateOnlyDirectoryComplete(resolvedDirectory)
  const manifest = parseCertificationManifest(
    JSON.parse(await readFile(path.join(resolvedDirectory, 'manifest.json'), 'utf8'))
  )
  const reuseIndexBinding = manifest.inputs.find(input => input.name === 'review-reuse-index')
  if (reuseIndexBinding) {
    return loadCompactReusableCertificationEvidence(
      resolvedDirectory,
      repoRoot,
      manifest,
      reuseIndexBinding,
      nextAncestors
    )
  }
  const loaded = await loadCertificationEvidence(resolvedDirectory, repoRoot, true)
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
    ...(loaded.execution
      ? reviewCampaignExecutionIssues(
          loaded.execution,
          loaded.index,
          loaded.ledger.assignments,
          loaded.ledger.results
        ).map(message => ({
          code: 'invalid-review-index' as const,
          state: 'blocked' as const,
          path: 'review-execution',
          subject: 'review-execution',
          message,
        }))
      : []),
  ]
  if (
    loaded.execution &&
    checksumReviewRecord(certificationExecutionProjection(loaded.execution)) !==
      checksumReviewRecord(loaded.manifest.execution)
  ) {
    throw new Error('Certification reuse source execution projection does not match its evidence')
  }
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
    directory: resolvedDirectory,
    index: loaded.index,
    assignments: loaded.ledger.assignments,
    calibrations: loaded.ledger.calibrations,
    calibrationResults: loaded.calibrationResults,
    results: loaded.ledger.results,
    overlayDepth: 0,
  }
}

export const loadReusableCertificationEvidence = async (
  directory: string,
  repoRoot = process.cwd()
): Promise<LoadedReusableCertificationEvidence> =>
  loadReusableCertificationEvidenceInternal(directory, path.resolve(repoRoot), new Set())

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

const exactReuseIndexEntry = (
  current: ReviewPacketIndexEntry,
  prior: CertificationReuseIndexEntry | undefined
): prior is CertificationReuseIndexEntry =>
  prior !== undefined &&
  prior.pairKey === current.pairKey &&
  prior.blindPacketId === current.blindPacketId &&
  prior.blindPacketChecksum === current.blindPacketChecksum &&
  prior.comparisonPacketId === current.comparisonPacketId &&
  prior.comparisonPacketChecksum === current.comparisonPacketChecksum &&
  (!current.blindDerivationRequired || prior.blindInterpretationChecksum !== undefined)

export const createCertificationReuseIndex = (
  index: ReviewPacketSafeIndex,
  ledger: ReviewLedger,
  calibrationResults: ReviewerResult[],
  summary: CertificationEvaluationSummary,
  reviewIndexChecksum = checksumReviewRecord(index)
): CertificationReuseIndex => {
  const resultByPacketId = new Map<string, ReviewerResult[]>()
  ledger.results.forEach(result =>
    resultByPacketId.set(result.packetId, [...(resultByPacketId.get(result.packetId) ?? []), result])
  )
  const entries: CertificationReuseIndexEntry[] = []
  const retainedAssignmentIds = new Set<ReviewAssignment['id']>()
  index.entries
    .filter(entry => entry.countsTowardCoverage && !entry.calibration)
    .forEach(entry => {
      const candidates = ledger.assignments.flatMap(assignment => {
        const blind = (resultByPacketId.get(entry.blindPacketId) ?? []).filter(
          result => result.assignmentId === assignment.id
        )
        const comparison = (resultByPacketId.get(entry.comparisonPacketId) ?? []).filter(
          result => result.assignmentId === assignment.id
        )
        const configuration = reviewerConfigurationId(assignment.reviewer)
        const calibration = reviewCalibrationForAssignment(
          ledger.calibrations,
          assignment.id,
          configuration,
          index.rubricVersion,
          ledger.assignments.length
        )
        return blind.length === 1 &&
          comparison.length === 1 &&
          resultEligible(
            blind[0],
            entry.blindPacketId,
            entry.blindPacketChecksum,
            configuration,
            entry.blindDerivationRequired
          ) &&
          resultEligible(
            comparison[0],
            entry.comparisonPacketId,
            entry.comparisonPacketChecksum,
            configuration,
            false
          ) &&
          calibration?.passed === true &&
          calibration.calibratedAt <= blind[0].reviewedAt &&
          blind[0].reviewedAt < comparison[0].reviewedAt
          ? [{ assignment, blind: blind[0], comparison: comparison[0] }]
          : []
      })
      if (candidates.length !== 1) return
      const candidate = candidates[0]
      retainedAssignmentIds.add(candidate.assignment.id)
      entries.push({
        pairKey: entry.pairKey,
        blindPacketId: entry.blindPacketId,
        blindPacketChecksum: entry.blindPacketChecksum,
        comparisonPacketId: entry.comparisonPacketId,
        comparisonPacketChecksum: entry.comparisonPacketChecksum,
        assignmentId: candidate.assignment.id,
        blindReviewedAt: candidate.blind.reviewedAt,
        comparisonReviewedAt: candidate.comparison.reviewedAt,
        ...(entry.blindDerivationRequired
          ? {
              blindInterpretationChecksum: checksumReviewRecord(candidate.blind.blindExpectedInterpretation),
            }
          : {}),
      })
    })
  const assignments = ledger.assignments.filter(assignment => retainedAssignmentIds.has(assignment.id))
  return {
    schemaVersion: 1,
    kind: 'certification-reuse-index',
    revision: index.revision,
    protocolVersion: index.protocolVersion,
    rubricVersion: index.rubricVersion,
    reviewEngineVersion: AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
    reviewIndexChecksum,
    assignments,
    calibrations: ledger.calibrations.filter(calibration =>
      calibration.evidence ? retainedAssignmentIds.has(calibration.evidence.assignmentId) : false
    ),
    calibrationResults: calibrationResults.filter(result => retainedAssignmentIds.has(result.assignmentId)),
    summary,
    entries,
  }
}

export const createIncrementalCertificationReuseIndex = (
  index: ReviewPacketSafeIndex,
  ledger: ReviewLedger,
  calibrationResults: ReviewerResult[],
  summary: CertificationEvaluationSummary,
  reviewIndexChecksum: string,
  execution: ReviewCampaignExecution
): CertificationReuseIndex => {
  if (!execution.reuseSource) {
    throw new Error('Incremental certification reuse index requires a source certification')
  }
  const freshPairKeys = new Set(execution.pairSets.fresh)
  const freshEntries = index.entries.filter(entry => freshPairKeys.has(entry.pairKey))
  const freshPacketIds = new Set(
    freshEntries.flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId])
  )
  const freshResults = ledger.results.filter(result => freshPacketIds.has(result.packetId))
  const freshAssignmentIds = new Set(freshResults.map(result => result.assignmentId))
  const freshAssignments = ledger.assignments.filter(assignment => freshAssignmentIds.has(assignment.id))
  const freshCalibrations = ledger.calibrations.filter(calibration =>
    calibration.evidence ? freshAssignmentIds.has(calibration.evidence.assignmentId) : false
  )
  const local = createCertificationReuseIndex(
    { ...index, entries: freshEntries },
    {
      schemaVersion: ledger.schemaVersion,
      assignments: freshAssignments,
      calibrations: freshCalibrations,
      results: freshResults,
      findings: [],
      resolutions: [],
      verifications: [],
    },
    calibrationResults.filter(result => freshAssignmentIds.has(result.assignmentId)),
    summary,
    reviewIndexChecksum
  )
  if (local.entries.length !== freshEntries.length) {
    throw new Error('Incremental certification reuse index is missing fresh passing verdicts')
  }
  return {
    ...local,
    reuseSource: execution.reuseSource,
    reusedPairKeys: execution.pairSets.reused,
  }
}

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
    calibrationControlSetChecksum(prior.index) === calibrationControlSetChecksum(currentIndex) &&
    currentReviewer.model === AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION
  if (prior.reuseIndex) {
    const indexedEntries = new Map(prior.reuseIndex.entries.map(entry => [entry.pairKey, entry]))
    const assignmentById = new Map(prior.assignments.map(assignment => [assignment.id, assignment]))
    const retainedAssignmentIds = new Set<ReviewAssignment['id']>()
    liveEntries.forEach(entry => {
      const priorEntry = indexedEntries.get(entry.pairKey)
      const assignment = priorEntry ? assignmentById.get(priorEntry.assignmentId) : undefined
      if (
        !compatibleIndex ||
        !exactReuseIndexEntry(entry, priorEntry) ||
        !assignment ||
        reviewerConfigurationId(assignment.reviewer) !== expectedConfiguration
      ) {
        freshEntries.push(entry)
        return
      }
      retainedAssignmentIds.add(assignment.id)
      reusedEntries.push(entry)
    })
    const assignments = prior.assignments.filter(assignment => retainedAssignmentIds.has(assignment.id))
    return {
      reusedEntries,
      freshEntries,
      assignments,
      calibrations: prior.calibrations.filter(calibration =>
        calibration.evidence ? retainedAssignmentIds.has(calibration.evidence.assignmentId) : false
      ),
      calibrationResults: prior.calibrationResults.filter(result =>
        retainedAssignmentIds.has(result.assignmentId)
      ),
      results: [],
    }
  }
  const priorEntries = new Map<string, ReviewPacketIndexEntry[]>()
  prior.index.entries
    .filter(entry => !entry.calibration)
    .forEach(entry => priorEntries.set(entry.pairKey, [...(priorEntries.get(entry.pairKey) ?? []), entry]))
  const resultsByPacket = new Map<string, ReviewerResult[]>()
  prior.results.forEach(result =>
    resultsByPacket.set(result.packetId, [...(resultsByPacket.get(result.packetId) ?? []), result])
  )
  const assignedPacketIds = new Map(
    prior.assignments.map(assignment => [assignment.id, new Set(assignment.packetIds)])
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
        !assignedPacketIds.get(assignment.id)?.has(entry.blindPacketId) ||
        !assignedPacketIds.get(assignment.id)?.has(entry.comparisonPacketId)
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
