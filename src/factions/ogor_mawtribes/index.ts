import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { OGOR_MAWTRIBES } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const OgorMawtribesFaction = new Faction(
  OGOR_MAWTRIBES,
  DESTRUCTION,
  SubFactions,
  'Mawtribes',
  rule_sources.BATTLETOME_OGOR_MAWTRIBES
)
