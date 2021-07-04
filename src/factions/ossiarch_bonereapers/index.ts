import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { DEATH } from 'meta/alliances'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const OssiarchBonereapersFaction = new Faction(
  OSSIARCH_BONEREAPERS,
  DEATH,
  SubFactions,
  'Flavors',
  rule_sources.BATTLETOME_OSSIARCH_BONEREAPERS,
  pickEffects(battle_traits, [OSSIARCH_BONEREAPERS])
)
