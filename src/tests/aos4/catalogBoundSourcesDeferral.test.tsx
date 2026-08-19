// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

/*
 * The sources chunk is ~7 MB and 53% of the corpus, and one surface reads it: the source menu on a
 * reminder card. The whole point of #1845's split is that a session which never opens one never pays
 * for it.
 *
 * Nothing else guards the top of that path. `reminderSourceMenu` spies the `getSources` *prop*, so it
 * proves the menu does not resolve during render — but it cannot see `loadAos4SourceData` being
 * hoisted to module scope or into `HomeCatalogBound`'s render body, which would fetch the chunk
 * unconditionally on every army. That regression would be invisible to every other assertion in the
 * suite, so it gets its own: spy the loader itself, render a real army, and require zero calls.
 *
 * Behavioural rather than a source match on purpose. A text assertion would go stale the moment the
 * call moved, and #1845's own review found four guards that had drifted exactly that way.
 */

const loadAos4SourceData = vi.fn()

/*
 * Mocked at `corpus/sources` rather than at the `aos4/generated` barrel: `importActual` on the
 * barrel re-resolves the whole app graph and trips over vite-plugin-pwa's virtual module. The barrel
 * re-exports this module, so intercepting here still catches the call however it is imported.
 */
vi.mock('../../aos4/generated/corpus/sources', async () => {
  const actual = await vi.importActual<typeof import('../../aos4/generated/corpus/sources')>(
    '../../aos4/generated/corpus/sources'
  )
  return { ...actual, loadAos4SourceData: (...args: unknown[]) => loadAos4SourceData(...args) }
})

// The standard preamble for a suite that renders Home: Auth0 and the subscription API are network
// surfaces, and `virtual:pwa-register` has no file on disk for the resolver to find.
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

// Resolving the catalog-bound half parses the whole corpus. Warm it in module evaluation, where no
// per-test timeout applies, so a slow first parse cannot read as a failure.
beforeAll(async () => {
  await import('components/routes/HomeCatalogBound')
})

let container: HTMLDivElement | null = null

afterEach(() => {
  if (container) unmountComponentAtNode(container)
  container = null
  loadAos4SourceData.mockClear()
})

/** jsdom's own localStorage is not installed here, and ThemeProvider reads it during render. */
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

const renderHome = async () => {
  Object.defineProperty(window, 'localStorage', { configurable: true, value: new MemoryStorage() })
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
      container as HTMLDivElement
    )
    await new Promise(resolve => setTimeout(resolve, 0))
  })
  // A second flush: the first resolves the lazy child, this one settles its mount effects.
  await act(async () => {})
  return container as HTMLDivElement
}

describe('source records stay off the render path', () => {
  it('renders a full army without loading the sources chunk', async () => {
    const mounted = await renderHome()

    // The army really rendered — otherwise "no loader call" would be true of a blank page, which is
    // the way this assertion could pass while proving nothing.
    expect(mounted.textContent).toContain('Deployment')
    expect(mounted.querySelectorAll('[class*="card"], [class*="Card"]').length).toBeGreaterThan(0)

    expect(loadAos4SourceData).not.toHaveBeenCalled()
  })
})
