import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { FYRESLAYERS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const FyreslayersFaction = new Faction(
  FYRESLAYERS,
  ORDER,
  SubFactions,
  'Lodges',
  rule_sources.BATTLETOME_FYRESLAYERS
)
