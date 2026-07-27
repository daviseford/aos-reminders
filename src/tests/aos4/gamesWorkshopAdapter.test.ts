import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  compareGamesWorkshopDownloadCatalog,
  createGamesWorkshopDownloadSearchRequest,
  createGamesWorkshopPdfAcquisitionRequest,
  decodeGamesWorkshopDownloadSearch,
  discoverGamesWorkshopDownloadsFromPage,
  resolveGamesWorkshopDiscovery,
  type GamesWorkshopDownload,
} from '../../aos4/data'

const fixture = (name: string) =>
  readFile(path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'games-workshop', name), 'utf8')

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
})
