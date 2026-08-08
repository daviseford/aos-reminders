// @vitest-environment jsdom

import Navbar from 'components/page/navbar'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import config from '../../auth_config.json'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: undefined as { email: string } | undefined,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

describe('established account shell', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear: vi.fn(),
        getItem: vi.fn(() => null),
        key: vi.fn(() => null),
        length: 0,
        removeItem: vi.fn(),
        setItem: vi.fn(),
      } satisfies Storage,
    })
    auth.isAuthenticated = false
    auth.isLoading = false
    auth.loginWithPopup.mockReset()
    auth.logout.mockReset()
    auth.user = undefined
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const renderNavbar = () => {
    act(() => {
      render(
        <AppStatusProvider>
          <SubscriptionProvider>
            <ThemeProvider>
              <MemoryRouter>
                <Navbar />
              </MemoryRouter>
            </ThemeProvider>
          </SubscriptionProvider>
        </AppStatusProvider>,
        container
      )
    })
  }

  it('opens the production Auth0 popup flow from the familiar signed-out navigation', () => {
    vi.useFakeTimers()
    const popup = { closed: true } as Window
    vi.spyOn(window, 'open').mockReturnValue(popup)
    renderNavbar()

    const loginButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Log in'
    )
    expect(container.textContent).toContain('Subscribe')
    expect(container.textContent).toContain('FAQ')
    expect(loginButton).toBeDefined()

    act(() => {
      loginButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(window.open).toHaveBeenCalledWith(
      undefined,
      'auth0:authorize:popup',
      expect.stringContaining('width=400')
    )
    expect(auth.loginWithPopup).toHaveBeenCalledWith(
      { authorizationParams: { redirect_uri: window.location.href } },
      { popup }
    )

    act(() => {
      vi.runOnlyPendingTimers()
    })
  })

  it('falls back to the Auth0-managed popup when the browser blocks the pre-opened window', () => {
    vi.useFakeTimers()
    vi.spyOn(window, 'open').mockReturnValue(null)
    renderNavbar()

    const loginButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Log in'
    )
    act(() => {
      loginButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(auth.loginWithPopup).toHaveBeenCalledWith({
      authorizationParams: { redirect_uri: window.location.href },
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('restores Profile and Log out when Auth0 reports an authenticated user', () => {
    auth.isAuthenticated = true
    renderNavbar()

    expect(container.textContent).toContain('Profile')
    expect(container.textContent).toContain('Log out')

    const logoutButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Log out'
    )
    act(() => {
      logoutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(auth.logout).toHaveBeenCalledWith({
      clientId: config.clientId,
      logoutParams: { returnTo: window.location.origin },
    })
  })

  it('reaches the tenant through the first-party custom domain', () => {
    // A subdomain of the site, not the canonical dev-*.auth0.com host: same tenant either way, but
    // only this one is same-site, so the Auth0 session cookie is first-party. Tokens minted here
    // carry iss https://auth.aosreminders.com/, which both API Gateway JWT authorizers pin exactly.
    expect(config.domain).toBe('auth.aosreminders.com')
    expect(config.clientId).toBeTruthy()
    expect(config.audience).toBe('https://api.aosreminders.com')
  })
})
