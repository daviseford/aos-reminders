import { createArmyApi } from '../../api/armyApi'
import type { ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import {
  AOS4_ARMY_STORAGE_KEY,
  createDefaultAos4ArmyDocument,
  deriveAos4OverlayFlags,
  loadAos4ArmyDocument,
} from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument, toWireAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel } from '../../aos4/view'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { vi } from 'vitest'

/**
 * An army saved while Stumblefoot Gargant was a current Regiment of Renown carries it with no
 * historical flag. Corpus 2026-09-29 retired the regiment to the historical context (#1757); the
 * builder kept showing it selected, but the reminders resolve with exactly the flags the document
 * carries, so the regiment's reminders vanished until some unrelated edit re-derived the flags.
 * Every way a saved army comes back (browser storage, the cloud army list, a share link) now
 * re-derives them on arrival.
 */

const ironjawz = AOS4_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Ironjawz'
)!
const stumblefoot = AOS4_CATALOG.entities.find(
  (entity): entity is ContentGroup =>
    entity.kind === 'content-group' &&
    entity.groupType === 'regiment-of-renown' &&
    entity.name === 'Stumblefoot Gargant'
)!

// What storage and the army service hold for an army saved before the regiment was retired.
const savedBeforeRetirement = createAos4ArmyDocument({
  ...createDefaultAos4ArmyDocument(),
  id: 'army:stumblefoot-saved',
  name: 'Ironjawz with Stumblefoot',
  explicitSelectionIds: [ironjawz.id, stumblefoot.id],
})

const reminderIds = (document: Parameters<typeof createAos4ReminderViewModel>[1]) =>
  createAos4ReminderViewModel(AOS4_CATALOG, document).map(reminder => reminder.id)

const jsonResponse = (body: unknown): Response =>
  ({ json: vi.fn().mockResolvedValue(body), ok: true, status: 200 }) as unknown as Response

describe('restoring an army that holds a since-retired selection (#1757)', () => {
  const expected = reminderIds(deriveAos4OverlayFlags(AOS4_CATALOG, savedBeforeRetirement))

  it('is the case the fix exists for: without the flag the regiment’s reminders drop out', () => {
    expect(savedBeforeRetirement.allowsHistorical).toBeUndefined()
    const unflagged = reminderIds(savedBeforeRetirement)
    expect(expected.length).toBeGreaterThan(unflagged.length)
    unflagged.forEach(id => expect(expected).toContain(id))
  })

  it('re-derives the flag when the army loads from browser storage, and stores the result', () => {
    const storage = new MemoryStorage()
    storage.setItem(AOS4_ARMY_STORAGE_KEY, serializeAos4ArmyDocument(savedBeforeRetirement))

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.overlayFlagsDerived).toBe(true)
    expect(result.document.allowsHistorical).toBe(true)
    expect(result.document.explicitSelectionIds).toEqual(savedBeforeRetirement.explicitSelectionIds)
    expect(reminderIds(result.document)).toEqual(expected)
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(serializeAos4ArmyDocument(result.document))
  })

  it('leaves an army whose flags already match untouched', () => {
    const storage = new MemoryStorage()
    const current = deriveAos4OverlayFlags(AOS4_CATALOG, savedBeforeRetirement)
    storage.setItem(AOS4_ARMY_STORAGE_KEY, serializeAos4ArmyDocument(current))

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.overlayFlagsDerived).toBeUndefined()
    expect(result.document).toEqual(current)
  })

  it('re-derives the flag for a cloud army and a shared army', async () => {
    const wire = toWireAos4ArmyDocument(savedBeforeRetirement)
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([{ id: 'cloud-1', createdAt: 1, updatedAt: 2, document: wire }]))
      .mockResolvedValueOnce(jsonResponse({ id: 'share-1', createdAt: 1, document: wire }))
    const api = createArmyApi('https://army.example/', fetcher)

    const [cloud] = await api.listArmies('access-token')
    const shared = await api.getShare('share-1')

    ;[cloud.document, shared.document].forEach(document => {
      expect(document.allowsHistorical).toBe(true)
      expect(document.explicitSelectionIds).toEqual(savedBeforeRetirement.explicitSelectionIds)
      expect(reminderIds(document)).toEqual(expected)
    })
  })
})
