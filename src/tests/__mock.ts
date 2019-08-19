import { ISelections, IAllySelections } from '../types/selections'

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

export const selectionsFactory = (options: ISelectionsFactoryOptions): ISelections => {
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
    allegiances,
    artifacts,
    battalions,
    commands,
    endless_spells,
    scenery,
    spells,
    traits,
    triumphs,
    units,
  }
}

export const allySelectionsFactory = (units: string[] = []): IAllySelections => ({ units })
