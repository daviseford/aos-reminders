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
import type { CanonicalId, RulesContextId } from '../../aos4/domain'
import defaultsJson from '../../aos4/generated/corpus/defaults.json'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'

/*
 * A catalog chunk that cannot be fetched at all — a dropped connection, or a deploy that retired
 * the asset an open tab is still asking for. Before Home split, that took the whole route down and
 * the failure was at least visible. The risk the split introduces is chrome that looks finished and
 * never produces a reminder, so this is the guard on R11.
 *
 * The half of it that the split shipped without: the failure reached the *region* but never the
 * shell above it, so the masthead went on advertising a wait that had already ended — a reserved
 * "Loading..." row, a faction selector whose picks nothing could honour, and a share id already
 * spent on a child that never arrived. Nothing in this file may import the catalog; every
 * expectation is about markup the shell owns, computed from the generated faction index.
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

const PENDING_SHARE_STORAGE_KEY = 'aos-reminders:aos4:pending-share'

const defaults = defaultsJson as unknown as {
  defaultFactionId: CanonicalId<'faction'>
  rulesContextId: RulesContextId
}

const rowNamed = (name: string) => {
  const row = AOS4_FACTION_INDEX.factions.find(faction => faction.name === name)
  if (!row) throw new Error(`No faction index row named ${name}`)
  return row
}

/*
 * A faction that does have Armies of Renown under the stored context, so the shell would reserve
 * the row if it still believed the catalog were coming. Chosen precisely because it is the case
 * that fails loudly rather than the one that never had a row to begin with.
 */
const FLESH_EATER_COURTS = rowNamed('Flesh-eater Courts')

const storedArmy = (factionId: CanonicalId<'faction'>, name: string) =>
  serializeAos4ArmyDocument(
    createAos4ArmyDocument({
      id: 'army:unavailable-test',
      name,
      rulesContextId: defaults.rulesContextId,
      explicitSelectionIds: [factionId],
    })
  )

describe('the Home shell when the catalog-bound half cannot be loaded', () => {
  let container: HTMLDivElement
  let storage: MemoryStorage
  let session: MemoryStorage

  beforeEach(() => {
    storage = new MemoryStorage()
    session = new MemoryStorage()
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: session })
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
    // The rest of the shell is untouched: the failure takes the region, not the screen.
    expect(container.querySelector('footer')).not.toBeNull()
  })

  /*
   * The copy used to say "Reload to try again." beside a disabled `OfflineBtn`, naming the one
   * action the screen did not offer. Reloading is the only thing that can help here — a retired
   * asset resolves into whatever deploy the tab has not picked up yet — so the screen offers it.
   */
  it('offers a real, enabled reload control rather than naming an action it does not have', async () => {
    await renderHome()

    const reload = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Reload'
    )
    expect(reload).not.toBeUndefined()
    expect(reload!.disabled).toBe(false)
    expect(container.textContent).not.toContain('Reload to try again')
  })

  /*
   * The announcement. The pending text used to live inside `LoadingArmy`, which is unmounted at
   * exactly this moment, so the one state a player most needs told about was the one that was never
   * announced — the region carrying the text went away with the thing that failed.
   */
  it('says so in the live region the shell owns', async () => {
    await renderHome()

    const status = container.querySelector('[role="status"]')
    expect(status).not.toBeNull()
    expect(status!.textContent).toBe('Your army could not be loaded')
    expect(status!.className).toContain('visually-hidden')
  })

  /*
   * The masthead's half of the failure. `CatalogBoundary` renders `OfflineArmy` in the region, but
   * the shell decides the reservation, so without the boundary telling it, the row sat there
   * disabled and busy claiming a load that had definitively stopped.
   */
  it('stops reserving the Army of Renown row for a faction that has one', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))
    const defaultContext = AOS4_FACTION_INDEX.rulesContextIds.indexOf(defaults.rulesContextId)
    expect(FLESH_EATER_COURTS.armiesOfRenownContextIndexes).toContain(defaultContext)

    await renderHome()

    expect(container.textContent).not.toContain('Army of Renown:')
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
    expect(container.querySelector('[aria-busy]')).toBeNull()
    expect(container.textContent).not.toContain('Loading...')
  })

  /*
   * A pick made here could not be resolved against a catalog that is not present, and could not
   * reach storage either — the save guard stays shut until a catalog-validated load lands, which is
   * never. So it is not offered: the control keeps naming the army and stops taking answers.
   */
  it('disables the faction selector rather than taking a pick it cannot honour', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()

    const faction = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
    expect(faction).not.toBeNull()
    expect(faction!.disabled).toBe(true)
    expect(container.textContent).toContain('Flesh-eater Courts')
  })

  /*
   * The share the failure must not eat. Reading the key used to remove it, so a chunk that never
   * arrived left an incoming share with no copy anywhere — not in the child, which never mounted,
   * and no longer in session storage, so a reload could not find it either.
   */
  it('leaves an incoming share id recoverable on reload', async () => {
    const shareId = 'a'.repeat(32)
    session.setItem(PENDING_SHARE_STORAGE_KEY, shareId)

    await renderHome()

    expect(session.getItem(PENDING_SHARE_STORAGE_KEY)).toBe(shareId)
  })

  /*
   * The shell still holds no unvalidated write. A first-run player's default document therefore
   * never reaches storage on this path, and that is the deliberate trade: the default is a
   * constant, so the next load that succeeds recreates it exactly, while writing the shell's
   * structural read would put an unpruned document over the stored one with no catalog-validated
   * pass ever coming to repair it. See the save effect in Home.
   */
  it('writes nothing to storage, because nothing here has been validated against a catalog', async () => {
    await renderHome()

    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBeNull()
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
