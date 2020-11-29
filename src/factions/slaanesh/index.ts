import { CHAOS } from 'meta/alliances'
import { SLAANESH } from 'meta/factions'
import subFactions from './subfactions'

export const SlaaneshFaction = {
  factionName: SLAANESH,
  subFactions,
  grandAlliance: CHAOS, // Should a Faction declare its grandalliance, or should it not know about that?
  flavorLabel: 'Hosts?', // This will be used in place of "Flavor" in the UI eventually, similar to AllegianceType in the old data

  // Export everything (to be used for imports/ally stuff) ? Maybe... or maybe just get it through subfactions
  // units,
  // battalions,
  // etc,
}
