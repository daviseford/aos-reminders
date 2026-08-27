import {
  AOS4_CATALOG_SCHEMA_VERSION,
  abilityId,
  contentGroupId,
  factionId,
  rulesContextId,
  warscrollId,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type ContentRelationship,
  type RulesContextId,
} from '../../../../aos4/domain'

export const importFixtureContextIds = {
  current: rulesContextId('81000000-0000-4000-8000-000000000001'),
  seasonal: rulesContextId('81000000-0000-4000-8000-000000000002'),
  legends: rulesContextId('81000000-0000-4000-8000-000000000003'),
  historical: rulesContextId('81000000-0000-4000-8000-000000000004'),
}

export const importFixtureIds = {
  alphaFaction: factionId('81000000-0000-4000-8000-000000000010'),
  betaFaction: factionId('81000000-0000-4000-8000-000000000011'),
  /**
   * A `Factions.csv` container row rather than an army, shaped the way `Endless Spells` is: it
   * offers universal rules content to hang manifestations off, and no warscrolls at all.
   */
  containerFaction: factionId('81000000-0000-4000-8000-000000000012'),
  alphaGuard: warscrollId('81000000-0000-4000-8000-000000000020'),
  /**
   * The seasonal replacement warscroll for `alphaGuard`, catalogued the way generation emits one:
   * a distinct entity named with the battlepack prefixed, living in the same seasonal context as
   * the base warscroll it replaces (#1862).
   */
  alphaGuardSeasonal: warscrollId('81000000-0000-4000-8000-000000000026'),
  betaGuard: warscrollId('81000000-0000-4000-8000-000000000021'),
  betaOnly: warscrollId('81000000-0000-4000-8000-000000000022'),
  /** Catalogued only in the Legends context, reachable from Alpha Hosts only there. */
  alphaRetired: warscrollId('81000000-0000-4000-8000-000000000023'),
  /** A name Alpha carries on both sides of the Legends boundary, as two distinct warscrolls. */
  twinEraCurrent: warscrollId('81000000-0000-4000-8000-000000000024'),
  twinEraLegends: warscrollId('81000000-0000-4000-8000-000000000025'),
  focusedFormation: contentGroupId('81000000-0000-4000-8000-000000000030'),
  twinFormationA: contentGroupId('81000000-0000-4000-8000-000000000031'),
  twinFormationB: contentGroupId('81000000-0000-4000-8000-000000000032'),
  sameNameLore: contentGroupId('81000000-0000-4000-8000-000000000033'),
  excludedA: contentGroupId('81000000-0000-4000-8000-000000000034'),
  excludedB: contentGroupId('81000000-0000-4000-8000-000000000035'),
  /**
   * An Army of Renown, shaped the way generation emits one.
   *
   * The container carries its own slug as `groupType` and has no inbound edge from anything; its
   * sections are named after the rules section, carry the *army's* slug, and are what the faction
   * actually offers. Reproduced faithfully because the importer recovers the army from that shape
   * alone — a tidier fixture would test a graph the generator never produces.
   */
  renownedVanguard: contentGroupId('81000000-0000-4000-8000-000000000040'),
  renownedVanguardBattleTraits: contentGroupId('81000000-0000-4000-8000-000000000041'),
  renownedVanguardSpellLore: contentGroupId('81000000-0000-4000-8000-000000000042'),
  /** Last season's content, catalogued as historical once its handbook lapsed. */
  archiveGuard: warscrollId('81000000-0000-4000-8000-000000000050'),
  archiveFormation: contentGroupId('81000000-0000-4000-8000-000000000051'),
  /**
   * A manifestation lore, shaped the way generation emits one: the group includes its
   * `SUMMON <NAME>` spells, while the manifestation warscrolls hang off the faction's own
   * `offers` edges with no edge from the lore or its spells. The importer bridges that gap by
   * name (#1979), so the fixture also carries a summon whose warscroll does not exist and a
   * summon whose name two warscrolls share — the cases that must fail closed.
   */
  wildLore: contentGroupId('81000000-0000-4000-8000-000000000060'),
  wildSerpent: warscrollId('81000000-0000-4000-8000-000000000061'),
  twinIdolA: warscrollId('81000000-0000-4000-8000-000000000062'),
  twinIdolB: warscrollId('81000000-0000-4000-8000-000000000063'),
  summonWildSerpent: abilityId('81000000-0000-4000-8000-000000000064'),
  summonLostShrine: abilityId('81000000-0000-4000-8000-000000000065'),
  summonTwinIdol: abilityId('81000000-0000-4000-8000-000000000066'),
}

const sourceRefs: ContentEntity['sourceRefs'] = []

const manifestationWarscroll = (id: CanonicalId<'warscroll'>, name: string): ContentEntity => ({
  id,
  kind: 'warscroll',
  revision: 'import-fixture',
  name,
  factionIds: [importFixtureIds.alphaFaction],
  keywords: ['MANIFESTATION'],
  characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
  rulesContextIds: [importFixtureContextIds.seasonal],
  sourceRefs,
})

const summonAbility = (id: CanonicalId<'ability'>, name: string): ContentEntity => ({
  id,
  kind: 'ability',
  revision: 'import-fixture',
  name,
  abilityKind: 'active',
  actor: 'army',
  text: { effect: `Set up the manifestation named by ${name}.` },
  timings: [{ kind: 'active', window: { kind: 'turn-phase', phase: 'hero' }, raw: 'Your Hero Phase' }],
  keywords: ['SPELL', 'SUMMON'],
  rulesContextIds: [importFixtureContextIds.seasonal],
  sourceRefs,
})

const contentGroup = (
  id: CanonicalId<'content-group'>,
  name: string,
  groupType: string,
  rulesContextIds: RulesContextId[] = [importFixtureContextIds.seasonal]
): ContentEntity => ({
  id,
  kind: 'content-group',
  revision: 'import-fixture',
  name,
  groupType,
  rulesContextIds,
  sourceRefs,
})

export const createImportFixtureCatalog = (): Aos4Catalog => {
  const relationships: ContentRelationship[] = [
    importFixtureIds.alphaGuard,
    importFixtureIds.focusedFormation,
    importFixtureIds.twinFormationA,
    importFixtureIds.twinFormationB,
    importFixtureIds.sameNameLore,
    importFixtureIds.excludedA,
    importFixtureIds.excludedB,
    importFixtureIds.renownedVanguardBattleTraits,
    importFixtureIds.renownedVanguardSpellLore,
  ].map((to, index) => ({
    id: `relationship:alpha-offers-${index}`,
    kind: 'offers',
    from: importFixtureIds.alphaFaction,
    to,
    rulesContextIds: [importFixtureContextIds.seasonal],
  }))

  relationships.push(
    {
      id: 'relationship:alpha-offers-retired',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.alphaRetired,
      rulesContextIds: [importFixtureContextIds.legends],
    },
    {
      id: 'relationship:alpha-offers-shared-guard-seasonal',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.alphaGuardSeasonal,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-twin-era-current',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.twinEraCurrent,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-twin-era-legends',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.twinEraLegends,
      rulesContextIds: [importFixtureContextIds.legends],
    },
    {
      id: 'relationship:beta-offers-shared-guard',
      kind: 'offers',
      from: importFixtureIds.betaFaction,
      to: importFixtureIds.betaGuard,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:beta-offers-beta-only',
      kind: 'offers',
      from: importFixtureIds.betaFaction,
      to: importFixtureIds.betaOnly,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:fixture-exclusion',
      kind: 'excludes',
      from: importFixtureIds.excludedA,
      to: importFixtureIds.excludedB,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:renowned-vanguard-includes-battle-traits',
      kind: 'includes',
      from: importFixtureIds.renownedVanguard,
      to: importFixtureIds.renownedVanguardBattleTraits,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:renowned-vanguard-includes-spell-lore',
      kind: 'includes',
      from: importFixtureIds.renownedVanguard,
      to: importFixtureIds.renownedVanguardSpellLore,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:container-offers-same-name-lore',
      kind: 'offers',
      from: importFixtureIds.containerFaction,
      to: importFixtureIds.sameNameLore,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-archive-guard',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.archiveGuard,
      rulesContextIds: [importFixtureContextIds.historical],
    },
    {
      id: 'relationship:alpha-offers-archive-formation',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.archiveFormation,
      rulesContextIds: [importFixtureContextIds.historical],
    },
    {
      id: 'relationship:alpha-offers-wild-lore',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.wildLore,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-wild-serpent',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.wildSerpent,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-twin-idol-a',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.twinIdolA,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:alpha-offers-twin-idol-b',
      kind: 'offers',
      from: importFixtureIds.alphaFaction,
      to: importFixtureIds.twinIdolB,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:wild-lore-includes-summon-wild-serpent',
      kind: 'includes',
      from: importFixtureIds.wildLore,
      to: importFixtureIds.summonWildSerpent,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:wild-lore-includes-summon-lost-shrine',
      kind: 'includes',
      from: importFixtureIds.wildLore,
      to: importFixtureIds.summonLostShrine,
      rulesContextIds: [importFixtureContextIds.seasonal],
    },
    {
      id: 'relationship:wild-lore-includes-summon-twin-idol',
      kind: 'includes',
      from: importFixtureIds.wildLore,
      to: importFixtureIds.summonTwinIdol,
      rulesContextIds: [importFixtureContextIds.seasonal],
    }
  )

  return {
    schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
    generatedAt: '2026-07-29T00:00:00.000Z',
    rulesContexts: [
      {
        id: importFixtureContextIds.current,
        name: 'Age of Sigmar Fourth Edition',
        mode: 'standard',
        status: 'current',
        publicationIds: [],
      },
      {
        id: importFixtureContextIds.seasonal,
        name: "Age of Sigmar Fourth Edition General's Handbook 2026-27",
        mode: 'standard',
        status: 'seasonal',
        publicationIds: [],
        battlepack: 'Scourge of Tests',
        season: '2026-27',
      },
      {
        id: importFixtureContextIds.legends,
        name: 'Age of Sigmar Fourth Edition Legends',
        mode: 'other',
        status: 'legends',
        publicationIds: [],
      },
      {
        id: importFixtureContextIds.historical,
        name: 'Archive 2024',
        mode: 'standard',
        status: 'historical',
        publicationIds: [],
      },
    ],
    sourceArtifacts: [],
    sourceRecords: [],
    entities: [
      {
        id: importFixtureIds.alphaFaction,
        kind: 'faction',
        revision: 'import-fixture',
        name: 'Alpha Hosts',
        rulesContextIds: [
          importFixtureContextIds.current,
          importFixtureContextIds.seasonal,
          importFixtureContextIds.legends,
          importFixtureContextIds.historical,
        ],
        sourceRefs,
      },
      {
        id: importFixtureIds.betaFaction,
        kind: 'faction',
        revision: 'import-fixture',
        name: 'Beta Hosts',
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.containerFaction,
        kind: 'faction',
        revision: 'import-fixture',
        name: 'Endless Spells',
        rulesContextIds: [importFixtureContextIds.current, importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.alphaGuard,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Shared Guard',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.alphaGuardSeasonal,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Scourge of Tests Shared Guard',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.betaGuard,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Shared Guard',
        factionIds: [importFixtureIds.betaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.betaOnly,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Beta Only',
        factionIds: [importFixtureIds.betaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.alphaRetired,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Retired Champion',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.legends],
        sourceRefs,
      },
      {
        id: importFixtureIds.twinEraCurrent,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Twin Era Guard',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.seasonal],
        sourceRefs,
      },
      {
        id: importFixtureIds.twinEraLegends,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Twin Era Guard',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.legends],
        sourceRefs,
      },
      contentGroup(importFixtureIds.focusedFormation, 'Focused Formation', 'battle-formation'),
      contentGroup(importFixtureIds.twinFormationA, 'Twin Formation', 'battle-formation'),
      contentGroup(importFixtureIds.twinFormationB, 'Twin Formation', 'battle-formation'),
      contentGroup(importFixtureIds.sameNameLore, 'Shared Guard', 'spell-lore'),
      contentGroup(importFixtureIds.excludedA, 'Choice A', 'artefact-of-power'),
      contentGroup(importFixtureIds.excludedB, 'Choice B', 'artefact-of-power'),
      contentGroup(importFixtureIds.renownedVanguard, 'Renowned Vanguard', 'renowned-vanguard'),
      contentGroup(importFixtureIds.renownedVanguardBattleTraits, 'Battle Traits', 'renowned-vanguard'),
      contentGroup(importFixtureIds.renownedVanguardSpellLore, 'Spell Lore', 'renowned-vanguard'),
      contentGroup(importFixtureIds.archiveFormation, 'Archive Formation', 'battle-formation', [
        importFixtureContextIds.historical,
      ]),
      {
        id: importFixtureIds.archiveGuard,
        kind: 'warscroll',
        revision: 'import-fixture',
        name: 'Archive Guard',
        factionIds: [importFixtureIds.alphaFaction],
        keywords: [],
        characteristics: { move: '5"', save: '4+', control: '1', health: '2' },
        rulesContextIds: [importFixtureContextIds.historical],
        sourceRefs,
      },
      contentGroup(importFixtureIds.wildLore, 'Wild Lore', 'manifestation-lore'),
      manifestationWarscroll(importFixtureIds.wildSerpent, 'Wild Serpent'),
      manifestationWarscroll(importFixtureIds.twinIdolA, 'Twin Idol'),
      manifestationWarscroll(importFixtureIds.twinIdolB, 'Twin Idol'),
      summonAbility(importFixtureIds.summonWildSerpent, 'SUMMON WILD SERPENT'),
      summonAbility(importFixtureIds.summonLostShrine, 'SUMMON LOST SHRINE'),
      summonAbility(importFixtureIds.summonTwinIdol, 'SUMMON TWIN IDOL'),
    ],
    relationships,
  }
}
