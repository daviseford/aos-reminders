// @vitest-environment jsdom

import { createDefaultAos4ArmyDocument, saveAos4ArmyDocument } from '../../aos4/runtime'
import { serializeAos4ArmyDocument } from '../../aos4/state'
import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { MemoryRouter } from 'react-router'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { writeCloudArmyLink } from 'utils/cloudArmyLink'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * The reconciliation the durable cloud-army link depends on: a link restored from storage names a
 * record on the account, and the account is the only thing that can say whether that record is
 * still there. These cover the load-time path, which is the one a player actually meets — the
 * modals were already refreshing the collection when they opened. See issue #1965.
 */

const auth = vi.hoisted(() => ({
  getAccessTokenSilently: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: { email: 'owner@example.com' } as { email: string } | undefined,
}))

const armyApi = vi.hoisted(() => ({
  createArmy: vi.fn(),
  createShare: vi.fn(),
  deleteArmy: vi.fn(),
  isConfigured: true,
  listArmies: vi.fn(),
  updateArmy: vi.fn(),
}))

const getSubscription = vi.hoisted(() => vi.fn())

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/armyApi', () => ({
  ArmyApi: armyApi,
  ArmyApiError: class ArmyApiError extends Error {
    status = 0
  },
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription,
    updateTheme: vi.fn(),
  },
}))

// Home's banner slot reaches the PWA plugin's virtual module, which has no file on disk.
vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn(() => vi.fn(async () => undefined)) }))

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

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

const LINKED_ID = 'cloud-linked-1'

const linkedDocument = { ...createDefaultAos4ArmyDocument(), name: 'Tourney List' }

const remoteArmy = (id: string, name: string) => ({
  id,
  createdAt: 1,
  updatedAt: 2,
  document: { ...linkedDocument, name },
})

describe('cloud army link reconciliation on load', () => {
  let container: HTMLDivElement

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

  /** The state a reload starts from: a saved army on screen and a link naming its cloud record. */
  const seedLinkedDocument = () => {
    saveAos4ArmyDocument(window.localStorage, linkedDocument)
    writeCloudArmyLink({
      id: LINKED_ID,
      name: 'Tourney List',
      savedSignature: serializeAos4ArmyDocument(linkedDocument),
    })
  }

  const storedLink = () => window.localStorage.getItem('aos-reminders:aos4:cloud-army-link:v1')

  const buttonLabels = () =>
    Array.from(container.querySelectorAll('button')).map(button => button.textContent?.trim())

  beforeEach(() => {
    auth.isAuthenticated = true
    auth.isLoading = false
    auth.user = { email: 'owner@example.com' }
    auth.getAccessTokenSilently.mockReset()
    auth.getAccessTokenSilently.mockResolvedValue('access-token')
    Object.values(armyApi).forEach(value => {
      if (typeof value === 'function' && 'mockReset' in value) value.mockReset()
    })
    armyApi.isConfigured = true
    armyApi.listArmies.mockResolvedValue([])
    getSubscription.mockReset()
    getSubscription.mockRejectedValue({ status: 404 })
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

  it('clears a link whose record the account no longer holds, without opening a modal', async () => {
    seedLinkedDocument()
    armyApi.listArmies.mockResolvedValue([remoteArmy('cloud-other', 'Someone Else')])

    await renderHome()

    expect(armyApi.listArmies).toHaveBeenCalledWith('access-token')
    expect(storedLink()).toBeNull()
    expect(container.textContent).not.toContain('Cloud army:')
    expect(buttonLabels()).toContain('Save Army')
    expect(buttonLabels()).not.toContain('Save As')
  })

  /*
   * The case the old `armies.length === 0` guard could never reach: deleting the linked record
   * elsewhere, when it was the only one, leaves a collection that is both loaded and empty.
   */
  it('clears the link when the deleted record was the last army on the account', async () => {
    seedLinkedDocument()
    armyApi.listArmies.mockResolvedValue([])

    await renderHome()

    expect(storedLink()).toBeNull()
    expect(container.textContent).not.toContain('Cloud army:')
  })

  it('keeps a link whose record is still on the account, and names it', async () => {
    seedLinkedDocument()
    armyApi.listArmies.mockResolvedValue([remoteArmy(LINKED_ID, 'Tourney List')])

    await renderHome()

    expect(storedLink()).not.toBeNull()
    expect(container.textContent).toContain('Cloud army:')
    expect(container.textContent).toContain('Tourney List')
  })

  /*
   * A failed fetch is not evidence of deletion. Unlinking on it would throw away exactly the
   * persistence the link exists to provide, so the link is kept and the toolbar still offers it.
   */
  it('keeps the link when the collection cannot be loaded, and does not retry in a loop', async () => {
    seedLinkedDocument()
    armyApi.listArmies.mockRejectedValue(new Error('Network unavailable'))

    await renderHome()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(storedLink()).not.toBeNull()
    expect(container.textContent).toContain('Cloud army:')
    expect(armyApi.listArmies).toHaveBeenCalledTimes(1)
  })

  it('does not fetch the collection for a document that is not linked to one', async () => {
    saveAos4ArmyDocument(window.localStorage, linkedDocument)

    await renderHome()

    expect(armyApi.listArmies).not.toHaveBeenCalled()
    expect(buttonLabels()).toContain('Save Army')
  })
})
