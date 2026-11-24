import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import { artifactChecksum, type ArtifactManifest } from '../../aos4/data'
import { readRulesRadarConfig } from '../../aos4/radar/config'
import { observeWahapediaRadar, type RadarFetch } from '../../aos4/radar/observers/wahapedia'
import {
  discoverWahapediaNavigation,
  unlistedRetainedFactionPages,
  withExportFactionPages,
  withRetainedFactionPages,
} from '../../aos4/review/wahapediaObservation'

// #2113 (regression from #2111): live Wahapedia navigation links faction pages without a trailing
// slash, while Factions.csv links them the same way; comparing them must ignore the slash, or every
// navigated faction is added a second time and the radar fails closed on duplicate locators.
const fixtures = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'radar')
const bytes = (value: string): Uint8Array => new TextEncoder().encode(value)
const config = readRulesRadarConfig('data/aos4/radar/config.json', process.cwd())

const indexHtml =
  '<div id="siteNav" data-nav-src="/aos4/nav.html"></div><a href="/aos4/Export%20Data%20Specs.xlsx">Export specification</a>'
// The live navigation form (2026-11-19): no trailing slash on faction links.
const navHtml = `
  <div class="NavColumns2"><a href="/aos4/the-rules/the-core-rules/">Core Rules</a></div>
  <div class="NavColumns3">
    <a href="/aos4/factions/beasts-of-chaos">Beasts of Chaos</a>
    <a href="/aos4/factions/khazalite-holds">Khazalite Holds</a>
  </div>
`
const factionsCsv = [
  '﻿id|name|link|',
  'BoC|Beasts of Chaos|https://wahapedia.ru/aos4/factions/beasts-of-chaos|',
  'FY|Fyreslayers|https://wahapedia.ru/aos4/factions/fyreslayers|',
  '',
].join('\r\n')
const slashless = (url: string) => url.replace(/\/$/, '')

describe('faction pages linked from Factions.csv beside slashless navigation (#2113)', () => {
  it('adds only the exported page the navigation lacks, once', () => {
    const navigation = discoverWahapediaNavigation(
      indexHtml,
      'https://wahapedia.ru/aos4/the-rules/data-export/',
      navHtml
    )
    const pages = withExportFactionPages(navigation, factionsCsv).factionPages
    expect(pages.map(page => slashless(page.url)).sort()).toEqual([
      'https://wahapedia.ru/aos4/factions/beasts-of-chaos',
      'https://wahapedia.ru/aos4/factions/fyreslayers',
      'https://wahapedia.ru/aos4/factions/khazalite-holds',
    ])
    expect(pages.find(page => slashless(page.url).endsWith('/fyreslayers'))?.title).toBe('Fyreslayers')
  })

  it('gives the radar observation unique locators and no contract failure', async () => {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['File'],
        [{ v: 'Last_update.csv', l: { Target: config.wahapedia.lastUpdateUrl } }],
        [{ v: 'Factions.csv', l: { Target: 'https://wahapedia.ru/aos4/Factions.csv' } }],
      ]),
      'EN'
    )
    const specification = new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }))
    const requested: string[] = []
    const fetch: RadarFetch = async request => {
      requested.push(request.url)
      const body = request.url.endsWith('/robots.txt')
        ? bytes(readFileSync(path.join(fixtures, 'robots-allowed.txt'), 'utf8'))
        : request.url === config.wahapedia.navigationUrl
          ? bytes(indexHtml)
          : request.url === 'https://wahapedia.ru/aos4/nav.html'
            ? bytes(navHtml)
            : request.url.endsWith('.xlsx')
              ? specification
              : request.url === config.wahapedia.lastUpdateUrl
                ? bytes(readFileSync(path.join(fixtures, 'Last_update.csv'), 'utf8'))
                : request.url === 'https://wahapedia.ru/aos4/Factions.csv'
                  ? bytes(factionsCsv)
                  : undefined
      if (!body) throw new Error(`Unexpected fixture URL ${request.url}`)
      return { finalUrl: request.url, bytes: body, checksum: artifactChecksum(body) }
    }
    const acceptedManifest = { schemaVersion: 1, artifacts: [] } as unknown as ArtifactManifest
    const result = await observeWahapediaRadar(
      { config, acceptedManifest },
      { now: () => '2026-11-19T20:00:00.000Z', fetch }
    )

    expect(requested).toContain('https://wahapedia.ru/aos4/Factions.csv')
    expect(result.lane.events.filter(event => event.changeKind === 'source-contract-changed')).toEqual([])
    const locators = (result.observation?.entries ?? []).map(entry => slashless(entry.locator))
    expect(new Set(locators).size).toBe(locators.length)
    expect(
      (result.observation?.entries ?? [])
        .filter(entry => entry.kind === 'faction')
        .map(entry => slashless(entry.locator))
        .sort()
    ).toEqual([
      'https://wahapedia.ru/aos4/factions/beasts-of-chaos',
      'https://wahapedia.ru/aos4/factions/fyreslayers',
      'https://wahapedia.ru/aos4/factions/khazalite-holds',
    ])
  })
})

// #1757 (2026-11-22 21:15:57 export): Fyreslayers left Factions.csv as well as the navigation, yet
// both pages are still served and the corpus keeps them. The reviewed retained list keeps the page
// observed instead of reporting it removed, and a page that stops being served fails closed.
describe('reviewed retained faction pages no Wahapedia surface lists (#1757)', () => {
  const novemberFactionsCsv = [
    '﻿id|name|link|',
    'BoC|Beasts of Chaos|https://wahapedia.ru/aos4/factions/beasts-of-chaos|',
    'KH|Khazalite Holds|https://wahapedia.ru/aos4/factions/khazalite-holds|',
    '',
  ].join('\r\n')
  // Retained in the accepted manifest's trailing-slash form, so it never depends on a redirect.
  const fyreslayers = 'https://wahapedia.ru/aos4/factions/fyreslayers/'

  const observe = async (fyreslayersServed: boolean) => {
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([
        ['File'],
        [{ v: 'Last_update.csv', l: { Target: config.wahapedia.lastUpdateUrl } }],
        [{ v: 'Factions.csv', l: { Target: 'https://wahapedia.ru/aos4/Factions.csv' } }],
      ]),
      'EN'
    )
    const specification = new Uint8Array(XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }))
    const requested: string[] = []
    const fetch: RadarFetch = async request => {
      requested.push(request.url)
      const body = request.url.endsWith('/robots.txt')
        ? bytes(readFileSync(path.join(fixtures, 'robots-allowed.txt'), 'utf8'))
        : request.url === config.wahapedia.navigationUrl
          ? bytes(indexHtml)
          : request.url === 'https://wahapedia.ru/aos4/nav.html'
            ? bytes(navHtml)
            : request.url.endsWith('.xlsx')
              ? specification
              : request.url === config.wahapedia.lastUpdateUrl
                ? bytes(readFileSync(path.join(fixtures, 'Last_update.csv'), 'utf8'))
                : request.url === 'https://wahapedia.ru/aos4/Factions.csv'
                  ? bytes(novemberFactionsCsv)
                  : request.url === fyreslayers && fyreslayersServed
                    ? bytes('<html></html>')
                    : undefined
      if (!body) throw new Error(`HTTP 404 for ${request.url}`)
      return { finalUrl: request.url, bytes: body, checksum: artifactChecksum(body) }
    }
    const acceptedManifest = { schemaVersion: 1, artifacts: [] } as unknown as ArtifactManifest
    const result = await observeWahapediaRadar(
      { config, acceptedManifest },
      { now: () => '2026-11-24T06:47:51.280Z', fetch }
    )
    return { result, requested }
  }

  it('keeps the delisted Fyreslayers page in the inventory discovery, once', () => {
    const navigation = discoverWahapediaNavigation(
      indexHtml,
      'https://wahapedia.ru/aos4/the-rules/data-export/',
      navHtml
    )
    const exported = withExportFactionPages(navigation, novemberFactionsCsv)
    expect(unlistedRetainedFactionPages(exported).map(page => page.url)).toEqual([fyreslayers])
    const pages = withRetainedFactionPages(exported)
      .factionPages.map(page => slashless(page.url))
      .sort()
    expect(pages).toEqual([
      'https://wahapedia.ru/aos4/factions/beasts-of-chaos',
      slashless(fyreslayers),
      'https://wahapedia.ru/aos4/factions/khazalite-holds',
    ])
    // Listed again by Wahapedia: nothing extra to add.
    expect(unlistedRetainedFactionPages(withExportFactionPages(navigation, factionsCsv))).toEqual([])
  })

  it('observes the served page in the radar instead of reporting it removed', async () => {
    const { result, requested } = await observe(true)
    expect(requested).toContain(fyreslayers)
    expect(result.lane.events.filter(event => event.class === 'operational')).toEqual([])
    expect(
      (result.observation?.entries ?? [])
        .filter(entry => entry.kind === 'faction')
        .map(entry => slashless(entry.locator))
    ).toContain(slashless(fyreslayers))
  })

  it('fails the lane closed once the retained page is no longer served', async () => {
    const { result } = await observe(false)
    expect(result.observation).toBeUndefined()
    expect(result.lane.events.map(event => event.changeKind)).toEqual(['source-contract-changed'])
    expect(result.lane.events[0]?.evidence).toMatchObject({ details: expect.stringContaining('fyreslayers') })
  })
})
