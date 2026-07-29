import {
  AOS4_CATALOG_SCHEMA_VERSION,
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
  alphaGuard: warscrollId('81000000-0000-4000-8000-000000000020'),
  betaGuard: warscrollId('81000000-0000-4000-8000-000000000021'),
  betaOnly: warscrollId('81000000-0000-4000-8000-000000000022'),
  focusedFormation: contentGroupId('81000000-0000-4000-8000-000000000030'),
  twinFormationA: contentGroupId('81000000-0000-4000-8000-000000000031'),
  twinFormationB: contentGroupId('81000000-0000-4000-8000-000000000032'),
  sameNameLore: contentGroupId('81000000-0000-4000-8000-000000000033'),
  excludedA: contentGroupId('81000000-0000-4000-8000-000000000034'),
  excludedB: contentGroupId('81000000-0000-4000-8000-000000000035'),
}

const sourceRefs: ContentEntity['sourceRefs'] = []

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
  ].map((to, index) => ({
    id: `relationship:alpha-offers-${index}`,
    kind: 'offers',
    from: importFixtureIds.alphaFaction,
    to,
    rulesContextIds: [importFixtureContextIds.seasonal],
  }))

  relationships.push(
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
      contentGroup(importFixtureIds.focusedFormation, 'Focused Formation', 'battle-formation'),
      contentGroup(importFixtureIds.twinFormationA, 'Twin Formation', 'battle-formation'),
      contentGroup(importFixtureIds.twinFormationB, 'Twin Formation', 'battle-formation'),
      contentGroup(importFixtureIds.sameNameLore, 'Shared Guard', 'spell-lore'),
      contentGroup(importFixtureIds.excludedA, 'Choice A', 'artefact-of-power'),
      contentGroup(importFixtureIds.excludedB, 'Choice B', 'artefact-of-power'),
    ],
    relationships,
  }
}
