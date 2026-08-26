import { createArmyApi } from '../../api/armyApi'
import { AOS4_CATALOG } from '../../aos4/generated'
import { createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import { describe, expect, it, vi } from 'vitest'

const jsonResponse = (body: unknown, status = 200): Response =>
  ({
    json: vi.fn().mockResolvedValue(body),
    ok: status >= 200 && status < 300,
    status,
  }) as unknown as Response

describe('AoS 4 army API client', () => {
  const document = createDefaultAos4ArmyDocument()

  it('sends the audience token and validates remote army documents', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          id: 'cloud-1',
          createdAt: 1,
          updatedAt: 2,
          document,
          ownerId: 'must-not-reach-client',
        },
      ])
    )
    const api = createArmyApi('https://army.example/', fetcher)
    const armies = await api.listArmies('access-token')

    expect(armies).toEqual([
      {
        id: 'cloud-1',
        createdAt: 1,
        updatedAt: 2,
        document,
      },
    ])
    const [url, options] = fetcher.mock.calls[0]
    expect(url).toBe('https://army.example/items')
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer access-token')
  })

  it('sends only the canonical document when creating an army or share', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: 'cloud-1', createdAt: 1, updatedAt: 1, document }, 201))
      .mockResolvedValueOnce(
        jsonResponse(
          {
            id: 'abcdefghijklmnopqrstuvwx',
            createdAt: 2,
            document,
            url: 'https://aosreminders.com/?army=abcdefghijklmnopqrstuvwx',
          },
          201
        )
      )
    const api = createArmyApi('https://army.example', fetcher)

    await api.createArmy(document, 'token')
    await api.createShare(document, 'token')

    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ document })
    expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual({ document })
    expect(fetcher.mock.calls[1][0]).toBe('https://army.example/links')
  })

  it('fails closed on incompatible documents and failed HTTP responses', async () => {
    const invalidFetcher = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          id: 'cloud-1',
          createdAt: 1,
          updatedAt: 2,
          document: { schemaVersion: 4 },
        },
      ])
    )
    await expect(
      createArmyApi('https://army.example', invalidFetcher).listArmies('token')
    ).rejects.toMatchObject({ status: 502 })

    const deniedFetcher = vi.fn().mockResolvedValue(jsonResponse('An active subscription is required.', 403))
    await expect(
      createArmyApi('https://army.example', deniedFetcher).createArmy(document, 'token')
    ).rejects.toMatchObject({ status: 403 })
  })

  it('honours the document overlay flags so a Legends army round-trips', async () => {
    const legendsSelection = (() => {
      for (const faction of AOS4_CATALOG.entities.filter(entity => entity.id.startsWith('faction:'))) {
        const strict = resolveSelection(AOS4_CATALOG, {
          explicitIds: [faction.id],
          rulesContextId: document.rulesContextId,
        })
        const relaxed = resolveSelection(AOS4_CATALOG, {
          explicitIds: [faction.id],
          rulesContextId: document.rulesContextId,
          allowsLegends: true,
        })
        const strictAvailable = new Set(strict.availableIds)
        const legendsOnly = relaxed.availableIds.find(
          id => id.startsWith('warscroll:') && !strictAvailable.has(id)
        )
        if (legendsOnly) return { factionId: faction.id, warscrollId: legendsOnly }
      }
      throw new Error('The catalog has no Legends-only warscroll to exercise')
    })()

    const legendsDocument = {
      ...document,
      allowsLegends: true,
      explicitSelectionIds: [legendsSelection.factionId, legendsSelection.warscrollId],
    }
    const remoteArmy = { id: 'cloud-legends', createdAt: 1, updatedAt: 2, document: legendsDocument }

    const fetcher = vi.fn().mockResolvedValue(jsonResponse([remoteArmy]))
    const armies = await createArmyApi('https://army.example', fetcher).listArmies('token')
    expect(armies).toEqual([remoteArmy])
  })

  /*
   * A selection that deserializes but no longer resolves in its rules context is a legitimately
   * stale army, not service corruption: a catalog update that supersedes an enhancement table does
   * this to every army that picked from the replaced table (the GHB 2026-27 replacement did, for
   * eighteen factions), and the builder tolerates the pick by ignoring it. Rejecting it here
   * bricked saving that army and poisoned the whole cloud list — one stale army made My Armies
   * unusable. The Legends-only warscroll without its overlay flag reproduces the same state.
   */
  it('parses an army whose selection no longer resolves in its context instead of failing the list', async () => {
    const legendsSelection = (() => {
      for (const faction of AOS4_CATALOG.entities.filter(entity => entity.id.startsWith('faction:'))) {
        const strict = resolveSelection(AOS4_CATALOG, {
          explicitIds: [faction.id],
          rulesContextId: document.rulesContextId,
        })
        const relaxed = resolveSelection(AOS4_CATALOG, {
          explicitIds: [faction.id],
          rulesContextId: document.rulesContextId,
          allowsLegends: true,
        })
        const strictAvailable = new Set(strict.availableIds)
        const legendsOnly = relaxed.availableIds.find(
          id => id.startsWith('warscroll:') && !strictAvailable.has(id)
        )
        if (legendsOnly) return { factionId: faction.id, warscrollId: legendsOnly }
      }
      throw new Error('The catalog has no Legends-only warscroll to exercise')
    })()

    const staleDocument = {
      ...document,
      explicitSelectionIds: [legendsSelection.factionId, legendsSelection.warscrollId],
    }
    const remoteArmy = { id: 'cloud-stale', createdAt: 1, updatedAt: 2, document: staleDocument }

    const listFetcher = vi.fn().mockResolvedValue(jsonResponse([remoteArmy]))
    const armies = await createArmyApi('https://army.example', listFetcher).listArmies('token')
    expect(armies).toEqual([remoteArmy])

    const saveFetcher = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ id: 'cloud-stale', createdAt: 1, updatedAt: 1, document: staleDocument }, 201)
      )
    const saved = await createArmyApi('https://army.example', saveFetcher).createArmy(staleDocument, 'token')
    expect(saved.document).toEqual(staleDocument)
  })

  /*
   * The catalog reaches parseDocument through a dynamic import, so loading it is a network fetch the
   * caller can no longer assume succeeded. Not reachable while Home imports the catalog statically —
   * the module is always registered before any cloud call — but it goes live with the lazy Home
   * split (#1845), and an unwrapped failure would reach the user as "Failed to fetch dynamically
   * imported module ...". Pinned now so the split cannot introduce that message unnoticed.
   */
  it('reports a catalog chunk that fails to load as a service outage', async () => {
    vi.resetModules()
    vi.doMock('../../aos4/generated', () => {
      throw new Error('Failed to fetch dynamically imported module')
    })

    try {
      const { createArmyApi: createApiWithBrokenCatalog } = await import('../../api/armyApi')
      const fetcher = vi
        .fn()
        .mockResolvedValue(jsonResponse([{ id: 'cloud-1', createdAt: 1, updatedAt: 2, document }]))

      await expect(
        createApiWithBrokenCatalog('https://army.example/', fetcher).listArmies('access-token')
      ).rejects.toThrow('Cloud armies are temporarily unavailable.')
    } finally {
      vi.doUnmock('../../aos4/generated')
      vi.resetModules()
    }
  })
})
