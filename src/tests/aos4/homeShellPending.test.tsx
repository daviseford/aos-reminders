// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CanonicalId, RulesContextId } from '../../aos4/domain'
import defaultsJson from '../../aos4/generated/corpus/defaults.json'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'

/*
 * The shell window: what a player has on screen after Home's own chunk paints and before the
 * catalog-bound half arrives. Held open by a child module import that never settles, which is the
 * only way to observe a state that lasts milliseconds in a browser and none at all in a test that
 * awaits the import.
 *
 * Nothing in this file may import the catalog: every expectation below is either about markup the
 * shell owns or is computed from the generated faction index, which is what the shell itself reads.
 * `corpusArtifacts` holds the index to the catalog — playable rows against `armyFactions`, rules
 * contexts against the entities, `armiesOfRenownContextIndexes` against the builder in every
 * context — so the two halves of "the same factions as today" are asserted where each one belongs.
 */

vi.mock('components/routes/HomeCatalogBound', () => new Promise<never>(() => {}))

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

const defaults = defaultsJson as unknown as {
  defaultFactionId: CanonicalId<'faction'>
  rulesContextId: RulesContextId
}

const rowNamed = (name: string) => {
  const row = AOS4_FACTION_INDEX.factions.find(faction => faction.name === name)
  if (!row) throw new Error(`No faction index row named ${name}`)
  return row
}

// The three shapes the masthead has to tell apart, named rather than positional so a regenerated
// index that reorders its rows does not silently change what is under test.
const FLESH_EATER_COURTS = rowNamed('Flesh-eater Courts')
const SERAPHON = rowNamed('Seraphon')
const ENDLESS_SPELLS = rowNamed('Endless Spells')

const DEFAULT_CONTEXT_INDEX = AOS4_FACTION_INDEX.rulesContextIds.indexOf(defaults.rulesContextId)

/*
 * A rules context the faction can be played in but offers no Army of Renown in — Spearhead, in the
 * checked-in corpus, where a battletome faction's whole Armies of Renown list is simply absent.
 *
 * Derived rather than named by id because the id is a UUID that says nothing, and derived rather
 * than asked of the catalog because this file may not load one. `corpusArtifacts` is what proves
 * the index tells the truth about each context; here it is taken as given.
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
      id: 'army:shell-window-test',
      name,
      rulesContextId,
      explicitSelectionIds: [factionId],
    })
  )

describe('the Home shell while the catalog-bound half is still loading', () => {
  let container: HTMLDivElement
  let storage: MemoryStorage

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

  const factionSlot = () => {
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
    expect(input).not.toBeNull()
    return input!.closest('.col-12') as HTMLElement
  }

  const selectedFactionName = () =>
    factionSlot().querySelector('[class*="singleValue"]')?.textContent?.trim() ?? null

  const offeredFactions = async () => {
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')
    await act(async () => {
      input!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    return Array.from(container.querySelectorAll('[role="option"]'), option => option.textContent?.trim())
  }

  const pickFaction = async (name: string) => {
    const offered = await offeredFactions()
    expect(offered).toContain(name)
    const option = Array.from(container.querySelectorAll('[role="option"]')).find(
      candidate => candidate.textContent?.trim() === name
    )
    await act(async () => {
      option!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  }

  const toggleToPlayMode = async () => {
    const modeSwitch = container.querySelector<HTMLInputElement>('#game-mode-switch')
    expect(modeSwitch).not.toBeNull()
    await act(async () => {
      modeSwitch!.click()
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  }

  beforeEach(() => {
    storage = new MemoryStorage()
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: new MemoryStorage() })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('paints the chrome it owns and announces the pending region', async () => {
    await renderHome()

    expect(container.querySelector('footer')).not.toBeNull()

    const status = container.querySelector('[role="status"]')
    expect(status).not.toBeNull()
    expect(status?.textContent).toContain('Loading your army')
  })

  /*
   * The masthead is the reason the state moved up here. Before it did, the loading window showed the
   * fallback and the footer with nothing above them — no navbar, no product name, no way to pick a
   * faction — where the route-level fallback it replaced had at least held the space.
   */
  it('paints the masthead, the navbar, and a working faction selector before the catalog exists', async () => {
    await renderHome()

    expect(container.querySelector('.bg-themeDarkBluePrimary.d-print-none')).not.toBeNull()
    expect(container.textContent).toContain('Age of Sigmar Reminders')
    expect(container.textContent).toContain('Select your faction to get started:')
    expect(container.querySelector('nav')).not.toBeNull()
    expect(container.querySelector('input[aria-label="Faction"]')).not.toBeNull()
    expect(container.querySelector('#game-mode-switch')).not.toBeNull()
  })

  it('offers exactly the factions the catalog-bound selector offers, in the same order', async () => {
    await renderHome()

    const expected = AOS4_FACTION_INDEX.factions
      .filter(faction => faction.playable && faction.rulesContextIndexes.includes(DEFAULT_CONTEXT_INDEX))
      .map(faction => faction.name)
      .sort((left, right) => left.localeCompare(right))

    const offered = await offeredFactions()
    expect(offered).toEqual(expected)
    // `Endless Spells` is a Factions.csv container for universal manifestations, not an army
    // (#1796); it is the one decoded faction the index marks unplayable.
    expect(offered).not.toContain('Endless Spells')
    expect(offered).toContain('Stormcast Eternals')
  })

  it('names the stored army and its faction on first paint', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades'))

    await renderHome()

    expect(selectedFactionName()).toBe('Flesh-eater Courts')

    await toggleToPlayMode()
    expect(container.querySelector('h2')?.textContent).toBe('Grand Court Nightblades')
  })

  /*
   * Every decoded faction can name itself; only the ones that field units are offered. A document
   * naming one that is no longer on offer keeps its own name and leaves the selector empty, which is
   * what the catalog-bound masthead did with the same document.
   */
  it('lets a stored non-playable faction name itself while leaving the selector empty', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(ENDLESS_SPELLS.id, 'Endless Spells'))

    await renderHome()

    expect(selectedFactionName()).toBeNull()
    expect(factionSlot().querySelector('[class*="placeholder"]')?.textContent).toBe('Select...')

    await toggleToPlayMode()
    expect(container.querySelector('h2')?.textContent).toBe('Endless Spells')
  })

  it('falls back to the generated default faction when nothing is stored', async () => {
    await renderHome()

    const defaultName = AOS4_FACTION_INDEX.factions.find(
      faction => faction.id === defaults.defaultFactionId
    )?.name
    expect(defaultName).toBeDefined()
    expect(selectedFactionName()).toBe(defaultName)
  })

  /*
   * KTD6. The shell read the stored document without a catalog, so it cannot tell a live selection
   * from one a battletome rewrite retired. Writing it back would put the unpruned copy over the
   * stored one — pruned a moment later by the child, but only after the stored version was gone.
   */
  it('does not write the army document back before the catalog-validated load lands', async () => {
    const stored = storedArmy(FLESH_EATER_COURTS.id, 'Grand Court Nightblades')
    storage.setItem(AOS4_ARMY_STORAGE_KEY, stored)

    await renderHome()
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(stored)

    // Not even a change the player makes during the wait: the child's load is what unlocks the save.
    await pickFaction('Fyreslayers')

    expect(selectedFactionName()).toBe('Fyreslayers')
    expect(storage.getItem(AOS4_ARMY_STORAGE_KEY)).toBe(stored)
  })

  // KTD8. The row is rendered conditionally, so a shell that never reserved it would have the label
  // and select inserted when the catalog landed, pushing the whole page down.
  it('reserves the Army of Renown row for a faction that has one', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(FLESH_EATER_COURTS.id, 'Flesh-eater Courts'))
    expect(FLESH_EATER_COURTS.armiesOfRenownContextIndexes).toContain(DEFAULT_CONTEXT_INDEX)

    await renderHome()

    expect(container.textContent).toContain('Army of Renown:')
    const placeholder = container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')
    expect(placeholder).not.toBeNull()
    expect(placeholder!.disabled).toBe(true)
  })

  it('reserves nothing for a faction that has no Armies of Renown', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(SERAPHON.id, 'Seraphon'))
    expect(SERAPHON.armiesOfRenownContextIndexes).toEqual([])

    await renderHome()

    expect(container.textContent).not.toContain('Army of Renown:')
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
  })

  /*
   * The same faction, the same stored selection, a different rules context — and the opposite
   * answer. Reserving is a bet about what the catalog will say, and a bet made from the default
   * context is wrong for most of Spearhead and Legends: the row goes up, then comes back out when
   * the child mounts, which shifts the page the way reserving is supposed to stop.
   */
  it('reserves nothing for a faction whose Armies of Renown do not exist in the stored context', async () => {
    const rulesContextId = contextWithoutArmiesOfRenown(FLESH_EATER_COURTS)
    // Non-default by construction: this faction does have them under the default context, which is
    // exactly why a context-blind flag reserved a row here.
    expect(rulesContextId).not.toBe(defaults.rulesContextId)
    storage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      storedArmy(FLESH_EATER_COURTS.id, 'Flesh-eater Courts', rulesContextId)
    )

    await renderHome()

    expect(selectedFactionName()).toBe('Flesh-eater Courts')
    expect(container.textContent).not.toContain('Army of Renown:')
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
  })

  /*
   * The pending state is a full-screen splash — the route-level fallback's old job, restored: the
   * product name and "Loading..." on the theme background, edge to edge, with nothing half-painted
   * around it. It is an overlay the shell holds until the bound child commits rather than the
   * Suspense fallback, because the fallback lifts when the chunk arrives and the bindings — the
   * masthead's real Army of Renown row among them — land one commit later.
   */
  it('covers the whole screen with the splash until the army is ready', async () => {
    await renderHome()

    const splash = container.querySelector('.LoadingSplash')
    expect(splash).not.toBeNull()
    expect(splash!.getAttribute('aria-hidden')).toBe('true')
    expect(splash!.textContent).toContain('AoS Reminders')
    expect(splash!.textContent).toContain('Loading...')

    // The chrome is already painted underneath; the overlay is what stands between it and the
    // player, so the reveal is one commit instead of a band swapping for content.
    expect(container.querySelector('nav')).not.toBeNull()
  })

  /*
   * The skip link's target is `#aos4-reminders`, which the catalog-bound half owns. Offering the
   * link before that exists would put a control at the very top of the tab order that moves focus
   * nowhere — worse than not offering it, because it is the first thing a keyboard user meets.
   */
  it('withholds the skip link while its target does not exist', async () => {
    await renderHome()

    expect(container.querySelector('a.SkipLink')).toBeNull()
    expect(container.querySelector('#aos4-reminders')).toBeNull()
  })
})
