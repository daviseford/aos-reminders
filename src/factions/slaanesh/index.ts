import { TNewFactionType } from 'factions/factionTypes'
import { getAggregateArmy } from 'factions/temporaryAdapter'
import { CHAOS } from 'meta/alliances'
import { SLAANESH } from 'meta/factions'
import subFactions from './subfactions'

export const SlaaneshFaction: TNewFactionType = {
  factionName: SLAANESH,

  subFactions,

  GrandAlliance: CHAOS,
  subFactionKeys: Object.keys(subFactions),

  subFactionLabel: 'Hosts', // similar to AllegianceType in the old structure
  flavorLabel: 'Flavor', // This will be used in place of "Flavor" in the UI eventually

  Army: getAggregateArmy(subFactions),

  // Export everything (to be used for imports/ally stuff) ? Maybe... or maybe just get it through subfactions
  // units,
  // battalions,
  // etc,
}
