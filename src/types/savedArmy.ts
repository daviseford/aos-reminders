import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from './selections'
import { TRealms } from './realmscapes'

export interface ISavedArmy {
  armyName: string
  factionName: TSupportedFaction
  allyFactionNames: TSupportedFaction[]
  allySelections: IAllySelections
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
}

export interface ISavedArmyFromApi {
  id: string
  userName: string
  armyName: string
  factionName: TSupportedFaction
  allyFactionNames: TSupportedFaction[]
  allySelections: IAllySelections
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
}
