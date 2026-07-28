import type { ArtifactManifest, ArtifactManifestEntry } from '../data'
import type { SourceInventory, SourceInventoryEntry } from './certification'

export type SourceObservationScope = 'material' | 'explicit-non-material'
export type SourceObservationAvailability = 'accessible' | 'inaccessible' | 'ambiguous'

export interface SourceObservationEntry {
  publisher: SourceInventoryEntry['publisher']
  url: string
  title: string
  scope: SourceObservationScope
  availability: SourceObservationAvailability
  disposition?: string
}

export interface IndependentSourceObservation {
  schemaVersion: 1
  observedAt: string
  producedBy: string
  independentFromAcceptedManifest: true
  entries: SourceObservationEntry[]
}

export interface CreateSourceInventoryInput {
  revision: string
  acceptedManifest: ArtifactManifest
  observations: IndependentSourceObservation[]
}

const SHA256_PATTERN = /^[0-9a-f]{64}$/i
const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const compareText = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && Boolean(value.trim())

const isInstant = (value: unknown): value is string =>
  typeof value === 'string' && ISO_INSTANT_PATTERN.test(value) && !Number.isNaN(new Date(value).valueOf())

const normalizedUrl = (value: string): string => {
  const url = new URL(value)
  if (url.protocol !== 'https:') throw new Error(`Source observation URL must use HTTPS: ${value}`)
  url.hash = ''
  return url.toString()
}

const publisherForArtifact = (artifact: ArtifactManifestEntry): SourceInventoryEntry['publisher'] => {
  if (artifact.adapterVersion === 'games-workshop-pdf/1') return 'games-workshop'
  if (artifact.adapterVersion === 'wahapedia-export/1' || artifact.adapterVersion === 'wahapedia-html/1') {
    return 'wahapedia'
  }
  throw new Error(
    `Accepted artifact ${artifact.checksum} has no source-inventory publisher mapping for ${artifact.adapterVersion}`
  )
}

const titleForArtifact = (artifact: ArtifactManifestEntry): string => {
  const pathname = new URL(artifact.finalUrl).pathname
  return decodeURIComponent(pathname.split('/').filter(Boolean).at(-1) ?? artifact.finalUrl)
}

const validateManifest = (manifest: ArtifactManifest): void => {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest?.artifacts)) {
    throw new Error('Accepted source manifest has an incompatible schema')
  }
  const checksums = new Set<string>()
  manifest.artifacts.forEach((artifact, index) => {
    if (
      !isNonEmptyString(artifact?.requestUrl) ||
      !isNonEmptyString(artifact?.finalUrl) ||
      !isNonEmptyString(artifact?.adapterVersion) ||
      !SHA256_PATTERN.test(artifact?.checksum ?? '') ||
      !Number.isSafeInteger(artifact?.byteLength) ||
      artifact.byteLength < 0
    ) {
      throw new Error(`Accepted source manifest artifact ${index + 1} is malformed`)
    }
    normalizedUrl(artifact.requestUrl)
    normalizedUrl(artifact.finalUrl)
    publisherForArtifact(artifact)
    if (checksums.has(artifact.checksum)) {
      throw new Error(`Accepted source manifest repeats checksum ${artifact.checksum}`)
    }
    checksums.add(artifact.checksum)
  })
}

const validateObservation = (observation: IndependentSourceObservation, observationIndex: number): void => {
  const label = `Source observation ${observationIndex + 1}`
  if (
    observation?.schemaVersion !== 1 ||
    !isInstant(observation?.observedAt) ||
    !isNonEmptyString(observation?.producedBy) ||
    observation?.independentFromAcceptedManifest !== true ||
    !Array.isArray(observation?.entries)
  ) {
    throw new Error(`${label} is missing independent discovery provenance`)
  }
  observation.entries.forEach((entry, entryIndex) => {
    if (
      !['games-workshop', 'wahapedia'].includes(entry?.publisher) ||
      !isNonEmptyString(entry?.title) ||
      !['material', 'explicit-non-material'].includes(entry?.scope) ||
      !['accessible', 'inaccessible', 'ambiguous'].includes(entry?.availability)
    ) {
      throw new Error(`${label} entry ${entryIndex + 1} is malformed`)
    }
    normalizedUrl(entry.url)
    if (entry.scope === 'explicit-non-material' && !isNonEmptyString(entry.disposition)) {
      throw new Error(`${label} entry ${entryIndex + 1} requires a non-material disposition`)
    }
  })
}

const statusForObservedEntry = (
  entry: SourceObservationEntry,
  accepted: ArtifactManifestEntry[]
): Pick<SourceInventoryEntry, 'status' | 'acceptedArtifactChecksum' | 'disposition'> => {
  if (entry.availability === 'inaccessible') return { status: 'inaccessible' }
  if (entry.availability === 'ambiguous' || accepted.length > 1) return { status: 'ambiguous' }
  if (accepted.length === 1) {
    return {
      status: 'matched',
      acceptedArtifactChecksum: accepted[0].checksum,
    }
  }
  if (entry.scope === 'explicit-non-material') {
    return {
      status: 'explicit-non-material',
      disposition: entry.disposition,
    }
  }
  return { status: 'missing' }
}

export const createSourceInventory = ({
  revision,
  acceptedManifest,
  observations,
}: CreateSourceInventoryInput): SourceInventory => {
  if (!isNonEmptyString(revision)) throw new Error('Source inventory revision is required')
  if (!observations.length) throw new Error('At least one independent source observation is required')
  validateManifest(acceptedManifest)
  observations.forEach(validateObservation)

  const acceptedByUrl = new Map<string, ArtifactManifestEntry[]>()
  acceptedManifest.artifacts.forEach(artifact => {
    Array.from(new Set([normalizedUrl(artifact.requestUrl), normalizedUrl(artifact.finalUrl)])).forEach(
      url => {
        acceptedByUrl.set(url, [...(acceptedByUrl.get(url) ?? []), artifact])
      }
    )
  })

  const observedUrls = new Set<string>()
  const entries = observations.flatMap((observation, observationIndex) =>
    observation.entries.map((entry, entryIndex): SourceInventoryEntry => {
      const url = normalizedUrl(entry.url)
      if (observedUrls.has(url)) {
        throw new Error(
          `Source observations repeat URL ${url} at observation ${observationIndex + 1}, entry ${
            entryIndex + 1
          }`
        )
      }
      observedUrls.add(url)
      const accepted = acceptedByUrl.get(url) ?? []
      const matchedPublisher = accepted.length === 1 ? publisherForArtifact(accepted[0]) : undefined
      if (matchedPublisher && matchedPublisher !== entry.publisher) {
        throw new Error(
          `Source observation publisher ${entry.publisher} does not match accepted artifact publisher ${matchedPublisher} for ${url}`
        )
      }
      return {
        publisher: entry.publisher,
        url,
        title: entry.title.trim(),
        ...statusForObservedEntry(entry, accepted),
      }
    })
  )

  const matchedChecksums = new Set(entries.flatMap(entry => entry.acceptedArtifactChecksum ?? []))
  acceptedManifest.artifacts
    .filter(artifact => !matchedChecksums.has(artifact.checksum))
    .forEach(artifact => {
      entries.push({
        publisher: publisherForArtifact(artifact),
        url: normalizedUrl(artifact.finalUrl),
        title: titleForArtifact(artifact),
        status: 'unexpected',
        acceptedArtifactChecksum: artifact.checksum,
      })
    })

  const sortedEntries = entries.sort(
    (left, right) =>
      compareText(left.publisher, right.publisher) ||
      compareText(left.url, right.url) ||
      compareText(left.title, right.title)
  )
  const complete = sortedEntries.every(entry => ['matched', 'explicit-non-material'].includes(entry.status))
  const producedBy = Array.from(new Set(observations.map(observation => observation.producedBy.trim())))
    .sort(compareText)
    .join(', ')
  const observedAt = observations
    .map(observation => observation.observedAt)
    .sort(compareText)
    .at(-1)!

  return {
    schemaVersion: 1,
    revision: revision.trim(),
    observedAt,
    producedBy: `source-inventory-reconciler/v1 (${producedBy})`,
    independentFromAcceptedManifest: true,
    complete,
    entries: sortedEntries,
  }
}
