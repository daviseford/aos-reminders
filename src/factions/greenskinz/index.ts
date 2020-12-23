import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { GREENSKINZ } from 'meta/factions'
import SubFactions from './subfactions'

export const GreenskinzFaction = new Faction(GREENSKINZ, DESTRUCTION, SubFactions)
