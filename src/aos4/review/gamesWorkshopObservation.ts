import type { GamesWorkshopDiagnostic, GamesWorkshopDownload } from '../data/gamesWorkshop'
import type { IndependentSourceObservation, SourceObservationEntry } from './sourceInventory'

export interface GamesWorkshopDiscoverySnapshot {
  schemaVersion: 1
  retrievedAt: string
  downloads: GamesWorkshopDownload[]
  diagnostics: GamesWorkshopDiagnostic[]
}

export interface GamesWorkshopNonMaterialClassification {
  url: string
  disposition: string
}

export interface GamesWorkshopObservationClassifications {
  schemaVersion: 1
  explicitlyNonMaterial: GamesWorkshopNonMaterialClassification[]
}

const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim())

const normalizedUrl = (value: string): string => {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'assets.warhammer-community.com') {
    throw new Error(`Games Workshop observation contains an untrusted asset URL: ${value}`)
  }
  url.hash = ''
  return url.toString()
}

const validateSnapshot = (snapshot: GamesWorkshopDiscoverySnapshot): void => {
  if (
    snapshot?.schemaVersion !== 1 ||
    !isNonEmptyString(snapshot?.retrievedAt) ||
    !ISO_INSTANT_PATTERN.test(snapshot.retrievedAt) ||
    Number.isNaN(new Date(snapshot.retrievedAt).valueOf()) ||
    !Array.isArray(snapshot?.downloads) ||
    !Array.isArray(snapshot?.diagnostics)
  ) {
    throw new Error('Games Workshop discovery snapshot is malformed')
  }
  const errors = snapshot.diagnostics.filter(diagnostic => diagnostic?.severity === 'error')
  if (errors.length) {
    throw new Error(
      `Games Workshop discovery snapshot contains ${errors.length} error diagnostic${
        errors.length === 1 ? '' : 's'
      }`
    )
  }
  const seen = new Set<string>()
  snapshot.downloads.forEach((download, index) => {
    if (!isNonEmptyString(download?.title) || !isNonEmptyString(download?.url)) {
      throw new Error(`Games Workshop discovery download ${index + 1} is malformed`)
    }
    const url = normalizedUrl(download.url)
    if (seen.has(url)) throw new Error(`Games Workshop discovery repeats ${url}`)
    seen.add(url)
  })
}

const classificationMap = (
  classifications: GamesWorkshopObservationClassifications | undefined,
  observedUrls: Set<string>
): Map<string, string> => {
  if (classifications === undefined) return new Map()
  if (classifications?.schemaVersion !== 1 || !Array.isArray(classifications?.explicitlyNonMaterial)) {
    throw new Error('Games Workshop non-material classifications are malformed')
  }
  const dispositions = new Map<string, string>()
  classifications.explicitlyNonMaterial.forEach((classification, index) => {
    if (!isNonEmptyString(classification?.url) || !isNonEmptyString(classification?.disposition)) {
      throw new Error(`Games Workshop non-material classification ${index + 1} is malformed`)
    }
    const url = normalizedUrl(classification.url)
    if (!observedUrls.has(url)) {
      throw new Error(`Games Workshop non-material classification is stale or unobserved: ${url}`)
    }
    if (dispositions.has(url)) {
      throw new Error(`Games Workshop non-material classification repeats ${url}`)
    }
    dispositions.set(url, classification.disposition.trim())
  })
  return dispositions
}

export const createGamesWorkshopSourceObservation = (
  snapshot: GamesWorkshopDiscoverySnapshot,
  classifications?: GamesWorkshopObservationClassifications
): IndependentSourceObservation => {
  validateSnapshot(snapshot)
  const observedUrls = new Set(snapshot.downloads.map(download => normalizedUrl(download.url)))
  const dispositions = classificationMap(classifications, observedUrls)
  const entries: SourceObservationEntry[] = snapshot.downloads
    .map(download => {
      const url = normalizedUrl(download.url)
      const disposition = dispositions.get(url)
      return {
        publisher: 'games-workshop' as const,
        url,
        title: download.title.trim(),
        scope: disposition ? ('explicit-non-material' as const) : ('material' as const),
        availability: 'accessible' as const,
        ...(disposition ? { disposition } : {}),
      }
    })
    .sort((left, right) => left.title.localeCompare(right.title) || left.url.localeCompare(right.url))
  return {
    schemaVersion: 1,
    observedAt: snapshot.retrievedAt,
    producedBy: 'games-workshop-download-catalog/v1',
    independentFromAcceptedManifest: true,
    entries,
  }
}
