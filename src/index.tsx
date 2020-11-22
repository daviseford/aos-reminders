import 'core-js/stable' // organize-imports-ignore
import 'css/animations.scss' // organize-imports-ignore
import 'css/index.scss' // organize-imports-ignore
import App from 'components/App'
import { AppStatusProvider } from 'context/useAppStatus'
import { SavedArmiesProvider } from 'context/useSavedArmies'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { installNewWorker } from 'utils/installNewWorker'
import config from './auth_config.json'
import { Auth0Provider } from '@auth0/auth0-react'
import * as serviceWorker from 'serviceWorker'
import { persistor, store } from 'store'
import history from 'utils/history'

const onRedirectCallback = (appState: any) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname)
}

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        redirectUri={window.location.origin}
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
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// Learn more about service workers: https://bit.ly/CRA-PWA
// https://github.com/facebook/create-react-app/issues/5316
// https://github.com/facebook/create-react-app/issues/7237
serviceWorker.register({
  onUpdate: async registration => {
    // We post a message letting the rest of the app know that we have updated content
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('app-update')
      bc.postMessage('App has updated.')
    }

    // We prefer using the BroadcastChannel (above) as it can reach across tabs
    // But it won't always work due to browser limitations.
    // So we always dispatch an event to the window just in case.
    window.dispatchEvent(new Event('hasNewContent'))

    // Go ahead and update to the latest cached worker
    // The user will be given an option in the UI to reload and get the newest version
    // But this ensures that they'll get the new worker next time they visit
    installNewWorker()
  },
})
