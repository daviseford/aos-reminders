import 'core-js/stable' // organize-imports-ignore
import 'css/index.scss' // organize-imports-ignore
import './bootstrap/captureShareLink' // organize-imports-ignore
import './bootstrap/registerServiceWorker' // organize-imports-ignore
import { Auth0Provider } from '@auth0/auth0-react'
import { router } from './bootstrap/router'
import App from 'components/App'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import React from 'react'
import { createRoot } from 'react-dom/client'
import config from './auth_config.json'

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

/*
 * `useRefreshTokens` and `cacheLocation` are both load-bearing. Without them the SDK defaults to an
 * in-memory cache refilled by a hidden-iframe `prompt=none` call, which needs the Auth0 session
 * cookie in a third-party context. Browsers no longer send that cookie, so every token renewal
 * failed: signed-in users saw the subscription lookup error, and a reload dropped them to signed-out
 * because nothing survived the page load. Refresh tokens do not depend on cookie policy, and
 * localstorage is what carries the session across a reload.
 */
createRoot(container).render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    useRefreshTokens
    cacheLocation="localstorage"
    authorizationParams={{
      audience: config.audience,
      redirect_uri: window.location.origin,
      scope: 'openid profile email',
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <AppStatusProvider>
      <SubscriptionProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SubscriptionProvider>
    </AppStatusProvider>
  </Auth0Provider>
)
