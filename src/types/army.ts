import { TSupportedFaction } from 'meta/factions'
import { TGameStructure } from 'meta/game_structure'
import { TEffects, TEntry } from './data'
import { IAllySelections, ISelections } from './selections'
import { TRealms } from './realmscapes'
import { TAllySelectionStore } from './store'

export type TAllyArmies = { [key: string]: IArmy }

export type TAllyData = Array<{
  allyArmy: IArmy
  allySelections: IAllySelections
}>

export type TAbilities = TEffects[]
export type TAllegiances = TEntry[]
export type TArtifacts = TEntry[]
export type TBattalions = TEntry[]
export type TCommands = TEntry[]
export type TTraits = TEntry[]
export type TEndlessSpells = TEntry[]
export type TScenery = TEntry[]
export type TSpells = TEntry[]
export type TTriumphs = TEntry[]
export type TUnits = TEntry[]

export interface IInitialArmy {
  Abilities?: TAbilities
  Allegiances?: TAllegiances
  AlliedUnits?: TUnits
  Artifacts?: TArtifacts
  Battalions?: TBattalions
  EndlessSpells?: TEndlessSpells
  Scenery?: TScenery
  Spells?: TSpells
  Traits?: TTraits
  Units?: TUnits
  Game?: TGameStructure
}

export interface IArmy {
  Abilities: TAbilities
  Allegiances: TAllegiances
  Artifacts: TArtifacts
  Battalions: TBattalions
  Commands: TCommands
  EndlessSpells: TEndlessSpells
  Scenery: TScenery
  Spells: TSpells
  Traits: TTraits
  Triumphs: TTriumphs
  Units: TUnits
  Game: TGameStructure
}

export interface ICollection {
  Artifacts: TArtifacts
  Battalions: TBattalions
  Commands: TCommands
  Spells: TSpells
  Traits: TTraits
}

export interface ICurrentArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  factionName: TSupportedFaction
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
}
