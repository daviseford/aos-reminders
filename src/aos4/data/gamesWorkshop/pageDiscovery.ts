import parse5 from 'parse5'
import { GAMES_WORKSHOP_ASSET_ORIGIN, GAMES_WORKSHOP_DOWNLOADS_PAGE_URL } from './downloadCatalog'
import type { GamesWorkshopDiagnostic, GamesWorkshopDiscoveryResult, GamesWorkshopDownload } from './records'

const isElement = (node: parse5.Node): node is parse5.Element =>
  'tagName' in node && Array.isArray(node.attrs)

const attribute = (element: parse5.Element, name: string): string | undefined =>
  element.attrs.find(item => item.name.toLowerCase() === name)?.value

const textContent = (node: parse5.Node): string => {
  if (node.nodeName === '#text' && 'value' in node) return node.value
  return 'childNodes' in node ? node.childNodes.map(textContent).join(' ') : ''
}

const normalizeTitle = (value: string, url: URL): string =>
  value.replace(/\s+/g, ' ').trim() ||
  decodeURIComponent(url.pathname.split('/').at(-1) ?? 'Untitled Games Workshop download')

const trustedPdfUrl = (value: string): URL | undefined => {
  try {
    const url = new URL(value, GAMES_WORKSHOP_DOWNLOADS_PAGE_URL)
    if (url.protocol !== 'https:') return undefined
    if (url.hostname !== 'assets.warhammer-community.com' && url.hostname !== 'www.warhammer-community.com') {
      return undefined
    }
    if (!url.pathname.toLowerCase().endsWith('.pdf')) return undefined
    return url
  } catch {
    return undefined
  }
}

interface DiscoveredLink {
  url: URL
  title: string
  method: 'page-link' | 'embedded-json'
}

const findPdfLinksInValue = (value: unknown, found: DiscoveredLink[], inheritedTitle = ''): void => {
  if (Array.isArray(value)) {
    value.forEach(item => findPdfLinksInValue(item, found, inheritedTitle))
    return
  }
  if (!value || typeof value !== 'object') return

  const object = value as Record<string, unknown>
  const titleValue = ['title', 'name', 'label'].map(key => object[key]).find(item => typeof item === 'string')
  const title = typeof titleValue === 'string' ? titleValue : inheritedTitle
  ;['file', 'url', 'href', 'download'].forEach(key => {
    const candidate = object[key]
    if (typeof candidate !== 'string') return
    const url = trustedPdfUrl(candidate)
    if (url) {
      found.push({
        url,
        title: normalizeTitle(title, url),
        method: 'embedded-json',
      })
    }
  })
  Object.values(object).forEach(child => findPdfLinksInValue(child, found, title))
}

const parseJsonScript = (value: string, found: DiscoveredLink[]): void => {
  try {
    findPdfLinksInValue(JSON.parse(value), found)
  } catch {
    // Next.js and other page scripts are frequently executable JavaScript rather
    // than JSON. They are intentionally not evaluated.
  }
}

export const discoverGamesWorkshopDownloadsFromPage = (html: string): GamesWorkshopDiscoveryResult => {
  const document = parse5.parse(html)
  const found: DiscoveredLink[] = []
  const diagnostics: GamesWorkshopDiagnostic[] = []

  const visit = (node: parse5.Node): void => {
    if (isElement(node)) {
      if (node.tagName.toLowerCase() === 'a') {
        const href = attribute(node, 'href')
        const url = href ? trustedPdfUrl(href) : undefined
        if (url) {
          found.push({
            url,
            title: normalizeTitle(attribute(node, 'title') ?? textContent(node), url),
            method: 'page-link',
          })
        }
      }
      if (node.tagName.toLowerCase() === 'script') {
        parseJsonScript(textContent(node).trim(), found)
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit)
  }
  visit(document)

  const seen = new Set<string>()
  const downloads = found.flatMap(({ url, title, method }): GamesWorkshopDownload[] => {
    if (seen.has(url.toString())) {
      diagnostics.push({
        code: 'duplicate-download',
        severity: 'warning',
        message: `Games Workshop page repeated ${url.toString()}`,
        url: url.toString(),
      })
      return []
    }
    seen.add(url.toString())
    return [
      {
        externalId: url.pathname,
        title,
        url: url.toString(),
        categories: [],
        gameSystems: ['warhammer-age-of-sigmar'],
        topics: [],
        discoveryMethod: method,
      },
    ]
  })

  if (!downloads.length) {
    diagnostics.push({
      code: 'page-incompatible',
      severity: 'error',
      message: 'Games Workshop downloads page contained no trusted PDF links or inert JSON download records',
    })
  }

  downloads.sort((left, right) => left.title.localeCompare(right.title) || left.url.localeCompare(right.url))
  return {
    downloads,
    diagnostics,
    method: downloads[0]?.discoveryMethod ?? 'none',
  }
}

export const resolveGamesWorkshopDiscovery = (
  privateApi: GamesWorkshopDiscoveryResult,
  pageHtml: string
): GamesWorkshopDiscoveryResult => {
  if (privateApi.downloads.length) return privateApi

  const fallback = discoverGamesWorkshopDownloadsFromPage(pageHtml)
  return {
    ...fallback,
    diagnostics: [
      {
        code: 'private-api-unavailable',
        severity: 'warning',
        message: 'Games Workshop private download search was unavailable; used page discovery',
      },
      ...privateApi.diagnostics,
      ...fallback.diagnostics,
    ],
  }
}

export const gamesWorkshopAssetUrl = (file: string): string =>
  new URL(file, `${GAMES_WORKSHOP_ASSET_ORIGIN}/`).toString()
