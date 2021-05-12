import { Faction } from 'factions/factionClass'
import { DEATH } from 'meta/alliances'
import { NIGHTHAUNT } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const NighthauntFaction = new Faction(
  NIGHTHAUNT,
  DEATH,
  SubFactions,
  'Procession',
  rule_sources.BATTLETOME_NIGHTHAUNT
)
