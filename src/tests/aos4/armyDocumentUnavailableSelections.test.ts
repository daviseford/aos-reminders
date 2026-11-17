import type { Aos4Catalog, CanonicalId } from '../../aos4/domain'
import type { ReminderOccurrenceId } from '../../aos4/reminders'
import {
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
} from '../../aos4/generated'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  serializeAos4ArmyDocument,
  toWireAos4ArmyDocument,
} from '../../aos4/state'
import { describe, expect, it } from 'vitest'

/*
 * A withdrawn rules source takes formations, traits, and Armies of Renown out of the runtime while
 * saved armies still hold them (#1757). The catalog-bound read sets such a selection aside instead
 * of deleting it, a re-save keeps it, and a later catalog that carries it again restores it.
 */
describe('army document unavailable selections (#1757)', () => {
  const formationId = REPRESENTATIVE_IDS.groups.lightningEchelon as CanonicalId
  const withoutFormation: Aos4Catalog = {
    ...REPRESENTATIVE_CATALOG,
    entities: REPRESENTATIVE_CATALOG.entities.filter(entity => entity.id !== formationId),
  }
  const otherIds = REPRESENTATIVE_EXPLICIT_SELECTION_IDS.filter(id => id !== formationId)

  const createDocument = () =>
    createAos4ArmyDocument({
      id: 'army:unavailable',
      name: 'Unavailable Test',
      rulesContextId: REPRESENTATIVE_CONTEXT_ID,
      explicitSelectionIds: REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
      reminderPreferences: { ['reminder:kept' as ReminderOccurrenceId]: { note: 'keep me' } },
    })

  it('sets an id the catalog lacks aside, warns, and leaves the other selections alone', () => {
    const restored = deserializeAos4ArmyDocument(
      serializeAos4ArmyDocument(createDocument()),
      withoutFormation
    )

    expect(restored.document?.explicitSelectionIds).toEqual(
      createDocument().explicitSelectionIds.filter(id => id !== formationId)
    )
    expect(restored.document?.explicitSelectionIds).toEqual(expect.arrayContaining(otherIds))
    expect(restored.document?.unavailableSelectionIds).toEqual([formationId])
    expect(restored.document?.reminderPreferences).toEqual({ 'reminder:kept': { note: 'keep me' } })
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'missing-selection', severity: 'warning', subject: formationId }),
    ])
  })

  it('keeps the set-aside id through a re-save and every serializer', () => {
    const retained = deserializeAos4ArmyDocument(
      serializeAos4ArmyDocument(createDocument()),
      withoutFormation
    ).document!
    const serialized = serializeAos4ArmyDocument(retained)

    expect(JSON.parse(serialized).unavailableSelectionIds).toEqual([formationId])
    expect(toWireAos4ArmyDocument(retained).unavailableSelectionIds).toEqual([formationId])
    expect(deserializeAos4ArmyDocumentStructure(serialized).document).toEqual(retained)
    expect(deserializeAos4ArmyDocument(serialized, withoutFormation).document).toEqual(retained)
    expect(createAos4ArmyDocument({ ...retained, name: 'Renamed' }).unavailableSelectionIds).toEqual([
      formationId,
    ])
  })

  it('restores the id once a later catalog carries it again', () => {
    const retained = deserializeAos4ArmyDocument(
      serializeAos4ArmyDocument(createDocument()),
      withoutFormation
    ).document!

    const restored = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(retained), REPRESENTATIVE_CATALOG)

    expect(restored.diagnostics).toEqual([])
    expect(restored.document).toEqual(createDocument())
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serializeAos4ArmyDocument(createDocument()))
  })

  it('serializes without the field when nothing is set aside', () => {
    expect(serializeAos4ArmyDocument(createDocument())).not.toContain('unavailableSelectionIds')
  })

  it('sorts, deduplicates, bounds, and never overlaps the explicit selections', () => {
    const dead = (index: number) => `warscroll:${String(index).padStart(4, '0')}` as CanonicalId
    const document = createAos4ArmyDocument({
      ...createDocument(),
      unavailableSelectionIds: [
        dead(2),
        dead(1),
        dead(2),
        formationId,
        `warscroll:${'x'.repeat(200)}` as CanonicalId,
        ...Array.from({ length: 300 }, (_, index) => dead(index + 10)),
      ],
    })

    expect(document.unavailableSelectionIds?.slice(0, 3)).toEqual([dead(1), dead(2), dead(10)])
    expect(document.unavailableSelectionIds).not.toContain(formationId)
    expect(document.unavailableSelectionIds).toHaveLength(256)
  })

  it('rejects a malformed field as an invalid document', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.unavailableSelectionIds = [7]

    expect(deserializeAos4ArmyDocument(JSON.stringify(value), REPRESENTATIVE_CATALOG).diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-document', severity: 'error' }),
    ])
  })
})
