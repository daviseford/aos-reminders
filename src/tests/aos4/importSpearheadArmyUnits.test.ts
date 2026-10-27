import { AOS4_CATALOG } from '../../aos4/generated'
import { resolveParsedRoster, type ParsedRosterSelection } from '../../aos4/import'

/**
 * Two Spearhead armies of one faction can field units with the same name: Tyrant's Bellow and
 * Warglutt Marauders both have a Tyrant, Scrapglutt and Warglutt Marauders both have Ironguts
 * (corpus 2026-10-27, #1757). A roster names its army, so a unit line resolves to that army's copy;
 * without an army, or with two, the name stays ambiguous rather than guessed.
 */
const SPEARHEAD = AOS4_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!.id

const importSpearhead = (faction: string, groups: string[], units: string[]) =>
  resolveParsedRoster(
    AOS4_CATALOG,
    {
      source: 'official-app-text',
      proposedName: 'Spearhead import',
      declaredFaction: faction,
      selections: [
        ...groups.map((label, index): ParsedRosterSelection => ({
          line: 2 + index,
          label,
          kindHint: 'battle-formation',
        })),
        ...units.map((label, index): ParsedRosterSelection => ({
          line: 10 + index,
          label,
          kindHint: 'warscroll',
        })),
      ],
    },
    { defaultRulesContextId: SPEARHEAD, createDocumentId: () => 'army:spearhead-import' }
  )

const unitIds = (preview: ReturnType<typeof importSpearhead>) =>
  preview.matches.filter(match => match.line >= 10).map(match => [match.label, match.canonicalId])
const ambiguous = (preview: ReturnType<typeof importSpearhead>) =>
  preview.diagnostics.filter(diagnostic => diagnostic.code === 'ambiguous-selection').map(d => d.line)

describe('Spearhead unit import within the chosen army (#1757)', () => {
  it.each([
    ['Tyrant’s Bellow', ['Tyrant'], [['Tyrant', 'warscroll:12f70eb5-6061-54fb-a854-c0adcaa740d7']]],
    ['Scrapglutt', ['Ironguts'], [['Ironguts', 'warscroll:6840f7c7-ba04-5c2d-bc03-5095946e9e32']]],
    [
      'Warglutt Marauders',
      ['Tyrant', 'Ironguts'],
      [
        ['Tyrant', 'warscroll:93b4ab0f-cb15-5a13-ab6f-21da153701f7'],
        ['Ironguts', 'warscroll:d31273a2-6e04-5120-aaec-dc80d3dfa8be'],
      ],
    ],
  ])('resolves %s units to that army’s own warscrolls', (army, units, expected) => {
    const preview = importSpearhead('Ogor Mawtribes', [army], units)

    expect(ambiguous(preview)).toEqual([])
    expect(unitIds(preview)).toEqual(expected)
  })

  it('resolves a same-name unit shared by two Seraphon Spearheads to the named army', () => {
    expect(unitIds(importSpearhead('Seraphon', ['Sunblooded Prowlers'], ['Saurus Warriors']))).toEqual([
      ['Saurus Warriors', 'warscroll:3d537ff9-41a4-5b14-9110-8946f7a2f750'],
    ])
    expect(unitIds(importSpearhead('Seraphon', ['Starscale Warhost'], ['Saurus Warriors']))).toEqual([
      ['Saurus Warriors', 'warscroll:75b4e511-27e6-580d-bfbb-feba3cbddfe6'],
    ])
  })

  it('still refuses to guess with no army or with two armies that both field the unit', () => {
    expect(ambiguous(importSpearhead('Ogor Mawtribes', [], ['Tyrant']))).toEqual([10])
    expect(
      ambiguous(importSpearhead('Ogor Mawtribes', ['Tyrant’s Bellow', 'Warglutt Marauders'], ['Tyrant']))
    ).toEqual([10])
  })
})
