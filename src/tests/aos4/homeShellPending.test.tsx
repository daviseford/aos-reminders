// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * The shell window: what a player has on screen after Home's own chunk paints and before the
 * catalog-bound half arrives. Held open by a child module import that never settles, which is the
 * only way to observe a state that lasts milliseconds in a browser and none at all in a test that
 * awaits the import.
 */

vi.mock('components/routes/HomeCatalogBound', () => new Promise<never>(() => {}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    getAccessTokenSilently: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    user: undefined,
  }),
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription: vi.fn().mockRejectedValue({ status: 404 }),
    updateTheme: vi.fn(),
  },
}))

vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn(() => vi.fn(async () => undefined)) }))

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('the Home shell while the catalog-bound half is still loading', () => {
  let container: HTMLDivElement

  beforeEach(async () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)

    await act(async () => {
      render(
        <AppStatusProvider>
          <SubscriptionProvider>
            <ThemeProvider>
              <MemoryRouter>
                <Home />
              </MemoryRouter>
            </ThemeProvider>
          </SubscriptionProvider>
        </AppStatusProvider>,
        container
      )
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('paints the chrome it owns and announces the pending region', () => {
    expect(container.querySelector('footer')).not.toBeNull()

    const status = container.querySelector('[role="status"]')
    expect(status).not.toBeNull()
    expect(status?.textContent).toContain('Loading your army')
  })

  /*
   * `LoadingBody` was the obvious thing to reuse and is the wrong shape here: its 35vh top padding
   * is sized for a bare route, and its own product-name heading would repeat the masthead's and
   * skip from <h1> to <h3> on the way.
   */
  it('does not reuse the page-centered route fallback or repeat the product name', () => {
    expect(container.querySelector('.LoadingContainer')).toBeNull()

    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading =>
      heading.textContent?.trim()
    )
    expect(headings).not.toContain('AoS Reminders')
  })
})
