import {
  AOS4_CATALOG_SCHEMA_VERSION,
  abilityId,
  contentGroupId,
  rulesContextId,
  sourceRecordId,
  type Ability,
  type AbilityTiming,
  type Aos4Catalog,
  type CanonicalId,
  type ContentEntity,
  type SourceReference,
} from '../../aos4/domain'
import {
  projectReminders,
  reminderOccurrenceId,
  semanticTimingKey,
} from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

const contextId = rulesContextId('40000000-0000-4000-8000-000000000001')

const ids = {
  army: contentGroupId('40000000-0000-4000-8000-000000000002'),
  unitA: contentGroupId('40000000-0000-4000-8000-000000000003'),
  unitB: contentGroupId('40000000-0000-4000-8000-000000000004'),
  matrix: abilityId('40000000-0000-4000-8000-000000000005'),
  reaction: abilityId('40000000-0000-4000-8000-000000000006'),
  passive: abilityId('40000000-0000-4000-8000-000000000007'),
  strikeFirst: abilityId('40000000-0000-4000-8000-000000000008'),
  strikeLast: abilityId('40000000-0000-4000-8000-000000000009'),
  sharedA: abilityId('40000000-0000-4000-8000-000000000010'),
  sharedB: abilityId('40000000-0000-4000-8000-000000000011'),
  unselected: abilityId('40000000-0000-4000-8000-000000000012'),
}

const refs = {
  matrix: { sourceRecordId: sourceRecordId('fixture', 'matrix') },
  sharedA: { sourceRecordId: sourceRecordId('fixture', 'shared-a') },
  sharedB: { sourceRecordId: sourceRecordId('fixture', 'shared-b') },
}

const entity = (
  id: CanonicalId<'content-group'>,
  name: string
): ContentEntity => ({
  id,
  kind: 'content-group',
  revision: 'fixture-1',
  name,
  groupType: 'fixture',
  rulesContextIds: [contextId],
  sourceRefs: [refs.matrix],
})

const ability = ({
  id,
  name,
  timings,
  abilityKind = 'active',
  sourceRefs = [refs.matrix],
  effect = `${name} effect`,
}: {
  id: CanonicalId<'ability'>
  name: string
  timings: AbilityTiming[]
  abilityKind?: Ability['abilityKind']
  sourceRefs?: SourceReference[]
  effect?: string
}): Ability => ({
  id,
  kind: 'ability',
  revision: 'fixture-1',
  name,
  abilityKind,
  actor: 'unit',
  text: {
    effect,
    ...(abilityKind === 'reaction' ? { reactionTrigger: 'A unit completes an action.' } : {}),
  },
  timings,
  keywords: [],
  rulesContextIds: [contextId],
  sourceRefs,
})

const phaseTimings: AbilityTiming[] = [
  { kind: 'active', window: { kind: 'battle-start' }, raw: 'Start of Battle' },
  { kind: 'active', window: { kind: 'deployment' }, raw: 'Deployment Phase' },
  { kind: 'active', window: { kind: 'battle-round-start' }, raw: 'Start of Battle Round' },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'start-of-turn' },
    perspective: 'your',
    raw: 'Your Start of Turn',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'hero' },
    perspective: 'your',
    raw: 'Your Hero Phase',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'movement' },
    perspective: 'your',
    raw: 'Your Movement Phase',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'shooting' },
    perspective: 'your',
    raw: 'Your Shooting Phase',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'charge' },
    perspective: 'your',
    raw: 'Your Charge Phase',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'combat' },
    perspective: 'any',
    priority: 'normal',
    raw: 'Any Combat Phase',
  },
  {
    kind: 'active',
    window: { kind: 'turn-phase', phase: 'end-of-turn' },
    perspective: 'your',
    raw: 'Your End of Turn',
  },
  { kind: 'active', window: { kind: 'battle-round-end' }, raw: 'End of Battle Round' },
  { kind: 'active', window: { kind: 'battle-end' }, raw: 'End of Battle' },
]

const sharedTiming: AbilityTiming = {
  kind: 'active',
  window: { kind: 'turn-phase', phase: 'combat' },
  perspective: 'any',
  raw: 'Any Combat Phase',
}

const createCatalog = (): Aos4Catalog => ({
  schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
  generatedAt: '2026-07-27T12:00:00.000Z',
  rulesContexts: [
    {
      id: contextId,
      name: 'Standard',
      mode: 'standard',
      status: 'current',
      publicationIds: [],
    },
  ],
  sourceArtifacts: [],
  sourceRecords: [],
  entities: [
    entity(ids.army, 'Army'),
    entity(ids.unitA, 'Unit A'),
    entity(ids.unitB, 'Unit B'),
    ability({ id: ids.matrix, name: 'Phase Matrix', timings: phaseTimings }),
    ability({
      id: ids.reaction,
      name: 'Reactive Move',
      abilityKind: 'reaction',
      timings: [
        {
          kind: 'reaction',
          window: { kind: 'turn-phase', phase: 'shooting' },
          perspective: 'enemy',
          raw: 'Enemy Shooting Phase',
        },
      ],
    }),
    ability({
      id: ids.passive,
      name: 'Unyielding',
      abilityKind: 'passive',
      timings: [{ kind: 'passive', window: { kind: 'always' }, raw: 'Passive' }],
    }),
    ability({
      id: ids.strikeFirst,
      name: 'Quick Strike',
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'combat' },
          priority: 'strike-first',
          raw: 'Any Combat Phase (Strike-first)',
        },
      ],
    }),
    ability({
      id: ids.strikeLast,
      name: 'Sluggish',
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'combat' },
          priority: 'strike-last',
          raw: 'Any Combat Phase (Strike-last)',
        },
      ],
    }),
    ability({
      id: ids.sharedA,
      name: 'Shared Ward',
      effect: 'Ignore the wound on a successful ward roll.',
      timings: [sharedTiming],
      sourceRefs: [refs.sharedA],
    }),
    ability({
      id: ids.sharedB,
      name: 'Shared Ward',
      effect: 'Ignore the wound on a successful ward roll.',
      timings: [sharedTiming],
      sourceRefs: [refs.sharedB],
    }),
    ability({
      id: ids.unselected,
      name: 'Not Selected',
      timings: [{ kind: 'active', window: { kind: 'battle-start' }, raw: 'Start of Battle' }],
    }),
  ],
  relationships: [
    {
      id: 'relationship:army-unit-a',
      kind: 'includes',
      from: ids.army,
      to: ids.unitA,
    },
    {
      id: 'relationship:army-unit-b',
      kind: 'includes',
      from: ids.army,
      to: ids.unitB,
    },
    ...[ids.matrix, ids.reaction, ids.passive, ids.strikeFirst, ids.strikeLast, ids.sharedA].map(
      (to, index) => ({
        id: `relationship:unit-a-ability-${index}` as const,
        kind: 'includes' as const,
        from: ids.unitA,
        to,
      })
    ),
    {
      id: 'relationship:unit-b-shared',
      kind: 'includes',
      from: ids.unitB,
      to: ids.sharedB,
    },
  ],
})

const projectCatalog = (catalog = createCatalog()) => {
  const selection = resolveSelection(catalog, {
    explicitIds: [ids.army],
    rulesContextId: contextId,
  })
  return projectReminders(catalog, selection)
}

describe('AoS 4 reminder identity', () => {
  it('depends on stable ability identity and semantic timing, not wording or revision', () => {
    const catalog = createCatalog()
    const first = projectCatalog(catalog)
    const matrixBefore = first.flatMap(reminder =>
      reminder.abilityIds.includes(ids.matrix) ? reminder.occurrenceIds : []
    )

    const matrix = catalog.entities.find(entity => entity.id === ids.matrix) as Ability
    matrix.revision = 'fixture-2'
    matrix.text.effect = 'Completely rewritten display text.'
    matrix.timings = [...matrix.timings].reverse()

    const wordingRevision = projectCatalog(catalog)
    const matrixAfter = wordingRevision.flatMap(reminder =>
      reminder.abilityIds.includes(ids.matrix) ? reminder.occurrenceIds : []
    )
    expect(matrixAfter.sort()).toEqual(matrixBefore.sort())

    const semanticChange = {
      ...matrix.timings[0],
      perspective: 'enemy' as const,
    }
    expect(reminderOccurrenceId(ids.matrix, semanticChange)).not.toBe(
      reminderOccurrenceId(ids.matrix, matrix.timings[0])
    )
  })

  it('canonicalizes equivalent semantic timing objects', () => {
    const timing: AbilityTiming = {
      kind: 'reaction',
      window: { kind: 'turn-phase', phase: 'combat' },
      perspective: 'enemy',
      priority: 'strike-last',
      usage: { limit: 1, period: 'turn', scope: 'unit' },
      raw: 'wording is intentionally excluded',
    }

    expect(semanticTimingKey(timing)).toBe(
      'turn-phase:combat|reaction|enemy|strike-last|1:turn:unit'
    )
  })
})

describe('AoS 4 reminder projection', () => {
  it('orders the complete window matrix with reactions, passives, and combat priorities', () => {
    const reminders = projectCatalog()

    expect(reminders.map(reminder => reminder.timing.window.kind)).toEqual([
      'battle-start',
      'deployment',
      'battle-round-start',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'turn-phase',
      'battle-round-end',
      'battle-end',
      'always',
    ])

    const shooting = reminders.filter(
      reminder =>
        reminder.timing.window.kind === 'turn-phase' &&
        reminder.timing.window.phase === 'shooting'
    )
    expect(shooting.map(reminder => reminder.lane)).toEqual(['active', 'reaction'])

    const combat = reminders.filter(
      reminder =>
        reminder.timing.window.kind === 'turn-phase' && reminder.timing.window.phase === 'combat'
    )
    expect(combat.map(reminder => reminder.timing.priority ?? 'normal')).toEqual([
      'strike-first',
      'normal',
      'normal',
      'strike-last',
    ])
  })

  it('merges display-equivalent reminders after identity while retaining causes and provenance', () => {
    const shared = projectCatalog().find(reminder => reminder.name === 'Shared Ward')

    expect(shared).toMatchObject({
      abilityIds: [ids.sharedA, ids.sharedB],
      occurrenceIds: expect.arrayContaining([
        reminderOccurrenceId(ids.sharedA, sharedTiming),
        reminderOccurrenceId(ids.sharedB, sharedTiming),
      ]),
      contributingEntityIds: expect.arrayContaining([ids.army, ids.unitA, ids.unitB]),
      sourceRefs: expect.arrayContaining([refs.sharedA, refs.sharedB]),
    })
    expect(shared?.occurrenceIds).toHaveLength(2)
    expect(shared?.causes).toHaveLength(2)
  })

  it('omits abilities that are not reachable from the resolved selection', () => {
    const reminders = projectCatalog()

    expect(reminders.flatMap(reminder => reminder.abilityIds)).not.toContain(ids.unselected)
  })

  it('is deterministic when catalog and selection inputs are reordered', () => {
    const catalog = createCatalog()
    const reordered = {
      ...catalog,
      entities: [...catalog.entities].reverse(),
      relationships: [...catalog.relationships].reverse(),
    }

    expect(projectCatalog(reordered)).toEqual(projectCatalog(catalog))
  })
})
