import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { CHAOS } from 'meta/alliances'
import { SLAVES_TO_DARKNESS } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SlavesToDarknessFaction = new Faction(
  SLAVES_TO_DARKNESS,
  CHAOS,
  SubFactions,
  'Mark of Chaos',
  rule_sources.BATTLETOME_SLAVES_TO_DARKNESS,
  pickEffects(battle_traits, ['Battle Tactics', 'Ensorcelled Banners: Icons of Chaos'])
)
