import { CHAOS } from 'meta/alliances'
import { SLAANESH } from 'meta/factions'
import subFactions from './subfactions'

export const SlaaneshFaction = {
  factionName: SLAANESH,

  subFactions,

  grandAlliance: CHAOS, // Should a Faction declare its grandalliance, or should it not know about that?

  subFactionLabel: 'Hosts', // similar to AllegianceType in the old structure
  flavorLabel: 'Flavor', // This will be used in place of "Flavor" in the UI eventually

  // Export everything (to be used for imports/ally stuff) ? Maybe... or maybe just get it through subfactions
  // units,
  // battalions,
  // etc,
}
