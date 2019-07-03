import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TDispossessed = 'DISPOSSESSED'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TSylvaneth = 'SYLVANETH'
export type TTzeentch = 'TZEENTCH'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const DISPOSSESSED: TDispossessed = 'DISPOSSESSED'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
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
  | TSeraphon
  | TSkaven
  | TSylvaneth
  | TTzeentch

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SKAVEN,
  SYLVANETH,
  TZEENTCH,
])
