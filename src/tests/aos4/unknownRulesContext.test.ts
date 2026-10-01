import { ArmyApiError, ArmyRequiresUpdateError, createArmyApi } from '../../api/armyApi'
import { AOS4_CATALOG } from '../../aos4/generated'
import {
  AOS4_ARMY_STORAGE_KEY,
  createDefaultAos4ArmyDocument,
  loadAos4ArmyDocument,
  saveAos4ArmyDocument,
} from '../../aos4/runtime'
import {
  deserializeAos4ArmyDocument,
  moveAos4ToStandardRulesContext,
  serializeAos4ArmyDocument,
  toWireAos4ArmyDocument,
  unknownAos4RulesContextId,
} from '../../aos4/state'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { describe, expect, it, vi } from 'vitest'

/*
 * An army saved by a newer release names a ruleset this one has never seen (#2055). These pin the
 * line between that — keep it, ask for an update — and genuinely broken data, which still fails or
 * resets exactly as before.
 */

// Canonical, and not in this release's catalog. It stands in for whatever a newer release adds; the
// General's Handbook 2025-26 past season (#2042) took the `…0005` id this file first used.
const FUTURE_CONTEXT_ID = 'rules-context:90000000-0000-4000-8000-00000000ffff'

const knownDocument = { ...createDefaultAos4ArmyDocument(), id: 'army:known', name: 'Known Army' }
const futureWire = {
  ...(toWireAos4ArmyDocument({ ...knownDocument, id: 'army:future', name: 'Future Army' }) as {
    explicitSelectionIds: string[]
  }),
  rulesContextId: FUTURE_CONTEXT_ID,
}
const futureSerialized = JSON.stringify(futureWire)

const jsonResponse = (body: unknown, status = 200): Response =>
  ({
    json: vi.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  }) as unknown as Response

describe('a rules context this release does not carry', () => {
  it('is not in the catalog the test relies on', () => {
    expect(AOS4_CATALOG.rulesContexts.map(context => context.id)).not.toContain(FUTURE_CONTEXT_ID)
  })

  describe('document classification', () => {
    const diagnosticsFor = (value: unknown) =>
      deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG).diagnostics

    it('names the unknown context when it is the only fault', () => {
      expect(unknownAos4RulesContextId(diagnosticsFor(futureWire))).toBe(FUTURE_CONTEXT_ID)
    })

    it('still names it when retired selections were only warned about', () => {
      const withRetiredSelection = {
        ...futureWire,
        explicitSelectionIds: [
          ...futureWire.explicitSelectionIds,
          'warscroll:00000000-0000-4000-8000-000000000000',
        ],
      }
      const diagnostics = diagnosticsFor(withRetiredSelection)
      expect(diagnostics.some(diagnostic => diagnostic.code === 'missing-selection')).toBe(true)
      expect(unknownAos4RulesContextId(diagnostics)).toBe(FUTURE_CONTEXT_ID)
    })

    it('treats a context id no release writes as corruption', () => {
      expect(unknownAos4RulesContextId(diagnosticsFor({ ...futureWire, rulesContextId: 'garbage' }))).toBe(
        undefined
      )
      expect(
        unknownAos4RulesContextId(
          diagnosticsFor({ ...futureWire, rulesContextId: 'rules-context:not-a-uuid' })
        )
      ).toBe(undefined)
    })

    it('treats an unknown context alongside another error as corruption', () => {
      const alsoBroken = { ...futureWire, reminderPreferences: { 'reminder:x': { order: 'first' } } }
      expect(unknownAos4RulesContextId(diagnosticsFor(alsoBroken))).toBe(undefined)
    })

    it('treats schema-invalid documents as corruption', () => {
      expect(unknownAos4RulesContextId(diagnosticsFor({ ...futureWire, schemaVersion: 4 }))).toBe(undefined)
      expect(unknownAos4RulesContextId(diagnosticsFor({ ...futureWire, name: 7 }))).toBe(undefined)
    })
  })

  describe('the army stored on this device', () => {
    it('is left byte-for-byte in storage, and a stand-in is returned without being saved', () => {
      const storage = new MemoryStorage()
      storage.setItem(AOS4_ARMY_STORAGE_KEY, futureSerialized)

      const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

      expect(result.source).toBe('requires-update')
      expect(result.unknownRulesContextId).toBe(FUTURE_CONTEXT_ID)
      expect(result.document).toEqual(createDefaultAos4ArmyDocument())
      expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(futureSerialized)
    })

    it('loads normally once the release carries the context', () => {
      const storage = new MemoryStorage()
      storage.setItem(AOS4_ARMY_STORAGE_KEY, futureSerialized)
      const updatedCatalog = {
        ...AOS4_CATALOG,
        rulesContexts: [
          ...AOS4_CATALOG.rulesContexts,
          { ...AOS4_CATALOG.rulesContexts[0], id: FUTURE_CONTEXT_ID },
        ],
      } as typeof AOS4_CATALOG

      const result = loadAos4ArmyDocument(storage, updatedCatalog)

      expect(result.source).toBe('storage')
      expect(result.document).toMatchObject({ name: 'Future Army', rulesContextId: FUTURE_CONTEXT_ID })
    })

    it('still resets a corrupt document, as before', () => {
      const storage = new MemoryStorage()
      storage.setItem(AOS4_ARMY_STORAGE_KEY, JSON.stringify({ ...futureWire, rulesContextId: 'garbage' }))

      const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

      expect(result.source).toBe('reset')
      expect(result.unknownRulesContextId).toBeUndefined()
      expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).not.toContain('garbage')
    })

    it('still resets unparseable bytes, as before', () => {
      const storage = new MemoryStorage()
      storage.setItem(AOS4_ARMY_STORAGE_KEY, '{not json')

      expect(loadAos4ArmyDocument(storage, AOS4_CATALOG).source).toBe('reset')
    })

    it('does not disturb a known army', () => {
      const storage = new MemoryStorage()
      saveAos4ArmyDocument(storage, knownDocument)

      expect(loadAos4ArmyDocument(storage, AOS4_CATALOG)).toMatchObject({
        source: 'storage',
        document: knownDocument,
      })
    })
  })

  describe('the cloud army list', () => {
    const listOf = (...documents: unknown[]) =>
      vi.fn().mockResolvedValue(
        jsonResponse(
          documents.map((document, index) => ({
            id: `cloud-${index}`,
            createdAt: 1,
            updatedAt: 2,
            document,
          }))
        )
      )

    it('keeps every army, and marks the one this release cannot read', async () => {
      const armies = await createArmyApi(
        'https://army.example',
        listOf(knownDocument, futureWire)
      ).listArmies('token')

      expect(armies).toHaveLength(2)
      expect(armies[0]).toEqual({ id: 'cloud-0', createdAt: 1, updatedAt: 2, document: knownDocument })
      expect(armies[0].requiresUpdate).toBeUndefined()
      expect(armies[1]).toMatchObject({
        id: 'cloud-1',
        document: { name: 'Future Army', rulesContextId: FUTURE_CONTEXT_ID },
        requiresUpdate: { rulesContextId: FUTURE_CONTEXT_ID },
      })
    })

    it('makes no write to the account while listing', async () => {
      const fetcher = listOf(futureWire)
      await createArmyApi('https://army.example', fetcher).listArmies('token')

      expect(fetcher).toHaveBeenCalledTimes(1)
      expect(fetcher.mock.calls[0][1].method).toBeUndefined()
    })

    it('still fails the list on a schema-invalid army', async () => {
      await expect(
        createArmyApi(
          'https://army.example',
          listOf(knownDocument, { ...futureWire, schemaVersion: 4 })
        ).listArmies('token')
      ).rejects.toMatchObject({ status: 502, name: 'ArmyApiError' })
    })

    it('still fails the list on an unknown context that is also otherwise broken', async () => {
      const alsoBroken = { ...futureWire, reminderPreferences: { 'reminder:x': { order: 'first' } } }
      await expect(
        createArmyApi('https://army.example', listOf(alsoBroken)).listArmies('token')
      ).rejects.toMatchObject({ status: 502 })
    })

    it('still fails the list on a malformed record around a readable document', async () => {
      const fetcher = vi.fn().mockResolvedValue(jsonResponse([{ id: 'cloud-0', document: futureWire }]))
      await expect(createArmyApi('https://army.example', fetcher).listArmies('token')).rejects.toMatchObject({
        status: 502,
      })
    })

    it('still reports authentication and network failures as before', async () => {
      const denied = vi.fn().mockResolvedValue(jsonResponse('Unauthorized', 401))
      await expect(createArmyApi('https://army.example', denied).listArmies('token')).rejects.toMatchObject({
        status: 401,
      })

      const offline = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
      const error = await createArmyApi('https://army.example', offline)
        .listArmies('token')
        .catch(reason => reason)
      expect(error).toBeInstanceOf(ArmyApiError)
      expect(error).not.toBeInstanceOf(ArmyRequiresUpdateError)
      expect(error.message).toBe('Cloud armies are temporarily unavailable.')
    })
  })

  describe('a shared link', () => {
    const shareOf = (document: unknown) =>
      vi.fn().mockResolvedValue(jsonResponse({ id: 'abcdefghijklmnopqrstuvwx', createdAt: 1, document }))

    it('reports that an update is needed rather than a generic failure', async () => {
      const error = await createArmyApi('https://army.example', shareOf(futureWire))
        .getShare('abcdefghijklmnopqrstuvwx')
        .catch(reason => reason)

      expect(error).toBeInstanceOf(ArmyRequiresUpdateError)
      expect(error.rulesContextId).toBe(FUTURE_CONTEXT_ID)
      expect(error.message).toBe('This army uses rules that need a newer version of AoS Reminders.')
    })

    it('still reports a corrupt share as an incompatible document', async () => {
      const error = await createArmyApi(
        'https://army.example',
        shareOf({ ...futureWire, rulesContextId: 'garbage' })
      )
        .getShare('abcdefghijklmnopqrstuvwx')
        .catch(reason => reason)

      expect(error).not.toBeInstanceOf(ArmyRequiresUpdateError)
      expect(error).toMatchObject({
        status: 502,
        message: 'The service returned an incompatible army document.',
      })
    })

    it('still reports a missing share with the service message', async () => {
      const missing = vi.fn().mockResolvedValue(jsonResponse('Shared army not found.', 404))
      await expect(
        createArmyApi('https://army.example', missing).getShare('abcdefghijklmnopqrstuvwx')
      ).rejects.toMatchObject({ status: 404, message: 'Shared army not found.' })
    })
  })
})

/*
 * The General's Handbook 2025-26 past season (#2042) ships after this handling (#2055). This release
 * carries it, so a 2025-26 army must store, list, save, and share like any other, while an army
 * from a release newer still keeps the update-required treatment right beside it.
 */
describe('the 2025-26 past season beside a context this release lacks', () => {
  const pastSeason = AOS4_CATALOG.rulesContexts.find(context => context.status === 'past-season')
  if (!pastSeason) throw new Error('No past-season context')
  const pastSeasonDocument = moveAos4ToStandardRulesContext(
    AOS4_CATALOG,
    { ...knownDocument, id: 'army:past-season', name: 'Past Season Army' },
    pastSeason.id
  )
  const pastSeasonWire = toWireAos4ArmyDocument(pastSeasonDocument)
  // The service echoes the document it stored, so the client parses back exactly what it sent.
  const echo = (extra: Record<string, unknown>) =>
    vi
      .fn()
      .mockImplementation(async (_url: string, init: RequestInit) =>
        jsonResponse({ ...extra, document: JSON.parse(init.body as string).document })
      )

  it('is the General’s Handbook 2025-26, carried by this release', () => {
    expect(pastSeason).toMatchObject({
      id: 'rules-context:90000000-0000-4000-8000-000000000005',
      season: '2025-26',
    })
    expect(pastSeasonDocument.rulesContextId).toBe(pastSeason.id)
    expect(
      unknownAos4RulesContextId(
        deserializeAos4ArmyDocument(JSON.stringify(pastSeasonWire), AOS4_CATALOG).diagnostics
      )
    ).toBe(undefined)
  })

  it('reloads from this device in the past season, not as an army that needs an update', () => {
    const storage = new MemoryStorage()
    saveAos4ArmyDocument(storage, pastSeasonDocument)
    const stored = storage.getItem(AOS4_ARMY_STORAGE_KEY)

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.unknownRulesContextId).toBeUndefined()
    expect(result.document).toEqual(pastSeasonDocument)
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(stored)
    expect(stored).toBe(serializeAos4ArmyDocument(pastSeasonDocument))
  })

  it('still leaves a newer release’s army untouched on the same device', () => {
    const storage = new MemoryStorage()
    storage.setItem(AOS4_ARMY_STORAGE_KEY, futureSerialized)

    expect(loadAos4ArmyDocument(storage, AOS4_CATALOG)).toMatchObject({
      source: 'requires-update',
      unknownRulesContextId: FUTURE_CONTEXT_ID,
    })
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(futureSerialized)
  })

  it('lists as a readable cloud army while only the newer release’s army is marked', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse(
        [pastSeasonWire, futureWire, knownDocument].map((document, index) => ({
          id: `cloud-${index}`,
          createdAt: 1,
          updatedAt: 2,
          document,
        }))
      )
    )

    const armies = await createArmyApi('https://army.example', fetcher).listArmies('token')

    expect(armies).toHaveLength(3)
    expect(armies[0]).toEqual({ id: 'cloud-0', createdAt: 1, updatedAt: 2, document: pastSeasonDocument })
    expect(armies[0].requiresUpdate).toBeUndefined()
    expect(armies[1].requiresUpdate).toEqual({ rulesContextId: FUTURE_CONTEXT_ID })
    expect(armies[2].requiresUpdate).toBeUndefined()
  })

  it('saves, updates, and reloads from the cloud in the past season', async () => {
    const api = createArmyApi('https://army.example', echo({ id: 'cloud-past', createdAt: 1, updatedAt: 2 }))

    const created = await api.createArmy(pastSeasonDocument, 'token')
    const updated = await api.updateArmy('cloud-past', pastSeasonDocument, 'token')

    expect(created.document).toEqual(pastSeasonDocument)
    expect(updated.document).toEqual(pastSeasonDocument)
  })

  it('shares and opens in the past season', async () => {
    const shared = await createArmyApi(
      'https://army.example',
      echo({ id: 'abcdefghijklmnopqrstuvwx', createdAt: 1, url: 'https://aosreminders.com/?share=x' })
    ).createShare(pastSeasonDocument, 'token')
    const opened = await createArmyApi(
      'https://army.example',
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ id: 'abcdefghijklmnopqrstuvwx', createdAt: 1, document: pastSeasonWire })
        )
    ).getShare('abcdefghijklmnopqrstuvwx')

    expect(shared.document).toEqual(pastSeasonDocument)
    expect(opened.document).toEqual(pastSeasonDocument)
  })
})
