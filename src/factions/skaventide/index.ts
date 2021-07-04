import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { CHAOS } from 'meta/alliances'
import { SKAVENTIDE } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SkaventideFaction = new Faction(
  SKAVENTIDE,
  CHAOS,
  SubFactions,
  'Clans',
  rule_sources.BATTLETOME_SKAVEN,
  pickEffects(battle_traits, [SKAVENTIDE])
)
