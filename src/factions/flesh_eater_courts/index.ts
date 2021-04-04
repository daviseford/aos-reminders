import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { FLESH_EATER_COURTS } from 'meta/factions'
import SubFactions from './subfactions'

export const FleshEaterCourtsFaction = new Faction(FLESH_EATER_COURTS, DEATH, SubFactions, 'Grand Courts')
