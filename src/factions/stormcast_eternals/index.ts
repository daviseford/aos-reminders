import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { STORMCAST_ETERNALS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const StormcastFaction = new Faction(
  STORMCAST_ETERNALS,
  ORDER,
  SubFactions,
  'Stormhosts',
  rule_sources.BATTLETOME_STORMCAST_ETERNALS
)
