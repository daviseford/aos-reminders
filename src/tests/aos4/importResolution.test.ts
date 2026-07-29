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

  it('resolves provider-generic enhancements only within reachable content groups', () => {
    const preview = resolve(
      roster({
        selections: [{ line: 9, label: 'Choice A', kindHint: 'enhancement' }],
      })
    )

    expect(preview.diagnostics).toEqual([])
    expect(preview.matches).toEqual([{ line: 9, label: 'Choice A', canonicalId: importFixtureIds.excludedA }])
  })

  it('fails closed on ambiguous, unknown, and inapplicable selections', () => {
    const preview = resolve(
      roster({
        selections: [
          { line: 10, label: 'Twin Formation', kindHint: 'battle-formation' },
          { line: 11, label: 'Unknown Unit', kindHint: 'warscroll' },
          { line: 12, label: 'Beta Only', kindHint: 'warscroll' },
        ],
      })
    )

    expect(preview.proposedDocument).toBeUndefined()
    expect(preview.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'ambiguous-selection', line: 10 }),
        expect.objectContaining({ code: 'unknown-selection', line: 11 }),
        expect.objectContaining({ code: 'inapplicable-selection', line: 12 }),
      ])
    )
  })

  it('defaults an omitted context with a warning and rejects historical contexts', () => {
    const defaulted = resolve(roster({ declaredContext: undefined }))
    const historical = resolve(roster({ declaredContext: 'Archive 2024' }))

    expect(defaulted.proposedDocument?.rulesContextId).toBe(importFixtureContextIds.seasonal)
    expect(defaulted.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-context', severity: 'warning' })
    )
    expect(historical.proposedDocument).toBeUndefined()
    expect(historical.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsupported-context', severity: 'error' })
    )
  })

  it('deduplicates repeated selections and blocks an invalid selection graph', () => {
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
    expect(excluded.proposedDocument).toBeUndefined()
    expect(excluded.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'invalid-selection-graph', severity: 'error' })
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
