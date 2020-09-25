import { army, factionNames, realmscape, selections, visibility } from 'ducks'
import { combineReducers, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage: storage,
}

const rootReducer = combineReducers({
  army: army.reducer,
  factionNames: factionNames.reducer,
  realmscape: realmscape.reducer,
  selections: selections.reducer,
  visibility: visibility.reducer,
})

const pReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  pReducer,
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store)
