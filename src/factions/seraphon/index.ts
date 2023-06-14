import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { ORDER } from 'meta/alliances'
import { SERAPHON } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SeraphonFaction = new Faction(
  SERAPHON,
  ORDER,
  SubFactions,
  'Constellations',
  rule_sources.BATTLETOME_SERAPHON,
  pickEffects(battle_traits, ['Battle Tactics'])
)
