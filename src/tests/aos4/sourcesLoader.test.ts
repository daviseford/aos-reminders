// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The memoized sources loader, at module level.
 *
 * `reminderSourceLinks.test.ts` drives it against the real artifact and `reminderSourceMenu.test.tsx`
 * mocks `getSources` outright, so nothing covered what the loader does when the chunk fails to
 * arrive — the branch that clears the memo so the next menu can try again. Handing a settled
 * rejection back forever would leave every source menu permanently unavailable after one offline
 * moment, which is exactly what the retry exists to prevent.
 */

const fixture = vi.hoisted(() => ({
  failNextLoad: false,
  loads: 0,
  runtimeSources: {
    sourceArtifacts: [
      {
        id: 'artifact:sha256:0000000000000000000000000000000000000000000000000000000000000000',
        publisher: 'wahapedia',
        title: 'Fixture artifact',
        url: 'https://example.test/fixture',
      },
    ],
    sourceRecords: [
      {
        id: 'source-record:wahapedia:fixture',
        artifactId: 'artifact:sha256:0000000000000000000000000000000000000000000000000000000000000000',
        locator: { kind: 'section', section: 'fixture' },
        rulesContextIndexes: [0],
      },
    ],
  },
}))

/*
 * The real core artifact is 6 MB and every `vi.resetModules()` would re-parse it, which would
 * dominate this file. The loader reads only `generatedAt` and `rulesContexts` off the projection.
 */
vi.mock('../../aos4/generated/corpus/catalog', () => ({
  AOS4_RUNTIME_PROJECTION: {
    generatedAt: '2026-08-18T00:00:00.000Z',
    rulesContexts: [{ id: 'rules-context:fixture' }],
  },
}))

/*
 * Stands in for the dynamically imported chunk, so a load can be made to fail on demand. The failure
 * is thrown from the accessor rather than from the factory because Vitest evaluates a mock factory
 * once and reuses the result — a factory that threw would stay thrown, and a retry could never be
 * observed. Reading `default` per call reproduces what the loader sees either way: the promise it
 * memoized rejects.
 */
vi.mock('../../aos4/generated/corpus/runtime.sources.json', () => ({
  get default() {
    fixture.loads += 1
    if (fixture.failNextLoad) throw new Error('chunk load failed')
    return fixture.runtimeSources
  },
}))

/** A loader with an empty memo, as a session that has never opened a source menu sees it. */
const freshLoader = async () => {
  vi.resetModules()
  return import('../../aos4/generated/corpus/sources')
}

beforeEach(() => {
  fixture.failNextLoad = false
  fixture.loads = 0
})

describe('the memoized sources loader', () => {
  it('fetches the chunk once and hands every caller the same data', async () => {
    const { loadAos4SourceData } = await freshLoader()

    const first = loadAos4SourceData()
    expect(loadAos4SourceData()).toBe(first)

    const data = await first
    expect(await loadAos4SourceData()).toBe(data)
    expect(data.sourceRecords).toHaveLength(1)
    expect(fixture.loads).toBe(1)
  })

  it('clears the memo when a load fails, so the next open retries and can succeed', async () => {
    fixture.failNextLoad = true
    const { loadAos4SourceData } = await freshLoader()

    await expect(loadAos4SourceData()).rejects.toThrow('chunk load failed')

    fixture.failNextLoad = false
    await expect(loadAos4SourceData()).resolves.toMatchObject({
      sourceRecords: [{ id: 'source-record:wahapedia:fixture' }],
    })
    expect(fixture.loads).toBe(2)
  })

  it('rejects both callers of one failed load without poisoning the attempt after it', async () => {
    fixture.failNextLoad = true
    const { loadAos4SourceData } = await freshLoader()

    // Two menus opened in the same frame share the in-flight promise, so both have to see the
    // failure rather than one of them silently waiting forever.
    const first = loadAos4SourceData()
    const second = loadAos4SourceData()
    expect(second).toBe(first)
    await expect(first).rejects.toThrow('chunk load failed')
    await expect(second).rejects.toThrow('chunk load failed')

    fixture.failNextLoad = false
    const retried = loadAos4SourceData()
    expect(retried).not.toBe(first)
    await expect(retried).resolves.toBeDefined()
    expect(fixture.loads).toBe(2)
  })
})
