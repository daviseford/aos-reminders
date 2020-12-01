export type TSelectionTypes =
  | 'artifacts'
  | 'battalions'
  | 'command_abilities'
  | 'command_traits'
  | 'endless_spells'
  | 'flavors'
  | 'scenery'
  | 'spells'
  | 'triumphs'
  | 'units'

export type TSelections = Record<TSelectionTypes, string[]>

export interface IAllySelections {
  units: string[]
  battalions: string[]
}
