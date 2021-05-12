import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { TZEENTCH } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const TzeentchFaction = new Faction(
  TZEENTCH,
  CHAOS,
  SubFactions,
  'Change Covens',
  rule_sources.BATTLETOME_TZEENTCH
)
