import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import {
  AcquisitionError,
  artifactChecksum,
  type AcquireArtifactRequest,
  type AcquireArtifactResult,
  type ArtifactManifestEntry,
} from '../../aos4/data'
import { RequestBudgetExceededError } from '../../aos4/radar/observers/requestLimiter'
import {
  createWahapediaSourceObservation,
  discoverWahapediaExportUrls,
  discoverWahapediaNavFragmentUrl,
  discoverWahapediaNavigation,
  discoverWahapediaWarscrollCollection,
  WAHAPEDIA_DATA_EXPORT_URL,
} from '../../aos4/review/wahapediaObservation'
import {
  DEFAULT_RETRIES,
  DEFAULT_TIMEOUT_MS,
  observeWahapediaSources,
  parseWahapediaObservationArguments,
  RETRY_BACKOFF_MS,
} from '../../aos4/review/wahapediaObservationCommand'

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

  it('marks only the exact glossary page non-material among the rules pages (#2087)', () => {
    const observation = createWahapediaSourceObservation('2026-10-26T23:17:12.000Z', [
      {
        kind: 'rules-page',
        title: 'Glossary',
        url: 'https://wahapedia.ru/aos4/the-rules/glossary/',
        availability: 'accessible',
        fingerprint: 'd3afb7b475f07e9b4845bc34037c67fa1157fb34d3e9be7879806fc6387207bb',
      },
      {
        kind: 'rules-page',
        title: 'Glossary (other)',
        url: 'https://wahapedia.ru/aos4/the-rules/glossary-2/',
        availability: 'accessible',
      },
      {
        kind: 'faction-page',
        title: 'Not a rules page',
        url: 'https://wahapedia.ru/aos4/factions/glossary/',
        availability: 'accessible',
      },
    ])

    expect(observation.entries.map(entry => [entry.title, entry.scope])).toEqual([
      ['Glossary', 'explicit-non-material'],
      ['Glossary (other)', 'material'],
      ['Not a rules page', 'material'],
    ])
    expect(observation.entries[0]).toMatchObject({
      fingerprint: 'd3afb7b475f07e9b4845bc34037c67fa1157fb34d3e9be7879806fc6387207bb',
      disposition: expect.stringMatching(/carries no core-rules prose or glossary/),
    })
  })

  it('keeps a changed or unfingerprinted glossary page material (#2087)', () => {
    const glossary = (title: string, fingerprint?: string) => ({
      kind: 'rules-page' as const,
      title,
      url: 'https://wahapedia.ru/aos4/the-rules/glossary/',
      availability: 'accessible' as const,
      ...(fingerprint ? { fingerprint } : {}),
    })
    const scopeOf = (fingerprint?: string) =>
      createWahapediaSourceObservation('2026-10-27T00:00:00.000Z', [glossary('Glossary', fingerprint)])
        .entries[0].scope

    expect(scopeOf('0'.repeat(64))).toBe('material')
    expect(scopeOf(undefined)).toBe('material')
    expect(scopeOf('D3AFB7B475F07E9B4845BC34037C67FA1157FB34D3E9BE7879806FC6387207BB')).toBe(
      'explicit-non-material'
    )
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

describe('Wahapedia observation transport resilience', () => {
  const CORE_RULES_URL = 'https://wahapedia.ru/aos4/the-rules/the-core-rules/'
  const timeout = () => new AcquisitionError('timeout', 'Request timed out after 120000ms')

  /** Throws `errors` in order for `url`, then serves the fixture. */
  const failingFirst = (requested: string[], url: string, errors: Error[]) => {
    const fixture = fullObservationAcquire(requested, 'User-agent: *\nAllow: /')
    const remaining = [...errors]
    return async (request: AcquireArtifactRequest) => {
      if (request.url === url && remaining.length) {
        requested.push(request.url)
        throw remaining.shift()!
      }
      return fixture(request)
    }
  }

  const observe = (
    input: Partial<ReturnType<typeof fullObservationInput>> & { retries?: number },
    acquire: ReturnType<typeof failingFirst>,
    waits: number[] = []
  ) =>
    observeWahapediaSources(
      { ...fullObservationInput(), ...input },
      {
        acquire,
        now: () => '2026-10-14T16:00:00.000Z',
        wait: async milliseconds => {
          waits.push(milliseconds)
        },
      }
    )

  const coreRules = (entries: Array<{ url: string; availability: string }>) =>
    entries.find(entry => entry.url === CORE_RULES_URL)

  it('retries a timed-out source with a linear backoff and records it accessible', async () => {
    const requested: string[] = []
    const waits: number[] = []
    const { observation, requestCount } = await observe(
      {},
      failingFirst(requested, CORE_RULES_URL, [timeout(), timeout()]),
      waits
    )

    expect(coreRules(observation.entries)?.availability).toBe('accessible')
    expect(requested.filter(url => url === CORE_RULES_URL)).toHaveLength(DEFAULT_RETRIES + 1)
    expect(waits).toEqual([RETRY_BACKOFF_MS, 2 * RETRY_BACKOFF_MS])
    // Each retry is a real request: it is counted, not hidden from the budget.
    expect(requestCount).toBe(requested.length)
  })

  it('marks a source inaccessible once its retries are exhausted', async () => {
    const requested: string[] = []
    const { observation } = await observe(
      { retries: 1 },
      failingFirst(requested, CORE_RULES_URL, [timeout(), timeout(), timeout()])
    )

    expect(coreRules(observation.entries)?.availability).toBe('inaccessible')
    expect(requested.filter(url => url === CORE_RULES_URL)).toHaveLength(2)
  })

  it.each([
    ['an HTTP status', new AcquisitionError('http-status', `Request to ${CORE_RULES_URL} returned HTTP 503`)],
    ['a media-type failure', new AcquisitionError('unexpected-media-type', 'Unexpected media type')],
    ['an oversized response', new AcquisitionError('response-too-large', 'Response exceeded the limit')],
  ])('does not retry %s', async (_label, error) => {
    const requested: string[] = []
    const waits: number[] = []
    const { observation } = await observe({}, failingFirst(requested, CORE_RULES_URL, [error]), waits)

    expect(coreRules(observation.entries)?.availability).toBe('inaccessible')
    expect(requested.filter(url => url === CORE_RULES_URL)).toHaveLength(1)
    expect(waits).toEqual([])
  })

  it('fails closed when retries would exceed the request budget', async () => {
    const requested: string[] = []
    // The fixture needs 8 requests; two retries of one source make 10.
    await expect(
      observe(
        { requestBudget: 9, concurrency: 1 },
        failingFirst(requested, CORE_RULES_URL, [timeout(), timeout(), timeout()])
      )
    ).rejects.toBeInstanceOf(RequestBudgetExceededError)
  })

  it('gives every request the configured whole-request timeout', async () => {
    const timeouts: number[] = []
    const fixture = fullObservationAcquire([], 'User-agent: *\nAllow: /')
    const capture = async (request: AcquireArtifactRequest) => {
      timeouts.push(request.timeoutMs)
      return fixture(request)
    }

    await observe({}, capture)
    expect(new Set(timeouts)).toEqual(new Set([DEFAULT_TIMEOUT_MS]))

    timeouts.length = 0
    await observeWahapediaSources(
      { ...fullObservationInput(), timeoutMs: 45_000 },
      { acquire: capture, now: () => '2026-10-14T16:00:00.000Z', wait: async () => undefined }
    )
    expect(new Set(timeouts)).toEqual(new Set([45_000]))
  })

  it('parses bounded timeout and retry flags', () => {
    expect(parseWahapediaObservationArguments([])).toMatchObject({
      timeoutMs: DEFAULT_TIMEOUT_MS,
      retries: DEFAULT_RETRIES,
    })
    expect(parseWahapediaObservationArguments(['--timeout-ms', '180000', '--retries', '0'])).toMatchObject({
      timeoutMs: 180_000,
      retries: 0,
    })
    expect(() => parseWahapediaObservationArguments(['--timeout-ms', '999'])).toThrow(/--timeout-ms/)
    expect(() => parseWahapediaObservationArguments(['--timeout-ms', '300001'])).toThrow(/--timeout-ms/)
    expect(() => parseWahapediaObservationArguments(['--retries', '4'])).toThrow(/--retries/)
    expect(() => parseWahapediaObservationArguments(['--retries', '-1'])).toThrow(/--retries/)
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
