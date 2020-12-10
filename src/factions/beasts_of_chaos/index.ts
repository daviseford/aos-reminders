import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { BEASTS_OF_CHAOS } from 'meta/factions'
import SubFactions from './subfactions'

export const BeastOfChaosFaction = new Faction(BEASTS_OF_CHAOS, CHAOS, SubFactions, 'Greatfrays')
