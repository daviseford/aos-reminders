import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { SLAVES_TO_DARKNESS } from 'meta/factions'
import SubFactions from './subfactions'

export const SlavesToDarknessFaction = new Faction(SLAVES_TO_DARKNESS, CHAOS, SubFactions, 'Damned Legions')
