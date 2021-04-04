import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { LEGION_OF_CHAOS_ASCENDANT } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionOfChaosAscendantFaction = new Faction(
  LEGION_OF_CHAOS_ASCENDANT,
  CHAOS,
  SubFactions,
  'Legions'
)
