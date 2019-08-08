import { ISelections, IAllySelections } from '../types/selections'

interface ISelectionsFactoryOptions {
  allegiances?: string[]
  artifacts?: string[]
  battalions?: string[]
  endless_spells?: string[]
  spells?: string[]
  traits?: string[]
  units?: string[]
}

export const selectionsFactory = (options: ISelectionsFactoryOptions): ISelections => {
  const {
    allegiances = [],
    artifacts = [],
    battalions = [],
    endless_spells = [],
    spells = [],
    traits = [],
    units = [],
  } = options
  return { allegiances, artifacts, battalions, endless_spells, spells, traits, units }
}

export const allySelectionsFactory = (units: string[] = []): IAllySelections => ({ units })
