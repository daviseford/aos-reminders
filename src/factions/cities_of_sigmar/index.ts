import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { CITIES_OF_SIGMAR } from 'meta/factions'
import SubFactions from './subfactions'

export const CitiesOfSigmarFaction = new Faction(CITIES_OF_SIGMAR, ORDER, SubFactions, 'Cities')
