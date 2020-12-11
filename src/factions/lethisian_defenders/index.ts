import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { LETHISIAN_DEFENDERS } from 'meta/factions'
import SubFactions from './subfactions'

export const LethisianDefendersFaction = new Faction(LETHISIAN_DEFENDERS, ORDER, SubFactions)
