// @vitest-environment jsdom

import { Header } from 'components/page/homeHeader'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryStorage } from 'tests/support/memoryStorage'
import type { CanonicalId } from '../../aos4/domain'

/*
 * The masthead's two selects, rendered on their own so their states can be driven directly.
 *
 * The Army of Renown row renders conditionally on a non-empty list. There is no reserved
 * placeholder: Home's splash covers the masthead until the catalog's list arrives, so the row's
 * first visible appearance is the reveal, complete. What this file pins is the row's conditional
 * rendering and the faction selector's disabled-when-failed state.
 */

// See tests/support/homeTestMocks.ts for why these are `await import()`ed inside the factory rather
// than imported and passed to `vi.mock` directly.
vi.mock('@auth0/auth0-react', async () => {
  const { auth0DisabledMockValue } = await import('tests/support/homeTestMocks')
  return { useAuth0: auth0DisabledMockValue }
})

vi.mock('../../api/subscriptionApi', async () => {
  const { subscriptionApiNotFoundMockValue } = await import('tests/support/homeTestMocks')
  return { SubscriptionApi: subscriptionApiNotFoundMockValue() }
})

vi.mock('virtual:pwa-register', async () => {
  const { pwaRegisterMockValue } = await import('tests/support/homeTestMocks')
  return pwaRegisterMockValue()
})

const FACTION_ID = 'faction:test-faction' as CanonicalId<'faction'>
const ARMY_OF_RENOWN_ID = 'content-group:test-army-of-renown' as CanonicalId

const ARMIES_OF_RENOWN = [{ label: 'Grand Court Nightblades', value: ARMY_OF_RENOWN_ID }]

describe('the masthead selects', () => {
  let container: HTMLDivElement

  const renderHeader = async (props: Partial<Parameters<typeof Header>[0]>) => {
    await act(async () => {
      render(
        <AppStatusProvider>
          <SubscriptionProvider>
            <ThemeProvider>
              <MemoryRouter>
                <Header
                  armiesOfRenown={[]}
                  armyName="Test Army"
                  armyOfRenownId={null}
                  factionId={FACTION_ID}
                  factions={[{ label: 'Test Faction', value: FACTION_ID }]}
                  isGameMode={false}
                  onArmyOfRenownChange={vi.fn()}
                  onFactionChange={vi.fn()}
                  onToggleGameMode={vi.fn()}
                  {...props}
                />
              </MemoryRouter>
            </ThemeProvider>
          </SubscriptionProvider>
        </AppStatusProvider>,
        container
      )
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  }

  const armyOfRenownRow = () => {
    const label = Array.from(container.querySelectorAll('span')).find(
      span => span.textContent === 'Army of Renown:'
    )
    return label ? (label.nextElementSibling as HTMLElement) : null
  }

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: new MemoryStorage() })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('renders no Army of Renown row for an empty list', async () => {
    await renderHeader({})

    expect(armyOfRenownRow()).toBeNull()
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
  })

  it('renders a live Army of Renown control when the list is present', async () => {
    await renderHeader({ armiesOfRenown: ARMIES_OF_RENOWN, armyOfRenownId: ARMY_OF_RENOWN_ID })

    expect(armyOfRenownRow()).not.toBeNull()
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')
    expect(input).not.toBeNull()
    expect(input!.disabled).toBe(false)
  })

  /*
   * A faction change needs a catalog to resolve against, and on the failed screen there is not one
   * coming. Offering the control anyway meant a pick that changed the masthead, never reached
   * storage — the save guard is held shut until a catalog-validated load lands — and vanished on
   * the next reload.
   */
  it('disables the faction selector when the catalog could not be loaded', async () => {
    await renderHeader({ catalogUnavailable: true })

    const faction = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
    expect(faction).not.toBeNull()
    expect(faction!.disabled).toBe(true)
    // Disabled, not removed: the army the player has is still named.
    expect(container.textContent).toContain('Test Faction')
  })

  it('leaves the faction selector live while the catalog is merely pending', async () => {
    await renderHeader({})

    expect(container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')!.disabled).toBe(false)
  })
})
