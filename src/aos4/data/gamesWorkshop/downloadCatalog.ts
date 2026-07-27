import type { AcquireArtifactRequest } from '../command'
import type { GamesWorkshopDiagnostic, GamesWorkshopDiscoveryResult, GamesWorkshopDownload } from './records'

export const GAMES_WORKSHOP_DOWNLOADS_PAGE_URL =
  'https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/'

export const GAMES_WORKSHOP_DOWNLOAD_SEARCH_URL =
  'https://production-api-2024.warhammer-community.com/api/search/downloads/'

export const GAMES_WORKSHOP_ASSET_ORIGIN = 'https://assets.warhammer-community.com'

export interface GamesWorkshopDownloadSearchRequest {
  index: 'downloads_v2'
  searchTerm: string
  gameSystem: 'warhammer-age-of-sigmar'
  language: string
}

export const createGamesWorkshopDownloadSearchRequest = (
  language = 'english',
  searchTerm = ''
): GamesWorkshopDownloadSearchRequest => ({
  index: 'downloads_v2',
  searchTerm,
  gameSystem: 'warhammer-age-of-sigmar',
  language,
})

export const createGamesWorkshopPdfAcquisitionRequest = (
  download: GamesWorkshopDownload
): AcquireArtifactRequest => ({
  url: download.url,
  adapterVersion: 'games-workshop-pdf/1',
  allowedMediaTypes: ['application/pdf'],
  maxBytes: 64 * 1024 * 1024,
  timeoutMs: 30_000,
})

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const stringValue = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined

const stringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap(item => {
    if (typeof item === 'string' && item.trim()) return [item.trim()]
    if (!isObject(item)) return []
    const label = stringValue(item.slug) ?? stringValue(item.title) ?? stringValue(item.name)
    return label ? [label] : []
  })
}

const downloadUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value, `${GAMES_WORKSHOP_ASSET_ORIGIN}/`)
    if (url.protocol !== 'https:' || url.hostname !== 'assets.warhammer-community.com') return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

const decodeHit = (
  hit: unknown,
  diagnostics: GamesWorkshopDiagnostic[]
): GamesWorkshopDownload | undefined => {
  if (!isObject(hit)) {
    diagnostics.push({
      code: 'private-api-incompatible',
      severity: 'error',
      message: 'Games Workshop download search returned a non-object hit',
    })
    return undefined
  }

  // The current search index wraps display fields under `id`, while taxonomy
  // filters remain on the hit. Plain records are accepted for recorded older
  // responses and make the adapter tolerant without silently accepting bad fields.
  const record = isObject(hit.id) ? hit.id : hit
  const file = stringValue(record.file) ?? stringValue(record.url)
  const title = stringValue(record.title)
  if (!file) {
    diagnostics.push({
      code: 'invalid-download-url',
      severity: 'error',
      message: 'Games Workshop download search hit has no asset filename',
    })
    return undefined
  }
  if (!title) {
    diagnostics.push({
      code: 'missing-download-title',
      severity: 'error',
      message: `Games Workshop download ${file} has no title`,
    })
    return undefined
  }

  const url = downloadUrl(file)
  if (!url) {
    diagnostics.push({
      code: 'invalid-download-url',
      severity: 'error',
      message: `Games Workshop download has an untrusted asset URL: ${file}`,
      url: file,
    })
    return undefined
  }

  return {
    externalId:
      stringValue(record.uuid) ?? stringValue(record.slug) ?? stringValue(record.id) ?? new URL(url).pathname,
    title,
    url,
    ...(stringValue(record.slug) ? { slug: stringValue(record.slug) } : {}),
    ...(stringValue(record.language) ? { language: stringValue(record.language) } : {}),
    ...(stringValue(record.created_at) ? { publicationDate: stringValue(record.created_at) } : {}),
    ...(stringValue(record.last_updated) || stringValue(record.updated_at)
      ? { updatedDate: stringValue(record.last_updated) ?? stringValue(record.updated_at) }
      : {}),
    ...(stringValue(record.version) ? { version: stringValue(record.version) } : {}),
    categories: stringList(hit.download_categories ?? record.download_categories),
    gameSystems: stringList(record.game_systems ?? hit.game_systems),
    topics: stringList(record.topics ?? hit.topics),
    discoveryMethod: 'private-api',
  }
}

const compareDownloads = (left: GamesWorkshopDownload, right: GamesWorkshopDownload): number =>
  left.title.localeCompare(right.title) ||
  (left.language ?? '').localeCompare(right.language ?? '') ||
  left.url.localeCompare(right.url)

export const decodeGamesWorkshopDownloadSearch = (value: unknown): GamesWorkshopDiscoveryResult => {
  const diagnostics: GamesWorkshopDiagnostic[] = []
  if (!isObject(value) || !Array.isArray(value.hits)) {
    return {
      downloads: [],
      diagnostics: [
        {
          code: 'private-api-incompatible',
          severity: 'error',
          message: 'Games Workshop download search response has no hits array',
        },
      ],
      method: 'none',
    }
  }

  const seenUrls = new Set<string>()
  const downloads = value.hits.flatMap(hit => {
    const decoded = decodeHit(hit, diagnostics)
    if (!decoded) return []
    if (seenUrls.has(decoded.url)) {
      diagnostics.push({
        code: 'duplicate-download',
        severity: 'warning',
        message: `Games Workshop download search repeated ${decoded.url}`,
        url: decoded.url,
      })
      return []
    }
    seenUrls.add(decoded.url)
    return [decoded]
  })

  if (!downloads.length && !diagnostics.length) {
    diagnostics.push({
      code: 'private-api-empty',
      severity: 'warning',
      message: 'Games Workshop download search returned no downloads',
    })
  }

  return {
    downloads: downloads.sort(compareDownloads),
    diagnostics,
    method: downloads.length ? 'private-api' : 'none',
  }
}

const revisionKey = (download: GamesWorkshopDownload): string =>
  `${download.title.trim().toLocaleLowerCase('en')}:${(download.language ?? '').toLocaleLowerCase('en')}`

export interface GamesWorkshopCatalogComparison {
  added: GamesWorkshopDownload[]
  removed: GamesWorkshopDownload[]
  revised: Array<{ previous: GamesWorkshopDownload; current: GamesWorkshopDownload }>
  diagnostics: GamesWorkshopDiagnostic[]
}

export const compareGamesWorkshopDownloadCatalog = (
  previous: GamesWorkshopDownload[],
  current: GamesWorkshopDownload[]
): GamesWorkshopCatalogComparison => {
  const previousByKey = new Map(previous.map(download => [revisionKey(download), download]))
  const currentByKey = new Map(current.map(download => [revisionKey(download), download]))
  const added = current.filter(download => !previousByKey.has(revisionKey(download)))
  const removed = previous.filter(download => !currentByKey.has(revisionKey(download)))
  const revised = current.flatMap(download => {
    const prior = previousByKey.get(revisionKey(download))
    if (
      !prior ||
      (prior.url === download.url &&
        prior.version === download.version &&
        prior.updatedDate === download.updatedDate)
    ) {
      return []
    }
    return [{ previous: prior, current: download }]
  })

  return {
    added: added.sort(compareDownloads),
    removed: removed.sort(compareDownloads),
    revised: revised.sort((left, right) => compareDownloads(left.current, right.current)),
    diagnostics: revised.map(({ previous: prior, current: next }) => ({
      code: 'new-download-revision',
      severity: 'warning',
      message: `Games Workshop published a new revision of ${next.title}`,
      url: next.url,
      field: prior.url !== next.url ? 'url' : prior.version !== next.version ? 'version' : 'updatedDate',
    })),
  }
}
