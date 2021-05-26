import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { DEATH } from 'meta/alliances'
import { OSSIARCH_BONEREAPERS } from 'meta/factions'
import battle_traits from './battle_traits'
import SubFactions from './subfactions'

export const OssiarchBonereapersFaction = new Faction(
  OSSIARCH_BONEREAPERS,
  DEATH,
  SubFactions,
  'Flavors',
  undefined,
  pickEffects(battle_traits, ['The Ossiarch Empire'])
)
