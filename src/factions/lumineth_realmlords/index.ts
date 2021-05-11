import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { LUMINETH_REALMLORDS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const LuminethRealmlordsFaction = new Faction(
  LUMINETH_REALMLORDS,
  ORDER,
  SubFactions,
  'Great Nations',
  rule_sources.BATTLETOME_LUMINETH
)
