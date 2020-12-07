import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { NURGLE } from 'meta/factions'
import SubFactions from './subfactions'

export const NurgleFaction = new Faction(NURGLE, CHAOS, SubFactions, 'Subfaction', 'Plague Legions')
