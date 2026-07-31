import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import {
  artifactChecksum,
  type AcquireArtifactRequest,
  type AcquireArtifactResult,
  type ArtifactManifestEntry,
} from '../../aos4/data'
import { RequestBudgetExceededError } from '../../aos4/radar'
import {
  createWahapediaSourceObservation,
  discoverWahapediaExportUrls,
  discoverWahapediaNavigation,
  discoverWahapediaWarscrollCollection,
} from '../../aos4/review/wahapediaObservation'
import { observeWahapediaSources } from '../../aos4/review/wahapediaObservationCommand'

describe('Wahapedia independent source observation', () => {
  it('discovers rule and faction navigation without treating content links as inventory', () => {
    const discovery = discoverWahapediaNavigation(`
      <div class="NavColumns2">
        <a href="/aos4/the-rules/the-core-rules">The Core Rules</a>
      </div>
      <div class="NavColumns3">
        <a href="/aos4/factions/stormcast-eternals">Stormcast Eternals</a>
      </div>
      <div class="Columns3">
        <a href="/aos4/factions/kruleboyz/Kragnos">Kragnos</a>
        <a href="/aos4/Export%20Data%20Specs.xlsx">here</a>
      </div>
    `)

    expect(discovery.rulesPages).toEqual([
      {
        title: 'The Core Rules',
        url: 'https://wahapedia.ru/aos4/the-rules/the-core-rules',
      },
    ])
    expect(discovery.factionPages).toEqual([
      {
        title: 'Stormcast Eternals',
        url: 'https://wahapedia.ru/aos4/factions/stormcast-eternals',
      },
    ])
    expect(discovery.exportSpecificationUrl).toBe('https://wahapedia.ru/aos4/Export%20Data%20Specs.xlsx')
  })

  it('discovers one collated warscroll page and HTTPS-normalizes export links', () => {
    expect(
      discoverWahapediaWarscrollCollection(
        `<span class="datasheetsCollated">
          <a href="/aos4/factions/stormcast-eternals/warscrolls.html">Warscrolls collated</a>
        </span>`,
        'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
      )
    ).toBe('https://wahapedia.ru/aos4/factions/stormcast-eternals/warscrolls.html')

    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([['Warscrolls.csv']])
    sheet.A1.l = { Target: 'http://wahapedia.ru/aos4/Warscrolls.csv' }
    XLSX.utils.book_append_sheet(workbook, sheet, 'EN')
    const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    expect(discoverWahapediaExportUrls(bytes)).toEqual(['https://wahapedia.ru/aos4/Warscrolls.csv'])
  })

  it('marks discovery documents non-material while keeping game data fail-closed', () => {
    const observation = createWahapediaSourceObservation('2026-07-28T18:00:00.000Z', [
      {
        kind: 'data-export-index',
        title: 'Data export index',
        url: 'https://wahapedia.ru/aos4/the-rules/data-export/',
        availability: 'accessible',
      },
      {
        kind: 'rules-page',
        title: 'The Core Rules',
        url: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
        availability: 'inaccessible',
      },
    ])

    expect(observation.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Data export index',
          scope: 'explicit-non-material',
        }),
        expect.objectContaining({
          title: 'The Core Rules',
          scope: 'material',
          availability: 'inaccessible',
        }),
      ])
    )
  })

  it('checks every expanded source against robots before acquisition', async () => {
    const requested: string[] = []
    const acquire = fullObservationAcquire(
      requested,
      `
        User-agent: *
        Allow: /aos4/
        Disallow: /aos4/factions/*/warscrolls.html$
      `
    )

    await expect(
      observeWahapediaSources(fullObservationInput(), {
        acquire,
        now: () => '2026-07-29T20:00:00.000Z',
        wait: async () => undefined,
      })
    ).rejects.toThrow(/robots\.txt disallows/i)
    expect(requested).not.toContain('https://wahapedia.ru/aos4/factions/stormcast-eternals/warscrolls.html')
  })

  it('fails the expanded observation when its request budget is exhausted', async () => {
    const requested: string[] = []
    await expect(
      observeWahapediaSources(
        { ...fullObservationInput(), requestBudget: 4, concurrency: 1 },
        {
          acquire: fullObservationAcquire(requested, 'User-agent: *\nAllow: /'),
          now: () => '2026-07-29T20:00:00.000Z',
          wait: async () => undefined,
        }
      )
    ).rejects.toBeInstanceOf(RequestBudgetExceededError)
    expect(requested).toHaveLength(4)
  })
})

const fullObservationInput = () => ({
  outputPath: 'unused.json',
  cacheDirectory: 'unused-cache',
  concurrency: 2,
  requestBudget: 32,
  paceMs: 0,
})

const fullObservationAcquire = (
  requested: string[],
  robots: string
): ((request: AcquireArtifactRequest) => Promise<AcquireArtifactResult>) => {
  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet([['Warscrolls.csv']])
  sheet.A1.l = { Target: 'https://wahapedia.ru/aos4/Warscrolls.csv' }
  XLSX.utils.book_append_sheet(workbook, sheet, 'EN')
  const spreadsheet = new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }))
  const text = new TextEncoder()

  return async request => {
    requested.push(request.url)
    const body = request.url.endsWith('/robots.txt')
      ? text.encode(robots)
      : request.url.endsWith('Export%20Data%20Specs.xlsx')
        ? spreadsheet
        : request.url.endsWith('/the-rules/data-export/')
          ? text.encode(`
              <div class="NavColumns2">
                <a href="/aos4/the-rules/the-core-rules/">Core Rules</a>
              </div>
              <div class="NavColumns3">
                <a href="/aos4/factions/stormcast-eternals/">Stormcast Eternals</a>
              </div>
              <a href="/aos4/Export%20Data%20Specs.xlsx">Export specification</a>
            `)
          : request.url.endsWith('/factions/stormcast-eternals/')
            ? text.encode(`
                <span class="datasheetsCollated">
                  <a href="/aos4/factions/stormcast-eternals/warscrolls.html">Warscrolls</a>
                </span>
              `)
            : text.encode('fixture body')
    const entry: ArtifactManifestEntry = {
      requestUrl: request.url,
      finalUrl: request.url,
      redirectChain: [],
      retrievedAt: '2026-07-29T20:00:00.000Z',
      adapterVersion: request.adapterVersion,
      mediaType: request.allowedMediaTypes[0],
      byteLength: body.byteLength,
      checksum: artifactChecksum(body),
    }
    return {
      bytes: body,
      entry,
      candidateManifest: { schemaVersion: 1, artifacts: [entry] },
      changed: true,
    }
  }
}
