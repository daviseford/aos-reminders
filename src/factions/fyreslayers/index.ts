import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { FYRESLAYERS } from 'meta/factions'
import SubFactions from './subfactions'

export const FyreslayersFaction = new Faction(FYRESLAYERS, ORDER, SubFactions, 'Lodges')
