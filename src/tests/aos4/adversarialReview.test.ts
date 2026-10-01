import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  assessAdversarialComparison,
  assertAgentBlindDerivations,
  createAdversarialComparisonResult,
  createAdversarialPairResults,
  emptyReviewLedger,
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
const OFFICIAL_EXCERPT_REF = `review-evidence:sha256:${'d'.repeat(64)}`
const SECONDARY_SOURCE_ID =
  'source-record:wahapedia:html%3Ahttps%3A%2F%2Fwahapedia.ru%2Faos4%2Ffactions%2Ffixture%2Fwarscrolls.html%23fixture' as SourceRecordId

const pair = (
  baseSizes = ['25mm'],
  officialBaseSizes = ['25mm'],
  notes: string[] = [],
  officialNotes: string[] = []
): ReviewPacketPair => {
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
      notes: officialNotes,
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
    sourceEvidence: sourceEvidence.map(({ structuredValue, ...value }) => {
      void structuredValue
      return value
    }),
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
          notes,
        },
      },
    ],
    rulesContextIds: [],
    blind: false,
  })
  return {
    pairKey: 'review-pair:fixture',
    samplingMetadataChecksum: RECORD_CHECKSUM,
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
        content: `Fixture Unit 1 100 Any Fixture 25mm ${officialNotes.join(' ')}`,
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

const secondaryPair = (
  recordKind: string,
  structuredValue: Record<string, unknown>,
  entity: Record<string, unknown> | Record<string, unknown>[],
  cohortIds: string[] = [],
  officialOverride?: {
    field:
      'abilityTextOverrides' | 'timingOverrides' | 'warscrollKeywordOverrides' | 'abilityKeywordOverrides'
    value: Record<string, unknown>
    excerpt: string
  }
): ReviewPacketPair => {
  const sourceEvidence = [
    {
      sourceRecordId: SECONDARY_SOURCE_ID,
      recordChecksum: RECORD_CHECKSUM,
      locator: { kind: 'section' as const, section: 'fixture' },
      authority: 'secondary' as const,
      excerptRef: EXCERPT_REF,
      structuredValue,
    },
    ...(officialOverride
      ? [
          {
            sourceRecordId: SOURCE_ID,
            recordChecksum: 'e'.repeat(64),
            locator: { kind: 'page' as const, page: 1 },
            authority: 'official' as const,
            excerptRef: OFFICIAL_EXCERPT_REF,
            structuredValue: {
              recordKind: 'official-override-evidence',
              reviewedChecksum: 'e'.repeat(64),
            },
          },
        ]
      : []),
  ]
  const blindPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['secondary-semantic', `source-kind:${recordKind}`, ...cohortIds],
    sourceEvidence: sourceEvidence.map(({ structuredValue, ...value }) => {
      void structuredValue
      return value
    }),
    generatedDestinations: [],
    rulesContextIds: [],
    blind: true,
  })
  const comparisonPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['secondary-semantic', `source-kind:${recordKind}`, ...cohortIds],
    sourceEvidence,
    generatedDestinations: [
      {
        path: 'data/aos4/catalog/catalog.json',
        field: 'sourceRecords',
        value: {
          id: SECONDARY_SOURCE_ID,
          recordChecksum: RECORD_CHECKSUM,
          locator: { kind: 'section', section: 'fixture' },
        },
      },
      ...(Array.isArray(entity) ? entity : [entity]).map(value => ({
        path: 'data/aos4/catalog/catalog.json',
        field: 'entity',
        value,
      })),
      ...(officialOverride
        ? [
            {
              path: 'data/aos4/reviews/custom-review.json',
              field: officialOverride.field,
              value: officialOverride.value,
            },
          ]
        : []),
    ],
    rulesContextIds: [],
    blind: false,
  })
  return {
    pairKey: 'review-pair:secondary-fixture',
    samplingMetadataChecksum: RECORD_CHECKSUM,
    candidateKey: `source-record:${SECONDARY_SOURCE_ID}`,
    category: 'source-record',
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
        content: JSON.stringify({ recordKind, value: structuredValue }),
        endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
      },
      ...(officialOverride
        ? [
            {
              ref: OFFICIAL_EXCERPT_REF,
              trust: 'untrusted-source-data' as const,
              beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---' as const,
              content: officialOverride.excerpt,
              endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---' as const,
            },
          ]
        : []),
    ],
  }
}

const secondaryAbilityCostPair = (
  sourceCost: { pointsType?: unknown; points?: unknown },
  generatedCost?: unknown
): ReviewPacketPair =>
  secondaryPair(
    'warscroll-ability',
    {
      name: 'COSTED ABILITY',
      conditionHtml: 'Your Hero Phase',
      descriptionHtml: '<b>Effect:</b> Resolve this ability.',
      keywordsHtml: '',
      isReaction: false,
      ...sourceCost,
    },
    {
      kind: 'ability',
      name: 'COSTED ABILITY',
      abilityKind: 'active',
      keywords: [],
      text: { effect: 'Resolve this ability.' },
      timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      ...(generatedCost === undefined ? {} : { cost: generatedCost }),
    }
  )

describe('AoS 4 deterministic adversarial reviewer', () => {
  it('passes an exact official fact application', () => {
    expect(assessAdversarialComparison(pair())).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('never uses concealed calibration labels as reviewer evidence', () => {
    const reviewPair = pair()

    expect(
      assessAdversarialComparison({
        ...reviewPair,
        calibrationKind: 'insufficient-evidence',
      })
    ).toEqual(assessAdversarialComparison(reviewPair))
  })

  it('allows secondary notes in addition to every official note', () => {
    expect(
      assessAdversarialComparison(
        pair(['25mm'], ['25mm'], ['Official note.', 'This unit cannot be reinforced.'], ['Official note.'])
      )
    ).toMatchObject({
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
    const ledger = {
      ...emptyReviewLedger(),
      assignments: [assignment],
      results: [blind],
    }
    expect(() => assertAgentBlindDerivations(ledger, [reviewPair])).not.toThrow()
    expect(() =>
      assertAgentBlindDerivations(
        {
          ...ledger,
          results: [
            {
              ...blind,
              blindExpectedInterpretation: { fabricated: 'placeholder' },
            },
          ],
        },
        [reviewPair]
      )
    ).toThrow('does not match source evidence')
    expect(
      createAdversarialComparisonResult(
        {
          ...reviewPair,
          blindDerivationRequired: true,
        },
        {
          ...blind,
          blindExpectedInterpretation: { fabricated: 'placeholder' },
        },
        assignment.id,
        reviewer,
        '2026-07-28T16:04:00.000Z'
      )
    ).toMatchObject({
      outcome: 'cannot-verify',
      rationale: 'A valid saved blind interpretation was not available before comparison.',
    })
  })

  it('independently grounds secondary ability semantics in the source-only record', () => {
    const reviewPair = secondaryPair(
      'warscroll-ability',
      {
        name: 'ARCANE STRIKE',
        conditionHtml: '<img class="abLogo" src="/icon.png">Once Per Turn (Army), Your Hero Phase',
        descriptionHtml: '<b>Declare:</b> Pick an enemy unit.<br><b>Effect:</b> Inflict D3 mortal damage.',
        keywordsHtml: 'SPELL',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: ['SPELL'],
        text: {
          declare: 'Pick an enemy unit.',
          effect: 'Inflict D3 mortal damage.',
        },
        timings: [
          {
            kind: 'active',
            raw: 'Once Per Turn (Army), Your Hero Phase',
          },
        ],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  describe('secondary ability cost fidelity', () => {
    it.each([
      ['Command Points', '1', { kind: 'command-points', value: 1 }],
      ['Spell Casting Value', '7', { kind: 'spell', value: 7 }],
      ['Prayer', '4', { kind: 'prayer', value: 4 }],
    ])('accepts %s %s cost evidence that matches the generated cost', (pointsType, points, cost) => {
      expect(
        assessAdversarialComparison(secondaryAbilityCostPair({ pointsType, points }, cost))
      ).toMatchObject({
        outcome: 'pass',
        findings: [],
      })
    })

    it.each([
      ['absent', {}],
      ['blank', { pointsType: ' ', points: '\t' }],
    ])('does not assert cost absence when source fields are %s', (_label, sourceCost) => {
      expect(
        assessAdversarialComparison(
          secondaryAbilityCostPair(sourceCost, { kind: 'command-points', value: 1 })
        )
      ).toMatchObject({ outcome: 'pass', findings: [] })
    })

    it.each([
      ['partial points', { pointsType: 'Command', points: '' }],
      ['partial type', { pointsType: '', points: '1' }],
      ['zero', { pointsType: 'Command', points: '0' }],
      ['non-integer', { pointsType: 'Command', points: '1.5' }],
      ['unrecognized type', { pointsType: 'Faction Resource', points: '1' }],
    ])('rejects %s source cost evidence', (_label, sourceCost) => {
      const assessment = assessAdversarialComparison(secondaryAbilityCostPair(sourceCost))

      expect(assessment).toMatchObject({
        outcome: 'finding',
        findings: [
          {
            severity: 'major',
            subject: {
              field: 'secondary.source-ability-cost',
              sourceRecordId: SECONDARY_SOURCE_ID,
            },
            expectedValue: sourceCost,
          },
        ],
      })
    })

    it.each([
      ['missing', undefined],
      ['non-record', '1 CP'],
    ])('rejects a %s generated cost for valid source evidence', (_label, cost) => {
      const assessment = assessAdversarialComparison(
        secondaryAbilityCostPair({ pointsType: 'Command', points: '1' }, cost)
      )

      expect(assessment).toMatchObject({
        outcome: 'finding',
        findings: [
          {
            subject: { field: 'secondary.source-ability-cost' },
            expectedValue: { kind: 'command-points', value: 1 },
            ...(cost === undefined ? {} : { actualValue: cost }),
          },
        ],
      })
    })

    it.each([
      ['kind mismatch', { kind: 'spell', value: 1 }],
      ['value mismatch', { kind: 'command-points', value: 2 }],
    ])('rejects a generated cost with a %s', (_label, cost) => {
      const assessment = assessAdversarialComparison(
        secondaryAbilityCostPair({ pointsType: 'Command', points: '1' }, cost)
      )

      expect(assessment).toMatchObject({
        outcome: 'finding',
        findings: [
          {
            subject: { field: 'secondary.source-ability-cost' },
            expectedValue: { kind: 'command-points', value: 1 },
            actualValue: cost,
          },
        ],
      })
    })
  })

  it('finds secondary generated text that is unsupported by the source-only record', () => {
    const reviewPair = secondaryPair(
      'faction-ability',
      {
        name: 'ARCANE STRIKE',
        conditionHtml: 'Your Hero Phase',
        descriptionHtml: '<b>Effect:</b> Inflict D3 mortal damage.',
        keywordsHtml: '',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: [],
        text: { effect: 'Heal D3 damage.' },
        timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'finding',
      findings: [
        {
          severity: 'major',
          subject: {
            field: 'secondary.source-ability-text.effect',
            sourceRecordId: SECONDARY_SOURCE_ID,
          },
          actualValue: 'Heal D3 damage.',
        },
      ],
    })
  })

  it('rejects reordered source sentences and short cross-word keyword matches', () => {
    const reviewPair = secondaryPair(
      'faction-ability',
      {
        name: 'ARCANE STRIKE',
        conditionHtml: 'Your Hero Phase',
        descriptionHtml: '<b>Effect:</b> First sentence. Second sentence. Move towards the enemy.',
        keywordsHtml: '',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: ['WARD'],
        text: { effect: 'Second sentence. First sentence.' },
        timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'secondary.source-ability-text.effect' }),
        }),
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'secondary.source-ability-keywords[0]' }),
        }),
      ]),
    })
  })

  it('accepts a secondary ability correction only when the reviewed official evidence supports it', () => {
    const source = {
      name: 'ARCANE STRIKE',
      conditionHtml: 'Your Hero Phase',
      descriptionHtml: '<b>Effect:</b> Inflict D3 mortal damage.',
      keywordsHtml: '',
      isReaction: false,
    }
    const correctedText = { effect: 'Inflict D6 mortal damage.' }
    const reviewPair = secondaryPair(
      'faction-ability',
      source,
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: [],
        text: correctedText,
        timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'abilityTextOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          text: correctedText,
          reason: 'Official errata changes the damage.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt: 'Change Arcane Strike to: Effect: Inflict D6 mortal damage.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('grounds a mixed-source correction sentence by sentence despite fragmented PDF text', () => {
    const source = {
      name: 'DEPLOY REGIMENT',
      conditionHtml: 'Deployment Phase',
      descriptionHtml: '<b>Effect:</b> Keep deploying this regiment. You cannot pick other units as targets.',
      keywordsHtml: '',
      isReaction: false,
    }
    const correctedText = {
      effect:
        'Keep deploying this regiment. You cannot set up other units as part of those DEPLOY abilities.',
    }
    const reviewPair = secondaryPair(
      'general-rule-ability',
      source,
      {
        kind: 'ability',
        name: 'DEPLOY REGIMENT',
        abilityKind: 'active',
        keywords: [],
        text: correctedText,
        timings: [{ kind: 'active', raw: 'Deployment Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'abilityTextOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          text: correctedText,
          reason: 'Official errata replaces the final sentence.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt:
          'Change the final sentence to: You cannot set up other units as part of those Deploy abi lities.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('rejects an ability correction when the cited official page contributes no corrected text', () => {
    const source = {
      name: 'ARCANE STRIKE',
      conditionHtml: 'Your Hero Phase',
      descriptionHtml: '<b>Effect:</b> Inflict D3 mortal damage.',
      keywordsHtml: '',
      isReaction: false,
    }
    const unchangedText = { effect: 'Inflict D3 mortal damage.' }
    const reviewPair = secondaryPair(
      'faction-ability',
      source,
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: [],
        text: unchangedText,
        timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'abilityTextOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          text: unchangedText,
          reason: 'Official errata claims to replace the effect.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt: 'This page contains an unrelated correction.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-text.evidence' }),
        }),
      ]),
    })
  })

  it('requires official text to support an overridden timing and ability kind', () => {
    const reviewPair = secondaryPair(
      'faction-ability',
      {
        name: 'ARCANE STRIKE',
        conditionHtml: 'Passive',
        descriptionHtml: '<b>Effect:</b> Inflict D3 mortal damage.',
        keywordsHtml: '',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'ARCANE STRIKE',
        abilityKind: 'active',
        keywords: [],
        text: { effect: 'Inflict D3 mortal damage.' },
        timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'timingOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          abilityKind: 'active',
          timings: [{ kind: 'active', raw: 'Your Hero Phase' }],
          reason: 'Official errata claims to replace the timing.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt: 'This page contains an unrelated correction.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({
            field: 'secondary.source-official-override.ability-timing[0]',
          }),
        }),
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-kind.evidence' }),
        }),
      ]),
    })
  })

  it('accepts an officially supported warscroll keyword removal', () => {
    const reviewPair = secondaryPair(
      'warscroll-keyword',
      {
        warscrollId: 'fixture-warscroll',
        keyword: 'HERO',
        parameter: '',
      },
      {
        kind: 'warscroll',
        name: 'Thyrielle, Matriarch of the Aelven Sea',
        keywords: ['ORDER', 'AELF'],
      },
      ['high-risk:official-override'],
      {
        field: 'warscrollKeywordOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          remove: ['HERO'],
          reason: 'Official errata removes the keyword.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt: 'Thyrielle, Matriarch of the Aelven Sea no longer has the Hero keyword.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  const keywordAddPair = (excerpt: string, keywords = ['DESTRUCTIVE IMPULSE', 'RAMPAGE']) =>
    secondaryPair(
      'faction-ability',
      {
        name: 'WRATH OF BRODD',
        conditionHtml: 'Once Per Turn (Army), Any Combat Phase',
        descriptionHtml:
          '<b>Declare:</b> Pick a friendly BIG unit that has not used a DESTRUCTIVE IMPULSE ability this turn to use this ability.',
        keywordsHtml: 'DESTRUCTIVE IMPULSE',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'WRATH OF BRODD',
        abilityKind: 'active',
        keywords,
        text: {
          declare:
            'Pick a friendly BIG unit that has not used a DESTRUCTIVE IMPULSE ability this turn to use this ability.',
        },
        timings: [{ kind: 'active', raw: 'Once Per Turn (Army), Any Combat Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'abilityKeywordOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          add: ['RAMPAGE'],
          reason: 'The official page prints the keyword.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt,
      }
    )

  it('accepts an ability keyword the official Keywords strip prints and the page omits', () => {
    expect(
      assessAdversarialComparison(
        keywordAddPair('WRATH OF BRODD: ... in combat. Keywords Rampage, Destructive Impulse')
      )
    ).toMatchObject({ outcome: 'pass', findings: [] })
  })

  it('rejects an added ability keyword the official evidence mentions only in prose', () => {
    expect(
      assessAdversarialComparison(
        keywordAddPair(
          'Pick a unit that has not used a Rampage ability this turn. Keywords Destructive Impulse'
        )
      )
    ).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-keyword.evidence' }),
        }),
      ]),
    })
    expect(
      assessAdversarialComparison(
        keywordAddPair('Keywords Rampage, Destructive Impulse', ['DESTRUCTIVE IMPULSE'])
      )
    ).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-keyword.destination' }),
        }),
      ]),
    })
  })

  const keywordRemovePair = (excerpt: string, keywords: string[] = []) =>
    secondaryPair(
      'warscroll-ability',
      {
        name: 'FRENZIED SURGE',
        conditionHtml: 'Once Per Turn (Army), Any Charge Phase',
        descriptionHtml: '<b>Effect:</b> This unit can move up to X", where X is your fury level.',
        keywordsHtml: 'RAMPAGE',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'FRENZIED SURGE',
        abilityKind: 'active',
        keywords,
        text: { effect: 'This unit can move up to X", where X is your fury level.' },
        timings: [{ kind: 'active', raw: 'Once Per Turn (Army), Any Charge Phase' }],
      },
      ['high-risk:official-override'],
      {
        field: 'abilityKeywordOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          remove: ['RAMPAGE'],
          reason: 'The official rewrite prints no Keywords strip.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt,
      }
    )

  it('accepts a keyword removal when the official rewrite reprints the ability without it', () => {
    // September 2026 Rules Updates page 33: the whole ability is reprinted with no Keywords strip,
    // and the next erratum (which may carry its own strip) is not part of the rewrite.
    expect(
      assessAdversarialComparison(
        keywordRemovePair(
          'Change ‘Frenzied Surge’ to: FRENZIED SURGE: As the Vengorian Lord tears through the press of combat. ' +
            'Effect: This unit can move up to X", where X is your fury level. Once Per Turn (Army), Any Charge Phase ' +
            'NEW FYRESLAYERS, PRAYER LORE Change the declare step of ‘Blazing Impetus’ to: Keywords Rampage'
        )
      )
    ).toMatchObject({ outcome: 'pass', findings: [] })
  })

  it('rejects a keyword removal the official reprint contradicts or never makes', () => {
    const evidenceFinding = {
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-keyword.evidence' }),
        }),
      ]),
    }
    // The reprint still prints the keyword.
    expect(
      assessAdversarialComparison(
        keywordRemovePair('FRENZIED SURGE: Effect: This unit can move up to X". Keywords Rampage')
      )
    ).toMatchObject(evidenceFinding)
    // The evidence names the ability but never reprints it under its heading.
    expect(
      assessAdversarialComparison(
        keywordRemovePair('Change the timing of ‘Frenzied Surge’ to Any Charge Phase.')
      )
    ).toMatchObject(evidenceFinding)
    // The generated ability still carries the removed keyword.
    expect(
      assessAdversarialComparison(
        keywordRemovePair('FRENZIED SURGE: Effect: This unit can move up to X".', ['RAMPAGE'])
      )
    ).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({ field: 'official-override.ability-keyword.destination' }),
        }),
      ]),
    })
  })

  it('rejects keyword-removal evidence assembled from unrelated words', () => {
    const reviewPair = secondaryPair(
      'warscroll-keyword',
      {
        warscrollId: 'fixture-warscroll',
        keyword: 'WARD',
        parameter: '',
      },
      {
        kind: 'warscroll',
        name: 'Fixture Unit',
        keywords: ['ORDER'],
      },
      ['high-risk:official-override'],
      {
        field: 'warscrollKeywordOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          remove: ['WARD'],
          reason: 'Official errata removes the keyword.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt: 'Remove a marker. Then move toward the objective.',
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'finding',
      findings: expect.arrayContaining([
        expect.objectContaining({
          subject: expect.objectContaining({
            field: 'official-override.warscroll-keyword.evidence',
          }),
        }),
      ]),
    })
  })

  it('checks secondary weapon characteristics and normalized keyword text', () => {
    const reviewPair = secondaryPair(
      'warscroll-weapon',
      {
        name: 'Spider God Staff',
        weaponType: 'MELEE',
        range: '',
        attacks: '3',
        hit: '4+',
        wound: '5+',
        rend: '-',
        damage: 'D3',
        abilitiesHtml: '<span>Crit</span> <span>(Mortal)</span>',
      },
      {
        kind: 'weapon',
        name: 'Spider God Staff',
        weaponType: 'melee',
        profile: {
          attacks: '3',
          hit: '4+',
          wound: '5+',
          rend: '-',
          damage: 'D3',
        },
        keywords: [{ kind: 'crit-mortal', raw: 'Crit (Mortal)' }],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('accepts reviewed source typo corrections and ignores labels between grounded effect text', () => {
    const reviewPair = secondaryPair(
      'faction-ability',
      {
        name: 'SETTLE EVERY GRUDGE!',
        conditionHtml: 'Once Per Turn (Army), Any Comhat Phase',
        descriptionHtml:
          '<b>Effect:</b> Pick a friendly unit.<br><b>Effect:</b> Add 1 to its Attacks characteristic.',
        keywordsHtml: '',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'SETTLE EVERY GRUDGE!',
        abilityKind: 'active',
        keywords: [],
        text: {
          effect: 'Pick a friendly unit.\nAdd 1 to its Attacks characteristic.',
        },
        timings: [
          {
            kind: 'active',
            raw: 'Once Per Turn (Army), Any Combat Phase',
          },
        ],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('does not invent an active classification when the source has no textual timing', () => {
    const reviewPair = secondaryPair(
      'warscroll-ability',
      {
        name: 'MULTIPLE PARTS',
        conditionHtml: '<img src="/aos4/img/abSpecial.png">',
        descriptionHtml: '<b>Effect:</b> Remove all parts when this manifestation is destroyed.',
        keywordsHtml: '',
        isReaction: false,
      },
      {
        kind: 'ability',
        name: 'MULTIPLE PARTS',
        abilityKind: 'passive',
        keywords: [],
        text: { effect: 'Remove all parts when this manifestation is destroyed.' },
        timings: [{ kind: 'passive', raw: 'Passive' }],
      }
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('compares regiment options as an unordered source set', () => {
    const reviewPair = secondaryPair(
      'warscroll',
      {
        name: 'Fixture Hero',
        move: '5"',
        save: '3+',
        control: '2',
        health: '7',
        ward: '',
        cost: '140',
        unitSize: '1',
        regimentOptions: 'Any BLOODBOUND, 0-1 Warmonger',
        noReinforced: false,
      },
      [
        {
          kind: 'warscroll',
          name: 'Fixture Hero',
          characteristics: {
            move: '5"',
            save: '3+',
            control: '2',
            health: '7',
          },
        },
        {
          kind: 'battle-profile',
          points: 140,
          unitSize: 1,
          regimentOptions: ['0-1 Warmonger', 'Any BLOODBOUND'],
          notes: [],
        },
      ]
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })

  it('defers officially overridden weapon characteristics to the official packet', () => {
    const reviewPair = secondaryPair(
      'warscroll-weapon',
      {
        name: 'Stabba',
        weaponType: 'MELEE',
        attacks: '2',
        hit: '4',
        wound: '4',
        rend: '1',
        damage: '1',
        abilitiesHtml: '',
      },
      {
        kind: 'weapon',
        name: 'Stabba',
        weaponType: 'melee',
        profile: {
          attacks: '2',
          hit: '4+',
          wound: '4+',
          rend: '1',
          damage: '1',
        },
        keywords: [],
      },
      ['high-risk:official-override']
    )

    expect(assessAdversarialComparison(reviewPair)).toMatchObject({
      outcome: 'pass',
      findings: [],
    })
  })
})

describe('official ability overrides the September 2026 errata need (#2060)', () => {
  const abilityPair = (
    source: {
      name: string
      conditionHtml: string
      descriptionHtml: string
      pointsType?: string
      points?: string
    },
    generated: Record<string, unknown>,
    override: Record<string, unknown>,
    excerpt: string
  ) =>
    secondaryPair(
      'warscroll-ability',
      { keywordsHtml: '', isReaction: false, ...source },
      {
        kind: 'ability',
        abilityKind: 'active',
        keywords: [],
        timings: [{ kind: 'active', raw: source.conditionHtml }],
        ...generated,
      },
      ['high-risk:official-override'],
      {
        field: 'abilityTextOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          reason: 'Official errata.',
          officialSourceRecordIds: [SOURCE_ID],
          ...override,
        },
        excerpt,
      }
    )
  const fieldsOf = (reviewPair: ReviewPacketPair) =>
    assessAdversarialComparison(reviewPair).findings.map(finding => finding.subject.field)

  const ashClouds = {
    name: 'ROLLING ASH-CLOUDS',
    conditionHtml: 'Passive',
    descriptionHtml:
      '<b>Effect:</b> Units and MANIFESTATIONS cannot be set up in neutral territory. Models and MANIFESTATIONS are not visible.',
  }
  const editedAshClouds = {
    effect:
      'Units, terrain features and MANIFESTATIONS cannot be set up in neutral territory. Models, terrain features and MANIFESTATIONS are not visible.',
  }
  const ashCloudsErratum =
    "In the effect of 'Rolling Ash-clouds', in all bullet points change ' and Manifestations ' to ', terrain features and Manifestations '."
  const passive = { abilityKind: 'passive', timings: [{ kind: 'passive', raw: 'Passive' }] }

  it('accepts a phrase edited inside secondary text when the official page prints every new word', () => {
    const reviewPair = abilityPair(
      ashClouds,
      { name: 'ROLLING ASH-CLOUDS', text: editedAshClouds, ...passive },
      { text: editedAshClouds },
      ashCloudsErratum
    )
    expect(fieldsOf(reviewPair)).toEqual([])
  })

  it('rejects a phrase edit whose new words the official page does not print', () => {
    const invented = { effect: editedAshClouds.effect.replaceAll('terrain features', 'endless spells') }
    const reviewPair = abilityPair(
      ashClouds,
      { name: 'ROLLING ASH-CLOUDS', text: invented, ...passive },
      { text: invented },
      ashCloudsErratum
    )
    expect(fieldsOf(reviewPair)).toEqual(expect.arrayContaining(['official-override.ability-text.evidence']))
  })

  it('rejects a short insertion the official page prints only away from the edited phrase', () => {
    // The page prints "not" and "friendly", but not beside the words the override changes.
    const excerpt = `${ashCloudsErratum} Friendly units that are not visible cannot be picked.`
    ;[
      editedAshClouds.effect.replace('cannot be set up', 'can not be set up in friendly or'),
      editedAshClouds.effect.replace('are not visible', 'are not visible to friendly units'),
    ].forEach(effect => {
      const reviewPair = abilityPair(
        ashClouds,
        { name: 'ROLLING ASH-CLOUDS', text: { effect }, ...passive },
        { text: { effect } },
        excerpt
      )
      expect(fieldsOf(reviewPair)).toEqual(
        expect.arrayContaining(['secondary.source-official-override.ability-text.effect'])
      )
    })
  })

  describe('a changed distance must be the one the erratum prints', () => {
    const shyishReaper = {
      name: 'SUMMON SHYISH REAPER',
      conditionHtml: 'Your Hero Phase',
      descriptionHtml:
        '<b>Effect:</b> Set up a Shyish Reaper wholly within 9" of the caster, visible to them and more than 9" from all enemy units.',
    }
    // Page 58 also prints other distances and rolls after the Shyish Reaper erratum.
    const page58 =
      "MANIFESTATION LORE Change the effect of 'Summon Shyish Reaper' to: 'Set up a Shyish Reaper wholly within 12\" of and visible to the caster and more than 9\" from all enemy units.' LORD VITRIOLIC Declare: Pick an enemy unit within 10\" of this unit to be the target. Effect: On a 3+, apply 1 of the following effects."
    const withDistance = (distance: string) => ({
      effect: `Set up a Shyish Reaper wholly within ${distance}" of and visible to the caster and more than 9" from all enemy units.`,
    })
    const pairFor = (distance: string) =>
      abilityPair(
        shyishReaper,
        { name: 'SUMMON SHYISH REAPER', text: withDistance(distance) },
        { text: withDistance(distance) },
        page58
      )

    it('accepts the printed 12"', () => {
      expect(fieldsOf(pairFor('12'))).toEqual([])
    })

    it.each(['3', '10'])('rejects %s", which the page prints only elsewhere', distance => {
      expect(fieldsOf(pairFor(distance))).toEqual(
        expect.arrayContaining(['secondary.source-official-override.ability-text.effect'])
      )
    })
  })

  const lightningMaster = {
    name: 'LIGHTNING MASTER',
    conditionHtml: 'Your Shooting Phase',
    descriptionHtml:
      '<b>Effect:</b> Roll a dice. On a 2+, set the Attacks characteristic of the target’s Warpvolt Scourgers to 10 for the rest of the turn.',
  }
  const withoutRoll = {
    effect:
      'Set the Attacks characteristic of the target’s Warpvolt Scourgers to 10 for the rest of the turn.',
  }

  it('accepts a deletion-only correction when the official page prints the resulting text whole', () => {
    const reviewPair = abilityPair(
      lightningMaster,
      { name: 'LIGHTNING MASTER', text: withoutRoll },
      { text: withoutRoll },
      "WARLOCK GALVANEER Change the effect of 'Lightning Master' to: 'Set the Attacks characteristic of the target’s Warpvolt Scourgers to 10 for the rest of the turn.'"
    )
    expect(fieldsOf(reviewPair)).toEqual([])
  })

  it('accepts a deletion beside an untouched declare step, but not beside an unprinted declare change', () => {
    const withDeclare = {
      ...lightningMaster,
      descriptionHtml: `<b>Declare:</b> Pick a friendly Warpvolt Scourgers unit to be the target. ${lightningMaster.descriptionHtml}`,
    }
    const erratum =
      "WARLOCK GALVANEER Change the effect of 'Lightning Master' to: 'Set the Attacks characteristic of the target’s Warpvolt Scourgers to 10 for the rest of the turn.'"
    const kept = { declare: 'Pick a friendly Warpvolt Scourgers unit to be the target.', ...withoutRoll }
    expect(
      fieldsOf(abilityPair(withDeclare, { name: 'LIGHTNING MASTER', text: kept }, { text: kept }, erratum))
    ).toEqual([])
    const trimmed = { declare: 'Pick a friendly unit to be the target.', ...withoutRoll }
    expect(
      fieldsOf(
        abilityPair(withDeclare, { name: 'LIGHTNING MASTER', text: trimmed }, { text: trimmed }, erratum)
      )
    ).toEqual(expect.arrayContaining(['official-override.ability-text.evidence']))
  })

  it('rejects a deletion-only correction the official page never prints', () => {
    const reviewPair = abilityPair(
      lightningMaster,
      { name: 'LIGHTNING MASTER', text: withoutRoll },
      { text: withoutRoll },
      'WARLOCK GALVANEER Add Ward (6+) to the keywords bar.'
    )
    expect(fieldsOf(reviewPair)).toEqual(expect.arrayContaining(['official-override.ability-text.evidence']))
  })

  const feralRuin = {
    name: 'FERAL RUIN',
    conditionHtml: 'End of Your Turn',
    descriptionHtml: '<b>Effect:</b> Remove any PLEDGE TO CHAOS keywords the target has.',
  }
  const feralText = { effect: 'Remove any PLEDGE TO CHAOS keywords the target has.' }
  const renameErratum =
    "Change the Despoilers' 'Feral Ruin' ability to: YOU WILL SERVE!: A Daemon Prince is manifest proof."

  it('accepts a renamed ability when the official page prints the new name as an ability heading', () => {
    const reviewPair = abilityPair(
      feralRuin,
      { name: 'YOU WILL SERVE!', text: feralText },
      { name: 'YOU WILL SERVE!' },
      renameErratum
    )
    expect(fieldsOf(reviewPair)).toEqual([])
  })

  it('rejects a renamed ability the official page does not name, and a stale generated name', () => {
    expect(
      fieldsOf(
        abilityPair(
          feralRuin,
          { name: 'YOU WILL SERVE!', text: feralText },
          { name: 'YOU WILL SERVE!' },
          'You will serve the Dark Gods, the Despoilers declare.'
        )
      )
    ).toEqual(['official-override.ability-name.evidence'])
    expect(
      fieldsOf(
        abilityPair(
          feralRuin,
          { name: 'FERAL RUIN', text: feralText },
          { name: 'YOU WILL SERVE!' },
          renameErratum
        )
      )
    ).toEqual(['official-override.ability-name.destination'])
  })

  const cunning = {
    name: 'A REPUTATION FOR CUNNING',
    conditionHtml: 'Enemy Hero Phase',
    descriptionHtml: '<b>Effect:</b> Pick 2 units.',
    pointsType: 'command',
    points: '1',
  }
  const cunningErratum = "KRITTOK FOULBLADE Remove the command point cost from 'A Reputation for Cunning'."

  it('removes a command-point cost only when the official page instructs that removal', () => {
    const generated = { name: 'A REPUTATION FOR CUNNING', text: { effect: 'Pick 2 units.' } }
    expect(fieldsOf(abilityPair(cunning, generated, { cost: null }, cunningErratum))).toEqual([])
    expect(
      fieldsOf(
        abilityPair(
          cunning,
          generated,
          { cost: null },
          "KRITTOK FOULBLADE Remove the command point cost from 'Always Three Clawsteps Ahead'."
        )
      )
    ).toEqual(['official-override.ability-cost.evidence'])
    expect(
      fieldsOf(
        abilityPair(
          cunning,
          { ...generated, cost: { kind: 'command-points', value: 1 } },
          { cost: null },
          cunningErratum
        )
      )
    ).toEqual(['official-override.ability-cost.destination'])
  })

  it('adds a chanting value only when the official page prints that value for the ability', () => {
    const sacredRites = {
      name: 'SACRED RITES',
      conditionHtml: 'Your Hero Phase',
      descriptionHtml: '<b>Effect:</b> Give ritual points to the PRIEST.',
    }
    const generated = {
      name: 'SACRED RITES',
      text: { effect: 'Give ritual points to the PRIEST.' },
      cost: { kind: 'prayer', value: 2 },
    }
    const override = { cost: { kind: 'prayer', value: 2 } }
    expect(
      fieldsOf(
        abilityPair(
          sacredRites,
          generated,
          override,
          "Add a chanting value of 2 to the 'Sacred Rites' ability."
        )
      )
    ).toEqual([])
    expect(
      fieldsOf(
        abilityPair(
          sacredRites,
          generated,
          override,
          "Add a chanting value of 3 to the 'Sacred Rites' ability."
        )
      )
    ).toEqual(['official-override.ability-cost.evidence'])
  })

  const keywordAdd = (excerpt: string, keywords: string[]) =>
    secondaryPair(
      'warscroll',
      { name: 'Rotmire Creed', move: '5"', save: '6+', control: '1', health: '1', ward: '6+' },
      {
        kind: 'warscroll',
        name: 'Rotmire Creed',
        keywords,
        characteristics: { move: '5"', save: '6+', control: '1', health: '1', ward: '6+' },
      },
      ['high-risk:official-override'],
      {
        field: 'warscrollKeywordOverrides',
        value: {
          sourceRecordId: SECONDARY_SOURCE_ID,
          add: ['REINFORCEMENTS'],
          reason: 'Official errata adds the keyword.',
          officialSourceRecordIds: [SOURCE_ID],
        },
        excerpt,
      }
    )

  it('adds a warscroll keyword only when the official page instructs the addition', () => {
    const instruction =
      "SPEARHEAD, BUBONIC CELL Add the Reinforcements keyword to the Rotmire Creed's warscroll."
    expect(fieldsOf(keywordAdd(instruction, ['INFANTRY', 'REINFORCEMENTS', 'WARD (6+)']))).toEqual([])
    expect(fieldsOf(keywordAdd(instruction, ['INFANTRY', 'WARD (6+)']))).toEqual([
      'official-override.warscroll-keyword.add',
    ])
    expect(
      fieldsOf(
        keywordAdd('The Rotmire Creed can be taken as reinforcements in larger games.', [
          'INFANTRY',
          'REINFORCEMENTS',
          'WARD (6+)',
        ])
      )
    ).toEqual(['official-override.warscroll-keyword.evidence'])
  })
})
