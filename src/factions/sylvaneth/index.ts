import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { ORDER } from 'meta/alliances'
import { SYLVANETH } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SylvanethFaction = new Faction(
  SYLVANETH,
  ORDER,
  SubFactions,
  'Glades',
  rule_sources.BATTLETOME_SYLVANETH,
  pickEffects(battle_traits, [SYLVANETH])
)
