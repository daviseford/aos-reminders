import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TDispossessed = 'DISPOSSESSED'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TKharadronOverlords = 'KHARADRON_OVERLORDS'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TSylvaneth = 'SYLVANETH'
export type TTzeentch = 'TZEENTCH'
export type TNighthaunt = 'NIGHTHAUNT'
export type TLegionsofNagash = 'LEGIONS_OF_NAGASH'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const KHARADRON_OVERLORDS: TKharadronOverlords = 'KHARADRON_OVERLORDS'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'
export const TZEENTCH: TTzeentch = 'TZEENTCH'
export const NIGHTHAUNT: TNighthaunt = 'NIGHTHAUNT'
export const LEGIONS_OF_NAGASH: TLegionsofNagash = 'LEGIONS_OF_NAGASH'

// Supported Factions
export type TSupportedFaction =
  | TBeastclawRaiders
  | TDispossessed
  | TFleshEaterCourts
  | TGloomspiteGitz
  | TIdonethDeepkin
  | TIronjawz
  | TKharadronOverlords
  | TSeraphon
  | TSkaven
  | TSylvaneth
  | TTzeentch
  | TNighthaunt
  | TLegionsofNagash

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  SERAPHON,
  SKAVEN,
  SYLVANETH,
  TZEENTCH,
  NIGHTHAUNT,
  LEGIONS_OF_NAGASH,
])
