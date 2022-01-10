import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { DEATH } from 'meta/alliances'
import { SOULBLIGHT_GRAVELORDS } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SoulblightGravelordsFaction = new Faction(
  SOULBLIGHT_GRAVELORDS,
  DEATH,
  SubFactions,
  'Lineages',
  rule_sources.BATTLETOME_SOULBLIGHT_GRAVELORDS,
  pickEffects(battle_traits, [SOULBLIGHT_GRAVELORDS, 'Battle Tactics'])
)
