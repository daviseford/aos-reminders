import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { CITIES_OF_SIGMAR } from 'meta/factions'
import rule_sources from './rule_sources'
import SubFactions from './subfactions'

export const CitiesOfSigmarFaction = new Faction(
  CITIES_OF_SIGMAR,
  ORDER,
  SubFactions,
  'Cities',
  rule_sources.BATTLETOME_CITIES_OF_SIGMAR
)
