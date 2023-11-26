import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { SYLVANETH } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SylvanethFaction = new Faction(
  SYLVANETH,
  ORDER,
  SubFactions,
  'Glades',
  rule_sources.BATTLETOME_SYLVANETH
)
