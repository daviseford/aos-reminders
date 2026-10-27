// @vitest-environment jsdom

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'
import Home from 'components/routes/Home'
// Loaded statically for the same reason as in cloudArmyLinkReconciliation.test.tsx: the corpus
// parse belongs in module evaluation, not inside a per-test timeout.
import 'components/routes/HomeCatalogBound'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { MemoryRouter } from 'react-router'
import { createTestRoot, render } from 'tests/support/reactTestHelpers'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * Clear Army starts the army over in the application default rules context. A faction the default
 * context does not carry must stay where it exists instead of becoming a faction with nothing to
 * field. Khazalite Holds was Spearhead-only from October 2026 (#1757) until corpus 2026-10-26
 * (#2087) gave it matched play; Bonesplitterz, which exists only in Legends, is now the case.
 */

const auth = vi.hoisted(() => ({
  getAccessTokenSilently: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: undefined as { email: string } | undefined,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription: vi.fn().mockRejectedValue({ status: 404 }),
    updateTheme: vi.fn(),
  },
}))

vi.mock('virtual:pwa-register', async () => {
  const { pwaRegisterMockValue } = await import('tests/support/homeTestMocks')
  return pwaRegisterMockValue()
})

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

const spearhead = AOS4_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
const legends = AOS4_CATALOG.rulesContexts.find(context => context.status === 'legends')!
const factionNamed = (name: string) =>
  AOS4_CATALOG.entities.find(entity => entity.kind === 'faction' && entity.name === name)!

describe('Clear Army', () => {
  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

  const mountFixture = (signal: AbortSignal) => {
    const { container, act, cleanup } = createTestRoot(signal)
    Object.defineProperty(window, 'localStorage', { configurable: true, value: new MemoryStorage() })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: new MemoryStorage() })

    const settle = async () => {
      for (let round = 0; round < 3; round += 1) {
        await act(async () => {
          await flush()
        })
      }
    }

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
      })
      await settle()
    }

    const clickButton = async (label: string) => {
      // The confirmation modal is a lazy chunk rendered through a portal, outside the container.
      const find = () =>
        Array.from(document.querySelectorAll('button')).find(
          candidate => candidate.textContent?.trim() === label
        )
      for (let round = 0; round < 50 && !find(); round += 1) {
        await act(async () => {
          await flush()
        })
      }
      const button = find()
      expect(button, `no "${label}" button`).not.toBeUndefined()
      await act(async () => {
        button!.click()
      })
      await settle()
    }

    const storedArmy = () => JSON.parse(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '{}')

    return { cleanup, clickButton, container, renderHome, storedArmy }
  }

  let fixture: ReturnType<typeof mountFixture>

  beforeEach(({ signal }) => {
    fixture = mountFixture(signal)
  })

  afterEach(() => fixture.cleanup())

  const storeArmy = (rulesContextId: string, explicitSelectionIds: string[]) =>
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          id: 'army:clear-test',
          name: 'Clear Test',
          rulesContextId: rulesContextId as never,
          explicitSelectionIds: explicitSelectionIds as never,
        })
      )
    )

  it('keeps a faction outside the default context where it exists', async () => {
    const bonesplitterz = factionNamed('Bonesplitterz')
    storeArmy(legends.id, [bonesplitterz.id])
    const { clickButton, container, renderHome, storedArmy } = fixture

    await renderHome()
    await clickButton('Clear Army')
    await clickButton('Clear army')

    expect(storedArmy()).toMatchObject({
      rulesContextId: legends.id,
      explicitSelectionIds: [bonesplitterz.id],
    })
    // The masthead still names the faction: its selector lists Bonesplitterz only in Legends.
    const factionSelect = container
      .querySelector('input[aria-label="Faction"]')
      ?.closest('[class*="container"]')
    expect(factionSelect?.querySelector('[class*="singleValue"]')?.textContent).toBe('Bonesplitterz')
  })

  it('still starts an ordinary faction over in the application default context', async () => {
    const seraphon = factionNamed('Seraphon')
    storeArmy(spearhead.id, [seraphon.id])
    const { clickButton, renderHome, storedArmy } = fixture

    await renderHome()
    await clickButton('Clear Army')
    await clickButton('Clear army')

    expect(storedArmy()).toMatchObject({
      rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
      explicitSelectionIds: [seraphon.id],
    })
  })
})
