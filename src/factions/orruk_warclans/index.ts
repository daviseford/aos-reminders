import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { ORRUK_WARCLANS } from 'meta/factions'
import SubFactions from './subfactions'

export const OrrukWarclansFaction = new Faction(ORRUK_WARCLANS, DESTRUCTION, SubFactions, 'Warclans')
