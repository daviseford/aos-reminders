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

  it("resolves Listbot's abbreviated seasonal qualifier in the selected context", () => {
    const preview = resolve(
      roster({
        source: 'listbot-text',
        selections: [{ line: 8, label: 'Shared Guard [SoT]', kindHint: 'warscroll' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([
      { line: 8, label: 'Shared Guard [SoT]', canonicalId: importFixtureIds.alphaGuard },
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
