import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { normalizeImportLabel, resolveParsedRoster, type ParsedRoster } from '../../aos4/import'
import {
  createImportFixtureCatalog,
  importFixtureContextIds,
  importFixtureIds,
} from '../fixtures/aos4/import/catalog'

const roster = (overrides: Partial<ParsedRoster> = {}): ParsedRoster => ({
  source: 'official-app-text',
  proposedName: 'Imported Alpha',
  declaredContext: 'Scourge of Tests',
  declaredFaction: 'Alpha Hosts',
  selections: [
    { line: 3, label: 'Shared Guard', kindHint: 'warscroll' },
    { line: 4, label: 'Focused Formation', kindHint: 'battle-formation' },
  ],
  ...overrides,
})

const resolve = (parsedRoster: ParsedRoster) =>
  resolveParsedRoster(createImportFixtureCatalog(), parsedRoster, {
    defaultRulesContextId: importFixtureContextIds.seasonal,
    createDocumentId: () => 'army:import-test',
  })

describe('AoS 4 import label normalization', () => {
  it('normalizes provider formatting without introducing alias corrections', () => {
    expect(normalizeImportLabel(' • 2 × Shared–Guard — 240 pts ')).toBe('shared guard')
    expect(normalizeImportLabel('Knight’s Honour')).toBe('knight s honour')
    expect(normalizeImportLabel('Crypt Flayers (2 Models)')).toBe('crypt flayers')
  })
})

describe('AoS 4 parsed-roster resolution', () => {
  it('resolves a unique faction-reachable composition to canonical IDs', () => {
    const preview = resolve(roster())

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 3, label: 'Shared Guard', canonicalId: importFixtureIds.alphaGuard },
      { line: 4, label: 'Focused Formation', canonicalId: importFixtureIds.focusedFormation },
    ])
    expect(preview.proposedDocument).toMatchObject({
      id: 'army:import-test',
      name: 'Imported Alpha',
      rulesContextId: importFixtureContextIds.seasonal,
      explicitSelectionIds: [
        importFixtureIds.focusedFormation,
        importFixtureIds.alphaFaction,
        importFixtureIds.alphaGuard,
      ],
      reminderPreferences: {},
    })
  })

  it('narrows same-named candidates by kind and faction reachability', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 8, label: 'Shared Guard', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 8, label: 'Shared Guard', canonicalId: importFixtureIds.alphaGuard },
    ])
  })

  /**
   * A seasonal qualifier names the battlepack's replacement warscroll, not the base one.
   *
   * The catalog carries the replacement as its own entity with the battlepack prefixed
   * ("Scourge of Tests Shared Guard") alongside the base warscroll in the same seasonal context.
   * Resolving the qualified label to the base warscroll hands the player the wrong unit's
   * reminders (#1862).
   */
  it("resolves New Recruit's parenthetical seasonal qualifier to the seasonal variant warscroll", () => {
    const preview = resolve(
      roster({
        source: 'roster-xml',
        selections: [{ line: 8, label: 'Shared Guard (Scourge of Tests)', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 8, label: 'Shared Guard (Scourge of Tests)', canonicalId: importFixtureIds.alphaGuardSeasonal },
    ])
  })

  it("resolves Listbot's abbreviated seasonal qualifier to the seasonal variant warscroll", () => {
    const preview = resolve(
      roster({
        source: 'listbot-text',
        selections: [{ line: 8, label: 'Shared Guard [SoT]', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 8, label: 'Shared Guard [SoT]', canonicalId: importFixtureIds.alphaGuardSeasonal },
    ])
  })

  /**
   * Not every unit gains a seasonal replacement. When the catalog carries no battlepack-prefixed
   * variant, the qualifier is redundant restatement of the context and stripping it recovers the
   * one warscroll the roster can mean.
   */
  it('strips the seasonal qualifier when no seasonal variant warscroll exists', () => {
    const preview = resolve(
      roster({
        source: 'listbot-text',
        selections: [{ line: 8, label: 'Twin Era Guard [SoT]', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 8, label: 'Twin Era Guard [SoT]', canonicalId: importFixtureIds.twinEraCurrent },
    ])
  })

  it('resolves provider-generic enhancements only within reachable content groups', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 9, label: 'Choice A', kindHint: 'enhancement' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([{ line: 9, label: 'Choice A', canonicalId: importFixtureIds.excludedA }])
  })

  /**
   * Skipping is the point: the army still imports, minus the names we could not place. Each one
   * is a warning rather than a guess, so the result is incomplete instead of wrong.
   */
  it('skips ambiguous, unknown, and inapplicable selections with warnings', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 10, label: 'Twin Formation', kindHint: 'battle-formation' },
          { line: 11, label: 'Unknown Unit', kindHint: 'warscroll' },
          { line: 12, label: 'Beta Only', kindHint: 'warscroll' },
          { line: 13, label: 'Shared Guard', kindHint: 'warscroll' },
        ],
      })
    )

    expect(preview.proposedDocument).toBeDefined()
    expect(preview.proposedDocument?.explicitSelectionIds).toEqual([
      importFixtureIds.alphaFaction,
      importFixtureIds.alphaGuard,
    ])
    expect(preview.diagnostics.every(diagnostic => diagnostic.severity === 'warning')).toBe(true)
    expect(preview.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'ambiguous-selection', line: 10, severity: 'warning' }),
        expect.objectContaining({ code: 'unknown-selection', line: 11, severity: 'warning' }),
        expect.objectContaining({ code: 'inapplicable-selection', line: 12, severity: 'warning' }),
      ])
    )
  })

  /**
   * A regiment of renown is bought as a whole and brings units the army cannot otherwise field, so
   * the faction boundary that correctly rejects "Beta Only" above must not apply to its members.
   */
  it('resolves a regiment of renown member the faction cannot otherwise reach', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 12, label: 'Beta Only', kindHint: 'warscroll', isRegimentOfRenown: true }],
      })
    )

    expect(preview.proposedDocument?.explicitSelectionIds).toEqual([
      importFixtureIds.alphaFaction,
      importFixtureIds.betaOnly,
    ])
    expect(preview.diagnostics.filter(diagnostic => diagnostic.code === 'inapplicable-selection')).toEqual([])
  })

  it('still refuses to guess between two candidates for a regiment of renown member', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 10, label: 'Twin Formation', kindHint: 'battle-formation', isRegimentOfRenown: true },
        ],
      })
    )

    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'ambiguous-selection', line: 10, severity: 'warning' })
    )
  })

  it("prefers the faction's own reachable version for a regiment of renown member", () => {
    // Reachability is tried first, so a name the faction *can* reach still resolves to its own
    // version rather than being decided by the relaxed pass.
    const preview = resolve(
      roster({
        selections: [{ line: 13, label: 'Shared Guard', kindHint: 'warscroll', isRegimentOfRenown: true }],
      })
    )

    expect(preview.proposedDocument?.explicitSelectionIds).toEqual([
      importFixtureIds.alphaFaction,
      importFixtureIds.alphaGuard,
    ])
  })

  it('names the selection it could not place', () => {
    const preview = resolve(
      roster({ selections: [{ line: 11, label: 'Twilit Sorceries', kindHint: 'manifestation-lore' }] })
    )

    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        message: expect.stringContaining('Twilit Sorceries'),
      })
    )
  })

  /**
   * A context we do not carry falls back instead of failing — builders ship new battlepacks
   * before we do, and the preview lets the player correct the guess.
   */
  it('defaults an omitted context and falls back from an unsupported one', () => {
    const defaulted = resolve(roster({ declaredContext: undefined }))
    const historical = resolve(roster({ declaredContext: 'Archive 2024' }))

    expect(defaulted.proposedDocument?.rulesContextId).toBe(importFixtureContextIds.seasonal)
    expect(defaulted.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-context', severity: 'warning' })
    )
    expect(historical.proposedDocument?.rulesContextId).toBe(importFixtureContextIds.seasonal)
    expect(historical.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-context', severity: 'warning' })
    )
  })

  it('deduplicates repeated selections and imports a composition the graph objects to', () => {
    const duplicate = resolve(
      roster({
        selections: [
          { line: 20, label: 'Shared Guard', kindHint: 'warscroll', count: 2 },
          { line: 21, label: 'Shared Guard', kindHint: 'warscroll' },
        ],
      })
    )
    const excluded = resolve(
      roster({
        selections: [
          { line: 30, label: 'Choice A', kindHint: 'artefact-of-power' },
          { line: 31, label: 'Choice B', kindHint: 'artefact-of-power' },
        ],
      })
    )

    expect(duplicate.proposedDocument?.explicitSelectionIds).toEqual([
      importFixtureIds.alphaFaction,
      importFixtureIds.alphaGuard,
    ])
    expect(duplicate.matches).toHaveLength(2)
    // Legality belongs to a list builder, not to us — flag it and still hand over the army.
    expect(excluded.proposedDocument).toBeDefined()
    expect(excluded.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'invalid-selection-graph', severity: 'warning' })
    )
  })

  /**
   * A container row is not an army (#1796). Resolving one would hand back a force with no units
   * and no way for the player to tell why, so it is absent from the search space entirely and the
   * roster fails where they can see it.
   */
  it('does not resolve a faction row that offers no warscrolls', () => {
    const container = resolve(roster({ declaredFaction: 'Endless Spells', selections: [] }))

    expect(container.proposedDocument).toBeUndefined()
    expect(container.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'missing-faction', severity: 'error' })
    )
  })

  it('rejects a roster without a faction and round-trips the proposed document', () => {
    const missingFaction = resolve(roster({ declaredFaction: undefined }))

    expect(missingFaction.proposedDocument).toBeUndefined()
    expect(missingFaction.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'missing-faction', severity: 'error' })
    )
  })
})

describe('AoS 4 Legends resolution', () => {
  /**
   * The point of the opt-in: a list that mixes a faction's current units with its retired ones
   * imports whole, in the roster's own context, and the document remembers the opt-in so the
   * builder and reminders keep resolving the Legends half after the import.
   */
  it('imports a mixed current-and-Legends list when the roster opts in', () => {
    const preview = resolve(
      roster({
        allowsLegends: true,
        selections: [
          { line: 3, label: 'Shared Guard', kindHint: 'warscroll' },
          { line: 4, label: 'Retired Champion', kindHint: 'warscroll', isLegends: true },
        ],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 3, label: 'Shared Guard', canonicalId: importFixtureIds.alphaGuard },
      { line: 4, label: 'Retired Champion', canonicalId: importFixtureIds.alphaRetired },
    ])
    expect(preview.proposedDocument).toMatchObject({
      rulesContextId: importFixtureContextIds.seasonal,
      allowsLegends: true,
      explicitSelectionIds: expect.arrayContaining([importFixtureIds.alphaRetired]),
    })
  })

  it('finds Legends content even when the builder did not tag the selection', () => {
    const preview = resolve(
      roster({
        allowsLegends: true,
        selections: [{ line: 5, label: 'Retired Champion', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 5, label: 'Retired Champion', canonicalId: importFixtureIds.alphaRetired },
    ])
  })

  /**
   * Names collide across the Legends boundary — a unit retired and later reintroduced keeps its
   * name but is a different warscroll. The per-selection tag records which side the builder filed
   * the entry on, so the same label resolves to different canonical IDs.
   */
  it('prefers the side of the Legends boundary the builder filed the entry on', () => {
    const untagged = resolve(
      roster({
        allowsLegends: true,
        selections: [{ line: 6, label: 'Twin Era Guard', kindHint: 'warscroll' }],
      })
    )
    const tagged = resolve(
      roster({
        allowsLegends: true,
        selections: [{ line: 6, label: 'Twin Era Guard', kindHint: 'warscroll', isLegends: true }],
      })
    )

    expect(untagged.diagnostics).toEqual([])
    expect(untagged.matches).toEqual([
      { line: 6, label: 'Twin Era Guard', canonicalId: importFixtureIds.twinEraCurrent },
    ])
    expect(tagged.diagnostics).toEqual([])
    expect(tagged.matches).toEqual([
      { line: 6, label: 'Twin Era Guard', canonicalId: importFixtureIds.twinEraLegends },
    ])
  })

  it('still skips Legends content, with the reason, when the roster does not opt in', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 7, label: 'Retired Champion', kindHint: 'warscroll' }],
      })
    )

    expect(preview.matches).toEqual([])
    expect(preview.proposedDocument?.allowsLegends).toBeUndefined()
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-selection',
        severity: 'warning',
        line: 7,
        message: expect.stringContaining('does not opt into Legends'),
      })
    )
  })
})

/**
 * Armies of Renown, which the catalog models by nesting instead of naming (issue #1783).
 *
 * The catalog holds an army as a container group with its sections beneath it; a roster names the
 * army in the battle-formation slot and its sections as `<army> <section>`. Neither form matches a
 * catalog name directly, so before this every Army of Renown list lost its army rules entirely.
 */
describe('AoS 4 Army of Renown resolution', () => {
  it('resolves the army named in the battle-formation slot', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 3, label: 'Renowned Vanguard', kindHint: 'battle-formation' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 3, label: 'Renowned Vanguard', canonicalId: importFixtureIds.renownedVanguard },
    ])
  })

  it('selecting the army brings in the sections nested under it', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 3, label: 'Renowned Vanguard', kindHint: 'battle-formation' }],
      })
    )

    expect(preview.proposedDocument?.explicitSelectionIds).toContain(importFixtureIds.renownedVanguard)
    expect(preview.diagnostics.filter(diagnostic => diagnostic.severity === 'error')).toEqual([])
  })

  it('resolves a section by the army-qualified name a roster writes', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 8, label: 'Renowned Vanguard Spell Lore', kindHint: 'spell-lore' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      {
        line: 8,
        label: 'Renowned Vanguard Spell Lore',
        canonicalId: importFixtureIds.renownedVanguardSpellLore,
      },
    ])
  })

  it('refuses a qualified name whose section is the wrong kind of content', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 8, label: 'Renowned Vanguard Battle Traits', kindHint: 'spell-lore' }],
      })
    )

    expect(preview.matches).toEqual([])
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unknown-selection', line: 8 })
    )
  })

  /**
   * A bare section name stays unresolvable, because it does not identify anything.
   *
   * Thirty-seven armies in the accepted corpus have a section called "Spell Lore". Matching one of
   * them on that name alone would be a coin flip dressed up as a resolution.
   */
  it('does not resolve a section by its unqualified name', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 8, label: 'Spell Lore', kindHint: 'spell-lore' }],
      })
    )

    expect(preview.matches).toEqual([])
  })
})

/**
 * Rosters built against a lapsed General's Handbook (issue #1783).
 *
 * A season's content moves to the historical context when its handbook expires, while the army's
 * warscrolls carry on unchanged. Falling back to the current season without an overlay therefore
 * drops precisely the seasonal picks that defined the list.
 */
describe('AoS 4 superseded-season resolution', () => {
  const supersededRoster = (selections: ParsedRoster['selections']): ParsedRoster =>
    roster({ declaredContext: "General's Handbook 2024-25", selections })

  it('keeps the lapsed season available while importing into the current one', () => {
    const preview = resolve(supersededRoster([{ line: 9, label: 'Archive Guard', kindHint: 'warscroll' }]))

    expect(preview.matches).toEqual([
      { line: 9, label: 'Archive Guard', canonicalId: importFixtureIds.archiveGuard },
    ])
    expect(preview.proposedDocument?.rulesContextId).toBe(importFixtureContextIds.seasonal)
    expect(preview.proposedDocument?.allowsHistorical).toBe(true)
    expect(preview.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unsupported-context',
        severity: 'warning',
        message: expect.stringContaining('has been superseded'),
      })
    )
  })

  it('resolves a formation the lapsed season introduced', () => {
    const preview = resolve(
      supersededRoster([{ line: 4, label: 'Archive Formation', kindHint: 'battle-formation' }])
    )

    expect(preview.matches).toEqual([
      { line: 4, label: 'Archive Formation', canonicalId: importFixtureIds.archiveFormation },
    ])
  })

  it('prefers the current season when a name exists on both sides', () => {
    const preview = resolve(supersededRoster([{ line: 3, label: 'Shared Guard', kindHint: 'warscroll' }]))

    expect(preview.matches).toEqual([
      { line: 3, label: 'Shared Guard', canonicalId: importFixtureIds.alphaGuard },
    ])
  })

  it('leaves a roster on the current season untouched', () => {
    const preview = resolve(
      roster({ selections: [{ line: 9, label: 'Archive Guard', kindHint: 'warscroll' }] })
    )

    expect(preview.matches).toEqual([])
    expect(preview.proposedDocument?.allowsHistorical).toBeUndefined()
  })

  /**
   * A season we have not published yet is not a lapsed one.
   *
   * Builders carry a new handbook before we do, and treating "ahead of us" as "behind us" would
   * quietly resolve next season's picks against last season's content.
   */
  it('does not overlay history for a season newer than the one we carry', () => {
    const preview = resolve(
      roster({
        declaredContext: "General's Handbook 2027-28",
        selections: [{ line: 9, label: 'Archive Guard', kindHint: 'warscroll' }],
      })
    )

    expect(preview.matches).toEqual([])
    expect(preview.proposedDocument?.allowsHistorical).toBeUndefined()
  })
})

/**
 * The report behind the fixtures: issue #1862.
 *
 * A New Recruit Kruleboyz roster named its hero "Killaboss with Stab-grot (Scourge of Aqshy)" and
 * the importer stripped the qualifier straight to the battletome warscroll, so the player got the
 * standard unit's reminders instead of the seasonal replacement's. Pinned against the shipped
 * catalog because the fixture catalog can only prove the logic, not that the real corpus carries
 * both warscrolls for the resolution to distinguish.
 */
describe('seasonal variant resolution against the shipped catalog (#1862)', () => {
  const resolveShipped = (label: string) =>
    resolveParsedRoster(
      AOS4_CATALOG,
      {
        source: 'roster-xml',
        proposedName: 'Issue 1862',
        declaredContext: "General's Handbook 2026-27",
        declaredFaction: 'Kruleboyz',
        selections: [{ line: 1, label, kindHint: 'warscroll' }],
      },
      {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => 'army:issue-1862',
      }
    )

  const warscrollIdByName = (name: string) => {
    const entity = AOS4_CATALOG.entities.find(
      candidate => candidate.kind === 'warscroll' && candidate.name === name
    )
    if (!entity) throw new Error(`expected the shipped catalog to carry the warscroll "${name}"`)
    return entity.id
  }

  it('resolves the qualified label to the Scourge of Aqshy replacement warscroll', () => {
    const preview = resolveShipped('Killaboss with Stab-grot (Scourge of Aqshy)')

    expect(preview.matches).toEqual([
      {
        line: 1,
        label: 'Killaboss with Stab-grot (Scourge of Aqshy)',
        canonicalId: warscrollIdByName('Scourge of Aqshy Killaboss with Stab-grot'),
      },
    ])
  })

  it('still resolves the unqualified label to the battletome warscroll', () => {
    const preview = resolveShipped('Killaboss with Stab-grot')

    expect(preview.matches).toEqual([
      {
        line: 1,
        label: 'Killaboss with Stab-grot',
        canonicalId: warscrollIdByName('Killaboss with Stab-grot'),
      },
    ])
  })
})

/**
 * The report behind these: issue #1979.
 *
 * The official app prints a manifestation lore as one line — `Manifestation Lore - Manifestations
 * of the Deepwood` — and never lists the Gladewyrm, Spiteswarm Hive, or Vengeful Skullroot as
 * units, because taking the lore *is* taking its manifestations. This app models each
 * manifestation as its own selectable warscroll, so an import that stopped at the lore left the
 * player adding all three by hand. The lore's `SUMMON <NAME>` spells nominate the warscrolls by
 * name; only a unique, reachable nomination is accepted.
 */
describe('AoS 4 manifestation-lore resolution', () => {
  it('imports the manifestation warscrolls the resolved lore summons', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 5, label: 'Wild Lore', kindHint: 'manifestation-lore' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 5, label: 'Wild Lore', canonicalId: importFixtureIds.wildLore },
      { line: 5, label: 'Wild Serpent', canonicalId: importFixtureIds.wildSerpent },
    ])
    expect(preview.proposedDocument?.explicitSelectionIds).toContain(importFixtureIds.wildSerpent)
  })

  it('never guesses: a summon without a warscroll or with two same-named warscrolls adds nothing', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 5, label: 'Wild Lore', kindHint: 'manifestation-lore' }],
      })
    )

    const matchedIds = preview.matches.map(match => match.canonicalId)
    // SUMMON LOST SHRINE names no warscroll; SUMMON TWIN IDOL names two.
    expect(matchedIds).not.toContain(importFixtureIds.twinIdolA)
    expect(matchedIds).not.toContain(importFixtureIds.twinIdolB)
  })

  it('does not duplicate a manifestation the roster also names as a unit', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 5, label: 'Wild Lore', kindHint: 'manifestation-lore' },
          { line: 6, label: 'Wild Serpent', kindHint: 'warscroll' },
        ],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 5, label: 'Wild Lore', canonicalId: importFixtureIds.wildLore },
      { line: 6, label: 'Wild Serpent', canonicalId: importFixtureIds.wildSerpent },
    ])
  })
})

/**
 * The roster from issue #1979, pinned against the shipped catalog: a Sylvaneth list whose
 * `Manifestations of the Deepwood` lore must bring the Gladewyrm, Spiteswarm Hive, and Vengeful
 * Skullroot with it. The fixture catalog proves the logic; this proves the real corpus carries
 * the summon spells and warscrolls for the bridge to land on.
 */
describe('manifestation import against the shipped catalog (#1979)', () => {
  it('imports the three Deepwood manifestations from the lore line alone', () => {
    const preview = resolveParsedRoster(
      AOS4_CATALOG,
      {
        source: 'official-app-text',
        proposedName: 'Issue 1979',
        declaredContext: "General's Handbook 2026-27",
        declaredFaction: 'Sylvaneth',
        selections: [{ line: 1, label: 'Manifestations of the Deepwood', kindHint: 'manifestation-lore' }],
      },
      {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => 'army:issue-1979',
      }
    )

    expect(preview.diagnostics).toEqual([])
    const matchedNames = preview.matches.map(match => {
      const entity = AOS4_CATALOG.entities.find(candidate => candidate.id === match.canonicalId)
      return entity?.name
    })
    expect(matchedNames).toEqual(
      expect.arrayContaining([
        'Manifestations of the Deepwood',
        'Gladewyrm',
        'Spiteswarm Hive',
        'Vengeful Skullroot',
      ])
    )
  })
})

/**
 * A roster writes each artefact and heroic trait under the hero carrying it, and the parsers keep
 * that as `bearerLine`. Resolution joins both lines to their canonical matches so the document
 * remembers which unit carries which enhancement (#1989). The join never guesses: an unresolved
 * side records nothing, and a genuinely ambiguous assignment is dropped rather than misattributed.
 */
describe('imported enhancement bearers (#1989)', () => {
  it('maps a resolved enhancement to the unit it was written under', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 3, label: 'Shared Guard', kindHint: 'warscroll' },
          { line: 4, label: 'Keen Blade', kindHint: 'enhancement', bearerLine: 3 },
        ],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.proposedDocument?.explicitSelectionIds).toContain(importFixtureIds.keenBlade)
    expect(preview.proposedDocument?.enhancementBearers).toEqual({
      [importFixtureIds.keenBlade]: importFixtureIds.alphaGuard,
    })
  })

  it('drops the mapping when the same enhancement resolves onto two different bearers', () => {
    // The flat map has one slot per enhancement ID. Two heroes with the same-named enhancement
    // (both resolve to the same catalog ability) cannot both be recorded, and picking one would
    // attribute the other hero's enhancement to the wrong unit — so neither is.
    const preview = resolve(
      roster({
        selections: [
          { line: 3, label: 'Shared Guard', kindHint: 'warscroll' },
          { line: 4, label: 'Keen Blade', kindHint: 'enhancement', bearerLine: 3 },
          { line: 5, label: 'Twin Era Guard', kindHint: 'warscroll' },
          { line: 6, label: 'Keen Blade', kindHint: 'enhancement', bearerLine: 5 },
        ],
      })
    )

    expect(preview.proposedDocument?.explicitSelectionIds).toContain(importFixtureIds.keenBlade)
    expect(preview.proposedDocument?.enhancementBearers).toBeUndefined()
  })

  it('records no bearer when the bearer line itself did not resolve', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 3, label: 'No Such Unit', kindHint: 'warscroll' },
          { line: 4, label: 'Keen Blade', kindHint: 'enhancement', bearerLine: 3 },
        ],
      })
    )

    // The enhancement still imports on its own; only the attribution is missing.
    expect(preview.proposedDocument?.explicitSelectionIds).toContain(importFixtureIds.keenBlade)
    expect(preview.proposedDocument?.enhancementBearers).toBeUndefined()
  })
})
