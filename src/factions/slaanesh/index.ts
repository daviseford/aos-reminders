import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { SLAANESH } from 'meta/factions'
import SubFactions from './subfactions'

export const SlaaneshFaction = new Faction(SLAANESH, CHAOS, SubFactions, 'Hosts', 'Flavors')
