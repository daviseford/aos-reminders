import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { NIGHTHAUNT } from 'meta/factions'
import SubFactions from './subfactions'

export const NighthauntFaction = new Faction(NIGHTHAUNT, DEATH, SubFactions, 'Flavors')
