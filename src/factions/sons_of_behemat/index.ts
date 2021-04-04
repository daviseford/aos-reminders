import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import SubFactions from './subfactions'

export const SonsOfBehematFaction = new Faction(SONS_OF_BEHEMAT, DESTRUCTION, SubFactions, 'Tribes')
