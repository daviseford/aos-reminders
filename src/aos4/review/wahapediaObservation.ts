import { JSDOM } from 'jsdom'
import * as XLSX from 'xlsx'
import type {
  IndependentSourceObservation,
  SourceObservationAvailability,
  SourceObservationEntry,
} from './sourceInventory'

export const WAHAPEDIA_DATA_EXPORT_URL = 'https://wahapedia.ru/aos4/the-rules/data-export/' as const
/**
 * First observed 2026-10-26 (#2087), and reviewed only at these exact bytes: any other or missing
 * fingerprint stays material. Its definitions are summaries that defer to the rules modules, and 841
 * of its 900 FAQ/Errata sentences are verbatim on the accepted FAQs, core rules or General's Handbook
 * pages. Of the rest, 57 are on other accepted rules pages or official PDFs; one rewords "No, unless"
 * as "No, not unless" and one is a flavour line the catalog does not store. The page is non-material
 * because it repeats those sources, not because core rules are out of scope (the app ships core-rules
 * abilities); the disposition says so from corpus 2026-10-27 (#2087).
 */
export const WAHAPEDIA_GLOSSARY_URL = 'https://wahapedia.ru/aos4/the-rules/glossary/' as const
export const WAHAPEDIA_GLOSSARY_FINGERPRINT =
  'd3afb7b475f07e9b4845bc34037c67fa1157fb34d3e9be7879806fc6387207bb' as const

export type WahapediaObservedSourceKind =
  | 'data-export-index'
  | 'export-specification'
  | 'export'
  | 'rules-page'
  | 'faction-page'
  | 'warscroll-collection'

export interface WahapediaObservedSource {
  kind: WahapediaObservedSourceKind
  url: string
  title: string
  availability: SourceObservationAvailability
  fingerprint?: string
}

export interface WahapediaNavigationDiscovery {
  rulesPages: Array<{ url: string; title: string }>
  factionPages: Array<{ url: string; title: string }>
  exportSpecificationUrl: string
}

const compareObserved = (
  left: Pick<WahapediaObservedSource, 'title' | 'url'>,
  right: Pick<WahapediaObservedSource, 'title' | 'url'>
): number => left.title.localeCompare(right.title) || left.url.localeCompare(right.url)

const SHA256_PATTERN = /^[0-9a-f]{64}$/i

const normalizedUrl = (value: string, base: string = WAHAPEDIA_DATA_EXPORT_URL): string => {
  const url = new URL(value, base)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    !['wahapedia.ru', 'www.wahapedia.ru'].includes(url.hostname.toLowerCase())
  ) {
    throw new Error(`Wahapedia observation contains an untrusted URL: ${value}`)
  }
  url.protocol = 'https:'
  url.hostname = 'wahapedia.ru'
  url.hash = ''
  return url.toString()
}

const uniqueLinks = (
  values: Array<{ url: string; title: string }>
): Array<{ url: string; title: string }> => {
  const byUrl = new Map<string, { url: string; title: string }>()
  values.forEach(value => {
    const url = normalizedUrl(value.url)
    const existing = byUrl.get(url)
    if (existing && existing.title !== value.title.trim()) {
      throw new Error(`Wahapedia navigation has conflicting titles for ${url}`)
    }
    byUrl.set(url, { url, title: value.title.trim() })
  })
  return Array.from(byUrl.values()).sort(compareObserved)
}

const navigationAnchorsOf = (
  html: string,
  baseUrl: string
): Array<{
  kind: 'rules-page' | 'faction-page'
  url: string
  title: string
}> => {
  const document = new JSDOM(html, { url: baseUrl }).window.document
  const links: Array<{ kind: 'rules-page' | 'faction-page'; url: string; title: string }> = []
  const anchors = Array.from(
    document.querySelectorAll('.NavColumns2 a[href], .NavColumns3 a[href]')
  ) as HTMLAnchorElement[]
  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href')
    const title = anchor.textContent?.replace(/\s+/g, ' ').trim()
    if (!href || !title) return
    const url = normalizedUrl(href, baseUrl)
    const pathname = new URL(url).pathname
    if (/^\/aos4\/the-rules\/[^/]+\/?$/i.test(pathname)) {
      links.push({ kind: 'rules-page', url, title })
    } else if (/^\/aos4\/factions\/[^/]+\/?$/i.test(pathname)) {
      links.push({ kind: 'faction-page', url, title })
    }
  })
  return links
}

export const discoverWahapediaNavFragmentUrl = (
  html: string,
  baseUrl: string = WAHAPEDIA_DATA_EXPORT_URL
): string | undefined => {
  const document = new JSDOM(html, { url: baseUrl }).window.document
  const element = document.querySelector('[data-nav-src]')
  const source = element?.getAttribute('data-nav-src')
  if (!source) return undefined
  return normalizedUrl(source, baseUrl)
}

export const discoverWahapediaNavigation = (
  html: string,
  baseUrl: string = WAHAPEDIA_DATA_EXPORT_URL,
  navFragmentHtml?: string
): WahapediaNavigationDiscovery => {
  const document = new JSDOM(html, { url: baseUrl }).window.document
  const navigationLinks = [
    ...navigationAnchorsOf(html, baseUrl),
    ...(navFragmentHtml ? navigationAnchorsOf(navFragmentHtml, baseUrl) : []),
  ]
  const specificationLinks = (
    Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[]
  ).flatMap(anchor => {
    const href = anchor.getAttribute('href')
    if (!href) return []
    let url: string
    try {
      url = normalizedUrl(href, baseUrl)
    } catch {
      return []
    }
    return /\.xlsx$/i.test(new URL(url).pathname) ? [url] : []
  })
  if (specificationLinks.length !== 1) {
    throw new Error(
      `Wahapedia data export page exposed ${specificationLinks.length} spreadsheet specifications`
    )
  }
  const rulesPages = uniqueLinks(
    navigationLinks.filter(value => value.kind === 'rules-page').map(({ url, title }) => ({ url, title }))
  )
  const factionPages = uniqueLinks(
    navigationLinks.filter(value => value.kind === 'faction-page').map(({ url, title }) => ({ url, title }))
  )
  if (!rulesPages.length || !factionPages.length) {
    throw new Error(
      `Wahapedia navigation exposed ${factionPages.length} faction pages and ${rulesPages.length} rules pages`
    )
  }
  return {
    rulesPages,
    factionPages,
    exportSpecificationUrl: specificationLinks[0],
  }
}

/**
 * The `.datasheetsCollated` link block Wahapedia used to print on every faction root page is gone
 * from the live site (observed 2026-09-22: the faction page's own nav column now anchors
 * `#Warscrolls` to an inline section instead of linking the standalone collection page). The
 * collection itself is still published at the conventional path — `src/aos4/data/wahapediaHtml/
 * parse.ts`'s `factionRootWarscrollScope` already treats `<faction root>warscrolls.html` as the
 * authoritative relationship for generation, so observation falls back to the same derivation
 * instead of a second, divergent selector. The one accepted exception (`Endless Spells` publishes
 * no collection) is handled by the caller's acquisition attempt, not here: this always returns a
 * candidate URL, and a 404 on it means "this faction has none", not "observation failed".
 */
export const discoverWahapediaWarscrollCollection = (html: string, factionPageUrl: string): string => {
  const document = new JSDOM(html, { url: factionPageUrl }).window.document
  const urls = (Array.from(document.querySelectorAll('.datasheetsCollated a[href]')) as HTMLAnchorElement[])
    .flatMap(anchor => {
      const href = anchor.getAttribute('href')
      if (!href) return []
      const url = normalizedUrl(href, factionPageUrl)
      return /\/warscrolls\.html$/i.test(new URL(url).pathname) ? [url] : []
    })
    .filter((value, index, values) => values.indexOf(value) === index)
  if (urls.length > 1) {
    throw new Error(`Wahapedia faction page exposes multiple warscroll collections: ${factionPageUrl}`)
  }
  if (urls[0]) return urls[0]
  const rootUrl = new URL(factionPageUrl)
  return normalizedUrl(`${rootUrl.pathname}warscrolls.html`, factionPageUrl)
}

export const discoverWahapediaExportUrls = (bytes: Uint8Array): string[] => {
  const workbook = XLSX.read(bytes, { type: 'array' })
  const sheet = workbook.Sheets.EN
  if (!sheet) throw new Error('Wahapedia export specification has no EN worksheet')
  const urls = Object.entries(sheet).flatMap(([address, rawCell]) => {
    if (address.startsWith('!')) return []
    const cell = rawCell as XLSX.CellObject
    const target = cell.l?.Target
    if (!target || !/\.csv$/i.test(new URL(target).pathname)) return []
    return [normalizedUrl(target)]
  })
  const unique = Array.from(new Set(urls)).sort((left, right) => left.localeCompare(right))
  if (!unique.length) throw new Error('Wahapedia export specification exposes no CSV exports')
  return unique
}

const dispositionFor = ({ kind, url, fingerprint }: WahapediaObservedSource): string | undefined => {
  if (
    kind === 'rules-page' &&
    url === WAHAPEDIA_GLOSSARY_URL &&
    fingerprint?.toLowerCase() === WAHAPEDIA_GLOSSARY_FINGERPRINT
  ) {
    return 'Glossary of rules-definition summaries that defers to the rules modules; its FAQ/Errata repeat the accepted FAQs, core-rules and General’s Handbook pages and official PDFs the app already reads, so it adds no rule of its own.'
  }
  if (kind === 'data-export-index') {
    return 'Discovery index describing Wahapedia exports; it contains no game rule or characteristic data.'
  }
  if (kind === 'export-specification') {
    return 'Schema and link specification used only to discover exports; it contains no game rule or characteristic data.'
  }
  return undefined
}

export const createWahapediaSourceObservation = (
  observedAt: string,
  sources: WahapediaObservedSource[]
): IndependentSourceObservation => {
  if (!sources.length) throw new Error('Wahapedia source observation is empty')
  const byUrl = new Map<string, WahapediaObservedSource>()
  sources.forEach((source, index) => {
    if (
      !source?.title?.trim() ||
      ![
        'data-export-index',
        'export-specification',
        'export',
        'rules-page',
        'faction-page',
        'warscroll-collection',
      ].includes(source?.kind) ||
      !['accessible', 'inaccessible', 'ambiguous'].includes(source?.availability)
    ) {
      throw new Error(`Wahapedia observed source ${index + 1} is malformed`)
    }
    const url = normalizedUrl(source.url)
    if (source.fingerprint && !SHA256_PATTERN.test(source.fingerprint)) {
      throw new Error(`Wahapedia observed source ${index + 1} has an invalid fingerprint`)
    }
    const existing = byUrl.get(url)
    if (
      existing &&
      (existing.kind !== source.kind ||
        existing.title.trim() !== source.title.trim() ||
        existing.availability !== source.availability)
    ) {
      throw new Error(`Wahapedia observation conflicts for ${url}`)
    }
    byUrl.set(url, { ...source, url, title: source.title.trim() })
  })
  const entries: SourceObservationEntry[] = Array.from(byUrl.values())
    .map(source => {
      const disposition = dispositionFor(source)
      return {
        publisher: 'wahapedia' as const,
        url: source.url,
        title: source.title,
        scope: disposition ? ('explicit-non-material' as const) : ('material' as const),
        availability: source.availability,
        ...(disposition ? { disposition } : {}),
        ...(source.fingerprint ? { fingerprint: source.fingerprint.toLowerCase() } : {}),
      }
    })
    .sort(compareObserved)
  return {
    schemaVersion: 1,
    observedAt,
    producedBy: 'wahapedia-navigation-and-export-spec/v1',
    independentFromAcceptedManifest: true,
    entries,
  }
}
