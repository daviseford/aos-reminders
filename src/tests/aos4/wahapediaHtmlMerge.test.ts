import {
  artifactChecksum,
  mergeCurrentWahapediaWarscrollPages,
  type ArtifactManifestEntry,
  type GamesWorkshopUnitProfileFact,
  type WahapediaHtmlFactionPageRecord,
  type WahapediaHtmlRulesPageRecord,
  type WahapediaHtmlWarscrollRecord,
} from '../../aos4/data'
import { type WahapediaDataset, type WahapediaRecordMeta } from '../../aos4/data/wahapedia'
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
  sourceRecordId: sourceRecordId('wahapedia', `html:${artifact.finalUrl}#${section}`),
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
      sourceUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/Liberators',
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
    const officialSourceRecordId = sourceRecordId('games-workshop', `${'d'.repeat(64)}:page:19`)
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

    const result = mergeCurrentWahapediaWarscrollPages(dataset, [page], [official], [])
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

  it('maps a Legends fact only to the matching retired identity', () => {
    const dataset = emptyDataset()
    dataset.factions.push(
      {
        id: 'BS',
        name: 'Bonesplitterz',
        link: '/aos4/factions/bonesplitterz/',
        meta: meta('Factions.csv', 'bonesplitterz'),
      },
      {
        id: 'GG',
        name: 'Gloomspite Gitz',
        link: '/aos4/factions/gloomspite-gitz/',
        meta: meta('Factions.csv', 'gloomspite-gitz'),
      }
    )
    dataset.sources.push({
      id: 'legends',
      name: 'Legends compendium',
      type: '',
      edition: '',
      version: '',
      errataDate: '',
      errataLink: '',
      meta: meta('Source.csv', 'legends'),
    })
    const oldWarscroll = (
      id: string,
      factionId: string,
      sourceId: string
    ): WahapediaDataset['warscrolls'][number] => ({
      id,
      name: 'Kragnos, the End of Empires',
      factionId,
      sourceId,
      legendHtml: '',
      regimentOptions: '',
      notesHtml: '',
      descriptionHtml: '',
      role: '',
      virtual: false,
      noReinforced: false,
      link: `/aos4/factions/${factionId.toLowerCase()}/Kragnos-the-End-of-Empires`,
      move: '10"',
      save: '4+',
      control: '5',
      health: '18',
      ward: '',
      unitSize: '1',
      cost: '580',
      meta: meta('Warscrolls.csv', id),
    })
    dataset.warscrolls.push(
      oldWarscroll('legends-kragnos', 'BS', 'legends'),
      oldWarscroll('current-kragnos', 'GG', '')
    )
    const page = (factionName: string, slug: string): WahapediaHtmlWarscrollRecord => ({
      recordKind: 'warscroll',
      externalId: 'Kragnos-the-End-of-Empires',
      name: 'Kragnos the End of Empires',
      factionName,
      sourceTitle: 'Faction Pack',
      sourceUrl: `https://wahapedia.ru/aos4/factions/${slug}/warscrolls.html#Kragnos-the-End-of-Empires`,
      context: 'standard',
      characteristics: { move: '10"', save: '4+', control: '5', health: '18' },
      descriptionHtml: '',
      keywords: [],
      unitSize: 1,
      points: factionName === 'Bonesplitterz' ? 590 : 610,
      baseSizes: ['130mm'],
      regimentOptions: [],
      notes: [],
      canBeReinforced: false,
      weapons: [],
      abilities: [],
      meta: htmlMeta(`${slug}/Kragnos/warscroll`),
      artifact,
    })
    const official: GamesWorkshopUnitProfileFact = {
      kind: 'unit',
      key: 'legends:kragnos',
      page: 64,
      row: 1,
      faction: 'Warhammer Legends',
      context: 'legends',
      name: 'Kragnos, the End of Empires',
      unitSize: 1,
      points: 580,
      regimentOptions: [],
      relevantKeywords: [],
      notes: [],
      baseSizes: ['130mm'],
      sourceRecordId: sourceRecordId('games-workshop', `${'f'.repeat(64)}:page:64`),
      factChecksum: '1'.repeat(64),
    }

    const result = mergeCurrentWahapediaWarscrollPages(
      dataset,
      [page('Bonesplitterz', 'bonesplitterz'), page('Gloomspite Gitz', 'gloomspite-gitz')],
      [official]
    )
    const legends = result.dataset.warscrolls.find(record => record.id === 'legends-kragnos')
    const current = result.dataset.warscrolls.find(record => record.id === 'current-kragnos')

    expect(legends?.cost).toBe('580')
    expect(legends?.meta.rulesContextKinds).toEqual(['legends'])
    expect(current?.cost).toBe('610')
    expect(current?.meta.rulesContextKinds).toEqual(['standard'])
    expect(result.reconciliation.matchedOfficialUnitFacts).toBe(1)
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

    const result = mergeCurrentWahapediaWarscrollPages(dataset, [], [], [factionPage])

    expect(result.dataset.factionAbilities.map(record => record.name)).toEqual(['Current Rule'])
    expect(result.dataset.factionAbilities[0].meta.rulesContextKinds).toEqual(['standard'])
    expect(result.dataset.supersededMetas).toEqual(expect.arrayContaining([oldTypeMeta, oldAbilityMeta]))
  })

  it('requires an explicit application disposition before merging a general rules page', () => {
    const dataset = emptyDataset()
    const rulesUrl = 'https://wahapedia.ru/aos4/the-rules/the-core-rules/'
    const rulesArtifact = {
      ...artifact,
      requestUrl: rulesUrl,
      finalUrl: rulesUrl,
    }
    const rulesMeta = (section: string) => ({
      ...htmlMeta(section),
      section,
    })
    const rulesPage: WahapediaHtmlRulesPageRecord = {
      title: 'The Core Rules',
      sourceUrl: rulesUrl,
      context: 'standard',
      artifact: rulesArtifact,
      meta: rulesMeta('rules-page'),
      groups: [
        {
          externalId: 'Universal-Core-Abilities',
          name: 'Universal Core Abilities',
          context: 'standard',
          sourceTitle: 'The Core Rules',
          meta: rulesMeta('rules-group:Universal-Core-Abilities'),
        },
      ],
      abilities: [
        {
          externalId: 'Universal-Core-Abilities:ability:1',
          groupExternalId: 'Universal-Core-Abilities',
          context: 'standard',
          line: 1,
          name: 'Normal Move',
          descriptionHtml: '<b>Effect:</b> That unit can move.',
          conditionHtml: 'Your Movement Phase',
          keywordsHtml: '',
          abilityType: '',
          abilityPhase: 'Your Movement Phase',
          isReaction: false,
          pointsType: '',
          points: '',
          meta: rulesMeta('rules-ability:Universal-Core-Abilities:ability:1'),
        },
      ],
    }

    expect(() => mergeCurrentWahapediaWarscrollPages(dataset, [], [], [], [rulesPage])).toThrow(
      'no reviewed application rationale'
    )

    const result = mergeCurrentWahapediaWarscrollPages(
      dataset,
      [],
      [],
      [],
      [rulesPage],
      [
        {
          url: rulesUrl,
          application: 'universal',
          reason: 'Core rules apply to every army.',
          contextKinds: {
            standard: ['standard', 'legends'],
          },
        },
      ]
    )

    expect(result.dataset.generalRulesPages).toEqual([
      expect.objectContaining({
        title: 'The Core Rules',
        application: 'universal',
        reason: 'Core rules apply to every army.',
      }),
    ])
    expect(result.dataset.generalRuleGroups).toHaveLength(1)
    expect(result.dataset.generalRuleAbilities).toEqual([
      expect.objectContaining({
        name: 'Normal Move',
        actor: 'unit',
        meta: expect.objectContaining({ rulesContextKinds: ['standard', 'legends'] }),
      }),
    ])
  })
})
