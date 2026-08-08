// @vitest-environment jsdom

import { AuthenticationRequiredError, useApiAccessToken } from 'utils/authToken'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import config from '../../auth_config.json'

const auth = vi.hoisted(() => ({
  getAccessTokenSilently: vi.fn(),
  isAuthenticated: true,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

const currentIssuer = `https://${config.domain}/`
const previousIssuer = 'https://dev-4yesv5fz.auth0.com/'

const tokenFrom = (issuer: string): string => {
  const claims = btoa(JSON.stringify({ iss: issuer, sub: 'auth0|general' }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `header.${claims}.signature`
}

describe('API access tokens', () => {
  let container: HTMLDivElement
  let getToken: (() => Promise<string>) | undefined

  const Probe = () => {
    getToken = useApiAccessToken()
    return null
  }

  beforeEach(async () => {
    auth.isAuthenticated = true
    auth.getAccessTokenSilently.mockReset()
    getToken = undefined
    container = document.createElement('div')
    document.body.appendChild(container)
    await act(async () => {
      render(<Probe />, container)
      await Promise.resolve()
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  it('passes through a token minted by the configured issuer', async () => {
    const token = tokenFrom(currentIssuer)
    auth.getAccessTokenSilently.mockResolvedValue(token)

    await expect(getToken?.()).resolves.toBe(token)
    expect(auth.getAccessTokenSilently).toHaveBeenCalledTimes(1)
  })

  it('replaces a cached token left behind by a previous issuer', async () => {
    // The cache key is client id, audience, and scope — never the tenant domain — so a token from
    // before the custom-domain cutover survives in localStorage and every authorizer rejects it.
    const reissued = tokenFrom(currentIssuer)
    auth.getAccessTokenSilently
      .mockResolvedValueOnce(tokenFrom(previousIssuer))
      .mockResolvedValueOnce(reissued)

    await expect(getToken?.()).resolves.toBe(reissued)
    expect(auth.getAccessTokenSilently).toHaveBeenCalledTimes(2)
    expect(auth.getAccessTokenSilently).toHaveBeenLastCalledWith(
      expect.objectContaining({ cacheMode: 'off' })
    )
  })

  it('leaves a token it cannot read alone rather than forcing a refresh it cannot pass', async () => {
    auth.getAccessTokenSilently.mockResolvedValue('opaque-token')

    await expect(getToken?.()).resolves.toBe('opaque-token')
    expect(auth.getAccessTokenSilently).toHaveBeenCalledTimes(1)
  })

  it('reports an empty reissue as needing a login rather than returning it', async () => {
    auth.getAccessTokenSilently.mockResolvedValueOnce(tokenFrom(previousIssuer)).mockResolvedValueOnce('')

    await expect(getToken?.()).rejects.toBeInstanceOf(AuthenticationRequiredError)
  })

  it('refuses to ask for a token while signed out', async () => {
    auth.isAuthenticated = false
    await act(async () => {
      render(<Probe />, container)
      await Promise.resolve()
    })

    await expect(getToken?.()).rejects.toBeInstanceOf(AuthenticationRequiredError)
    expect(auth.getAccessTokenSilently).not.toHaveBeenCalled()
  })
})
