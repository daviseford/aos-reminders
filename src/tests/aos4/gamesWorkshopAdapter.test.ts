import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  compareGamesWorkshopDownloadCatalog,
  createGamesWorkshopDownloadSearchRequest,
  createGamesWorkshopPdfAcquisitionRequest,
  decodeGamesWorkshopDownloadSearch,
  discoverGamesWorkshopDownloadsFromPage,
  resolveGamesWorkshopDiscovery,
  searchCurrentGamesWorkshopDownloads,
  type AddressResolver,
  type GamesWorkshopDownload,
  type HttpRequest,
  type HttpResponse,
  type HttpTransport,
} from '../../aos4/data'
import { parseGamesWorkshopCatalogArguments } from '../../aos4/data/gamesWorkshop/catalogCommand'

const fixture = (name: string) =>
  readFile(path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'games-workshop', name), 'utf8')

const chunks = async function* (value: Uint8Array): AsyncIterable<Uint8Array> {
  yield value
}

const response = (
  status: number,
  value: string,
  headers: Record<string, string> = { 'content-type': 'application/json' }
): HttpResponse => ({
  status,
  headers,
  body: chunks(new TextEncoder().encode(value)),
})

class FakeTransport implements HttpTransport {
  readonly requests: HttpRequest[] = []

  constructor(private readonly response: HttpResponse | Error) {}

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    if (this.response instanceof Error) throw this.response
    return this.response
  }
}

const publicResolver: AddressResolver = async () => ['203.0.113.10']
const searchPolicy = {
  allowedHosts: ['www.warhammer-community.com'],
  resolveAddresses: publicResolver,
}

const download = (overrides: Partial<GamesWorkshopDownload> = {}): GamesWorkshopDownload => ({
  externalId: 'core-rules',
  title: 'Core Rules',
  url: 'https://assets.warhammer-community.com/aos4/core-rules.pdf',
  language: 'english',
  categories: [],
  gameSystems: ['warhammer-age-of-sigmar'],
  topics: [],
  discoveryMethod: 'private-api',
  ...overrides,
})

describe('Games Workshop download discovery', () => {
  it('represents the currently observed private search contract explicitly', () => {
    expect(createGamesWorkshopDownloadSearchRequest()).toEqual({
      index: 'downloads_v2',
      searchTerm: '',
      gameSystem: 'warhammer-age-of-sigmar',
      language: 'english',
    })
  })

  it('posts the bounded private search request and decodes its response', async () => {
    const transport = new FakeTransport(response(200, await fixture('downloads-api.json')))

    const result = await searchCurrentGamesWorkshopDownloads({
      transport,
      policy: searchPolicy,
    })

    expect(result.method).toBe('private-api')
    expect(result.downloads).toHaveLength(1)
    expect(transport.requests).toHaveLength(1)
    expect(transport.requests[0]).toMatchObject({
      url: 'https://www.warhammer-community.com/api/search/downloads/',
      method: 'POST',
      approvedAddresses: ['203.0.113.10'],
      headers: expect.objectContaining({
        accept: 'application/json',
        'content-type': 'application/json',
        origin: 'https://www.warhammer-community.com',
      }),
    })
    expect(JSON.parse(new TextDecoder().decode(transport.requests[0].body))).toEqual(
      createGamesWorkshopDownloadSearchRequest()
    )
  })

  it.each([
    ['non-success status', response(503, '')],
    ['unexpected media type', response(200, '<html></html>', { 'content-type': 'text/html' })],
    ['invalid JSON', response(200, '{')],
    ['network failure', new Error('offline')],
  ])('fails closed when private search has a %s', async (_label, privateResponse) => {
    const result = await searchCurrentGamesWorkshopDownloads({
      transport: new FakeTransport(privateResponse),
      policy: searchPolicy,
    })

    expect(result).toEqual({
      downloads: [],
      diagnostics: [
        expect.objectContaining({
          code: 'private-api-unavailable',
          severity: 'error',
        }),
      ],
      method: 'none',
    })
  })

  it('decodes wrapped search hits, trusted asset paths, and taxonomies', async () => {
    const result = decodeGamesWorkshopDownloadSearch(JSON.parse(await fixture('downloads-api.json')))

    expect(result.method).toBe('private-api')
    expect(result.downloads).toHaveLength(1)
    expect(result.downloads[0]).toMatchObject({
      externalId: 'official-core-rules',
      title: 'Age of Sigmar Core Rules',
      url: 'https://assets.warhammer-community.com/aos4/core-rules.pdf',
      categories: ['core-rules-and-key-downloads'],
      gameSystems: ['warhammer-age-of-sigmar'],
      topics: ['Core Rules'],
    })
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'duplicate-download', severity: 'warning' })
    )
  })

  it('rejects an incompatible private response without inventing records', () => {
    expect(decodeGamesWorkshopDownloadSearch({ results: [] })).toEqual({
      downloads: [],
      diagnostics: [expect.objectContaining({ code: 'private-api-incompatible', severity: 'error' })],
      method: 'none',
    })
  })

  it('finds trusted direct and inert JSON PDF links without evaluating scripts', async () => {
    const result = discoverGamesWorkshopDownloadsFromPage(await fixture('downloads-page.html'))

    expect(result.downloads.map(item => [item.title, item.discoveryMethod])).toEqual([
      ['Battle Profiles', 'page-link'],
      ['Core Rules', 'embedded-json'],
    ])
    expect(result.downloads.every(item => item.url.includes('warhammer-community.com'))).toBe(true)
  })

  it('falls back to page discovery and retains the private adapter failure', async () => {
    const result = resolveGamesWorkshopDiscovery(
      decodeGamesWorkshopDownloadSearch({ error: 'temporary failure' }),
      await fixture('downloads-page.html')
    )

    expect(result.method).toBe('page-link')
    expect(result.downloads).toHaveLength(2)
    expect(result.diagnostics.map(item => item.code)).toEqual(
      expect.arrayContaining(['private-api-unavailable', 'private-api-incompatible'])
    )
  })

  it('reports a page shape with no trusted links as incompatible', () => {
    const result = discoverGamesWorkshopDownloadsFromPage(
      '<a href="http://assets.warhammer-community.com/rules.pdf">HTTP</a>'
    )

    expect(result.downloads).toEqual([])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'page-incompatible', severity: 'error' })
    )
  })

  it('detects changed revisions separately from additions and removals', () => {
    const previous = [
      download({ updatedDate: '2026-01-01' }),
      download({
        externalId: 'removed',
        title: 'Removed FAQ',
        url: 'https://assets.warhammer-community.com/aos4/removed.pdf',
      }),
    ]
    const current = [
      download({
        url: 'https://assets.warhammer-community.com/aos4/core-rules-v2.pdf',
        updatedDate: '2026-07-27',
      }),
      download({
        externalId: 'added',
        title: 'New FAQ',
        url: 'https://assets.warhammer-community.com/aos4/new.pdf',
      }),
    ]

    const result = compareGamesWorkshopDownloadCatalog(previous, current)

    expect(result.revised).toEqual([{ previous: previous[0], current: current[0] }])
    expect(result.added).toEqual([current[1]])
    expect(result.removed).toEqual([previous[1]])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'new-download-revision', field: 'url' })
    )
  })

  it('creates a bounded PDF acquisition request', () => {
    expect(createGamesWorkshopPdfAcquisitionRequest(download())).toEqual({
      url: 'https://assets.warhammer-community.com/aos4/core-rules.pdf',
      adapterVersion: 'games-workshop-pdf/1',
      allowedMediaTypes: ['application/pdf'],
      maxBytes: 64 * 1024 * 1024,
      timeoutMs: 30_000,
    })
  })

  it('parses the official catalog command without hidden defaults', () => {
    expect(
      parseGamesWorkshopCatalogArguments([
        '--output',
        'downloads.json',
        '--language',
        'german',
        '--search',
        'battle profiles',
      ])
    ).toEqual({
      output: 'downloads.json',
      language: 'german',
      searchTerm: 'battle profiles',
    })
    expect(() => parseGamesWorkshopCatalogArguments(['--unknown'])).toThrow('Unknown argument')
  })
})
