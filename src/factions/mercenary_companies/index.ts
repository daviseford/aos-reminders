import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { MERCENARY_COMPANIES } from 'meta/factions'
import SubFactions from './subfactions'

export const MercenaryCompaniesFaction = new Faction(
  MERCENARY_COMPANIES,
  ORDER,
  SubFactions,
  'Flavors',
  undefined,
  true
)
