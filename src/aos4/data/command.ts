import { artifactChecksum, assertArtifactChecksum } from './artifact'
import type { ArtifactCache } from './cache'
import {
  AcquisitionError,
  discardResponseBody,
  getHeader,
  readResponseBody,
  requestWithTimeout,
  type HttpResponse,
  type HttpTransport,
} from './http'
import {
  createArtifactManifest,
  findArtifactEntry,
  upsertArtifactEntry,
  type ArtifactManifest,
  type ArtifactManifestEntry,
} from './manifest'
import { validateAcquisitionUrl, type UrlPolicy } from './urlPolicy'

export interface AcquireArtifactRequest {
  url: string
  adapterVersion: string
  allowedMediaTypes: string[]
  maxBytes: number
  timeoutMs: number
  maxRedirects?: number
  expectedChecksum?: string
  acceptedManifest?: ArtifactManifest
  candidateManifest?: ArtifactManifest
  offline?: boolean
}

export interface AcquisitionDependencies {
  transport: HttpTransport
  cache: ArtifactCache
  now: () => string
  policy: UrlPolicy
}

export interface AcquireArtifactResult {
  bytes: Uint8Array
  entry: ArtifactManifestEntry
  candidateManifest: ArtifactManifest
  changed: boolean
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])

const normalizedMediaType = (response: HttpResponse): string =>
  (getHeader(response.headers, 'content-type') ?? '').split(';')[0].trim().toLowerCase()

const readCached = async (cache: ArtifactCache, entry: ArtifactManifestEntry): Promise<Uint8Array> => {
  const bytes = await cache.get(entry.checksum)
  if (!bytes) {
    throw new AcquisitionError('cache-miss', `Cache is missing artifact ${entry.checksum}`)
  }
  assertArtifactChecksum(bytes, entry.checksum, 'cache-corrupt')
  if (bytes.byteLength !== entry.byteLength) {
    throw new AcquisitionError(
      'cache-corrupt',
      `Cached artifact ${entry.checksum} has an unexpected byte length`
    )
  }
  return bytes
}

const conditionalHeaders = (accepted: ArtifactManifestEntry | undefined): Record<string, string> => ({
  ...(accepted?.etag ? { 'if-none-match': accepted.etag } : {}),
  ...(accepted?.lastModified ? { 'if-modified-since': accepted.lastModified } : {}),
})

const declaredResponseLength = (response: HttpResponse): number | undefined => {
  const contentLength = getHeader(response.headers, 'content-length')
  if (contentLength === undefined) return undefined
  if (!/^\d+$/.test(contentLength)) {
    throw new AcquisitionError('invalid-content-length', `Invalid Content-Length: ${contentLength}`)
  }
  return Number(contentLength)
}

const validateResponseLength = (declaredLength: number | undefined, bytes: Uint8Array): void => {
  if (declaredLength !== undefined && declaredLength !== bytes.byteLength) {
    throw new AcquisitionError(
      'truncated-response',
      `Expected ${declaredLength} response bytes, received ${bytes.byteLength}`
    )
  }
}

export const acquireArtifact = async (
  request: AcquireArtifactRequest,
  dependencies: AcquisitionDependencies
): Promise<AcquireArtifactResult> => {
  const accepted = findArtifactEntry(request.acceptedManifest, request.url)
  if (request.offline) {
    if (!accepted) {
      throw new AcquisitionError('cache-miss', `No accepted artifact exists for ${request.url}`)
    }
    const bytes = await readCached(dependencies.cache, accepted)
    return {
      bytes,
      entry: accepted,
      candidateManifest:
        request.candidateManifest ?? request.acceptedManifest ?? createArtifactManifest([accepted]),
      changed: false,
    }
  }

  const maxRedirects = request.maxRedirects ?? 5
  const redirectChain: string[] = []
  const visited = new Set<string>()
  let currentUrl = request.url

  while (true) {
    const validated = await validateAcquisitionUrl(currentUrl, dependencies.policy)
    if (visited.has(validated.url)) {
      throw new AcquisitionError('redirect-loop', `Redirect loop detected at ${validated.url}`)
    }
    visited.add(validated.url)

    const response = await requestWithTimeout(
      dependencies.transport,
      {
        url: validated.url,
        headers:
          accepted?.finalUrl === validated.url
            ? { 'accept-encoding': 'identity', ...conditionalHeaders(accepted) }
            : { 'accept-encoding': 'identity' },
        approvedAddresses: validated.approvedAddresses,
      },
      request.timeoutMs
    )

    if (REDIRECT_STATUSES.has(response.status)) {
      const location = getHeader(response.headers, 'location')
      if (!location) {
        await discardResponseBody(response)
        throw new AcquisitionError(
          'redirect-without-location',
          `Redirect from ${validated.url} did not include a Location header`
        )
      }
      if (redirectChain.length >= maxRedirects) {
        await discardResponseBody(response)
        throw new AcquisitionError('too-many-redirects', `Request exceeded ${maxRedirects} redirects`)
      }
      await discardResponseBody(response)
      try {
        currentUrl = new URL(location, validated.url).toString()
      } catch (error) {
        throw new AcquisitionError(
          'invalid-url',
          `Redirect from ${validated.url} contained an invalid URL`,
          error
        )
      }
      redirectChain.push(currentUrl)
      continue
    }

    if (response.status === 304) {
      if (!accepted || accepted.finalUrl !== validated.url) {
        await discardResponseBody(response)
        throw new AcquisitionError('http-status', `Received 304 without an accepted artifact`)
      }
      await discardResponseBody(response)
      const bytes = await readCached(dependencies.cache, accepted)
      const entry: ArtifactManifestEntry = {
        ...accepted,
        finalUrl: validated.url,
        redirectChain,
        retrievedAt: dependencies.now(),
        etag: getHeader(response.headers, 'etag') ?? accepted.etag,
        lastModified: getHeader(response.headers, 'last-modified') ?? accepted.lastModified,
      }
      return {
        bytes,
        entry,
        candidateManifest: upsertArtifactEntry(request.candidateManifest ?? request.acceptedManifest, entry),
        changed: false,
      }
    }

    if (response.status < 200 || response.status >= 300) {
      await discardResponseBody(response)
      throw new AcquisitionError(
        'http-status',
        `Request to ${validated.url} returned HTTP ${response.status}`
      )
    }

    const mediaType = normalizedMediaType(response)
    const allowedMediaTypes = request.allowedMediaTypes.map(value => value.toLowerCase())
    if (!allowedMediaTypes.includes(mediaType)) {
      await discardResponseBody(response)
      throw new AcquisitionError(
        'unexpected-media-type',
        `Received ${mediaType || '(missing media type)'} from ${validated.url}`
      )
    }

    const contentEncoding = getHeader(response.headers, 'content-encoding')?.toLowerCase()
    if (contentEncoding && contentEncoding !== 'identity') {
      await discardResponseBody(response)
      throw new AcquisitionError(
        'unexpected-content-encoding',
        `Received unsupported Content-Encoding ${contentEncoding} from ${validated.url}`
      )
    }

    const declaredLength = declaredResponseLength(response)
    if (declaredLength !== undefined && declaredLength > request.maxBytes) {
      await discardResponseBody(response)
      throw new AcquisitionError(
        'response-too-large',
        `Response declared ${declaredLength} bytes, above the ${request.maxBytes}-byte limit`
      )
    }
    const bytes = await readResponseBody(response, request.maxBytes)
    validateResponseLength(declaredLength, bytes)
    const checksum = artifactChecksum(bytes)
    if (request.expectedChecksum) {
      assertArtifactChecksum(bytes, request.expectedChecksum)
    }

    const entry: ArtifactManifestEntry = {
      requestUrl: request.url,
      finalUrl: validated.url,
      redirectChain,
      retrievedAt: dependencies.now(),
      adapterVersion: request.adapterVersion,
      mediaType,
      byteLength: bytes.byteLength,
      checksum,
      ...(getHeader(response.headers, 'etag') ? { etag: getHeader(response.headers, 'etag') } : {}),
      ...(getHeader(response.headers, 'last-modified')
        ? { lastModified: getHeader(response.headers, 'last-modified') }
        : {}),
    }

    await dependencies.cache.put(checksum, bytes)
    return {
      bytes,
      entry,
      candidateManifest: upsertArtifactEntry(request.candidateManifest ?? request.acceptedManifest, entry),
      changed: accepted?.checksum !== checksum,
    }
  }
}
