import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { LEGIONS_OF_NAGASH } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionsOfNagashFaction = new Faction(LEGIONS_OF_NAGASH, DEATH, SubFactions, 'Factions', 'n/a')
