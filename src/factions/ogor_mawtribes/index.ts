import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { OGOR_MAWTRIBES } from 'meta/factions'
import SubFactions from './subfactions'

export const OgorMawtribesFaction = new Faction(OGOR_MAWTRIBES, DESTRUCTION, SubFactions, 'Mawtribes')
