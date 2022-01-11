import { Faction } from 'factions/factionClass'
import { pickEffects } from 'factions/metatagger'
import { DESTRUCTION } from 'meta/alliances'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import battle_traits from './battle_traits'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SonsOfBehematFaction = new Faction(
  SONS_OF_BEHEMAT,
  DESTRUCTION,
  SubFactions,
  'Tribes',
  rule_sources.BATTLETOME_SONS_OF_BEHEMAT,
  pickEffects(battle_traits, [SONS_OF_BEHEMAT, 'Battle Tactics'])
)
