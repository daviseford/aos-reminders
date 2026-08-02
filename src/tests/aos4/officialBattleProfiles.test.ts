import { sourceRecordId } from '../../aos4/domain'
import {
  createOfficialBattleProfileCatalog,
  type ReviewedOfficialBattleProfileFact,
} from '../../aos4/generate'

const unit = (
  key: string,
  name: string,
  factChecksum: string
): ReviewedOfficialBattleProfileFact['fact'] => ({
  kind: 'unit',
  key,
  page: 1,
  row: 1,
  faction: 'Stormcast Eternals',
  context: 'standard',
  name,
  unitSize: 1,
  points: 100,
  regimentOptions: [],
  relevantKeywords: [],
  notes: [],
  baseSizes: ['40mm'],
  sourceRecordId: sourceRecordId('games-workshop', `fixture:${key}`),
  factChecksum,
})

describe('official battle-profile catalog', () => {
  it('dispositions every extracted fact without inventing missing warscroll rules', () => {
    const reviewed: ReviewedOfficialBattleProfileFact[] = [
      {
        artifactChecksum: 'a'.repeat(64),
        documentTitle: 'Battle Profiles',
        status: 'effective',
        fact: unit('applied', 'Applied Unit', '1'.repeat(64)),
      },
      {
        artifactChecksum: 'a'.repeat(64),
        documentTitle: 'Battle Profiles',
        status: 'effective',
        fact: unit('profile-only', 'Profile-only Unit', '2'.repeat(64)),
      },
      {
        artifactChecksum: 'a'.repeat(64),
        documentTitle: 'Battle Profiles',
        status: 'effective',
        fact: {
          kind: 'roster-option',
          key: 'roster',
          page: 2,
          row: 1,
          faction: 'Stormcast Eternals',
          context: 'standard',
          optionType: 'Heroic Trait',
          name: 'Example Option',
          points: 20,
          notes: [],
          sourceRecordId: sourceRecordId('games-workshop', 'fixture:roster'),
          factChecksum: '3'.repeat(64),
        },
      },
      {
        artifactChecksum: 'b'.repeat(64),
        documentTitle: 'Superseded Profiles',
        status: 'superseded',
        fact: unit('superseded', 'Superseded Unit', '4'.repeat(64)),
      },
      // A regiment-of-renown row applies once its classified runtime content group exists
      // (issue #1858); one with no accepted rules source remains a structured reference.
      ...(
        [
          ['ror-applied', 'Lord Skaldior’s Chosen', '5'],
          ['ror-lagging', 'Urrgar’s Maulerguts', '6'],
        ] as const
      ).map(([key, name, checksumDigit]) => ({
        artifactChecksum: 'a'.repeat(64),
        documentTitle: 'Battle Profiles',
        status: 'effective' as const,
        fact: {
          kind: 'regiment-of-renown' as const,
          key,
          page: 61,
          row: 1,
          faction: 'Regiments of Renown' as const,
          context: 'standard' as const,
          name,
          points: 530,
          unitSummary: [],
          notes: [],
          sourceRecordId: sourceRecordId('games-workshop', `fixture:${key}`),
          factChecksum: checksumDigit.repeat(64),
        },
      })),
    ]

    const catalog = createOfficialBattleProfileCatalog(
      reviewed,
      {
        schemaVersion: 1,
        pages: 2,
        matchedOfficialUnitFacts: 1,
        unmatchedOfficialUnitFacts: [
          {
            factChecksum: '2'.repeat(64),
            sourceRecordId: sourceRecordId('games-workshop', 'fixture:profile-only'),
            faction: 'Stormcast Eternals',
            context: 'standard',
            name: 'Profile-only Unit',
            unitSize: 1,
            points: 100,
            reason: 'No current warscroll rules were available.',
          },
        ],
        discrepancies: [],
      },
      '2026-07-28T00:00:00.000Z',
      new Set(['lordskaldiorschosen'])
    )

    expect(catalog.records.map(record => record.disposition).sort()).toEqual([
      'applied-to-runtime',
      'applied-to-runtime',
      'profile-only',
      'structured-reference',
      'structured-reference',
      'superseded',
    ])
    const dispositionByName = new Map(catalog.records.map(record => [record.fact.name, record.disposition]))
    expect(dispositionByName.get('Lord Skaldior’s Chosen')).toBe('applied-to-runtime')
    expect(dispositionByName.get('Urrgar’s Maulerguts')).toBe('structured-reference')
    expect(catalog.summary).toMatchObject({
      records: 6,
      effective: 5,
      superseded: 1,
      regimentsOfRenown: 2,
      appliedToRuntime: 2,
      profileOnly: 1,
      structuredReference: 2,
    })
  })
})
