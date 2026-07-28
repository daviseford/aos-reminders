import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  assessAdversarialComparison,
  createAdversarialPairResults,
  createReviewAssignment,
  createReviewPacket,
  type ReviewPacketPair,
  type ReviewerMetadata,
} from '../../aos4/review'
import type { SourceRecordId } from '../../aos4/domain'

const SOURCE_ID =
  'source-record:games-workshop:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%3Apage%3A1' as SourceRecordId
const RECORD_CHECKSUM = 'b'.repeat(64)
const EXCERPT_REF = `review-evidence:sha256:${'c'.repeat(64)}`

const pair = (baseSizes = ['25mm'], officialBaseSizes = ['25mm']): ReviewPacketPair => {
  const structuredValue = {
    applicationStatus: 'effective',
    disposition: 'applied-to-runtime',
    fact: {
      kind: 'unit',
      name: 'Fixture Unit',
      points: 100,
      unitSize: 1,
      baseSizes: officialBaseSizes,
      regimentOptions: ['Any Fixture'],
      notes: [],
    },
  }
  const sourceEvidence = [
    {
      sourceRecordId: SOURCE_ID,
      recordChecksum: RECORD_CHECKSUM,
      locator: { kind: 'page' as const, page: 1 },
      authority: 'official' as const,
      excerptRef: EXCERPT_REF,
      structuredValue,
    },
  ]
  const blindPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['official-fact'],
    sourceEvidence: sourceEvidence.map(({ structuredValue: _structuredValue, ...value }) => value),
    generatedDestinations: [],
    rulesContextIds: [],
    blind: true,
  })
  const comparisonPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['official-fact'],
    sourceEvidence,
    generatedDestinations: [
      {
        path: 'data/aos4/catalog/official-battle-profiles.json',
        field: 'record',
        value: {
          status: 'effective',
          disposition: 'applied-to-runtime',
          fact: structuredValue.fact,
        },
      },
      {
        path: 'data/aos4/catalog/catalog.json',
        field: 'entity',
        value: {
          kind: 'battle-profile',
          name: 'Fixture Unit battle profile',
          points: 100,
          unitSize: 1,
          baseSizes,
          regimentOptions: ['Any Fixture'],
          notes: [],
        },
      },
    ],
    rulesContextIds: [],
    blind: false,
  })
  return {
    pairKey: 'review-pair:fixture',
    candidateKey: 'official-record:fixture',
    category: 'official-record',
    factionIds: [],
    calibration: false,
    countsTowardCoverage: true,
    blindDerivationRequired: true,
    blindPacket,
    comparisonPacket,
    evidence: [
      {
        ref: EXCERPT_REF,
        trust: 'untrusted-source-data',
        beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---',
        content: 'Fixture Unit 1 100 Any Fixture 25mm',
        endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
      },
    ],
  }
}

const reviewer: ReviewerMetadata = {
  id: 'fixture-reviewer',
  kind: 'agent',
  tool: 'fixture',
  model: 'fixture',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: 'aos4-review-prompt/v1',
}

describe('AoS 4 deterministic adversarial reviewer', () => {
  it('passes an exact official fact application', () => {
    expect(assessAdversarialComparison(pair())).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('creates an evidence-bound material finding for a changed official field', () => {
    const assessment = assessAdversarialComparison(pair(['40mm']))

    expect(assessment).toMatchObject({
      outcome: 'finding',
      findings: [
        {
          severity: 'major',
          subject: { field: 'official.baseSizes', sourceRecordId: SOURCE_ID },
          expectedValue: ['25mm'],
          actualValue: ['40mm'],
          evidence: [{ sourceRecordId: SOURCE_ID, recordChecksum: RECORD_CHECKSUM }],
        },
      ],
    })
  })

  it('rejects a generated official value that the source-only excerpt does not support', () => {
    const assessment = assessAdversarialComparison(pair(['40mm'], ['40mm']))

    expect(assessment).toMatchObject({
      outcome: 'finding',
      findings: [
        {
          severity: 'major',
          subject: { field: 'official.source-baseSizes', sourceRecordId: SOURCE_ID },
          expectedValue: '40mm',
        },
      ],
    })
  })

  it('records blind interpretation before the generated comparison', () => {
    const reviewPair = pair()
    const assignment = createReviewAssignment({
      packetIds: [reviewPair.blindPacket.id, reviewPair.comparisonPacket.id],
      reviewer,
      execution: 'local',
      assignedAt: '2026-07-28T16:00:00.000Z',
    })
    const [blind, comparison] = createAdversarialPairResults(
      reviewPair,
      assignment.id,
      reviewer,
      '2026-07-28T16:02:00.000Z',
      '2026-07-28T16:03:00.000Z'
    )

    expect(blind).toMatchObject({
      packetId: reviewPair.blindPacket.id,
      outcome: 'pass',
      blindExpectedInterpretation: {
        category: 'official-record',
        evidence: [{ sourceRecordId: SOURCE_ID }],
      },
    })
    expect(new Date(blind.reviewedAt).valueOf()).toBeLessThan(new Date(comparison.reviewedAt).valueOf())
  })
})
