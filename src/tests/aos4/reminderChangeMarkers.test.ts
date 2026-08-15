import { computeAos4PublicationImpacts, type Aos4PublishedChangelog } from '../../aos4/changelog'
import {
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
} from '../../aos4/generated'
import { reminderOccurrenceId } from '../../aos4/reminders'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import {
  aos4ReminderChangesByAbilityId,
  createAos4ReminderViewModel,
  migrateAos4ReminderPreferences,
  withAos4ReminderChanges,
  type Aos4ReminderOccurrence,
} from '../../aos4/view'

const IDS = REPRESENTATIVE_IDS

const P1 = {
  publicationId: 'publication:battlescroll-first-blood',
  name: 'Battlescroll: First Blood',
  source: 'battlescroll',
  effectiveDate: '2026-08-01',
}

const P2 = {
  publicationId: 'publication:faq-core-rules',
  name: 'FAQ: Core Rules',
  source: 'faq',
}

const modifiedStalwart = {
  entityId: IDS.abilities.stalwartDefenders,
  entityKind: 'ability',
  name: 'Stalwart Defenders',
  changeKind: 'modified',
  attribution: { kind: 'publication', ...P1 },
  predicate: { kind: 'warscroll', warscrollId: IDS.warscrolls.liberators },
  ownership: { factionIds: [IDS.faction], warscrollId: IDS.warscrolls.liberators, contentGroupIds: [] },
  fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
}

const olderModifiedStalwart = {
  ...modifiedStalwart,
  attribution: { kind: 'publication', ...P2 },
  fields: [{ field: 'text.effect', previous: 'An older wording.', next: 'Add 1 to save rolls.' }],
}

const makeArtifact = (records: unknown[]): Aos4PublishedChangelog =>
  ({
    schemaVersion: 1,
    revision: 'acceptance-2026-08',
    retainedEntryIds: ['acceptance-2026-08', 'acceptance-2026-07'],
    retainedPublicationIds: [P1.publicationId, P2.publicationId],
    publications: [P1, P2],
    records,
    corrections: [],
  }) as unknown as Aos4PublishedChangelog

const makeDocument = (reminderPreferences: Aos4ArmyDocument['reminderPreferences'] = {}): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:change-markers',
    name: 'Marker Stormcast',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: [...REPRESENTATIVE_EXPLICIT_SELECTION_IDS],
    reminderPreferences,
  })

const changesFor = (records: unknown[]) =>
  aos4ReminderChangesByAbilityId(
    computeAos4PublicationImpacts(makeArtifact(records), {
      document: makeDocument(),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })
  )

const occurrencesOf = (reminders: ReturnType<typeof createAos4ReminderViewModel>): Aos4ReminderOccurrence[] =>
  reminders.map(reminder => ({ id: reminder.id, abilityIds: reminder.projected.abilityIds }))

describe('reminder change map derivation', () => {
  it('maps a modified projected ability to its publication name and deltas', () => {
    const changes = changesFor([modifiedStalwart])
    expect(changes.get(IDS.abilities.stalwartDefenders)).toEqual({
      publicationName: P1.name,
      fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
    })
  })

  it('keeps the newest publication when several retained updates touched the same ability', () => {
    const changes = changesFor([modifiedStalwart, olderModifiedStalwart])
    expect(changes.get(IDS.abilities.stalwartDefenders)?.publicationName).toBe(P1.name)
  })

  it('maps nothing when the army does not project the modified ability', () => {
    const changes = aos4ReminderChangesByAbilityId(
      computeAos4PublicationImpacts(makeArtifact([modifiedStalwart]), {
        document: makeDocument(),
        projectedAbilityIds: [],
      })
    )
    expect(changes.size).toBe(0)
  })
})

describe('changed markers on the reminder view model', () => {
  it('AE1: flags the affected reminder with a changed tag carrying the delta payload', () => {
    const reminders = createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, makeDocument(), {
      changesByAbilityId: changesFor([modifiedStalwart]),
    })
    const stalwart = reminders.find(reminder => reminder.name === 'Stalwart Defenders')

    expect(stalwart?.change).toEqual({
      publicationName: P1.name,
      fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
    })
    expect(stalwart?.tags[0]).toEqual({
      label: 'Updated',
      tone: 'changed',
      description: expect.stringContaining(P1.name),
    })
  })

  it('leaves unaffected reminders without a marker', () => {
    const reminders = createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, makeDocument(), {
      changesByAbilityId: changesFor([modifiedStalwart]),
    })
    reminders
      .filter(reminder => reminder.name !== 'Stalwart Defenders')
      .forEach(reminder => {
        expect(reminder.change).toBeUndefined()
        expect(reminder.tags.some(tag => tag.tone === 'changed')).toBe(false)
      })
  })

  it('returns the same reminders when no change info is supplied', () => {
    const reminders = createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, makeDocument())
    expect(withAos4ReminderChanges(reminders, undefined)).toBe(reminders)
    expect(withAos4ReminderChanges(reminders, new Map())).toBe(reminders)
    expect(reminders.every(reminder => reminder.change === undefined)).toBe(true)
  })
})

describe('reminder preference migration across timing changes', () => {
  const baseReminders = () => createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, makeDocument())

  const stalwart = () => {
    const reminder = baseReminders().find(candidate => candidate.name === 'Stalwart Defenders')
    expect(reminder).toBeDefined()
    return reminder!
  }

  it('migrates hidden and note preferences when the sole occurrence of an ability moved', () => {
    const current = stalwart()
    const abilityId = IDS.abilities.stalwartDefenders
    const oldId = reminderOccurrenceId(abilityId, {
      ...current.projected.timing,
      window: { kind: 'battle-end' },
    })
    expect(oldId).not.toBe(current.id)

    const document = makeDocument({ [oldId]: { hidden: true, note: 'Front line only.', order: 2 } })
    const migrated = migrateAos4ReminderPreferences(document, occurrencesOf(baseReminders()))

    expect(migrated.reminderPreferences[oldId]).toBeUndefined()
    expect(migrated.reminderPreferences[current.id]).toEqual({
      hidden: true,
      note: 'Front line only.',
      order: 2,
    })

    // The migration persists: it survives the serializer round-trip Home's save path performs.
    const restored = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(migrated), REPRESENTATIVE_CATALOG)
    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.reminderPreferences[current.id]).toEqual({
      hidden: true,
      note: 'Front line only.',
      order: 2,
    })

    // The relocated reminder renders with its migrated preferences and its changed marker.
    const view = createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, migrated, {
      changesByAbilityId: changesFor([modifiedStalwart]),
    })
    expect(view.find(reminder => reminder.id === current.id)).toMatchObject({
      hidden: true,
      note: 'Front line only.',
      change: { publicationName: P1.name },
    })
  })

  it('never conflates a multi-timing ability: an ambiguous preference is kept, not migrated', () => {
    const current = stalwart()
    const abilityId = IDS.abilities.stalwartDefenders
    const secondTimingId = reminderOccurrenceId(abilityId, {
      ...current.projected.timing,
      window: { kind: 'battle-start' },
    })
    const staleId = reminderOccurrenceId(abilityId, {
      ...current.projected.timing,
      window: { kind: 'battle-end' },
    })
    const occurrences: Aos4ReminderOccurrence[] = [
      { id: current.id, abilityIds: [abilityId] },
      { id: secondTimingId, abilityIds: [abilityId] },
    ]

    const document = makeDocument({ [staleId]: { hidden: true } })
    const migrated = migrateAos4ReminderPreferences(document, occurrences)

    expect(migrated).toBe(document)
    expect(migrated.reminderPreferences[staleId]).toEqual({ hidden: true })
    expect(migrated.reminderPreferences[current.id]).toBeUndefined()
    expect(migrated.reminderPreferences[secondTimingId]).toBeUndefined()
  })

  it('keeps a stale preference when the target occurrence already carries its own', () => {
    const current = stalwart()
    const abilityId = IDS.abilities.stalwartDefenders
    const staleId = reminderOccurrenceId(abilityId, {
      ...current.projected.timing,
      window: { kind: 'battle-end' },
    })

    const document = makeDocument({
      [staleId]: { note: 'Older note.' },
      [current.id]: { note: 'Current note.' },
    })
    const migrated = migrateAos4ReminderPreferences(document, occurrencesOf(baseReminders()))

    expect(migrated).toBe(document)
    expect(migrated.reminderPreferences[current.id]).toEqual({ note: 'Current note.' })
    expect(migrated.reminderPreferences[staleId]).toEqual({ note: 'Older note.' })
  })

  it('returns the same document when every preference still keys a live occurrence', () => {
    const current = stalwart()
    const document = makeDocument({ [current.id]: { hidden: true } })
    expect(migrateAos4ReminderPreferences(document, occurrencesOf(baseReminders()))).toBe(document)
  })
})
