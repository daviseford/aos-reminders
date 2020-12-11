import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import SubFactions from './subfactions'

export const KharadronOverlordsFaction = new Faction(KHARADRON_OVERLORDS, ORDER, SubFactions, 'Flavors')
