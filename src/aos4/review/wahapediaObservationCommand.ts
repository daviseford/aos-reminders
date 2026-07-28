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

interface Arguments {
  outputPath: string
  cacheDirectory: string
  concurrency: number
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

export const parseWahapediaObservationArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    outputPath: path.join('.cache', 'aos4', 'review', 'wahapedia-observation.json'),
    cacheDirectory: path.join('.cache', 'aos4', 'review', 'discovery-artifacts'),
    concurrency: 3,
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
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!Number.isSafeInteger(parsed.concurrency) || parsed.concurrency < 1 || parsed.concurrency > 6) {
    throw new Error('--concurrency must be an integer from 1 to 6')
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

const acquireRequired = async (
  request: AcquireArtifactRequest,
  cacheDirectory: string
): Promise<AcquireArtifactResult> => acquireArtifact(request, dependencies(cacheDirectory))

const acquireObserved = async (
  source: WahapediaObservedSource,
  request: AcquireArtifactRequest,
  cacheDirectory: string
): Promise<ObservedAcquisition> => {
  try {
    const result = await acquireRequired(request, cacheDirectory)
    return {
      source: {
        ...source,
        url: result.entry.finalUrl,
        availability: 'accessible',
      },
      result,
    }
  } catch {
    return {
      source: {
        ...source,
        availability: 'inaccessible',
      },
    }
  }
}

const mapConcurrent = async <Input, Output>(
  values: Input[],
  concurrency: number,
  map: (value: Input) => Promise<Output>
): Promise<Output[]> => {
  const output = new Array<Output>(values.length)
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex
      nextIndex += 1
      output[index] = await map(values[index])
    }
  })
  await Promise.all(workers)
  return output
}

const titleFromExportUrl = (url: string): string =>
  decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? url)

const run = async (): Promise<void> => {
  const arguments_ = parseWahapediaObservationArguments(process.argv.slice(2))
  const observedAt = new Date().toISOString()
  const index = await acquireRequired(htmlRequest(WAHAPEDIA_DATA_EXPORT_URL), arguments_.cacheDirectory)
  const navigation = discoverWahapediaNavigation(
    new TextDecoder('utf-8', { fatal: true }).decode(index.bytes),
    index.entry.finalUrl
  )
  const specification = await acquireRequired(
    spreadsheetRequest(navigation.exportSpecificationUrl),
    arguments_.cacheDirectory
  )
  const exportUrls = discoverWahapediaExportUrls(specification.bytes)

  const factionAcquisitions = await mapConcurrent(navigation.factionPages, arguments_.concurrency, faction =>
    acquireObserved(
      {
        kind: 'faction-page',
        url: faction.url,
        title: faction.title,
        availability: 'accessible',
      },
      htmlRequest(faction.url),
      arguments_.cacheDirectory
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
  const materialAcquisitions = await mapConcurrent(materialSources, arguments_.concurrency, source =>
    acquireObserved(
      source,
      source.kind === 'export' ? exportRequest(source.url) : htmlRequest(source.url),
      arguments_.cacheDirectory
    )
  )
  const observation = createWahapediaSourceObservation(observedAt, [
    {
      kind: 'data-export-index',
      url: index.entry.finalUrl,
      title: 'Wahapedia Data Export index',
      availability: 'accessible',
    },
    {
      kind: 'export-specification',
      url: specification.entry.finalUrl,
      title: 'Wahapedia Export Data Specs',
      availability: 'accessible',
    },
    ...factionAcquisitions.map(value => value.source),
    ...materialAcquisitions.map(value => value.source),
  ])
  const output = path.resolve(arguments_.outputPath)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, stableJson(observation), 'utf8')
  const inaccessible = observation.entries.filter(entry => entry.availability === 'inaccessible').length
  console.log(
    `Observed ${observation.entries.length} Wahapedia sources: ${output} ` + `(${inaccessible} inaccessible)`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
