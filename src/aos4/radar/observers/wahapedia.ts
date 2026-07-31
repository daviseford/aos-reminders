import { artifactChecksum, type ArtifactManifest } from '../../data'
import { discoverWahapediaExportUrls, discoverWahapediaNavigation } from '../../review/wahapediaObservation'
import { compareWahapediaObservation, createRadarLane } from '../compare'
import type { RulesRadarConfig } from '../config'
import type {
  RadarEvent,
  RadarLane,
  WahapediaRadarObservation,
  WahapediaRadarObservationEntry,
} from '../model'
import { parseRobotsPolicy, robotsAllows } from './robots'
import { createRequestLimiter } from './requestLimiter'

export interface RadarFetchRequest {
  url: string
  allowedMediaTypes: string[]
  maxBytes: number
}

export interface RadarFetchedArtifact {
  finalUrl: string
  bytes: Uint8Array
  checksum: string
}

export type RadarFetch = (request: RadarFetchRequest) => Promise<RadarFetchedArtifact>

export interface WahapediaRadarObserverDependencies {
  now: () => string
  fetch: RadarFetch
  wait?: (milliseconds: number) => Promise<void>
  paceMs?: number
}

export interface WahapediaRadarObserverInput {
  config: RulesRadarConfig
  acceptedManifest: ArtifactManifest
  workflowUrl?: string
}

export interface WahapediaRadarObserverResult {
  observation?: WahapediaRadarObservation
  lane: RadarLane
  requestCount: number
  requiresExpandedObservation: boolean
  artifacts: RadarFetchedArtifact[]
}

const USER_AGENT = 'aos-reminders-rules-radar'

const operationalLane = (observedAt: string, details: string, workflowUrl?: string): RadarLane => {
  const event: RadarEvent = {
    class: 'operational',
    source: 'wahapedia',
    publisher: 'wahapedia',
    authority: 'secondary',
    changeKind: 'source-contract-changed',
    locator: 'https://wahapedia.ru/aos4/',
    baselineFingerprint: null,
    observedFingerprint: null,
    observedAt,
    workflowUrl,
    evidence: { details: details.slice(0, 1000) },
  }
  return createRadarLane('wahapedia', observedAt, [event], workflowUrl)
}

const decodeText = (artifact: RadarFetchedArtifact, label: string): string => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(artifact.bytes)
  } catch (error) {
    throw new Error(`${label} is not valid UTF-8`, { cause: error })
  }
}

const assertWahapediaArtifact = (artifact: RadarFetchedArtifact): void => {
  const finalUrl = new URL(artifact.finalUrl)
  if (
    finalUrl.protocol !== 'https:' ||
    !['wahapedia.ru', 'www.wahapedia.ru'].includes(finalUrl.hostname.toLowerCase())
  ) {
    throw new Error(`Wahapedia sentinel followed an untrusted URL: ${artifact.finalUrl}`)
  }
  if (artifactChecksum(artifact.bytes) !== artifact.checksum.toLowerCase()) {
    throw new Error(`Wahapedia sentinel received a mismatched checksum for ${artifact.finalUrl}`)
  }
}

const pathWithQuery = (value: string): string => {
  const url = new URL(value)
  return `${url.pathname}${url.search}`
}

const navigationFingerprint = (entry: Pick<WahapediaRadarObservationEntry, 'locator'>) =>
  artifactChecksum(new TextEncoder().encode(entry.locator))

export const observeWahapediaRadar = async (
  input: WahapediaRadarObserverInput,
  dependencies: WahapediaRadarObserverDependencies
): Promise<WahapediaRadarObserverResult> => {
  const observedAt = dependencies.now()
  const artifacts: RadarFetchedArtifact[] = []
  const limiter = createRequestLimiter({
    budget: input.config.requestBudgets.wahapedia,
    paceMs: dependencies.paceMs,
    wait: dependencies.wait,
  })
  const fetch = async (request: RadarFetchRequest): Promise<RadarFetchedArtifact> => {
    const result = await limiter.run(() => dependencies.fetch(request))
    assertWahapediaArtifact(result)
    artifacts.push(result)
    return result
  }

  try {
    const robotsUrl = new URL('/robots.txt', input.config.wahapedia.rootUrl).toString()
    const robots = await fetch({
      url: robotsUrl,
      allowedMediaTypes: ['text/plain'],
      maxBytes: 512 * 1024,
    })
    const robotsPolicy = parseRobotsPolicy(decodeText(robots, 'Wahapedia robots.txt'))
    const assertAllowed = (url: string): void => {
      if (!robotsAllows(robotsPolicy, USER_AGENT, pathWithQuery(url))) {
        throw new Error(`Wahapedia robots policy disallows ${pathWithQuery(url)}`)
      }
    }

    assertAllowed(input.config.wahapedia.navigationUrl)
    assertAllowed(input.config.wahapedia.lastUpdateUrl)
    const navigationArtifact = await fetch({
      url: input.config.wahapedia.navigationUrl,
      allowedMediaTypes: ['text/html'],
      maxBytes: 16 * 1024 * 1024,
    })
    const navigation = discoverWahapediaNavigation(
      decodeText(navigationArtifact, 'Wahapedia navigation'),
      navigationArtifact.finalUrl
    )
    assertAllowed(navigation.exportSpecificationUrl)
    const specification = await fetch({
      url: navigation.exportSpecificationUrl,
      allowedMediaTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/octet-stream',
      ],
      maxBytes: 16 * 1024 * 1024,
    })
    const exports = discoverWahapediaExportUrls(specification.bytes)
    if (!exports.includes(input.config.wahapedia.lastUpdateUrl)) {
      throw new Error('Wahapedia export specification no longer contains Last_update.csv')
    }
    const lastUpdate = await fetch({
      url: input.config.wahapedia.lastUpdateUrl,
      allowedMediaTypes: ['text/csv', 'text/plain'],
      maxBytes: 16 * 1024,
    })
    decodeText(lastUpdate, 'Wahapedia Last_update.csv')

    const navigationEntries: WahapediaRadarObservationEntry[] = [
      ...navigation.factionPages.map(entry => ({
        kind: 'faction' as const,
        locator: entry.url,
        title: entry.title,
        fingerprint: navigationFingerprint({ locator: entry.url }),
      })),
      ...navigation.rulesPages.map(entry => ({
        kind: 'rules-page' as const,
        locator: entry.url,
        title: entry.title,
        fingerprint: navigationFingerprint({ locator: entry.url }),
      })),
      {
        kind: 'export',
        locator: lastUpdate.finalUrl,
        title: 'Last_update.csv',
        fingerprint: lastUpdate.checksum.toLowerCase(),
      },
    ]
    const observation: WahapediaRadarObservation = {
      schemaVersion: 1,
      source: 'wahapedia',
      scope: 'sentinel',
      observedAt,
      workflowUrl: input.workflowUrl,
      entries: navigationEntries,
    }
    const lane = compareWahapediaObservation({
      acceptedManifest: input.acceptedManifest,
      observation,
    })
    return {
      observation,
      lane,
      requestCount: limiter.count,
      requiresExpandedObservation: lane.events.some(event => event.class === 'material'),
      artifacts,
    }
  } catch (error) {
    return {
      lane: operationalLane(
        observedAt,
        error instanceof Error ? error.message : String(error),
        input.workflowUrl
      ),
      requestCount: limiter.count,
      requiresExpandedObservation: false,
      artifacts,
    }
  }
}
