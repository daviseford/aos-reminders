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
  createAos4ReminderViewModel,
  migrateAos4ReminderPreferences,
  type Aos4ReminderOccurrence,
} from '../../aos4/view'
import { describe, expect, it } from 'vitest'

const IDS = REPRESENTATIVE_IDS

const makeDocument = (reminderPreferences: Aos4ArmyDocument['reminderPreferences'] = {}): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:preference-migration',
    name: 'Migrating Stormcast',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: [...REPRESENTATIVE_EXPLICIT_SELECTION_IDS],
    reminderPreferences,
  })

const occurrencesOf = (reminders: ReturnType<typeof createAos4ReminderViewModel>): Aos4ReminderOccurrence[] =>
  reminders.map(reminder => ({ id: reminder.id, abilityIds: reminder.projected.abilityIds }))

/*
 * A rules update that moves an ability's timing moves its reminder occurrence ID, which used to
 * strand any hidden/note/order preference keyed on the old one. The migration re-keys a stranded
 * preference only when the answer is unambiguous.
 */
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

    // The relocated reminder renders with its migrated preferences.
    const view = createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, migrated)
    expect(view.find(reminder => reminder.id === current.id)).toMatchObject({
      hidden: true,
      note: 'Front line only.',
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
