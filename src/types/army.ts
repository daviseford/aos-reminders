import { IEffects, IEntry } from './data'
import { TGameStructure } from 'meta/game_structure'

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
