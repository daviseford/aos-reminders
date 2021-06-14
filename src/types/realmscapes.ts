type TAqshy = `Aqshy`
type TChamon = `Chamon`
type TCharrwind = `Charrwind Coast`
type TCoastOfTusks = `Coast of Tusks`
type TDolorum = `Dolorum`
type TEightpoints = `Eightpoints`
type TGenesisGate = `Genesis Gate`
type TGhur = `Ghur`
type TGhyran = `Ghyran`
type THelleflux = `Helleflux`
type THysh = `Hysh`
type TInvidia = `Invidia`
type TPraetoris = `Praetoris`
type TProsperis = `Prosperis`
type TShyish = `Shyish`
type TStygxx = `Stygxx`
type TUlgu = `Ulgu`
type TUmbral = `Umbral Veil`
type TVaranthax = `Varanthax's Maw`
type TYmetrica = `Ymetrica`

export type TOriginRealms = TAqshy | TChamon | TGhur | TGhyran | THysh | TShyish | TUlgu
export type TBattleRealms =
  | TOriginRealms
  | TStygxx
  | TEightpoints
  | TUmbral
  | THelleflux
  | TCharrwind
  | TVaranthax
  | TInvidia
  | TPraetoris
  | TYmetrica
  | TGenesisGate
  | TDolorum
  | TProsperis
  | TCoastOfTusks

export const AQSHY: TAqshy = `Aqshy`
export const CHAMON: TChamon = `Chamon`
export const CHARRWIND: TCharrwind = `Charrwind Coast`
export const COASTOFTUSKS: TCoastOfTusks = `Coast of Tusks`
export const DOLORUM: TDolorum = `Dolorum`
export const EIGHTPOINTS: TEightpoints = `Eightpoints`
export const GENESISGATE: TGenesisGate = `Genesis Gate`
export const GHUR: TGhur = `Ghur`
export const GHYRAN: TGhyran = `Ghyran`
export const HELLEFlUX: THelleflux = `Helleflux`
export const INVIDA: TInvidia = `Invidia`
export const HYSH: THysh = `Hysh`
export const PRAETORIS: TPraetoris = `Praetoris`
export const PROSPERIS: TProsperis = `Prosperis`
export const SHYISH: TShyish = `Shyish`
export const STYGXX: TStygxx = `Stygxx`
export const ULGU: TUlgu = `Ulgu`
export const UMBRAL: TUmbral = `Umbral Veil`
export const VARANTHAX: TVaranthax = `Varanthax's Maw`
export const YMETRICA: TYmetrica = `Ymetrica`

export const SUPPORTED_BATTLE_REALMS: TBattleRealms[] = [
  AQSHY,
  CHAMON,
  CHARRWIND,
  COASTOFTUSKS,
  DOLORUM,
  EIGHTPOINTS,
  GENESISGATE,
  GHUR,
  GHYRAN,
  HELLEFlUX,
  HYSH,
  INVIDA,
  PRAETORIS,
  PROSPERIS,
  SHYISH,
  STYGXX,
  ULGU,
  UMBRAL,
  VARANTHAX,
  YMETRICA,
]
export const SUPPORTED_ORIGIN_REALMS: TOriginRealms[] = [AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU]
