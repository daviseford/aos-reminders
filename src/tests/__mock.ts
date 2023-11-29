import { TSelections } from '../types/selections'

export const selectionsFactory = (options: Partial<TSelections>): TSelections => {
  const {
    artifacts = [],
    battalions = [],
    battle_tactics = [],
    command_abilities = [],
    command_traits = [],
    core_rules = [],
    endless_spells = [],
    flavors = [],
    grand_strategies = [],
    incarnates = [],
    monstrous_rampages = [],
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
    battle_tactics,
    command_abilities,
    command_traits,
    core_rules,
    endless_spells,
    flavors,
    grand_strategies,
    incarnates,
    monstrous_rampages,
    mount_traits,
    prayers,
    scenery,
    spells,
    triumphs,
    units,
  }
}
