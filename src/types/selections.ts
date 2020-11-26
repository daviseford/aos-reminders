export type TSelectionTypes =
  | 'allegiances'
  | 'artifacts'
  | 'battalions'
  | 'commands'
  | 'endless_spells'
  | 'scenery'
  | 'spells'
  | 'traits'
  | 'triumphs'
  | 'units'
  | 'abilities'

export interface ISelections {
  allegiances: string[]
  artifacts: string[]
  battalions: string[]
  commands: string[]
  endless_spells: string[]
  scenery: string[]
  spells: string[]
  traits: string[]
  triumphs: string[]
  units: string[]
  abilities: string[]
}

export interface IAllySelections {
  units: string[]
  battalions: string[]
}
