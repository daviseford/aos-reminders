import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { ORDER_GRAND_ALLIANCE } from 'meta/factions'
import SubFactions from './subfactions'

export const OrderFaction = new Faction(ORDER_GRAND_ALLIANCE, ORDER, SubFactions)
