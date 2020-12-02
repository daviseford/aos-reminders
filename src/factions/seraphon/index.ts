import { TNewFactionType } from 'factions/factionTypes'
import { getAggregateArmy } from 'factions/temporaryAdapter'
import { ORDER } from 'meta/alliances'
import { SERAPHON } from 'meta/factions'
import subFactions from './subfactions'
// import AllSeraphonUnits from './units'
// import AllSeraphonBattalions from './units'
// import AllEtc from './AllEtc' /// traits spells etc

export const SeraphonFaction: TNewFactionType = {
  factionName: SERAPHON,
  subFactions,

  subFactionKeys: Object.keys(subFactions),

  subFactionLabel: 'Idk yet', // similar to AllegianceType in the old structure
  flavorLabel: 'Constellations', // This will be used in place of "Flavor" in the UI eventually

  GrandAlliance: ORDER,

  Army: getAggregateArmy(subFactions),

  // Export everything (to be used for imports/ally stuff) (?)
  // units,
  // battalions,
  // etc,
}

console.log(SeraphonFaction.Army)
