import armyReducer from 'ducks/army'
import factionNamesReducer from 'ducks/factionNames'
import notesReducer from 'ducks/notes'
import realmscapeReducer from 'ducks/realmscape'
import selectionsReducer from 'ducks/selections'
import visibilityReducer from 'ducks/visibility'
import { combineReducers, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import DefaultAppState from './initialAppState'

const rootReducer = combineReducers({
  army: armyReducer,
  factionNames: factionNamesReducer,
  notes: notesReducer,
  realmscape: realmscapeReducer,
  selections: selectionsReducer,
  visibility: visibilityReducer,
})

const pReducer = persistReducer(
  {
    key: 'root',
    version: 4,
    storage,
    migrate: async (state, currentVersion) => {
      console.log(state, currentVersion)
      if (!state) return state

      // v3 -> v4 Migration
      if (!currentVersion || currentVersion < 4) {
        // Blow the current state away
        console.warn(
          'Outdated version of AoS Reminders detected (>=4.0.0 required). Wiping the state clean to avoid potentially fatal crashes.'
        )
        return {
          ...DefaultAppState,
          _persist: {
            ...state._persist,
            version: 4,
          },
        }
      }

      return state
    },
  },
  rootReducer
)

export const store = createStore(
  pReducer,
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)
