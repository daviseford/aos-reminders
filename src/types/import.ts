import { TSupportedFaction } from 'meta/factions'
import { TAllySelectionStore } from 'types/store'
import { TRealms } from 'types/realmscapes'
import { ISelections } from 'types/selections'

export interface IImportedArmy {
  allyFactionNames: TSupportedFaction[]
  allySelections: TAllySelectionStore
  allyUnits: string[]
  factionName: TSupportedFaction
  errors: TImportError[]
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  unknownSelections: string[]
}

export type TImportError = { text: string; severity: 'warn' | 'error' | 'ally-warn' }

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
