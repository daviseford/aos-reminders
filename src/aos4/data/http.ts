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
}

export interface HttpResponse {
  status: number
  headers: Record<string, string>
  body: AsyncIterable<Uint8Array>
}

export interface HttpTransport {
  request(request: HttpRequest): Promise<HttpResponse>
}

export const createPinnedHttpsTransport = (): HttpTransport => ({
  request({ url, headers, signal, approvedAddresses }) {
    return new Promise((resolve, reject) => {
      const address = approvedAddresses[0]
      const family = isIP(address)
      if (!address || !family) {
        reject(new AcquisitionError('network-error', `No approved network address was supplied for ${url}`))
        return
      }

      const outgoing = httpsRequest(
        url,
        {
          headers,
          signal,
          family,
          lookup: (_hostname, _options, callback) => callback(null, address, family),
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
      outgoing.end()
    })
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

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort()
      reject(new AcquisitionError('timeout', `Request timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([transport.request({ ...request, signal: controller.signal }), timeout])
  } finally {
    if (timer) clearTimeout(timer)
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
