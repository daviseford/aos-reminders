export type TSelectionTypes =
  | 'artifacts'
  | 'battalions'
  | 'command_abilities'
  | 'command_traits'
  | 'endless_spells'
  | 'flavors'
  | 'prayers'
  | 'scenery'
  | 'spells'
  | 'triumphs'
  | 'units'

export type TSelections = Record<TSelectionTypes, string[]>
export type IAllySelections = Pick<TSelections, 'units' | 'battalions'>
