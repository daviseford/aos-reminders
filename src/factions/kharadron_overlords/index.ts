import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { KHARADRON_OVERLORDS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const KharadronOverlordsFaction = new Faction(
  KHARADRON_OVERLORDS,
  ORDER,
  SubFactions,
  'Skyports',
  rule_sources.BATTLETOME_KHARADRON_OVERLORDS
)
