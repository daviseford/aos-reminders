import { AOS4_CATALOG } from '../../aos4/generated'
import {
  AOS4_ARMY_STORAGE_KEY,
  AOS3_BROWSER_STORAGE_KEYS,
  loadAos4ArmyDocument,
  saveAos4ArmyDocument,
} from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'
import { AOS4_DEFAULT_SELECTION_IDS, REPRESENTATIVE_CONTEXT_ID } from '../../aos4/generated'

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

const createStoredDocument = () =>
  createAos4ArmyDocument({
    id: 'army:stored',
    name: 'Stored AoS 4 army',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
  })

describe('AoS 4 browser persistence', () => {
  it('retires every AoS 3 browser-state key without interpreting its contents', () => {
    const storage = new MemoryStorage()
    AOS3_BROWSER_STORAGE_KEYS.forEach(key => storage.setItem(key, '{not valid JSON'))
    storage.setItem('theme', 'dark')

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('default')
    AOS3_BROWSER_STORAGE_KEYS.forEach(key => expect(storage.getItem(key)).toBeNull())
    expect(storage.getItem('theme')).toBe('dark')
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(serializeAos4ArmyDocument(result.document))
  })

  it('restores only a valid AoS 4 document', () => {
    const storage = new MemoryStorage()
    const document = createStoredDocument()
    storage.setItem(AOS4_ARMY_STORAGE_KEY, serializeAos4ArmyDocument(document))

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result).toMatchObject({ source: 'storage', document })
    expect(result.diagnostics).toEqual([])
  })

  it('replaces incompatible state with a clean AoS 4 default', () => {
    const storage = new MemoryStorage()
    storage.setItem(AOS4_ARMY_STORAGE_KEY, JSON.stringify({ schemaVersion: 3 }))

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('reset')
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'incompatible-schema', severity: 'error' })
    )
    expect(result.document.schemaVersion).toBe(1)
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(serializeAos4ArmyDocument(result.document))
  })

  it('persists normalized AoS 4 documents under a versioned key', () => {
    const storage = new MemoryStorage()
    const document = createStoredDocument()

    saveAos4ArmyDocument(storage, document)

    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(serializeAos4ArmyDocument(document))
  })
})
