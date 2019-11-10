type TAqshy = `Aqshy`
type TChamon = `Chamon`
type TGhur = `Ghur`
type TGhyran = `Ghyran`
type THysh = `Hysh`
type TShyish = `Shyish`
type TStygxx = `Stygxx`
type TUlgu = `Ulgu`
type TNone = 'None'

export type TRealms = TAqshy | TChamon | TGhur | TGhyran | THysh | TShyish | TStygxx | TUlgu
export type TOrigins = TAqshy | TChamon | TGhur | TGhyran | THysh | TShyish | TUlgu | TNone

export const AQSHY: TAqshy = `Aqshy`
export const CHAMON: TChamon = `Chamon`
export const GHUR: TGhur = `Ghur`
export const GHYRAN: TGhyran = `Ghyran`
export const HYSH: THysh = `Hysh`
export const SHYISH: TShyish = `Shyish`
export const STYGXX: TStygxx = `Stygxx`
export const ULGU: TUlgu = `Ulgu`
export const NONE: TNone = 'None'

export const SUPPORTED_REALMSCAPES: TRealms[] = [AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU]
export const SUPPORTED_FACTION_ORIGINS: TOrigins[] = [AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU, NONE]
