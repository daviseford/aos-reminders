import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { DEATH_GRAND_ALLIANCE } from 'meta/factions'
import SubFactions from './subfactions'

export const DeathFaction = new Faction(DEATH_GRAND_ALLIANCE, DEATH, SubFactions, 'Flavors')
