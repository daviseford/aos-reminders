import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { LEGION_OF_GRIEF } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionOfGriefFaction = new Faction(LEGION_OF_GRIEF, DEATH, SubFactions, 'Flavors')
