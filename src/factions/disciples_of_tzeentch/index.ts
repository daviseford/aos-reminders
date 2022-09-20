import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { CHAOS } from 'meta/alliances'
import { TZEENTCH } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const TzeentchFaction = new Faction(
  TZEENTCH,
  CHAOS,
  SubFactions,
  'Change Covens',
  rule_sources.BATTLETOME_TZEENTCH,
  pickEffects(battle_traits, ['The Flow of Change'])
)
