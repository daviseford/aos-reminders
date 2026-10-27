import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { describe, expect, it, vi } from 'vitest'
import { artifactChecksum, type ArtifactManifest } from '../../aos4/data'
import { readRulesRadarConfig } from '../../aos4/radar/config'
import { compareWahapediaObservation } from '../../aos4/radar/compare'
import { observeWahapediaRadar, type RadarFetch } from '../../aos4/radar/observers/wahapedia'
import {
  WAHAPEDIA_GLOSSARY_FINGERPRINT,
  WAHAPEDIA_GLOSSARY_URL,
} from '../../aos4/review/wahapediaObservation'

const REVIEWED_GLOSSARY = '<html><body><h1>Glossary</h1><p>Reviewed bytes.</p></body></html>'

// The real reviewed fingerprint is of Wahapedia's page bytes, which are not committed; bind the
// exemption to synthetic bytes here so the observer path can be exercised end to end.
vi.mock('../../aos4/review/wahapediaObservation', async importOriginal => ({
  ...(await importOriginal<typeof import('../../aos4/review/wahapediaObservation')>()),
  WAHAPEDIA_GLOSSARY_FINGERPRINT: createHash('sha256')
    .update('<html><body><h1>Glossary</h1><p>Reviewed bytes.</p></body></html>')
    .digest('hex'),
}))

const observedAt = '2026-10-27T12:00:00.000Z'
const fixtures = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'radar')
const fixtureText = (name: string): string => readFileSync(path.join(fixtures, name), 'utf8')
const bytes = (value: string): Uint8Array => new TextEncoder().encode(value)
const config = readRulesRadarConfig('data/aos4/radar/config.json', process.cwd())
const lastUpdate = fixtureText('Last_update.csv')

const page = (url: string, checksum: string) => ({
  requestUrl: url,
  finalUrl: url,
  redirectChain: [],
  retrievedAt: '2026-10-20T00:00:00.000Z',
  adapterVersion: 'wahapedia-html/1',
  mediaType: 'text/html',
  byteLength: 1,
  checksum,
})

const acceptedManifest: ArtifactManifest = {
  schemaVersion: 1,
  artifacts: [
    page('https://wahapedia.ru/aos4/the-rules/the-core-rules/', 'a'.repeat(64)),
    page('https://wahapedia.ru/aos4/factions/stormcast-eternals/', 'b'.repeat(64)),
    {
      ...page(config.wahapedia.lastUpdateUrl, artifactChecksum(bytes(lastUpdate))),
      adapterVersion: 'wahapedia-export/1',
      mediaType: 'text/csv',
    },
  ],
}

const nav = (withGlossary: boolean): string => `
  <div class="NavColumns2">
    <a href="/aos4/the-rules/the-core-rules/">The Core Rules</a>
    ${withGlossary ? '<a href="/aos4/the-rules/glossary">Glossary</a>' : ''}
  </div>
  <div class="NavColumns3">
    <a href="/aos4/factions/stormcast-eternals/">Stormcast Eternals</a>
  </div>
`

const workbook = (): Uint8Array => {
  const book = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet([
    ['File'],
    [{ v: 'Last_update.csv', l: { Target: config.wahapedia.lastUpdateUrl } }],
  ])
  XLSX.utils.book_append_sheet(book, sheet, 'EN')
  return new Uint8Array(XLSX.write(book, { type: 'array', bookType: 'xlsx' }))
}

const fetchWith =
  (requested: string[], glossary: { listed: boolean; body?: string }): RadarFetch =>
  async request => {
    requested.push(request.url)
    let body: Uint8Array
    if (request.url.endsWith('/robots.txt')) body = bytes(fixtureText('robots-allowed.txt'))
    else if (request.url === config.wahapedia.navigationUrl) body = bytes(fixtureText('wahapedia-index.html'))
    else if (request.url === 'https://wahapedia.ru/aos4/nav.html') body = bytes(nav(glossary.listed))
    else if (request.url.endsWith('.xlsx')) body = workbook()
    else if (request.url === config.wahapedia.lastUpdateUrl) body = bytes(lastUpdate)
    else if (request.url === WAHAPEDIA_GLOSSARY_URL && glossary.body !== undefined)
      body = bytes(glossary.body)
    else throw new Error(`Unexpected fixture URL ${request.url}`)
    return { finalUrl: request.url, bytes: body, checksum: artifactChecksum(body) }
  }

const observe = (glossary: { listed: boolean; body?: string }, requested: string[] = []) =>
  observeWahapediaRadar(
    { config, acceptedManifest },
    { now: () => observedAt, fetch: fetchWith(requested, glossary) }
  )

describe('Rules Radar Wahapedia glossary disposition (#1757)', () => {
  it('is quiet only for the exact reviewed glossary bytes', async () => {
    const requested: string[] = []
    const result = await observe({ listed: true, body: REVIEWED_GLOSSARY }, requested)

    expect(requested).toContain(WAHAPEDIA_GLOSSARY_URL)
    expect(result.requestCount).toBe(6)
    expect(result.lane.events).toEqual([])
    expect(result.requiresExpandedObservation).toBe(false)
  })

  it('reports changed glossary bytes as a material new rules page with the content fingerprint', async () => {
    const changed = REVIEWED_GLOSSARY.replace('Reviewed', 'Changed')
    const result = await observe({ listed: true, body: changed })

    expect(result.lane.events).toHaveLength(1)
    expect(result.lane.events[0]).toMatchObject({
      class: 'material',
      changeKind: 'new-rules-page',
      locator: 'https://wahapedia.ru/aos4/the-rules/glossary',
      observedFingerprint: artifactChecksum(bytes(changed)),
    })
  })

  it('keeps a glossary entry without a content fingerprint material', () => {
    const lane = compareWahapediaObservation({
      acceptedManifest,
      observation: {
        schemaVersion: 1,
        source: 'wahapedia',
        scope: 'sentinel',
        observedAt,
        entries: [
          {
            kind: 'rules-page',
            locator: WAHAPEDIA_GLOSSARY_URL,
            title: 'Glossary',
            fingerprint: artifactChecksum(bytes(WAHAPEDIA_GLOSSARY_URL)),
          },
          {
            kind: 'rules-page',
            locator: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
            title: 'Core',
            fingerprint: 'c'.repeat(64),
          },
          {
            kind: 'faction',
            locator: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/',
            title: 'SCE',
            fingerprint: 'd'.repeat(64),
          },
          {
            kind: 'export',
            locator: config.wahapedia.lastUpdateUrl,
            title: 'Last_update.csv',
            fingerprint: artifactChecksum(bytes(lastUpdate)),
          },
        ],
      },
    })

    expect(lane.events.map(event => [event.changeKind, event.locator])).toEqual([
      ['new-rules-page', 'https://wahapedia.ru/aos4/the-rules/glossary'],
    ])
  })

  it('does not exempt the reviewed fingerprint at any other URL', () => {
    const lane = compareWahapediaObservation({
      acceptedManifest,
      observation: {
        schemaVersion: 1,
        source: 'wahapedia',
        scope: 'sentinel',
        observedAt,
        entries: [
          {
            kind: 'rules-page',
            locator: 'https://wahapedia.ru/aos4/the-rules/glossary-2/',
            title: 'Glossary (other)',
            fingerprint: WAHAPEDIA_GLOSSARY_FINGERPRINT,
          },
          {
            kind: 'export',
            locator: config.wahapedia.lastUpdateUrl,
            title: 'Last_update.csv',
            fingerprint: artifactChecksum(bytes(lastUpdate)),
          },
        ],
      },
    })

    expect(lane.events.map(event => event.changeKind)).toContain('new-rules-page')
  })

  it('does not fetch the glossary when the navigation no longer lists it', async () => {
    const requested: string[] = []
    const result = await observe({ listed: false }, requested)

    expect(requested).not.toContain(WAHAPEDIA_GLOSSARY_URL)
    expect(result.requestCount).toBe(5)
    expect(result.lane.events).toEqual([])
  })
})
