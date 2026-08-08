import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'
import config from '../auth_config.json'

export class AuthenticationRequiredError extends Error {
  constructor(message = 'Please log in again to continue.') {
    super(message)
    this.name = 'AuthenticationRequiredError'
  }
}

const expectedIssuer = `https://${config.domain}/`

/**
 * Returns the `iss` claim, or null when the token is not a readable JWT. Null means "do not judge" —
 * an opaque or malformed token is left alone rather than forced through a refresh it cannot pass.
 */
const issuerOf = (token: string): string | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const claims: unknown = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    if (typeof claims !== 'object' || claims === null || !('iss' in claims)) return null
    return typeof claims.iss === 'string' ? claims.iss : null
  } catch {
    return null
  }
}

export const useApiAccessToken = (): (() => Promise<string>) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useCallback(async () => {
    if (!isAuthenticated) throw new AuthenticationRequiredError()
    const authorizationParams = {
      audience: config.audience,
      scope: 'openid profile email',
    }

    try {
      const token = await getAccessTokenSilently({ authorizationParams })
      if (!token) throw new AuthenticationRequiredError()

      /*
       * The SDK caches by client id, audience, and scope — the tenant domain is not part of the key.
       * So the move to auth.aosreminders.com left tokens minted by the old issuer sitting in
       * localStorage, handed back for their full 24h lifetime while both API Gateway authorizers
       * rejected every one of them. The session looked signed in and nothing could refresh it,
       * because a cached unexpired token is never re-fetched. Reading the claim is what notices;
       * `cacheMode: 'off'` is what replaces it. Safe to delete once no pre-cutover token can survive.
       */
      const issuer = issuerOf(token)
      if (issuer && issuer !== expectedIssuer) {
        const reissued = await getAccessTokenSilently({ cacheMode: 'off', authorizationParams })
        if (!reissued) throw new AuthenticationRequiredError()
        return reissued
      }

      return token
    } catch {
      throw new AuthenticationRequiredError()
    }
  }, [getAccessTokenSilently, isAuthenticated])
}
