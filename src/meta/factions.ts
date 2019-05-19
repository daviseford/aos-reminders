// Supported Faction Types
export type TSeraphon = 'SERAPHON'
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'

// Exported Faction Names
export const SERAPHON: TSeraphon = 'SERAPHON'
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'

// Supported Factions
export type TSupportedFaction = TSeraphon | TGloomspiteGitz
export const SUPPORTED_FACTIONS: TSupportedFaction[] = [SERAPHON, GLOOMSPITE_GITZ]
