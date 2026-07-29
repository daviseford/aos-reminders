import {
  AOS4_CATALOG_SCHEMA_VERSION,
  contentGroupId,
  factionId,
  rulesContextId,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type ContentRelationship,
} from '../../aos4/domain'
import { createCatalogIndex, resolveSelection } from '../../aos4/select'

const contextIds = {
  spearhead: rulesContextId('30000000-0000-4000-8000-000000000001'),
  standard: rulesContextId('30000000-0000-4000-8000-000000000002'),
}

const ids = {
  faction: factionId('30000000-0000-4000-8000-000000000003'),
  formation: contentGroupId('30000000-0000-4000-8000-000000000004'),
  unit: contentGroupId('30000000-0000-4000-8000-000000000005'),
  ability: contentGroupId('30000000-0000-4000-8000-000000000006'),
  sameNameAbility: contentGroupId('30000000-0000-4000-8000-000000000007'),
  mandatory: contentGroupId('30000000-0000-4000-8000-000000000008'),
  excluded: contentGroupId('30000000-0000-4000-8000-000000000009'),
  spearheadOnly: contentGroupId('30000000-0000-4000-8000-000000000010'),
  missing: contentGroupId('30000000-0000-4000-8000-000000000011'),
}

const entity = (
  id: CanonicalId<'content-group'>,
  name: string,
  rulesContextIds = [contextIds.standard]
): ContentEntity => ({
  id,
  kind: 'content-group',
  revision: 'fixture-1',
  name,
  groupType: 'fixture',
  rulesContextIds,
  sourceRefs: [],
})

const relationships: ContentRelationship[] = [
  {
    id: 'relationship:faction-offers-formation',
    kind: 'offers',
    from: ids.faction,
    to: ids.formation,
  },
  {
    id: 'relationship:formation-includes-ability',
    kind: 'includes',
    from: ids.formation,
    to: ids.ability,
  },
  {
    id: 'relationship:unit-includes-ability',
    kind: 'includes',
    from: ids.unit,
    to: ids.ability,
  },
  {
    id: 'relationship:ability-requires-mandatory',
    kind: 'requires',
    from: ids.ability,
    to: ids.mandatory,
  },
  {
    id: 'relationship:unit-excludes-choice',
    kind: 'excludes',
    from: ids.unit,
    to: ids.excluded,
  },
  {
    id: 'relationship:unit-includes-spearhead',
    kind: 'includes',
    from: ids.unit,
    to: ids.spearheadOnly,
    rulesContextIds: [contextIds.spearhead],
  },
]

const createCatalog = (): Aos4Catalog => ({
  schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
  generatedAt: '2026-07-27T12:00:00.000Z',
  rulesContexts: [
    {
      id: contextIds.standard,
      name: 'Standard',
      mode: 'standard',
      status: 'current',
      publicationIds: [],
    },
    {
      id: contextIds.spearhead,
      name: 'Spearhead',
      mode: 'spearhead',
      status: 'current',
      publicationIds: [],
    },
  ],
  sourceArtifacts: [],
  sourceRecords: [],
  entities: [
    {
      id: ids.faction,
      kind: 'faction',
      revision: 'fixture-1',
      name: 'Fixture Faction',
      rulesContextIds: [contextIds.standard, contextIds.spearhead],
      sourceRefs: [],
    },
    entity(ids.formation, 'Battle Formation'),
    entity(ids.unit, 'Fixture Unit'),
    entity(ids.ability, 'Shared Name'),
    entity(ids.sameNameAbility, 'Shared Name'),
    entity(ids.mandatory, 'Mandatory Ability'),
    entity(ids.excluded, 'Excluded Choice'),
    entity(ids.spearheadOnly, 'Spearhead Ability', [contextIds.spearhead]),
  ],
  relationships: relationships.map(relationship => ({ ...relationship })),
})

describe('AoS 4 catalog index', () => {
  it('indexes entities and outgoing relationships by stable ID', () => {
    const index = createCatalogIndex(createCatalog())

    expect(index.entitiesById.get(ids.ability)?.name).toBe('Shared Name')
    expect(index.outgoingByEntityId.get(ids.unit)?.map(relationship => relationship.id)).toEqual([
      'relationship:unit-excludes-choice',
      'relationship:unit-includes-ability',
      'relationship:unit-includes-spearhead',
    ])
  })
})

describe('AoS 4 selection resolution', () => {
  it('resolves transitive inclusions and requirements while retaining every cause', () => {
    const result = resolveSelection(createCatalog(), {
      explicitIds: [ids.unit, ids.formation, ids.faction],
      rulesContextId: contextIds.standard,
    })

    expect(result.selectedIds).toEqual([
      ids.formation,
      ids.unit,
      ids.ability,
      ids.mandatory,
      ids.faction,
    ])
    expect(result.availableIds).toEqual([ids.formation])
    expect(
      result.causes
        .filter(cause => cause.entityId === ids.ability)
        .map(cause => cause.entityPath)
    ).toEqual([
      [ids.formation, ids.ability],
      [ids.unit, ids.ability],
    ])
    expect(
      result.causes
        .filter(cause => cause.entityId === ids.mandatory)
        .map(cause => cause.entityPath)
    ).toEqual([
      [ids.formation, ids.ability, ids.mandatory],
      [ids.unit, ids.ability, ids.mandatory],
    ])
  })

  it('keeps same-named entities distinct and resolves only the selected ID', () => {
    const result = resolveSelection(createCatalog(), {
      explicitIds: [ids.sameNameAbility],
      rulesContextId: contextIds.standard,
    })

    expect(result.selectedIds).toEqual([ids.sameNameAbility])
    expect(result.selectedIds).not.toContain(ids.ability)
  })

  it('reports missing selections, dangling edges, cycles, and exclusions', () => {
    const catalog = createCatalog()
    catalog.relationships.push(
      {
        id: 'relationship:dangling-target',
        kind: 'includes',
        from: ids.unit,
        to: ids.missing,
      },
      {
        id: 'relationship:mandatory-cycles-to-unit',
        kind: 'requires',
        from: ids.mandatory,
        to: ids.unit,
      }
    )

    const result = resolveSelection(catalog, {
      explicitIds: [ids.missing, ids.unit, ids.excluded],
      rulesContextId: contextIds.standard,
    })

    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining([
        'missing-explicit-selection',
        'dangling-relationship-target',
        'relationship-cycle',
        'excluded-selection',
      ])
    )
  })

  it('does not cross rules-context boundaries', () => {
    const catalog = createCatalog()
    catalog.relationships.push({
      id: 'relationship:invalid-standard-to-spearhead',
      kind: 'includes',
      from: ids.unit,
      to: ids.spearheadOnly,
      rulesContextIds: [contextIds.standard],
    })
    const result = resolveSelection(catalog, {
      explicitIds: [ids.unit, ids.spearheadOnly],
      rulesContextId: contextIds.standard,
    })

    expect(result.selectedIds).not.toContain(ids.spearheadOnly)
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining(['inapplicable-explicit-selection', 'inapplicable-relationship-target'])
    )
  })

  it('overlays Legends content only when the document opts in', () => {
    const catalog = createCatalog()
    const legendsContext = rulesContextId('30000000-0000-4000-8000-000000000013')
    const legendsAbility = contentGroupId('30000000-0000-4000-8000-000000000014')
    catalog.rulesContexts.push({
      id: legendsContext,
      name: 'Legends',
      mode: 'other',
      status: 'legends',
      publicationIds: [],
    })
    catalog.entities.push(entity(legendsAbility, 'Legends Ability', [legendsContext]))
    catalog.relationships.push({
      id: 'relationship:unit-includes-legends',
      kind: 'includes',
      from: ids.unit,
      to: legendsAbility,
      rulesContextIds: [legendsContext],
    })

    const withoutOptIn = resolveSelection(catalog, {
      explicitIds: [ids.unit, legendsAbility],
      rulesContextId: contextIds.standard,
    })
    const withOptIn = resolveSelection(catalog, {
      explicitIds: [ids.unit, legendsAbility],
      rulesContextId: contextIds.standard,
      allowsLegends: true,
    })

    expect(withoutOptIn.selectedIds).not.toContain(legendsAbility)
    expect(withoutOptIn.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
      expect.arrayContaining(['inapplicable-explicit-selection'])
    )
    expect(withOptIn.explicitIds).toContain(legendsAbility)
    expect(withOptIn.selectedIds).toContain(legendsAbility)
    expect(withOptIn.diagnostics).toEqual([])
  })

  it('is deterministic when entity, relationship, and input order changes', () => {
    const catalog = createCatalog()
    const reorderedCatalog: Aos4Catalog = {
      ...catalog,
      entities: [...catalog.entities].reverse(),
      relationships: [...catalog.relationships].reverse(),
    }

    const first = resolveSelection(catalog, {
      explicitIds: [ids.unit, ids.formation, ids.faction],
      rulesContextId: contextIds.standard,
    })
    const second = resolveSelection(reorderedCatalog, {
      explicitIds: [ids.faction, ids.formation, ids.unit],
      rulesContextId: contextIds.standard,
    })

    expect(second).toEqual(first)
  })

  it('deduplicates explicit IDs and reports relationship contexts that do not exist', () => {
    const catalog = createCatalog()
    const missingContext = rulesContextId('30000000-0000-4000-8000-000000000012')
    catalog.relationships.push({
      id: 'relationship:missing-context',
      kind: 'includes',
      from: ids.unit,
      to: ids.ability,
      rulesContextIds: [missingContext],
    })

    const result = resolveSelection(catalog, {
      explicitIds: [ids.unit, ids.unit],
      rulesContextId: contextIds.standard,
    })

    expect(result.explicitIds).toEqual([ids.unit])
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing-relationship-context',
          rulesContextId: missingContext,
        }),
      ])
    )
  })
})
