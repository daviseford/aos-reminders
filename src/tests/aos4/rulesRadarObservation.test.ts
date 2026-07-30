import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import { artifactChecksum, type ArtifactManifest } from '../../aos4/data'
import type { GamesWorkshopDiscoveryResult, GamesWorkshopDownload } from '../../aos4/data/gamesWorkshop'
import {
  createRequestLimiter,
  mapWithConcurrency,
  observeGamesWorkshopRadar,
  observeWahapediaRadar,
  parseRobotsPolicy,
  readRulesRadarConfig,
  robotsAllows,
  type RadarFetch,
  type SourceObservationClassifications,
} from '../../aos4/radar'
import { parseRulesRadarObserveArguments } from '../../aos4/radar/observeCommand'
import baselineFixture from '../fixtures/aos4/radar/baseline.json'

const observedAt = '2026-07-29T20:00:00.000Z'
const fixtures = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'radar')
const fixtureText = (name: string): string => readFileSync(path.join(fixtures, name), 'utf8')
const bytes = (value: string): Uint8Array => new TextEncoder().encode(value)
const checksum = (character: string): string => character.repeat(64)
const config = readRulesRadarConfig('data/aos4/radar/config.json', process.cwd())
const baseline = baselineFixture as {
  manifest: ArtifactManifest
  classifications: SourceObservationClassifications
}

const download = (title: string, url: string): GamesWorkshopDownload => ({
  externalId: title,
  title,
  url,
  categories: ['rules'],
  gameSystems: ['warhammer-age-of-sigmar'],
  topics: ['downloads'],
  discoveryMethod: 'private-api',
})

const discovery = (
  downloads: GamesWorkshopDownload[],
  method: GamesWorkshopDiscoveryResult['method'] = 'private-api'
): GamesWorkshopDiscoveryResult => ({
  downloads,
  diagnostics: [],
  method,
})

const workbookBytes = (): Uint8Array => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['File'],
    [
      {
        v: 'Last_update.csv',
        l: { Target: 'https://wahapedia.ru/aos4/Last_update.csv' },
      },
    ],
  ])
  XLSX.utils.book_append_sheet(workbook, worksheet, 'EN')
  return new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }))
}

describe('AoS 4 Rules Radar source observation', () => {
  it('uses the official private API without downloading the page when it succeeds', async () => {
    let pageRequests = 0
    const result = await observeGamesWorkshopRadar(
      {
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
      },
      {
        now: () => observedAt,
        discoverPrivate: async () =>
          discovery([download('Current rules', 'https://assets.warhammer-community.com/current-rules.pdf')]),
        fetchDownloadsPage: async () => {
          pageRequests += 1
          return fixtureText('games-workshop-page.html')
        },
      }
    )

    expect(result.lane.events).toEqual([])
    expect(result.observation?.entries).toHaveLength(1)
    expect(result.requestCount).toBe(1)
    expect(pageRequests).toBe(0)
  })

  it('falls back to the official page and reports both discovery failures operationally', async () => {
    const fallback = await observeGamesWorkshopRadar(
      {
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
      },
      {
        now: () => observedAt,
        discoverPrivate: async () => discovery([], 'none'),
        fetchDownloadsPage: async () => fixtureText('games-workshop-page.html'),
      }
    )
    expect(fallback.lane.events).toEqual([])
    expect(fallback.requestCount).toBe(2)

    const failed = await observeGamesWorkshopRadar(
      {
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
      },
      {
        now: () => observedAt,
        discoverPrivate: async () => discovery([], 'none'),
        fetchDownloadsPage: async () => {
          throw new Error('page timeout')
        },
      }
    )
    expect(failed.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-unavailable',
    })
  })

  it('evaluates the most specific robots rule for the Rules Radar user agent', () => {
    const policy = parseRobotsPolicy(`
      User-agent: *
      Disallow: /aos4/
      Allow: /aos4/public/

      User-agent: aos-reminders-rules-radar
      Allow: /aos4/
      Disallow: /aos4/private/
    `)

    expect(robotsAllows(policy, 'aos-reminders-rules-radar', '/aos4/the-rules/')).toBe(true)
    expect(robotsAllows(policy, 'aos-reminders-rules-radar', '/aos4/private/source')).toBe(false)
  })

  it('supports robots wildcards and end anchors', () => {
    const policy = parseRobotsPolicy(`
      User-agent: *
      Disallow: /aos4/factions/*/warscrolls.html$
      Allow: /aos4/factions/public/*
    `)

    expect(robotsAllows(policy, 'aos-reminders-rules-radar', '/aos4/factions/private/warscrolls.html')).toBe(
      false
    )
    expect(
      robotsAllows(policy, 'aos-reminders-rules-radar', '/aos4/factions/private/warscrolls.html?print=1')
    ).toBe(true)
    expect(robotsAllows(policy, 'aos-reminders-rules-radar', '/aos4/factions/public/unit')).toBe(true)
  })

  it('fetches only robots, navigation, the export specification, and Last_update.csv', async () => {
    const requested: string[] = []
    const result = await observeWahapediaRadar(
      {
        config,
        acceptedManifest: manifestWithAcceptedLastUpdate(checksum('f')),
      },
      {
        now: () => observedAt,
        fetch: fixtureFetch(requested, {
          robots: fixtureText('robots-allowed.txt'),
          lastUpdate: fixtureText('Last_update.csv'),
        }),
      }
    )

    expect(requested).toEqual([
      'https://wahapedia.ru/robots.txt',
      config.wahapedia.navigationUrl,
      'https://wahapedia.ru/aos4/Export%20Data%20Specs.xlsx',
      config.wahapedia.lastUpdateUrl,
    ])
    expect(result.requestCount).toBe(4)
    expect(result.requiresExpandedObservation).toBe(true)
    expect(result.observation?.entries.map(entry => entry.kind)).toEqual(['faction', 'rules-page', 'export'])
  })

  it('stops before a disallowed path and returns an operational event', async () => {
    const requested: string[] = []
    const result = await observeWahapediaRadar(
      { config, acceptedManifest: baseline.manifest },
      {
        now: () => observedAt,
        fetch: fixtureFetch(requested, {
          robots: fixtureText('robots-disallowed.txt'),
          lastUpdate: fixtureText('Last_update.csv'),
        }),
      }
    )

    expect(requested).toEqual(['https://wahapedia.ru/robots.txt'])
    expect(result.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-contract-changed',
    })
  })

  it('fails closed when the request budget or provider contract is exceeded', async () => {
    const budgetConfig = {
      ...config,
      requestBudgets: { ...config.requestBudgets, wahapedia: 3 },
    }
    const budget = await observeWahapediaRadar(
      { config: budgetConfig, acceptedManifest: baseline.manifest },
      {
        now: () => observedAt,
        fetch: fixtureFetch([], {
          robots: fixtureText('robots-allowed.txt'),
          lastUpdate: fixtureText('Last_update.csv'),
        }),
      }
    )
    expect(budget.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-contract-changed',
    })

    const malformed = await observeWahapediaRadar(
      { config, acceptedManifest: baseline.manifest },
      {
        now: () => observedAt,
        fetch: fixtureFetch([], {
          robots: fixtureText('robots-allowed.txt'),
          index: '<html><body>No spreadsheet</body></html>',
          lastUpdate: fixtureText('Last_update.csv'),
        }),
      }
    )
    expect(malformed.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-contract-changed',
    })
  })

  it('bounds pacing, concurrency, and source selection', async () => {
    const waits: number[] = []
    const limiter = createRequestLimiter({
      budget: 2,
      paceMs: 25,
      wait: async milliseconds => {
        waits.push(milliseconds)
      },
    })
    await Promise.all([limiter.run(async () => 'first'), limiter.run(async () => 'second')])
    await expect(limiter.run(async () => 'third')).rejects.toThrow(/budget/)
    expect(limiter.count).toBe(2)
    expect(waits).toEqual([25])

    let active = 0
    let maximumActive = 0
    await mapWithConcurrency([1, 2, 3, 4], 2, async value => {
      active += 1
      maximumActive = Math.max(maximumActive, active)
      await Promise.resolve()
      active -= 1
      return value
    })
    expect(maximumActive).toBe(2)
    expect(parseRulesRadarObserveArguments(['--source', 'all', '--pace-ms', '0']).source).toBe('all')
  })
})

const manifestWithAcceptedLastUpdate = (lastUpdateChecksum: string): ArtifactManifest => ({
  schemaVersion: 1,
  artifacts: [
    ...baseline.manifest.artifacts,
    {
      requestUrl: config.wahapedia.lastUpdateUrl,
      finalUrl: config.wahapedia.lastUpdateUrl,
      redirectChain: [],
      retrievedAt: '2026-07-28T18:00:00.000Z',
      adapterVersion: 'wahapedia-export/1',
      mediaType: 'text/csv',
      byteLength: 20,
      checksum: lastUpdateChecksum,
    },
  ],
})

const fixtureFetch = (
  requested: string[],
  overrides: { robots: string; index?: string; lastUpdate: string }
): RadarFetch => {
  const specification = workbookBytes()
  return async request => {
    requested.push(request.url)
    let body: Uint8Array
    if (request.url.endsWith('/robots.txt')) {
      body = bytes(overrides.robots)
    } else if (request.url === config.wahapedia.navigationUrl) {
      body = bytes(overrides.index ?? fixtureText('wahapedia-index.html'))
    } else if (request.url.endsWith('.xlsx')) {
      body = specification
    } else if (request.url === config.wahapedia.lastUpdateUrl) {
      body = bytes(overrides.lastUpdate)
    } else {
      throw new Error(`Unexpected fixture URL ${request.url}`)
    }
    return {
      finalUrl: request.url,
      bytes: body,
      checksum: artifactChecksum(body),
    }
  }
}
