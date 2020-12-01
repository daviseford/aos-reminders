import { TSupportedFaction } from 'meta/factions'
import { TGameStructure } from 'meta/game_structure'
import { TEffects, TEntry } from 'types/data'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { TSelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

export type TAllyArmies = Record<string, IArmy>

// TODO: Get rid of these
export type TArtifacts = TEntry[]
export type TBattalions = TEntry[]
export type TBattleTraits = TEffects[]
export type TCommandAbilities = TEntry[]
export type TCommandTraits = TEntry[]
export type TEndlessSpells = TEntry[]
export type TFlavors = TEntry[]
export type TScenery = TEntry[]
export type TSpells = TEntry[]
export type TTriumphs = TEntry[]
export type TUnits = TEntry[]

export interface IArmy {
  Artifacts: TArtifacts
  Battalions: TBattalions
  BattleTraits: TBattleTraits
  CommandAbilities: TCommandAbilities
  CommandTraits: TCommandTraits
  EndlessSpells: TEndlessSpells
  Flavors: TFlavors
  FlavorType?: string
  Game: TGameStructure
  Scenery: TScenery
  Spells: TSpells
  Triumphs: TTriumphs
  Units: TUnits
}

export type IInitialArmy = Partial<IArmy> & { AlliedUnits?: TUnits }

export interface ICollection {
  Artifacts: TArtifacts
  Battalions: TBattalions
  CommandAbilities: TCommandAbilities
  CommandTraits: TCommandTraits
  Spells: TSpells
}

export interface ICurrentArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  factionName: TSupportedFaction
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: TSelections
}
