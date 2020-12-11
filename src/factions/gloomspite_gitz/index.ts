import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import SubFactions from './subfactions'

export const GloomspiteGitzFaction = new Faction(GLOOMSPITE_GITZ, DESTRUCTION, SubFactions, 'Tribes')
