// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { ThemeProvider } from 'context/useTheme'
import { SubscriptionProvider } from 'context/useSubscription'
import React from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { Simulate } from 'tests/support/reactTestHelpers'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: undefined as { email: string } | undefined,
}))
const getSubscription = vi.hoisted(() => vi.fn())
const historyPush = vi.hoisted(() => vi.fn())

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription,
    updateTheme: vi.fn(),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push: historyPush }),
  }
})

vi.mock('components/input/importArmy/importArmyModal', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? (
      <div aria-label="Import Army" role="dialog">
        Free import
      </div>
    ) : null,
}))

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

describe('AoS 4 home presentation', () => {
  let container: HTMLDivElement

  const renderHome = () =>
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

  beforeEach(() => {
    auth.isAuthenticated = false
    auth.isLoading = false
    auth.user = undefined
    auth.loginWithPopup.mockReset()
    getSubscription.mockReset()
    getSubscription.mockRejectedValue({ status: 501 })
    historyPush.mockReset()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)

    act(() => {
      renderHome()
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('preserves the established header, builder-card, toolbar, and reminder-card presentation', () => {
    // The masthead band: Bootstrap 5 removed .jumbotron, so the landmark is the themed,
    // print-suppressed header block that carried those classes.
    expect(container.querySelector('.bg-themeDarkBluePrimary.d-print-none')).not.toBeNull()
    expect(container.querySelector('.bg-themeDarkBluePrimary')).not.toBeNull()
    expect(container.querySelector('[role="switch"]')).not.toBeNull()
    expect(container.querySelector('.card-header.bg-themeLightBlue')).not.toBeNull()
    expect(container.querySelector('.ReminderContainer')).not.toBeNull()
    expect(container.querySelector('.ReminderCardBody')).not.toBeNull()
    expect(container.textContent).toContain('Age of Sigmar Reminders')
    expect(container.textContent).toContain('Edit')
    expect(container.textContent).toContain('Play')
    expect(container.textContent).toContain('Clear Army')
    // `master` shipped a Download PDF toolbar button, not a browser-print one.
    expect(container.textContent).toContain('Download PDF')
    expect(container.textContent).toContain('Import Army')
    expect(container.textContent).toContain('My Armies')
    expect(container.textContent).toContain('Share Army')
    expect(container.textContent).toContain('Subscribe')
    expect(container.textContent).toContain('FAQ')
    expect(container.textContent).toContain('Log in')
  })

  it('opens the free import without authentication or a subscription', async () => {
    const importButton = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Import Army'
    )
    expect(importButton).not.toBeUndefined()
    expect(importButton?.disabled).toBe(false)

    await act(async () => {
      Simulate.click(importButton!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(auth.loginWithPopup).not.toHaveBeenCalled()
    expect(container.querySelector('[role="dialog"][aria-label="Import Army"]')).not.toBeNull()
  })

  it('keeps import free while subscriber-only actions stay gated for an inactive account', async () => {
    act(() => {
      unmountComponentAtNode(container)
    })
    auth.isAuthenticated = true
    auth.user = { email: 'inactive@example.com' }

    await act(async () => {
      renderHome()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const findButton = (label: string) =>
      Array.from(container.querySelectorAll('button')).find(button => button.textContent?.trim() === label)

    expect(getSubscription).toHaveBeenCalledWith('inactive@example.com')
    expect(findButton('My Armies')?.disabled).toBe(false)
    expect(findButton('Share Army')?.disabled).toBe(false)

    act(() => {
      Simulate.click(findButton('My Armies')!)
      Simulate.click(findButton('Share Army')!)
    })

    expect(historyPush).toHaveBeenNthCalledWith(1, '/subscribe')
    expect(historyPush).toHaveBeenNthCalledWith(2, '/subscribe')

    await act(async () => {
      Simulate.click(findButton('Import Army')!)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(auth.loginWithPopup).not.toHaveBeenCalled()
    expect(container.querySelector('[role="dialog"][aria-label="Import Army"]')).not.toBeNull()
  })

  /**
   * `Endless Spells` is a `Factions.csv` container for universal manifestations, not an army
   * (#1796). Offering it handed the player a force with no units and no explanation.
   */
  it('offers only factions that field units in the army selector', async () => {
    const factionInput = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
    expect(factionInput).not.toBeNull()

    await act(async () => {
      factionInput!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const offered = Array.from(container.querySelectorAll('[role="option"]')).map(option =>
      option.textContent?.trim()
    )
    expect(offered).toContain('Stormcast Eternals')
    expect(offered).toContain('Flesh-eater Courts')
    expect(offered).toContain('Disciples of Tzeentch')
    expect(offered).not.toContain('Endless Spells')
  })

  it('does not render the migration-workbench reskin', () => {
    expect(container.querySelector('.aos4-hero')).toBeNull()
    expect(container.querySelector('.aos4-layout')).toBeNull()
    expect(container.querySelector('.aos4-reminder')).toBeNull()
    expect(container.textContent).not.toContain('AoS 4 migration workbench')
    expect(container.textContent).not.toContain('Build less. Remember more.')
  })
})
