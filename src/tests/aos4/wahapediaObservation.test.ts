import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import {
  AcquisitionError,
  artifactChecksum,
  type AcquireArtifactRequest,
  type AcquireArtifactResult,
  type ArtifactManifestEntry,
} from '../../aos4/data'
import { RequestBudgetExceededError } from '../../aos4/radar'
import {
  createWahapediaSourceObservation,
  discoverWahapediaExportUrls,
  discoverWahapediaNavFragmentUrl,
  discoverWahapediaNavigation,
  discoverWahapediaWarscrollCollection,
  WAHAPEDIA_DATA_EXPORT_URL,
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

  it('discovers the navigation fragment and merges its links with the page', () => {
    const page = `
      <div id="siteNav" data-nav-src="/aos4/nav.html"></div>
      <a href="/aos4/Export%20Data%20Specs.xlsx">here</a>
    `
    expect(discoverWahapediaNavFragmentUrl(page)).toBe('https://wahapedia.ru/aos4/nav.html')
    expect(
      discoverWahapediaNavFragmentUrl('<a href="/aos4/Export%20Data%20Specs.xlsx">here</a>')
    ).toBeUndefined()

    const discovery = discoverWahapediaNavigation(
      page,
      WAHAPEDIA_DATA_EXPORT_URL,
      `
        <div class="NavColumns2">
          <a href="/aos4/the-rules/the-core-rules">The Core Rules</a>
        </div>
        <div class="NavColumns3">
          <a href="/aos4/factions/stormcast-eternals">Stormcast Eternals</a>
        </div>
      `
    )
    expect(discovery.rulesPages.map(entry => entry.title)).toEqual(['The Core Rules'])
    expect(discovery.factionPages.map(entry => entry.title)).toEqual(['Stormcast Eternals'])
  })

  it('fails closed when the navigation exposes no faction or rules pages', () => {
    expect(() => discoverWahapediaNavigation('<a href="/aos4/Export%20Data%20Specs.xlsx">here</a>')).toThrow(
      /0 faction pages and 0 rules pages/
    )
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

  /**
   * Observed 2026-09-22: Wahapedia removed the `.datasheetsCollated` link block from every faction
   * root page (the nav column now anchors `#Warscrolls` to an inline section instead). The
   * collection itself is still published at the conventional path, which
   * `src/aos4/data/wahapediaHtml/parse.ts`'s `factionRootWarscrollScope` already treats as
   * authoritative for generation, so discovery falls back to the same derivation rather than a
   * second selector.
   */
  it('derives the conventional collection path when the page no longer links one', () => {
    expect(
      discoverWahapediaWarscrollCollection(
        `<div class="mw1 i30 ATln"><a href="#Warscrolls" class="cnClrInv">Warscrolls</a></div>`,
        'https://wahapedia.ru/aos4/factions/sons-of-behemat/'
      )
    ).toBe('https://wahapedia.ru/aos4/factions/sons-of-behemat/warscrolls.html')
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

  it('derives and confirms a collection page absent the old link block, and omits a genuinely missing one', async () => {
    const text = new TextEncoder()
    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([['Warscrolls.csv']])
    sheet.A1.l = { Target: 'https://wahapedia.ru/aos4/Warscrolls.csv' }
    XLSX.utils.book_append_sheet(workbook, sheet, 'EN')
    const spreadsheet = new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }))

    const acquire: (request: AcquireArtifactRequest) => Promise<AcquireArtifactResult> = async request => {
      if (request.url.endsWith('/factions/endless-spells/warscrolls.html')) {
        throw new AcquisitionError('http-status', `Request to ${request.url} returned HTTP 404`)
      }
      const body = request.url.endsWith('/robots.txt')
        ? text.encode('User-agent: *\nAllow: /')
        : request.url.endsWith('Export%20Data%20Specs.xlsx')
          ? spreadsheet
          : request.url.endsWith('/the-rules/data-export/')
            ? text.encode(`
                <div id="siteNav" data-nav-src="/aos4/nav.html"></div>
                <a href="/aos4/Export%20Data%20Specs.xlsx">Export specification</a>
              `)
            : request.url.endsWith('/aos4/nav.html')
              ? text.encode(`
                  <div class="NavColumns2">
                    <a href="/aos4/the-rules/the-core-rules/">Core Rules</a>
                  </div>
                  <div class="NavColumns3">
                    <a href="/aos4/factions/sons-of-behemat/">Sons of Behemat</a>
                    <a href="/aos4/factions/endless-spells/">Endless Spells</a>
                  </div>
                `)
              : // Neither faction page links a collection any more (the site dropped
                // `.datasheetsCollated`); only Sons of Behemat's derived collection exists.
                text.encode('<div class="mw1 i30 ATln"><a href="#Warscrolls">Warscrolls</a></div>')
      const entry: ArtifactManifestEntry = {
        requestUrl: request.url,
        finalUrl: request.url,
        redirectChain: [],
        retrievedAt: '2026-09-22T00:00:00.000Z',
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

    const { observation } = await observeWahapediaSources(fullObservationInput(), {
      acquire,
      now: () => '2026-09-22T00:00:00.000Z',
      wait: async () => undefined,
    })

    const collectionEntries = observation.entries.filter(entry => /warscrolls\.html/.test(entry.url))
    expect(collectionEntries).toEqual([
      expect.objectContaining({
        url: 'https://wahapedia.ru/aos4/factions/sons-of-behemat/warscrolls.html',
        availability: 'accessible',
      }),
    ])
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
              <div id="siteNav" data-nav-src="/aos4/nav.html"></div>
              <a href="/aos4/Export%20Data%20Specs.xlsx">Export specification</a>
            `)
          : request.url.endsWith('/aos4/nav.html')
            ? text.encode(`
                <div class="NavColumns2">
                  <a href="/aos4/the-rules/the-core-rules/">Core Rules</a>
                </div>
                <div class="NavColumns3">
                  <a href="/aos4/factions/stormcast-eternals/">Stormcast Eternals</a>
                </div>
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
