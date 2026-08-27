import { request as httpsRequest } from 'node:https'
import { isIP } from 'node:net'

export type AcquisitionErrorCode =
  | 'invalid-url'
  | 'insecure-url'
  | 'url-credentials'
  | 'url-port'
  | 'unconfigured-host'
  | 'unresolved-host'
  | 'private-address'
  | 'timeout'
  | 'network-error'
  | 'http-status'
  | 'redirect-without-location'
  | 'redirect-loop'
  | 'too-many-redirects'
  | 'unexpected-media-type'
  | 'unexpected-content-encoding'
  | 'invalid-content-length'
  | 'truncated-response'
  | 'response-too-large'
  | 'checksum-mismatch'
  | 'cache-miss'
  | 'cache-corrupt'

export class AcquisitionError extends Error {
  constructor(
    readonly code: AcquisitionErrorCode,
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = 'AcquisitionError'
  }
}

export interface HttpRequest {
  url: string
  headers: Record<string, string>
  signal: AbortSignal
  approvedAddresses: string[]
  method?: 'GET' | 'POST'
  body?: Uint8Array
}

export interface HttpResponse {
  status: number
  headers: Record<string, string>
  body: AsyncIterable<Uint8Array>
}

export interface HttpTransport {
  request(request: HttpRequest): Promise<HttpResponse>
}

export type PinnedAddressRequester = (
  request: HttpRequest,
  address: string,
  family: number
) => Promise<HttpResponse>

const httpsRequestToAddress: PinnedAddressRequester = (
  { url, headers, signal, method = 'GET', body },
  address,
  family
) =>
  new Promise((resolve, reject) => {
    const outgoing = httpsRequest(
      url,
      {
        headers,
        signal,
        family,
        method,
        /**
         * The pinned address must reach `connect` on a later tick. `net.Socket` attaches the
         * request's error listeners asynchronously, so a lookup that calls back synchronously
         * lets a failed connect emit `error` on the bare TLS socket and crash the whole process
         * instead of rejecting this promise — the 2026-08-27 Rules Radar run died exactly this
         * way on an unreachable IPv6 address, before it could write its report.
         */
        lookup: (_hostname, _options, callback) => process.nextTick(callback, null, address, family),
      },
      incoming => {
        const responseHeaders = Object.fromEntries(
          Object.entries(incoming.headers).flatMap(([name, value]) => {
            if (value === undefined) return []
            return [[name.toLowerCase(), Array.isArray(value) ? value.join(', ') : value]]
          })
        )
        resolve({
          status: incoming.statusCode ?? 0,
          headers: responseHeaders,
          body: incoming,
        })
      }
    )
    outgoing.on('error', error => {
      reject(new AcquisitionError('network-error', `Request failed for ${url}`, error))
    })
    if (body?.byteLength) outgoing.write(body)
    outgoing.end()
  })

/**
 * Connection-establishment failures worth retrying on the next approved address.
 *
 * A host publishes A and AAAA records but a runner may only route one family — GitHub-hosted
 * runners have no IPv6 — so the first approved address failing says nothing about the rest.
 * Anything else (TLS validation, abort, protocol errors) would fail identically on every address
 * and is thrown as-is.
 */
const CONNECT_FAILOVER_CODES = new Set([
  'EADDRNOTAVAIL',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ETIMEDOUT',
])

const isConnectFailoverError = (error: unknown): boolean =>
  error instanceof AcquisitionError &&
  error.code === 'network-error' &&
  CONNECT_FAILOVER_CODES.has(String((error.cause as { code?: unknown } | undefined)?.code))

export const createPinnedHttpsTransport = (
  requestToAddress: PinnedAddressRequester = httpsRequestToAddress
): HttpTransport => ({
  async request(request) {
    const addresses = request.approvedAddresses.filter(address => isIP(address) !== 0)
    if (!addresses.length) {
      throw new AcquisitionError(
        'network-error',
        `No approved network address was supplied for ${request.url}`
      )
    }

    let lastError: unknown
    for (const address of addresses) {
      try {
        return await requestToAddress(request, address, isIP(address))
      } catch (error) {
        lastError = error
        if (request.signal.aborted || !isConnectFailoverError(error)) throw error
      }
    }
    throw lastError
  },
})

export const getHeader = (headers: Record<string, string>, name: string): string | undefined => {
  const normalizedName = name.toLowerCase()
  const match = Object.entries(headers).find(([headerName]) => headerName.toLowerCase() === normalizedName)
  return match?.[1]
}

export const requestWithTimeout = async (
  transport: HttpTransport,
  request: Omit<HttpRequest, 'signal'>,
  timeoutMs: number
): Promise<HttpResponse> => {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  let timedOut = false

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      timedOut = true
      controller.abort()
      reject(new AcquisitionError('timeout', `Request timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    const response = await Promise.race([
      transport.request({ ...request, signal: controller.signal }),
      timeout,
    ])
    const iterator = response.body[Symbol.asyncIterator]()
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
    }
    const bodyIterator: AsyncIterator<Uint8Array> = {
      async next() {
        try {
          const result = await Promise.race([iterator.next(), timeout])
          if (result.done) clearTimer()
          return result
        } catch (error) {
          clearTimer()
          if (timedOut) {
            void iterator.return?.()
            throw new AcquisitionError('timeout', `Request timed out after ${timeoutMs}ms`, error)
          }
          throw error
        }
      },
      async return() {
        clearTimer()
        return (await iterator.return?.()) ?? { done: true, value: undefined }
      },
    }
    const body: AsyncIterable<Uint8Array> = {
      [Symbol.asyncIterator]: () => bodyIterator,
    }
    return { ...response, body }
  } catch (error) {
    if (timer) clearTimeout(timer)
    throw error
  }
}

export const readResponseBody = async (response: HttpResponse, maxBytes: number): Promise<Uint8Array> => {
  const chunks: Uint8Array[] = []
  let byteLength = 0

  for await (const chunk of response.body) {
    byteLength += chunk.byteLength
    if (byteLength > maxBytes) {
      throw new AcquisitionError('response-too-large', `Response exceeded the ${maxBytes}-byte limit`)
    }
    chunks.push(chunk)
  }

  const bytes = new Uint8Array(byteLength)
  let offset = 0
  chunks.forEach(chunk => {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  })
  return bytes
}

export const discardResponseBody = async (response: HttpResponse): Promise<void> => {
  const iterator = response.body[Symbol.asyncIterator]()
  try {
    await iterator.return?.()
  } catch {
    // The primary acquisition error is more useful than a cleanup failure.
  }
}
