// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { lazy, Suspense, act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * A catalog chunk that cannot be fetched at all — a dropped connection, or a deploy that retired
 * the asset an open tab is still asking for. Before Home split, that took the whole route down and
 * the failure was at least visible. The risk the split introduces is chrome that looks finished and
 * never produces a reminder, so this is the guard on R11.
 */

vi.mock('components/routes/HomeCatalogBound', () =>
  Promise.reject(new Error('Failed to fetch dynamically imported module'))
)

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

describe('the Home shell when the catalog-bound half cannot be loaded', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  const renderHome = async () => {
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
  }

  it('puts a visible unavailable state where the builder and reminders belong', async () => {
    await renderHome()

    expect(container.textContent).toContain('Your army could not be loaded.')
    expect(container.textContent).toContain('Offline')
    // Still an unresolved pending state would be the failure mode this exists to rule out.
    expect(container.querySelector('[role="status"]')).toBeNull()
    // The rest of the shell is untouched: the failure takes the region, not the screen.
    expect(container.querySelector('footer')).not.toBeNull()
  })

  /*
   * The inversion. Suspense alone catches nothing — a rejected import propagates past it — so
   * without the boundary the same failure leaves the region blank, which is exactly the inert
   * screen R11 forbids. The control root supplies its own `onUncaughtError` because React's
   * default reports the error to the host, and here the error is the expected result.
   */
  it('needs the boundary: Suspense on its own leaves the region blank', async () => {
    const control = document.createElement('div')
    document.body.appendChild(control)
    const root = createRoot(control, { onUncaughtError: () => {} })
    /*
     * The import is what fails, so the module's own props never come into it — the stand-in keeps
     * this control render free of the shell's whole prop contract.
     */
    const CatalogBound = lazy(async () => {
      await import('components/routes/HomeCatalogBound')
      return { default: () => null }
    })

    let escaped: unknown
    try {
      await act(async () => {
        root.render(
          <Suspense fallback={<span>pending</span>}>
            <CatalogBound />
          </Suspense>
        )
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    } catch (error) {
      escaped = error
    }

    expect(escaped).toBeDefined()
    expect(control.textContent).not.toContain('Your army could not be loaded.')
    expect(control.textContent).toBe('')

    act(() => {
      root.unmount()
    })
    control.remove()
  })
})
