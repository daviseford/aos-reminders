import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import SubFactions from './subfactions'

export const DaughtersOfKhaineFaction = new Faction(DAUGHTERS_OF_KHAINE, ORDER, SubFactions, 'Temples')
