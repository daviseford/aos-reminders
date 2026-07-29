import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'
import config from '../auth_config.json'

export class AuthenticationRequiredError extends Error {
  constructor(message = 'Please log in again to continue.') {
    super(message)
    this.name = 'AuthenticationRequiredError'
  }
}

export const useApiAccessToken = (): (() => Promise<string>) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useCallback(async () => {
    if (!isAuthenticated) throw new AuthenticationRequiredError()
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: config.audience,
          scope: 'openid profile email',
        },
      })
    } catch {
      throw new AuthenticationRequiredError()
    }
  }, [getAccessTokenSilently, isAuthenticated])
}
