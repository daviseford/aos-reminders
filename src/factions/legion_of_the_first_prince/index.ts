import { Faction } from 'factions/factionClass'
import { CHAOS } from 'meta/alliances'
import { LEGION_OF_THE_FIRST_PRINCE } from 'meta/factions'
import SubFactions from './subfactions'

export const LegionOfTheFirstPrinceFaction = new Faction(
  LEGION_OF_THE_FIRST_PRINCE,
  CHAOS,
  SubFactions,
  'Legions'
)
