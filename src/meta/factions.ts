import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export type TDispossessed = 'DISPOSSESSED'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TFyreslayers = 'FYRESLAYERS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TKharadronOverlords = 'KHARADRON_OVERLORDS'
export type TKhorne = 'KHORNE'
export type TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
export type TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
export type TNighthaunt = 'NIGHTHAUNT'
export type TNurgle = 'NURGLE'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TSlaanesh = 'SLAANESH'
export type TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export type TStormcastEternals = 'STORMCAST_ETERNALS'
export type TSylvaneth = 'SYLVANETH'
export type TTamurkhansHorde = 'TAMURKHANS_HORDE'
export type TTzeentch = 'TZEENTCH'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const DAUGHTERS_OF_KHAINE: TDaughtersOfKhaine = 'DAUGHTERS_OF_KHAINE'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const FYRESLAYERS: TFyreslayers = 'FYRESLAYERS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const KHORNE: TKhorne = 'KHORNE'
export const LEGIONS_OF_AZGORH: TLegionsOfAzgorh = 'LEGIONS_OF_AZGORH'
export const LEGIONS_OF_NAGASH: TLegionsOfNagash = 'LEGIONS_OF_NAGASH'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const NURGLE: TNurgle = 'NURGLE'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const SLAANESH: TSlaanesh = 'SLAANESH'
export const SLAVES_TO_DARKNESS: TSlavesToDarkness = 'SLAVES_TO_DARKNESS'
export const STORMCAST_ETERNALS: TStormcastEternals = 'STORMCAST_ETERNALS'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TAMURKHANS_HORDE: TTamurkhansHorde = 'TAMURKHANS_HORDE'
export const TZEENTCH: TTzeentch = 'TZEENTCH'

// Supported Factions
export type TSupportedFaction =
  | TBeastclawRaiders
  | TDaughtersOfKhaine
  | TDispossessed
  | TFleshEaterCourts
  | TFyreslayers
  | TGloomspiteGitz
  | TIdonethDeepkin
  | TIronjawz
  | TKharadronOverlords
  | TKhorne
  | TLegionsOfAzgorh
  | TLegionsOfNagash
  | TNighthaunt
  | TNurgle
  | TSeraphon
  | TSkaven
  | TSlaanesh
  | TSlavesToDarkness
  | TStormcastEternals
  | TSylvaneth
  | TTamurkhansHorde
  | TTzeentch

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  BEASTCLAW_RAIDERS,
  DAUGHTERS_OF_KHAINE,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_NAGASH,
  NIGHTHAUNT,
  NURGLE,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TZEENTCH,
])
