import type { ArtifactManifest } from '../../data'
import type { GamesWorkshopDiscoveryResult } from '../../data/gamesWorkshop'
import { resolveGamesWorkshopDiscovery } from '../../data/gamesWorkshop'
import { compareGamesWorkshopObservation, createRadarLane } from '../compare'
import type {
  GamesWorkshopObservation,
  RadarEvent,
  RadarLane,
  SourceObservationClassifications,
} from '../model'

export interface GamesWorkshopRadarObserverDependencies {
  now: () => string
  discoverPrivate: () => Promise<GamesWorkshopDiscoveryResult>
  fetchDownloadsPage: () => Promise<string>
}

export interface GamesWorkshopRadarObserverInput {
  acceptedManifest: ArtifactManifest
  classifications: SourceObservationClassifications
  workflowUrl?: string
}

export interface GamesWorkshopRadarObserverResult {
  observation?: GamesWorkshopObservation
  lane: RadarLane
  requestCount: number
}

const operationalLane = (observedAt: string, details: string, workflowUrl?: string): RadarLane => {
  const event: RadarEvent = {
    class: 'operational',
    source: 'games-workshop',
    publisher: 'games-workshop',
    authority: 'official',
    changeKind: 'source-unavailable',
    locator: 'https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/',
    baselineFingerprint: null,
    observedFingerprint: null,
    observedAt,
    workflowUrl,
    evidence: { details: details.slice(0, 1000) },
  }
  return createRadarLane('games-workshop', observedAt, [event], workflowUrl)
}

export const observeGamesWorkshopRadar = async (
  input: GamesWorkshopRadarObserverInput,
  dependencies: GamesWorkshopRadarObserverDependencies
): Promise<GamesWorkshopRadarObserverResult> => {
  const observedAt = dependencies.now()
  let requestCount = 1
  let privateDiscovery: GamesWorkshopDiscoveryResult
  try {
    privateDiscovery = await dependencies.discoverPrivate()
  } catch (error) {
    privateDiscovery = {
      downloads: [],
      diagnostics: [
        {
          code: 'private-api-unavailable',
          severity: 'error',
          message: error instanceof Error ? error.message : String(error),
        },
      ],
      method: 'none',
    }
  }

  let discovery = privateDiscovery
  if (!discovery.downloads.length) {
    requestCount += 1
    try {
      discovery = resolveGamesWorkshopDiscovery(privateDiscovery, await dependencies.fetchDownloadsPage())
    } catch (error) {
      return {
        lane: operationalLane(
          observedAt,
          `Official API and page discovery failed: ${error instanceof Error ? error.message : String(error)}`,
          input.workflowUrl
        ),
        requestCount,
      }
    }
  }
  if (!discovery.downloads.length) {
    return {
      lane: operationalLane(
        observedAt,
        discovery.diagnostics.map(diagnostic => diagnostic.message).join('; '),
        input.workflowUrl
      ),
      requestCount,
    }
  }

  const observation: GamesWorkshopObservation = {
    schemaVersion: 1,
    source: 'games-workshop',
    observedAt,
    workflowUrl: input.workflowUrl,
    entries: discovery.downloads.map(download => ({
      locator: download.url,
      title: download.title,
    })),
  }
  return {
    observation,
    lane: compareGamesWorkshopObservation({
      acceptedManifest: input.acceptedManifest,
      classifications: input.classifications,
      observation,
    }),
    requestCount,
  }
}
