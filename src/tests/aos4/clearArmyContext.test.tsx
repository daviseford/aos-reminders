// @vitest-environment jsdom

import type { CanonicalId } from '../../aos4/domain'
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
 * Clear Army starts the army over in the application default rules context. Khazalite Holds
 * (October 2026, #1757) is the first faction that exists only in Spearhead, so a cleared imported
 * or loaded Khazalite Holds army must stay where its faction exists instead of becoming a faction
 * with nothing to field.
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
const factionNamed = (name: string) =>
  AOS4_CATALOG.entities.find(entity => entity.kind === 'faction' && entity.name === name)!
const offeredGroup = (factionId: CanonicalId, name: string) =>
  AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'offers' && relationship.from === factionId)
    .map(relationship => AOS4_CATALOG.entities.find(entity => entity.id === relationship.to)!)
    .find(entity => entity.kind === 'content-group' && entity.name === name)!

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

  it('keeps a Spearhead-only faction in Spearhead, still able to field its armies', async () => {
    const khazaliteHolds = factionNamed('Khazalite Holds')
    const army = offeredGroup(khazaliteHolds.id, 'Drakkblud’s Clanguard')
    storeArmy(spearhead.id, [khazaliteHolds.id, army.id])
    const { clickButton, container, renderHome, storedArmy } = fixture

    await renderHome()
    await clickButton('Clear Army')
    await clickButton('Clear army')

    expect(storedArmy()).toMatchObject({
      rulesContextId: spearhead.id,
      explicitSelectionIds: [khazaliteHolds.id],
    })
    // The masthead still names the faction: its selector lists Khazalite Holds only in Spearhead.
    const factionSelect = container
      .querySelector('input[aria-label="Faction"]')
      ?.closest('[class*="container"]')
    expect(factionSelect?.querySelector('[class*="singleValue"]')?.textContent).toBe('Khazalite Holds')
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
