import {
  REPRESENTATIVE_CATALOG as AOS4_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS as AOS4_DEFAULT_SELECTION_IDS,
} from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY, loadAos4ArmyDocument } from '../../aos4/runtime'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
} from '../../aos4/state'
import { describe, expect, it } from 'vitest'

const DEAD_SELECTION_ID = 'warscroll:ffffffff-ffff-4fff-8fff-ffffffffffff'

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

const createDocument = () =>
  createAos4ArmyDocument({
    id: 'army:survival',
    name: 'Enduring Stormcast Eternals',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
    reminderPreferences: {},
  })

/*
 * A rules update that retires an entity the army holds must cost the army that one selection, not
 * the whole document. These pin the survival contract at both layers: the deserializer filters the
 * dead ID with a warning, and the browser-storage load keeps `source: 'storage'` instead of
 * resetting to the default army.
 */
describe('stored army survival across catalog updates', () => {
  it('survives a selection the catalog no longer carries, filtering it with a warning', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({
        code: 'missing-selection',
        severity: 'warning',
        subject: DEAD_SELECTION_ID,
      }),
    ])
  })

  it('no longer resets stored armies whose selection an update removed', () => {
    const storage = new MemoryStorage()
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)
    storage.setItem(AOS4_ARMY_STORAGE_KEY, `${JSON.stringify(value, null, 2)}\n`)

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.document.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: 'missing-selection',
        severity: 'warning',
        subject: DEAD_SELECTION_ID,
      }),
    ])
  })

  it('keeps reminder preferences intact when a dead selection is filtered', () => {
    const preferenced = createAos4ArmyDocument({
      ...createDocument(),
      reminderPreferences: {
        ['reminder:ability:00000000-0000-4000-8000-000000000001@turn-phase:hero|activated|neutral|normal|unlimited' as never]:
          { hidden: true, note: 'Keep this.' },
      },
    })
    const value = JSON.parse(serializeAos4ArmyDocument(preferenced))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document?.reminderPreferences).toEqual(preferenced.reminderPreferences)
  })
})
