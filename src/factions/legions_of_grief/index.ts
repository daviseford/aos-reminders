import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { LEGIONS_OF_GRIEF } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionsOfGriefFaction = new Faction(LEGIONS_OF_GRIEF, DEATH, SubFactions, 'Flavors')
