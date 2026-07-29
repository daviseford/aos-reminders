// @vitest-environment jsdom

import Navbar from 'components/page/navbar'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
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

  it('uses the same Auth0 tenant configured for the established live account flow', () => {
    expect(config.domain).toBe('dev-4yesv5fz.auth0.com')
    expect(config.clientId).toBeTruthy()
    expect(config.audience).toBe('https://api.aosreminders.com')
  })
})
