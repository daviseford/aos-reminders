import type { ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import {
  createAos4ArmyDocument,
  findAos4SeasonalRulesContexts,
  getAos4SeasonalRulesState,
  setAos4SeasonalRules,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import { createAos4BuilderViewModel, createAos4ReminderViewModel } from '../../aos4/view'
import { describe, expect, it } from 'vitest'

/**
 * The seasonal rules switch (issue #1994) flips an army between the seasonal standard context
 * (the sitting General's Handbook) and the current standard one (battletome and core rules only).
 * Both contexts are found by status and mode — never by name or season string — and toggling is
 * non-destructive: season-exclusive selections stay in the document as inapplicable and revive
 * when the season is switched back on.
 */

const { seasonal, current } = findAos4SeasonalRulesContexts(AOS4_CATALOG)
if (!seasonal || !current) throw new Error('The catalog is missing a standard-mode context')

const spearheadContext = AOS4_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')
if (!spearheadContext) throw new Error('The catalog is missing the Spearhead context')

const groupByName = (name: string): ContentGroup => {
  const entity = AOS4_CATALOG.entities.find(
    candidate => candidate.kind === 'content-group' && candidate.name === name
  )
  if (!entity) throw new Error(`No content group named ${name} in the catalog`)
  return entity as ContentGroup
}

const factionByName = (name: string): Faction => {
  const entity = AOS4_CATALOG.entities.find(
    candidate => candidate.kind === 'faction' && candidate.name === name
  )
  if (!entity) throw new Error(`No faction named ${name} in the catalog`)
  return entity as Faction
}

const ogorArmy = (extraNames: string[] = []): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:seasonal-switch-test',
    name: 'Seasonal Switch Test',
    rulesContextId: seasonal.id,
    explicitSelectionIds: [
      factionByName('Ogor Mawtribes').id,
      ...extraNames.map(name => groupByName(name).id),
    ],
  })

describe('the seasonal rules contexts', () => {
  it('are found by status and mode, never by name or season', () => {
    expect(seasonal.mode).toBe('standard')
    expect(seasonal.status).toBe('seasonal')
    expect(current.mode).toBe('standard')
    expect(current.status).toBe('current')
    expect(seasonal.id).not.toBe(current.id)
  })

  it('include the application default, so a cleared army starts with the season on', () => {
    expect(AOS4_DEFAULT_RULES_CONTEXT_ID).toBe(seasonal.id)
  })
})

describe('the seasonal rules switch state', () => {
  it('derives from the document context', () => {
    const army = ogorArmy()
    expect(getAos4SeasonalRulesState(AOS4_CATALOG, army)).toBe('on')
    expect(
      getAos4SeasonalRulesState(AOS4_CATALOG, createAos4ArmyDocument({ ...army, rulesContextId: current.id }))
    ).toBe('off')
  })

  it('is unavailable for a document outside the two standard contexts', () => {
    const spearhead = createAos4ArmyDocument({ ...ogorArmy(), rulesContextId: spearheadContext.id })
    expect(getAos4SeasonalRulesState(AOS4_CATALOG, spearhead)).toBe('unavailable')
  })
})

describe('toggling the seasonal rules', () => {
  it('moves the context both ways without touching the selections', () => {
    // Well-Fed Beasts is a season-exclusive enhancement table in the accepted corpus; the pick
    // must survive both flips untouched.
    const army = ogorArmy(['Well-Fed Beasts'])

    const off = setAos4SeasonalRules(AOS4_CATALOG, army, false)
    expect(off.rulesContextId).toBe(current.id)
    expect(off.explicitSelectionIds).toEqual(army.explicitSelectionIds)
    expect(off.reminderPreferences).toEqual(army.reminderPreferences)

    const backOn = setAos4SeasonalRules(AOS4_CATALOG, off, true)
    expect(backOn.rulesContextId).toBe(seasonal.id)
    expect(backOn.explicitSelectionIds).toEqual(army.explicitSelectionIds)
  })

  it('returns the same instance when there is nothing to do', () => {
    const army = ogorArmy()
    expect(setAos4SeasonalRules(AOS4_CATALOG, army, true)).toBe(army)

    const spearhead = createAos4ArmyDocument({ ...army, rulesContextId: spearheadContext.id })
    expect(setAos4SeasonalRules(AOS4_CATALOG, spearhead, false)).toBe(spearhead)
    expect(setAos4SeasonalRules(AOS4_CATALOG, spearhead, true)).toBe(spearhead)
  })
})

describe('what the switch does to the reminders', () => {
  const provenanceLabels = (reminders: ReturnType<typeof createAos4ReminderViewModel>): string[] =>
    reminders.flatMap(reminder =>
      reminder.tags.filter(tag => tag.tone === 'provenance').map(tag => tag.label)
    )

  it('removes the seasonal group when off and restores it when on', () => {
    const army = ogorArmy()
    const seasonalNames = ['RAISING THE HEAT', 'FIGHT THROUGH THE PAIN']

    const withSeason = createAos4ReminderViewModel(AOS4_CATALOG, army)
    seasonalNames.forEach(name => {
      expect(withSeason.some(reminder => reminder.name === name)).toBe(true)
    })
    expect(provenanceLabels(withSeason)).toContain('Seasonal')

    const withoutSeason = createAos4ReminderViewModel(
      AOS4_CATALOG,
      setAos4SeasonalRules(AOS4_CATALOG, army, false)
    )
    seasonalNames.forEach(name => {
      expect(withoutSeason.some(reminder => reminder.name === name)).toBe(false)
    })
    expect(provenanceLabels(withoutSeason)).not.toContain('Seasonal')
    // The battletome and core rules are still an army: only the season left.
    expect(withoutSeason.length).toBeGreaterThan(0)
    expect(withoutSeason.some(reminder => reminder.name === 'BULL CHARGE')).toBe(true)

    const restored = createAos4ReminderViewModel(
      AOS4_CATALOG,
      setAos4SeasonalRules(AOS4_CATALOG, setAos4SeasonalRules(AOS4_CATALOG, army, false), true)
    )
    seasonalNames.forEach(name => {
      expect(restored.some(reminder => reminder.name === name)).toBe(true)
    })
  })
})

describe('what the switch does to the builder', () => {
  it('stops offering season-exclusive content when off', () => {
    const army = ogorArmy()
    const monstrousTraits = groupByName('Well-Fed Beasts')

    const onOptions = createAos4BuilderViewModel(AOS4_CATALOG, army).options
    expect(onOptions.some(option => option.id === monstrousTraits.id && option.available)).toBe(true)

    const offOptions = createAos4BuilderViewModel(
      AOS4_CATALOG,
      setAos4SeasonalRules(AOS4_CATALOG, army, false)
    ).options
    expect(offOptions.some(option => option.id === monstrousTraits.id)).toBe(false)
  })

  /*
   * Non-destructive means the pick outlives its season: it leaves the selected chips and cannot be
   * re-picked, but it stays visible as a disabled option under the season's own header — its
   * `seasonal` marker, not a misread `historical` overlay — and its inapplicability is on the
   * record in the selection diagnostics.
   */
  it('keeps an already-picked seasonal enhancement visible but inapplicable when off', () => {
    const army = ogorArmy(['Well-Fed Beasts'])
    const monstrousTraits = groupByName('Well-Fed Beasts')

    const on = createAos4BuilderViewModel(AOS4_CATALOG, army)
    const onOption = on.options.find(option => option.id === monstrousTraits.id)
    expect(onOption).toMatchObject({ selected: true, available: true, seasonal: true })

    const off = createAos4BuilderViewModel(AOS4_CATALOG, setAos4SeasonalRules(AOS4_CATALOG, army, false))
    const offOption = off.options.find(option => option.id === monstrousTraits.id)
    expect(offOption).toBeDefined()
    expect(offOption!.selected).toBe(false)
    expect(offOption!.available).toBe(false)
    expect(offOption!.seasonal).toBe(true)
    expect(offOption!.overlay).toBeUndefined()
    expect(
      off.selection.diagnostics.some(
        diagnostic =>
          diagnostic.code === 'inapplicable-explicit-selection' && diagnostic.subject === monstrousTraits.id
      )
    ).toBe(true)
  })
})
