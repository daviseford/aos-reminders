import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { SERAPHON } from 'meta/factions'
import SubFactions from './subfactions'

export const SeraphonFaction = new Faction(SERAPHON, ORDER, SubFactions, 'Constellations')
