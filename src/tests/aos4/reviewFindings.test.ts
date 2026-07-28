import {
  AOS4_CERTIFICATION_SCHEMA_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  ReviewValidationError,
  checksumReviewRecord,
  createReviewAssignment,
  createReviewFinding,
  createReviewPacket,
  importReviewerResultAtomic,
  parseCertificationManifest,
  parseReviewLedger,
  parseReviewLedgerSupplement,
  reviewerConfigurationId,
  serializeReviewRecord,
  validateReviewLedger,
  type CertificationManifest,
  type FindingResolution,
  type FindingVerification,
  type HumanReviewSignoff,
  type ReviewCalibration,
  type ReviewLedger,
  type ReviewerMetadata,
  type ReviewerResult,
} from '../../aos4/review'
import { artifactId, factionId, rulesContextId, sourceRecordId } from '../../aos4/domain'

const CHECKSUM_A = 'a'.repeat(64)
const CHECKSUM_B = 'b'.repeat(64)
const CHECKSUM_C = 'c'.repeat(64)
const REVIEWED_AT = '2026-07-28T12:00:00.000Z'
const PACKET_SOURCE_ID = sourceRecordId('games-workshop', 'battle-profiles:p17:lord-terminos')
const CONTEXT_ID = rulesContextId('90000000-0000-4000-8000-000000000001')
const ENTITY_ID = factionId('10000000-0000-4000-8000-000000000001')

const reviewer: ReviewerMetadata = {
  id: 'reviewer:adversarial-agent',
  kind: 'agent',
  tool: 'codex',
  model: 'review-model',
  protocolVersion: 'aos4-review/v1',
  promptVersion: 'aos4-rubric/v1',
}

const packetInput = {
  protocolVersion: 'aos4-review/v1',
  rubricVersion: 'aos4-rubric/v1',
  cohortIds: ['official-fact', 'base-size'],
  canonicalEntityId: ENTITY_ID,
  sourceEvidence: [
    {
      sourceRecordId: PACKET_SOURCE_ID,
      artifactId: artifactId(CHECKSUM_A),
      recordChecksum: CHECKSUM_B,
      locator: { kind: 'page' as const, page: 17, section: 'Lord-Terminos' },
      authority: 'official' as const,
      structuredValue: { baseSizes: ['25mm', '40mm'] },
    },
  ],
  generatedDestinations: [
    {
      path: 'data/aos4/catalog/catalog.json',
      canonicalEntityId: ENTITY_ID,
      field: 'baseSizes',
      value: ['25mm', '40mm'],
    },
  ],
  rulesContextIds: [CONTEXT_ID],
  blind: false,
}

const packet = createReviewPacket(packetInput)

const approvedAssignment = createReviewAssignment({
  packetIds: [packet.id],
  reviewer,
  execution: 'external',
  assignedAt: REVIEWED_AT,
  approvedRecipient: {
    provider: 'openai',
    recipient: 'codex',
    approvedBy: 'maintainer:davis',
    approvedAt: REVIEWED_AT,
    sourceHandlingAttestation: 'read-only-minimized-untrusted-evidence',
  },
})

const calibration = (passed = true): ReviewCalibration => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  reviewerConfigurationId: reviewerConfigurationId(reviewer),
  rubricVersion: reviewer.promptVersion,
  calibratedAt: REVIEWED_AT,
  seededBlockerMajorDefects: 2,
  foundSeededBlockerMajorDefects: passed ? 2 : 1,
  unsupportedExpectedValues: 0,
  insufficientEvidenceCases: 1,
  correctCannotVerifyCases: 1,
  passed,
})

const finding = createReviewFinding({
  packetId: packet.id,
  subject: {
    canonicalEntityId: ENTITY_ID,
    sourceRecordId: PACKET_SOURCE_ID,
    field: 'baseSizes',
  },
  expectedValue: ['25mm', '40mm'],
  actualValue: ['2 5 m m', '40mm'],
  severity: 'major',
  confidence: 'high',
  rationale: 'The official table shows a 25mm base, not a split measurement token.',
  evidence: [
    {
      sourceRecordId: PACKET_SOURCE_ID,
      recordChecksum: CHECKSUM_B,
      locator: { kind: 'page', page: 17, section: 'Lord-Terminos' },
    },
  ],
})

const result: ReviewerResult = {
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignmentId: approvedAssignment.id,
  packetId: packet.id,
  packetChecksum: packet.packetChecksum,
  reviewerConfigurationId: reviewerConfigurationId(reviewer),
  reviewedAt: REVIEWED_AT,
  outcome: 'finding',
  rationale: 'The generated base-size value does not match the official table.',
  findings: [finding],
}

const emptyLedger = (assignment = approvedAssignment): ReviewLedger => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignments: [assignment],
  calibrations: [calibration()],
  results: [],
  findings: [],
  resolutions: [],
  verifications: [],
  signoffs: [],
})

describe('AoS 4 review records', () => {
  it('creates deterministic packet and assignment identities from semantic content', () => {
    const reordered = createReviewPacket({
      ...packetInput,
      cohortIds: [...packetInput.cohortIds].reverse(),
      sourceEvidence: [...packetInput.sourceEvidence].reverse(),
      generatedDestinations: [...packetInput.generatedDestinations].reverse(),
      rulesContextIds: [...packetInput.rulesContextIds].reverse(),
    })
    const reassigned = createReviewAssignment({
      ...approvedAssignment,
      packetIds: [...approvedAssignment.packetIds].reverse(),
      assignedAt: '2026-07-29T12:00:00.000Z',
      id: undefined,
    })

    expect(reordered.id).toBe(packet.id)
    expect(reordered.packetChecksum).toBe(packet.packetChecksum)
    expect(serializeReviewRecord(reordered)).toBe(serializeReviewRecord(packet))
    expect(reassigned.id).toBe(approvedAssignment.id)
  })

  it('round-trips every durable review record and certification manifest', () => {
    const resolution: FindingResolution = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: finding.id,
      disposition: 'fixed',
      rationale: 'Corrected the upstream official battle-profile parser.',
      resolvedBy: 'maintainer:davis',
      resolvedAt: '2026-07-28T13:00:00.000Z',
      upstreamChangeRefs: ['src/aos4/data/gamesWorkshop/battleProfiles.ts'],
    }
    const verification: FindingVerification = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: finding.id,
      outcome: 'verified',
      rationale: 'The corrected packet and regenerated catalog now agree with page 17.',
      verifierId: 'reviewer:independent-human',
      verifiedAt: '2026-07-28T14:00:00.000Z',
      packetId: packet.id,
      packetChecksum: packet.packetChecksum,
    }
    const signoff: HumanReviewSignoff = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      id: 'signoff:stormcast-standard',
      reviewerId: 'reviewer:independent-human',
      packetIds: [packet.id],
      factionIds: [ENTITY_ID],
      rulesContextIds: [CONTEXT_ID],
      acceptedLimitationFindingIds: [],
      signedAt: '2026-07-28T15:00:00.000Z',
      statement: 'The sampled source-to-runtime interpretation is faithful.',
    }
    const ledger: ReviewLedger = {
      ...emptyLedger(),
      results: [result],
      findings: [finding],
      resolutions: [resolution],
      verifications: [verification],
      signoffs: [signoff],
    }
    const manifest: CertificationManifest = {
      schemaVersion: AOS4_CERTIFICATION_SCHEMA_VERSION,
      revision: 'aos4-corpus-2026-07-28',
      status: 'pass',
      certifiedAt: '2026-07-28T16:00:00.000Z',
      inputs: [
        {
          name: 'audit-catalog',
          path: 'data/aos4/catalog/catalog.json',
          checksum: CHECKSUM_C,
        },
      ],
      protocol: {
        protocolVersion: reviewer.protocolVersion,
        rubricVersion: reviewer.promptVersion,
        checksum: checksumReviewRecord({
          protocolVersion: reviewer.protocolVersion,
          rubricVersion: reviewer.promptVersion,
        }),
      },
      coverage: {
        officialRecords: { reviewed: 1, expected: 1 },
        reconciliationDiscrepancies: { reviewed: 1, expected: 1 },
        profileOnlyFacts: { reviewed: 0, expected: 0 },
        sourceRecords: { reviewed: 1, expected: 1 },
        ignoredRecords: { reviewed: 0, expected: 0 },
        factionContextStrata: { reviewed: 1, expected: 1 },
        highRiskCohorts: { reviewed: 1, expected: 1 },
      },
      ledgerChecksum: checksumReviewRecord(ledger),
      signoffChecksum: checksumReviewRecord(ledger.signoffs),
      inventoryChecksum: CHECKSUM_A,
      sourceObservedAt: REVIEWED_AT,
    }

    expect(parseReviewLedger(JSON.parse(serializeReviewRecord(ledger)))).toEqual(ledger)
    expect(parseCertificationManifest(JSON.parse(serializeReviewRecord(manifest)))).toEqual(manifest)
    expect(validateReviewLedger(ledger, [packet])).toEqual([])
  })

  it('imports a valid result without mutating the prior ledger', () => {
    const ledger = emptyLedger()
    const before = serializeReviewRecord(ledger)

    const imported = importReviewerResultAtomic(ledger, result, [packet])

    expect(serializeReviewRecord(ledger)).toBe(before)
    expect(imported).not.toBe(ledger)
    expect(imported.results).toEqual([result])
    expect(imported.findings).toEqual([finding])
  })

  it('rejects malformed provider-neutral JSON with review diagnostics', () => {
    expect(() =>
      parseReviewLedger({
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        assignments: [{}],
        calibrations: [],
        results: [],
        findings: [],
        resolutions: [],
        verifications: [],
        signoffs: [],
      })
    ).toThrowError(ReviewValidationError)
    expect(() =>
      parseCertificationManifest({
        schemaVersion: AOS4_CERTIFICATION_SCHEMA_VERSION,
      })
    ).toThrowError(ReviewValidationError)
  })

  it('accepts supplemental adjudication before machine findings are merged', () => {
    const supplement = {
      ...emptyLedger(),
      resolutions: [
        {
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          findingId: finding.id,
          disposition: 'fixed' as const,
          rationale: 'The upstream transformation was corrected.',
          resolvedBy: 'maintainer',
          resolvedAt: '2026-07-28T13:00:00.000Z',
          upstreamChangeRefs: ['src/aos4/review/fixture.ts'],
        },
      ],
    }

    expect(parseReviewLedgerSupplement(supplement)).toEqual(supplement)
    expect(() => parseReviewLedger(supplement)).toThrowError(ReviewValidationError)
  })

  it('rejects stale packet checksums atomically', () => {
    const ledger = emptyLedger()
    const before = serializeReviewRecord(ledger)

    expect(() =>
      importReviewerResultAtomic(ledger, { ...result, packetChecksum: CHECKSUM_C }, [packet])
    ).toThrowError(ReviewValidationError)
    expect(serializeReviewRecord(ledger)).toBe(before)
  })

  it('rejects unapproved external assignments and uncalibrated agent results', () => {
    const unapproved = createReviewAssignment({
      packetIds: [packet.id],
      reviewer,
      execution: 'external',
      assignedAt: REVIEWED_AT,
    })
    const unapprovedResult = {
      ...result,
      assignmentId: unapproved.id,
    }
    expect(() => importReviewerResultAtomic(emptyLedger(unapproved), unapprovedResult, [packet])).toThrow(
      /approved recipient/i
    )

    const uncalibratedLedger = {
      ...emptyLedger(),
      calibrations: [calibration(false)],
    }
    expect(() => importReviewerResultAtomic(uncalibratedLedger, result, [packet])).toThrow(/calibration/i)
  })

  it('reports duplicate identities, illegal limitations, and insufficient role separation', () => {
    const majorLimitation: FindingResolution = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: finding.id,
      disposition: 'accepted-limitation',
      rationale: 'Leave this unresolved.',
      resolvedBy: reviewer.id,
      resolvedAt: '2026-07-28T13:00:00.000Z',
      upstreamChangeRefs: [],
    }
    const selfVerification: FindingVerification = {
      schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
      findingId: finding.id,
      outcome: 'verified',
      rationale: 'Self-verified.',
      verifierId: reviewer.id,
      verifiedAt: '2026-07-28T14:00:00.000Z',
      packetId: packet.id,
      packetChecksum: packet.packetChecksum,
    }
    const ledger: ReviewLedger = {
      ...emptyLedger(),
      results: [result, result],
      findings: [finding, finding],
      resolutions: [majorLimitation],
      verifications: [selfVerification],
    }

    expect(validateReviewLedger(ledger, [packet]).map(issue => issue.code)).toEqual(
      expect.arrayContaining([
        'duplicate-result',
        'duplicate-finding',
        'material-accepted-limitation',
        'insufficient-role-separation',
      ])
    )
  })
})
