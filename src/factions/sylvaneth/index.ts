import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { ORDER } from 'meta/alliances'
import { SYLVANETH } from 'meta/factions'
import BattleTraits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SylvanethFaction = new Faction(
  SYLVANETH,
  ORDER,
  SubFactions,
  'Glades',
  rule_sources.BATTLETOME_SYLVANETH,
  pickEffects(BattleTraits, [SYLVANETH, 'Battle Tactics'])
)
