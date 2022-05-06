export type TSelectionTypes =
  | 'artifacts'
  | 'battalions'
  | 'command_abilities'
  | 'command_traits'
  | 'core_rules'
  | 'endless_spells'
  | 'flavors'
  | 'grand_strategies'
  | 'monstrous_rampages'
  | 'mount_traits'
  | 'prayers'
  | 'scenery'
  | 'spells'
  | 'triumphs'
  | 'units'

export type TSelections = Record<TSelectionTypes, string[]>
export type IAllySelections = Pick<TSelections, 'units' | 'battalions'>
