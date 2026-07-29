import { createHash } from 'node:crypto'
import type { ArtifactManifest, ArtifactManifestEntry } from '../data'
import { stableCompactJson } from '../generate/serialization'
import {
  RADAR_AUTHORITY_BY_SOURCE,
  RADAR_SOURCE_ORDER,
  RADAR_SOURCES,
  type BsDataObservation,
  type GamesWorkshopObservation,
  type RadarChangeKind,
  type RadarEvent,
  type RadarLane,
  type RadarReport,
  type RadarSource,
  type SourceObservationClassifications,
  type WahapediaObservationEntryKind,
  type WahapediaRadarObservation,
} from './model'

const SHA256_PATTERN = /^[0-9a-f]{64}$/i
const GIT_SHA_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i
const ISO_INSTANT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const compareText = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0)

const hash = (value: unknown): string => createHash('sha256').update(stableCompactJson(value)).digest('hex')

const nonEmptyString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a non-empty string`)
  return value.trim()
}

const instant = (value: unknown, label: string): string => {
  const result = nonEmptyString(value, label)
  if (!ISO_INSTANT_PATTERN.test(result) || Number.isNaN(new Date(result).valueOf())) {
    throw new Error(`${label} must be an ISO instant`)
  }
  return result
}

const normalizedUrl = (value: string, label = 'locator'): string => {
  const parsed = new URL(nonEmptyString(value, label))
  if (parsed.protocol !== 'https:') throw new Error(`${label} must use HTTPS`)
  parsed.hash = ''
  return parsed.toString()
}

const fingerprint = (value: unknown, label: string): string => {
  const result = nonEmptyString(value, label).toLowerCase()
  if (!SHA256_PATTERN.test(result)) throw new Error(`${label} must be a SHA-256 fingerprint`)
  return result
}

const validateManifest = (manifest: ArtifactManifest): void => {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.artifacts)) {
    throw new Error('Accepted manifest has an incompatible schema')
  }
  manifest.artifacts.forEach((artifact, index) => {
    normalizedUrl(artifact.requestUrl, `accepted artifact ${index + 1} requestUrl`)
    normalizedUrl(artifact.finalUrl, `accepted artifact ${index + 1} finalUrl`)
    fingerprint(artifact.checksum, `accepted artifact ${index + 1} checksum`)
  })
}

const sourceForArtifact = (artifact: ArtifactManifestEntry): RadarSource | null => {
  if (artifact.adapterVersion === 'games-workshop-pdf/1') return 'games-workshop'
  if (['wahapedia-export/1', 'wahapedia-html/1'].includes(artifact.adapterVersion)) {
    return 'wahapedia'
  }
  return null
}

const artifactsForSource = (
  manifest: ArtifactManifest,
  source: 'games-workshop' | 'wahapedia'
): ArtifactManifestEntry[] => manifest.artifacts.filter(artifact => sourceForArtifact(artifact) === source)

const assertUniqueLocators = (locators: string[], source: RadarSource): void => {
  const seen = new Set<string>()
  locators.forEach(locator => {
    if (seen.has(locator)) throw new Error(`${source} observation has duplicate locator ${locator}`)
    seen.add(locator)
  })
}

const eventProjection = (event: RadarEvent): unknown => ({
  class: event.class,
  source: event.source,
  publisher: event.publisher,
  authority: event.authority,
  changeKind: event.changeKind,
  locator: event.locator,
  baselineFingerprint: event.baselineFingerprint,
  observedFingerprint: event.observedFingerprint,
  evidence: event.evidence,
})

const sortedEvents = (events: RadarEvent[]): RadarEvent[] =>
  [...events].sort(
    (left, right) =>
      (RADAR_SOURCE_ORDER.get(left.source) ?? Number.MAX_SAFE_INTEGER) -
        (RADAR_SOURCE_ORDER.get(right.source) ?? Number.MAX_SAFE_INTEGER) ||
      compareText(left.class, right.class) ||
      compareText(left.changeKind, right.changeKind) ||
      compareText(left.locator, right.locator)
  )

const createEvent = (
  source: RadarSource,
  observedAt: string,
  changeKind: RadarChangeKind,
  locator: string,
  input: Pick<RadarEvent, 'class' | 'baselineFingerprint' | 'observedFingerprint' | 'evidence'> & {
    workflowUrl?: string
  }
): RadarEvent => ({
  class: input.class,
  source,
  publisher: source,
  authority: RADAR_AUTHORITY_BY_SOURCE[source],
  changeKind,
  locator,
  baselineFingerprint: input.baselineFingerprint,
  observedFingerprint: input.observedFingerprint,
  observedAt,
  workflowUrl: input.workflowUrl,
  evidence: input.evidence,
})

export const validateRadarEvent = (event: RadarEvent): RadarEvent => {
  if (!RADAR_SOURCES.includes(event?.source) || event.publisher !== event.source) {
    throw new Error('Radar event has an invalid source or publisher')
  }
  if (event.authority !== RADAR_AUTHORITY_BY_SOURCE[event.source]) {
    throw new Error(`Radar event authority does not match ${event.source}`)
  }
  if (!['material', 'operational'].includes(event.class)) {
    throw new Error('Radar event has an invalid class')
  }
  instant(event.observedAt, 'Radar event observedAt')
  nonEmptyString(event.changeKind, 'Radar event changeKind')
  nonEmptyString(event.locator, 'Radar event locator')
  if (event.baselineFingerprint !== null) {
    const pattern = event.source === 'bsdata' ? GIT_SHA_PATTERN : SHA256_PATTERN
    if (!pattern.test(event.baselineFingerprint)) {
      throw new Error('Radar event has an invalid baseline fingerprint')
    }
  }
  if (event.observedFingerprint !== null) {
    const pattern = event.source === 'bsdata' ? GIT_SHA_PATTERN : SHA256_PATTERN
    if (!pattern.test(event.observedFingerprint)) {
      throw new Error('Radar event has an invalid observed fingerprint')
    }
  }
  if (!event.evidence || typeof event.evidence !== 'object' || Array.isArray(event.evidence)) {
    throw new Error('Radar event evidence must be an object')
  }
  return event
}

export const createRadarLane = (
  source: RadarSource,
  observedAt: string,
  events: RadarEvent[],
  workflowUrl?: string
): RadarLane => {
  const authority = RADAR_AUTHORITY_BY_SOURCE[source]
  const normalizedEvents = sortedEvents(
    events.map(event => {
      validateRadarEvent(event)
      if (event.source !== source || event.authority !== authority) {
        throw new Error(`Radar lane ${source} contains an event from another source`)
      }
      return event
    })
  )
  const normalizedObservedAt = instant(observedAt, `${source} lane observedAt`)
  return {
    schemaVersion: 1,
    source,
    authority,
    observedAt: normalizedObservedAt,
    workflowUrl,
    events: normalizedEvents,
    fingerprint: hash(normalizedEvents.map(eventProjection)),
  }
}

export interface CompareGamesWorkshopInput {
  acceptedManifest: ArtifactManifest
  classifications: SourceObservationClassifications
  observation: GamesWorkshopObservation
}

export const compareGamesWorkshopObservation = ({
  acceptedManifest,
  classifications,
  observation,
}: CompareGamesWorkshopInput): RadarLane => {
  validateManifest(acceptedManifest)
  if (
    observation?.schemaVersion !== 1 ||
    observation.source !== 'games-workshop' ||
    !Array.isArray(observation.entries)
  ) {
    throw new Error('Games Workshop observation has an incompatible schema')
  }
  if (classifications?.schemaVersion !== 1 || !Array.isArray(classifications.explicitlyNonMaterial)) {
    throw new Error('Source observation classifications have an incompatible schema')
  }
  const observedAt = instant(observation.observedAt, 'Games Workshop observation observedAt')
  const entries = observation.entries.map((entry, index) => ({
    locator: normalizedUrl(entry.locator, `Games Workshop entry ${index + 1} locator`),
    title: nonEmptyString(entry.title, `Games Workshop entry ${index + 1} title`),
    fingerprint: entry.fingerprint
      ? fingerprint(entry.fingerprint, `Games Workshop entry ${index + 1} fingerprint`)
      : hash({ locator: normalizedUrl(entry.locator), title: entry.title.trim() }),
  }))
  assertUniqueLocators(
    entries.map(entry => entry.locator),
    'games-workshop'
  )
  const nonMaterial = new Set(
    classifications.explicitlyNonMaterial.map((entry, index) => {
      nonEmptyString(entry.disposition, `Non-material classification ${index + 1} disposition`)
      return normalizedUrl(entry.url, `Non-material classification ${index + 1} URL`)
    })
  )
  const accepted = artifactsForSource(acceptedManifest, 'games-workshop')
  const acceptedByUrl = new Map<string, ArtifactManifestEntry>()
  accepted.forEach(artifact => {
    acceptedByUrl.set(normalizedUrl(artifact.requestUrl), artifact)
    acceptedByUrl.set(normalizedUrl(artifact.finalUrl), artifact)
  })
  const observedUrls = new Set(entries.map(entry => entry.locator))
  const events: RadarEvent[] = []

  entries.forEach(entry => {
    if (!acceptedByUrl.has(entry.locator) && !nonMaterial.has(entry.locator)) {
      events.push(
        createEvent('games-workshop', observedAt, 'new-publication', entry.locator, {
          class: 'material',
          baselineFingerprint: null,
          observedFingerprint: entry.fingerprint,
          workflowUrl: observation.workflowUrl,
          evidence: { title: entry.title },
        })
      )
    }
  })
  const acceptedLocators = new Set<string>()
  accepted.forEach(artifact => {
    const locator = normalizedUrl(artifact.finalUrl)
    if (!observedUrls.has(locator) && !observedUrls.has(normalizedUrl(artifact.requestUrl))) {
      if (acceptedLocators.has(locator)) return
      acceptedLocators.add(locator)
      events.push(
        createEvent('games-workshop', observedAt, 'removed-publication', locator, {
          class: 'material',
          baselineFingerprint: artifact.checksum.toLowerCase(),
          observedFingerprint: null,
          workflowUrl: observation.workflowUrl,
          evidence: { title: decodeURIComponent(new URL(locator).pathname.split('/').at(-1) ?? locator) },
        })
      )
    }
  })

  return createRadarLane('games-workshop', observedAt, events, observation.workflowUrl)
}

const wahapediaKindForUrl = (value: string): WahapediaObservationEntryKind => {
  const pathname = new URL(value).pathname
  if (pathname.endsWith('.csv')) return 'export'
  if (pathname.includes('/factions/')) return 'faction'
  return 'rules-page'
}

const includedInWahapediaScope = (
  artifact: ArtifactManifestEntry,
  scope: WahapediaRadarObservation['scope']
): boolean => {
  if (scope === 'full') return true
  const url = new URL(artifact.finalUrl)
  if (/\/Last_update\.csv$/i.test(url.pathname)) return true
  if (/^\/aos4\/factions\/[^/]+\/?$/i.test(url.pathname)) return true
  return /^\/aos4\/the-rules\/[^/]+\/?$/i.test(url.pathname)
}

const newWahapediaKind = (kind: WahapediaObservationEntryKind): RadarChangeKind =>
  kind === 'faction' ? 'new-faction' : kind === 'rules-page' ? 'new-rules-page' : 'export-changed'

const removedWahapediaKind = (kind: WahapediaObservationEntryKind): RadarChangeKind =>
  kind === 'faction' ? 'removed-faction' : kind === 'rules-page' ? 'removed-rules-page' : 'export-changed'

export interface CompareWahapediaInput {
  acceptedManifest: ArtifactManifest
  observation: WahapediaRadarObservation
}

export const compareWahapediaObservation = ({
  acceptedManifest,
  observation,
}: CompareWahapediaInput): RadarLane => {
  validateManifest(acceptedManifest)
  if (
    observation?.schemaVersion !== 1 ||
    observation.source !== 'wahapedia' ||
    !['sentinel', 'full'].includes(observation.scope) ||
    !Array.isArray(observation.entries)
  ) {
    throw new Error('Wahapedia observation has an incompatible schema')
  }
  const observedAt = instant(observation.observedAt, 'Wahapedia observation observedAt')
  const entries = observation.entries.map((entry, index) => ({
    kind: entry.kind,
    locator: normalizedUrl(entry.locator, `Wahapedia entry ${index + 1} locator`),
    title: nonEmptyString(entry.title, `Wahapedia entry ${index + 1} title`),
    fingerprint: fingerprint(entry.fingerprint, `Wahapedia entry ${index + 1} fingerprint`),
  }))
  entries.forEach((entry, index) => {
    if (!['faction', 'rules-page', 'export'].includes(entry.kind)) {
      throw new Error(`Wahapedia entry ${index + 1} has an invalid kind`)
    }
  })
  assertUniqueLocators(
    entries.map(entry => entry.locator),
    'wahapedia'
  )
  const accepted = artifactsForSource(acceptedManifest, 'wahapedia').filter(artifact =>
    includedInWahapediaScope(artifact, observation.scope)
  )
  const acceptedByUrl = new Map<string, ArtifactManifestEntry>()
  accepted.forEach(artifact => {
    acceptedByUrl.set(normalizedUrl(artifact.requestUrl), artifact)
    acceptedByUrl.set(normalizedUrl(artifact.finalUrl), artifact)
  })
  const observedByUrl = new Map(entries.map(entry => [entry.locator, entry]))
  const events: RadarEvent[] = []

  entries.forEach(entry => {
    const baseline = acceptedByUrl.get(entry.locator)
    const checksContentFingerprint = entry.kind === 'export' || observation.scope === 'full'
    if (!baseline || (checksContentFingerprint && baseline.checksum.toLowerCase() !== entry.fingerprint)) {
      events.push(
        createEvent(
          'wahapedia',
          observedAt,
          baseline
            ? entry.kind === 'export'
              ? 'export-changed'
              : 'navigation-changed'
            : newWahapediaKind(entry.kind),
          entry.locator,
          {
            class: 'material',
            baselineFingerprint: baseline?.checksum.toLowerCase() ?? null,
            observedFingerprint: entry.fingerprint,
            workflowUrl: observation.workflowUrl,
            evidence: { title: entry.title, kind: entry.kind },
          }
        )
      )
    }
  })
  const acceptedLocators = new Set<string>()
  accepted.forEach(artifact => {
    const locator = normalizedUrl(artifact.finalUrl)
    if (
      !observedByUrl.has(locator) &&
      !observedByUrl.has(normalizedUrl(artifact.requestUrl)) &&
      !acceptedLocators.has(locator)
    ) {
      acceptedLocators.add(locator)
      const kind = wahapediaKindForUrl(locator)
      events.push(
        createEvent('wahapedia', observedAt, removedWahapediaKind(kind), locator, {
          class: 'material',
          baselineFingerprint: artifact.checksum.toLowerCase(),
          observedFingerprint: null,
          workflowUrl: observation.workflowUrl,
          evidence: { kind },
        })
      )
    }
  })

  return createRadarLane('wahapedia', observedAt, events, observation.workflowUrl)
}

export const compareBsDataObservation = (observation: BsDataObservation): RadarLane => {
  if (
    observation?.schemaVersion !== 1 ||
    observation.source !== 'bsdata' ||
    !Array.isArray(observation.changedPaths)
  ) {
    throw new Error('BSData observation has an incompatible schema')
  }
  const observedAt = instant(observation.observedAt, 'BSData observation observedAt')
  const baselineSha = nonEmptyString(observation.baselineSha, 'BSData baselineSha').toLowerCase()
  const headSha = nonEmptyString(observation.headSha, 'BSData headSha').toLowerCase()
  if (!GIT_SHA_PATTERN.test(baselineSha) || !GIT_SHA_PATTERN.test(headSha)) {
    throw new Error('BSData observation has an invalid Git checksum')
  }
  const changedPaths = observation.changedPaths.map((value, index) =>
    nonEmptyString(value, `BSData changed path ${index + 1}`)
  )
  assertUniqueLocators(changedPaths, 'bsdata')
  const materialPaths = changedPaths.filter(value => /\.(?:cat|gst)$/i.test(value)).sort(compareText)
  const events: RadarEvent[] = []

  if (observation.comparisonStatus === 'ahead' && materialPaths.length) {
    events.push(
      createEvent('bsdata', observedAt, 'community-catalog-changed', observation.repository, {
        class: 'material',
        baselineFingerprint: baselineSha,
        observedFingerprint: headSha,
        workflowUrl: observation.workflowUrl,
        evidence: {
          changedPaths: materialPaths,
          ...(observation.compareUrl ? { compareUrl: normalizedUrl(observation.compareUrl) } : {}),
        },
      })
    )
  } else if (!['ahead', 'identical'].includes(observation.comparisonStatus)) {
    const kind = {
      diverged: 'comparison-diverged',
      truncated: 'comparison-truncated',
      'rate-limited': 'rate-limited',
      malformed: 'source-contract-changed',
    }[observation.comparisonStatus] as RadarChangeKind
    events.push(
      createEvent('bsdata', observedAt, kind, observation.repository, {
        class: 'operational',
        baselineFingerprint: baselineSha,
        observedFingerprint: headSha,
        workflowUrl: observation.workflowUrl,
        evidence: { comparisonStatus: observation.comparisonStatus },
      })
    )
  }

  return createRadarLane('bsdata', observedAt, events, observation.workflowUrl)
}

const normalizedLane = (lane: RadarLane): RadarLane =>
  createRadarLane(lane.source, lane.observedAt, lane.events, lane.workflowUrl)

export const mergeRadarLanes = (existing: RadarLane[], observed: RadarLane[]): RadarLane[] => {
  const bySource = new Map<RadarSource, RadarLane>()
  existing.forEach(lane => {
    if (bySource.has(lane.source)) throw new Error(`Existing report repeats ${lane.source} lane`)
    bySource.set(lane.source, normalizedLane(lane))
  })
  observed.forEach(lane => {
    if (observed.filter(candidate => candidate.source === lane.source).length > 1) {
      throw new Error(`Observed report repeats ${lane.source} lane`)
    }
    bySource.set(lane.source, normalizedLane(lane))
  })
  return RADAR_SOURCES.flatMap(source => {
    const lane = bySource.get(source)
    return lane ? [lane] : []
  })
}

export const createRadarReport = (lanes: RadarLane[]): RadarReport => {
  const normalizedLanes = mergeRadarLanes([], lanes)
  if (!normalizedLanes.length) throw new Error('Rules Radar report requires at least one source lane')
  const events = sortedEvents(normalizedLanes.flatMap(lane => lane.events))
  const observedAt = normalizedLanes
    .map(lane => lane.observedAt)
    .sort(compareText)
    .at(-1)!
  return {
    schemaVersion: 1,
    observedAt,
    lanes: normalizedLanes,
    events,
    materialEventCount: events.filter(event => event.class === 'material').length,
    operationalEventCount: events.filter(event => event.class === 'operational').length,
    aggregateFingerprint: hash(
      normalizedLanes.map(lane => ({ source: lane.source, fingerprint: lane.fingerprint }))
    ),
  }
}
