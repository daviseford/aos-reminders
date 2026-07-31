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

    const strippedFetcher = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          ...remoteArmy,
          document: { ...legendsDocument, allowsLegends: undefined },
        },
      ])
    )
    await expect(
      createArmyApi('https://army.example', strippedFetcher).listArmies('token')
    ).rejects.toMatchObject({ status: 502 })
  })
})
