import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import SubFactions from './subfactions'

export const OssiarchBonereapersFaction = new Faction(OSSIARCH_BONEREAPERS, DEATH, SubFactions, 'Flavors')
