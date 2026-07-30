import type { AcquireArtifactRequest, AcquireArtifactResult } from './command'
import { createArtifactManifest, type ArtifactManifest, type ArtifactManifestEntry } from './manifest'
import {
  WAHAPEDIA_EXPORT_FILES,
  wahapediaExportRequest,
  type WahapediaExportFileName,
  type WahapediaExportInputs,
} from './wahapedia'

export const GAMES_WORKSHOP_ADAPTER_VERSION = 'games-workshop-pdf/1'
export const WAHAPEDIA_HTML_ADAPTER_VERSION = 'wahapedia-html/1'

export type CandidateAcquisitionSource = 'games-workshop' | 'wahapedia'

export interface CandidateArtifactAcquisitionOptions {
  sources?: CandidateAcquisitionSource[]
  acceptedManifest?: ArtifactManifest
  officialDocumentUrls?: string[]
  wahapediaPageUrls?: string[]
  offline?: boolean
  requestPauseMs?: number
  acquire: (request: AcquireArtifactRequest) => Promise<AcquireArtifactResult>
  wait?: (milliseconds: number) => Promise<void>
}

export interface CandidateArtifactAcquisitionResult {
  manifest: ArtifactManifest
  wahapediaExports: WahapediaExportInputs
  officialDocuments: Array<{
    url: string
    bytes: Uint8Array
    artifact: ArtifactManifestEntry
  }>
  wahapediaPages: Array<{
    url: string
    bytes: Uint8Array
    artifact: ArtifactManifestEntry
  }>
}

const pause = async (milliseconds: number, wait: (milliseconds: number) => Promise<void>): Promise<void> => {
  if (milliseconds > 0) await wait(milliseconds)
}

const uniqueSources = (sources: CandidateAcquisitionSource[] | undefined): CandidateAcquisitionSource[] => {
  const defaults: CandidateAcquisitionSource[] = ['games-workshop', 'wahapedia']
  const result = Array.from(new Set(sources ?? defaults))
  if (result.some(source => !['games-workshop', 'wahapedia'].includes(source))) {
    throw new Error('Candidate acquisition contains an unsupported source')
  }
  return result
}

const acquireWithManifest = async (
  request: AcquireArtifactRequest,
  manifest: ArtifactManifest,
  acquire: CandidateArtifactAcquisitionOptions['acquire']
): Promise<AcquireArtifactResult> => acquire({ ...request, candidateManifest: manifest })

export const acquireCandidateArtifacts = async (
  options: CandidateArtifactAcquisitionOptions
): Promise<CandidateArtifactAcquisitionResult> => {
  const sources = uniqueSources(options.sources)
  const pauseMs = options.requestPauseMs ?? 250
  const wait = options.wait ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)))
  let manifest = createArtifactManifest()
  const wahapediaExports: WahapediaExportInputs = {}
  const officialDocuments: CandidateArtifactAcquisitionResult['officialDocuments'] = []
  const wahapediaPages: CandidateArtifactAcquisitionResult['wahapediaPages'] = []

  if (sources.includes('wahapedia')) {
    for (let index = 0; index < WAHAPEDIA_EXPORT_FILES.length; index += 1) {
      const file = WAHAPEDIA_EXPORT_FILES[index]
      const result = await acquireWithManifest(
        wahapediaExportRequest(file, {
          acceptedManifest: options.acceptedManifest,
          offline: options.offline,
        }),
        manifest,
        options.acquire
      )
      manifest = result.candidateManifest
      wahapediaExports[file as WahapediaExportFileName] = {
        bytes: result.bytes,
        artifact: result.entry,
      }
      if (!options.offline && index < WAHAPEDIA_EXPORT_FILES.length - 1) {
        await pause(pauseMs, wait)
      }
    }
  }

  if (sources.includes('games-workshop')) {
    const urls = Array.from(new Set(options.officialDocumentUrls ?? [])).sort()
    for (const url of urls) {
      const result = await acquireWithManifest(
        {
          url,
          adapterVersion: GAMES_WORKSHOP_ADAPTER_VERSION,
          allowedMediaTypes: ['application/pdf'],
          maxBytes: 64 * 1024 * 1024,
          timeoutMs: 120_000,
          maxRedirects: 5,
          acceptedManifest: options.acceptedManifest,
          offline: options.offline,
        },
        manifest,
        options.acquire
      )
      manifest = result.candidateManifest
      officialDocuments.push({ url, bytes: result.bytes, artifact: result.entry })
      if (!options.offline) await pause(pauseMs, wait)
    }
  }

  if (sources.includes('wahapedia')) {
    const urls = Array.from(new Set(options.wahapediaPageUrls ?? [])).sort()
    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index]
      const result = await acquireWithManifest(
        {
          url,
          adapterVersion: WAHAPEDIA_HTML_ADAPTER_VERSION,
          allowedMediaTypes: ['text/html'],
          maxBytes: 32 * 1024 * 1024,
          timeoutMs: 30_000,
          maxRedirects: 5,
          acceptedManifest: options.acceptedManifest,
          offline: options.offline,
        },
        manifest,
        options.acquire
      )
      manifest = result.candidateManifest
      wahapediaPages.push({ url, bytes: result.bytes, artifact: result.entry })
      if (!options.offline && index < urls.length - 1) await pause(pauseMs, wait)
    }
  }

  return { manifest, wahapediaExports, officialDocuments, wahapediaPages }
}
