import { createHash } from 'node:crypto'
import { access, mkdir, mkdtemp, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  REQUIRED_CERTIFICATION_INPUTS,
  appendFindingResolution,
  appendFindingVerification,
  boundReviewPopulationIssues,
  checksumCertificationText,
  checksumReviewRecord,
  createHumanSampleManifest,
  createCertificationManifest,
  createReviewAssignment,
  createReviewFinding,
  createReviewPacket,
  emptyReviewLedger,
  evaluateCertification,
  hasOnlyHumanPendingCertificationIssues,
  importReviewerResultsAtomic,
  mergeReviewLedgers,
  parseCertificationCommandArguments,
  parseCertificationPreparationArguments,
  parseHumanReviewArguments,
  reviewerConfigurationId,
  runCertificationCheck,
  serializeReviewRecord,
  sourceSafeReviewLedger,
  verifyCertificationManifest,
  type CertificationEvaluationInput,
  type CertificationInput,
  type CertificationIssue,
  type FindingResolution,
  type ReviewFinding,
  type ReviewAssignment,
  type ReviewLedger,
  type ReviewPacket,
  type ReviewPacketId,
  type ReviewPacketSafeIndex,
  type ReviewerMetadata,
  type ReviewerResult,
} from '../../aos4/review'
import { artifactId, type CanonicalId, type RulesContextId, type SourceRecordId } from '../../aos4/domain'

const digest = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex')
const FACTION_ID = 'faction:151c54f6-a281-5cea-b5ff-3dacd3afec43' as CanonicalId<'faction'>
const CONTEXT_ID = 'rules-context:90000000-0000-4000-8000-000000000001' as RulesContextId
const SOURCE_RECORD_ID = `source-record:wahapedia:${digest('source')}` as SourceRecordId
const EVIDENCE_CHECKSUM = digest('evidence')
const ACCEPTED_ARTIFACT_CHECKSUM = digest('accepted-artifact')
const BLIND_REVIEWED_AT = '2026-07-28T12:00:00.000Z'
const REVIEWED_AT = '2026-07-28T12:01:00.000Z'
const CALIBRATED_AT = '2026-07-28T11:00:00.000Z'
const SAMPLING_METADATA_CHECKSUM = checksumReviewRecord({
  key: 'source-record:fixture',
  category: 'source-record',
  cohortIds: ['high-risk:reaction'],
  authorityClasses: ['secondary'],
  factionIds: [FACTION_ID],
  rulesContextIds: [CONTEXT_ID],
  projectsToRuntime: true,
})
const SAMPLING_METADATA_COHORT = `sampling-metadata:sha256:${SAMPLING_METADATA_CHECKSUM}`

const agentReviewer: ReviewerMetadata = {
  id: 'adversarial-agent',
  kind: 'agent',
  tool: 'provider-neutral-runner',
  model: 'fixture-model',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: 'aos4-review-prompt/v1',
}

const humanReviewer: ReviewerMetadata = {
  id: 'human-reviewer',
  kind: 'human',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: 'aos4-review-prompt/v1',
}

const packet = (blind: boolean): ReviewPacket =>
  createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['high-risk:reaction', SAMPLING_METADATA_COHORT],
    sourceEvidence: [
      {
        sourceRecordId: SOURCE_RECORD_ID,
        recordChecksum: EVIDENCE_CHECKSUM,
        locator: { kind: 'row', row: 1 },
        authority: 'secondary',
        structuredValue: { value: 'fixture interpretation' },
      },
    ],
    generatedDestinations: blind
      ? []
      : [
          {
            path: 'src/aos4/generated/corpus/runtime.json',
            field: 'effect',
            value: 'fixture interpretation',
          },
        ],
    rulesContextIds: [CONTEXT_ID],
    blind,
  })

const BLIND_PACKET = packet(true)
const COMPARISON_PACKET = packet(false)
const BLIND_CHECKSUM = BLIND_PACKET.packetChecksum
const COMPARISON_CHECKSUM = COMPARISON_PACKET.packetChecksum

const reviewIndex = (): ReviewPacketSafeIndex => ({
  schemaVersion: 1,
  revision: 'aos4-fixture',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  entries: [
    {
      pairKey: `review-pair:sha256:${digest('pair')}`,
      candidateKey: 'source-record:fixture',
      category: 'source-record',
      blindPacketId: BLIND_PACKET.id,
      blindPacketChecksum: BLIND_CHECKSUM,
      comparisonPacketId: COMPARISON_PACKET.id,
      comparisonPacketChecksum: COMPARISON_CHECKSUM,
      cohortIds: ['high-risk:reaction', SAMPLING_METADATA_COHORT],
      samplingMetadataChecksum: SAMPLING_METADATA_CHECKSUM,
      authorityClasses: ['secondary'],
      factionIds: [FACTION_ID],
      rulesContextIds: [CONTEXT_ID],
      blindDerivationRequired: true,
      assignmentStatus: 'unassigned',
      calibration: false,
      countsTowardCoverage: true,
      humanSample: true,
      projectsToRuntime: true,
    },
  ],
  coverage: {
    officialRecords: { assigned: 0, expected: 0 },
    reconciliationDiscrepancies: { assigned: 0, expected: 0 },
    profileOnlyFacts: { assigned: 0, expected: 0 },
    sourceRecords: { assigned: 1, expected: 1 },
    ignoredRecords: { assigned: 0, expected: 0 },
    factionContextStrata: [`${FACTION_ID}|${CONTEXT_ID}`],
    highRiskCohorts: ['high-risk:reaction'],
    humanSample: {
      selectionPolicy: 'aos4-human-sample/v2',
      categories: ['source-record'],
      authorityClasses: ['secondary'],
      sourceKindCohorts: [],
      officialCohorts: [],
      factionContextStrata: [`${FACTION_ID}|${CONTEXT_ID}`],
      highRiskCohorts: ['high-risk:reaction'],
      factionContextSelections: [
        {
          stratum: `${FACTION_ID}|${CONTEXT_ID}`,
          selectedCandidateKey: 'source-record:fixture',
          factionScope: 1,
          rulesContextScope: 1,
        },
      ],
      factionContextFallbacks: [],
    },
  },
})

const result = (
  assignmentId: ReviewerResult['assignmentId'],
  reviewer: ReviewerMetadata,
  id: ReviewPacketId,
  packetChecksum: string,
  findings: ReviewFinding[] = []
): ReviewerResult => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignmentId,
  packetId: id,
  packetChecksum,
  reviewerConfigurationId: reviewerConfigurationId(reviewer),
  reviewedAt: id === BLIND_PACKET.id ? BLIND_REVIEWED_AT : REVIEWED_AT,
  outcome: findings.length ? 'finding' : 'pass',
  rationale: findings.length
    ? 'The structured value differs from the evidence.'
    : 'The independently interpreted evidence agrees with the generated value.',
  ...(id === BLIND_PACKET.id ? { blindExpectedInterpretation: { value: 'fixture interpretation' } } : {}),
  findings,
})

const humanCalibrationEvidence = (assignmentId: ReviewAssignment['id']) => {
  const receipt = {
    assignmentId,
    blindResultsChecksum: digest('human-calibration-blind-results'),
    comparisonResultsChecksum: digest('human-calibration-comparison-results'),
    controlPairKeysChecksum: digest('human-calibration-control-pairs'),
  }
  return { ...receipt, receiptChecksum: checksumReviewRecord(receipt) }
}

const passingLedger = (): ReviewLedger => {
  const agentAssignment = createReviewAssignment({
    packetIds: [BLIND_PACKET.id, COMPARISON_PACKET.id],
    reviewer: agentReviewer,
    execution: 'local',
    assignedAt: CALIBRATED_AT,
  })
  const humanAssignment = createReviewAssignment({
    packetIds: [BLIND_PACKET.id, COMPARISON_PACKET.id],
    reviewer: humanReviewer,
    execution: 'human',
    assignedAt: CALIBRATED_AT,
  })
  return {
    ...emptyReviewLedger(),
    assignments: [agentAssignment, humanAssignment],
    calibrations: [
      {
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        reviewerConfigurationId: reviewerConfigurationId(agentReviewer),
        rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
        calibratedAt: CALIBRATED_AT,
        seededBlockerMajorDefects: 1,
        foundSeededBlockerMajorDefects: 1,
        unsupportedExpectedValues: 0,
        insufficientEvidenceCases: 1,
        correctCannotVerifyCases: 1,
        passed: true,
      },
      {
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        reviewerConfigurationId: reviewerConfigurationId(humanReviewer),
        rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
        calibratedAt: CALIBRATED_AT,
        seededBlockerMajorDefects: 1,
        foundSeededBlockerMajorDefects: 1,
        unsupportedExpectedValues: 0,
        insufficientEvidenceCases: 1,
        correctCannotVerifyCases: 1,
        passed: true,
        evidence: humanCalibrationEvidence(humanAssignment.id),
      },
    ],
    results: [
      result(agentAssignment.id, agentReviewer, BLIND_PACKET.id, BLIND_CHECKSUM),
      result(agentAssignment.id, agentReviewer, COMPARISON_PACKET.id, COMPARISON_CHECKSUM),
      result(humanAssignment.id, humanReviewer, BLIND_PACKET.id, BLIND_CHECKSUM),
      result(humanAssignment.id, humanReviewer, COMPARISON_PACKET.id, COMPARISON_CHECKSUM),
    ],
    signoffs: [
      {
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        id: 'human-signoff:fixture',
        reviewerId: humanReviewer.id,
        packetIds: [COMPARISON_PACKET.id],
        factionIds: [FACTION_ID],
        rulesContextIds: [CONTEXT_ID],
        acceptedLimitationFindingIds: [],
        signedAt: REVIEWED_AT,
        statement: 'I checked this sample against the cited source evidence.',
      },
    ],
  }
}

const passingInput = (): CertificationEvaluationInput => ({
  index: reviewIndex(),
  ledger: passingLedger(),
  inventory: {
    schemaVersion: 1,
    revision: 'aos4-fixture',
    observedAt: CALIBRATED_AT,
    producedBy: 'independent-fixture-inventory',
    independentFromAcceptedManifest: true,
    complete: true,
    entries: [
      {
        publisher: 'wahapedia',
        url: 'https://wahapedia.ru/aos4/factions/fixture/',
        title: 'Fixture faction',
        status: 'matched',
        acceptedArtifactChecksum: ACCEPTED_ARTIFACT_CHECKSUM,
      },
    ],
  },
  acceptedArtifactChecksums: [ACCEPTED_ARTIFACT_CHECKSUM],
})

const inventoryBinding = (input: CertificationEvaluationInput) => ({
  checksum: digest('inventory'),
  observedAt: input.inventory.observedAt,
  complete: input.inventory.complete,
})

const finding = (severity: 'minor' | 'major'): ReviewFinding =>
  createReviewFinding({
    packetId: COMPARISON_PACKET.id,
    subject: {
      sourceRecordId: SOURCE_RECORD_ID,
      field: 'effect',
    },
    expectedValue: 'correct',
    actualValue: 'incorrect',
    severity,
    confidence: 'high',
    rationale: 'The source evidence supports a different value.',
    evidence: [
      {
        sourceRecordId: SOURCE_RECORD_ID,
        recordChecksum: EVIDENCE_CHECKSUM,
        locator: { kind: 'row', row: 1 },
      },
    ],
  })

const attachFinding = (input: CertificationEvaluationInput, reviewFinding: ReviewFinding): void => {
  input.ledger.findings = [reviewFinding]
  const agentComparisonIndex = input.ledger.results.findIndex(
    value =>
      value.packetId === COMPARISON_PACKET.id &&
      value.reviewerConfigurationId === reviewerConfigurationId(agentReviewer)
  )
  const assignmentId = input.ledger.results[agentComparisonIndex].assignmentId
  input.ledger.results[agentComparisonIndex] = result(
    assignmentId,
    agentReviewer,
    COMPARISON_PACKET.id,
    COMPARISON_CHECKSUM,
    [reviewFinding]
  )
}

const certificationInputs = (): CertificationInput[] =>
  REQUIRED_CERTIFICATION_INPUTS.map(name => ({
    name,
    path: `data/aos4/certifications/fixture/${name}.json`,
    checksum: digest(name),
  }))

describe('AoS 4 certification evaluation', () => {
  it('allows the pending CI gate only for genuine human-review blockers', () => {
    const issue = (
      code: CertificationIssue['code'],
      state: CertificationIssue['state'] = 'blocked'
    ): CertificationIssue => ({
      code,
      path: 'fixture',
      subject: 'fixture',
      message: code,
      state,
    })

    expect(
      hasOnlyHumanPendingCertificationIssues([issue('missing-human-review'), issue('manifest-not-passing')])
    ).toBe(true)
    expect(hasOnlyHumanPendingCertificationIssues([issue('manifest-not-passing')])).toBe(false)
    expect(
      hasOnlyHumanPendingCertificationIssues([
        issue('missing-human-signoff', 'stale'),
        issue('manifest-not-passing'),
      ])
    ).toBe(false)
    expect(
      hasOnlyHumanPendingCertificationIssues([issue('missing-human-signoff'), issue('stale-input', 'stale')])
    ).toBe(false)
    expect(
      parseCertificationCommandArguments([
        '--certification-dir',
        'data/aos4/certifications/fixture',
        '--allow-human-pending',
        '--workspace-index',
        '.cache/aos4/review/fixture/index.json',
        '--workspace',
        '.cache/aos4/review/fixture/workspace.json',
      ])
    ).toMatchObject({
      certificationDirectory: 'data/aos4/certifications/fixture',
      allowHumanPending: true,
      workspaceIndexPath: '.cache/aos4/review/fixture/index.json',
      workspacePath: '.cache/aos4/review/fixture/workspace.json',
    })
    expect(() => parseCertificationCommandArguments(['--write-summary'])).toThrow(
      'cannot mutate an immutable certification'
    )
  })

  it('requires deterministic preparation paths and timestamps', () => {
    expect(
      parseCertificationPreparationArguments([
        '--output',
        'data/aos4/certifications/fixture',
        '--evaluated-at',
        REVIEWED_AT,
        '--human-ledger',
        '.cache/aos4/review/human-ledger.json',
        '--require-pass',
      ])
    ).toMatchObject({
      output: 'data/aos4/certifications/fixture',
      evaluatedAt: REVIEWED_AT,
      humanLedger: '.cache/aos4/review/human-ledger.json',
      requirePass: true,
    })
    expect(() =>
      parseCertificationPreparationArguments([
        '--output',
        'data/aos4/certifications/fixture',
        '--evaluated-at',
        'not-an-instant',
      ])
    ).toThrow('--evaluated-at requires a canonical ISO timestamp')
  })

  it('keeps human blind review and comparison as explicit separate steps', () => {
    expect(
      parseHumanReviewArguments([
        'prepare',
        '--output',
        '.cache/aos4/review/human-davis',
        '--reviewer-id',
        'maintainer:davis',
        '--assigned-at',
        REVIEWED_AT,
      ])
    ).toMatchObject({
      command: 'prepare',
      output: '.cache/aos4/review/human-davis',
      reviewerId: 'maintainer:davis',
      assignedAt: REVIEWED_AT,
    })
    expect(() =>
      parseHumanReviewArguments(['compare', '--review-dir', '.cache/aos4/review/human-davis'])
    ).toThrow('compare requires --blind-results')
  })

  it('binds human calibration to reviewer identity and agent calibration to configuration', () => {
    expect(reviewerConfigurationId({ ...humanReviewer, id: 'different-human-reviewer' })).not.toBe(
      reviewerConfigurationId(humanReviewer)
    )
    expect(reviewerConfigurationId({ ...agentReviewer, id: 'replacement-agent-process' })).toBe(
      reviewerConfigurationId(agentReviewer)
    )
  })

  it('rejects an internally consistent index truncated below bound source populations', () => {
    const index = reviewIndex()
    const catalog = {
      schemaVersion: 1 as const,
      generatedAt: REVIEWED_AT,
      rulesContexts: [],
      sourceArtifacts: [],
      sourceRecords: [
        {
          id: SOURCE_RECORD_ID,
          artifactId: artifactId(digest('artifact')),
          locator: { kind: 'row' as const, row: 1 },
          recordChecksum: EVIDENCE_CHECKSUM,
          rulesContextIds: [CONTEXT_ID],
        },
      ],
      entities: [],
      relationships: [],
    }
    const officialLedger = {
      schemaVersion: 1 as const,
      generatedAt: REVIEWED_AT,
      authority: 'games-workshop' as const,
      records: [],
      summary: {
        records: 0,
        effective: 0,
        superseded: 0,
        units: 0,
        rosterOptions: 0,
        regimentsOfRenown: 0,
        appliedToRuntime: 0,
        profileOnly: 0,
        structuredReference: 0,
      },
    }
    const reconciliation = {
      schemaVersion: 1 as const,
      pages: 0,
      matchedOfficialUnitFacts: 0,
      unmatchedOfficialUnitFacts: [],
      discrepancies: [],
    }
    const review = {
      schemaVersion: 1 as const,
      revision: 'fixture',
      generatedAt: REVIEWED_AT,
      rulesContext: {
        id: CONTEXT_ID,
        name: 'Fixture',
        mode: 'standard' as const,
        status: 'current' as const,
      },
      approvedFactionIds: [],
      decoderDiagnosticPolicies: [],
      normalizationDiagnosticPolicies: [],
      ignoredSourceRecords: [],
      timingOverrides: [],
      officialDocuments: [],
    }
    const truncated = {
      ...index,
      entries: [],
      coverage: {
        ...index.coverage,
        sourceRecords: { assigned: 0, expected: 0 },
        factionContextStrata: [],
        highRiskCohorts: [],
      },
    }
    const issues = boundReviewPopulationIssues(truncated, catalog, officialLedger, reconciliation, review)

    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'invalid-review-index',
        path: 'index.population.source-record',
      })
    )

    const swappedIgnored = {
      ...index,
      entries: [
        {
          ...index.entries[0],
          category: 'ignored-record' as const,
          candidateKey: `ignored-record:${SOURCE_RECORD_ID}`,
        },
      ],
    }
    const ignoredIssues = boundReviewPopulationIssues(
      swappedIgnored,
      { ...catalog, sourceRecords: [] },
      officialLedger,
      reconciliation,
      {
        ...review,
        supersededSourceRecords: {
          expectedCount: 1,
          checksum: digest('different-ignored-source-record'),
          reason: 'Fixture superseded-source population.',
        },
      }
    )
    expect(ignoredIssues).toContainEqual(
      expect.objectContaining({
        code: 'invalid-review-index',
        path: 'index.population.ignored-record',
      })
    )
  })

  it('merges a separately reviewed human ledger into the machine campaign', () => {
    const complete = passingLedger()
    const agentAssignmentId = complete.assignments.find(
      assignment => assignment.reviewer.kind === 'agent'
    )!.id
    const humanAssignmentId = complete.assignments.find(
      assignment => assignment.reviewer.kind === 'human'
    )!.id
    const machine: ReviewLedger = {
      ...emptyReviewLedger(),
      assignments: complete.assignments.filter(assignment => assignment.id === agentAssignmentId),
      calibrations: complete.calibrations.filter(
        calibration => calibration.reviewerConfigurationId === reviewerConfigurationId(agentReviewer)
      ),
      results: complete.results.filter(reviewResult => reviewResult.assignmentId === agentAssignmentId),
    }
    const human: ReviewLedger = {
      ...emptyReviewLedger(),
      assignments: complete.assignments.filter(assignment => assignment.id === humanAssignmentId),
      calibrations: complete.calibrations.filter(
        calibration => calibration.reviewerConfigurationId === reviewerConfigurationId(humanReviewer)
      ),
      results: complete.results.filter(reviewResult => reviewResult.assignmentId === humanAssignmentId),
      signoffs: complete.signoffs,
    }
    const input = passingInput()
    input.ledger = mergeReviewLedgers(machine, human)

    expect(evaluateCertification(input)).toMatchObject({ status: 'pass', issues: [] })
  })

  it('commits checksums and structure instead of blind source bodies', () => {
    const ledger = passingLedger()
    const blind = ledger.results.find(reviewResult => reviewResult.packetId === BLIND_PACKET.id)!
    blind.blindExpectedInterpretation = {
      descriptionHtml: '<b>Verbatim source rule that must remain ignored.</b>',
      attacks: 2,
    }

    const safe = sourceSafeReviewLedger(ledger)
    const serialized = JSON.stringify(safe)

    expect(serialized).not.toContain('Verbatim source rule')
    expect(safe.results.find(result_ => result_.packetId === BLIND_PACKET.id)).toMatchObject({
      blindExpectedInterpretation: {
        interpretationChecksum: expect.stringMatching(/^[0-9a-f]{64}$/),
        shape: {
          numbers: 1,
          strings: 1,
          fieldPaths: ['attacks', 'descriptionHtml'],
        },
      },
    })
  })

  it('passes only complete calibrated machine review plus signed human samples', () => {
    expect(evaluateCertification(passingInput())).toMatchObject({
      status: 'pass',
      issues: [],
      summary: {
        coverage: {
          sourceRecords: { reviewed: 1, expected: 1 },
          factionContextStrata: { reviewed: 1, expected: 1 },
          highRiskCohorts: { reviewed: 1, expected: 1 },
        },
      },
    })
  })

  it('rejects human-sample coverage metadata that omits a populated stratum', () => {
    const input = passingInput()
    input.index.coverage.humanSample.categories = []

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({
        code: 'invalid-review-index',
        path: 'index.coverage.humanSample',
      })
    )
  })

  it('blocks partial blind/comparison imports', () => {
    const input = passingInput()
    input.ledger.results = input.ledger.results.filter(
      value =>
        !(
          value.packetId === COMPARISON_PACKET.id &&
          value.reviewerConfigurationId === reviewerConfigurationId(agentReviewer)
        )
    )

    expect(evaluateCertification(input).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'missing-comparison-result' }),
        expect.objectContaining({ code: 'incomplete-coverage' }),
      ])
    )
  })

  it('marks a mismatched packet checksum stale', () => {
    const input = passingInput()
    input.ledger.results[0].packetChecksum = digest('stale')

    expect(evaluateCertification(input)).toMatchObject({
      status: 'stale',
      issues: expect.arrayContaining([expect.objectContaining({ code: 'stale-packet' })]),
    })
  })

  it('requires blind interpretation to precede comparison for the same reviewer', () => {
    const input = passingInput()
    const agentComparison = input.ledger.results.find(
      value =>
        value.packetId === COMPARISON_PACKET.id &&
        value.reviewerConfigurationId === reviewerConfigurationId(agentReviewer)
    )!
    agentComparison.reviewedAt = BLIND_REVIEWED_AT

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({ code: 'comparison-before-blind' })
    )
  })

  it('blocks cannot-verify outcomes', () => {
    const input = passingInput()
    input.ledger.results[1] = {
      ...input.ledger.results[1],
      outcome: 'cannot-verify',
      rationale: 'The supplied evidence is insufficient.',
    }

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({ code: 'cannot-verify' })
    )
  })

  it('blocks a missing human sample sign-off', () => {
    const input = passingInput()
    input.ledger.signoffs = []

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({ code: 'missing-human-signoff' })
    )
  })

  it('blocks incomplete or manifest-seeded source inventories', () => {
    const input = passingInput()
    input.inventory.complete = false
    input.inventory.independentFromAcceptedManifest = false
    input.inventory.entries = []

    expect(evaluateCertification(input).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-source-inventory' }),
        expect.objectContaining({ code: 'incomplete-source-inventory' }),
        expect.objectContaining({ code: 'unmatched-source-artifact' }),
      ])
    )
  })

  it('requires every finding to be dispositioned', () => {
    const input = passingInput()
    attachFinding(input, finding('minor'))

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({ code: 'open-finding' })
    )
  })

  it('allows only signed minor accepted limitations', () => {
    const input = passingInput()
    const reviewFinding = finding('minor')
    attachFinding(input, reviewFinding)
    const resolution: FindingResolution = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: reviewFinding.id,
      disposition: 'accepted-limitation',
      rationale: 'The limitation is editorial and cannot mislead runtime play.',
      resolvedBy: 'maintainer',
      resolvedAt: REVIEWED_AT,
      upstreamChangeRefs: [],
    }
    input.ledger = appendFindingResolution(input.ledger, resolution)
    input.ledger.signoffs[0].acceptedLimitationFindingIds = [reviewFinding.id]

    expect(evaluateCertification(input)).toMatchObject({
      status: 'pass',
      summary: {
        openLimitations: [{ findingId: reviewFinding.id, owner: 'maintainer' }],
        findingCountsByField: { effect: 1 },
      },
    })
  })

  it('requires independent verification for material corrections', () => {
    const input = passingInput()
    const reviewFinding = finding('major')
    attachFinding(input, reviewFinding)
    input.ledger = appendFindingResolution(input.ledger, {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: reviewFinding.id,
      disposition: 'fixed',
      rationale: 'Corrected the upstream extractor.',
      resolvedBy: 'maintainer',
      resolvedAt: REVIEWED_AT,
      upstreamChangeRefs: ['commit:fixture'],
    })

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({ code: 'missing-verification' })
    )

    input.ledger = appendFindingVerification(input.ledger, {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: reviewFinding.id,
      outcome: 'verified',
      rationale: 'The corrected packet now matches the official evidence.',
      verifierId: 'independent-verifier',
      verifiedAt: REVIEWED_AT,
      packetId: COMPARISON_PACKET.id,
      packetChecksum: COMPARISON_CHECKSUM,
    })
    expect(evaluateCertification(input)).toMatchObject({ status: 'pass' })
  })

  it('requires calibration for the exact contributing configuration and rubric', () => {
    const input = passingInput()
    input.ledger.calibrations = []

    expect(evaluateCertification(input).issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-calibration' })])
    )
  })

  it('rejects an invalid reviewer batch without importing its valid half', () => {
    const ledger = passingLedger()
    const secondAgent = { ...agentReviewer, id: 'second-agent', model: 'fixture-model-2' }
    const assignment = createReviewAssignment({
      packetIds: [BLIND_PACKET.id, COMPARISON_PACKET.id],
      reviewer: secondAgent,
      execution: 'local',
      assignedAt: CALIBRATED_AT,
    })
    ledger.assignments.push(assignment)
    ledger.calibrations.push({
      ...ledger.calibrations[0],
      reviewerConfigurationId: reviewerConfigurationId(secondAgent),
    })
    const before = structuredClone(ledger)
    const validBlind = result(assignment.id, secondAgent, BLIND_PACKET.id, BLIND_CHECKSUM)
    const invalidComparison = {
      ...result(assignment.id, secondAgent, COMPARISON_PACKET.id, COMPARISON_CHECKSUM),
      packetChecksum: digest('different-packet'),
    }

    expect(() =>
      importReviewerResultsAtomic(ledger, [validBlind, invalidComparison], [BLIND_PACKET, COMPARISON_PACKET])
    ).toThrow()
    expect(ledger).toEqual(before)
  })

  it('invalidates a passing manifest when any bound product changes', () => {
    const input = passingInput()
    const evaluation = evaluateCertification(input)
    const inputs = certificationInputs()
    const manifest = createCertificationManifest({
      evaluation,
      inputs,
      ledger: input.ledger,
      inventory: inventoryBinding(input),
      certifiedAt: REVIEWED_AT,
      protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
      rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    })

    expect(
      verifyCertificationManifest({
        manifest,
        evaluation,
        currentInputs: inputs,
        ledger: input.ledger,
        inventory: inventoryBinding(input),
        protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
        rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
      })
    ).toEqual([])

    const changed = inputs.map(value =>
      value.name === 'runtime-catalog' ? { ...value, checksum: digest('changed-runtime') } : value
    )
    expect(
      verifyCertificationManifest({
        manifest,
        evaluation,
        currentInputs: changed,
        ledger: input.ledger,
        inventory: inventoryBinding(input),
        protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
        rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
      })
    ).toContainEqual(expect.objectContaining({ code: 'stale-input' }))
  })

  it('validates checked-in evidence without reading the ignored source cache', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-'))
    try {
      const input = passingInput()
      const structured: Record<string, unknown> = {
        'accepted-manifest': {
          schemaVersion: 1,
          artifacts: [{ checksum: ACCEPTED_ARTIFACT_CHECKSUM }],
        },
        'audit-catalog': {
          sourceRecords: [{ id: 'fixture' }],
          entities: [
            {
              id: FACTION_ID,
              kind: 'faction',
              rulesContextIds: [CONTEXT_ID],
            },
          ],
        },
        'official-ledger': {
          records: [],
        },
        'reconciliation-report': {
          discrepancies: [],
          unmatchedOfficialUnitFacts: [],
        },
        'corpus-review': {
          ignoredSourceRecords: [],
          supersededSourceRecords: { expectedCount: 0 },
        },
        'review-index': {
          schemaVersion: 1,
          kind: 'review-index-shards',
          revision: input.index.revision,
          protocolVersion: input.index.protocolVersion,
          rubricVersion: input.index.rubricVersion,
          coverage: input.index.coverage,
          shards: [{ inputName: 'review-index-shard-0001', entries: input.index.entries.length }],
        },
        'review-index-shard-0001': input.index.entries,
        'review-assignments': input.ledger.assignments,
        'review-calibrations': input.ledger.calibrations,
        'review-results': {
          schemaVersion: 1,
          kind: 'review-result-shards',
          revision: input.index.revision,
          shards: [{ inputName: 'review-results-shard-0001', results: input.ledger.results.length }],
        },
        'review-results-shard-0001': input.ledger.results,
        'review-findings': input.ledger.findings,
        'review-resolutions': input.ledger.resolutions,
        'review-verifications': input.ledger.verifications,
        'review-signoffs': input.ledger.signoffs,
        'review-protocol': {
          schemaVersion: 1,
          protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
        },
        'review-rubric': {
          schemaVersion: 1,
          rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
        },
        'source-inventory': input.inventory,
        'human-sample': createHumanSampleManifest(input.index),
      }
      const bindings: CertificationInput[] = []
      for (const name of [
        ...REQUIRED_CERTIFICATION_INPUTS,
        'review-index-shard-0001',
        'review-results-shard-0001',
      ]) {
        const relativePath = `data/aos4/certifications/fixture/inputs/${name}.json`
        const content = serializeReviewRecord(structured[name] ?? { fixture: name })
        await mkdir(path.dirname(path.join(repoRoot, relativePath)), { recursive: true })
        await writeFile(path.join(repoRoot, relativePath), content, 'utf8')
        bindings.push({
          name,
          path: relativePath,
          checksum: checksumCertificationText(content),
        })
      }
      const sourceInventoryBinding = {
        checksum: bindings.find(value => value.name === 'source-inventory')!.checksum,
        observedAt: input.inventory.observedAt,
        complete: input.inventory.complete,
      }
      const evaluation = evaluateCertification(input)
      const manifest = createCertificationManifest({
        evaluation,
        inputs: bindings,
        ledger: input.ledger,
        inventory: sourceInventoryBinding,
        certifiedAt: REVIEWED_AT,
        protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
        rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
      })
      const certificationDirectory = path.join(repoRoot, 'data', 'aos4', 'certifications', 'fixture')
      await writeFile(
        path.join(certificationDirectory, 'manifest.json'),
        serializeReviewRecord(manifest),
        'utf8'
      )
      await writeFile(
        path.join(certificationDirectory, 'summary.json'),
        serializeReviewRecord({
          ...evaluation.summary,
          boundChecksums: manifest.inputs,
        }),
        'utf8'
      )
      await writeFile(
        path.join(certificationDirectory, '.complete.json'),
        '{"kind":"aos4-create-only-directory","schemaVersion":1}\n',
        'utf8'
      )
      await writeFile(
        path.join(repoRoot, 'data', 'aos4', 'certifications', 'current.json'),
        serializeReviewRecord({
          schemaVersion: 1,
          directory: 'data/aos4/certifications/fixture',
        }),
        'utf8'
      )

      const result = await runCertificationCheck(
        {
          currentPath: 'data/aos4/certifications/current.json',
          full: false,
          writeSummary: false,
        },
        repoRoot
      )

      expect(result).toMatchObject({ ok: true, status: 'pass', issues: [] })
      await expect(access(path.join(repoRoot, '.cache'))).rejects.toThrow()

      await unlink(path.join(certificationDirectory, '.complete.json'))
      await expect(
        runCertificationCheck(
          {
            currentPath: 'data/aos4/certifications/current.json',
            full: false,
            writeSummary: false,
          },
          repoRoot
        )
      ).rejects.toThrow('Create-only directory is incomplete')
      await writeFile(
        path.join(certificationDirectory, '.complete.json'),
        '{"kind":"aos4-create-only-directory","schemaVersion":1}\n',
        'utf8'
      )

      await writeFile(path.join(certificationDirectory, 'summary.json'), '{}', 'utf8')
      await expect(
        runCertificationCheck(
          {
            currentPath: 'data/aos4/certifications/current.json',
            full: false,
            writeSummary: false,
          },
          repoRoot
        )
      ).resolves.toMatchObject({
        ok: false,
        status: 'stale',
        issues: [expect.objectContaining({ code: 'stale-summary' })],
      })
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })
})
