import { TSupportedFaction } from 'meta/factions'
import { TGameStructure } from 'meta/game_structure'
import { TEntry } from 'types/data'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { ISelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

export type TAllyArmies = { [key: string]: IArmy }

export type TAbilities = TEntry[]
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
  AllegianceType?: string
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
  AllegianceType?: string
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
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: ISelections
}
