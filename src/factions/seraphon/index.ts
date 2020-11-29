import { ORDER_GRAND_ALLIANCE } from 'meta/factions'
import subFactions from './subfactions'
// import AllSeraphonUnits from './units'
// import AllSeraphonBattalions from './units'
// import AllEtc from './AllEtc' /// traits spells etc

export const SeraphonFaction = {
  factionName: 'SERAPHON',
  grandAlliance: ORDER_GRAND_ALLIANCE,

  subFactions,
  // Export everything (to be used for imports/ally stuff)
  // units,
  // battalions,
  // etc,
}
