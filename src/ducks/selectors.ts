import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'

// Army
export const selectArmy = (state: IStore) => state.army.army
export const selectAllyArmies = (state: IStore) => state.army.allyArmies

// Faction Name
export const selectFactionName = (state: IStore) => state.factionNames.factionName

// Realmscape
export const selectOriginRealm = (state: IStore) => state.realmscape.origin_realm
export const selectRealmscape = (state: IStore) => state.realmscape.realmscape
export const selectRealmscapeFeature = (state: IStore) => state.realmscape.realmscape_feature
export const selectRealmscapeSlice = (state: IStore) => state.realmscape

// Selections
export const getAllyFactionNames = (state: IStore) =>
  Object.keys(getAllySelections(state)) as TSupportedFaction[]
export const getAllySelections = (state: IStore) => state.selections.allySelections
export const getSelections = (state: IStore) => state.selections.selections

// Visibility
export const getAllies = (state: IStore) => state.visibility.allies
export const getReminders = (state: IStore) => state.visibility.reminders
export const getSelectors = (state: IStore) => state.visibility.selectors
export const getVisibility = (state: IStore) => state.visibility
export const getWhen = (state: IStore) => state.visibility.when

// Utils
export const getCurrentArmy = (state: IStore): ICurrentArmy => {
  return {
    allyFactionNames: getAllyFactionNames(state),
    allySelections: getAllySelections(state),
    factionName: selectFactionName(state),
    origin_realm: selectOriginRealm(state),
    realmscape_feature: selectRealmscapeFeature(state),
    realmscape: selectRealmscape(state),
    selections: getSelections(state),
  }
}
export const hasSelections = (state: IStore): boolean => {
  const selections = getSelections(state)
  return Object.values(selections).some(x => x.length > 0)
}
