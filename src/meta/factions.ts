import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TDispossessed = 'DISPOSSESSED'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TKharadronOverlords = 'KHARADRON_OVERLORDS'
export type TKhorne = 'KHORNE'
export type TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
export type TNighthaunt = 'NIGHTHAUNT'
export type TNurgle = 'NURGLE'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TStormcastEternals = 'STORMCAST_ETERNALS'
export type TSylvaneth = 'SYLVANETH'
export type TTzeentch = 'TZEENTCH'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const KHORNE: TKhorne = 'KHORNE'
export const LEGIONS_OF_NAGASH: TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const NURGLE: TNurgle = 'NURGLE'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const STORMCAST_ETERNALS: TStormcastEternals = 'STORMCAST_ETERNALS'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TZEENTCH: TTzeentch = 'TZEENTCH'

// Supported Factions
export type TSupportedFaction =
  | TBeastclawRaiders
  | TDispossessed
  | TFleshEaterCourts
  | TGloomspiteGitz
  | TIdonethDeepkin
  | TIronjawz
  | TKharadronOverlords
  | TKhorne
  | TLegionsOfNagash
  | TNighthaunt
  | TNurgle
  | TSeraphon
  | TSkaven
  | TStormcastEternals
  | TSylvaneth
  | TTzeentch

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_NAGASH,
  NIGHTHAUNT,
  NURGLE,
  SERAPHON,
  SKAVEN,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
])
