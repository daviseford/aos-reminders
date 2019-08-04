import { IArmy } from '../types/army'
import { ISelections, IAllySelections } from '../types/selections'

interface ISelectionsFactoryOptions {
  artifacts?: string[]
  battalions?: string[]
  endless_spells?: string[]
  spells?: string[]
  traits?: string[]
  units?: string[]
}

export const selectionsFactory = (options: ISelectionsFactoryOptions): ISelections => {
  const { artifacts = [], battalions = [], endless_spells = [], spells = [], traits = [], units = [] } = options
  return { artifacts, battalions, endless_spells, spells, traits, units }
}

export const allySelectionsFactory = (units: string[] = []): IAllySelections => ({ units })
