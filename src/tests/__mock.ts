import { IAllySelections, TSelections } from '../types/selections'

export const selectionsFactory = (options: Partial<TSelections>): TSelections => {
  const {
    artifacts = [],
    battalions = [],
    command_abilities = [],
    command_traits = [],
    endless_spells = [],
    flavors = [],
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
    endless_spells,
    flavors,
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
