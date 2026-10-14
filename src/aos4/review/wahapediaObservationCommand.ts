import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AcquisitionError,
  type AcquisitionErrorCode,
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
  discoverWahapediaNavFragmentUrl,
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
  /** Whole-request limit, body included; defaults to `DEFAULT_TIMEOUT_MS`. */
  timeoutMs?: number
  /** Extra attempts after a transient transport failure; defaults to `DEFAULT_RETRIES`. */
  retries?: number
}

/**
 * Bounds chosen from the 2026-10-14 certification attempts, when Wahapedia served 0.75-1.6 MB
 * pages in 5-52 s and the old fixed 30 s limit left 6-46 of ~85 sources inaccessible per run.
 * 120 s is over twice the slowest observed page; two paced, budgeted retries with a linear
 * backoff ride out a slow minute without hammering a struggling site.
 */
export const DEFAULT_TIMEOUT_MS = 120_000
export const MAX_TIMEOUT_MS = 300_000
export const DEFAULT_RETRIES = 2
export const MAX_RETRIES = 3
export const RETRY_BACKOFF_MS = 15_000

/**
 * Only transport failures are worth another attempt. HTTP statuses (including 429/5xx, whose
 * Retry-After the acquisition error does not carry), URL-policy, media-type, size, and checksum
 * failures fail on the first attempt, so the observation still degrades to `inaccessible`.
 */
const RETRIABLE_ACQUISITION_CODES = new Set<AcquisitionErrorCode>([
  'timeout',
  'network-error',
  'truncated-response',
])

const isRetriable = (error: unknown): boolean =>
  error instanceof AcquisitionError && RETRIABLE_ACQUISITION_CODES.has(error.code)

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
    timeoutMs: DEFAULT_TIMEOUT_MS,
    retries: DEFAULT_RETRIES,
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
    } else if (value === '--timeout-ms') {
      parsed.timeoutMs = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else if (value === '--retries') {
      parsed.retries = Number.parseInt(nextValue(values, index, value), 10)
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
  const timeoutMs = parsed.timeoutMs ?? DEFAULT_TIMEOUT_MS
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > MAX_TIMEOUT_MS) {
    throw new Error(`--timeout-ms must be an integer from 1000 to ${MAX_TIMEOUT_MS}`)
  }
  const retries = parsed.retries ?? DEFAULT_RETRIES
  if (!Number.isSafeInteger(retries) || retries < 0 || retries > MAX_RETRIES) {
    throw new Error(`--retries must be an integer from 0 to ${MAX_RETRIES}`)
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

const htmlRequest = (url: string, timeoutMs: number): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/html'],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs,
})

const exportRequest = (url: string, timeoutMs: number): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/csv'],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs,
})

const spreadsheetRequest = (url: string, timeoutMs: number): AcquireArtifactRequest => ({
  url,
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
  ],
  maxBytes: 16 * 1024 * 1024,
  timeoutMs,
})

const robotsRequest = (timeoutMs: number): AcquireArtifactRequest => ({
  url: 'https://wahapedia.ru/robots.txt',
  adapterVersion: 'wahapedia-discovery/1',
  allowedMediaTypes: ['text/plain'],
  maxBytes: 1024 * 1024,
  timeoutMs,
})

/** Every attempt, retries included, passes through the limiter: paced and counted against the budget. */
const acquireRequired = async (
  request: AcquireArtifactRequest,
  limiter: RequestLimiter,
  acquire: AcquireObservedArtifact,
  retries: number,
  wait: (milliseconds: number) => Promise<void>
): Promise<AcquireArtifactResult> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await limiter.run(() => acquire(request))
    } catch (error) {
      if (attempt >= retries || !isRetriable(error)) throw error
      await wait(RETRY_BACKOFF_MS * (attempt + 1))
    }
  }
}

type FetchSource = (request: AcquireArtifactRequest) => Promise<AcquireArtifactResult>

const acquireObserved = async (
  source: WahapediaObservedSource,
  request: AcquireArtifactRequest,
  fetchSource: FetchSource
): Promise<ObservedAcquisition> => {
  try {
    const result = await fetchSource(request)
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

const isHttpNotFound = (error: unknown): boolean =>
  error instanceof AcquisitionError && error.code === 'http-status' && /\bHTTP 404\b/.test(error.message)

/**
 * A warscroll collection is a derived candidate (see `discoverWahapediaWarscrollCollection`), not
 * a link the page still guarantees: `Endless Spells` genuinely publishes none. A 404 on the
 * candidate means "this faction has no collection" and is omitted from the observation entirely,
 * exactly like the old scrape-finds-nothing case; every other failure still degrades to
 * `inaccessible`, so a real outage is never mistaken for an absent collection.
 */
const acquireObservedCollection = async (
  source: WahapediaObservedSource,
  request: AcquireArtifactRequest,
  fetchSource: FetchSource
): Promise<ObservedAcquisition | undefined> => {
  try {
    const result = await fetchSource(request)
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
    if (isHttpNotFound(error)) return undefined
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
  const wait =
    providedDependencies.wait ??
    ((milliseconds: number) => new Promise<void>(resolve => setTimeout(resolve, milliseconds)))
  const limiter = createRequestLimiter({
    budget: input.requestBudget,
    paceMs: input.paceMs,
    wait,
  })
  const acquire =
    providedDependencies.acquire ??
    ((request: AcquireArtifactRequest) => acquireArtifact(request, dependencies(input.cacheDirectory)))
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const fetchSource: FetchSource = request =>
    acquireRequired(request, limiter, acquire, input.retries ?? DEFAULT_RETRIES, wait)
  const robots = await fetchSource(robotsRequest(timeoutMs))
  const robotsPolicy = parseRobotsPolicy(new TextDecoder('utf-8', { fatal: true }).decode(robots.bytes))
  assertRobotsAllows(robotsPolicy, WAHAPEDIA_DATA_EXPORT_URL)
  const index = await fetchSource(htmlRequest(WAHAPEDIA_DATA_EXPORT_URL, timeoutMs))
  const indexHtml = new TextDecoder('utf-8', { fatal: true }).decode(index.bytes)
  const navFragmentUrl = discoverWahapediaNavFragmentUrl(indexHtml, index.entry.finalUrl)
  let navFragmentHtml: string | undefined
  if (navFragmentUrl) {
    assertRobotsAllows(robotsPolicy, navFragmentUrl)
    const navFragment = await fetchSource(htmlRequest(navFragmentUrl, timeoutMs))
    navFragmentHtml = new TextDecoder('utf-8', { fatal: true }).decode(navFragment.bytes)
  }
  const navigation = discoverWahapediaNavigation(indexHtml, index.entry.finalUrl, navFragmentHtml)
  assertRobotsAllows(robotsPolicy, navigation.exportSpecificationUrl)
  const specification = await fetchSource(spreadsheetRequest(navigation.exportSpecificationUrl, timeoutMs))
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
      htmlRequest(faction.url, timeoutMs),
      fetchSource
    )
  )
  const collectionSources: WahapediaObservedSource[] = factionAcquisitions.flatMap(acquisition => {
    if (!acquisition.result) return []
    const collectionUrl = discoverWahapediaWarscrollCollection(
      new TextDecoder('utf-8', { fatal: true }).decode(acquisition.result.bytes),
      acquisition.result.entry.finalUrl
    )
    return [
      {
        kind: 'warscroll-collection' as const,
        url: collectionUrl,
        title: `${acquisition.source.title} warscroll collection`,
        availability: 'accessible' as const,
      },
    ]
  })
  const materialSources: WahapediaObservedSource[] = [
    ...navigation.rulesPages.map(value => ({
      kind: 'rules-page' as const,
      url: value.url,
      title: value.title,
      availability: 'accessible' as const,
    })),
    ...exportUrls.map(url => ({
      kind: 'export' as const,
      url,
      title: titleFromExportUrl(url),
      availability: 'accessible' as const,
    })),
  ]
  ;[...collectionSources, ...materialSources].forEach(source => assertRobotsAllows(robotsPolicy, source.url))
  const collectionAcquisitions = (
    await mapWithConcurrency(collectionSources, input.concurrency, source =>
      acquireObservedCollection(source, htmlRequest(source.url, timeoutMs), fetchSource)
    )
  ).filter((value): value is ObservedAcquisition => value !== undefined)
  const materialAcquisitions = [
    ...collectionAcquisitions,
    ...(await mapWithConcurrency(materialSources, input.concurrency, source =>
      acquireObserved(
        source,
        source.kind === 'export' ? exportRequest(source.url, timeoutMs) : htmlRequest(source.url, timeoutMs),
        fetchSource
      )
    )),
  ]
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
