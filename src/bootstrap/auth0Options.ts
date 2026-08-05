import type { Auth0ProviderOptions } from '@auth0/auth0-react'
import config from '../auth_config.json'

/*
 * Session persistence for the installed PWA.
 *
 * The SDK defaults — `cacheLocation: 'memory'` and `useRefreshTokens: false` — cannot keep a
 * session across an app close. Memory cache dies with the JS context, and the only recovery path
 * left is `checkSession()`, a hidden iframe to `/authorize?prompt=none` that needs the Auth0
 * session cookie readable in a third-party context. Safari ITP blocks that, and an iOS standalone
 * PWA gets a storage jar separate from Safari, so the cookie the login popup set may not be
 * reachable at all. The result is a user who logs in, closes the app, reopens it, and is signed
 * out.
 *
 * `localstorage` survives the close; the refresh token mints new access tokens without ever
 * touching a third-party cookie. The tradeoff is that tokens become reachable by XSS — accepted
 * here because refresh token rotation is enabled on the tenant, which revokes a stolen token the
 * next time the legitimate one is used.
 *
 * This depends on tenant configuration that lives outside the repository. Both must stay on or
 * the SPA is issued no refresh token and these options quietly do nothing:
 *   - Application -> Settings -> Refresh Token Rotation
 *   - API `https://api.aosreminders.com` -> Settings -> Allow Offline Access
 */
export const auth0ProviderOptions = {
  domain: config.domain,
  clientId: config.clientId,
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
  // The iframe fallback is the path already blocked on mobile. Pinned off so a failed refresh
  // surfaces as an error the app can handle rather than a silent hang on a blocked iframe.
  useRefreshTokensFallback: false,
  authorizationParams: {
    audience: config.audience,
    redirect_uri: window.location.origin,
    // The SDK appends `offline_access` whenever `useRefreshTokens` is set; naming it keeps the
    // grant this configuration depends on visible at the call site.
    scope: 'openid profile email offline_access',
  },
} satisfies Auth0ProviderOptions
