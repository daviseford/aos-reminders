import 'core-js/stable' // polyfills
import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { SavedArmiesProvider } from 'context/useSavedArmies'
import * as serviceWorker from './serviceWorker'
import { army, factionNames, realmscape, selections, visibility } from 'ducks'
import App from 'components/App'

// Auth
import { Auth0Provider } from './react-auth0-wrapper'
import config from './auth_config.json'
import { SubscriptionProvider } from 'context/useSubscription'

// CSS
import 'animate.css'
import 'css/animations.css'
import 'css/index.scss'

// A function that routes the user to the right place
// after login (Auth0)
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
  )
}

const store = createStore(
  combineReducers({
    army: army.reducer,
    factionNames: factionNames.reducer,
    realmscape: realmscape.reducer,
    selections: selections.reducer,
    visibility: visibility.reducer,
  }),
  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

render(
  <Provider store={store}>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      // @ts-ignore
      onRedirectCallback={onRedirectCallback}
    >
      <SubscriptionProvider>
        <SavedArmiesProvider>
          <App />
        </SavedArmiesProvider>
      </SubscriptionProvider>
    </Auth0Provider>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
