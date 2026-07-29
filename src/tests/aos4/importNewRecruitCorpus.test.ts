// @vitest-environment jsdom
/**
 * The real corpus, through the real importer.
 *
 * `importNewRecruit.test.ts` proves the adapter against synthetic XML that we wrote, which means
 * it can only fail on shapes we already thought of. This runs the *captured* files through the
 * exact path the modal uses — `decodeAos4RosterFile` then `resolveParsedRoster` against the
 * shipped catalog — so the corpus can tell us what real New Recruit output does that our synthetic
 * XML does not.
 *
 * The headline assertion is deliberately narrow: every file must parse and resolve to a faction.
 * Name resolution is reported as a coverage number rather than asserted, because the resolver's
 * job is to fail closed on names it cannot place, and the honest measure of progress is the
 * unresolved-name histogram this prints.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { decodeAos4RosterFile } from '../../importers/aos4'
import { LISTS_ROOT, listDirectories } from '../support/newRecruitManifest'

const directories = listDirectories()
const fixture = (id: string, file: string) => path.join(LISTS_ROOT, id, file)
const readMeta = (id: string) => JSON.parse(readFileSync(fixture(id, 'meta.json'), 'utf8'))

const decode = async (id: string, format: 'ros' | 'rosz') =>
  decodeAos4RosterFile({
    name: `list.${format}`,
    bytes: new Uint8Array(readFileSync(fixture(id, `list.${format}`))),
  })

const errors = (diagnostics: { severity: string }[]) =>
  diagnostics.filter(diagnostic => diagnostic.severity === 'error')

/** Aggregated across the suite so the final report ranks what to fix next. */
const unresolvedByLabel = new Map<string, number>()
const perList: {
  id: string
  faction: string
  selections: number
  matched: number
  unresolved: number
}[] = []

describe('New Recruit corpus through the production importer', () => {
  describe.each(directories)('%s', id => {
    it('parses the captured .ros', async () => {
      const result = await decode(id, 'ros')

      expect(errors(result.diagnostics)).toEqual([])
      expect(result.parsedRoster).toBeDefined()
      expect(result.parsedRoster?.source).toEqual('roster-xml')
      expect(result.parsedRoster?.selections.length).toBeGreaterThan(0)
    })

    it('declares the faction its metadata claims', async () => {
      const result = await decode(id, 'ros')
      expect(result.parsedRoster?.declaredFaction).toEqual(readMeta(id).faction)
    })

    /**
     * Invariant 3 from the corpus README, now that an importer exists: the packed and loose
     * forms are the same roster. They are byte-identical, so a difference here would mean the
     * container layer, not the XML.
     */
    it('decodes .rosz to the same roster as .ros', async () => {
      const [loose, packed] = await Promise.all([decode(id, 'ros'), decode(id, 'rosz')])
      expect(packed.parsedRoster).toEqual(loose.parsedRoster)
    })

    /** Invariant 4: decoding is deterministic, which is what makes snapshots meaningful. */
    it('decodes deterministically', async () => {
      const [first, second] = await Promise.all([decode(id, 'ros'), decode(id, 'ros')])
      expect(second).toEqual(first)
    })

    it('resolves against the shipped catalog', async () => {
      const result = await decode(id, 'ros')
      const parsedRoster = result.parsedRoster
      if (!parsedRoster) throw new Error('expected the roster to parse')

      const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => `corpus-${id}`,
      })

      const unresolved = preview.diagnostics.filter(diagnostic =>
        ['unknown-selection', 'inapplicable-selection', 'ambiguous-selection'].includes(diagnostic.code)
      )
      for (const diagnostic of unresolved) {
        const label = diagnostic.message
        unresolvedByLabel.set(label, (unresolvedByLabel.get(label) ?? 0) + 1)
      }
      perList.push({
        id,
        faction: parsedRoster.declaredFaction ?? '(none)',
        selections: parsedRoster.selections.length,
        matched: preview.matches.length,
        unresolved: unresolved.length,
      })

      /**
       * The contract, now that only an unreadable file is fatal: every real roster imports.
       *
       * Names we cannot place are skipped with a warning, so a list that still produced no
       * document would mean something structural failed — a faction that would not resolve, or a
       * document that would not round-trip — and that is worth failing the build over.
       */
      expect(preview.diagnostics.filter(diagnostic => diagnostic.severity === 'error')).toEqual([])
      expect(preview.proposedDocument).toBeDefined()
      expect(preview.proposedDocument?.explicitSelectionIds.length).toBeGreaterThan(0)

      // Whatever we skipped has to be named, or the player cannot tell what is missing.
      for (const diagnostic of unresolved) {
        expect(diagnostic.message.length).toBeGreaterThan(0)
        expect(diagnostic.severity).toEqual('warning')
      }
    })
  })

  /**
   * The captures were built with New Recruit's "Allow Legends" switch on, so the opt-in has to
   * survive the import and the Legends units have to arrive. A player who deliberately opted into
   * Legends gets the army they built, in the roster's own context, and the document remembers the
   * opt-in so the builder and reminders keep resolving the Legends half afterwards.
   */
  it('imports the Legends units of an opted-in roster alongside the current ones', async () => {
    const result = await decode('sce-002-units-a', 'ros')
    const parsedRoster = result.parsedRoster
    if (!parsedRoster) throw new Error('expected the roster to parse')

    expect(parsedRoster.allowsLegends).toBe(true)
    expect(parsedRoster.selections.some(selection => selection.isLegends)).toBe(true)

    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'legends',
    })

    expect(
      preview.diagnostics.filter(diagnostic => diagnostic.message.includes('is Legends content'))
    ).toEqual([])

    /**
     * A builder-tagged Legends unit either resolves through the overlay or is reported as an
     * ordinary unknown name — catalog drift, not a boundary refusal. "Celestar Ballista" pins the
     * overlay itself: it is tagged in this capture and only exists in the Legends context.
     */
    const matched = new Set(preview.matches.map(match => match.label))
    expect(matched).toContain('Celestar Ballista')
    const unknownMessages = preview.diagnostics
      .filter(diagnostic => diagnostic.code === 'unknown-selection')
      .map(diagnostic => diagnostic.message)
    for (const selection of parsedRoster.selections.filter(selection => selection.isLegends)) {
      if (matched.has(selection.label)) continue
      expect(unknownMessages).toContainEqual(expect.stringContaining(`"${selection.label}"`))
      expect(unknownMessages).toContainEqual(expect.stringContaining("Couldn't find"))
    }
    expect(preview.proposedDocument).toMatchObject({
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      allowsLegends: true,
    })
  })

  /**
   * Beasts of Chaos is the trap shape: the faction still exists in the seasonal context (a handful
   * of endless spells), but its whole army lives in Legends. Before the overlay this list imported
   * one unit out of twenty-six; now the document stays in the roster's declared context and the
   * Legends units resolve through the overlay.
   */
  it('imports a Legends-army faction fully into its declared context', async () => {
    const result = await decode('boc-001-all-units', 'ros')
    const parsedRoster = result.parsedRoster
    if (!parsedRoster) throw new Error('expected the roster to parse')

    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'legends-army',
    })

    const unresolved = preview.diagnostics.filter(diagnostic =>
      ['unknown-selection', 'inapplicable-selection', 'ambiguous-selection'].includes(diagnostic.code)
    )
    expect(unresolved).toEqual([])
    expect(preview.matches.length).toBe(parsedRoster.selections.length)
    expect(preview.proposedDocument).toMatchObject({
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      allowsLegends: true,
    })
  })

  /**
   * Bonesplitterz has no seasonal presence at all, so the whole document still moves to the
   * Legends context — the pre-overlay path — and its units resolve there.
   */
  it('still moves a Legends-only faction to the Legends context', async () => {
    const result = await decode('bsz-001-all-units', 'ros')
    const parsedRoster = result.parsedRoster
    if (!parsedRoster) throw new Error('expected the roster to parse')

    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'legends-only',
    })

    const legendsContext = AOS4_CATALOG.rulesContexts.find(context => context.status === 'legends')
    expect(preview.proposedDocument?.rulesContextId).toBe(legendsContext?.id)
    expect(preview.matches.length).toBeGreaterThan(0)
  })

  /**
   * A list built the way a player actually builds one — a regiment, a leader, a unit — is the
   * case that has to work. The all-units captures deliberately include Legends entries and every
   * size variant, so they are a coverage instrument rather than a pass/fail gate.
   */
  it('imports a realistic list to a usable army document', async () => {
    const result = await decode('sce-001-minimal', 'ros')
    const parsedRoster = result.parsedRoster
    if (!parsedRoster) throw new Error('expected the roster to parse')

    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'realistic',
    })

    expect(preview.diagnostics.filter(diagnostic => diagnostic.severity === 'error')).toEqual([])
    expect(preview.proposedDocument).toBeDefined()
    expect(preview.source).toEqual('roster-xml')

    const names = preview.matches.map(match => match.label)
    expect(names).toContain('Gardus Steel Soul')
    expect(names).toContain('Annihilators')
  })

  afterAll(() => {
    if (perList.length === 0) return
    const rows = perList
      .map(
        row =>
          `  ${row.id.padEnd(28)} ${String(row.matched).padStart(4)}/${String(row.selections).padEnd(4)} matched` +
          `  ${String(row.unresolved).padStart(4)} unresolved  ${row.faction}`
      )
      .join('\n')
    const worst = Array.from(unresolvedByLabel.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 25)
      .map(([label, count]) => `  ${String(count).padStart(3)}x ${label}`)
      .join('\n')
    console.log(`\nNew Recruit corpus resolution\n${rows}\n\nTop unresolved\n${worst}\n`)
  })
})
