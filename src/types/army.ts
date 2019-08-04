import { IEffects, IEntry } from './data'
import { TGameStructure } from 'meta/game_structure'
import { IAllySelections } from './selections'

export type TAllyArmies = { [key: string]: IArmy }

export type TAllyData = {
  allyArmy: IArmy
  allySelections: IAllySelections
}[]

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
