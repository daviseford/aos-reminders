import { IStore } from 'types/store'
import { selections, factionNames, realmscape } from 'ducks'

const getCurrentArmy = (state: IStore) => {
  return {
    allyFactionNames: selections.selectors.getAllyFactionNames(state),
    allySelections: selections.selectors.getAllySelections(state),
    factionName: factionNames.selectors.getFactionName(state),
    realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
    realmscape: realmscape.selectors.getRealmscape(state),
    selections: selections.selectors.getSelections(state),
  }
}

export const duckUtils = {
  getCurrentArmy,
}
