import { readFileSync } from 'node:fs'
import path from 'node:path'
import { armyFactions } from '../../aos4/domain'
import type { Aos4RuntimeProjection } from '../../aos4/generate'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import { checksumCertificationText } from '../../aos4/review/certification'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * The core, sources, and faction-index artifacts are *derived* from `runtime.json` at generation
 * time, and `runtime.json` is pinned by checksum in accepted certification evidence. Nothing else
 * proves the derivation still describes its input, so these cases are the guard against the
 * derived halves drifting away from the certified whole.
 */

type CoreArtifact = Omit<Aos4RuntimeProjection, 'sourceArtifacts' | 'sourceRecords'>
type SourcesArtifact = Pick<Aos4RuntimeProjection, 'sourceArtifacts' | 'sourceRecords'>

const corpusPath = (file: string): string =>
  path.join(process.cwd(), 'src', 'aos4', 'generated', 'corpus', file)

const readCorpus = (file: string): string => readFileSync(corpusPath(file), 'utf8')

const readCorpusJson = <T>(file: string): T => JSON.parse(readCorpus(file)) as T

const runtime = readCorpusJson<Aos4RuntimeProjection>('runtime.json')
const core = readCorpusJson<CoreArtifact>('runtime.core.json')
const sources = readCorpusJson<SourcesArtifact>('runtime.sources.json')

const certificationManifest = JSON.parse(
  readFileSync(
    path.join(
      process.cwd(),
      'data',
      'aos4',
      'certifications',
      'aos4-corpus-2026-08-18-machine-r1',
      'manifest.json'
    ),
    'utf8'
  )
) as { inputs: Array<{ name: string; path: string; checksum: string }> }

describe('AoS 4 derived corpus artifacts', () => {
  it('recombines the core and sources halves into the certified runtime projection', () => {
    expect({ ...core, ...sources }).toEqual(runtime)
  })

  it('leaves the certified runtime projection byte-identical to its certification input', () => {
    const binding = certificationManifest.inputs.find(input => input.name === 'runtime-catalog')
    expect(binding?.path).toBe('src/aos4/generated/corpus/runtime.json')
    expect(checksumCertificationText(readCorpus('runtime.json'))).toBe(binding?.checksum)
  })

  it('keeps the source halves out of the core artifact', () => {
    expect(Object.keys(core).sort()).toEqual([
      'attribution',
      'catalogSchemaVersion',
      'entities',
      'generatedAt',
      'relationships',
      'rulesContexts',
      'schemaVersion',
    ])
    expect(Object.keys(sources).sort()).toEqual(['sourceArtifacts', 'sourceRecords'])
    expect(sources.sourceRecords).toHaveLength(20078)
    expect(sources.sourceArtifacts).toHaveLength(235)
  })

  it('keeps every core source-record index addressable in the sources artifact', () => {
    const bound = sources.sourceRecords.length
    const unaddressable = core.entities.filter(entity =>
      entity.sourceRecordIndexes.some(index => !Number.isInteger(index) || index < 0 || index >= bound)
    )
    expect(unaddressable.map(entity => entity.id)).toEqual([])
  })

  it('indexes every decoded faction and flags the ones a player can field', () => {
    expect(AOS4_FACTION_INDEX.factions).toHaveLength(28)
    expect(AOS4_FACTION_INDEX.factions.filter(row => row.playable)).toHaveLength(27)
    // `Endless Spells` is a container row, not an army; see src/aos4/domain/armies.ts.
    expect(AOS4_FACTION_INDEX.factions.filter(row => !row.playable).map(row => row.name)).toEqual([
      'Endless Spells',
    ])
  })

  it('names the playable factions exactly as the army selector does today', () => {
    expect(
      AOS4_FACTION_INDEX.factions.filter(row => row.playable).map(row => ({ id: row.id, name: row.name }))
    ).toEqual(armyFactions(AOS4_CATALOG).map(faction => ({ id: faction.id, name: faction.name })))
  })

  it('carries the rules contexts each faction is applicable in', () => {
    const contextIdsByFactionId = new Map(
      AOS4_CATALOG.entities.flatMap(entity =>
        entity.kind === 'faction' ? [[entity.id, [...entity.rulesContextIds].sort()] as const] : []
      )
    )
    expect(
      AOS4_FACTION_INDEX.factions.map(row => [row.id, [...row.rulesContextIds].sort()] as const)
    ).toEqual(AOS4_FACTION_INDEX.factions.map(row => [row.id, contextIdsByFactionId.get(row.id)] as const))
  })

  it('flags Armies of Renown exactly where the builder offers them', () => {
    const offeredByBuilder = AOS4_FACTION_INDEX.factions.map(row => {
      const builder = createAos4BuilderViewModel(AOS4_CATALOG, {
        id: 'faction-index',
        name: 'faction-index',
        rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        explicitSelectionIds: [row.id],
        reminderPreferences: {},
      } as never)
      return {
        id: row.id,
        hasArmiesOfRenown: builder.options.some(option => option.groupType === 'army-of-renown'),
      }
    })
    expect(
      AOS4_FACTION_INDEX.factions.map(row => ({
        id: row.id,
        hasArmiesOfRenown: row.hasArmiesOfRenown,
      }))
    ).toEqual(offeredByBuilder)
    // KTD8 reserves the Army of Renown slot off this flag; a flag nobody sets would reserve nothing.
    expect(offeredByBuilder.filter(row => row.hasArmiesOfRenown)).toHaveLength(24)
  })

  it('stays small enough to load ahead of the corpus', () => {
    // Most of the index is repeated rules-context UUIDs, which gzip crushes; the ceiling is here to
    // catch a row gaining catalog-sized content, not to police a few hundred bytes.
    expect(readCorpus('faction-index.json').length).toBeLessThan(16_384)
  })
})
