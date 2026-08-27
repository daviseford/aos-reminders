import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  AcquisitionError,
  MemoryArtifactCache,
  acquireArtifact,
  artifactChecksum,
  createArtifactManifest,
  createPinnedHttpsTransport,
  isPrivateAddress,
  serializeArtifactManifest,
  validateAcquisitionUrl,
  type AddressResolver,
  type ArtifactManifestEntry,
  type HttpRequest,
  type HttpResponse,
  type HttpTransport,
} from '../../aos4/data'

const fixture = (name: string) =>
  readFile(path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'http', name)).then(
    bytes => new Uint8Array(bytes)
  )

const chunks = async function* (...values: Uint8Array[]): AsyncIterable<Uint8Array> {
  for (const value of values) yield value
}

const stalledChunks = (): AsyncIterable<Uint8Array> => ({
  [Symbol.asyncIterator]: () => ({
    next: () => new Promise<IteratorResult<Uint8Array>>(() => undefined),
  }),
})

const response = (
  status: number,
  body = new Uint8Array(),
  headers: Record<string, string> = {}
): HttpResponse => ({
  status,
  headers,
  body: chunks(body),
})

class FakeTransport implements HttpTransport {
  readonly requests: HttpRequest[] = []

  constructor(private readonly responses: Array<HttpResponse | Error | 'never'>) {}

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    const next = this.responses.shift()
    if (next === 'never') return new Promise(() => undefined)
    if (next instanceof Error) throw next
    if (!next) throw new Error('No fake response configured')
    return next
  }
}

const publicResolver: AddressResolver = async () => ['203.0.113.10']
const privateResolver: AddressResolver = async () => ['127.0.0.1']
const now = () => '2026-07-27T12:00:00.000Z'

const policy = {
  allowedHosts: ['wahapedia.ru', 'www.warhammer-community.com', 'assets.warhammer-community.com'],
  resolveAddresses: publicResolver,
}

const dependencies = (
  transport: HttpTransport,
  cache = new MemoryArtifactCache(),
  overrides: Partial<Parameters<typeof acquireArtifact>[1]> = {}
): Parameters<typeof acquireArtifact>[1] => ({
  transport,
  cache,
  now,
  policy,
  ...overrides,
})

const request = {
  url: 'https://wahapedia.ru/aos4/Warscrolls.csv',
  adapterVersion: 'wahapedia-export/1',
  allowedMediaTypes: ['text/csv'],
  maxBytes: 1024,
  timeoutMs: 100,
}

describe('AoS 4 source acquisition', () => {
  it('downloads immutable bytes and records a complete candidate manifest entry', async () => {
    const bytes = await fixture('wahapedia-mini.csv')
    const transport = new FakeTransport([
      response(200, bytes, {
        'content-type': 'text/csv; charset=utf-8',
        'content-length': String(bytes.byteLength),
        etag: '"fixture-v1"',
        'last-modified': 'Mon, 27 Jul 2026 10:00:00 GMT',
      }),
    ])

    const result = await acquireArtifact(request, dependencies(transport))

    expect(result.changed).toBe(true)
    expect(result.bytes).toEqual(bytes)
    expect(result.entry).toEqual({
      requestUrl: request.url,
      finalUrl: request.url,
      redirectChain: [],
      retrievedAt: now(),
      adapterVersion: request.adapterVersion,
      mediaType: 'text/csv',
      byteLength: bytes.byteLength,
      checksum: artifactChecksum(bytes),
      etag: '"fixture-v1"',
      lastModified: 'Mon, 27 Jul 2026 10:00:00 GMT',
    })
    expect(result.candidateManifest.artifacts).toEqual([result.entry])
  })

  it('revalidates unchanged content and replays identical bytes from cache', async () => {
    const bytes = await fixture('wahapedia-mini.csv')
    const cache = new MemoryArtifactCache()
    const first = await acquireArtifact(
      request,
      dependencies(
        new FakeTransport([
          response(200, bytes, {
            'content-type': 'text/csv',
            etag: '"fixture-v1"',
          }),
        ]),
        cache
      )
    )
    const acceptedManifest = createArtifactManifest([first.entry])
    const acceptedSnapshot = structuredClone(acceptedManifest)
    const transport = new FakeTransport([response(304)])

    const revalidated = await acquireArtifact(
      { ...request, acceptedManifest },
      dependencies(transport, cache)
    )
    const offline = await acquireArtifact(
      {
        ...request,
        acceptedManifest,
        candidateManifest: createArtifactManifest(),
        offline: true,
      },
      dependencies(new FakeTransport([new Error('network must not be called')]), cache)
    )

    expect(transport.requests[0].headers).toMatchObject({ 'if-none-match': '"fixture-v1"' })
    expect(revalidated.changed).toBe(false)
    expect(revalidated.entry.checksum).toBe(first.entry.checksum)
    expect(revalidated.bytes).toEqual(bytes)
    expect(offline.bytes).toEqual(bytes)
    expect(offline.entry).toEqual(first.entry)
    expect(offline.candidateManifest.artifacts).toEqual([first.entry])
    expect(acceptedManifest).toEqual(acceptedSnapshot)
  })

  it('records changed bytes at the same URL as a new candidate revision', async () => {
    const original = await fixture('wahapedia-mini.csv')
    const changed = new TextEncoder().encode('id|name\n1|Liberators\n2|Prosecutors\n')
    const cache = new MemoryArtifactCache()
    const initial = await acquireArtifact(
      request,
      dependencies(new FakeTransport([response(200, original, { 'content-type': 'text/csv' })]), cache)
    )

    const next = await acquireArtifact(
      {
        ...request,
        acceptedManifest: createArtifactManifest([initial.entry]),
      },
      dependencies(new FakeTransport([response(200, changed, { 'content-type': 'text/csv' })]), cache)
    )

    expect(next.changed).toBe(true)
    expect(next.entry.checksum).not.toBe(initial.entry.checksum)
  })

  it('validates every redirect and retains the redirect chain', async () => {
    const bytes = await fixture('official-mini.pdf')
    const transport = new FakeTransport([
      response(302, undefined, {
        location: 'https://assets.warhammer-community.com/aos4/official-mini.pdf',
      }),
      response(200, bytes, { 'content-type': 'application/pdf' }),
    ])

    const result = await acquireArtifact(
      {
        ...request,
        url: 'https://www.warhammer-community.com/aos4/official-mini.pdf',
        allowedMediaTypes: ['application/pdf'],
      },
      dependencies(transport)
    )

    expect(result.entry.redirectChain).toEqual([
      'https://assets.warhammer-community.com/aos4/official-mini.pdf',
    ])
    expect(result.entry.finalUrl).toBe('https://assets.warhammer-community.com/aos4/official-mini.pdf')
    expect(transport.requests[1].approvedAddresses).toEqual(['203.0.113.10'])
  })

  it('rejects a redirect downgrade before contacting its destination', async () => {
    const transport = new FakeTransport([
      response(302, undefined, {
        location: 'http://wahapedia.ru/aos4/redirected.csv',
      }),
      response(200),
    ])

    await expect(acquireArtifact(request, dependencies(transport))).rejects.toMatchObject({
      code: 'insecure-url',
    })
    expect(transport.requests).toHaveLength(1)
  })

  it.each([
    ['HTTP downgrade', 'http://wahapedia.ru/aos4/file.csv', 'insecure-url'],
    ['unconfigured host', 'https://example.com/aos4/file.csv', 'unconfigured-host'],
  ])('rejects %s', async (_label, url, code) => {
    await expect(
      acquireArtifact({ ...request, url }, dependencies(new FakeTransport([response(200)])))
    ).rejects.toMatchObject({ code })
  })

  it('rejects private destinations before making a request', async () => {
    const transport = new FakeTransport([response(200)])

    await expect(
      acquireArtifact(
        request,
        dependencies(transport, undefined, {
          policy: { ...policy, resolveAddresses: privateResolver },
        })
      )
    ).rejects.toMatchObject({ code: 'private-address' })
    expect(transport.requests).toHaveLength(0)
  })

  it.each([
    '10.0.0.1',
    '127.0.0.1',
    '169.254.1.1',
    '172.16.0.1',
    '192.168.0.1',
    '::1',
    'fd00::1',
    'fe80::1',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
  ])('classifies %s as a forbidden private address', address => {
    expect(isPrivateAddress(address)).toBe(true)
  })

  it.each([
    ['redirect loop', [response(302, undefined, { location: request.url })], 'redirect-loop'],
    ['redirect without a location', [response(302)], 'redirect-without-location'],
    [
      'too many redirects',
      [
        response(302, undefined, { location: 'https://wahapedia.ru/1' }),
        response(302, undefined, { location: 'https://wahapedia.ru/2' }),
      ],
      'too-many-redirects',
    ],
    ['non-success response', [response(503)], 'http-status'],
    [
      'unexpected media type',
      [response(200, new Uint8Array([1]), { 'content-type': 'text/html' })],
      'unexpected-media-type',
    ],
    [
      'unexpected content encoding',
      [
        response(200, new Uint8Array([1]), {
          'content-type': 'text/csv',
          'content-encoding': 'gzip',
        }),
      ],
      'unexpected-content-encoding',
    ],
    [
      'truncated body',
      [
        response(200, new Uint8Array([1, 2]), {
          'content-type': 'text/csv',
          'content-length': '3',
        }),
      ],
      'truncated-response',
    ],
    [
      'invalid content length',
      [
        response(200, new Uint8Array([1]), {
          'content-type': 'text/csv',
          'content-length': 'unknown',
        }),
      ],
      'invalid-content-length',
    ],
    [
      'oversized body',
      [response(200, new Uint8Array([1, 2, 3]), { 'content-type': 'text/csv' })],
      'response-too-large',
    ],
  ])('does not accept a %s', async (_label, responses, code) => {
    await expect(
      acquireArtifact(
        {
          ...request,
          maxRedirects: code === 'too-many-redirects' ? 1 : undefined,
          maxBytes: code === 'response-too-large' ? 2 : request.maxBytes,
        },
        dependencies(new FakeTransport(responses as HttpResponse[]))
      )
    ).rejects.toMatchObject({ code })
  })

  it('rejects timeouts and checksum mismatches without populating the cache', async () => {
    const bytes = await fixture('wahapedia-mini.csv')
    const cache = new MemoryArtifactCache()

    await expect(
      acquireArtifact({ ...request, timeoutMs: 5 }, dependencies(new FakeTransport(['never']), cache))
    ).rejects.toMatchObject({ code: 'timeout' })

    await expect(
      acquireArtifact(
        { ...request, timeoutMs: 5 },
        dependencies(
          new FakeTransport([
            {
              status: 200,
              headers: { 'content-type': 'text/csv' },
              body: stalledChunks(),
            },
          ]),
          cache
        )
      )
    ).rejects.toMatchObject({ code: 'timeout' })

    await expect(
      acquireArtifact(
        { ...request, expectedChecksum: '0'.repeat(64) },
        dependencies(new FakeTransport([response(200, bytes, { 'content-type': 'text/csv' })]), cache)
      )
    ).rejects.toMatchObject({ code: 'checksum-mismatch' })

    expect(cache.size).toBe(0)
  })

  it('detects corrupted cache content during offline replay', async () => {
    const bytes = await fixture('wahapedia-mini.csv')
    const entry: ArtifactManifestEntry = {
      requestUrl: request.url,
      finalUrl: request.url,
      redirectChain: [],
      retrievedAt: now(),
      adapterVersion: request.adapterVersion,
      mediaType: 'text/csv',
      byteLength: bytes.byteLength,
      checksum: artifactChecksum(bytes),
    }
    const cache = new MemoryArtifactCache()
    await cache.put(entry.checksum, new Uint8Array([0]))

    await expect(
      acquireArtifact(
        {
          ...request,
          acceptedManifest: createArtifactManifest([entry]),
          offline: true,
        },
        dependencies(new FakeTransport([]), cache)
      )
    ).rejects.toBeInstanceOf(AcquisitionError)
  })

  it('serializes manifests deterministically regardless of insertion order', () => {
    const base: ArtifactManifestEntry = {
      requestUrl: 'https://wahapedia.ru/b.csv',
      finalUrl: 'https://wahapedia.ru/b.csv',
      redirectChain: [],
      retrievedAt: now(),
      adapterVersion: 'fixture/1',
      mediaType: 'text/csv',
      byteLength: 1,
      checksum: 'b'.repeat(64),
    }
    const other = {
      ...base,
      requestUrl: 'https://wahapedia.ru/a.csv',
      finalUrl: 'https://wahapedia.ru/a.csv',
      checksum: 'a'.repeat(64),
    }

    expect(serializeArtifactManifest(createArtifactManifest([base, other]))).toBe(
      serializeArtifactManifest(createArtifactManifest([other, base]))
    )
  })
})

/**
 * The report behind these: the 2026-08-27 Rules Radar run. DNS handed the runner an IPv6 address
 * first, the runner had no IPv6 route, and the pinned transport both dialed only that first
 * address and crashed the whole process on the failure (the synchronous pinned lookup let the
 * connect error emit on the bare TLS socket before the request's own error listeners existed),
 * so the radar died without writing its report.
 */
describe('pinned HTTPS transport address handling', () => {
  const signal = new AbortController().signal
  const baseRequest = { url: 'https://wahapedia.ru/aos4/Warscrolls.csv', headers: {}, signal }

  const connectError = (code: string) =>
    new AcquisitionError('network-error', 'Request failed', Object.assign(new Error(code), { code }))

  it('orders approved addresses IPv4-first so an unroutable IPv6 cannot occupy the first dial', async () => {
    const validated = await validateAcquisitionUrl('https://wahapedia.ru/aos4/', {
      allowedHosts: ['wahapedia.ru'],
      resolveAddresses: async () => ['2600:9000:28a9:4a00::1', '3.160.10.2', '203.0.113.10'],
    })

    expect(validated.approvedAddresses).toEqual(['203.0.113.10', '3.160.10.2', '2600:9000:28a9:4a00::1'])
  })

  it('fails over to the next approved address on a connection-level failure', async () => {
    const attempts: string[] = []
    const transport = createPinnedHttpsTransport(async (_request, address) => {
      attempts.push(address)
      if (address !== '203.0.113.10') throw connectError('ENETUNREACH')
      return response(200)
    })

    const result = await transport.request({
      ...baseRequest,
      approvedAddresses: ['2600:9000:28a9:4a00::1', '203.0.113.10'],
    })

    expect(result.status).toBe(200)
    expect(attempts).toEqual(['2600:9000:28a9:4a00::1', '203.0.113.10'])
  })

  it('surfaces the final failure when every approved address is unreachable', async () => {
    const transport = createPinnedHttpsTransport(async () => {
      throw connectError('ECONNREFUSED')
    })

    await expect(
      transport.request({ ...baseRequest, approvedAddresses: ['203.0.113.10', '203.0.113.11'] })
    ).rejects.toMatchObject({ code: 'network-error' })
  })

  it('does not retry failures another address could not fix', async () => {
    const attempts: string[] = []
    const transport = createPinnedHttpsTransport(async (_request, address) => {
      attempts.push(address)
      throw connectError('ERR_TLS_CERT_ALTNAME_INVALID')
    })

    await expect(
      transport.request({ ...baseRequest, approvedAddresses: ['203.0.113.10', '203.0.113.11'] })
    ).rejects.toBeInstanceOf(AcquisitionError)
    expect(attempts).toEqual(['203.0.113.10'])
  })

  it('rejects instead of crashing when a real dial cannot connect', async () => {
    const transport = createPinnedHttpsTransport()

    await expect(
      transport.request({
        url: 'https://127.0.0.1:9/unreachable',
        headers: {},
        signal,
        approvedAddresses: ['127.0.0.1'],
      })
    ).rejects.toBeInstanceOf(AcquisitionError)
  })

  /**
   * The crash itself: an unroutable address fails inside the synchronous connect attempt, and
   * with a synchronous pinned lookup that error fired on the bare socket before the request's
   * listeners existed — an uncaught exception, not a rejection. The documentation range
   * 2001:db8::/32 is never assigned, and the abort guard caps the dial on any network that
   * blackholes it instead of refusing it.
   */
  it('rejects instead of crashing when the dialed address is unroutable', async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)
    const transport = createPinnedHttpsTransport()

    await expect(
      transport.request({
        url: 'https://example.invalid/unroutable',
        headers: {},
        signal: controller.signal,
        approvedAddresses: ['2001:db8::1'],
      })
    ).rejects.toBeInstanceOf(AcquisitionError)
    clearTimeout(timer)
  })
})
