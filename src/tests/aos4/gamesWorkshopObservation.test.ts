import { describe, expect, it } from 'vitest'
import type { GamesWorkshopDownload } from '../../aos4/data/gamesWorkshop'
import {
  createGamesWorkshopSourceObservation,
  type GamesWorkshopDiscoverySnapshot,
} from '../../aos4/review/gamesWorkshopObservation'

const download = (title: string, url: string): GamesWorkshopDownload => ({
  externalId: title.toLowerCase().replace(/\s+/g, '-'),
  title,
  url,
  categories: ['rules'],
  gameSystems: ['warhammer-age-of-sigmar'],
  topics: ['downloads'],
  discoveryMethod: 'private-api',
})

const snapshot = (downloads: GamesWorkshopDownload[]): GamesWorkshopDiscoverySnapshot => ({
  schemaVersion: 1,
  retrievedAt: '2026-07-28T18:00:00.000Z',
  downloads,
  diagnostics: [],
})

describe('Games Workshop independent source observation', () => {
  it('treats every unclassified current download as material', () => {
    const rules = download('Current rules', 'https://assets.warhammer-community.com/current-rules.pdf')
    const result = createGamesWorkshopSourceObservation(snapshot([rules]))

    expect(result.independentFromAcceptedManifest).toBe(true)
    expect(result.entries).toEqual([
      expect.objectContaining({
        title: 'Current rules',
        scope: 'material',
        availability: 'accessible',
      }),
    ])
  })

  it('requires an explicit rationale before classifying an observed source as non-material', () => {
    const backdrop = download('Backdrop', 'https://assets.warhammer-community.com/backdrop.pdf')
    const result = createGamesWorkshopSourceObservation(snapshot([backdrop]), {
      schemaVersion: 1,
      explicitlyNonMaterial: [
        {
          url: backdrop.url,
          disposition: 'Printable scenery backdrop contains no rules or characteristics.',
        },
      ],
    })

    expect(result.entries).toEqual([
      expect.objectContaining({
        scope: 'explicit-non-material',
        disposition: 'Printable scenery backdrop contains no rules or characteristics.',
      }),
    ])
  })

  it('rejects stale classifications, discovery errors, and untrusted URLs', () => {
    const rules = download('Current rules', 'https://assets.warhammer-community.com/current-rules.pdf')
    expect(() =>
      createGamesWorkshopSourceObservation(snapshot([rules]), {
        schemaVersion: 1,
        explicitlyNonMaterial: [
          {
            url: 'https://assets.warhammer-community.com/removed.pdf',
            disposition: 'No longer observed.',
          },
        ],
      })
    ).toThrow(/stale or unobserved/)

    expect(() =>
      createGamesWorkshopSourceObservation({
        ...snapshot([rules]),
        diagnostics: [
          {
            code: 'private-api-unavailable',
            severity: 'error',
            message: 'Discovery failed',
          },
        ],
      })
    ).toThrow(/error diagnostic/)

    expect(() =>
      createGamesWorkshopSourceObservation(snapshot([download('Bad host', 'https://example.com/rules.pdf')]))
    ).toThrow(/untrusted asset URL/)
  })
})
