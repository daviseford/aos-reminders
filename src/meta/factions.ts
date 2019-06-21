import { sortBy } from 'lodash'

// Supported Faction Types
export type TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export type TFleshEaterCourts = 'FLESH_EATER_COURTS'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'
export type TIronjawz = 'IRONJAWZ'
export type TSeraphon = 'SERAPHON'
export type TSkaven = 'SKAVEN'
export type TSylvaneth = 'SYLVANETH'

// Exported Faction Names
export const BEASTCLAW_RAIDERS: TBeastclawRaiders = 'BEASTCLAW_RAIDERS'
export const FLESH_EATER_COURTS: TFleshEaterCourts = 'FLESH_EATER_COURTS'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'
export const IRONJAWZ: TIronjawz = 'IRONJAWZ'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SKAVEN: TSkaven = 'SKAVEN'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'

// Supported Factions
export type TSupportedFaction =
  | TBeastclawRaiders
  | TFleshEaterCourts
  | TGloomspiteGitz
  | TIdonethDeepkin
  | TIronjawz
  | TSeraphon
  | TSkaven
  | TSylvaneth

export const SUPPORTED_FACTIONS: TSupportedFaction[] = sortBy([
  BEASTCLAW_RAIDERS,
  FLESH_EATER_COURTS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  SERAPHON,
  SKAVEN,
  SYLVANETH,
])
