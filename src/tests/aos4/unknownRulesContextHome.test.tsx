// @vitest-environment jsdom

import { createDefaultAos4ArmyDocument, saveAos4ArmyDocument } from '../../aos4/runtime'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { serializeAos4ArmyDocument, toWireAos4ArmyDocument } from '../../aos4/state'
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
import { writeCloudArmyLink } from 'utils/cloudArmyLink'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * The army on this device, when a newer release saved it under a ruleset this one does not carry
 * (#2055). The screen keeps working on a stand-in, and nothing the player does here may overwrite
 * the stored army or the cloud link that describes it: the update that can read them must find
 * them exactly as they were.
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

vi.mock('virtual:pwa-register', async () => {
  const { pwaRegisterMockValue } = await import('tests/support/homeTestMocks')
  return pwaRegisterMockValue()
})

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

const FUTURE_CONTEXT_ID = 'rules-context:90000000-0000-4000-8000-00000000ffff'
const LINK_KEY = 'aos-reminders:aos4:cloud-army-link:v1'
const LINKED_ID = 'cloud-linked-1'

const futureSerialized = JSON.stringify({
  ...toWireAos4ArmyDocument({
    ...createDefaultAos4ArmyDocument(),
    id: 'army:future',
    name: 'Newer Release List',
  }),
  rulesContextId: FUTURE_CONTEXT_ID,
})

describe('a stored army that uses a ruleset this release does not carry', () => {
  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

  /*
   * Everything one test drives, bound when that test starts: a test that times out keeps running,
   * and must not reach the next test's screen through describe-scoped state (#2076).
   */
  const mountFixture = (signal: AbortSignal) => {
    const { container, act, cleanup } = createTestRoot(signal)
    Object.defineProperty(window, 'localStorage', { configurable: true, value: new MemoryStorage() })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: new MemoryStorage() })

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
        await flush()
      })
      await act(async () => {
        await flush()
      })
    }

    const pickFaction = async (name: string) => {
      const input = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
      expect(input).not.toBeNull()
      await act(async () => {
        input!.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
        )
        await flush()
      })
      const option = Array.from(container.querySelectorAll('[role="option"]')).find(
        candidate => candidate.textContent?.trim() === name
      )
      expect(option, `no faction option "${name}"`).not.toBeUndefined()
      await act(async () => {
        option!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
        await flush()
      })
    }

    const clickUpdateArmy = async () => {
      const button = Array.from(container.querySelectorAll('button')).find(
        candidate => candidate.textContent?.trim() === 'Update Army'
      )
      expect(button, 'Update Army is not offered').not.toBeUndefined()
      await act(async () => {
        button!.click()
        await flush()
      })
      await act(async () => {
        await flush()
      })
    }

    const updateNotice = () =>
      Array.from(container.querySelectorAll('[role="alert"]')).find(alert =>
        alert.textContent?.includes('Your saved army uses rules')
      )

    const buttonLabels = () =>
      Array.from(container.querySelectorAll('button')).map(button => button.textContent?.trim())

    return { act, buttonLabels, cleanup, clickUpdateArmy, container, pickFaction, renderHome, updateNotice }
  }

  let fixture: ReturnType<typeof mountFixture>

  beforeEach(({ signal }) => {
    auth.isAuthenticated = true
    auth.getAccessTokenSilently.mockReset()
    auth.getAccessTokenSilently.mockResolvedValue('access-token')
    Object.values(armyApi).forEach(value => {
      if (typeof value === 'function' && 'mockReset' in value) value.mockReset()
    })
    armyApi.isConfigured = true
    armyApi.listArmies.mockResolvedValue([])
    getSubscription.mockReset()
    getSubscription.mockRejectedValue({ status: 404 })
    fixture = mountFixture(signal)
  })

  afterEach(() => fixture.cleanup())

  it('keeps the stored army untouched while the stand-in is edited, and says why', async () => {
    const { container, pickFaction, renderHome, updateNotice } = fixture
    window.localStorage.setItem(AOS4_ARMY_STORAGE_KEY, futureSerialized)

    await renderHome()

    // Honest on a rollback too, where no newer version will arrive: it names what is needed and what
    // is kept, and promises no refresh will fix it.
    expect(updateNotice()?.textContent).toContain('need a newer version of AoS Reminders')
    expect(updateNotice()?.textContent).toContain('stays saved on this device')
    expect(updateNotice()?.textContent).toContain('changes to it are not saved')
    expect(updateNotice()?.textContent).not.toMatch(/refresh/i)
    expect(updateNotice()?.className).toContain('alert-warning')
    // The builder still works: the stand-in is a normal army.
    expect(container.querySelector('input[aria-label="Faction"]')).not.toBeNull()
    expect(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(futureSerialized)

    await pickFaction('Seraphon')

    expect(container.textContent).toContain('Seraphon')
    expect(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(futureSerialized)
  })

  it('neither uses nor clears the cloud link that describes the stored army', async () => {
    const { buttonLabels, container, pickFaction, renderHome } = fixture
    window.localStorage.setItem(AOS4_ARMY_STORAGE_KEY, futureSerialized)
    writeCloudArmyLink({ id: LINKED_ID, name: 'Newer Release List', savedSignature: futureSerialized })
    const storedLink = window.localStorage.getItem(LINK_KEY)

    await renderHome()
    await pickFaction('Seraphon')

    // The stand-in is not that cloud army, so Update Army must not offer to write it there.
    expect(container.textContent).not.toContain('Cloud army:')
    expect(buttonLabels()).not.toContain('Update Army')
    expect(armyApi.updateArmy).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(LINK_KEY)).toBe(storedLink)
  })

  it('does not offer Update Army against a linked cloud army a newer release saved', async () => {
    const { buttonLabels, renderHome, updateNotice } = fixture
    const localDocument = { ...createDefaultAos4ArmyDocument(), name: 'Tourney List' }
    saveAos4ArmyDocument(window.localStorage, localDocument)
    writeCloudArmyLink({ id: LINKED_ID, name: 'Tourney List' })
    const storedLink = window.localStorage.getItem(LINK_KEY)
    armyApi.listArmies.mockResolvedValue([
      {
        id: LINKED_ID,
        createdAt: 1,
        updatedAt: 2,
        document: { ...localDocument, rulesContextId: FUTURE_CONTEXT_ID },
        requiresUpdate: { rulesContextId: FUTURE_CONTEXT_ID },
      },
    ])

    await renderHome()

    expect(armyApi.listArmies).toHaveBeenCalled()
    expect(buttonLabels()).not.toContain('Update Army')
    expect(buttonLabels()).toContain('Save Army')
    // Kept for the updated app, which can use it.
    expect(window.localStorage.getItem(LINK_KEY)).toBe(storedLink)
    expect(updateNotice()).toBeUndefined()
  })

  it('still resets a corrupt stored army and saves the reset, as before', async () => {
    const { renderHome, updateNotice } = fixture
    window.localStorage.setItem(AOS4_ARMY_STORAGE_KEY, JSON.stringify({ schemaVersion: 4 }))

    await renderHome()

    expect(updateNotice()).toBeUndefined()
    expect(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(
      serializeAos4ArmyDocument(createDefaultAos4ArmyDocument())
    )
  })

  it('still saves edits to a known stored army, as before', async () => {
    const { pickFaction, renderHome, updateNotice } = fixture
    saveAos4ArmyDocument(window.localStorage, createDefaultAos4ArmyDocument())

    await renderHome()
    await pickFaction('Seraphon')

    expect(updateNotice()).toBeUndefined()
    expect(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)).toContain('Seraphon')
  })

  /*
   * Update Army against a stored link is a write to whatever the account holds now, and until the
   * list has loaded nothing says that is not an army a newer version saved. An empty list reads the
   * same as "not marked", so the toolbar used to offer the write while the list was still loading,
   * and for good after a failed load.
   */
  describe('Update Army against a stored cloud link', () => {
    const localDocument = { ...createDefaultAos4ArmyDocument(), name: 'Tourney List' }
    const linkedRecord = { id: LINKED_ID, createdAt: 1, updatedAt: 2, document: localDocument }

    const seedChangedLink = () => {
      saveAos4ArmyDocument(window.localStorage, localDocument)
      // A signature that no longer matches the army on screen, so Update Army has something to write.
      writeCloudArmyLink({ id: LINKED_ID, name: 'Tourney List', savedSignature: 'an older copy' })
    }

    const deferred = <T,>() => {
      let resolve: (value: T) => void = () => {}
      let reject: (reason: unknown) => void = () => {}
      const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve
        reject = onReject
      })
      return { promise, reject, resolve }
    }

    beforeEach(() => {
      getSubscription.mockResolvedValue({ body: { active: true, subscribed: true } })
      armyApi.updateArmy.mockResolvedValue({ id: LINKED_ID, updatedAt: 3, document: localDocument })
    })

    it('is withheld while the list is loading, then offered once it confirms the record', async () => {
      const { act, buttonLabels, clickUpdateArmy, container, renderHome } = fixture
      seedChangedLink()
      const listing = deferred<unknown[]>()
      armyApi.listArmies.mockReturnValue(listing.promise)

      await renderHome()

      expect(armyApi.listArmies).toHaveBeenCalledTimes(1)
      expect(container.textContent).toContain('Cloud army:')
      expect(buttonLabels()).not.toContain('Update Army')
      expect(buttonLabels()).toContain('Save As')

      await act(async () => {
        listing.resolve([linkedRecord])
        await flush()
      })

      // The safe case still works: a confirmed, readable record is updated as before.
      await clickUpdateArmy()
      expect(armyApi.updateArmy).toHaveBeenCalledTimes(1)
      expect(armyApi.updateArmy).toHaveBeenCalledWith(
        LINKED_ID,
        expect.objectContaining({ name: 'Tourney List' }),
        'access-token'
      )
    })

    it('is never offered when the list loads and marks the record as needing an update', async () => {
      const { act, buttonLabels, renderHome } = fixture
      seedChangedLink()
      const listing = deferred<unknown[]>()
      armyApi.listArmies.mockReturnValue(listing.promise)

      await renderHome()
      expect(buttonLabels()).not.toContain('Update Army')

      await act(async () => {
        listing.resolve([
          {
            ...linkedRecord,
            document: { ...localDocument, rulesContextId: FUTURE_CONTEXT_ID },
            requiresUpdate: { rulesContextId: FUTURE_CONTEXT_ID },
          },
        ])
        await flush()
      })

      expect(buttonLabels()).not.toContain('Update Army')
      expect(armyApi.updateArmy).not.toHaveBeenCalled()
    })

    it('is never offered after the list fails to load, and the link is kept', async () => {
      const { act, buttonLabels, container, renderHome } = fixture
      seedChangedLink()
      const storedLink = window.localStorage.getItem(LINK_KEY)
      const listing = deferred<unknown[]>()
      armyApi.listArmies.mockReturnValue(listing.promise)

      await renderHome()
      await act(async () => {
        listing.reject(new Error('Network unavailable'))
        await flush()
      })
      await act(async () => {
        await flush()
      })

      expect(armyApi.listArmies).toHaveBeenCalledTimes(1)
      expect(container.textContent).toContain('Cloud army:')
      expect(buttonLabels()).not.toContain('Update Army')
      expect(buttonLabels()).toContain('Save As')
      expect(armyApi.updateArmy).not.toHaveBeenCalled()
      expect(window.localStorage.getItem(LINK_KEY)).toBe(storedLink)
    })

    it('is withheld while signed out, where the list cannot load', async () => {
      const { buttonLabels, renderHome } = fixture
      auth.isAuthenticated = false
      seedChangedLink()

      await renderHome()

      expect(armyApi.listArmies).not.toHaveBeenCalled()
      expect(buttonLabels()).not.toContain('Update Army')
      expect(armyApi.updateArmy).not.toHaveBeenCalled()
    })
  })
})
