import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { ORRUK_WARCLANS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const OrrukWarclansFaction = new Faction(
  ORRUK_WARCLANS,
  DESTRUCTION,
  SubFactions,
  'Warclans',
  rule_sources.BATTLETOME_ORRUK_WARCLANS
)
