import { TSupportedFaction } from 'meta/factions'
import { ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'

// Army
export const selectArmy = (state: IStore) => state.army.army
export const selectAllyArmies = (state: IStore) => state.army.allyArmies

// Faction Name
export const selectFactionName = (state: IStore) => state.factionNames.factionName

// Notes
export const selectNotes = (state: IStore) => state.notes.notes

// Realmscape
export const selectOriginRealm = (state: IStore) => state.realmscape.origin_realm
export const selectRealmscape = (state: IStore) => state.realmscape.realmscape
export const selectRealmscapeFeature = (state: IStore) => state.realmscape.realmscape_feature
export const selectRealmscapeSlice = (state: IStore) => state.realmscape

// Selections
export const selectAllyFactionNames = (state: IStore) =>
  Object.keys(selectAllySelections(state)) as TSupportedFaction[]
export const selectAllySelections = (state: IStore) => state.selections.allySelections
export const selectSelections = (state: IStore) => state.selections.selections

// Visibility
export const selectAllies = (state: IStore) => state.visibility.allies
export const selectReminders = (state: IStore) => state.visibility.reminders
export const selectSelectors = (state: IStore) => state.visibility.selectors
export const selectVisibility = (state: IStore) => state.visibility
export const selectWhen = (state: IStore) => state.visibility.when

// Utils
export const selectCurrentArmy = (state: IStore): ICurrentArmy => {
  return {
    allyFactionNames: selectAllyFactionNames(state),
    allySelections: selectAllySelections(state),
    factionName: selectFactionName(state),
    origin_realm: selectOriginRealm(state),
    realmscape_feature: selectRealmscapeFeature(state),
    realmscape: selectRealmscape(state),
    selections: selectSelections(state),
  }
}
export const hasSelections = (state: IStore): boolean => {
  const selections = selectSelections(state)
  return Object.values(selections).some(x => x.length > 0)
}
