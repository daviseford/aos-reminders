import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { ArtifactManifest } from '../../aos4/data'
import {
  createRadarLane,
  pagesFromWahapediaSourceObservation,
  runRulesRadar,
  type CandidatePreparationInput,
  type RadarEvent,
  type RadarLane,
} from '../../aos4/radar'

const observedAt = '2026-07-29T20:00:00.000Z'
const temporaryDirectories: string[] = []
const checksum = (character: string): string => character.repeat(64)
const manifest: ArtifactManifest = { schemaVersion: 1, artifacts: [] }

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true }))
  )
})

describe('AoS 4 Rules Radar command', () => {
  it('derives only accessible material pages from a full Wahapedia observation', () => {
    expect(
      pagesFromWahapediaSourceObservation({
        schemaVersion: 1,
        entries: [
          {
            publisher: 'wahapedia',
            url: 'https://wahapedia.ru/aos4/factions/stormcast-eternals/',
            scope: 'material',
            availability: 'accessible',
          },
          {
            publisher: 'wahapedia',
            url: 'https://wahapedia.ru/aos4/Factions.csv',
            scope: 'material',
            availability: 'accessible',
          },
          {
            publisher: 'wahapedia',
            url: 'https://wahapedia.ru/aos4/factions/inaccessible/',
            scope: 'material',
            availability: 'inaccessible',
          },
        ],
      })
    ).toEqual(['https://wahapedia.ru/aos4/factions/stormcast-eternals/'])
  })

  it('writes a deterministic no-change report without candidate inputs', async () => {
    const root = await temporaryDirectory()
    const output = path.join(root, 'report')
    const prepared: CandidatePreparationInput[] = []
    const result = await runRulesRadar(
      {
        lanes: [emptyLane('games-workshop')],
        outputDirectory: output,
        acceptedManifest: manifest,
      },
      {
        prepareCandidate: async input => {
          prepared.push(input)
          return { source: input.source, artifacts: [] }
        },
      }
    )

    expect(result.report.events).toEqual([])
    expect(prepared).toEqual([])
    await expect(readFile(path.join(output, 'official-urls.json'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    })
    expect(await readFile(path.join(output, 'material-event-count.txt'), 'utf8')).toBe('0\n')
  })

  it('prepares official evidence without contacting Wahapedia', async () => {
    const root = await temporaryDirectory()
    const prepared: CandidatePreparationInput[] = []
    const officialUrl = 'https://assets.warhammer-community.com/new-battle-profiles.pdf'
    const result = await runRulesRadar(
      {
        lanes: [
          laneWithEvent(
            'games-workshop',
            event('games-workshop', 'official', 'new-publication', officialUrl)
          ),
        ],
        outputDirectory: path.join(root, 'report'),
        acceptedManifest: manifest,
      },
      {
        prepareCandidate: async input => {
          prepared.push(input)
          return { source: input.source, artifacts: [] }
        },
      }
    )

    expect(prepared).toEqual([
      expect.objectContaining({
        source: 'games-workshop',
        officialDocumentUrls: [officialUrl],
        wahapediaPageUrls: [],
      }),
    ])
    expect(result.operationalFailure).toBe(false)
  })

  it('prepares reviewed Wahapedia pages and never creates candidate inputs for BSData', async () => {
    const root = await temporaryDirectory()
    const prepared: CandidatePreparationInput[] = []
    const page = 'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
    await runRulesRadar(
      {
        lanes: [
          laneWithEvent('wahapedia', event('wahapedia', 'secondary', 'new-faction', page)),
          laneWithEvent(
            'bsdata',
            event(
              'bsdata',
              'community',
              'community-catalog-changed',
              'BSData/age-of-sigmar-4th',
              checksum('1'),
              checksum('2')
            )
          ),
        ],
        outputDirectory: path.join(root, 'report'),
        acceptedManifest: manifest,
        wahapediaPageUrls: [page],
      },
      {
        prepareCandidate: async input => {
          prepared.push(input)
          return { source: input.source, artifacts: [] }
        },
      }
    )

    expect(prepared).toHaveLength(1)
    expect(prepared[0]).toMatchObject({
      source: 'wahapedia',
      officialDocumentUrls: [],
      wahapediaPageUrls: [page],
    })
  })

  it('fails on output collisions and preserves material events when candidate preparation fails', async () => {
    const root = await temporaryDirectory()
    const collision = path.join(root, 'collision')
    await mkdir(collision)
    await expect(
      runRulesRadar({
        lanes: [emptyLane('games-workshop')],
        outputDirectory: collision,
        acceptedManifest: manifest,
      })
    ).rejects.toThrow()

    const result = await runRulesRadar(
      {
        lanes: [
          laneWithEvent(
            'games-workshop',
            event(
              'games-workshop',
              'official',
              'new-publication',
              'https://assets.warhammer-community.com/new-rules.pdf'
            )
          ),
        ],
        outputDirectory: path.join(root, 'failed-candidate'),
        acceptedManifest: manifest,
      },
      {
        prepareCandidate: async () => {
          throw new Error('candidate acquisition failed')
        },
      }
    )

    expect(result.report.events.map(value => value.changeKind)).toEqual([
      'new-publication',
      'candidate-failed',
    ])
    expect(result.operationalFailure).toBe(true)
  })

  it('emits byte-identical reports and issue bodies for reordered lanes', async () => {
    const root = await temporaryDirectory()
    const lanes = [
      laneWithEvent(
        'wahapedia',
        event('wahapedia', 'secondary', 'new-rules-page', 'https://wahapedia.ru/aos4/the-rules/new-rules/')
      ),
      emptyLane('games-workshop'),
    ]
    const first = await runRulesRadar({
      lanes,
      outputDirectory: path.join(root, 'first'),
      acceptedManifest: manifest,
      reportOnly: true,
    })
    const second = await runRulesRadar({
      lanes: [...lanes].reverse(),
      outputDirectory: path.join(root, 'second'),
      acceptedManifest: manifest,
      reportOnly: true,
    })

    expect(await readFile(path.join(root, 'first', 'report.json'), 'utf8')).toBe(
      await readFile(path.join(root, 'second', 'report.json'), 'utf8')
    )
    expect(first.issueBody).toBe(second.issueBody)
  })
})

const temporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'aos4-radar-'))
  temporaryDirectories.push(directory)
  return directory
}

const emptyLane = (source: RadarLane['source']): RadarLane => createRadarLane(source, observedAt, [])

const laneWithEvent = (source: RadarLane['source'], value: RadarEvent): RadarLane =>
  createRadarLane(source, observedAt, [value])

const event = (
  source: RadarEvent['source'],
  authority: RadarEvent['authority'],
  changeKind: RadarEvent['changeKind'],
  locator: string,
  baselineFingerprint: string | null = null,
  observedFingerprint: string | null = checksum('a')
): RadarEvent => ({
  class: 'material',
  source,
  publisher: source,
  authority,
  changeKind,
  locator,
  baselineFingerprint,
  observedFingerprint,
  observedAt,
  evidence: { title: 'Fixture event' },
})
