import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileArtifactCache,
  acquireArtifact,
  createPinnedHttpsTransport,
  resolveDnsAddresses,
  type AcquireArtifactRequest,
  type AcquireArtifactResult,
} from '../data'
import { stableJson } from '../generate/serialization'
import {
  createWahapediaSourceObservation,
  discoverWahapediaExportUrls,
  discoverWahapediaNavigation,
  discoverWahapediaWarscrollCollection,
  WAHAPEDIA_DATA_EXPORT_URL,
  type WahapediaObservedSource,
} from './wahapediaObservation'
import {
  createRequestLimiter,
  mapWithConcurrency,
  RequestBudgetExceededError,
  type RequestLimiter,
} from '../radar/observers/requestLimiter'
import { parseRobotsPolicy, robotsAllows, type RobotsPolicy } from '../radar/observers/robots'
import type { IndependentSourceObservation } from './sourceInventory'

export interface WahapediaObservationCommandInput {
  outputPath: string
  cacheDirectory: string
  concurrency: number
  requestBudget: number
  paceMs: number
}

type AcquireObservedArtifact = (request: AcquireArtifactRequest) => Promise<AcquireArtifactResult>

export interface WahapediaObservationCommandDependencies {
  acquire?: AcquireObservedArtifact
  now?: () => string
  wait?: (milliseconds: number) => Promise<void>
}

export interface WahapediaObservationCommandResult {
  observation: IndependentSourceObservation
  requestCount: number
}

interface ObservedAcquisition {
  source: WahapediaObservedSource
  result?: AcquireArtifactResult
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseWahapediaObservationArguments = (values: string[]): WahapediaObservationCommandInput => {
  const parsed: WahapediaObservationCommandInput = {
    outputPath: path.join('.cache', 'aos4', 'review', 'wahapedia-observation.json'),
    cacheDirectory: path.join('.cache', 'aos4', 'review', 'discovery-artifacts'),
    concurrency: 3,
    requestBudget: 128,
    paceMs: 250,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--output') {
      parsed.outputPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--cache') {
      parsed.cacheDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--concurrency') {
      parsed.concurrency = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else if (value === '--request-budget') {
      parsed.requestBudget = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else if (value === '--pace-ms') {
      parsed.paceMs = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!Number.isSafeInteger(parsed.concurrency) || parsed.concurrency < 1 || parsed.concurrency > 6) {
    throw new Error('--concurrency must be an integer from 1 to 6')
  }
  if (!Number.isSafeInteger(parsed.requestBudget) || parsed.requestBudget < 1) {
    throw new Error('--request-budget must be a positive integer')
  }
  if (!Number.isSafeInteger(parsed.paceMs) || parsed.paceMs < 0 || parsed.paceMs > 60_000) {
    throw new Error('--pace-ms must be an integer from 0 to 60000')
  }
  return parsed
}

const dependencies = (cacheDirectory: string) => ({
  transport: createPinnedHttpsTransport(),
  cache: new FileArtifactCache(cacheDirectory),
  now: () => new Date().toISOString(),
  policy: {
    allowedHosts: ['wahapedia.ru', 'www.wahapedia.ru'],
    resolveAddresses: resolveDnsAddresses,
  },
})

const htmlRequest = (url: string): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/html'],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs: 30_000,
})

const exportRequest = (url: string): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/csv'],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs: 30_000,
})

const spreadsheetRequest = (url: string): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
  ],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs: 30_000,
})

const robotsRequest = (): AcquireArtifactRequest => ({
  url: 'https://wahapedia.ru/robots.txt',
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/plain'],
  maxBytes: 1024 * 1024,
  timeoutMs: 30_000,
})

const acquireRequired = async (
  request: AcquireArtifactRequest,
  limiter: RequestLimiter,
  acquire: AcquireObservedArtifact
): Promise<AcquireArtifactResult> => limiter.run(() => acquire(request))

const acquireObserved = async (
  source: WahapediaObservedSource,
  request: AcquireArtifactRequest,
  limiter: RequestLimiter,
  acquire: AcquireObservedArtifact
): Promise<ObservedAcquisition> => {
  try {
    const result = await acquireRequired(request, limiter, acquire)
    return {
      source: {
        ...source,
        url: result.entry.finalUrl,
        availability: 'accessible',
        fingerprint: result.entry.checksum,
      },
      result,
    }
  } catch (error) {
    if (error instanceof RequestBudgetExceededError) throw error
    return {
      source: {
        ...source,
        availability: 'inaccessible',
      },
    }
  }
}

const titleFromExportUrl = (url: string): string =>
  decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? url)

const assertRobotsAllows = (policy: RobotsPolicy, url: string): void => {
  const parsed = new URL(url)
  if (!robotsAllows(policy, 'aos-reminders-rules-radar', `${parsed.pathname}${parsed.search}`)) {
    throw new Error(`Wahapedia robots.txt disallows Rules Radar acquisition: ${parsed.pathname}`)
  }
}

export const observeWahapediaSources = async (
  input: WahapediaObservationCommandInput,
  providedDependencies: WahapediaObservationCommandDependencies = {}
): Promise<WahapediaObservationCommandResult> => {
  const observedAt = (providedDependencies.now ?? (() => new Date().toISOString()))()
  const limiter = createRequestLimiter({
    budget: input.requestBudget,
    paceMs: input.paceMs,
    wait: providedDependencies.wait,
  })
  const acquire =
    providedDependencies.acquire ??
    ((request: AcquireArtifactRequest) => acquireArtifact(request, dependencies(input.cacheDirectory)))
  const robots = await acquireRequired(robotsRequest(), limiter, acquire)
  const robotsPolicy = parseRobotsPolicy(new TextDecoder('utf-8', { fatal: true }).decode(robots.bytes))
  assertRobotsAllows(robotsPolicy, WAHAPEDIA_DATA_EXPORT_URL)
  const index = await acquireRequired(htmlRequest(WAHAPEDIA_DATA_EXPORT_URL), limiter, acquire)
  const navigation = discoverWahapediaNavigation(
    new TextDecoder('utf-8', { fatal: true }).decode(index.bytes),
    index.entry.finalUrl
  )
  assertRobotsAllows(robotsPolicy, navigation.exportSpecificationUrl)
  const specification = await acquireRequired(
    spreadsheetRequest(navigation.exportSpecificationUrl),
    limiter,
    acquire
  )
  const exportUrls = discoverWahapediaExportUrls(specification.bytes)
  navigation.factionPages.forEach(faction => assertRobotsAllows(robotsPolicy, faction.url))

  const factionAcquisitions = await mapWithConcurrency(navigation.factionPages, input.concurrency, faction =>
    acquireObserved(
      {
        kind: 'faction-page',
        url: faction.url,
        title: faction.title,
        availability: 'accessible',
      },
      htmlRequest(faction.url),
      limiter,
      acquire
    )
  )
  const collectionSources = factionAcquisitions.flatMap(acquisition => {
    if (!acquisition.result) return []
    const collectionUrl = discoverWahapediaWarscrollCollection(
      new TextDecoder('utf-8', { fatal: true }).decode(acquisition.result.bytes),
      acquisition.result.entry.finalUrl
    )
    return collectionUrl
      ? [
          {
            kind: 'warscroll-collection' as const,
            url: collectionUrl,
            title: `${acquisition.source.title} warscroll collection`,
            availability: 'accessible' as const,
          },
        ]
      : []
  })
  const materialSources: WahapediaObservedSource[] = [
    ...navigation.rulesPages.map(value => ({
      kind: 'rules-page' as const,
      url: value.url,
      title: value.title,
      availability: 'accessible' as const,
    })),
    ...collectionSources,
    ...exportUrls.map(url => ({
      kind: 'export' as const,
      url,
      title: titleFromExportUrl(url),
      availability: 'accessible' as const,
    })),
  ]
  materialSources.forEach(source => assertRobotsAllows(robotsPolicy, source.url))
  const materialAcquisitions = await mapWithConcurrency(materialSources, input.concurrency, source =>
    acquireObserved(
      source,
      source.kind === 'export' ? exportRequest(source.url) : htmlRequest(source.url),
      limiter,
      acquire
    )
  )
  const observation = createWahapediaSourceObservation(observedAt, [
    {
      kind: 'data-export-index',
      url: index.entry.finalUrl,
      title: 'Wahapedia Data Export index',
      availability: 'accessible',
      fingerprint: index.entry.checksum,
    },
    {
      kind: 'export-specification',
      url: specification.entry.finalUrl,
      title: 'Wahapedia Export Data Specs',
      availability: 'accessible',
      fingerprint: specification.entry.checksum,
    },
    ...factionAcquisitions.map(value => value.source),
    ...materialAcquisitions.map(value => value.source),
  ])
  return { observation, requestCount: limiter.count }
}

const run = async (): Promise<void> => {
  const arguments_ = parseWahapediaObservationArguments(process.argv.slice(2))
  const { observation, requestCount } = await observeWahapediaSources(arguments_)
  const output = path.resolve(arguments_.outputPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, stableJson(observation), 'utf8')
  const inaccessible = observation.entries.filter(entry => entry.availability === 'inaccessible').length
  console.log(
    `Observed ${observation.entries.length} Wahapedia sources: ${output} ` +
      `(${inaccessible} inaccessible, ${requestCount} requests)`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
