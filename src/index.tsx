import 'core-js/stable' // polyfills
import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { SavedArmiesProvider } from 'context/useSavedArmies'
import { AppStatusProvider } from 'context/useAppStatus'
import * as serviceWorker from './serviceWorker'
import { army, factionNames, realmscape, selections, visibility } from 'ducks'
import App from 'components/App'

// Auth
import { Auth0Provider } from './react-auth0-wrapper'
import config from './auth_config.json'
import { SubscriptionProvider } from 'context/useSubscription'

// CSS
import 'css/animations.scss'
import 'css/index.scss'
import { ThemeProvider } from 'context/useTheme'
import { installNewWorker } from 'utils/installNewWorker'

// A function that routes the user to the right place
// after login (Auth0)
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
  )
}

export const store = createStore(
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
      <AppStatusProvider>
        <SubscriptionProvider>
          <SavedArmiesProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SavedArmiesProvider>
        </SubscriptionProvider>
      </AppStatusProvider>
    </Auth0Provider>
  </Provider>,
  document.getElementById('root')
)

// Learn more about service workers: https://bit.ly/CRA-PWA
// https://github.com/facebook/create-react-app/issues/5316
// https://github.com/facebook/create-react-app/issues/7237
serviceWorker.register({
  onUpdate: async registration => {
    // We prefer using the BroadcastChannel as it can reach across tabs
    // We post a message letting the rest of the app know that we have updated content
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('app-update')
      bc.postMessage('App has updated.')
    }

    // But it won't always work due to browser limitations.
    // So we always dispatch an event to the window just in case.
    window.dispatchEvent(new Event('hasNewContent'))

    // Go ahead and update to the latest cached worker
    // The user will be given an option in the UI to reload and get the newest version
    // But this ensures that they'll get the new worker next time they visit
    installNewWorker(false)
  },
})
