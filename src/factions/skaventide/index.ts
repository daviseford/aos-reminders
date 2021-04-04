import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { SKAVENTIDE } from 'meta/factions'
import SubFactions from './subfactions'

export const SkaventideFaction = new Faction(SKAVENTIDE, CHAOS, SubFactions, 'Clans')
