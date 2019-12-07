type TAqshy = `Aqshy`
type TChamon = `Chamon`
type TGhur = `Ghur`
type TGhyran = `Ghyran`
type THysh = `Hysh`
type TShyish = `Shyish`
type TStygxx = `Stygxx`
type TUlgu = `Ulgu`

export type TOriginRealms = TAqshy | TChamon | TGhur | TGhyran | THysh | TShyish | TUlgu
export type TBattleRealms = TOriginRealms | TStygxx

export const AQSHY: TAqshy = `Aqshy`
export const CHAMON: TChamon = `Chamon`
export const GHUR: TGhur = `Ghur`
export const GHYRAN: TGhyran = `Ghyran`
export const HYSH: THysh = `Hysh`
export const SHYISH: TShyish = `Shyish`
export const STYGXX: TStygxx = `Stygxx`
export const ULGU: TUlgu = `Ulgu`

export const SUPPORTED_BATTLE_REALMS: TBattleRealms[] = [
  AQSHY,
  CHAMON,
  GHUR,
  GHYRAN,
  HYSH,
  SHYISH,
  STYGXX,
  ULGU,
]
export const SUPPORTED_ORIGIN_REALMS: TOriginRealms[] = [AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU]
