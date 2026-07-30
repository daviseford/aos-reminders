import fs from 'node:fs'

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID, AOS4_RUNTIME_PROJECTION } from '../../aos4/generated'
import { buildArmyOfRenownIndex, resolveParsedRoster } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers/aos4'
import {
  decodeOfficialAppFixture,
  officialAppExpectedPath,
  officialAppFixtureIds,
  officialAppGolden,
  readOfficialAppExpected,
  readOfficialAppFixture,
} from '../support/officialAppFixtures'

const ids = officialAppFixtureIds()

const factionNames = new Set(
  AOS4_RUNTIME_PROJECTION.entities.filter(entity => entity.kind === 'faction').map(entity => entity.name)
)

/**
 * Lines the app emits that are bookkeeping rather than roster content. A selection label matching
 * any of these means the parser mistook scaffolding for a unit — the failure mode that let a
 * `-----` separator become a faction name.
 */
const scaffoldingPattern =
  /^(?:[-–—]{2,}|Regiment \d+|Auxiliary Units|Auxiliaries|Faction Terrain|Regiments? of Renown|Drops?:|App:|Army of Renown|Battle Tactics? Cards?:|Legends|General|Reinforced)$/i

describe('official app list fixtures', () => {
  it('has at least one fixture and a golden for each', () => {
    expect(ids.length).toBeGreaterThan(0)
    const missing = ids.filter(id => !fs.existsSync(officialAppExpectedPath(id)))
    expect(missing).toEqual([])
  })

  it.each(ids)('%s matches its recorded golden', id => {
    expect(officialAppGolden(id)).toEqual(readOfficialAppExpected(id))
  })

  it.each(ids)('%s imports cleanly and declares a faction the catalog knows', id => {
    const { parsedRoster, diagnostics } = decodeOfficialAppFixture(id)

    // Illegal armies are a tournament organiser's problem, not the importer's. These fixtures are
    // deliberately over points; they must still decode without complaint.
    expect(diagnostics).toEqual([])
    expect(parsedRoster).toBeDefined()
    expect(factionNames).toContain(parsedRoster?.declaredFaction)
  })

  it.each(ids)('%s produces no selection built from scaffolding', id => {
    const { parsedRoster } = decodeOfficialAppFixture(id)
    const sourceLines = readOfficialAppFixture(id).split(/\r\n?|\n/)

    for (const selection of parsedRoster?.selections ?? []) {
      expect(selection.label.trim()).not.toBe('')
      expect(selection.label).not.toMatch(scaffoldingPattern)
      // A points cost is roster metadata; it must never survive into a label we try to resolve.
      expect(selection.label).not.toMatch(/\(\s*\+?\d+\s*(?:pts?|points?)?\s*\)$/i)
      // Every selection must be traceable to a real, non-empty line of the source roster.
      expect(sourceLines[selection.line - 1]?.trim()).not.toBe('')
    }
  })

  it.each(ids)('%s decodes deterministically and survives CRLF', id => {
    const text = readOfficialAppFixture(id)
    expect(decodeOfficialAppFixture(id)).toEqual(decodeOfficialAppFixture(id))
    expect(decodeAos4TextRoster(text.replace(/\n/g, '\r\n'))).toEqual(decodeAos4TextRoster(text))
  })
})

/**
 * What these rosters actually resolve to against the accepted corpus (issue #1783).
 *
 * The tests above stop at decoding, which is where the parser's job ends. Everything below is
 * about the far larger loss that came after it: real lists resolving against real data and quietly
 * dropping content the catalog was holding all along. Named labels rather than totals, because a
 * count that drifts down by one tells you nothing about which player lost what.
 */
/** Memoized: resolving against the full catalog costs a fifth of a second, and ids repeat. */
const resolutions = new Map<string, ReturnType<typeof resolveOnce>>()

const resolveOnce = (id: string) => {
  const { parsedRoster } = decodeOfficialAppFixture(id)
  if (!parsedRoster) throw new Error(`Fixture ${id} did not decode`)
  const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
    defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    createDocumentId: () => `army:${id}`,
  })
  return { parsedRoster, preview, matched: new Set(preview.matches.map(match => match.label)) }
}

const resolveFixture = (id: string) => {
  const cached = resolutions.get(id) ?? resolveOnce(id)
  resolutions.set(id, cached)
  return cached
}

describe('official app list resolution', () => {
  it('recognises the corpus Armies of Renown without sweeping in enhancement tables', () => {
    const index = buildArmyOfRenownIndex(AOS4_CATALOG)
    const named = (id: string) => AOS4_CATALOG.entities.find(entity => entity.id === id)?.name.trim() ?? ''
    const containerNames = Array.from(index.containerIds, named)

    expect(containerNames).toContain('Da King’s Gitz')
    expect(containerNames).toContain('The First Phalanx of Ionrach')
    expect(containerNames).toContain('Pioneer Outpost')

    /**
     * These nest a singular variant under its own plural — the one other shape in the corpus that
     * looks like an army from a distance, and the reason a section heading has to be present.
     */
    expect(containerNames).not.toContain('Monstrous Traits')
    expect(containerNames).not.toContain('Accursed Devices')
    expect(containerNames).not.toContain('Marks of Vulcatrix')

    // Every army the corpus carries, and no more; a data refresh that moves this should be read.
    expect(index.containerIds.size).toBe(108)
  })

  it('resolves an Army of Renown and the lores nested under it', () => {
    const { matched, preview } = resolveFixture('gg-001-army-of-renown')

    expect(matched).toContain("Da King's Gitz")
    expect(matched).toContain("Da King's Gitz Spell Lore")
    expect(matched).toContain("Da King's Gitz Manifestation Lore")
    expect(preview.proposedDocument).toBeDefined()
  })

  it.each([
    ['idk-001-renown-army-no-lore', 'The First Phalanx of Ionrach'],
    ['ko-001-renown-army-repeats', 'Pioneer Outpost'],
  ])('%s resolves its Army of Renown (%s)', (id, army) => {
    expect(resolveFixture(id).matched).toContain(army)
  })

  it('keeps a lapsed season’s content for a roster built during it', () => {
    const { matched, preview } = resolveFixture('om-001-multi-terrain-auxiliaries')

    // A General's Handbook 2025-26 formation, and two unit variants that season introduced.
    expect(matched).toContain('Greedy Eaters')
    expect(matched).toContain('Scourge of Ghyran Ironblaster')
    expect(matched).toContain('Scourge of Ghyran Gnoblar Scraplauncher')
    expect(preview.proposedDocument?.allowsHistorical).toBe(true)
    // The document still imports into the season we carry, which holds the rest of the army.
    expect(preview.proposedDocument?.rulesContextId).toBe(AOS4_DEFAULT_RULES_CONTEXT_ID)
  })

  it('leaves a current-season roster on the current season alone', () => {
    const { preview } = resolveFixture('ser-001-current-format')

    expect(preview.proposedDocument?.allowsHistorical).toBeUndefined()
    expect(preview.diagnostics).toEqual([])
  })

  /**
   * Names the corpus genuinely does not carry must keep failing closed.
   *
   * Each is a near-miss to something real — `Conqueror Cogfort` exists, two different Freeguild
   * Marshals exist — and resolving to a neighbour would produce reminders for a unit the player
   * never took. Tracked as corpus coverage instead; see the manifestation work in issue #1791.
   */
  it.each([
    ['ij-001-renown-heavy', 'Outlaw Conqueror Cogfort'],
    ['ij-001-renown-heavy', 'Mask of the Deceiver'],
    ['sce-001-exported-version-format', 'Freeguild Marshal'],
  ])('%s reports "%s" rather than guessing at a near-miss', (id, label) => {
    const { matched, preview } = resolveFixture(id)

    expect(matched).not.toContain(label)
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        message: expect.stringContaining(label),
      })
    )
  })
})
