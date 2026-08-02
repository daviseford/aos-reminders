// @vitest-environment node

import { readFile } from 'node:fs/promises'
import {
  AwsS3ArtifactStore,
  MemoryArtifactCache,
  RestoringArtifactCache,
  artifactChecksum,
  createArtifactManifest,
  pullArtifactManifest,
  parseArtifactCacheArguments,
  pushArtifactManifest,
  type ArtifactStore,
  type ArtifactStoreMetadata,
  type AwsCliRunner,
} from '../../aos4/data'

const bytes = (value: string) => new TextEncoder().encode(value)

const manifestFor = (...values: Uint8Array[]) =>
  createArtifactManifest(
    values.map((value, index) => ({
      requestUrl: `https://example.com/${index}`,
      finalUrl: `https://example.com/${index}`,
      redirectChain: [],
      retrievedAt: '2026-08-02T00:00:00.000Z',
      adapterVersion: 'fixture/1',
      mediaType: 'application/octet-stream',
      byteLength: value.byteLength,
      checksum: artifactChecksum(value),
    }))
  )

class FakeArtifactStore implements ArtifactStore {
  readonly reads: string[] = []
  readonly creates: string[] = []
  readonly values = new Map<string, Uint8Array>()
  readonly metadata = new Map<string, ArtifactStoreMetadata>()
  raceOnCreate = false

  seed(value: Uint8Array): void {
    const checksum = artifactChecksum(value)
    this.values.set(checksum, value)
    this.metadata.set(checksum, { checksum, byteLength: value.byteLength })
  }

  async inspect(checksum: string): Promise<ArtifactStoreMetadata | undefined> {
    return this.metadata.get(checksum)
  }

  async read(checksum: string): Promise<Uint8Array | undefined> {
    this.reads.push(checksum)
    return this.values.get(checksum)?.slice()
  }

  async create(checksum: string, value: Uint8Array): Promise<'created' | 'exists'> {
    this.creates.push(checksum)
    if (this.raceOnCreate) {
      this.raceOnCreate = false
      this.seed(value)
      return 'exists'
    }
    if (this.values.has(checksum)) return 'exists'
    this.seed(value)
    return 'created'
  }
}

describe('AoS 4 private artifact store', () => {
  it('pulls missing manifest blobs once and reuses checksum-valid local bytes', async () => {
    const value = bytes('accepted bytes')
    const manifest = manifestFor(value, value)
    const cache = new MemoryArtifactCache()
    const store = new FakeArtifactStore()
    store.seed(value)

    const first = await pullArtifactManifest(manifest, cache, store, 2)
    const second = await pullArtifactManifest(manifest, cache, store, 2)

    expect(first).toEqual({ total: 1, transferred: 1, reused: 0, missing: 0 })
    expect(second).toEqual({ total: 1, transferred: 0, reused: 1, missing: 0 })
    expect(store.reads).toEqual([artifactChecksum(value)])
    expect(await cache.get(artifactChecksum(value))).toEqual(value)
  })

  it('restores a missing cache read once and then serves it locally', async () => {
    const value = bytes('restored')
    const checksum = artifactChecksum(value)
    const local = new MemoryArtifactCache()
    const store = new FakeArtifactStore()
    store.seed(value)
    const cache = new RestoringArtifactCache(local, store)

    await expect(cache.get(checksum)).resolves.toEqual(value)
    await expect(cache.get(checksum)).resolves.toEqual(value)

    expect(store.reads).toEqual([checksum])
    expect(await local.get(checksum)).toEqual(value)
  })

  it('fails a restoring cache read when the remote blob is corrupt', async () => {
    const expected = bytes('expected')
    const corrupt = bytes('corrupt!')
    const checksum = artifactChecksum(expected)
    const local = new MemoryArtifactCache()
    const store = new FakeArtifactStore()
    store.metadata.set(checksum, { checksum, byteLength: expected.byteLength })
    store.values.set(checksum, corrupt)

    await expect(new RestoringArtifactCache(local, store).get(checksum)).rejects.toThrow(/remote artifact/i)
    expect(await local.get(checksum)).toBeUndefined()
  })

  it('fails closed on remote corruption without publishing it locally', async () => {
    const expected = bytes('expected')
    const corrupt = bytes('corrupt!')
    const manifest = manifestFor(expected)
    const cache = new MemoryArtifactCache()
    const store = new FakeArtifactStore()
    const checksum = artifactChecksum(expected)
    store.values.set(checksum, corrupt)
    store.metadata.set(checksum, { checksum, byteLength: corrupt.byteLength })

    await expect(pullArtifactManifest(manifest, cache, store)).rejects.toThrow(/remote artifact/i)
    expect(await cache.get(checksum)).toBeUndefined()
  })

  it('validates every local blob before pushing and accepts a validated create race', async () => {
    const first = bytes('first')
    const second = bytes('second')
    const manifest = manifestFor(first, second)
    const cache = new MemoryArtifactCache()
    const store = new FakeArtifactStore()
    await cache.put(artifactChecksum(first), first)

    await expect(pushArtifactManifest(manifest, cache, store)).rejects.toThrow(/local artifact/i)
    expect(store.creates).toEqual([])

    await cache.put(artifactChecksum(second), second)
    store.raceOnCreate = true
    const result = await pushArtifactManifest(manifest, cache, store, 2)

    expect(result).toEqual({ total: 2, transferred: 1, reused: 1, missing: 0 })
    expect(store.values.get(artifactChecksum(first))).toEqual(first)
    expect(store.values.get(artifactChecksum(second))).toEqual(second)
  })

  it('passes validated S3 configuration as argv and supplies full-object SHA-256', async () => {
    const calls: string[][] = []
    const runner: AwsCliRunner = async arguments_ => {
      calls.push(arguments_)
      if (arguments_[1] === 'head-object') {
        return {
          exitCode: 0,
          stdout: JSON.stringify({
            ContentLength: 7,
            ChecksumSHA256: 'I59Z7VXnN8dxR89VrQwbAwttfudIp0JpUvm4UtWpNeU=',
          }),
          stderr: '',
        }
      }
      const bodyPath = arguments_[arguments_.indexOf('--body') + 1]
      expect(new Uint8Array(await readFile(bodyPath))).toEqual(bytes('payload'))
      return { exitCode: 0, stdout: '{}', stderr: '' }
    }
    const store = new AwsS3ArtifactStore(
      {
        bucket: 'aos-reminders-corpus-cache',
        prefix: 'snapshots',
        expectedOwner: '123456789012',
        profile: 'corpus-operator',
        region: 'us-east-1',
      },
      runner
    )
    const checksum = artifactChecksum(bytes('payload'))

    await expect(store.inspect(checksum)).resolves.toEqual({ checksum, byteLength: 7 })
    await expect(store.create(checksum, bytes('payload'))).resolves.toBe('created')

    expect(calls[0]).toEqual([
      's3api',
      'head-object',
      '--bucket',
      'aos-reminders-corpus-cache',
      '--key',
      `snapshots/blobs/${checksum}`,
      '--checksum-mode',
      'ENABLED',
      '--expected-bucket-owner',
      '123456789012',
      '--profile',
      'corpus-operator',
      '--region',
      'us-east-1',
      '--output',
      'json',
    ])
    expect(calls[1]).toContain('--if-none-match')
    expect(calls[1]).toContain('--checksum-sha256')
    expect(calls[1]).toContain('I59Z7VXnN8dxR89VrQwbAwttfudIp0JpUvm4UtWpNeU=')
    expect(calls[1]).toContain('--expected-bucket-owner')
  })

  it.each([
    { bucket: '-looks-like-an-option', prefix: '', expectedOwner: '123456789012' },
    { bucket: 'valid-bucket', prefix: '../escape', expectedOwner: '123456789012' },
    { bucket: 'valid-bucket', prefix: '', expectedOwner: 'owner\nvalue' },
  ])('rejects unsafe store configuration %#', configuration => {
    expect(
      () => new AwsS3ArtifactStore(configuration, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
    ).toThrow(/invalid/i)
  })

  it('parses cache commands with environment defaults and explicit overrides', () => {
    expect(
      parseArtifactCacheArguments(
        ['pull', '--manifest', 'candidate.json', '--jobs', '3', '--region', 'us-west-2'],
        {
          AOS4_ARTIFACT_STORE_BUCKET: 'private-cache',
          AOS4_ARTIFACT_STORE_EXPECTED_OWNER: '123456789012',
          AOS4_ARTIFACT_STORE_PREFIX: 'corpus',
          AWS_PROFILE: 'operator',
          AWS_REGION: 'us-east-1',
        }
      )
    ).toEqual({
      operation: 'pull',
      manifestPath: 'candidate.json',
      cacheDirectory: '.cache/aos4/artifacts',
      concurrency: 3,
      store: {
        bucket: 'private-cache',
        expectedOwner: '123456789012',
        prefix: 'corpus',
        profile: 'operator',
        region: 'us-west-2',
      },
    })
  })

  it.each([
    { arguments_: [] },
    { arguments_: ['restore'] },
    { arguments_: ['pull', '--jobs', '0'] },
    { arguments_: ['push', '--unknown'] },
  ])('rejects invalid cache command arguments %#', ({ arguments_ }) => {
    expect(() =>
      parseArtifactCacheArguments(arguments_, {
        AOS4_ARTIFACT_STORE_BUCKET: 'private-cache',
        AOS4_ARTIFACT_STORE_EXPECTED_OWNER: '123456789012',
      })
    ).toThrow()
  })
})
