// Supported Faction Types
export type TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export type TSeraphon = 'SERAPHON'
export type TSylvaneth = 'SYLVANETH'

// Exported Faction Names
export const GLOOMSPITE_GITZ: TGloomspiteGitz = 'GLOOMSPITE_GITZ'
export const SERAPHON: TSeraphon = 'SERAPHON'
export const SYLVANETH: TSylvaneth = 'SYLVANETH'

// Supported Factions
export type TSupportedFaction = TSeraphon | TGloomspiteGitz | TSylvaneth
export const SUPPORTED_FACTIONS: TSupportedFaction[] = [SERAPHON, GLOOMSPITE_GITZ, SYLVANETH]
