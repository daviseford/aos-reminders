import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { DISPOSSESSED } from 'meta/factions'
import SubFactions from './subfactions'

export const DispossessedFaction = new Faction(DISPOSSESSED, ORDER, SubFactions, 'Flavors')
