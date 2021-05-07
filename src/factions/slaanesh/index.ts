import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { SLAANESH } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SlaaneshFaction = new Faction(
  SLAANESH,
  CHAOS,
  SubFactions,
  'Hosts',
  rule_sources.BATTLETOME_SLAANESH
)
