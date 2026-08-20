// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CanonicalId, RulesContextId } from '../../aos4/domain'
/*
 * Home's catalog-bound half is behind `lazy()`, and resolving it means parsing the whole rules
 * corpus — seconds, not a flush. Warming it here puts that cost in module evaluation where no
 * per-test timeout applies; the gate below is what makes the resolution itself observable.
 */
import '../../aos4/generated'
import defaultsJson from '../../aos4/generated/corpus/defaults.json'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  serializeAos4ArmyDocument,
} from '../../aos4/state'

/*
 * The handoff: the window in which the shell is alone on screen, and the moment the catalog-bound
 * half arrives and takes over. Everything the player did while waiting has to still be there
 * afterwards, and the screen has to be the screen `master` renders once it is.
 *
 * The child module import is gated rather than mocked away, so both halves under test are the real
 * ones and the boundary between them is the only thing being simulated.
 */

/*
 * A re-armable Suspense gate. `lazy()` resolves its module once for the lifetime of the process, so
 * holding the *import* open only works for the first test in a file; suspending inside the mocked
 * component instead reopens the shell window for every one of them, through the same Suspense
 * boundary the real chunk load goes through.
 */
const gate = vi.hoisted(() => {
  let release = () => {}
  let pending: Promise<void> = Promise.resolve()
  let open = true
  return {
    arm() {
      open = false
      pending = new Promise<void>(resolve => {
        release = resolve
      })
    },
    open() {
      open = true
      release()
    },
    waitDuringRender() {
      if (!open) throw pending
    },
  }
})

/*
 * The other way the child can go away: not a chunk that never arrived, but one that mounted,
 * published its bindings, and then threw. Fired from outside through a subscription so the throw
 * happens in a real re-render of the real child, which is what makes its unmount path — and the
 * bindings the shell is still holding — the thing under test.
 */
const bomb = vi.hoisted(() => {
  const listeners = new Set<() => void>()
  return {
    fire() {
      listeners.forEach(listener => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
})

vi.mock('components/routes/HomeCatalogBound', async () => {
  const { useEffect, useState } = await import('react')
  const actual = await vi.importActual<typeof import('components/routes/HomeCatalogBound')>(
    'components/routes/HomeCatalogBound'
  )
  const CatalogBound = actual.default
  return {
    ...actual,
    default: (props: Parameters<typeof CatalogBound>[0]) => {
      const [detonated, setDetonated] = useState(false)
      useEffect(() => bomb.subscribe(() => setDetonated(true)), [])
      gate.waitDuringRender()
      if (detonated) throw new Error('the catalog-bound half failed after mounting')
      return <CatalogBound {...props} />
    },
  }
})

const analytics = vi.hoisted(() => ({
  logFactionSelection: vi.fn(),
  logGameModeChange: vi.fn(),
}))

vi.mock('utils/analytics', async () => {
  const actual = await vi.importActual<typeof import('utils/analytics')>('utils/analytics')
  return { ...actual, ...analytics }
})

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

// The share modal's own failure mode, separately from the child's: it is its own lazy chunk, so it
// can fail to arrive after the child has. Throwing from the mock reaches the same ModalBoundary an
// import rejection would.
const shareModalGate = vi.hoisted(() => ({ broken: false }))

vi.mock('components/input/armySharing/sharedArmyModal', () => ({
  default: ({ closeModal, shareId }: { closeModal: () => void; shareId: string }) => {
    if (shareModalGate.broken) throw new Error('the share modal chunk failed to load')
    return (
      <div aria-label="Shared Army" role="dialog">
        {`Loading share ${shareId}`}
        <button onClick={closeModal} type="button">
          Keep current army
        </button>
      </div>
    )
  },
}))

// Broken for the whole file, standing in for a retired chunk; only the modal-failure case opens it.
vi.mock('components/print/printModal', () => ({
  default: () => {
    throw new Error('the print modal chunk failed to load')
  },
}))

const CLOUD_ARMY_LINK_STORAGE_KEY = 'aos-reminders:aos4:cloud-army-link:v1'
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

const FLESH_EATER_COURTS = rowNamed('Flesh-eater Courts')

/*
 * A rules context this faction is playable in but offers no Army of Renown in — Spearhead, in the
 * checked-in corpus. Derived from the index rather than named by its UUID so a corpus that retires
 * or renumbers a context fails loudly here instead of quietly testing nothing.
 */
const contextWithoutArmiesOfRenown = (row: typeof FLESH_EATER_COURTS): RulesContextId => {
  const index = row.rulesContextIndexes.find(
    candidate => !row.armiesOfRenownContextIndexes.includes(candidate)
  )
  if (index === undefined) throw new Error(`${row.name} offers Armies of Renown in every context`)
  return AOS4_FACTION_INDEX.rulesContextIds[index]
}

const storedArmy = (
  factionId: CanonicalId<'faction'>,
  name: string,
  rulesContextId: RulesContextId = defaults.rulesContextId
) =>
  serializeAos4ArmyDocument(
    createAos4ArmyDocument({
      id: 'army:handoff-test',
      name,
      rulesContextId,
      explicitSelectionIds: [factionId],
    })
  )

describe('the handoff from the Home shell to the catalog-bound half', () => {
  let container: HTMLDivElement
  let storage: MemoryStorage
  let session: MemoryStorage

  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

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
  }

  // Resolving the gated import, then letting React commit the child and its effects.
  const landTheCatalog = async () => {
    await act(async () => {
      gate.open()
      await flush()
    })
    await act(async () => {
      await flush()
    })
  }

  const factionSlot = () =>
    container
      .querySelector<HTMLInputElement>('input[aria-label="Faction"]')!
      .closest('.col-12') as HTMLElement

  const selectedFactionName = () =>
    factionSlot().querySelector('[class*="singleValue"]')?.textContent?.trim() ?? null

  const openMenu = async (label: string) => {
    const input = container.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)
    expect(input).not.toBeNull()
    await act(async () => {
      input!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      await flush()
    })
  }

  const pick = async (label: string, optionText: string) => {
    await openMenu(label)
    const option = Array.from(container.querySelectorAll('[role="option"]')).find(
      candidate => candidate.textContent?.trim() === optionText
    )
    expect(option, `no option "${optionText}" under ${label}`).not.toBeUndefined()
    await act(async () => {
      option!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await flush()
    })
  }

  const togglePlayMode = async () => {
    await act(async () => {
      container.querySelector<HTMLInputElement>('#game-mode-switch')!.click()
      await flush()
    })
  }

  const armyOfRenownRow = () => {
    const label = Array.from(container.querySelectorAll('span')).find(
      span => span.textContent === 'Army of Renown:'
    )
    return label ? (label.nextElementSibling as HTMLElement) : null
  }

  const storedDocument = () =>
    deserializeAos4ArmyDocumentStructure(storage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '').document

  /*
   * Resolve the gated module once, before any test. `vi.importActual` inside the mock factory walks
   * the corpus again, which takes far longer than the flushes below wait for — without this, every
   * `landTheCatalog` would return while the module was still loading and read a shell that had not
   * handed anything over yet.
   */
  beforeAll(async () => {
    await import('components/routes/HomeCatalogBound')
  })

  beforeEach(() => {
    gate.arm()
    shareModalGate.broken = false
    analytics.logFactionSelection.mockClear()
    analytics.logGameModeChange.mockClear()
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

  /*
   * R5. The pick is the whole reason the document moved up into the shell: before, a player who
   * chose a faction during the wait was choosing in a control the arriving child was about to
   * overwrite from storage.
   */
  it('keeps a faction picked during the wait, and applies it exactly once when the child lands', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))
    storage.setItem(
      CLOUD_ARMY_LINK_STORAGE_KEY,
      JSON.stringify({ id: 'cloud-army-1', name: 'Grand Court Nightblades' })
    )

    await renderHome()
    await pick('Faction', 'Fyreslayers')

    expect(selectedFactionName()).toBe('Fyreslayers')
    expect(analytics.logFactionSelection).toHaveBeenCalledTimes(1)
    // The cloud link is what a faction switch falsifies, and the shell has no in-memory copy of it
    // to drop — only the persisted one.
    expect(storage.getItem(CLOUD_ARMY_LINK_STORAGE_KEY)).toBeNull()

    await landTheCatalog()

    expect(selectedFactionName()).toBe('Fyreslayers')
    expect(analytics.logFactionSelection).toHaveBeenCalledTimes(1)
    expect(storage.getItem(CLOUD_ARMY_LINK_STORAGE_KEY)).toBeNull()
    // The child rebuilt from the picked faction rather than from the document still on disk.
    expect(container.textContent).toContain('Fyreslayers')
    expect(container.textContent).not.toContain('Grand Court Nightblades')

    // And only now does the pick reach storage, because only now has it been validated.
    const saved = storedDocument()
    expect(saved?.name).toBe('Fyreslayers')
    expect(saved?.explicitSelectionIds).toEqual([rowNamed('Fyreslayers').id])
    // A toolbar offering Update Army would mean the child restored the link the shell cleared.
    expect(
      Array.from(container.querySelectorAll('button'), button => button.textContent?.trim())
    ).not.toContain('Update Army')
  })

  it('keeps Play mode chosen during the wait', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()
    await togglePlayMode()

    expect(container.querySelector('h2')?.textContent).toBe('Grand Court Nightblades')
    expect(analytics.logGameModeChange).toHaveBeenCalledTimes(1)

    await landTheCatalog()

    expect(container.querySelector('h2')?.textContent).toBe('Grand Court Nightblades')
    expect(analytics.logGameModeChange).toHaveBeenCalledTimes(1)
    // Play mode hides the builder and the toolbar; the reminders stay.
    const buttons = Array.from(container.querySelectorAll('button'), button => button.textContent?.trim())
    expect(buttons).not.toContain('Clear Army')
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()
  })

  /*
   * KTD8. The row is the one piece of masthead the shell cannot fill in, so it is the one that
   * could shift the page when the catalog lands. It has to be in the same place, in the same box,
   * before and after — only its contents may change.
   */
  it('fills the reserved Army of Renown slot in place, without moving the row', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()
    const reserved = armyOfRenownRow()
    expect(reserved).not.toBeNull()
    const before = {
      row: reserved!.className,
      column: reserved!.firstElementChild!.className,
      // Which child of the masthead container the row is, so an inserted or reordered sibling is
      // caught as well as a resized one.
      index: Array.from(reserved!.parentElement!.children).indexOf(reserved!),
      minHeight: getComputedStyle(reserved!.querySelector<HTMLElement>('[class*="-control"]')!).minHeight,
    }
    expect(before.minHeight).toBe('38px')

    await landTheCatalog()

    const live = armyOfRenownRow()!
    expect({
      row: live.className,
      column: live.firstElementChild!.className,
      index: Array.from(live.parentElement!.children).indexOf(live),
      minHeight: getComputedStyle(live.querySelector<HTMLElement>('[class*="-control"]')!).minHeight,
    }).toEqual(before)

    expect(container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')!.disabled).toBe(
      false
    )
  })

  it('reserves nothing, and grows nothing, for a faction with no Armies of Renown', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(rowNamed('Seraphon').id, 'Seraphon'))

    await renderHome()
    expect(armyOfRenownRow()).toBeNull()

    await landTheCatalog()
    expect(armyOfRenownRow()).toBeNull()
  })

  /*
   * The regression the reservation was capable of causing itself. Flesh-eater Courts has Armies of
   * Renown under the default context and none under Spearhead, so a reservation decided from the
   * default context put a row on this document that the catalog then took away — the same shift the
   * reservation exists to prevent, just in the other direction and only for players not on the
   * default context, which is why the browser check that signed the split off never saw it.
   */
  it('reserves nothing on a context where the faction has no Armies of Renown, and lands with none', async () => {
    const rulesContextId = contextWithoutArmiesOfRenown(FLESH_EATER_COURTS)
    expect(rulesContextId).not.toBe(defaults.rulesContextId)
    storage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades', rulesContextId)
    )

    await renderHome()
    expect(selectedFactionName()).toBe('Flesh-eater Courts')
    expect(armyOfRenownRow()).toBeNull()

    // The catalog is the arbiter, and it agrees: nothing was reserved and nothing arrives, so the
    // row never enters or leaves the layout.
    await landTheCatalog()
    expect(armyOfRenownRow()).toBeNull()
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
  })

  /*
   * The id is held by the shell — the one component under this route that cannot remount — so a
   * child torn down and rebuilt behind Suspense and the error boundary never drops it. And the read
   * is non-destructive all the way to the modal's own answer: the child mounting is not enough,
   * because the share modal is its own lazy chunk, and clearing at child mount lost the share
   * whenever that chunk failed to arrive after the child had.
   */
  it('holds an incoming share id in the shell until the share modal takes responsibility for it', async () => {
    session.setItem(PENDING_SHARE_STORAGE_KEY, 'a'.repeat(32))

    await renderHome()

    // Read before the child exists at all, and left where a reload can find it again.
    expect(session.getItem(PENDING_SHARE_STORAGE_KEY)).toBe('a'.repeat(32))
    expect(container.querySelector('[role="dialog"][aria-label="Shared Army"]')).toBeNull()

    await landTheCatalog()

    expect(container.querySelector('[role="dialog"][aria-label="Shared Army"]')?.textContent).toContain(
      `Loading share ${'a'.repeat(32)}`
    )
    // The modal is on screen, but until the player answers it, a reload must still find the key.
    expect(session.getItem(PENDING_SHARE_STORAGE_KEY)).toBe('a'.repeat(32))

    // Declining is an answer: something has taken responsibility for the id, so the key goes.
    await act(async () => {
      Array.from(container.querySelectorAll('button'))
        .find(button => button.textContent === 'Keep current army')!
        .click()
      await flush()
    })

    expect(container.querySelector('[role="dialog"][aria-label="Shared Army"]')).toBeNull()
    expect(session.getItem(PENDING_SHARE_STORAGE_KEY)).toBeNull()
  })

  /*
   * A modal chunk failing is not the catalog failing. Before each modal had its own boundary, a
   * retired modal asset threw past the modal's `Suspense` to `CatalogBoundary`, which unmounted a
   * fully working army, announced "Your army could not be loaded", and disabled the faction
   * selector with no way back. The army was fine; only the modal was missing.
   */
  it('keeps the army and the masthead alive when a modal chunk fails', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()
    await landTheCatalog()

    await act(async () => {
      Array.from(container.querySelectorAll('button'))
        .find(button => button.textContent?.trim() === 'Download PDF')!
        .click()
      await flush()
    })

    expect(container.textContent).toContain('That window could not be opened.')
    // The failure stayed a modal failure: the region below is still the army, the live region still
    // says so, and the masthead still takes picks.
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()
    expect(container.textContent).not.toContain('Your army could not be loaded.')
    expect(container.querySelector('[role="status"]')!.textContent).toBe('Your army is ready')
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')!.disabled).toBe(false)
  })

  /*
   * The same failure on the one modal that opens itself: the share modal consumes an id the player
   * cannot re-mint — the URL param was stripped at capture — so losing the chunk must not also
   * lose the id. The key stays in session storage, where the reload the alert asks for finds it.
   */
  it('keeps the share id recoverable when the share modal chunk fails after the child arrived', async () => {
    shareModalGate.broken = true
    session.setItem(PENDING_SHARE_STORAGE_KEY, 'a'.repeat(32))

    await renderHome()
    await landTheCatalog()

    expect(container.textContent).toContain('That window could not be opened.')
    expect(session.getItem(PENDING_SHARE_STORAGE_KEY)).toBe('a'.repeat(32))
    // And the army behind the modal is untouched.
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')!.disabled).toBe(false)
  })

  /*
   * The other side of the lift: once the child is on screen, the masthead has to behave the way it
   * did when it lived there. The Army of Renown select is the one whose data now makes a round trip
   * through the shell, so it is the one worth driving end to end.
   */
  it('drives faction, mode, and Army of Renown from the shell once the child is mounted', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()
    await landTheCatalog()

    await openMenu('Army of Renown')
    const offered = Array.from(container.querySelectorAll('[role="option"]'), option =>
      option.textContent?.trim()
    )
    expect(offered).toContain('None')
    expect(offered.length).toBeGreaterThan(1)

    const armyOfRenown = offered.find(name => name !== 'None') as string
    await pick('Army of Renown', armyOfRenown)

    expect(armyOfRenownRow()!.querySelector('[class*="singleValue"]')?.textContent).toBe(armyOfRenown)
    expect(storedDocument()?.explicitSelectionIds.length).toBeGreaterThan(1)

    await pick('Faction', 'Seraphon')
    expect(selectedFactionName()).toBe('Seraphon')
    // Seraphon has none, so the row goes with the faction rather than lingering empty.
    expect(armyOfRenownRow()).toBeNull()
    expect(storedDocument()?.explicitSelectionIds).toEqual([rowNamed('Seraphon').id])

    await togglePlayMode()
    expect(container.querySelector('h2')?.textContent).toBe('Seraphon')
  })

  /*
   * The announcement of the handoff itself. It used to live inside `LoadingArmy` — the one element
   * guaranteed to be gone at the moment worth announcing — so the transition a player waits for was
   * never reported. One region, owned by the shell, alive across both halves, only ever updated.
   */
  it('announces the pending state and then the handoff, through one region that never remounts', async () => {
    const region = container.querySelector('[role="status"]')
    expect(region).toBeNull()

    await renderHome()

    const pending = container.querySelector('[role="status"]')
    expect(pending).not.toBeNull()
    expect(pending!.textContent).toBe('Loading your army')

    await landTheCatalog()

    // The same node, with new text. A live region that is created already containing what it has to
    // say is announced unreliably; one that is updated in place is not.
    expect(container.querySelector('[role="status"]')).toBe(pending)
    expect(pending!.textContent).toBe('Your army is ready')
  })

  /*
   * The failure that arrives *after* the handoff, which the split had no answer for at all. The
   * boundary swaps the region for `OfflineArmy`, but the shell was still holding bindings the child
   * published on its way in: a skip link aimed at an `#aos4-reminders` that no longer exists, and a
   * live Army of Renown select whose handler resolves against a catalog nothing is rendering.
   */
  it('withdraws the skip link and the live Army of Renown control when the child fails after mounting', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()
    await landTheCatalog()

    expect(container.querySelector('a.SkipLink')).not.toBeNull()
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')!.disabled).toBe(
      false
    )

    await act(async () => {
      bomb.fire()
      await flush()
    })

    expect(container.textContent).toContain('Your army could not be loaded.')
    // A skip link whose target went with the child moves focus nowhere, and it is the first thing a
    // keyboard user meets.
    expect(container.querySelector('a.SkipLink')).toBeNull()
    expect(container.querySelector('#aos4-reminders')).toBeNull()
    // The row goes too, rather than falling back to the reserved "Loading..." placeholder: there is
    // no list coming.
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
    expect(container.textContent).not.toContain('Army of Renown:')
    expect(container.querySelector('[aria-busy]')).toBeNull()
    expect(container.querySelector('[role="status"]')!.textContent).toBe('Your army could not be loaded')
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')!.disabled).toBe(true)
  })
})
