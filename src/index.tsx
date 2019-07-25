import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import * as serviceWorker from './serviceWorker'
import App from './components/App'
import { army, factionNames, realmscape, selections } from 'ducks'

const store = createStore(
  combineReducers({
    army: army.reducer,
    factionNames: factionNames.reducer,
    realmscape: realmscape.reducer,
    selections: selections.reducer,
  }),
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
