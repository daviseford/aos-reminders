import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { TZEENTCH } from 'meta/factions'
import SubFactions from './subfactions'

export const TzeentchFaction = new Faction(TZEENTCH, CHAOS, SubFactions, 'Change Covens')
