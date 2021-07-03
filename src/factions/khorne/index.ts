import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { KHORNE } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const KhorneFaction = new Faction(
  KHORNE,
  CHAOS,
  SubFactions,
  'Slaughterhosts',
  rule_sources.BATTLETOME_KHORNE
)
