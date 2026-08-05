import crypto from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, describe, expect, it } from 'vitest'

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID, AOS4_RUNTIME_PROJECTION } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers'

/**
 * Real tournament rosters, captured verbatim from public event coverage (2025–2026).
 *
 * The other import corpora are ours: authored in a builder, or generated one-per-army to sweep
 * name resolution. This one is not. Every list here is what a player actually pasted into a
 * tournament submission — blank roster names, prose in the name field, footers from sixty-odd app
 * versions, and armies that were legal on the day and are not now. It exists to catch the parser
 * being right about the exports we make and wrong about the ones players send.
 *
 * There are no per-list goldens. A golden records whatever the parser does today, and 357 of them
 * would be 357 files nobody reads; the assertions below hold independently of any recorded output.
 *
 * See `../fixtures/aos4/import/tournament/README.md` for capture method and provenance.
 */

const ROOT = join(__dirname, '..', 'fixtures', 'aos4', 'import', 'tournament')
const LISTS_ROOT = join(ROOT, 'lists')

interface ManifestEntry {
  id: string
  exporter: string
  declaredFaction: string
  appVersion?: string
  dataVersion?: string
  event?: string
  articleUrl: string
  articleDate: string
  bytes: number
  sha256: string
  selections: number
  unresolvedLabels: number
}

const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf-8')) as {
  counts: Record<string, number>
  lists: ManifestEntry[]
}

const entries = manifest.lists

/**
 * Memoized: five assertion blocks read and decode each of the 357 lists, and doing that work five
 * times over is enough extra load to push unrelated filesystem-bound suites past their timeouts.
 */
const textCache = new Map<string, string>()
const listText = (id: string): string => {
  const cached = textCache.get(id) ?? readFileSync(join(LISTS_ROOT, id, 'list.txt'), 'utf-8')
  textCache.set(id, cached)
  return cached
}

const decodeCache = new Map<string, ReturnType<typeof decodeAos4TextRoster>>()
const decode = (id: string): ReturnType<typeof decodeAos4TextRoster> => {
  const cached = decodeCache.get(id) ?? decodeAos4TextRoster(listText(id))
  decodeCache.set(id, cached)
  return cached
}

const factionNames = new Set(
  AOS4_RUNTIME_PROJECTION.entities.filter(entity => entity.kind === 'faction').map(entity => entity.name)
)

/** Bookkeeping the exporters emit. A selection label matching one means scaffolding was read as content. */
const scaffoldingPattern =
  /^(?:[-–—]{2,}|Regiment \d+|Auxiliary Units|Auxiliaries|Faction Terrain|Regiments? of Renown|Drops?:|App:|Army of Renown|Battle Tactics? Cards?:|Legends|General|Reinforced)$/i

describe('tournament roster corpus', () => {
  it('has a manifest entry for every captured list and no orphans', () => {
    const onDisk = readdirSync(LISTS_ROOT, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .flatMap(exporter =>
        readdirSync(join(LISTS_ROOT, exporter.name), { withFileTypes: true })
          .filter(entry => entry.isDirectory())
          .map(entry => `${exporter.name}/${entry.name}`)
      )
      .sort()

    expect(onDisk).toEqual(entries.map(entry => entry.id).sort())
    expect(entries.length).toBeGreaterThan(0)
  })

  /**
   * The captures are provenance, not authorship: a hand-edit that "tidies" a separator or a blank
   * line destroys the only reason these files are worth keeping. The manifest checksum is what
   * makes that a test failure rather than a silent change of meaning.
   */
  it.each(entries.map(entry => [entry.id, entry] as const))(
    '%s matches its recorded checksum',
    (_id, entry) => {
      const text = listText(entry.id)
      expect(Buffer.byteLength(text)).toBe(entry.bytes)
      expect(crypto.createHash('sha256').update(text).digest('hex')).toBe(entry.sha256)
    }
  )

  const unresolvedByLabel = new Map<string, number>()

  it.each(entries.map(entry => [entry.id, entry] as const))(
    '%s decodes cleanly and declares a faction the catalog knows',
    (_id, entry) => {
      const { parsedRoster, diagnostics } = decode(entry.id)

      // Illegal is not malformed. Several of these were over points or ran retired warscrolls on
      // the day; they must still decode without complaint.
      expect(diagnostics).toEqual([])
      expect(parsedRoster).toBeDefined()
      expect(parsedRoster!.source).toBe(entry.exporter)
      expect(parsedRoster!.declaredFaction).toBe(entry.declaredFaction)
      expect(factionNames).toContain(parsedRoster!.declaredFaction)
      expect(parsedRoster!.selections.length).toBe(entry.selections)
    }
  )

  it.each(entries.map(entry => [entry.id, entry] as const))(
    '%s builds no selection out of scaffolding',
    (_id, entry) => {
      const sourceLines = listText(entry.id).split(/\r\n?|\n/)
      const { parsedRoster } = decode(entry.id)

      for (const selection of parsedRoster?.selections ?? []) {
        expect(selection.label.trim()).not.toBe('')
        expect(selection.label).not.toMatch(scaffoldingPattern)
        expect(selection.label).not.toMatch(/\(\s*\+?\d+\s*(?:pts?|points?)?\s*\)$/i)
        expect(sourceLines[selection.line - 1]?.trim()).not.toBe('')
      }
    }
  )

  it.each(entries.map(entry => [entry.id, entry] as const))(
    '%s decodes deterministically and survives CRLF',
    (_id, entry) => {
      const text = listText(entry.id)
      // Compared against the memoized decode, so this is a second, independent invocation.
      expect(decodeAos4TextRoster(text)).toEqual(decode(entry.id))
      expect(decodeAos4TextRoster(text.replace(/\n/g, '\r\n'))).toEqual(decode(entry.id))
    }
  )

  it.each(entries.map(entry => [entry.id, entry] as const))(
    '%s resolves against the accepted catalog without errors',
    (_id, entry) => {
      const { parsedRoster } = decode(entry.id)
      const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => `army:tournament-${entry.id}`,
      })

      expect(preview.diagnostics.filter(diagnostic => diagnostic.severity === 'error')).toEqual([])
      expect(preview.proposedDocument).toBeDefined()

      // Warnings are collected rather than asserted: a label our corpus lacks is a data gap, and
      // failing the build for one would make this corpus impossible to keep.
      const matched = new Set(preview.matches.map(match => match.label))
      for (const selection of parsedRoster!.selections) {
        if (matched.has(selection.label)) continue
        unresolvedByLabel.set(selection.label, (unresolvedByLabel.get(selection.label) ?? 0) + 1)
      }
    }
  )

  it('covers every army, both text exporters, and both sides of the handbook rollover', () => {
    expect(new Set(entries.map(entry => entry.declaredFaction)).size).toBe(27)
    expect(Object.keys(manifest.counts).sort()).toEqual(['listbot-text', 'official-app-text', 'sigdex-text'])

    // Version drift is the point of spreading the capture across two years of coverage: section
    // headers, the drops rows and the points annotations all moved with the handbooks.
    const appVersions = new Set(entries.map(entry => entry.appVersion).filter(Boolean))
    expect(appVersions.size).toBeGreaterThan(30)

    const handbooks = new Set(
      entries.flatMap(entry => listText(entry.id).match(/General's Handbook \d{4}-\d{2}/) ?? [])
    )
    expect(handbooks).toContain("General's Handbook 2025-26")
    expect(handbooks).toContain("General's Handbook 2026-27")
  })

  afterAll(() => {
    if (unresolvedByLabel.size === 0) return
    const ranked = Array.from(unresolvedByLabel.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([label, count]) => `${String(count).padStart(4)}  ${label}`)
    console.log(
      [
        `Tournament corpus: ${unresolvedByLabel.size} distinct labels did not resolve (fail-soft, not asserted).`,
        'Most frequent:',
        ...ranked,
      ].join('\n  ')
    )
  })
})
