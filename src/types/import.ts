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

export type TImportFileTypes = 'application/pdf' | 'text/plain'

export type TImportParsers = 'Warscroll Builder' | 'Azyr' | 'Battlescribe' | 'Unknown'
