import { describe, expect, it } from 'vitest'
import type { ArtifactManifest } from '../../aos4/data'
import {
  compareBsDataObservation,
  compareGamesWorkshopObservation,
  compareWahapediaObservation,
  createRadarLane,
  createRadarReport,
  mergeRadarLanes,
  readRulesRadarConfig,
  validateRadarEvent,
  validateRulesRadarConfig,
  type RadarLane,
  type SourceObservationClassifications,
} from '../../aos4/radar'
import baselineFixture from '../fixtures/aos4/radar/baseline.json'

const observedAt = '2026-07-29T20:00:00.000Z'
const checksum = (character: string): string => character.repeat(64)
const baseline = baselineFixture as {
  manifest: ArtifactManifest
  classifications: SourceObservationClassifications
}

describe('AoS 4 Rules Radar comparison', () => {
  it('produces deterministic empty official and Wahapedia lanes across input ordering', () => {
    const officialEntries = [
      {
        locator: 'https://assets.warhammer-community.com/printable-backdrop.pdf',
        title: 'Printable backdrop',
      },
      {
        locator: 'https://assets.warhammer-community.com/current-rules.pdf',
        title: 'Current rules',
      },
    ]
    const wahapediaEntries = [
      {
        kind: 'rules-page' as const,
        locator: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
        title: 'The Core Rules',
        fingerprint: checksum('b'),
      },
    ]

    const first = createRadarReport([
      compareGamesWorkshopObservation({
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
        observation: {
          schemaVersion: 1,
          source: 'games-workshop',
          observedAt,
          entries: officialEntries,
        },
      }),
      compareWahapediaObservation({
        acceptedManifest: baseline.manifest,
        observation: {
          schemaVersion: 1,
          source: 'wahapedia',
          scope: 'full',
          observedAt,
          entries: wahapediaEntries,
        },
      }),
    ])
    const second = createRadarReport([
      compareWahapediaObservation({
        acceptedManifest: baseline.manifest,
        observation: {
          schemaVersion: 1,
          source: 'wahapedia',
          scope: 'full',
          observedAt: '2026-07-29T21:00:00.000Z',
          entries: [...wahapediaEntries].reverse(),
        },
      }),
      compareGamesWorkshopObservation({
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
        observation: {
          schemaVersion: 1,
          source: 'games-workshop',
          observedAt: '2026-07-29T21:00:00.000Z',
          workflowUrl: 'https://github.com/daviseford/aos-reminders/actions/runs/1',
          entries: [...officialEntries].reverse(),
        },
      }),
    ])

    expect(first.events).toEqual([])
    expect(first.aggregateFingerprint).toBe(second.aggregateFingerprint)
    expect(first.lanes.map(lane => lane.fingerprint)).toEqual(second.lanes.map(lane => lane.fingerprint))
  })

  it('classifies new and removed official publications without flagging reviewed non-material URLs', () => {
    const lane = compareGamesWorkshopObservation({
      acceptedManifest: baseline.manifest,
      classifications: baseline.classifications,
      observation: {
        schemaVersion: 1,
        source: 'games-workshop',
        observedAt,
        entries: [
          {
            locator: 'https://assets.warhammer-community.com/new-battle-profiles.pdf',
            title: 'Battle Profiles 2026-27',
          },
          {
            locator: 'https://assets.warhammer-community.com/printable-backdrop.pdf',
            title: 'Printable backdrop',
          },
        ],
      },
    })

    expect(lane.events.map(event => event.changeKind)).toEqual(['new-publication', 'removed-publication'])
    expect(lane.events.map(event => event.locator)).not.toContain(
      'https://assets.warhammer-community.com/printable-backdrop.pdf'
    )
  })

  it('treats Wahapedia directory URLs with and without trailing slashes as the same source', () => {
    const acceptedManifest: ArtifactManifest = {
      schemaVersion: 1,
      artifacts: [
        {
          requestUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/',
          finalUrl: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/',
          redirectChain: [],
          retrievedAt: observedAt,
          adapterVersion: 'wahapedia-html/1',
          mediaType: 'text/html',
          byteLength: 1,
          checksum: checksum('b'),
        },
      ],
    }
    const lane = compareWahapediaObservation({
      acceptedManifest,
      observation: {
        schemaVersion: 1,
        source: 'wahapedia',
        scope: 'sentinel',
        observedAt,
        entries: [
          {
            kind: 'faction',
            locator: 'https://wahapedia.ru/aos4/factions/stormcast-eternals',
            title: 'Stormcast Eternals',
            fingerprint: checksum('c'),
          },
        ],
      },
    })

    expect(lane.events).toEqual([])
  })

  it('classifies only BSData catalog paths as community material drift', () => {
    const lane = compareBsDataObservation({
      schemaVersion: 1,
      source: 'bsdata',
      observedAt,
      repository: 'BSData/age-of-sigmar-4th',
      baselineSha: checksum('c'),
      headSha: checksum('d'),
      comparisonStatus: 'ahead',
      changedPaths: [
        '.github/workflows/test.yml',
        'Age of Sigmar 4.0.gst',
        'README.md',
        'Stormcast Eternals.cat',
      ],
    })

    expect(lane.events).toHaveLength(1)
    expect(lane.events[0]).toMatchObject({
      authority: 'community',
      changeKind: 'community-catalog-changed',
      evidence: {
        changedPaths: ['Age of Sigmar 4.0.gst', 'Stormcast Eternals.cat'],
      },
    })
  })

  it('excludes timestamps and workflow URLs from fingerprints', () => {
    const input = {
      schemaVersion: 1 as const,
      source: 'bsdata' as const,
      repository: 'BSData/age-of-sigmar-4th',
      baselineSha: checksum('c'),
      headSha: checksum('d'),
      comparisonStatus: 'ahead' as const,
      changedPaths: ['Stormcast Eternals.cat'],
    }
    const first = compareBsDataObservation({ ...input, observedAt })
    const second = compareBsDataObservation({
      ...input,
      observedAt: '2026-07-30T20:00:00.000Z',
      workflowUrl: 'https://github.com/daviseford/aos-reminders/actions/runs/2',
    })

    expect(first.fingerprint).toBe(second.fingerprint)
  })

  it('excludes presentation evidence from semantic event fingerprints', () => {
    const observation = {
      schemaVersion: 1 as const,
      source: 'games-workshop' as const,
      observedAt,
      entries: [
        {
          locator: 'https://assets.warhammer-community.com/new-rules.pdf',
          title: 'Original display title',
        },
      ],
    }
    const first = compareGamesWorkshopObservation({
      acceptedManifest: baseline.manifest,
      classifications: baseline.classifications,
      observation,
    })
    const second = compareGamesWorkshopObservation({
      acceptedManifest: baseline.manifest,
      classifications: baseline.classifications,
      observation: {
        ...observation,
        entries: [{ ...observation.entries[0], title: 'Updated display title' }],
      },
    })

    expect(first.fingerprint).toBe(second.fingerprint)
  })

  it('preserves unobserved source lanes when replacing an observed lane', () => {
    const existing = createRadarReport([
      lane('games-workshop', 'official'),
      lane('wahapedia', 'secondary'),
      lane('bsdata', 'community'),
    ])
    const replacement = lane('games-workshop', 'official', [])
    const merged = mergeRadarLanes(existing.lanes, [replacement])

    expect(merged.map(value => value.source)).toEqual(['games-workshop', 'wahapedia', 'bsdata'])
    expect(merged.find(value => value.source === 'games-workshop')?.events).toEqual([])
    expect(merged.find(value => value.source === 'wahapedia')?.fingerprint).toBe(
      existing.lanes.find(value => value.source === 'wahapedia')?.fingerprint
    )
  })

  it('rejects duplicate locators, invalid checksums, and unknown authorities', () => {
    expect(() =>
      compareGamesWorkshopObservation({
        acceptedManifest: baseline.manifest,
        classifications: baseline.classifications,
        observation: {
          schemaVersion: 1,
          source: 'games-workshop',
          observedAt,
          entries: [
            {
              locator: 'https://assets.warhammer-community.com/current-rules.pdf',
              title: 'First',
            },
            {
              locator: 'https://assets.warhammer-community.com/current-rules.pdf',
              title: 'Duplicate',
            },
          ],
        },
      })
    ).toThrow(/duplicate locator/i)

    expect(() =>
      compareWahapediaObservation({
        acceptedManifest: baseline.manifest,
        observation: {
          schemaVersion: 1,
          source: 'wahapedia',
          scope: 'full',
          observedAt,
          entries: [
            {
              kind: 'export',
              locator: 'https://wahapedia.ru/aos4/Last_update.csv',
              title: 'Last update',
              fingerprint: 'invalid',
            },
          ],
        },
      })
    ).toThrow(/fingerprint/i)

    expect(() =>
      validateRadarEvent({
        class: 'material',
        source: 'games-workshop',
        publisher: 'games-workshop',
        authority: 'unknown' as 'official',
        changeKind: 'new-publication',
        locator: 'https://assets.warhammer-community.com/current-rules.pdf',
        baselineFingerprint: null,
        observedFingerprint: checksum('a'),
        observedAt,
        evidence: {},
      })
    ).toThrow(/authority/i)
  })

  it('rejects event class mismatches and tampered lane envelopes', () => {
    const valid = lane('games-workshop', 'official')
    expect(() =>
      validateRadarEvent({
        ...valid.events[0],
        class: 'operational',
      })
    ).toThrow(/does not match/i)

    expect(() => createRadarReport([{ ...valid, authority: 'secondary' }])).toThrow(/authority/i)
    expect(() => createRadarReport([{ ...valid, fingerprint: checksum('f') }])).toThrow(
      /fingerprint does not match/i
    )
    expect(() => createRadarReport([{ ...valid, schemaVersion: 2 as 1 }])).toThrow(/schema/i)
  })

  it('loads the reviewed config and rejects stale repository paths', () => {
    expect(readRulesRadarConfig('data/aos4/radar/config.json', process.cwd()).bsData.baselineSha).toBe(
      '0d3eb56fe21d7893d6865143324509a4fede32c3'
    )

    const config = JSON.parse(
      JSON.stringify(readRulesRadarConfig('data/aos4/radar/config.json', process.cwd()))
    )
    config.acceptedManifestPath = 'data/aos4/manifests/missing.json'
    expect(() => validateRulesRadarConfig(config, { rootPath: process.cwd() })).toThrow(/stale or missing/)
  })
})

const lane = (
  source: RadarLane['source'],
  authority: RadarLane['authority'],
  events = [
    {
      class: 'material' as const,
      source,
      publisher: source,
      authority,
      changeKind:
        source === 'games-workshop'
          ? ('new-publication' as const)
          : source === 'wahapedia'
            ? ('new-rules-page' as const)
            : ('community-catalog-changed' as const),
      locator: `https://example.com/${source}`,
      baselineFingerprint: null,
      observedFingerprint: checksum(source === 'bsdata' ? 'd' : 'e'),
      observedAt,
      evidence: {},
    },
  ]
): RadarLane => createRadarLane(source, observedAt, events)
