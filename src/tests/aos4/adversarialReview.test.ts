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
    field: 'abilityTextOverrides' | 'timingOverrides' | 'warscrollKeywordOverrides'
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
