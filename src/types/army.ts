import { IEffects, IEntry } from './data'
import { TGameStructure } from 'meta/game_structure'
import { IAllySelections } from './selections'

export type TAllyArmies = { [key: string]: IArmy }

export type TAllyData = {
  allyArmy: IArmy
  allySelections: IAllySelections
}[]

export type TAbilities = IEffects[]
export type TAllegiances = {
  type: string
  entries: IEntry[]
}
export type TArtifacts = IEntry[]
export type TBattalions = IEntry[]
export type TTraits = IEntry[]
export type TEndlessSpells = IEntry[]
export type TSpells = IEntry[]
export type TUnits = IEntry[]

export interface IArmyWithoutGame {
  Abilities: TAbilities
  Allegiances: TAllegiances
  Artifacts: TArtifacts
  Battalions: TBattalions
  EndlessSpells: TEndlessSpells
  Spells: TSpells
  Traits: TTraits
  Units: TUnits
  Game?: TGameStructure
}

export interface IArmy extends IArmyWithoutGame {
  Game: TGameStructure
}
