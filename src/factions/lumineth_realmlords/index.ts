import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { LUMINETH_REALMLORDS } from 'meta/factions'
import SubFactions from './subfactions'

export const LuminethRealmlordsFaction = new Faction(LUMINETH_REALMLORDS, ORDER, SubFactions, 'Great Nations')
