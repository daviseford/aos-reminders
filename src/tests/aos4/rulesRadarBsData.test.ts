import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { readRulesRadarConfig, validateRulesRadarConfig } from '../../aos4/radar/config'
import {
  observeBsDataRadar,
  type BsDataFetch,
  type BsDataFetchRequest,
} from '../../aos4/radar/observers/bsData'

const observedAt = '2026-07-29T20:00:00.000Z'
const fixtures = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'radar', 'bsdata')
const fixture = (name: string): string => readFileSync(path.join(fixtures, name), 'utf8')
const bytes = (value: string): Uint8Array => new TextEncoder().encode(value)
const repoConfig = readRulesRadarConfig('data/aos4/radar/config.json', process.cwd())
// The repository disables the lane (#1757); the dormant adapter stays covered with an explicitly
// re-enabled copy, which is what a reviewed re-enablement would produce.
const config = {
  ...repoConfig,
  bsData: {
    repository: repoConfig.bsData.repository,
    branch: repoConfig.bsData.branch,
    baselineSha: repoConfig.bsData.baselineSha,
    baselineReviewedAt: repoConfig.bsData.baselineReviewedAt,
    status: 'active' as const,
  },
}
const rawConfig = (): { bsData: Record<string, unknown> } & Record<string, unknown> =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'data', 'aos4', 'radar', 'config.json'), 'utf8'))

describe('AoS 4 Rules Radar BSData lane after the takedown (#1757)', () => {
  it('keeps the lane disabled by a reviewed, dated decision', () => {
    expect(repoConfig.bsData).toMatchObject({
      status: 'disabled',
      disabledReason: expect.stringMatching(/DMCA/),
      disabledAt: '2026-11-17T00:00:00.000Z',
    })
  })

  it('makes no request and raises nothing while disabled', async () => {
    const requests: BsDataFetchRequest[] = []
    const result = await observeBsDataRadar(
      { config: repoConfig },
      {
        now: () => observedAt,
        fetch: responseFetch(requests, { head: '{}', compare: '{}' }, { headStatus: 403 }),
      }
    )
    expect(requests).toEqual([])
    expect(result.requestCount).toBe(0)
    expect(result.lane.events).toEqual([])
    expect(result.observation).toBeUndefined()
  })

  it('rejects a disabled lane without its reason and an unknown status', () => {
    const options = { rootPath: process.cwd() }
    const disabledWithout = (field: string) => {
      const value = rawConfig()
      delete value.bsData[field]
      return value
    }
    expect(() => validateRulesRadarConfig(disabledWithout('disabledReason'), options)).toThrow(
      /disabledReason/
    )
    expect(() => validateRulesRadarConfig(disabledWithout('disabledAt'), options)).toThrow(/disabledAt/)
    const unknown = rawConfig()
    unknown.bsData.status = 'paused'
    expect(() => validateRulesRadarConfig(unknown, options)).toThrow(/bsData.status/)
    const activeWithReason = rawConfig()
    activeWithReason.bsData.status = 'active'
    expect(() => validateRulesRadarConfig(activeWithReason, options)).toThrow(/only valid on a disabled lane/)
  })
})

describe('AoS 4 Rules Radar BSData observation', () => {
  it('stops after the branch lookup when the reviewed head is unchanged', async () => {
    const requests: BsDataFetchRequest[] = []
    const result = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch(requests, {
          head: JSON.stringify({ sha: config.bsData.baselineSha }),
          compare: fixture('compare-docs.json'),
        }),
      }
    )

    expect(requests).toHaveLength(1)
    expect(result.lane.events).toEqual([])
    expect(result.observation?.comparisonStatus).toBe('identical')
  })

  it('ignores documentation and workflow drift', async () => {
    const result = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], {
          head: fixture('head.json'),
          compare: fixture('compare-docs.json'),
        }),
      }
    )

    expect(result.lane.events).toEqual([])
    expect(result.observation?.changedPaths).toEqual([
      '.github/workflows/test.yml',
      'README.md',
      'images/logo.png',
    ])
  })

  it('emits sorted catalog paths and excludes non-data paths', async () => {
    const result = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], {
          head: fixture('head.json'),
          compare: fixture('compare-data.json'),
        }),
      }
    )

    expect(result.lane.events).toHaveLength(1)
    expect(result.lane.events[0]).toMatchObject({
      class: 'material',
      authority: 'community',
      changeKind: 'community-catalog-changed',
      evidence: {
        changedPaths: ['Age of Sigmar 4.0.gst', 'Stormcast Eternals.cat'],
      },
    })
    expect(JSON.stringify(result)).not.toContain('"content"')
  })

  it('turns diverged, truncated, rate-limited, and malformed comparisons into health events', async () => {
    const diverged = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], {
          head: fixture('head.json'),
          compare: fixture('compare-diverged.json'),
        }),
      }
    )
    expect(diverged.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'comparison-diverged',
    })

    const truncatedPayload = JSON.parse(fixture('compare-data.json'))
    truncatedPayload.total_commits = 3
    const truncated = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], {
          head: fixture('head.json'),
          compare: JSON.stringify(truncatedPayload),
        }),
      }
    )
    expect(truncated.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'comparison-truncated',
    })

    const rateLimited = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], { head: fixture('head.json'), compare: '{}' }, { compareStatus: 403 }),
      }
    )
    expect(rateLimited.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'rate-limited',
    })

    const malformed = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch([], { head: '{"sha":42}', compare: '{}' }),
      }
    )
    expect(malformed.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-contract-changed',
    })
  })

  it('uses bounded unauthenticated API requests and rejects redirected hosts', async () => {
    const requests: BsDataFetchRequest[] = []
    await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: responseFetch(requests, {
          head: JSON.stringify({ sha: config.bsData.baselineSha }),
          compare: '{}',
        }),
      }
    )
    expect(requests[0].headers).toMatchObject({
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
    })
    expect(Object.keys(requests[0].headers).map(value => value.toLowerCase())).not.toContain('authorization')

    const redirected = await observeBsDataRadar(
      { config },
      {
        now: () => observedAt,
        fetch: async request => ({
          status: 200,
          finalUrl: request.url.replace('api.github.com', 'example.com'),
          headers: {},
          bytes: bytes(fixture('head.json')),
        }),
      }
    )
    expect(redirected.lane.events[0]).toMatchObject({
      class: 'operational',
      changeKind: 'source-contract-changed',
    })
  })
})

const responseFetch =
  (
    requests: BsDataFetchRequest[],
    bodies: { head: string; compare: string },
    statuses: { headStatus?: number; compareStatus?: number } = {}
  ): BsDataFetch =>
  async request => {
    requests.push(request)
    const compare = request.url.includes('/compare/')
    return {
      status: compare ? (statuses.compareStatus ?? 200) : (statuses.headStatus ?? 200),
      finalUrl: request.url,
      headers: {},
      bytes: bytes(compare ? bodies.compare : bodies.head),
    }
  }
