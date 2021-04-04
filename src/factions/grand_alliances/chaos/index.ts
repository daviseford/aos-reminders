import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { CHAOS_GRAND_ALLIANCE } from 'meta/factions'
import SubFactions from './subfactions'

export const ChaosFaction = new Faction(CHAOS_GRAND_ALLIANCE, CHAOS, SubFactions)
