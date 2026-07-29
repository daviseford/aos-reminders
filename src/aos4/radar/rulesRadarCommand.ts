import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FileArtifactCache,
  acquireArtifact,
  acquireCandidateArtifacts,
  createPinnedHttpsTransport,
  resolveDnsAddresses,
  serializeArtifactManifest,
  type ArtifactManifest,
  type ArtifactManifestEntry,
  type CandidateAcquisitionSource,
} from '../data'
import { stableJson } from '../generate/serialization'
import { createRadarLane, createRadarReport, mergeRadarLanes } from './compare'
import { readRulesRadarConfig } from './config'
import type { RadarEvent, RadarLane, RadarReport } from './model'
import { renderRulesRadarIssueBody } from './report'

export interface CandidatePreparationInput {
  source: CandidateAcquisitionSource
  officialDocumentUrls: string[]
  wahapediaPageUrls: string[]
  outputDirectory: string
}

export interface CandidatePreparationResult {
  source: CandidateAcquisitionSource
  artifacts: Array<{
    url: string
    checksum: string
    byteLength: number
    adapterVersion: string
  }>
}

export interface RulesRadarRunInput {
  lanes: RadarLane[]
  outputDirectory: string
  acceptedManifest: ArtifactManifest
  wahapediaPageUrls?: string[]
  reportOnly?: boolean
}

export interface RulesRadarRunDependencies {
  prepareCandidate?: (input: CandidatePreparationInput) => Promise<CandidatePreparationResult>
}

export interface RulesRadarRunResult {
  report: RadarReport
  issueBody: string
  candidateEvidence: CandidatePreparationResult[]
  operationalFailure: boolean
}

const officialCandidateUrls = (report: RadarReport): string[] =>
  Array.from(
    new Set(
      report.events.flatMap(event =>
        event.class === 'material' &&
        event.source === 'games-workshop' &&
        ['new-publication', 'replaced-publication'].includes(event.changeKind)
          ? [event.locator]
          : []
      )
    )
  ).sort()

const acceptedWahapediaPages = (manifest: ArtifactManifest): string[] =>
  manifest.artifacts
    .filter(artifact => artifact.adapterVersion === 'wahapedia-html/1')
    .map(artifact => artifact.requestUrl)

const wahapediaCandidateUrls = (
  report: RadarReport,
  manifest: ArtifactManifest,
  explicitUrls: string[]
): string[] => {
  if (!report.events.some(event => event.class === 'material' && event.source === 'wahapedia')) {
    return []
  }
  const eventUrls = report.events.flatMap(event => {
    if (event.class !== 'material' || event.source !== 'wahapedia') return []
    try {
      const url = new URL(event.locator)
      return url.hostname === 'wahapedia.ru' && !url.pathname.endsWith('.csv') ? [url.toString()] : []
    } catch {
      return []
    }
  })
  return Array.from(new Set([...acceptedWahapediaPages(manifest), ...explicitUrls, ...eventUrls])).sort()
}

const candidateFailureLane = (lane: RadarLane, error: unknown): RadarLane => {
  const event: RadarEvent = {
    class: 'operational',
    source: lane.source,
    publisher: lane.source,
    authority: lane.authority,
    changeKind: 'candidate-failed',
    locator: lane.source,
    baselineFingerprint: null,
    observedFingerprint: null,
    observedAt: lane.observedAt,
    workflowUrl: lane.workflowUrl,
    evidence: {
      details: (error instanceof Error ? error.message : String(error)).slice(0, 1000),
    },
  }
  return createRadarLane(lane.source, lane.observedAt, [...lane.events, event], lane.workflowUrl)
}

const writeNew = (filePath: string, contents: string): Promise<void> =>
  writeFile(filePath, contents, { encoding: 'utf8', flag: 'wx' })

export const runRulesRadar = async (
  input: RulesRadarRunInput,
  dependencies: RulesRadarRunDependencies = {}
): Promise<RulesRadarRunResult> => {
  await mkdir(input.outputDirectory, { recursive: false })
  let lanes = mergeRadarLanes([], input.lanes)
  let report = createRadarReport(lanes)
  const officialUrls = officialCandidateUrls(report)
  const wahapediaUrls = wahapediaCandidateUrls(report, input.acceptedManifest, input.wahapediaPageUrls ?? [])
  const candidateEvidence: CandidatePreparationResult[] = []

  if (!input.reportOnly && dependencies.prepareCandidate) {
    const preparations: CandidatePreparationInput[] = [
      ...(officialUrls.length
        ? [
            {
              source: 'games-workshop' as const,
              officialDocumentUrls: officialUrls,
              wahapediaPageUrls: [],
              outputDirectory: path.join(input.outputDirectory, 'candidate', 'games-workshop'),
            },
          ]
        : []),
      ...(wahapediaUrls.length
        ? [
            {
              source: 'wahapedia' as const,
              officialDocumentUrls: [],
              wahapediaPageUrls: wahapediaUrls,
              outputDirectory: path.join(input.outputDirectory, 'candidate', 'wahapedia'),
            },
          ]
        : []),
    ]
    for (const preparation of preparations) {
      try {
        candidateEvidence.push(await dependencies.prepareCandidate(preparation))
      } catch (error) {
        const sourceLane = lanes.find(lane => lane.source === preparation.source)
        if (!sourceLane) throw error
        lanes = mergeRadarLanes(lanes, [candidateFailureLane(sourceLane, error)])
        report = createRadarReport(lanes)
      }
    }
  }

  const issueBody = renderRulesRadarIssueBody(report)
  await Promise.all([
    writeNew(path.join(input.outputDirectory, 'report.json'), stableJson(report)),
    writeNew(path.join(input.outputDirectory, 'issue-body.md'), issueBody),
    writeNew(path.join(input.outputDirectory, 'material-event-count.txt'), `${report.materialEventCount}\n`),
    writeNew(
      path.join(input.outputDirectory, 'operational-event-count.txt'),
      `${report.operationalEventCount}\n`
    ),
    writeNew(path.join(input.outputDirectory, 'fingerprint.txt'), `${report.aggregateFingerprint}\n`),
    ...(officialUrls.length
      ? [writeNew(path.join(input.outputDirectory, 'official-urls.json'), stableJson(officialUrls))]
      : []),
    ...(wahapediaUrls.length
      ? [writeNew(path.join(input.outputDirectory, 'wahapedia-pages.json'), stableJson(wahapediaUrls))]
      : []),
    ...(candidateEvidence.length
      ? [writeNew(path.join(input.outputDirectory, 'candidate-evidence.json'), stableJson(candidateEvidence))]
      : []),
  ])

  return {
    report,
    issueBody,
    candidateEvidence,
    operationalFailure: report.operationalEventCount > 0,
  }
}

interface Arguments {
  lanePaths: string[]
  outputDirectory: string
  configPath: string
  acceptedManifestPath?: string
  wahapediaPageListPaths: string[]
  wahapediaObservationPaths: string[]
  cacheDirectory: string
  requestPauseMs: number
  reportOnly: boolean
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseRulesRadarArguments = (values: string[]): Arguments => {
  const runLabel = new Date().toISOString().replace(/[:.]/g, '-')
  const parsed: Arguments = {
    lanePaths: [],
    outputDirectory: path.join('.cache', 'aos4', 'radar', 'runs', runLabel),
    configPath: path.join('data', 'aos4', 'radar', 'config.json'),
    wahapediaPageListPaths: [],
    wahapediaObservationPaths: [],
    cacheDirectory: path.join('.cache', 'aos4', 'radar', 'artifacts'),
    requestPauseMs: 250,
    reportOnly: false,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--lane') {
      parsed.lanePaths.push(nextValue(values, index, value))
      index += 1
    } else if (value === '--output') {
      parsed.outputDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--config') {
      parsed.configPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--accepted-manifest') {
      parsed.acceptedManifestPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--wahapedia-pages-file') {
      parsed.wahapediaPageListPaths.push(nextValue(values, index, value))
      index += 1
    } else if (value === '--wahapedia-observation') {
      parsed.wahapediaObservationPaths.push(nextValue(values, index, value))
      index += 1
    } else if (value === '--cache') {
      parsed.cacheDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--request-pause-ms') {
      parsed.requestPauseMs = Number.parseInt(nextValue(values, index, value), 10)
      index += 1
    } else if (value === '--report-only') {
      parsed.reportOnly = true
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!parsed.lanePaths.length) throw new Error('At least one --lane is required')
  if (
    !Number.isSafeInteger(parsed.requestPauseMs) ||
    parsed.requestPauseMs < 0 ||
    parsed.requestPauseMs > 60_000
  ) {
    throw new Error('--request-pause-ms must be an integer from 0 through 60000')
  }
  return parsed
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

export const pagesFromWahapediaSourceObservation = (value: unknown): string[] => {
  if (
    !value ||
    typeof value !== 'object' ||
    (value as { schemaVersion?: unknown }).schemaVersion !== 1 ||
    !Array.isArray((value as { entries?: unknown }).entries)
  ) {
    throw new Error('Wahapedia source observation has an incompatible schema')
  }
  return Array.from(
    new Set(
      (value as { entries: unknown[] }).entries.flatMap((entry, index) => {
        if (!entry || typeof entry !== 'object') {
          throw new Error(`Wahapedia source observation entry ${index + 1} is malformed`)
        }
        const candidate = entry as Record<string, unknown>
        if (
          candidate.publisher !== 'wahapedia' ||
          !['material', 'explicit-non-material'].includes(String(candidate.scope)) ||
          !['accessible', 'inaccessible', 'ambiguous'].includes(String(candidate.availability)) ||
          typeof candidate.url !== 'string'
        ) {
          throw new Error(`Wahapedia source observation entry ${index + 1} is malformed`)
        }
        const url = new URL(candidate.url)
        if (url.protocol !== 'https:' || !['wahapedia.ru', 'www.wahapedia.ru'].includes(url.hostname)) {
          throw new Error(`Wahapedia source observation entry ${index + 1} has an invalid URL`)
        }
        url.hash = ''
        return candidate.scope === 'material' &&
          candidate.availability === 'accessible' &&
          !url.pathname.endsWith('.csv')
          ? [url.toString()]
          : []
      })
    )
  ).sort()
}

const artifactSummary = (artifact: ArtifactManifestEntry) => ({
  url: artifact.finalUrl,
  checksum: artifact.checksum,
  byteLength: artifact.byteLength,
  adapterVersion: artifact.adapterVersion,
})

const run = async (): Promise<void> => {
  const arguments_ = parseRulesRadarArguments(process.argv.slice(2))
  const rootPath = process.cwd()
  const config = readRulesRadarConfig(path.resolve(rootPath, arguments_.configPath), rootPath)
  const acceptedManifestPath =
    arguments_.acceptedManifestPath ?? path.resolve(rootPath, config.acceptedManifestPath)
  const [acceptedManifest, lanes, pageLists, sourceObservations] = await Promise.all([
    readJson<ArtifactManifest>(acceptedManifestPath),
    Promise.all(arguments_.lanePaths.map(filePath => readJson<RadarLane>(filePath))),
    Promise.all(arguments_.wahapediaPageListPaths.map(filePath => readJson<string[]>(filePath))),
    Promise.all(arguments_.wahapediaObservationPaths.map(filePath => readJson<unknown>(filePath))),
  ])
  const transport = createPinnedHttpsTransport()
  const cache = new FileArtifactCache(path.resolve(rootPath, arguments_.cacheDirectory))
  const result = await runRulesRadar(
    {
      lanes,
      outputDirectory: path.resolve(rootPath, arguments_.outputDirectory),
      acceptedManifest,
      wahapediaPageUrls: [
        ...pageLists.flat(),
        ...sourceObservations.flatMap(pagesFromWahapediaSourceObservation),
      ],
      reportOnly: arguments_.reportOnly,
    },
    {
      prepareCandidate: async input => {
        const acquired = await acquireCandidateArtifacts({
          sources: [input.source],
          acceptedManifest,
          officialDocumentUrls: input.officialDocumentUrls,
          wahapediaPageUrls: input.wahapediaPageUrls,
          requestPauseMs: arguments_.requestPauseMs,
          acquire: request =>
            acquireArtifact(request, {
              transport,
              cache,
              now: () => new Date().toISOString(),
              policy: {
                allowedHosts: [
                  'wahapedia.ru',
                  'www.wahapedia.ru',
                  'assets.warhammer-community.com',
                  'www.warhammer-community.com',
                ],
                resolveAddresses: resolveDnsAddresses,
              },
            }),
        })
        await mkdir(input.outputDirectory, { recursive: true })
        await Promise.all([
          writeNew(
            path.join(input.outputDirectory, 'manifest.json'),
            serializeArtifactManifest(acquired.manifest)
          ),
          writeNew(
            path.join(input.outputDirectory, 'evidence.json'),
            stableJson({
              schemaVersion: 1,
              source: input.source,
              artifacts: acquired.manifest.artifacts.map(artifactSummary),
            })
          ),
        ])
        return {
          source: input.source,
          artifacts: acquired.manifest.artifacts.map(artifactSummary),
        }
      },
    }
  )
  if (result.operationalFailure) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
