import { createHash } from 'node:crypto'
import { access, mkdir, mkdtemp, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  CALIBRATION_CONTROL_CANDIDATE_KEYS,
  REQUIRED_CERTIFICATION_INPUTS,
  REQUIRED_HIGH_RISK_COHORTS,
  appendFindingResolution,
  appendFindingVerification,
  boundReviewPopulationIssues,
  calibrationEvidenceIssues,
  certificationChronologyIssues,
  checksumCertificationText,
  checksumReviewRecord,
  createCertificationManifest,
  createCalibrationEvidenceReceipt,
  createReviewAssignment,
  createReviewFinding,
  createReviewPacket,
  emptyReviewLedger,
  evaluateCertification,
  importReviewerResultsAtomic,
  parseCertificationCommandArguments,
  parseCertificationPreparationArguments,
  reviewerConfigurationId,
  reviewIndexSamplingMetadataChecksum,
  runCertificationCheck,
  serializeReviewRecord,
  sourceSafeReviewLedger,
  verifyCertificationManifest,
  type CertificationEvaluationInput,
  type CertificationInput,
  type CalibrationCaseKind,
  type ReviewFinding,
  type ReviewLedger,
  type ReviewPacket,
  type ReviewPacketId,
  type ReviewPacketSafeIndex,
  type ReviewerMetadata,
  type ReviewerResult,
} from '../../aos4/review'
import { AOS4_GOLDEN_TRUTH_CASES } from '../../aos4/review/pathology'
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

const passingLedger = (): ReviewLedger => {
  const agentAssignment = createReviewAssignment({
    packetIds: [BLIND_PACKET.id, COMPARISON_PACKET.id],
    reviewer: agentReviewer,
    execution: 'local',
    assignedAt: CALIBRATED_AT,
  })
  return {
    ...emptyReviewLedger(),
    assignments: [agentAssignment],
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
    ],
    results: [
      result(agentAssignment.id, agentReviewer, BLIND_PACKET.id, BLIND_CHECKSUM),
      result(agentAssignment.id, agentReviewer, COMPARISON_PACKET.id, COMPARISON_CHECKSUM),
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

const fixtureIndexEntry = ({
  candidateKey,
  category,
  cohortIds,
  calibrationKind,
}: {
  candidateKey: string
  category: ReviewPacketSafeIndex['entries'][number]['category']
  cohortIds: string[]
  calibrationKind?: CalibrationCaseKind
}): ReviewPacketSafeIndex['entries'][number] => {
  const blindPacketChecksum = digest(`${candidateKey}:blind`)
  const comparisonPacketChecksum = digest(`${candidateKey}:comparison`)
  const entry: ReviewPacketSafeIndex['entries'][number] = {
    pairKey: `review-pair:sha256:${digest(`${candidateKey}:pair`)}`,
    candidateKey,
    category,
    blindPacketId: `review-packet:sha256:${blindPacketChecksum}`,
    blindPacketChecksum,
    comparisonPacketId: `review-packet:sha256:${comparisonPacketChecksum}`,
    comparisonPacketChecksum,
    cohortIds,
    samplingMetadataChecksum: digest(`${candidateKey}:sampling`),
    authorityClasses: ['secondary'],
    factionIds: [FACTION_ID],
    rulesContextIds: [CONTEXT_ID],
    blindDerivationRequired: true,
    assignmentStatus: 'unassigned',
    calibration: calibrationKind !== undefined,
    ...(calibrationKind ? { calibrationKind } : {}),
    countsTowardCoverage: calibrationKind === undefined,
    projectsToRuntime: calibrationKind === undefined,
  }
  return {
    ...entry,
    samplingMetadataChecksum: reviewIndexSamplingMetadataChecksum(entry),
  }
}

const fixtureResult = ({
  assignmentId,
  packetId,
  packetChecksum,
  reviewedAt,
  outcome = 'pass',
  blind = false,
  findings = [],
}: {
  assignmentId: ReviewerResult['assignmentId']
  packetId: ReviewPacketId
  packetChecksum: string
  reviewedAt: string
  outcome?: ReviewerResult['outcome']
  blind?: boolean
  findings?: ReviewFinding[]
}): ReviewerResult => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignmentId,
  packetId,
  packetChecksum,
  reviewerConfigurationId: reviewerConfigurationId(agentReviewer),
  reviewedAt,
  outcome,
  rationale:
    outcome === 'finding'
      ? 'The seeded comparison defect was detected.'
      : outcome === 'cannot-verify'
        ? 'The control intentionally lacks sufficient evidence.'
        : 'The independently interpreted evidence agrees with the generated value.',
  ...(blind && outcome !== 'cannot-verify'
    ? { blindExpectedInterpretation: { value: 'fixture interpretation' } }
    : {}),
  findings,
})

const seededControlFinding = (packetId: ReviewPacketId): ReviewFinding =>
  createReviewFinding({
    packetId,
    subject: {
      sourceRecordId: SOURCE_RECORD_ID,
      field: 'effect',
    },
    expectedValue: 'correct',
    actualValue: 'seeded defect',
    severity: 'major',
    confidence: 'high',
    rationale: 'The control deliberately contains a material mismatch.',
    evidence: [
      {
        sourceRecordId: SOURCE_RECORD_ID,
        recordChecksum: EVIDENCE_CHECKSUM,
        locator: { kind: 'row', row: 1 },
      },
    ],
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
  it('parses the machine certification command without bypass flags', () => {
    expect(parseCertificationCommandArguments([])).toMatchObject({
      currentPath: path.join('data', 'aos4', 'certifications', 'beta.json'),
    })
    expect(
      parseCertificationCommandArguments([
        '--certification-dir',
        'data/aos4/certifications/fixture',
        '--workspace-index',
        '.cache/aos4/review/fixture/index.json',
        '--workspace',
        '.cache/aos4/review/fixture/workspace.json',
      ])
    ).toMatchObject({
      certificationDirectory: 'data/aos4/certifications/fixture',
      workspaceIndexPath: '.cache/aos4/review/fixture/index.json',
      workspacePath: '.cache/aos4/review/fixture/workspace.json',
    })
    expect(() => parseCertificationCommandArguments(['--beta'])).toThrow('Unknown argument: --beta')
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
      ])
    ).toMatchObject({
      output: 'data/aos4/certifications/fixture',
      evaluatedAt: REVIEWED_AT,
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

  it('requires certification to occur after all bound review evidence', () => {
    const input = passingInput()

    expect(certificationChronologyIssues('2026-07-28T12:00:30.000Z', input.ledger, [])).toContainEqual(
      expect.objectContaining({
        code: 'certification-before-evidence',
        path: 'manifest.certifiedAt',
      })
    )
    expect(certificationChronologyIssues(REVIEWED_AT, input.ledger, [])).toEqual([])
    expect(
      certificationChronologyIssues('2026-07-28T12:04:00.000Z', input.ledger, [], '2026-07-28T12:05:00.000Z')
    ).toContainEqual(
      expect.objectContaining({
        code: 'certification-before-evidence',
        path: 'manifest.certifiedAt',
      })
    )
  })

  it('binds agent calibration to reviewer configuration instead of process identity', () => {
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
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'index.population.golden-truth' }),
        expect.objectContaining({ path: 'index.population.high-risk' }),
      ])
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

  it('passes only a complete calibrated machine review', () => {
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

  it('counts each review entry once per distinct coverage key', () => {
    const input = passingInput()
    input.index.entries[0].cohortIds = ['high-risk:reaction', 'high-risk:reaction', SAMPLING_METADATA_COHORT]

    expect(evaluateCertification(input).summary.coverageByCohort).toMatchObject({
      'high-risk:reaction': { reviewed: 1, expected: 1 },
      [SAMPLING_METADATA_COHORT]: { reviewed: 1, expected: 1 },
    })
  })

  it('rejects safe-index cohort relabeling that is not bound to sampling metadata', () => {
    const input = passingInput()
    input.index.entries[0].cohortIds = [
      ...input.index.entries[0].cohortIds,
      'high-risk:unknown-or-incomplete',
    ]

    expect(evaluateCertification(input).issues).toContainEqual(
      expect.objectContaining({
        code: 'invalid-review-index',
        path: 'index.entries[0]',
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

  it('requires the automated review to be rerun until no finding remains', () => {
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
    expect(evaluateCertification(input)).toMatchObject({
      status: 'blocked',
      issues: [expect.objectContaining({ code: 'open-finding' })],
    })
  })

  it('requires calibration for the exact contributing configuration and rubric', () => {
    const input = passingInput()
    input.ledger.calibrations = []

    expect(evaluateCertification(input).issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-calibration' })])
    )
  })

  it('rejects calibration evidence when a concealed control result is altered', () => {
    const index = reviewIndex()
    const entries = (
      ['pass', 'defect', 'disagreement', 'insufficient-evidence'] as CalibrationCaseKind[]
    ).map(kind =>
      fixtureIndexEntry({
        candidateKey: CALIBRATION_CONTROL_CANDIDATE_KEYS[kind],
        category: kind === 'disagreement' ? 'reconciliation-discrepancy' : 'official-record',
        cohortIds: [`calibration:${kind}`],
        calibrationKind: kind,
      })
    )
    index.entries.push(...entries)
    const assignment = createReviewAssignment({
      packetIds: entries.flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId]),
      reviewer: agentReviewer,
      execution: 'local',
      assignedAt: '2026-07-28T10:49:00.000Z',
    })
    const calibrationResults = entries.flatMap((entry, entryIndex) => {
      const insufficient = entry.calibrationKind === 'insufficient-evidence'
      return [
        fixtureResult({
          assignmentId: assignment.id,
          packetId: entry.blindPacketId,
          packetChecksum: entry.blindPacketChecksum,
          reviewedAt: `2026-07-28T10:5${entryIndex}:00.000Z`,
          outcome: insufficient ? 'cannot-verify' : 'pass',
          blind: true,
        }),
        fixtureResult({
          assignmentId: assignment.id,
          packetId: entry.comparisonPacketId,
          packetChecksum: entry.comparisonPacketChecksum,
          reviewedAt: `2026-07-28T10:5${entryIndex}:30.000Z`,
          outcome: entry.calibrationKind === 'defect' ? 'finding' : insufficient ? 'cannot-verify' : 'pass',
          findings:
            entry.calibrationKind === 'defect' ? [seededControlFinding(entry.comparisonPacketId)] : [],
        }),
      ]
    })
    const ledger: ReviewLedger = {
      ...emptyReviewLedger(),
      assignments: [assignment],
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
          evidence: createCalibrationEvidenceReceipt(assignment.id, index, calibrationResults),
        },
      ],
    }

    expect(calibrationEvidenceIssues(index, ledger, calibrationResults)).toEqual([])

    const defectComparisonId = entries.find(entry => entry.calibrationKind === 'defect')!.comparisonPacketId
    const withEvidenceFor = (results: ReviewerResult[]): ReviewLedger => ({
      ...ledger,
      calibrations: ledger.calibrations.map(calibration => ({
        ...calibration,
        evidence: createCalibrationEvidenceReceipt(assignment.id, index, results),
      })),
    })
    const minorDefect = calibrationResults.map(reviewResult =>
      reviewResult.packetId === defectComparisonId
        ? {
            ...reviewResult,
            findings: reviewResult.findings.map(controlFinding => ({
              ...controlFinding,
              severity: 'minor' as const,
            })),
          }
        : reviewResult
    )
    expect(calibrationEvidenceIssues(index, withEvidenceFor(minorDefect), minorDefect)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid-calibration-evidence',
        }),
      ])
    )

    const tampered = calibrationResults.map(reviewResult =>
      reviewResult.packetId === defectComparisonId
        ? { ...reviewResult, outcome: 'pass' as const }
        : reviewResult
    )
    expect(calibrationEvidenceIssues(index, withEvidenceFor(tampered), tampered)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid-calibration-evidence',
        }),
      ])
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
      const calibrationEntries = (
        ['pass', 'defect', 'disagreement', 'insufficient-evidence'] as CalibrationCaseKind[]
      ).map(kind =>
        fixtureIndexEntry({
          candidateKey: CALIBRATION_CONTROL_CANDIDATE_KEYS[kind],
          category: kind === 'disagreement' ? 'reconciliation-discrepancy' : 'official-record',
          cohortIds: [`calibration:${kind}`],
          calibrationKind: kind,
        })
      )
      const goldenEntry = fixtureIndexEntry({
        candidateKey: AOS4_GOLDEN_TRUTH_CASES[0].id,
        category: 'golden-truth',
        cohortIds: ['golden-truth', ...REQUIRED_HIGH_RISK_COHORTS],
      })
      input.index.entries.push(...calibrationEntries, goldenEntry)
      input.index.coverage.highRiskCohorts = [...REQUIRED_HIGH_RISK_COHORTS]
      const assignment = createReviewAssignment({
        packetIds: input.index.entries.flatMap(entry => [entry.blindPacketId, entry.comparisonPacketId]),
        reviewer: agentReviewer,
        execution: 'local',
        assignedAt: '2026-07-28T10:49:00.000Z',
      })
      input.ledger.assignments = [assignment]
      input.ledger.results = [
        ...input.ledger.results.map(reviewResult => ({
          ...reviewResult,
          assignmentId: assignment.id,
        })),
        fixtureResult({
          assignmentId: assignment.id,
          packetId: goldenEntry.blindPacketId,
          packetChecksum: goldenEntry.blindPacketChecksum,
          reviewedAt: '2026-07-28T12:02:00.000Z',
          blind: true,
        }),
        fixtureResult({
          assignmentId: assignment.id,
          packetId: goldenEntry.comparisonPacketId,
          packetChecksum: goldenEntry.comparisonPacketChecksum,
          reviewedAt: '2026-07-28T12:03:00.000Z',
        }),
      ]
      const calibrationResults = calibrationEntries.flatMap((entry, entryIndex) => {
        const kind = entry.calibrationKind!
        const comparisonOutcome: ReviewerResult['outcome'] =
          kind === 'defect' ? 'finding' : kind === 'insufficient-evidence' ? 'cannot-verify' : 'pass'
        const blindOutcome: ReviewerResult['outcome'] =
          kind === 'insufficient-evidence' ? 'cannot-verify' : 'pass'
        const seededFinding = kind === 'defect' ? [seededControlFinding(entry.comparisonPacketId)] : []
        return [
          fixtureResult({
            assignmentId: assignment.id,
            packetId: entry.blindPacketId,
            packetChecksum: entry.blindPacketChecksum,
            reviewedAt: `2026-07-28T10:5${entryIndex}:00.000Z`,
            outcome: blindOutcome,
            blind: true,
          }),
          fixtureResult({
            assignmentId: assignment.id,
            packetId: entry.comparisonPacketId,
            packetChecksum: entry.comparisonPacketChecksum,
            reviewedAt: `2026-07-28T10:5${entryIndex}:30.000Z`,
            outcome: comparisonOutcome,
            findings: seededFinding,
          }),
        ]
      })
      input.ledger.calibrations = [
        {
          ...input.ledger.calibrations[0],
          evidence: createCalibrationEvidenceReceipt(assignment.id, input.index, calibrationResults),
        },
      ]
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
        'review-calibration-results': calibrationResults,
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
        'review-protocol': {
          schemaVersion: 1,
          protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
        },
        'review-rubric': {
          schemaVersion: 1,
          rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
        },
        'source-inventory': input.inventory,
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
        certifiedAt: '2026-07-28T12:04:00.000Z',
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
