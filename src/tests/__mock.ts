import { IAllySelections, TSelections } from '../types/selections'

export const selectionsFactory = (options: Partial<TSelections>): TSelections => {
  const {
    artifacts = [],
    battalions = [],
    command_abilities = [],
    command_traits = [],
    core_rules = [],
    endless_spells = [],
    flavors = [],
    grand_strategies = [],
    mount_traits = [],
    prayers = [],
    scenery = [],
    spells = [],
    triumphs = [],
    units = [],
  } = options

  return {
    artifacts,
    battalions,
    command_abilities,
    command_traits,
    core_rules,
    endless_spells,
    flavors,
    grand_strategies,
    mount_traits,
    prayers,
    scenery,
    spells,
    triumphs,
    units,
  }
}

export const allySelectionsFactory = (units: string[] = [], battalions: string[] = []): IAllySelections => ({
  units,
  battalions,
})
