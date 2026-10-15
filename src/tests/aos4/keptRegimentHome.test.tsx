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
 * A saved Fyreslayers army keeps the Gotrek Gurnisson Regiment of Renown it took before October
 * 2026 (#1757), when the regiment stopped being offered to Fyreslayers outside the 2025-26 past
 * season. The pick stays, its reminders say it is not available to the army, and choosing an Army
 * of Renown, which re-checks what the army is offered, leaves it alone.
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

const named = (kind: string, name: string) =>
  AOS4_CATALOG.entities.find(entity => entity.kind === kind && entity.name === name)!
const fyreslayers = named('faction', 'Fyreslayers')
const gotrek = named('content-group', 'Gotrek Gurnisson')
const lofnirDrothkeepers = named('content-group', 'Lofnir Drothkeepers')

describe('a saved Fyreslayers army that kept Gotrek Gurnisson', () => {
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

    const pickArmyOfRenown = async (name: string) => {
      const input = container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')
      expect(input, 'no Army of Renown select').not.toBeNull()
      await act(async () => {
        input!.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
        )
        await flush()
      })
      const option = Array.from(container.querySelectorAll('[role="option"]')).find(
        candidate => candidate.textContent?.trim() === name
      )
      expect(option, `no Army of Renown option "${name}"`).not.toBeUndefined()
      await act(async () => {
        option!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      })
      await settle()
    }

    const storedSelections = (): string[] =>
      JSON.parse(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '{}').explicitSelectionIds ?? []

    return { cleanup, container, pickArmyOfRenown, renderHome, storedSelections }
  }

  let fixture: ReturnType<typeof mountFixture>

  beforeEach(({ signal }) => {
    fixture = mountFixture(signal)
  })

  afterEach(() => fixture.cleanup())

  const storeArmy = (explicitSelectionIds: string[]) =>
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          id: 'army:kept-gotrek',
          name: 'Kept Gotrek',
          rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
          explicitSelectionIds: explicitSelectionIds as never,
        })
      )
    )

  it('keeps the pick and marks its reminders as not available to the army', async () => {
    storeArmy([fyreslayers.id, gotrek.id])
    const { container, renderHome, storedSelections } = fixture

    await renderHome()

    expect(storedSelections()).toContain(gotrek.id)
    expect(container.textContent).toContain('UNSTOPPABLE BATTLE FURY')
    expect(container.textContent).toContain('Not available to this army')
  })

  it('leaves the pick alone when an Army of Renown is chosen', async () => {
    storeArmy([fyreslayers.id, gotrek.id])
    const { pickArmyOfRenown, renderHome, storedSelections } = fixture

    await renderHome()
    await pickArmyOfRenown('Lofnir Drothkeepers')

    expect(storedSelections()).toEqual(
      expect.arrayContaining([fyreslayers.id, gotrek.id, lofnirDrothkeepers.id])
    )
  })
})
