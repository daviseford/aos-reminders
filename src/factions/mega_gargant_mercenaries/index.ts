import { Faction } from 'factions/factionClass'
import { DESTRUCTION } from 'meta/alliances'
import { MEGA_GARGANT_MERCENARIES } from 'meta/factions'
import SubFactions from './subfactions'

export const MegaGargantMercenariesFaction = new Faction(
  MEGA_GARGANT_MERCENARIES,
  DESTRUCTION,
  SubFactions,
  'Flavors',
  undefined,
  true
)
