import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { armyFactions } from '../../aos4/domain'
import type { Aos4RuntimeProjection } from '../../aos4/generate'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import type { Aos4RuntimeCore } from '../../aos4/generated/corpus/catalog'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import type { Aos4RuntimeSources } from '../../aos4/generated/corpus/sources'
import { checksumCertificationText } from '../../aos4/review/certification'
import { createAos4BuilderViewModel } from '../../aos4/view'

/**
 * The core, sources, and faction-index artifacts are *derived* from `runtime.json` at generation
 * time, and `runtime.json` is pinned by checksum in accepted certification evidence. Nothing else
 * proves the derivation still describes its input, so these cases are the guard against the
 * derived halves drifting away from the certified whole.
 */

/*
 * The halves are read through the production types — `Aos4RuntimeCore` from the catalog module and
 * `Aos4RuntimeSources` from the loader — rather than through local `Omit`/`Pick` aliases. A local
 * copy of the split would let this file's idea of where the seam falls drift from the code's and
 * still pass, which is exactly the drift these cases exist to catch.
 */
const corpusPath = (file: string): string =>
  path.join(process.cwd(), 'src', 'aos4', 'generated', 'corpus', file)

const readCorpus = (file: string): string => readFileSync(corpusPath(file), 'utf8')

const readCorpusJson = <T>(file: string): T => JSON.parse(readCorpus(file)) as T

const runtime = readCorpusJson<Aos4RuntimeProjection>('runtime.json')
const core = readCorpusJson<Aos4RuntimeCore>('runtime.core.json')
const sources = readCorpusJson<Aos4RuntimeSources>('runtime.sources.json')

const certificationManifest = JSON.parse(
  readFileSync(
    path.join(
      process.cwd(),
      'data',
      'aos4',
      'certifications',
      'aos4-corpus-2026-08-28b-machine-r1',
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
    expect(sources.sourceRecords).toHaveLength(20085)
    expect(sources.sourceArtifacts).toHaveLength(231)
  })

  it('keeps every core source-record index addressable in the sources artifact', () => {
    const bound = sources.sourceRecords.length
    const unaddressable = core.entities.filter(entity =>
      entity.sourceRecordIndexes.some(index => !Number.isInteger(index) || index < 0 || index >= bound)
    )
    expect(unaddressable.map(entity => entity.id)).toEqual([])
  })

  /**
   * A static edge from `catalog.ts` to the sources artifact would put all 7 MB of citations back in
   * the chunk Home renders from, undoing the split without failing anything else. Walking the real
   * static import graph — rather than matching source text — keeps the check anchored to what the
   * bundler follows.
   */
  const staticSpecifiers = (source: string): string[] => [
    ...Array.from(source.matchAll(/\b(?:import|export)\s[^;]*?\bfrom\s*['"]([^'"]+)['"]/g), m => m[1]),
    ...Array.from(source.matchAll(/\bimport\s+['"]([^'"]+)['"]/g), m => m[1]),
  ]

  const resolveModule = (fromFile: string, specifier: string): string | undefined => {
    if (!specifier.startsWith('.')) return undefined
    const base = path.resolve(path.dirname(fromFile), specifier)
    return [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, path.join(base, 'index.ts')].find(
      candidate => existsSync(candidate) && statSync(candidate).isFile()
    )
  }

  const staticGraphFrom = (entry: string): Set<string> => {
    const seen = new Set<string>()
    const queue = [entry]
    while (queue.length) {
      const file = queue.shift()!
      if (seen.has(file) || file.endsWith('.json')) {
        seen.add(file)
        continue
      }
      seen.add(file)
      staticSpecifiers(readFileSync(file, 'utf8')).forEach(specifier => {
        const resolved = resolveModule(file, specifier)
        if (resolved && !seen.has(resolved)) queue.push(resolved)
      })
    }
    return seen
  }

  it('never reaches the sources artifact through a static import from the catalog', () => {
    const graph = staticGraphFrom(corpusPath('catalog.ts'))
    expect(graph).toContain(corpusPath('runtime.core.json'))
    expect(graph).not.toContain(corpusPath('runtime.sources.json'))
    expect(graph).not.toContain(corpusPath('sources.ts'))
    // And the loader reaches it only dynamically, which is what gives it its own chunk.
    const loader = readFileSync(corpusPath('sources.ts'), 'utf8')
    expect(staticSpecifiers(loader)).not.toContain('./runtime.sources.json')
    expect(loader).toContain("import('./runtime.sources.json')")
  })

  /*
   * The loader memoizes one in-flight fetch; a second `import()` of the artifact anywhere else in
   * the shipped code would bypass the memo and the chunk-form assumptions above without failing any
   * graph assertion, because the graph walk starts at the catalog. Tests and the generator may read
   * the file directly — they are Node-side and never shipped — so the walk skips `src/tests`.
   */
  it('is imported only by the loader', () => {
    const importPattern = /import(?:\s[^'"]*from\s*|\s*\(\s*)['"][^'"]*runtime\.sources\.json['"]/
    const importers: string[] = []
    const walk = (dir: string) => {
      readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const file = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (entry.name !== 'tests') walk(file)
        } else if (/\.tsx?$/.test(entry.name) && importPattern.test(readFileSync(file, 'utf8'))) {
          importers.push(file)
        }
      })
    }
    walk(path.join(process.cwd(), 'src'))
    expect(importers).toEqual([corpusPath('sources.ts')])
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

  /**
   * Both index arrays on a row address `rulesContextIds`, so a row that resolved against a stale or
   * reordered copy of that array would still typecheck and still describe *some* context. This is
   * the case that pins the addressing space itself to the catalog's.
   */
  it('addresses rules contexts by index into the catalog list itself', () => {
    expect(AOS4_FACTION_INDEX.rulesContextIds).toEqual(
      AOS4_CATALOG.rulesContexts.map(context => context.id).sort()
    )
  })

  const contextIdsOf = (indexes: number[]): string[] =>
    indexes.map(index => AOS4_FACTION_INDEX.rulesContextIds[index])

  it('carries the rules contexts each faction is applicable in', () => {
    const contextIdsByFactionId = new Map(
      AOS4_CATALOG.entities.flatMap(entity =>
        entity.kind === 'faction' ? [[entity.id, [...entity.rulesContextIds].sort()] as const] : []
      )
    )
    expect(
      AOS4_FACTION_INDEX.factions.map(row => [row.id, contextIdsOf(row.rulesContextIndexes).sort()] as const)
    ).toEqual(AOS4_FACTION_INDEX.factions.map(row => [row.id, contextIdsByFactionId.get(row.id)] as const))
  })

  /**
   * Every faction against every rules context, not just the default one.
   *
   * The default context is the one context where a context-blind answer cannot be wrong, so a case
   * that only drove it passed while the shell reserved an Army of Renown row on 17 of 25 Spearhead
   * factions and 16 of 26 Legends factions that have none there — a row the arriving child then
   * removed, shifting the page in the direction the reservation exists to prevent. Sweeping the
   * whole product is what makes that class of drift impossible to reintroduce silently.
   */
  it('names the rules contexts each faction offers Armies of Renown in, in every context', () => {
    const offeredByBuilder = AOS4_FACTION_INDEX.factions.map(row => ({
      id: row.id,
      contextIds: AOS4_FACTION_INDEX.rulesContextIds.filter(rulesContextId => {
        const builder = createAos4BuilderViewModel(AOS4_CATALOG, {
          id: 'faction-index',
          name: 'faction-index',
          rulesContextId,
          explicitSelectionIds: [row.id],
          reminderPreferences: {},
        } as never)
        return builder.options.some(option => option.groupType === 'army-of-renown')
      }),
    }))
    expect(
      AOS4_FACTION_INDEX.factions.map(row => ({
        id: row.id,
        contextIds: contextIdsOf(row.armiesOfRenownContextIndexes),
      }))
    ).toEqual(offeredByBuilder)

    /*
     * And the shape of the answer, so a regeneration that emptied the field — reserving nothing,
     * anywhere — or that flattened it back to one context's answer for all of them fails here. The
     * two matched-play contexts agree at 24; the three that do not are exactly what the old flag
     * got wrong.
     */
    expect(
      AOS4_FACTION_INDEX.rulesContextIds.map(
        rulesContextId => offeredByBuilder.filter(row => row.contextIds.includes(rulesContextId)).length
      )
    ).toEqual([24, 7, 7, 7, 24])
  }, 120_000)

  it('reserves the Army of Renown row on the default context exactly as the builder fills it', () => {
    const defaultIndex = AOS4_FACTION_INDEX.rulesContextIds.indexOf(AOS4_DEFAULT_RULES_CONTEXT_ID)
    expect(defaultIndex).toBeGreaterThanOrEqual(0)
    // KTD8 reserves the slot off this list; a list nobody is in would reserve nothing at all.
    expect(
      AOS4_FACTION_INDEX.factions.filter(row => row.armiesOfRenownContextIndexes.includes(defaultIndex))
    ).toHaveLength(24)
  })

  it('stays small enough to load ahead of the corpus', () => {
    // 4,982 bytes as of this commit. The rules-context UUIDs that used to dominate the file are
    // written once at the top and addressed by index from the rows, so the ceiling is here to catch
    // a row gaining catalog-sized content, not to police a few hundred bytes.
    expect(Buffer.byteLength(readCorpus('faction-index.json'), 'utf8')).toBeLessThan(16_384)
  })
})
