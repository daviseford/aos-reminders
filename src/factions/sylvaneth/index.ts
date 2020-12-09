import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { SYLVANETH } from 'meta/factions'
import SubFactions from './subfactions'

export const SylvanethFaction = new Faction(SYLVANETH, ORDER, SubFactions, 'Glades')
