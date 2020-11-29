import { ORDER } from 'meta/alliances'
import { SERAPHON } from 'meta/factions'
import subFactions from './subfactions'
// import AllSeraphonUnits from './units'
// import AllSeraphonBattalions from './units'
// import AllEtc from './AllEtc' /// traits spells etc

export const SeraphonFaction = {
  factionName: SERAPHON,
  subFactions,

  grandAlliance: ORDER,

  subFactionLabel: 'Constellations', // similar to AllegianceType in the old structure
  flavorLabel: 'Flavor', // This will be used in place of "Flavor" in the UI eventually

  // Export everything (to be used for imports/ally stuff)
  // units,
  // battalions,
  // etc,
}
