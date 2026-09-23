import { describe, expect, it } from 'vitest'
import type { ArtifactManifest, ArtifactManifestEntry } from '../../aos4/data'
import {
  createSourceInventory,
  type IndependentSourceObservation,
  type SourceObservationEntry,
} from '../../aos4/review/sourceInventory'

const checksum = (character: string): string => character.repeat(64)

const artifact = (
  value: Partial<ArtifactManifestEntry> & Pick<ArtifactManifestEntry, 'requestUrl' | 'checksum'>
): ArtifactManifestEntry => ({
  requestUrl: value.requestUrl,
  finalUrl: value.finalUrl ?? value.requestUrl,
  redirectChain: value.redirectChain ?? [],
  retrievedAt: value.retrievedAt ?? '2026-07-28T18:00:00.000Z',
  adapterVersion: value.adapterVersion ?? 'games-workshop-pdf/1',
  mediaType: value.mediaType ?? 'application/pdf',
  byteLength: value.byteLength ?? 100,
  checksum: value.checksum,
})

const manifest = (...artifacts: ArtifactManifestEntry[]): ArtifactManifest => ({
  schemaVersion: 1,
  artifacts,
})

const observed = (
  entries: SourceObservationEntry[],
  overrides: Partial<IndependentSourceObservation> = {}
): IndependentSourceObservation => ({
  schemaVersion: 1,
  observedAt: '2026-07-28T18:05:00.000Z',
  producedBy: 'independent-fixture-discovery/v1',
  independentFromAcceptedManifest: true,
  entries,
  ...overrides,
})

const entry = (url: string, overrides: Partial<SourceObservationEntry> = {}): SourceObservationEntry => ({
  publisher: 'games-workshop',
  url,
  title: 'Observed rules',
  scope: 'material',
  availability: 'accessible',
  ...overrides,
})

describe('AoS 4 independent source inventory', () => {
  it('matches accepted evidence and retains explicit non-material dispositions', () => {
    const acceptedUrl = 'https://assets.warhammer-community.com/current-rules.pdf'
    const inventory = createSourceInventory({
      revision: 'aos4-corpus-test',
      acceptedManifest: manifest(artifact({ requestUrl: acceptedUrl, checksum: checksum('a') })),
      observations: [
        observed([
          entry(acceptedUrl),
          entry('https://assets.warhammer-community.com/backdrop.pdf', {
            title: 'Backdrop',
            scope: 'explicit-non-material',
            disposition: 'Printable scenery backdrop contains no game rules or characteristics.',
          }),
        ]),
      ],
    })

    expect(inventory.complete).toBe(true)
    expect(inventory.independentFromAcceptedManifest).toBe(true)
    expect(inventory.entries).toEqual([
      expect.objectContaining({
        url: 'https://assets.warhammer-community.com/backdrop.pdf',
        status: 'explicit-non-material',
      }),
      expect.objectContaining({
        url: acceptedUrl,
        status: 'matched',
        acceptedArtifactChecksum: checksum('a'),
      }),
    ])
  })

  it('fails closed for missing material evidence and accepted artifacts absent from discovery', () => {
    const inventory = createSourceInventory({
      revision: 'aos4-corpus-test',
      acceptedManifest: manifest(
        artifact({
          requestUrl: 'https://wahapedia.ru/aos4/data/accepted.csv',
          checksum: checksum('b'),
          adapterVersion: 'wahapedia-export/1',
          mediaType: 'text/csv',
        })
      ),
      observations: [observed([entry('https://assets.warhammer-community.com/missing-rules.pdf')])],
    })

    expect(inventory.complete).toBe(false)
    expect(inventory.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'missing' }),
        expect.objectContaining({
          publisher: 'wahapedia',
          status: 'unexpected',
          acceptedArtifactChecksum: checksum('b'),
        }),
      ])
    )
  })

  it('matches a redirect destination and blocks inaccessible or ambiguous observations', () => {
    const accepted = artifact({
      requestUrl: 'https://www.warhammer-community.com/redirect',
      finalUrl: 'https://assets.warhammer-community.com/rules.pdf',
      checksum: checksum('c'),
    })
    const inventory = createSourceInventory({
      revision: 'aos4-corpus-test',
      acceptedManifest: manifest(accepted),
      observations: [
        observed([
          entry(accepted.finalUrl),
          entry('https://assets.warhammer-community.com/inaccessible.pdf', {
            availability: 'inaccessible',
          }),
          entry('https://wahapedia.ru/aos4/ambiguous/', {
            publisher: 'wahapedia',
            availability: 'ambiguous',
          }),
        ]),
      ],
    })

    expect(inventory.complete).toBe(false)
    expect(inventory.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: accepted.finalUrl,
          status: 'matched',
          acceptedArtifactChecksum: checksum('c'),
        }),
        expect.objectContaining({ status: 'inaccessible' }),
        expect.objectContaining({ status: 'ambiguous' }),
      ])
    )
  })

  it('records each observation instant instead of stamping every publisher with the newest', () => {
    const officialUrl = 'https://assets.warhammer-community.com/rules.pdf'
    const wahapediaUrl = 'https://wahapedia.ru/aos4/factions/fixture/'
    const inventory = createSourceInventory({
      revision: 'aos4-corpus-test',
      acceptedManifest: manifest(
        artifact({ requestUrl: officialUrl, checksum: checksum('d') }),
        artifact({
          requestUrl: wahapediaUrl,
          checksum: checksum('e'),
          adapterVersion: 'wahapedia-html/1',
          mediaType: 'text/html',
        })
      ),
      observations: [
        observed([entry(wahapediaUrl, { publisher: 'wahapedia' })], {
          observedAt: '2026-09-23T18:45:46.124Z',
          producedBy: 'wahapedia-discovery/v1',
        }),
        observed([entry(officialUrl)], {
          observedAt: '2026-09-22T02:39:35.873Z',
          producedBy: 'games-workshop-discovery/v1',
        }),
      ],
    })

    expect(inventory).toMatchObject({
      schemaVersion: 2,
      observedAt: '2026-09-23T18:45:46.124Z',
      oldestObservedAt: '2026-09-22T02:39:35.873Z',
      producedBy: 'source-inventory-reconciler/v2 (games-workshop-discovery/v1, wahapedia-discovery/v1)',
      observations: [
        {
          producedBy: 'games-workshop-discovery/v1',
          observedAt: '2026-09-22T02:39:35.873Z',
          publishers: ['games-workshop'],
          entries: 1,
        },
        {
          producedBy: 'wahapedia-discovery/v1',
          observedAt: '2026-09-23T18:45:46.124Z',
          publishers: ['wahapedia'],
          entries: 1,
        },
      ],
    })
  })

  it('orders observation instants by time when some omit milliseconds', () => {
    const inventory = createSourceInventory({
      revision: 'aos4-corpus-test',
      acceptedManifest: manifest(),
      observations: [
        observed([], { observedAt: '2026-09-22T02:39:35Z', producedBy: 'earlier' }),
        observed([], { observedAt: '2026-09-22T02:39:35.500Z', producedBy: 'later' }),
      ],
    })

    expect(inventory.oldestObservedAt).toBe('2026-09-22T02:39:35Z')
    expect(inventory.observedAt).toBe('2026-09-22T02:39:35.500Z')
    expect(inventory.observations!.map(value => value.producedBy)).toEqual(['earlier', 'later'])
  })

  it('rejects duplicate discovery URLs and non-material entries without rationale', () => {
    const duplicate = entry('https://assets.warhammer-community.com/rules.pdf')
    expect(() =>
      createSourceInventory({
        revision: 'aos4-corpus-test',
        acceptedManifest: manifest(),
        observations: [observed([duplicate]), observed([duplicate])],
      })
    ).toThrow(/repeat URL/)

    expect(() =>
      createSourceInventory({
        revision: 'aos4-corpus-test',
        acceptedManifest: manifest(),
        observations: [
          observed([
            entry('https://assets.warhammer-community.com/backdrop.pdf', {
              scope: 'explicit-non-material',
            }),
          ]),
        ],
      })
    ).toThrow(/requires a non-material disposition/)
  })
})
