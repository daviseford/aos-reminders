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
      '2026-07-28T00:00:00.000Z'
    )

    expect(catalog.records.map(record => record.disposition).sort()).toEqual([
      'applied-to-runtime',
      'profile-only',
      'structured-reference',
      'superseded',
    ])
    expect(catalog.summary).toMatchObject({
      records: 4,
      effective: 3,
      superseded: 1,
      appliedToRuntime: 1,
      profileOnly: 1,
      structuredReference: 1,
    })
  })
})
