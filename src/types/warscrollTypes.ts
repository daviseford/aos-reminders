import { TSupportedFaction } from 'meta/factions'
import { TAllySelectionStore } from 'types/store'
import { TRealms } from 'types/realmscapes'
import { ISelections } from 'types/selections'

export interface IWarscrollArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  allyUnits: string[]
  factionName: TSupportedFaction
  errors: TError[]
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  unknownSelections: string[]
}

export type TError = { text: string; severity: 'warn' | 'error' }
