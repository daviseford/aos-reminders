import {
  artifactChecksum,
  mergeCurrentWahapediaWarscrollPages,
  type ArtifactManifestEntry,
  type GamesWorkshopUnitProfileFact,
  type WahapediaHtmlFactionPageRecord,
  type WahapediaHtmlWarscrollRecord,
} from '../../aos4/data'
import {
  type WahapediaDataset,
  type WahapediaRecordMeta,
} from '../../aos4/data/wahapedia'
import { artifactId, sourceRecordId } from '../../aos4/domain'

const bytes = new TextEncoder().encode('<html>reviewed fixture</html>')
const artifact: ArtifactManifestEntry = {
  requestUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/warscrolls.html',
  finalUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/warscrolls.html',
  redirectChain: [],
  retrievedAt: '2026-07-28T00:00:00.000Z',
  adapterVersion: 'wahapedia-html/1',
  mediaType: 'text/html',
  byteLength: bytes.byteLength,
  checksum: artifactChecksum(bytes),
}

const meta = (file: WahapediaRecordMeta['file'], key: string): WahapediaRecordMeta => ({
  file,
  row: 2,
  artifactId: artifactId('a'.repeat(64)),
  sourceRecordId: sourceRecordId('wahapedia', `fixture:${key}`),
  recordChecksum: 'b'.repeat(64),
})

const emptyDataset = (): WahapediaDataset => ({
  artifacts: {},
  factions: [
    {
      id: 'SCE',
      name: 'Stormcast Eternals',
      link: '/aos4/factions/stormcast-eternals/',
      meta: meta('Factions.csv', 'faction'),
    },
  ],
  sources: [],
  warscrolls: [],
  warscrollAbilities: [],
  warscrollWeapons: [],
  warscrollKeywords: [],
  warscrollBases: [],
  warscrollOrganisation: [],
  regimentOfRenownFactions: [],
  factionAbilityTypes: [],
  factionAbilitySubtypes: [],
  factionAbilities: [],
})

const htmlMeta = (section: string) => ({
  artifactId: artifactId(artifact.checksum),
  sourceRecordId: sourceRecordId(
    'wahapedia',
    `html:${artifact.finalUrl}#${section}`
  ),
  recordChecksum: 'c'.repeat(64),
  section,
})

describe('current Wahapedia HTML reconciliation', () => {
  it('applies official Battle Profile facts while retaining both sources and stable identity', () => {
    const dataset = emptyDataset()
    const oldMeta = meta('Warscrolls.csv', 'liberators')
    dataset.warscrolls.push({
      id: 'old-liberators',
      name: 'Liberators',
      factionId: 'SCE',
      sourceId: '',
      legendHtml: '',
      regimentOptions: '',
      notesHtml: '',
      descriptionHtml: '',
      role: '',
      virtual: false,
      noReinforced: false,
      link: '/aos4/factions/stormcast-eternals/Liberators',
      move: '5"',
      save: '3+',
      control: '1',
      health: '2',
      ward: '',
      unitSize: '5',
      cost: '90',
      meta: oldMeta,
    })
    const page: WahapediaHtmlWarscrollRecord = {
      recordKind: 'warscroll',
      externalId: 'Liberators',
      name: 'Liberators',
      factionName: 'Stormcast Eternals',
      sourceTitle: 'Battletome: Stormcast Eternals',
      sourceUrl:
        'https://wahapedia.ru/aos4/factions/stormcast-eternals/Liberators',
      context: 'standard',
      characteristics: { move: '5"', save: '3+', control: '1', health: '2' },
      descriptionHtml: '',
      keywords: ['ORDER', 'STORMCAST ETERNALS', 'INFANTRY'],
      unitSize: 5,
      points: 100,
      baseSizes: ['40mm'],
      regimentOptions: ['Any Warrior Chamber'],
      notes: [],
      canBeReinforced: true,
      weapons: [],
      abilities: [],
      meta: htmlMeta('Liberators/warscroll'),
      artifact,
    }
    const officialSourceRecordId = sourceRecordId(
      'games-workshop',
      `${'d'.repeat(64)}:page:19`
    )
    const official: GamesWorkshopUnitProfileFact = {
      kind: 'unit',
      key: 'stormcast-eternals:liberators',
      page: 19,
      row: 1,
      faction: 'Stormcast Eternals',
      context: 'standard',
      name: 'Liberators',
      unitSize: 5,
      points: 110,
      regimentOptions: ['Any Stormcast Eternals'],
      relevantKeywords: ['INFANTRY'],
      notes: ['Official note'],
      baseSizes: ['40mm'],
      sourceRecordId: officialSourceRecordId,
      factChecksum: 'e'.repeat(64),
    }

    const result = mergeCurrentWahapediaWarscrollPages(
      dataset,
      [page],
      [official],
      []
    )
    const merged = result.dataset.warscrolls[0]

    expect(merged).toMatchObject({
      id: 'old-liberators',
      name: 'Liberators',
      unitSize: '5',
      cost: '110',
      regimentOptions: 'Any Stormcast Eternals',
      notesHtml: 'Official note',
    })
    expect(merged.meta).toMatchObject({
      identitySourceRecordId: oldMeta.sourceRecordId,
      officialSourceRecordIds: [officialSourceRecordId],
    })
    expect(result.dataset.supersededMetas).toContain(oldMeta)
    expect(result.reconciliation).toMatchObject({
      pages: 1,
      matchedOfficialUnitFacts: 1,
      unmatchedOfficialUnitFacts: [],
    })
    expect(result.reconciliation.discrepancies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'points', secondary: '100', official: '110' }),
      ])
    )
  })

  it('replaces stale export faction rules and keeps their records dispositionable', () => {
    const dataset = emptyDataset()
    const oldTypeMeta = meta('Faction_ability_types.csv', 'old-type')
    const oldAbilityMeta = meta('Faction_abilities.csv', 'old-ability')
    dataset.factionAbilityTypes.push({
      factionId: 'SCE',
      id: 'old-type',
      name: 'Battle Traits',
      descriptionHtml: '',
      meta: oldTypeMeta,
    })
    dataset.factionAbilities.push({
      factionId: 'SCE',
      typeId: 'old-type',
      typeName: 'Battle Traits',
      subtypeId: '',
      subtypeName: '',
      line: '1',
      name: 'Stale Rule',
      descriptionHtml: '<b>Effect:</b> Stale.',
      legendHtml: '',
      abilityType: '',
      isReaction: false,
      conditionHtml: 'Passive',
      keywordsHtml: '',
      abilityPhase: '',
      pointsType: '',
      points: '',
      meta: oldAbilityMeta,
    })
    const factionPage: WahapediaHtmlFactionPageRecord = {
      factionName: 'Stormcast Eternals',
      sourceUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/',
      artifact,
      groups: [
        {
          externalId: 'Battle-Traits',
          name: 'Battle Traits',
          context: 'standard',
          sourceTitle: 'Battletome: Stormcast Eternals',
          meta: htmlMeta('faction-group:Battle-Traits'),
        },
      ],
      abilities: [
        {
          externalId: 'Battle-Traits:ability:1',
          groupExternalId: 'Battle-Traits',
          context: 'standard',
          line: 1,
          name: 'Current Rule',
          descriptionHtml: '<b>Effect:</b> Current.',
          conditionHtml: 'Passive',
          keywordsHtml: '',
          abilityType: '',
          abilityPhase: '',
          isReaction: false,
          pointsType: '',
          points: '',
          meta: htmlMeta('faction-ability:Battle-Traits:ability:1'),
        },
      ],
    }

    const result = mergeCurrentWahapediaWarscrollPages(
      dataset,
      [],
      [],
      [factionPage]
    )

    expect(result.dataset.factionAbilities.map(record => record.name)).toEqual([
      'Current Rule',
    ])
    expect(result.dataset.factionAbilities[0].meta.rulesContextKinds).toEqual([
      'standard',
    ])
    expect(result.dataset.supersededMetas).toEqual(
      expect.arrayContaining([oldTypeMeta, oldAbilityMeta])
    )
  })
})
