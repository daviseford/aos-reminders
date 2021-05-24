import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { SOULBLIGHT_GRAVELORDS } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const SoulblightGravelordsFaction = new Faction(
  SOULBLIGHT_GRAVELORDS,
  DEATH,
  SubFactions,
  'Lineage',
  rule_sources.BATTLETOME_SOULBLIGHT_GRAVELORDS
)
