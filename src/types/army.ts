import { TEffects, TEntry } from './data'
import { TGameStructure } from 'meta/game_structure'
import { IAllySelections } from './selections'

export type TAllyArmies = { [key: string]: IArmy }

export type TAllyData = {
  allyArmy: IArmy
  allySelections: IAllySelections
}[]

export type TAbilities = TEffects[]
export type TAllegiances = TEntry[]
export type TArtifacts = TEntry[]
export type TBattalions = TEntry[]
export type TTraits = TEntry[]
export type TEndlessSpells = TEntry[]
export type TScenery = TEntry[]
export type TSpells = TEntry[]
export type TUnits = TEntry[]

export interface IArmyWithoutGame {
  Abilities: TAbilities
  Allegiances: TAllegiances
  Artifacts: TArtifacts
  Battalions: TBattalions
  EndlessSpells: TEndlessSpells
  Scenery: TScenery
  Spells: TSpells
  Traits: TTraits
  Units: TUnits
  Game?: TGameStructure
}

export interface IArmy extends IArmyWithoutGame {
  Game: TGameStructure
}
