import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { DESTRUCTION_GRAND_ALLIANCE } from 'meta/factions'
import SubFactions from './subfactions'

export const DestructionFaction = new Faction(DESTRUCTION_GRAND_ALLIANCE, DESTRUCTION, SubFactions)
