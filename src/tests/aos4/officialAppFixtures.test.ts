import fs from 'node:fs'

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID, AOS4_RUNTIME_PROJECTION } from '../../aos4/generated'
import { buildArmyOfRenownIndex, resolveParsedRoster } from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { decodeAos4TextRoster } from '../../importers'
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
   * The five universal manifestation lores belong to no army — any list may take them — so every
   * faction has to reach them. They were absent entirely until the Endless Spells page stopped
   * decoding to nothing (issue #1791).
   */
  it.each([
    ['cos-001-grudgebound-legends', 'Morbid Conjuration'],
    ['cos-001-grudgebound-legends', 'Forbidden Power'],
    ['fs-001-older-handbook', 'Aetherwrought Machineries'],
    ['gg-001-army-of-renown', 'Primal Energy'],
    ['hh-001-renown-stress', 'Twilit Sorceries'],
    ['lrl-001-multi-lore', 'Krondspine Incarnate'],
  ])('%s reaches the universal manifestation lore "%s"', (id, lore) => {
    expect(resolveFixture(id).matched).toContain(lore)
  })

  it("resolves a general's regiment and its GHB 2026-27 honours (issue #1853)", () => {
    const { matched, preview } = resolveFixture('skv-002-generals-regiment-asterisk-bullets')

    // The units that were silently dropped while `General's Regiment` was not a section header.
    expect(matched).toContain('Thanquol on Boneripper')
    expect(matched).toContain('Rat Ogors')
    // The `*`-bulleted enhancements that surfaced as unknown warscrolls before the fix.
    expect(matched).toContain('Anabolic Accelerators')
    expect(matched).toContain('Foulhide')
    expect(matched).toContain('Master of the Swarm')
    // "Anabolic Accelerators" is both a content-group and the ability inside it; the pair must
    // collapse to the offered group rather than fail as ambiguous.
    expect(preview.diagnostics).toEqual([])
  })

  /**
   * Names the corpus genuinely does not carry must keep failing closed.
   *
   * The official battle-profile ledger carries no bare `Freeguild Marshal`, only the Relic Envoy
   * and Griffon variants. Resolving either to a neighbour would produce reminders for a unit the
   * player never took.
   */
  it('sce-001-exported-version-format reports "Freeguild Marshal" rather than guessing at a near-miss', () => {
    const { matched, preview } = resolveFixture('sce-001-exported-version-format')

    expect(matched).not.toContain('Freeguild Marshal')
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        message: expect.stringContaining('Freeguild Marshal'),
      })
    )
  })

  /**
   * `Mask of the Deceiver` is both the regiment and its sole member warscroll. The bundle line
   * resolves to the classified regiment group (issue #1858); the member line names an Underworlds
   * warband warscroll the corpus does not carry, and that absence must keep failing closed
   * rather than resolving the member to the group a second time.
   */
  it('ij-001-renown-heavy resolves the Mask of the Deceiver regiment but not its absent member warscroll', () => {
    const { preview } = resolveFixture('ij-001-renown-heavy')

    const maskMatches = preview.matches.filter(match => match.label === 'Mask of the Deceiver')
    expect(maskMatches).toHaveLength(1)
    const entity = AOS4_CATALOG.entities.find(candidate => candidate.id === maskMatches[0].canonicalId)
    expect(entity).toMatchObject({ kind: 'content-group', groupType: 'regiment-of-renown' })
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        message: expect.stringContaining('Mask of the Deceiver'),
      })
    )
  })

  /**
   * The issue #1858 repro list, verbatim: importing it must surface the regiment's own passive.
   *
   * The regiment bundle line used to be discarded as unresolvable scaffolding, so the import
   * succeeded while silently losing IRONCLAD DESPOILERS. Now the bundle resolves to the
   * classified `regiment-of-renown` content group, the import's selection state matches a manual
   * builder pick, and the passive lands in the reminders alongside the members' own abilities.
   */
  it('skv-003-skaldior-regiment-ability imports the regiment and its passive lands in the reminders', () => {
    const { matched, preview } = resolveFixture('skv-003-skaldior-regiment-ability')

    expect(preview.diagnostics).toEqual([])
    expect(matched).toContain("Lord Skaldior's Chosen")
    expect(matched).toContain('Chaos Lord on Daemonic Mount')
    expect(matched).toContain('Chaos Knights')
    expect(matched).toContain('Chaos Warriors')

    const document = preview.proposedDocument
    expect(document).toBeDefined()
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: document!.explicitSelectionIds,
      rulesContextId: document!.rulesContextId,
    })
    expect(selection.diagnostics).toEqual([])
    const regiment = AOS4_CATALOG.entities.find(
      entity =>
        entity.kind === 'content-group' &&
        entity.groupType === 'regiment-of-renown' &&
        entity.name === 'Lord Skaldior’s Chosen'
    )!
    expect(selection.selectedIds).toContain(regiment.id)

    const reminders = projectReminders(AOS4_CATALOG, selection).map(reminder => reminder.name)
    expect(reminders).toContain('IRONCLAD DESPOILERS')
  })

  /**
   * A regiment the corpus does not yet carry must fail closed as a named diagnostic, never a
   * silent drop or a guess. Okar's Torrbad and Urrgar's Maulerguts are the live case: their
   * official battle-profile rows exist, but Wahapedia does not yet publish their rules, so no
   * classified regiment group exists to resolve to.
   */
  it("reports an unclassified regiment (Okar's Torrbad) instead of dropping or guessing", () => {
    const preview = resolveParsedRoster(
      AOS4_CATALOG,
      {
        source: 'official-app-text',
        proposedName: 'unclassified regiment probe',
        declaredFaction: 'Ogor Mawtribes',
        selections: [
          {
            line: 3,
            label: "Okar's Torrbad",
            kindHint: 'regiment-of-renown',
            isRegimentOfRenown: true,
          },
        ],
      },
      { defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID, createDocumentId: () => 'army:probe' }
    )
    expect(preview.matches.map(match => match.label)).not.toContain("Okar's Torrbad")
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        message: expect.stringContaining("Okar's Torrbad"),
      })
    )
  })
})
