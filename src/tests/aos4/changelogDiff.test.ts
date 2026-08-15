import {
  AOS4_CATALOG_SCHEMA_VERSION,
  abilityId,
  battleProfileId,
  contentGroupId,
  factionId,
  publicationId,
  rulesContextId,
  sourceRecordId,
  warscrollId,
  type Ability,
  type AbilityTiming,
  type Aos4Catalog,
  type BattleProfile,
  type CanonicalId,
  type ContentEntity,
  type ContentRelationship,
  type Warscroll,
} from '../../aos4/domain'
import { createRuntimeProjection, serializeRuntimeProjection } from '../../aos4/generate'
import { diffAos4Catalogs, type ChangelogAcceptance } from '../../aos4/changelog'
import { inflateRuntimeProjection } from '../../aos4/runtimeProjection/inflate'

const CTX = rulesContextId('90000000-0000-4000-8000-000000000001')
const RECORD_ID = sourceRecordId('fixture', 'record')

const FACTION_A = factionId('00000000-0000-4000-8000-00000000000a')
const FACTION_B = factionId('00000000-0000-4000-8000-00000000000b')
const WARSCROLL_LIBERATORS = warscrollId('00000000-0000-4000-8000-000000000010')
const PROFILE_LIBERATORS = battleProfileId('00000000-0000-4000-8000-000000000011')
const ABILITY_SHIELD_WALL = abilityId('00000000-0000-4000-8000-000000000012')
const GROUP_FORMATION = contentGroupId('00000000-0000-4000-8000-000000000013')
const ABILITY_FORMATION = abilityId('00000000-0000-4000-8000-000000000014')
const GROUP_UNIVERSAL = contentGroupId('00000000-0000-4000-8000-000000000015')
const ABILITY_CORE = abilityId('00000000-0000-4000-8000-000000000016')
const PUBLICATION_BATTLESCROLL = publicationId('00000000-0000-4000-8000-000000000020')
const PUBLICATION_FAQ = publicationId('00000000-0000-4000-8000-000000000021')

const provenance = () => ({
  revision: 'fixture',
  rulesContextIds: [CTX],
  sourceRefs: [{ sourceRecordId: RECORD_ID }],
})

const heroTiming: AbilityTiming = {
  kind: 'active',
  window: { kind: 'turn-phase', phase: 'hero' },
  raw: 'Your Hero Phase',
}

const ability = (
  id: CanonicalId<'ability'>,
  name: string,
  effect: string,
  timings: AbilityTiming[] = []
): Ability => ({
  id,
  kind: 'ability',
  name,
  abilityKind: 'active',
  actor: 'unit',
  text: { effect },
  timings,
  keywords: [],
  ...provenance(),
})

const relationship = (
  index: number,
  kind: ContentRelationship['kind'],
  from: CanonicalId,
  to: CanonicalId
): ContentRelationship => ({ id: `relationship:fixture-${index}`, kind, from, to })

const buildCatalog = (mutate?: (catalog: Aos4Catalog) => void): Aos4Catalog => {
  const entities: ContentEntity[] = [
    { id: FACTION_A, kind: 'faction', name: 'Fixture Host', ...provenance() },
    { id: FACTION_B, kind: 'faction', name: 'Second Host', ...provenance() },
    {
      id: WARSCROLL_LIBERATORS,
      kind: 'warscroll',
      name: 'Liberators',
      factionIds: [FACTION_A],
      keywords: ['INFANTRY'],
      characteristics: { move: '5"', save: '3+', control: '1', health: '2' },
      ...provenance(),
    },
    {
      id: PROFILE_LIBERATORS,
      kind: 'battle-profile',
      name: 'Liberators',
      warscrollId: WARSCROLL_LIBERATORS,
      unitSize: 5,
      points: 90,
      baseSizes: ['40mm'],
      regimentOptions: [],
      notes: [],
      ...provenance(),
    },
    ability(ABILITY_SHIELD_WALL, 'Shield Wall', 'Add 1 to save rolls for this unit.', [heroTiming]),
    {
      id: GROUP_FORMATION,
      kind: 'content-group',
      groupType: 'battle-formation',
      name: 'Fixture Formation',
      ...provenance(),
    },
    ability(ABILITY_FORMATION, 'Formation Drill', 'Formation units gain a drill bonus.'),
    {
      id: GROUP_UNIVERSAL,
      kind: 'content-group',
      groupType: 'core-rules',
      name: 'Universal Core',
      ...provenance(),
    },
    ability(ABILITY_CORE, 'Normal Move', 'The unit can move.'),
  ]
  const relationships: ContentRelationship[] = [
    relationship(1, 'offers', FACTION_A, WARSCROLL_LIBERATORS),
    relationship(2, 'includes', WARSCROLL_LIBERATORS, PROFILE_LIBERATORS),
    relationship(3, 'includes', WARSCROLL_LIBERATORS, ABILITY_SHIELD_WALL),
    relationship(4, 'offers', FACTION_A, GROUP_FORMATION),
    relationship(5, 'includes', GROUP_FORMATION, ABILITY_FORMATION),
    relationship(6, 'includes', FACTION_A, GROUP_UNIVERSAL),
    relationship(7, 'includes', FACTION_B, GROUP_UNIVERSAL),
    relationship(8, 'includes', GROUP_UNIVERSAL, ABILITY_CORE),
  ]
  const catalog: Aos4Catalog = {
    schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
    generatedAt: '2026-08-01T00:00:00.000Z',
    rulesContexts: [
      { id: CTX, name: 'Fixture context', mode: 'standard', status: 'current', publicationIds: [] },
    ],
    sourceArtifacts: [],
    sourceRecords: [],
    entities,
    relationships,
  }
  mutate?.(catalog)
  return catalog
}

const getAbility = (catalog: Aos4Catalog, id: CanonicalId<'ability'>): Ability =>
  catalog.entities.find(entity => entity.id === id) as Ability

const getProfile = (catalog: Aos4Catalog): BattleProfile =>
  catalog.entities.find(entity => entity.id === PROFILE_LIBERATORS) as BattleProfile

const getWarscroll = (catalog: Aos4Catalog): Warscroll =>
  catalog.entities.find(entity => entity.id === WARSCROLL_LIBERATORS) as Warscroll

const removeEntity = (catalog: Aos4Catalog, id: CanonicalId): void => {
  catalog.entities = catalog.entities.filter(entity => entity.id !== id)
  catalog.relationships = catalog.relationships.filter(edge => edge.from !== id && edge.to !== id)
}

const acceptance = (override: Partial<ChangelogAcceptance> = {}): ChangelogAcceptance => ({
  publications: [
    {
      publicationId: PUBLICATION_BATTLESCROLL,
      name: 'Battlescroll Fixture',
      source: 'games-workshop',
      effectiveDate: '2026-08-10',
    },
  ],
  cohorts: [{ name: 'battlescroll', disposition: 'rules-driven' }],
  ...override,
})

describe('AoS 4 changelog diff', () => {
  it('reports a modified ability effect as one old-to-new field change', () => {
    const current = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Add 2 to save rolls for this unit.' }
    })

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'modified',
        entityId: ABILITY_SHIELD_WALL,
        entityKind: 'ability',
        name: 'Shield Wall',
        predicate: { kind: 'warscroll', warscrollId: WARSCROLL_LIBERATORS },
        attribution: {
          kind: 'publication',
          publicationId: PUBLICATION_BATTLESCROLL,
          name: 'Battlescroll Fixture',
          source: 'games-workshop',
          effectiveDate: '2026-08-10',
        },
        fields: [
          {
            field: 'text.effect',
            previous: 'Add 1 to save rolls for this unit.',
            next: 'Add 2 to save rolls for this unit.',
          },
        ],
      }),
    ])
  })

  it('reports a removed warscroll ability with its owning warscroll and removed text', () => {
    const current = buildCatalog(catalog => removeEntity(catalog, ABILITY_SHIELD_WALL))

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'removed',
        entityId: ABILITY_SHIELD_WALL,
        entityKind: 'ability',
        name: 'Shield Wall',
        predicate: { kind: 'warscroll', warscrollId: WARSCROLL_LIBERATORS },
        ownership: expect.objectContaining({
          factionIds: [FACTION_A],
          warscrollId: WARSCROLL_LIBERATORS,
        }),
        removedFacts: expect.objectContaining({ 'text.effect': 'Add 1 to save rolls for this unit.' }),
      }),
    ])
  })

  it('reports a battle-profile points change as a numeric old-to-new delta', () => {
    const current = buildCatalog(catalog => {
      getProfile(catalog).points = 100
    })

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'modified',
        entityId: PROFILE_LIBERATORS,
        entityKind: 'battle-profile',
        predicate: { kind: 'warscroll', warscrollId: WARSCROLL_LIBERATORS },
        fields: [{ field: 'points', previous: 90, next: 100 }],
      }),
    ])
  })

  it('reports a rename as a modified record, never as removed plus added', () => {
    const current = buildCatalog(catalog => {
      getWarscroll(catalog).name = 'Liberator Host'
    })

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'modified',
        entityId: WARSCROLL_LIBERATORS,
        name: 'Liberator Host',
        fields: [{ field: 'name', previous: 'Liberators', next: 'Liberator Host' }],
      }),
    ])
  })

  it('emits no record for identical canonical fields, including wording-noise-only timing changes', () => {
    expect(diffAos4Catalogs(buildCatalog(), buildCatalog(), acceptance()).records).toEqual([])

    const noisy = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).timings = [{ ...heroTiming, raw: 'Any Hero Phase' }]
    })
    expect(diffAos4Catalogs(buildCatalog(), noisy, acceptance()).records).toEqual([])
  })

  it('reports a timing change with the old and new canonical timing', () => {
    const current = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).timings = [
        { kind: 'active', window: { kind: 'turn-phase', phase: 'combat' }, raw: 'Any Combat Phase' },
      ]
    })

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'modified',
        entityId: ABILITY_SHIELD_WALL,
        fields: [
          {
            field: 'timings',
            previous: [{ kind: 'active', window: { kind: 'turn-phase', phase: 'hero' } }],
            next: [{ kind: 'active', window: { kind: 'turn-phase', phase: 'combat' } }],
          },
        ],
      }),
    ])
  })

  it('labels correction-dispositioned cohorts without publication attribution', () => {
    const current = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Corrected transcription.' }
    })

    const artifact = diffAos4Catalogs(
      buildCatalog(),
      current,
      acceptance({ cohorts: [{ name: 'wahapedia-transcription', disposition: 'correction' }] })
    )

    expect(artifact.records).toEqual([
      expect.objectContaining({
        changeKind: 'modified',
        entityId: ABILITY_SHIELD_WALL,
        attribution: { kind: 'correction' },
      }),
    ])
  })

  it('excludes churn-dispositioned cohorts entirely', () => {
    const current = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Regenerated identical rules text.' }
      getProfile(catalog).points = 95
    })

    const artifact = diffAos4Catalogs(
      buildCatalog(),
      current,
      acceptance({ cohorts: [{ name: 'serialization-churn', disposition: 'churn' }] })
    )

    expect(artifact.records).toEqual([])
  })

  it('derives universal and content-group selection predicates from the prior relationship graph', () => {
    const current = buildCatalog(catalog => {
      removeEntity(catalog, ABILITY_CORE)
      removeEntity(catalog, ABILITY_FORMATION)
    })

    const artifact = diffAos4Catalogs(buildCatalog(), current, acceptance())

    expect(artifact.records).toHaveLength(2)
    expect(artifact.records.find(record => record.entityId === ABILITY_CORE)).toMatchObject({
      changeKind: 'removed',
      predicate: 'universal',
    })
    expect(artifact.records.find(record => record.entityId === ABILITY_FORMATION)).toMatchObject({
      changeKind: 'removed',
      predicate: {
        kind: 'content-group',
        contentGroupId: GROUP_FORMATION,
        autoGrantedByFactionIds: [],
      },
      ownership: expect.objectContaining({ contentGroupIds: [GROUP_FORMATION] }),
    })
  })

  it('attributes each rules-driven record to exactly one publication and fails closed otherwise', () => {
    const multiPublication = (
      battlescrollSelector: NonNullable<ChangelogAcceptance['publications'][number]['selector']>,
      faqSelector: NonNullable<ChangelogAcceptance['publications'][number]['selector']>
    ): ChangelogAcceptance => ({
      publications: [
        {
          publicationId: PUBLICATION_BATTLESCROLL,
          name: 'Battlescroll Fixture',
          source: 'games-workshop',
          selector: battlescrollSelector,
        },
        {
          publicationId: PUBLICATION_FAQ,
          name: 'FAQ Fixture',
          source: 'games-workshop',
          selector: faqSelector,
        },
      ],
      cohorts: [{ name: 'august-drop', disposition: 'rules-driven' }],
    })

    const current = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Battlescroll change.' }
      getAbility(catalog, ABILITY_FORMATION).text = { effect: 'FAQ change.' }
    })

    const artifact = diffAos4Catalogs(
      buildCatalog(),
      current,
      multiPublication({ warscrollIds: [WARSCROLL_LIBERATORS] }, { entityIds: [ABILITY_FORMATION] })
    )
    expect(
      artifact.records.map(record => [
        record.entityId,
        record.attribution.kind === 'publication' ? record.attribution.publicationId : 'correction',
      ])
    ).toEqual([
      [ABILITY_SHIELD_WALL, PUBLICATION_BATTLESCROLL],
      [ABILITY_FORMATION, PUBLICATION_FAQ],
    ])

    const unmatched = buildCatalog(catalog => removeEntity(catalog, ABILITY_CORE))
    expect(() =>
      diffAos4Catalogs(
        buildCatalog(),
        unmatched,
        multiPublication({ warscrollIds: [WARSCROLL_LIBERATORS] }, { entityIds: [ABILITY_FORMATION] })
      )
    ).toThrow(`Rules-driven change for ${ABILITY_CORE} matched 0 publication selectors`)

    const ambiguous = buildCatalog(catalog => {
      getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Ambiguous change.' }
    })
    expect(() =>
      diffAos4Catalogs(
        buildCatalog(),
        ambiguous,
        multiPublication({ warscrollIds: [WARSCROLL_LIBERATORS] }, { entityIds: [ABILITY_SHIELD_WALL] })
      )
    ).toThrow(`Rules-driven change for ${ABILITY_SHIELD_WALL} matched 2 publication selectors`)
  })

  it('produces byte-identical output for identical inputs', () => {
    const run = () =>
      diffAos4Catalogs(
        buildCatalog(),
        buildCatalog(catalog => {
          getAbility(catalog, ABILITY_SHIELD_WALL).text = { effect: 'Add 2 to save rolls for this unit.' }
          getProfile(catalog).points = 110
          removeEntity(catalog, ABILITY_FORMATION)
        }),
        acceptance()
      )

    expect(run()).toEqual(run())
    expect(JSON.stringify(run())).toBe(JSON.stringify(run()))
  })
})

describe('AoS 4 runtime projection inflation', () => {
  const projected = (): unknown =>
    JSON.parse(serializeRuntimeProjection(createRuntimeProjection(buildCatalog(), 'Powered by Wahapedia')))

  it('inflates a validated projection into the catalog shape', () => {
    const inflated = inflateRuntimeProjection(projected())

    expect(inflated.catalog.schemaVersion).toBe(AOS4_CATALOG_SCHEMA_VERSION)
    expect(inflated.projection.attribution).toBe('Powered by Wahapedia')
    expect(inflated.catalog.entities.map(entity => entity.id).sort()).toEqual(
      buildCatalog()
        .entities.map(entity => entity.id)
        .sort()
    )
    expect(inflated.catalog.entities.find(entity => entity.id === ABILITY_SHIELD_WALL)).toMatchObject({
      kind: 'ability',
      name: 'Shield Wall',
      text: { effect: 'Add 1 to save rolls for this unit.' },
    })
    expect(inflated.catalog.relationships).toHaveLength(8)
  })

  it('fails closed on an unsupported catalog schema version', () => {
    const stale = { ...(projected() as Record<string, unknown>), catalogSchemaVersion: 2 }
    expect(() => inflateRuntimeProjection(stale)).toThrow(/unsupported catalog schema version 2/)
  })

  it('fails closed on an unsupported projection schema version or a malformed projection', () => {
    const wrong = { ...(projected() as Record<string, unknown>), schemaVersion: 99 }
    expect(() => inflateRuntimeProjection(wrong)).toThrow(/unsupported projection schema version 99/)
    expect(() => inflateRuntimeProjection(null)).toThrow(/must be an object/)
    expect(() =>
      inflateRuntimeProjection({ ...(projected() as Record<string, unknown>), entities: 'nope' })
    ).toThrow(/entities must be an array/)
  })
})
