import 'core-js/stable' // organize-imports-ignore
import 'css/index.scss' // organize-imports-ignore
import './bootstrap/captureShareLink' // organize-imports-ignore
import './bootstrap/registerServiceWorker' // organize-imports-ignore
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0ProviderOptions } from './bootstrap/auth0Options'
import { router } from './bootstrap/router'
import App from 'components/App'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import React from 'react'
import { createRoot } from 'react-dom/client'

const onRedirectCallback = (appState?: { returnTo?: string }) => {
  router.navigate(appState?.returnTo || window.location.pathname, { replace: true })
}

/*
 * React 19 removed the legacy `ReactDOM.render`. createRoot is the concurrent-capable replacement;
 * the tree below is unchanged. No StrictMode wrapper is added — the app has never had one, and
 * introducing it here would double-invoke every effect and change runtime behaviour, which this
 * upgrade is not the place for.
 */
const container = document.getElementById('root')
if (!container) throw new Error('Root container #root is missing from index.html')

createRoot(container).render(
  <Auth0Provider {...auth0ProviderOptions} onRedirectCallback={onRedirectCallback}>
    <AppStatusProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SubscriptionProvider>
    </AppStatusProvider>
  </Auth0Provider>
)
