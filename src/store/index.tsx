import armyReducer from 'ducks/army'
import factionNamesReducer from 'ducks/factionNames'
import notesReducer from 'ducks/notes'
import realmscapeReducer from 'ducks/realmscape'
import selectionsReducer from 'ducks/selections'
import visibilityReducer from 'ducks/visibility'
import { combineReducers, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage: storage,
}

const rootReducer = combineReducers({
  army: armyReducer,
  factionNames: factionNamesReducer,
  notes: notesReducer,
  realmscape: realmscapeReducer,
  selections: selectionsReducer,
  visibility: visibilityReducer,
})

const pReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  pReducer,
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)
