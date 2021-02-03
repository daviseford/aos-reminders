import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import rule_sources from 'meta/rule_sources'
import SubFactions from './subfactions'

export const SonsOfBehematFaction = new Faction(
  SONS_OF_BEHEMAT,
  DESTRUCTION,
  SubFactions,
  'Tribes',
  rule_sources.BATTLETOME_SONS_OF_BEHEMAT
)
