import { IEffects } from './data'
import { TGameStructure } from 'meta/turn_structure'

export interface IEntry {
  name: string
  effects: IEffects[]
  artifact?: boolean
  trait?: boolean
}

export type TArtifacts = IEntry[]
export type TBattalions = IEntry[]
export type TUnits = IEntry[]
export type TCommandTraits = IEntry[]
export type TAbilities = IEffects[]

export interface IArmyWithoutGame {
  Abilities: TAbilities
  Artifacts: TArtifacts
  Battalions: TBattalions
  Traits: TCommandTraits
  Units: TUnits
  Game?: TGameStructure
}

export interface IArmy extends IArmyWithoutGame {
  Game: TGameStructure
}
