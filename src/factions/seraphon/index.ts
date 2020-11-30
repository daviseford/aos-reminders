import { TNewFaction } from 'factions/factionTypes'
import { SERAPHON } from 'meta/factions'
import subFactions from './subfactions'
// import AllSeraphonUnits from './units'
// import AllSeraphonBattalions from './units'
// import AllEtc from './AllEtc' /// traits spells etc

export const SeraphonFaction: TNewFaction = {
  factionName: SERAPHON,
  subFactions,

  subFactionLabel: 'Idk yet', // similar to AllegianceType in the old structure
  flavorLabel: 'Constellations', // This will be used in place of "Flavor" in the UI eventually

  // Export everything (to be used for imports/ally stuff) (?)
  // units,
  // battalions,
  // etc,
}
