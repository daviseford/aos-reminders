import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { KHORNE } from 'meta/factions'
import SubFactions from './subfactions'

export const KhorneFaction = new Faction(KHORNE, CHAOS, SubFactions, 'Subfaction', 'Slaughterhosts')
