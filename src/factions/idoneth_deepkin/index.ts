import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { IDONETH_DEEPKIN } from 'meta/factions'
import SubFactions from './subfactions'

export const IdonethDeepkinFaction = new Faction(IDONETH_DEEPKIN, ORDER, SubFactions, 'Enclaves')
