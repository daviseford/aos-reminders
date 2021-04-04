import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { LEGION_OF_AZGORH } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionOfAzgorhFaction = new Faction(LEGION_OF_AZGORH, CHAOS, SubFactions, 'Legions')
