import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileArtifactCache,
  acquireArtifact,
  createPinnedHttpsTransport,
  resolveDnsAddresses,
  type ArtifactManifest,
} from '../data'
import {
  GAMES_WORKSHOP_DOWNLOADS_PAGE_URL,
  createGamesWorkshopDownloadSearchRequest,
  searchCurrentGamesWorkshopDownloads,
} from '../data/gamesWorkshop'
import { stableJson } from '../generate/serialization'
import type { RadarLane, SourceObservationClassifications } from './model'
import { observeGamesWorkshopRadar, type GamesWorkshopRadarObserverResult } from './observers/gamesWorkshop'
import {
  observeWahapediaRadar,
  type RadarFetch,
  type WahapediaRadarObserverResult,
} from './observers/wahapedia'
import { readRulesRadarConfig } from './config'

export type RadarObservationSource = 'official' | 'wahapedia' | 'all'

export interface RulesRadarObserveArguments {
  source: RadarObservationSource
  configPath: string
  outputDirectory: string
  cacheDirectory: string
  workflowUrl?: string
  paceMs: number
}

export interface RulesRadarObserveResult {
  official?: GamesWorkshopRadarObserverResult
  wahapedia?: WahapediaRadarObserverResult
  operationalFailure: boolean
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseRulesRadarObserveArguments = (values: string[]): RulesRadarObserveArguments => {
  const parsed: RulesRadarObserveArguments = {
    source: 'official',
    configPath: path.join('data', 'aos4', 'radar', 'config.json'),
    outputDirectory: path.join('.cache', 'aos4', 'radar', 'observation'),
    cacheDirectory: path.join('.cache', 'aos4', 'radar', 'artifacts'),
    paceMs: 250,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--source') {
      parsed.source = nextValue(values, index, value) as RadarObservationSource
      index += 1
    } else if (value === '--config') {
      parsed.configPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.outputDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--cache') {
      parsed.cacheDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--workflow-url') {
      parsed.workflowUrl = nextValue(values, index, value)
      index += 1
    } else if (value === '--pace-ms') {
      parsed.paceMs = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!['official', 'wahapedia', 'all'].includes(parsed.source)) {
    throw new Error('--source must be official, wahapedia, or all')
  }
  if (!Number.isSafeInteger(parsed.paceMs) || parsed.paceMs < 0 || parsed.paceMs > 60_000) {
    throw new Error('--pace-ms must be an integer from 0 to 60000')
  }
  return parsed
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const writeResult = async (
  outputDirectory: string,
  name: string,
  result: GamesWorkshopRadarObserverResult | WahapediaRadarObserverResult
): Promise<void> => {
  await writeFile(path.join(outputDirectory, `${name}-lane.json`), stableJson(result.lane), 'utf8')
  if (result.observation) {
    await writeFile(
      path.join(outputDirectory, `${name}-observation.json`),
      stableJson(result.observation),
      'utf8'
    )
  }
}

export const runRulesRadarObserve = async (
  arguments_: RulesRadarObserveArguments,
  rootPath = process.cwd()
): Promise<RulesRadarObserveResult> => {
  const configPath = path.resolve(rootPath, arguments_.configPath)
  const config = readRulesRadarConfig(configPath, rootPath)
  const [acceptedManifest, classifications] = await Promise.all([
    readJson<ArtifactManifest>(path.resolve(rootPath, config.acceptedManifestPath)),
    readJson<SourceObservationClassifications>(path.resolve(rootPath, config.sourceClassificationsPath)),
  ])
  const outputDirectory = path.resolve(rootPath, arguments_.outputDirectory)
  await mkdir(outputDirectory, { recursive: true })
  const cache = new FileArtifactCache(path.resolve(rootPath, arguments_.cacheDirectory))
  const transport = createPinnedHttpsTransport()
  const now = () => new Date().toISOString()
  const result: RulesRadarObserveResult = { operationalFailure: false }

  if (arguments_.source === 'official' || arguments_.source === 'all') {
    result.official = await observeGamesWorkshopRadar(
      {
        acceptedManifest,
        classifications,
        workflowUrl: arguments_.workflowUrl,
      },
      {
        now,
        discoverPrivate: () =>
          searchCurrentGamesWorkshopDownloads(
            {
              transport,
              policy: {
                allowedHosts: ['www.warhammer-community.com'],
                resolveAddresses: resolveDnsAddresses,
              },
            },
            createGamesWorkshopDownloadSearchRequest()
          ),
        fetchDownloadsPage: async () => {
          const acquired = await acquireArtifact(
            {
              url: GAMES_WORKSHOP_DOWNLOADS_PAGE_URL,
              adapterVersion: 'games-workshop-discovery-page/1',
              allowedMediaTypes: ['text/html'],
              maxBytes: 16 * 1024 * 1024,
              timeoutMs: 30_000,
            },
            {
              transport,
              cache,
              now,
              policy: {
                allowedHosts: ['www.warhammer-community.com'],
                resolveAddresses: resolveDnsAddresses,
              },
            }
          )
          return new TextDecoder('utf-8', { fatal: true }).decode(acquired.bytes)
        },
      }
    )
    await writeResult(outputDirectory, 'games-workshop', result.official)
  }

  if (arguments_.source === 'wahapedia' || arguments_.source === 'all') {
    const fetch: RadarFetch = async request => {
      const acquired = await acquireArtifact(
        {
          url: request.url,
          adapterVersion: 'wahapedia-radar-sentinel/1',
          allowedMediaTypes: request.allowedMediaTypes,
          maxBytes: request.maxBytes,
          timeoutMs: 30_000,
        },
        {
          transport,
          cache,
          now,
          policy: {
            allowedHosts: ['wahapedia.ru', 'www.wahapedia.ru'],
            resolveAddresses: resolveDnsAddresses,
          },
        }
      )
      return {
        finalUrl: acquired.entry.finalUrl,
        bytes: acquired.bytes,
        checksum: acquired.entry.checksum,
      }
    }
    result.wahapedia = await observeWahapediaRadar(
      {
        config,
        acceptedManifest,
        workflowUrl: arguments_.workflowUrl,
      },
      {
        now,
        fetch,
        paceMs: arguments_.paceMs,
      }
    )
    await writeResult(outputDirectory, 'wahapedia', result.wahapedia)
  }

  const lanes = [result.official?.lane, result.wahapedia?.lane].filter(
    (value): value is RadarLane => value !== undefined
  )
  result.operationalFailure = lanes.some(lane => lane.events.some(event => event.class === 'operational'))
  await writeFile(
    path.join(outputDirectory, 'summary.json'),
    stableJson({
      schemaVersion: 1,
      sources: lanes.map(lane => lane.source),
      materialEventCount: lanes.flatMap(lane => lane.events).filter(event => event.class === 'material')
        .length,
      operationalEventCount: lanes.flatMap(lane => lane.events).filter(event => event.class === 'operational')
        .length,
      operationalFailure: result.operationalFailure,
    }),
    'utf8'
  )
  return result
}

const run = async (): Promise<void> => {
  const result = await runRulesRadarObserve(parseRulesRadarObserveArguments(process.argv.slice(2)))
  if (result.operationalFailure) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
