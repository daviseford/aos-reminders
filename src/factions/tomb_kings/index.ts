import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { TOMB_KINGS } from 'meta/factions'
import SubFactions from './subfactions'

export const TombKingsFaction = new Faction(TOMB_KINGS, DEATH, SubFactions)
