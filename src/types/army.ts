import { TSupportedFaction } from 'meta/factions'
import { TGameStructure } from 'meta/game_structure'
import { TEffects, TEntry } from 'types/data'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { TSelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

// TODO: Get rid of these?
export type TArtifacts = TEntry[]
export type TBattalions = TEntry[]
export type TBattleTraits = TEffects[]
export type TCommandTraits = TEntry[]
export type TEndlessSpells = TEntry[]
export type TFlavors = TEntry[]
export type TScenery = TEntry[]
export type TSpells = TEntry[]
export type TTriumphs = TEntry[]
export type TUnits = TEntry[]

export interface IArmy {
  Artifacts: TEntry[]
  Battalions: TEntry[]
  BattleTraits: TEffects[] // Previously 'Abilities'
  CommandAbilities: TEntry[] // Previously 'Commands'
  CommandTraits: TEntry[] // Previously 'Traits'
  EndlessSpells: TEntry[]
  Flavors: TEntry[] // Previously 'Allegiances'
  FlavorType?: string // Previously 'AllegianceType'
  Game: TGameStructure
  Scenery: TEntry[]
  Spells: TEntry[]
  Triumphs: TEntry[]
  Units: TEntry[]
}

export type TAllyArmies = Record<string, IArmy>
export type TInitialArmy = Partial<IArmy> & { AlliedUnits?: TEntry[] }
export type TCollection = Pick<
  IArmy,
  'Artifacts' | 'Battalions' | 'CommandTraits' | 'CommandAbilities' | 'Spells'
>

export interface ICurrentArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  factionName: TSupportedFaction
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: TSelections
}
