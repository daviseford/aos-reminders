import { TSupportedFaction } from 'meta/factions'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { TAllySelectionStore } from 'types/store'
import { ISelections } from 'types/selections'
import { ISavedArmyFromApi, ILinkedArmy } from 'types/savedArmy'
import { ICurrentArmy } from 'types/army'

export interface IImportedArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  allyUnits: string[]
  errors: TImportError[]
  factionName: TSupportedFaction
  hiddenReminders?: undefined
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: ISelections
  unknownSelections: string[]
}

export type TLoadedArmy =
  | ISavedArmyFromApi
  | IImportedArmy
  | ILinkedArmy
  | (ICurrentArmy & { hiddenReminders: string[] })

export type TImportError = { text: string; severity: 'warn' | 'error' | 'ally-warn' | 'ambiguity-warn' }

type THtmlFile = 'text/html'
type TPdfFile = 'application/pdf'

export type TImportFileTypes = TPdfFile | THtmlFile

type TAzyr = 'Azyr'
type TBattlescribe = 'Battlescribe'
type TUnknown = 'Unknown'
type TWarscrollBuilder = 'Warscroll Builder'

export type TImportParsers = TWarscrollBuilder | TAzyr | TBattlescribe | TUnknown

export const AZYR: TAzyr = 'Azyr'
export const BATTLESCRIBE: TBattlescribe = 'Battlescribe'
export const UNKNOWN: TUnknown = 'Unknown'
export const WARSCROLL_BUILDER: TWarscrollBuilder = 'Warscroll Builder'

export const HTML_FILE: THtmlFile = 'text/html'
export const PDF_FILE: TPdfFile = 'application/pdf'
