import { IEffects, IEntry } from './data'
import { TGameStructure } from 'meta/game_structure'

export type TAllyArmies = { [key: string]: IArmy }

export type TAbilities = IEffects[]
export type TArtifacts = IEntry[]
export type TBattalions = IEntry[]
export type TCommandTraits = IEntry[]
export type TEndlessSpells = IEntry[]
export type TSpells = IEntry[]
export type TUnits = IEntry[]

export interface IArmyWithoutGame {
  Abilities: TAbilities
  Artifacts: TArtifacts
  Battalions: TBattalions
  EndlessSpells?: TEndlessSpells
  Spells?: TSpells
  Traits: TCommandTraits
  Units: TUnits
  Game?: TGameStructure
}

export interface IArmy extends IArmyWithoutGame {
  Game: TGameStructure
}
