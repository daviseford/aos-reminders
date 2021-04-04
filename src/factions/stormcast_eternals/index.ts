import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { STORMCAST_ETERNALS } from 'meta/factions'
import SubFactions from './subfactions'

export const StormcastFaction = new Faction(STORMCAST_ETERNALS, ORDER, SubFactions, 'Stormhosts')
