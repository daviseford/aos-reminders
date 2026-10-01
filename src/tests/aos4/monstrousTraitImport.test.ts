import type { Ability, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument, findAos4SeasonalRulesContexts } from '../../aos4/state'
import { createAos4BuilderViewModel } from '../../aos4/view'
import { decodeAos4TextRoster } from '../../importers'
import { describe, expect, it } from 'vitest'

/**
 * Issue #2038: a community report said the Seraphon Armour Cruncher enhancement was missing.
 *
 * Armour Cruncher is a Monstrous Trait in the Beasts of the Dark Jungle table of the official
 * Scourge of Aqshy - Faction Rules: Seraphon pack (2026-08-20), and the September 2026 core
 * Battle Profiles lists it at 10 points under "Scourge of Aqshy". The accepted data carries it.
 * What was missing was the builder chip: an imported roster names the single trait a monster
 * carries, the import resolves it to the individual ability, and the builder emitted that option
 * without its offering group's category, so the Monstrous Traits card filtered it out while the
 * reminder was plainly there. The same gap #1827 closed for artefacts and heroic traits.
 */

const { seasonal, current } = findAos4SeasonalRulesContexts(AOS4_CATALOG)
if (!seasonal || !current) throw new Error('The catalog is missing a standard-mode context')

const named = <T>(kind: string, name: string, rulesContextId?: string): T => {
  const entity = AOS4_CATALOG.entities.find(
    candidate =>
      candidate.kind === kind &&
      candidate.name === name &&
      (!rulesContextId || candidate.rulesContextIds.includes(rulesContextId as never))
  )
  if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
  return entity as T
}

const seraphon = named<Faction>('faction', 'Seraphon')
const beastsOfTheDarkJungle = named<ContentGroup>('content-group', 'Beasts of the Dark Jungle')
const armourCruncher = named<Ability>('ability', 'ARMOUR CRUNCHER', seasonal.id)

const officialAppRoster = (trait: string) =>
  [
    '1960/2000 pts',
    '-----',
    'Grand Alliance Order | Seraphon | Thunderquake Starhost',
    "General's Handbook 2026-27",
    'Drops: 5',
    '-----',
    "General's Regiment",
    'Saurus Oldblood on Carnosaur (230)',
    '• General',
    `• ${trait}`,
    'Stegadon (150)',
    '-----',
    'Created with Warhammer Age of Sigmar: The App',
    'App: v1.35.0 (2) | Data: v459',
  ].join('\n')

describe('Seraphon Armour Cruncher (#2038)', () => {
  it('is offered to Seraphon as a seasonal monstrous trait, per the official Scourge of Aqshy pack', () => {
    expect(beastsOfTheDarkJungle.groupType).toBe('monstrous-traits')
    expect(beastsOfTheDarkJungle.rulesContextIds).toEqual([seasonal.id])
    expect(armourCruncher.keywords).toContain('RAMPAGE')
    expect(armourCruncher.timings.map(timing => timing.raw)).toEqual(['Any Combat Phase'])

    const includes = (from: string, to: string) =>
      AOS4_CATALOG.relationships.some(
        relationship =>
          relationship.kind === 'includes' && relationship.from === from && relationship.to === to
      )
    expect(includes(beastsOfTheDarkJungle.id, armourCruncher.id)).toBe(true)
    expect(
      AOS4_CATALOG.relationships.some(
        relationship =>
          relationship.kind === 'offers' &&
          relationship.from === seraphon.id &&
          relationship.to === beastsOfTheDarkJungle.id
      )
    ).toBe(true)

    const army = createAos4ArmyDocument({
      id: 'army:seraphon-dark-jungle',
      name: 'Seraphon Dark Jungle',
      rulesContextId: seasonal.id,
      explicitSelectionIds: [seraphon.id, beastsOfTheDarkJungle.id],
    })
    const reminders = projectReminders(
      AOS4_CATALOG,
      resolveSelection(AOS4_CATALOG, {
        explicitIds: army.explicitSelectionIds,
        rulesContextId: army.rulesContextId,
      })
    ).map(reminder => reminder.name)
    expect(reminders).toContain('ARMOUR CRUNCHER')

    const tableOption = createAos4BuilderViewModel(AOS4_CATALOG, army).options.find(
      option => option.id === beastsOfTheDarkJungle.id
    )
    expect(tableOption).toMatchObject({ groupType: 'monstrous-traits', selected: true, seasonal: true })
  })

  it('shows an imported Armour Cruncher as a selected Monstrous Traits chip', () => {
    const { parsedRoster } = decodeAos4TextRoster(officialAppRoster('Armour Cruncher'))
    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'army:official-app-armour-cruncher',
    })
    expect(preview.diagnostics).toEqual([])
    const document = preview.proposedDocument!
    expect(document.rulesContextId).toBe(seasonal.id)
    expect(document.explicitSelectionIds).toContain(armourCruncher.id)

    const reminders = projectReminders(
      AOS4_CATALOG,
      resolveSelection(AOS4_CATALOG, {
        explicitIds: document.explicitSelectionIds,
        rulesContextId: document.rulesContextId,
      })
    ).map(reminder => reminder.name)
    expect(reminders).toContain('ARMOUR CRUNCHER')

    // The dropdown only renders ability options that carry a groupType, so this is exactly what
    // the Monstrous Traits card reads. Season-exclusive, so it files under the season's header.
    const chips = createAos4BuilderViewModel(AOS4_CATALOG, document).options.filter(
      option => option.groupType === 'monstrous-traits' && option.selected
    )
    expect(chips).toEqual([
      {
        id: armourCruncher.id,
        name: 'Armour Cruncher',
        kind: 'ability',
        groupType: 'monstrous-traits',
        selected: true,
        available: false,
        seasonal: true,
      },
    ])
  })

  /**
   * Issue #2053: the official app writes the trait's cost after it, `• Armour Cruncher - (10)
   * Points`, and the import warned `Couldn't find a enhancement named "Armour Cruncher - (10)
   * Points"` instead of reading the trait.
   */
  it('imports Armour Cruncher written with the official app cost suffix (#2053)', () => {
    const { parsedRoster } = decodeAos4TextRoster(officialAppRoster('Armour Cruncher - (10) Points'))
    const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
      defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      createDocumentId: () => 'army:official-app-armour-cruncher-cost',
    })
    expect(preview.diagnostics).toEqual([])
    const document = preview.proposedDocument!
    expect(document.explicitSelectionIds).toContain(armourCruncher.id)

    const chips = createAos4BuilderViewModel(AOS4_CATALOG, document).options.filter(
      option => option.groupType === 'monstrous-traits' && option.selected
    )
    expect(chips.map(chip => chip.id)).toEqual([armourCruncher.id])
  })
})
