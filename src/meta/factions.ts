// Supported Faction Types
export type TSeraphon = 'SERAPHON'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TIdonethDeepkin = 'IDONETH_DEEPKIN'

// Exported Faction Names
export const SERAPHON: TSeraphon = 'SERAPHON'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const IDONETH_DEEPKIN: TIdonethDeepkin = 'IDONETH_DEEPKIN'

// Supported Factions
export type TSupportedFaction = TSeraphon | TGloomspiteGitz | TIdonethDeepkin
export const SUPPORTED_FACTIONS: TSupportedFaction[] = [SERAPHON, GLOOMSPITE_GITZ, IDONETH_DEEPKIN]
