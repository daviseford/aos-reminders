import {
  AOS4_CATALOG_SCHEMA_VERSION,
  contentGroupId,
  factionId,
  rulesContextId,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
} from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated/corpus'
import { prepareSelectionCatalog, resolvePreparedSelection, resolveSelection } from '../../aos4/select'

const standard = rulesContextId('31000000-0000-4000-8000-000000000001')
const legends = rulesContextId('31000000-0000-4000-8000-000000000002')
const ids = {
  faction: factionId('31000000-0000-4000-8000-000000000003'),
  formation: contentGroupId('31000000-0000-4000-8000-000000000004'),
  ability: contentGroupId('31000000-0000-4000-8000-000000000005'),
  legendsUnit: contentGroupId('31000000-0000-4000-8000-000000000006'),
  late: contentGroupId('31000000-0000-4000-8000-000000000007'),
}

const group = (id: CanonicalId<'content-group'>, rulesContextIds = [standard]): ContentEntity => ({
  id,
  kind: 'content-group',
  revision: 'fixture-1',
  name: id,
  groupType: 'fixture',
  rulesContextIds,
  sourceRefs: [],
})

const createCatalog = (): Aos4Catalog => ({
  schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
  generatedAt: '2026-11-04T12:00:00.000Z',
  rulesContexts: [
    { id: standard, name: 'Standard', mode: 'standard', status: 'current', publicationIds: [] },
    { id: legends, name: 'Legends', mode: 'standard', status: 'legends', publicationIds: [] },
  ],
  sourceArtifacts: [],
  sourceRecords: [],
  entities: [
    {
      id: ids.faction,
      kind: 'faction',
      revision: 'fixture-1',
      name: 'Fixture Faction',
      rulesContextIds: [standard],
      sourceRefs: [],
    },
    group(ids.formation),
    group(ids.ability),
    group(ids.legendsUnit, [legends]),
  ],
  relationships: [
    { id: 'relationship:faction-offers-formation', kind: 'offers', from: ids.faction, to: ids.formation },
    { id: 'relationship:faction-offers-legends', kind: 'offers', from: ids.faction, to: ids.legendsUnit },
    { id: 'relationship:formation-includes-ability', kind: 'includes', from: ids.formation, to: ids.ability },
    { id: 'relationship:ability-includes-formation', kind: 'includes', from: ids.ability, to: ids.formation },
    {
      id: 'relationship:dangling',
      kind: 'includes',
      from: ids.faction,
      to: contentGroupId('31000000-0000-4000-8000-0000000000ff'),
    },
    {
      id: 'relationship:ghost-context',
      kind: 'offers',
      from: ids.faction,
      to: ids.ability,
      rulesContextIds: [rulesContextId('31000000-0000-4000-8000-0000000000fe')],
    },
  ],
})

const overlays = [
  {},
  { allowsLegends: true },
  { allowsHistorical: true },
  { allowsLegends: true, allowsHistorical: true },
]

describe('prepared selection catalog', () => {
  it('resolves the runtime catalog exactly as a one-shot resolve does, for every overlay', () => {
    const prepared = prepareSelectionCatalog(AOS4_CATALOG)
    const factions = AOS4_CATALOG.entities.filter(entity => entity.kind === 'faction').slice(0, 3)

    factions.forEach(faction => {
      const offered = resolveSelection(AOS4_CATALOG, {
        explicitIds: [faction.id],
        rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        allowsLegends: true,
        allowsHistorical: true,
      }).availableIds
      overlays.forEach(overlay => {
        const input = {
          explicitIds: [faction.id, ...offered.slice(0, 12)],
          rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
          ...overlay,
        }
        expect(resolvePreparedSelection(prepared, input)).toEqual(resolveSelection(AOS4_CATALOG, input))
      })
    })
  })

  it('keeps cycle, dangling and missing-context diagnostics identical to a one-shot resolve', () => {
    const catalog = createCatalog()
    const prepared = prepareSelectionCatalog(catalog)

    overlays.forEach(overlay => {
      const input = { explicitIds: [ids.faction, ids.formation], rulesContextId: standard, ...overlay }
      const fresh = resolveSelection(catalog, input)
      expect(resolvePreparedSelection(prepared, input)).toEqual(fresh)
      expect(fresh.diagnostics.map(diagnostic => diagnostic.code)).toEqual(
        expect.arrayContaining([
          'dangling-relationship-target',
          'missing-relationship-context',
          'relationship-cycle',
        ])
      )
    })
  })

  it('lets a one-shot resolve see a catalog mutated in place, while a prepared snapshot waits to be re-prepared', () => {
    const catalog = createCatalog()
    const input = { explicitIds: [ids.faction], rulesContextId: standard }
    const snapshot = prepareSelectionCatalog(catalog)
    expect(resolveSelection(catalog, input).availableIds).not.toContain(ids.late)

    catalog.entities.push(group(ids.late))
    catalog.relationships.push({
      id: 'relationship:faction-offers-late',
      kind: 'offers',
      from: ids.faction,
      to: ids.late,
    })

    expect(resolveSelection(catalog, input).availableIds).toContain(ids.late)
    expect(resolvePreparedSelection(snapshot, input).availableIds).not.toContain(ids.late)
    expect(resolvePreparedSelection(prepareSelectionCatalog(catalog), input)).toEqual(
      resolveSelection(catalog, input)
    )
  })

  it('never answers one catalog from another catalog’s prepared state', () => {
    const first = createCatalog()
    const second = createCatalog()
    second.relationships = second.relationships.filter(
      relationship => relationship.id !== 'relationship:faction-offers-formation'
    )
    const input = { explicitIds: [ids.faction], rulesContextId: standard }
    const preparedFirst = prepareSelectionCatalog(first)
    const preparedSecond = prepareSelectionCatalog(second)

    expect(resolvePreparedSelection(preparedFirst, input)).toEqual(resolveSelection(first, input))
    expect(resolvePreparedSelection(preparedSecond, input)).toEqual(resolveSelection(second, input))
    expect(resolvePreparedSelection(preparedSecond, input).availableIds).not.toContain(ids.formation)
  })

  it('hands every result its own diagnostics, so tampering cannot leak into a later resolve', () => {
    const catalog = createCatalog()
    const prepared = prepareSelectionCatalog(catalog)
    const input = { explicitIds: [ids.faction, ids.formation], rulesContextId: standard }
    const expected = resolveSelection(catalog, input)

    const tampered = resolvePreparedSelection(prepared, input)
    tampered.diagnostics.forEach(diagnostic => {
      diagnostic.message = 'tampered'
      diagnostic.entityIds?.push(ids.late)
    })

    expect(resolvePreparedSelection(prepared, input)).toEqual(expected)
  })
})
