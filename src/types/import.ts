import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { ILinkedArmy, ISavedArmyFromApi } from 'types/savedArmy'
import { TSelections } from 'types/selections'
import { TAllySelectionStore } from 'types/store'

export interface IImportedArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  allyUnits: string[]
  errors: TImportError[]
  factionName: TSupportedFaction
  subFactionName: string
  hiddenReminders?: undefined
  origin_realm: TOriginRealms | null
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: TSelections
  unknownSelections: string[]
}

export type TLoadedArmy =
  | ISavedArmyFromApi
  | IImportedArmy
  | ILinkedArmy
  | (ICurrentArmy & { hiddenReminders: string[] })

export type TImportError = {
  text: string
  severity: 'warn' | 'error' | 'ally-warn' | 'ambiguity-warn' | 'deprecation-warn'
  reason?: string
}

type THtmlFile = 'text/html'
type TPdfFile = 'application/pdf'
type TTextFile = 'text/plain'

export type TImportFileTypes = TPdfFile | THtmlFile | TTextFile

type TAzyr = 'Azyr'
type TBattlescribe = 'Battlescribe'
type TUnknown = 'Unknown'
type TWarhammerApp = 'Warhammer App'
type TWarscrollBuilder = 'Warscroll Builder'

export type TImportParsers = TWarscrollBuilder | TWarhammerApp | TAzyr | TBattlescribe | TUnknown

export const AZYR: TAzyr = 'Azyr'
export const BATTLESCRIBE: TBattlescribe = 'Battlescribe'
export const UNKNOWN: TUnknown = 'Unknown'
export const WARHAMMER_APP: TWarhammerApp = 'Warhammer App'
export const WARSCROLL_BUILDER: TWarscrollBuilder = 'Warscroll Builder'

export const HTML_FILE: THtmlFile = 'text/html'
export const PDF_FILE: TPdfFile = 'application/pdf'
export const TXT_FILE: TTextFile = 'text/plain'
