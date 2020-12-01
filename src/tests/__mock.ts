import { IAllySelections, TSelections } from '../types/selections'

interface ISelectionsFactoryOptions {
  allegiances?: string[]
  artifacts?: string[]
  battalions?: string[]
  commands?: string[]
  endless_spells?: string[]
  scenery?: string[]
  spells?: string[]
  traits?: string[]
  triumphs?: string[]
  units?: string[]
}

export const selectionsFactory = (options: ISelectionsFactoryOptions): TSelections => {
  const {
    allegiances = [],
    artifacts = [],
    battalions = [],
    commands = [],
    endless_spells = [],
    scenery = [],
    spells = [],
    traits = [],
    triumphs = [],
    units = [],
  } = options
  return {
    flavors: allegiances,
    artifacts,
    battalions,
    command_abilities: commands,
    endless_spells,
    scenery,
    spells,
    command_traits: traits,
    triumphs,
    units,
  }
}

export const allySelectionsFactory = (units: string[] = [], battalions: string[] = []): IAllySelections => ({
  units,
  battalions,
})
