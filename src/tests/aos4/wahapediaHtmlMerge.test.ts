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

const emptyDatasetWith = (warscroll: WahapediaDataset['warscrolls'][number]): WahapediaDataset => {
  const dataset = emptyDataset()
  dataset.factions.push({
    id: warscroll.factionId,
    name: 'Hedonites of Slaanesh',
    link: '/aos4/factions/hedonites-of-slaanesh/',
    meta: meta('Factions.csv', 'hedonites-of-slaanesh'),
  })
  dataset.warscrolls.push(warscroll)
  return dataset
}

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

  it('lifts the reinforcement restriction the official row strikes through, and only then (#1757)', () => {
    const page: WahapediaHtmlWarscrollRecord = {
      recordKind: 'warscroll',
      externalId: 'Khainite-Shadowstalkers',
      name: 'Khainite Shadowstalkers',
      factionName: 'Stormcast Eternals',
      sourceTitle: 'Battletome: Stormcast Eternals',
      sourceUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/Khainite-Shadowstalkers',
      context: 'standard',
      characteristics: { move: '6"', save: '5+', control: '1', health: '1' },
      descriptionHtml: '',
      keywords: ['ORDER', 'INFANTRY'],
      unitSize: 9,
      points: 130,
      baseSizes: ['40mm [1]', '28.5mm [8]'],
      regimentOptions: [],
      notes: ['This unit cannot be reinforced.'],
      // The secondary page still prints the restriction the September 2026 profiles struck.
      canBeReinforced: false,
      weapons: [],
      abilities: [],
      meta: htmlMeta('Khainite-Shadowstalkers/warscroll'),
      artifact,
    }
    const fact = (struckNotes?: string[]): GamesWorkshopUnitProfileFact => ({
      kind: 'unit',
      key: 'page:8:unit:17',
      page: 8,
      row: 17,
      faction: 'Stormcast Eternals',
      context: 'standard',
      name: 'Khainite Shadowstalkers',
      unitSize: 9,
      points: 130,
      regimentOptions: [],
      relevantKeywords: ['Aelf', 'Infantry'],
      notes: [],
      baseSizes: ['40mm [1]', '28.5mm [8]'],
      ...(struckNotes ? { struckNotes } : {}),
      sourceRecordId: sourceRecordId('games-workshop', `${'d'.repeat(64)}:page:8`),
      factChecksum: 'e'.repeat(64),
    })
    const merged = (official: GamesWorkshopUnitProfileFact) =>
      mergeCurrentWahapediaWarscrollPages(emptyDataset(), [page], [official], []).dataset.warscrolls[0]

    expect(merged(fact(['This unit cannot be reinforced.']))).toMatchObject({
      noReinforced: false,
      notesHtml: '',
    })
    // An official row that is merely silent does not override the secondary restriction.
    expect(merged(fact())).toMatchObject({ noReinforced: true })
    // Another struck note says nothing about reinforcement.
    expect(merged(fact(['This Hero can join an eligible regiment as a Favoured Spawning.']))).toMatchObject({
      noReinforced: true,
    })
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

  it('honours a reviewed Legends override when the export drops the Legends source', () => {
    // Wahapedia's 2026-08-25 export blanked source_id on three Hedonites heralds that the newest
    // Battle Profiles still lists under Warhammer Legends. Without the reviewed override the
    // standard-context datasheet cannot match the official Legends fact; with it, it must.
    const dataset = emptyDataset()
    dataset.factions.push({
      id: 'HS',
      name: 'Hedonites of Slaanesh',
      link: '/aos4/factions/hedonites-of-slaanesh/',
      meta: meta('Factions.csv', 'hedonites-of-slaanesh'),
    })
    const old: WahapediaDataset['warscrolls'][number] = {
      id: '000000338',
      name: 'Viceleader, Herald of Slaanesh',
      factionId: 'HS',
      sourceId: '',
      legendHtml: '',
      regimentOptions: '',
      notesHtml: '',
      descriptionHtml: '',
      role: '',
      virtual: false,
      noReinforced: false,
      link: '/aos4/factions/hedonites-of-slaanesh/Viceleader-Herald-of-Slaanesh',
      move: '6"',
      save: '5+',
      control: '2',
      health: '5',
      ward: '',
      unitSize: '1',
      cost: '120',
      meta: meta('Warscrolls.csv', '000000338'),
    }
    dataset.warscrolls.push(old)
    const page: WahapediaHtmlWarscrollRecord = {
      recordKind: 'warscroll',
      externalId: 'Viceleader-Herald-of-Slaanesh',
      name: 'Viceleader Herald of Slaanesh',
      factionName: 'Hedonites of Slaanesh',
      sourceTitle: '',
      sourceUrl:
        'https://wahapedia.ru/aos4/factions/hedonites-of-slaanesh/warscrolls.html#Viceleader-Herald-of-Slaanesh',
      context: 'standard',
      characteristics: { move: '6"', save: '5+', control: '2', health: '5' },
      descriptionHtml: '',
      keywords: [],
      unitSize: 1,
      points: 120,
      baseSizes: ['40mm'],
      regimentOptions: [],
      notes: [],
      canBeReinforced: false,
      weapons: [],
      abilities: [],
      meta: htmlMeta('hedonites-of-slaanesh/Viceleader/warscroll'),
      artifact,
    }
    const official: GamesWorkshopUnitProfileFact = {
      kind: 'unit',
      key: 'legends:viceleader',
      page: 68,
      row: 1,
      faction: 'Warhammer Legends',
      context: 'legends',
      name: 'Viceleader, Herald of Slaanesh',
      unitSize: 1,
      points: 120,
      regimentOptions: [],
      relevantKeywords: [],
      notes: [],
      baseSizes: ['40mm'],
      sourceRecordId: sourceRecordId('games-workshop', `${'f'.repeat(64)}:page:68`),
      factChecksum: '2'.repeat(64),
    }

    const without = mergeCurrentWahapediaWarscrollPages(dataset, [page], [official])
    expect(without.reconciliation.matchedOfficialUnitFacts).toBe(0)
    expect(without.reconciliation.unmatchedOfficialUnitFacts.map(fact => fact.name)).toEqual([
      'Viceleader, Herald of Slaanesh',
    ])

    const withOverride = mergeCurrentWahapediaWarscrollPages(
      emptyDatasetWith(old),
      [page],
      [official],
      [],
      [],
      [],
      new Set(['000000338'])
    )
    expect(withOverride.reconciliation.matchedOfficialUnitFacts).toBe(1)
    expect(withOverride.reconciliation.unmatchedOfficialUnitFacts).toEqual([])
    const merged = withOverride.dataset.warscrolls.find(record => record.id === '000000338')
    expect(merged?.meta.rulesContextKinds).toEqual(['legends'])
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

  it('resolves a Regiment of Renown member by name when the linked page never carries the anchor (#2030)', () => {
    const bokUrl = 'https://wahapedia.ru/aos4/factions/blades-of-khorne/warscrolls.html'
    const bokArtifact = { ...artifact, requestUrl: bokUrl, finalUrl: bokUrl }
    const dataset = emptyDataset()
    dataset.factions.push(
      {
        id: 'BOK',
        name: 'Blades of Khorne',
        link: '/aos4/factions/blades-of-khorne/',
        meta: meta('Factions.csv', 'blades-of-khorne'),
      },
      {
        id: 'COS',
        name: 'Cities of Sigmar',
        link: '/aos4/factions/cities-of-sigmar/',
        meta: meta('Factions.csv', 'cities-of-sigmar'),
      }
    )
    const bokMeta = (section: string) => ({
      ...htmlMeta(section),
      artifactId: artifactId(bokArtifact.checksum),
      sourceRecordId: sourceRecordId('wahapedia', `html:${bokUrl}#${section}`),
    })
    const regiment: WahapediaHtmlWarscrollRecord = {
      recordKind: 'content-group',
      externalId: 'Cogfort-Raiders',
      name: 'Cogfort Raiders',
      factionName: 'Blades of Khorne',
      sourceTitle: '',
      sourceUrl: `${bokUrl}#Cogfort-Raiders`,
      context: 'standard',
      characteristics: { move: '', save: '', control: '', health: '' },
      descriptionHtml: '',
      keywords: [],
      baseSizes: [],
      regimentOptions: [],
      notes: [],
      weapons: [],
      abilities: [],
      regimentOfRenown: {
        inclusionFactionNames: ['Blades of Khorne'],
        members: [
          {
            name: 'Outlaw Conqueror Cogfort',
            // Wahapedia links the member's "home" collection, which publishes no such anchor.
            href: '/aos4/factions/cities-of-sigmar/warscrolls.html#Outlaw-Conqueror-Cogfort',
          },
        ],
      },
      meta: bokMeta('datasheet:Cogfort-Raiders/warscroll'),
      artifact: bokArtifact,
    }
    const member: WahapediaHtmlWarscrollRecord = {
      recordKind: 'warscroll',
      externalId: 'Outlaw-Conqueror-Cogfort',
      name: 'Outlaw Conqueror Cogfort',
      factionName: 'Blades of Khorne',
      sourceTitle: '',
      sourceUrl: `${bokUrl}#Outlaw-Conqueror-Cogfort`,
      context: 'standard',
      characteristics: { move: '6"', save: '3+', control: '10', health: '25' },
      descriptionHtml: '',
      keywords: ['ORDER', 'HERO', 'WAR MACHINE'],
      baseSizes: ['160mm'],
      regimentOptions: [],
      notes: [],
      weapons: [],
      abilities: [],
      regimentOfRenownOnly: true,
      meta: bokMeta('datasheet:Outlaw-Conqueror-Cogfort/warscroll'),
      artifact: bokArtifact,
    }

    const result = mergeCurrentWahapediaWarscrollPages(dataset, [regiment, member], [], [])
    const mergedRegiment = result.dataset.warscrolls.find(record => record.name === 'Cogfort Raiders')!
    const mergedMember = result.dataset.warscrolls.find(record => record.name === 'Outlaw Conqueror Cogfort')!

    expect(mergedRegiment.regimentOfRenownMemberIds).toEqual([mergedMember.id])
    expect(mergedRegiment.regimentOfRenownUnresolvedMembers).toBeUndefined()
    expect(mergedMember.regimentOfRenownOnly).toBe(true)
  })

  it('keeps a Regiment of Renown member unresolved when its name matches more than one kept datasheet (#2030)', () => {
    const bokUrl = 'https://wahapedia.ru/aos4/factions/blades-of-khorne/warscrolls.html'
    const bokArtifact = { ...artifact, requestUrl: bokUrl, finalUrl: bokUrl }
    const dataset = emptyDataset()
    dataset.factions.push({
      id: 'BOK',
      name: 'Blades of Khorne',
      link: '/aos4/factions/blades-of-khorne/',
      meta: meta('Factions.csv', 'blades-of-khorne'),
    })
    const bokMeta = (section: string) => ({
      ...htmlMeta(section),
      artifactId: artifactId(bokArtifact.checksum),
      sourceRecordId: sourceRecordId('wahapedia', `html:${bokUrl}#${section}`),
    })
    const regiment: WahapediaHtmlWarscrollRecord = {
      recordKind: 'content-group',
      externalId: 'Shared-Band',
      name: 'Shared Band',
      factionName: 'Blades of Khorne',
      sourceTitle: '',
      sourceUrl: `${bokUrl}#Shared-Band`,
      context: 'standard',
      characteristics: { move: '', save: '', control: '', health: '' },
      descriptionHtml: '',
      keywords: [],
      baseSizes: [],
      regimentOptions: [],
      notes: [],
      weapons: [],
      abilities: [],
      regimentOfRenown: {
        inclusionFactionNames: ['Blades of Khorne'],
        members: [
          {
            name: 'Duplicated Fighter',
            href: '/aos4/factions/cities-of-sigmar/warscrolls.html#Duplicated-Fighter',
          },
        ],
      },
      meta: bokMeta('datasheet:Shared-Band/warscroll'),
      artifact: bokArtifact,
    }
    const duplicate = (externalId: string): WahapediaHtmlWarscrollRecord => ({
      recordKind: 'warscroll',
      externalId,
      name: 'Duplicated Fighter',
      factionName: 'Blades of Khorne',
      sourceTitle: '',
      sourceUrl: `${bokUrl}#${externalId}`,
      context: 'standard',
      characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
      descriptionHtml: '',
      keywords: ['ORDER'],
      baseSizes: [],
      regimentOptions: [],
      notes: [],
      weapons: [],
      abilities: [],
      regimentOfRenownOnly: true,
      meta: bokMeta(`datasheet:${externalId}/warscroll`),
      artifact: bokArtifact,
    })

    const result = mergeCurrentWahapediaWarscrollPages(
      dataset,
      [regiment, duplicate('Duplicated-Fighter'), duplicate('Duplicated-Fighter-1')],
      [],
      []
    )
    const mergedRegiment = result.dataset.warscrolls.find(record => record.name === 'Shared Band')!

    expect(mergedRegiment.regimentOfRenownMemberIds).toBeUndefined()
    expect(mergedRegiment.regimentOfRenownUnresolvedMembers).toEqual(['Duplicated Fighter'])
  })

  it.each([
    [
      'an unreviewed same-name datasheet (no regiment-only adoption)',
      { regimentOfRenownOnly: false, context: 'standard' as const },
    ],
    [
      'a Spearhead-context adoption under a current regiment',
      { regimentOfRenownOnly: true, context: 'spearhead' as const },
    ],
  ])(
    'keeps a Regiment of Renown member unresolved when the name fallback would land on %s (#2030)',
    (_label, memberTraits) => {
      const bokUrl = 'https://wahapedia.ru/aos4/factions/blades-of-khorne/warscrolls.html'
      const bokArtifact = { ...artifact, requestUrl: bokUrl, finalUrl: bokUrl }
      const dataset = emptyDataset()
      dataset.factions.push({
        id: 'BOK',
        name: 'Blades of Khorne',
        link: '/aos4/factions/blades-of-khorne/',
        meta: meta('Factions.csv', 'blades-of-khorne'),
      })
      const bokMeta = (section: string) => ({
        ...htmlMeta(section),
        artifactId: artifactId(bokArtifact.checksum),
        sourceRecordId: sourceRecordId('wahapedia', `html:${bokUrl}#${section}`),
      })
      const regiment: WahapediaHtmlWarscrollRecord = {
        recordKind: 'content-group',
        externalId: 'Some-Band',
        name: 'Some Band',
        factionName: 'Blades of Khorne',
        sourceTitle: '',
        sourceUrl: `${bokUrl}#Some-Band`,
        context: 'standard',
        characteristics: { move: '', save: '', control: '', health: '' },
        descriptionHtml: '',
        keywords: [],
        baseSizes: [],
        regimentOptions: [],
        notes: [],
        weapons: [],
        abilities: [],
        regimentOfRenown: {
          inclusionFactionNames: ['Blades of Khorne'],
          members: [
            {
              name: 'Stray Fighter',
              href: '/aos4/factions/cities-of-sigmar/warscrolls.html#Stray-Fighter',
            },
          ],
        },
        meta: bokMeta('datasheet:Some-Band/warscroll'),
        artifact: bokArtifact,
      }
      const member: WahapediaHtmlWarscrollRecord = {
        recordKind: 'warscroll',
        externalId: 'Stray-Fighter',
        name: 'Stray Fighter',
        factionName: 'Blades of Khorne',
        sourceTitle: '',
        sourceUrl: `${bokUrl}#Stray-Fighter`,
        context: memberTraits.context,
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        descriptionHtml: '',
        keywords: ['ORDER'],
        baseSizes: [],
        regimentOptions: [],
        notes: [],
        weapons: [],
        abilities: [],
        ...(memberTraits.regimentOfRenownOnly ? { regimentOfRenownOnly: true as const } : {}),
        meta: bokMeta('datasheet:Stray-Fighter/warscroll'),
        artifact: bokArtifact,
      }

      const result = mergeCurrentWahapediaWarscrollPages(dataset, [regiment, member], [], [])
      const mergedRegiment = result.dataset.warscrolls.find(record => record.name === 'Some Band')!

      expect(mergedRegiment.regimentOfRenownMemberIds).toBeUndefined()
      expect(mergedRegiment.regimentOfRenownUnresolvedMembers).toEqual(['Stray Fighter'])
    }
  )
})
