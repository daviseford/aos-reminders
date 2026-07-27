import {
  AOS4_CATALOG_SCHEMA_VERSION,
  TURN_PHASES,
  abilityId,
  artifactId,
  contentGroupId,
  createUnknownSourceClassification,
  factionId,
  publicationId,
  rulesContextId,
  sourceRecordId,
  validateCatalog,
  warscrollId,
  weaponId,
} from '../../aos4/domain'
import type {
  Ability,
  Aos4Catalog,
  ContentRelationship,
  Faction,
  RulesContext,
  SourceArtifact,
  SourceRecord,
  Warscroll,
  Weapon,
} from '../../aos4/domain'

const ids = {
  ability: abilityId('10000000-0000-4000-8000-000000000001'),
  artifact: artifactId('a'.repeat(64)),
  contentGroup: contentGroupId('10000000-0000-4000-8000-000000000002'),
  faction: factionId('10000000-0000-4000-8000-000000000003'),
  publication: publicationId('10000000-0000-4000-8000-000000000004'),
  rulesContext: rulesContextId('10000000-0000-4000-8000-000000000005'),
  sourceRecord: sourceRecordId('wahapedia', 'ability-1'),
  warscroll: warscrollId('10000000-0000-4000-8000-000000000006'),
  weapon: weaponId('10000000-0000-4000-8000-000000000007'),
}

const sourceArtifact: SourceArtifact = {
  id: ids.artifact,
  publisher: 'wahapedia',
  authority: { kind: 'secondary' },
  title: 'Representative fixture',
  edition: '4',
  language: 'en',
  retrievedAt: '2026-07-27T12:00:00.000Z',
  sourceUrl: 'https://wahapedia.ru/aos4/Warscrolls_abilities.csv',
  checksum: 'a'.repeat(64),
  mediaType: 'text/csv',
}

const sourceRecord: SourceRecord = {
  id: ids.sourceRecord,
  artifactId: ids.artifact,
  locator: { kind: 'row', row: 2 },
  recordChecksum: 'b'.repeat(64),
  rulesContextIds: [ids.rulesContext],
}

const standardContext: RulesContext = {
  id: ids.rulesContext,
  name: 'Standard matched play',
  mode: 'standard',
  status: 'current',
  publicationIds: [ids.publication],
}

const sourceReference = { sourceRecordId: ids.sourceRecord }

const faction: Faction = {
  id: ids.faction,
  kind: 'faction',
  revision: '1',
  name: 'Fixture Faction',
  rulesContextIds: [ids.rulesContext],
  sourceRefs: [sourceReference],
}

const warscroll: Warscroll = {
  id: ids.warscroll,
  kind: 'warscroll',
  revision: '1',
  name: 'Fixture Unit',
  factionIds: [ids.faction],
  keywords: ['HERO', 'INFANTRY'],
  rulesContextIds: [ids.rulesContext],
  sourceRefs: [sourceReference],
}

const ability: Ability = {
  id: ids.ability,
  kind: 'ability',
  revision: '1',
  name: 'Reactive Shield',
  abilityKind: 'reaction',
  actor: 'unit',
  text: {
    reactionTrigger: 'An enemy declares an ATTACK ability that targets this unit.',
    effect: 'Subtract 1 from hit rolls for that ability.',
  },
  timings: [
    {
      kind: 'reaction',
      window: { kind: 'turn-phase', phase: 'shooting' },
      perspective: 'enemy',
      raw: 'Reaction: Enemy Shooting Phase',
    },
  ],
  keywords: ['REACTION'],
  rulesContextIds: [ids.rulesContext],
  sourceRefs: [sourceReference],
}

const weapon: Weapon = {
  id: ids.weapon,
  kind: 'weapon',
  revision: '1',
  name: 'Fixture Blade',
  weaponType: 'melee',
  profile: {
    attacks: '2',
    hit: '3+',
    wound: '4+',
    rend: '1',
    damage: 'D3',
  },
  keywords: [{ kind: 'crit-two-hits', raw: 'Crit (2 Hits)' }],
  rulesContextIds: [ids.rulesContext],
  sourceRefs: [sourceReference],
}

const relationships: ContentRelationship[] = [
  {
    id: 'relationship:faction-warscroll',
    kind: 'offers',
    from: ids.faction,
    to: ids.warscroll,
  },
  {
    id: 'relationship:warscroll-ability',
    kind: 'includes',
    from: ids.warscroll,
    to: ids.ability,
  },
  {
    id: 'relationship:warscroll-weapon',
    kind: 'includes',
    from: ids.warscroll,
    to: ids.weapon,
  },
]

const createCatalog = (): Aos4Catalog => ({
  schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
  generatedAt: '2026-07-27T12:00:00.000Z',
  rulesContexts: [{ ...standardContext, publicationIds: [...standardContext.publicationIds] }],
  sourceArtifacts: [{ ...sourceArtifact }],
  sourceRecords: [{ ...sourceRecord, rulesContextIds: [...sourceRecord.rulesContextIds] }],
  entities: [
    {
      id: ids.publication,
      kind: 'publication',
      revision: '1',
      name: 'Fixture Publication',
      publisher: 'games-workshop',
      rulesContextIds: [ids.rulesContext],
      sourceRefs: [sourceReference],
    },
    faction,
    {
      id: ids.contentGroup,
      kind: 'content-group',
      revision: '1',
      name: 'Battle Traits',
      groupType: 'battle-traits',
      rulesContextIds: [ids.rulesContext],
      sourceRefs: [sourceReference],
    },
    warscroll,
    ability,
    weapon,
  ],
  relationships: relationships.map(relationship => ({ ...relationship })),
})

describe('AoS 4 domain', () => {
  it('defines the seven turn phases in rules order', () => {
    expect(TURN_PHASES.map(phase => phase.id)).toEqual([
      'start-of-turn',
      'hero',
      'movement',
      'shooting',
      'charge',
      'combat',
      'end-of-turn',
    ])
    expect(TURN_PHASES.map(phase => phase.order)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('accepts representative active, passive, reaction, deployment, and weapon shapes', () => {
    const catalog = createCatalog()
    catalog.entities.push(
      {
        ...ability,
        id: abilityId('10000000-0000-4000-8000-000000000008'),
        name: 'Passive Ward',
        abilityKind: 'passive',
        text: { effect: 'This unit has WARD (6+).' },
        timings: [{ kind: 'passive', window: { kind: 'always' }, raw: 'Passive' }],
      },
      {
        ...ability,
        id: abilityId('10000000-0000-4000-8000-000000000009'),
        name: 'Deploy the Host',
        abilityKind: 'active',
        text: { declare: 'Pick this unit.', effect: 'Deploy this unit.' },
        timings: [
          {
            kind: 'active',
            window: { kind: 'deployment' },
            perspective: 'any',
            usage: { limit: 1, period: 'battle', scope: 'army' },
            raw: 'Deployment Phase, Once Per Battle (Army)',
          },
        ],
      },
      {
        ...ability,
        id: abilityId('10000000-0000-4000-8000-000000000014'),
        name: 'Unclassified Timing',
        abilityKind: 'active',
        text: { effect: 'Retain this rule for curator review.' },
        timings: [{ kind: 'active', window: { kind: 'unknown' }, raw: 'After mustering' }],
      }
    )

    expect(validateCatalog(catalog)).toEqual([])
  })

  it('keeps parallel rules contexts distinct', () => {
    const catalog = createCatalog()
    catalog.rulesContexts.push({
      ...standardContext,
      id: rulesContextId('10000000-0000-4000-8000-000000000010'),
      name: 'Spearhead',
      mode: 'spearhead',
    })

    expect(validateCatalog(catalog)).toEqual([])
  })

  it('reports duplicate entity IDs, dangling provenance, relationships, and rules contexts', () => {
    const catalog = createCatalog()
    catalog.entities.push({ ...faction })
    catalog.entities.push({
      ...ability,
      id: abilityId('10000000-0000-4000-8000-000000000011'),
      sourceRefs: [{ sourceRecordId: sourceRecordId('wahapedia', 'missing') }],
      rulesContextIds: [rulesContextId('10000000-0000-4000-8000-000000000012')],
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'battleshock' as never },
          raw: 'Battleshock Phase',
        },
      ],
    })
    catalog.relationships.push({
      id: 'relationship:missing-target',
      kind: 'requires',
      from: ids.faction,
      to: abilityId('10000000-0000-4000-8000-000000000013'),
      rulesContextIds: [rulesContextId('10000000-0000-4000-8000-000000000014')],
    })

    expect(validateCatalog(catalog).map(issue => issue.code)).toEqual([
      'duplicate-entity-id',
      'missing-source-record',
      'missing-rules-context',
      'invalid-turn-phase',
      'missing-relationship-target',
      'missing-relationship-rules-context',
    ])
  })

  it('retains raw source vocabulary when a classification is unknown', () => {
    expect(createUnknownSourceClassification('Fan-made compendium')).toEqual({
      kind: 'unknown',
      raw: 'Fan-made compendium',
    })
  })

  it('validates source applicability and required entity fields', () => {
    const catalog = createCatalog()
    const missingContext = rulesContextId('10000000-0000-4000-8000-000000000012')
    const missingPublication = publicationId('10000000-0000-4000-8000-000000000013')

    catalog.sourceRecords[0].rulesContextIds = [missingContext]
    catalog.rulesContexts[0].publicationIds = [missingPublication]
    catalog.entities.push({
      ...ability,
      id: abilityId('10000000-0000-4000-8000-000000000015'),
      text: { effect: '' },
      sourceRefs: [],
    })
    catalog.entities.push({
      ...weapon,
      id: weaponId('10000000-0000-4000-8000-000000000016'),
      profile: { ...weapon.profile, attacks: '' },
    })

    expect(validateCatalog(catalog).map(issue => issue.code)).toEqual(
      expect.arrayContaining([
        'missing-source-record-rules-context',
        'missing-rules-context-publication',
        'missing-entity-provenance',
        'missing-ability-effect',
        'invalid-weapon-profile',
      ])
    )
  })

  it('rejects malformed canonical, artifact, and rules-context IDs', () => {
    expect(() => abilityId('not-a-uuid')).toThrow('Invalid ability UUID')
    expect(() => artifactId('not-a-checksum')).toThrow('Invalid artifact SHA-256 checksum')
    expect(() => rulesContextId('not-a-uuid')).toThrow('Invalid rules context UUID')
  })
})
