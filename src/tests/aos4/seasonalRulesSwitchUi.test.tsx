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
import type { RulesContextId } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  findAos4SeasonalRulesContexts,
  serializeAos4ArmyDocument,
} from '../../aos4/state'

/*
 * The seasonal rules switch (issue #1994), driven through the real screen: the masthead control the
 * shell renders, flipping a document the catalog-bound half owns, with the reminders below both. A
 * stored army seeds the render, the switch is clicked, and what must move together — the document's
 * context in storage, the switch's own checked state, and the season's reminders — is read back
 * from the same DOM and storage a player's browser would hold.
 */

// The standard preamble for a suite that renders Home: Auth0 and the subscription API are network
// surfaces, and `virtual:pwa-register` has no file on disk for the resolver to find. See
// tests/support/homeTestMocks.ts for why these are `await import()`ed inside the factory rather than
// imported and passed to `vi.mock` directly.
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

// Resolving the catalog-bound half parses the whole corpus. Warm it in module evaluation, where no
// per-test timeout applies, so a slow first parse cannot read as a failure.
beforeAll(async () => {
  await import('components/routes/HomeCatalogBound')
})

const { seasonal, current } = findAos4SeasonalRulesContexts(AOS4_CATALOG)
if (!seasonal || !current) throw new Error('The catalog is missing a standard-mode context')

const spearheadContext = AOS4_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')
if (!spearheadContext) throw new Error('The catalog is missing the Spearhead context')

const factionId = (() => {
  const faction = AOS4_CATALOG.entities.find(
    entity => entity.kind === 'faction' && entity.name === 'Flesh-eater Courts'
  )
  if (!faction) throw new Error('No faction named Flesh-eater Courts in the catalog')
  return faction.id
})()

// A season rule every army carries while the season is on; reminderAttribution.test.ts pins its
// Seasonal provenance. Its presence in the rendered reminders is the season's own fingerprint.
const SEASONAL_REMINDER = 'RAISING THE HEAT'

const storedArmy = (rulesContextId: RulesContextId) =>
  serializeAos4ArmyDocument(
    createAos4ArmyDocument({
      id: 'army:seasonal-switch-ui-test',
      name: 'Grand Court Nightblades',
      rulesContextId,
      explicitSelectionIds: [factionId],
    })
  )

describe('the seasonal rules switch on the Home screen', () => {
  let container: HTMLDivElement
  let storage: MemoryStorage

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
    // A second flush: the first resolves the lazy child, this one settles its mount effects.
    await act(async () => {
      await flush()
    })
  }

  const seasonalSwitch = () => container.querySelector<HTMLInputElement>('#seasonal-rules-switch')

  const clickSeasonalSwitch = async () => {
    await act(async () => {
      seasonalSwitch()!.click()
      await flush()
    })
  }

  const storedDocument = () =>
    deserializeAos4ArmyDocumentStructure(storage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '').document

  beforeEach(() => {
    storage = new MemoryStorage()
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('flips the army between seasonal and current rules, non-destructively, both ways', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(seasonal.id))

    await renderHome()

    // The season is on: the switch says so and the season's reminders are on the page.
    expect(seasonalSwitch()).not.toBeNull()
    expect(seasonalSwitch()!.checked).toBe(true)
    expect(container.textContent).toContain(SEASONAL_REMINDER)

    await clickSeasonalSwitch()

    // Off: the document moved to the current standard context, the seasonal reminders left, and
    // the faction pick survived untouched.
    expect(seasonalSwitch()!.checked).toBe(false)
    expect(container.textContent).not.toContain(SEASONAL_REMINDER)
    expect(storedDocument()?.rulesContextId).toBe(current.id)
    expect(storedDocument()?.explicitSelectionIds).toEqual([factionId])
    // The army is still an army: the reminders region did not go with the season.
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()

    await clickSeasonalSwitch()

    // And back on: the same document, the same season.
    expect(seasonalSwitch()!.checked).toBe(true)
    expect(container.textContent).toContain(SEASONAL_REMINDER)
    expect(storedDocument()?.rulesContextId).toBe(seasonal.id)
    expect(storedDocument()?.explicitSelectionIds).toEqual([factionId])
  })

  it('reflects a stored army whose season is already off', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(current.id))

    await renderHome()

    expect(seasonalSwitch()).not.toBeNull()
    expect(seasonalSwitch()!.checked).toBe(false)
    expect(container.textContent).not.toContain(SEASONAL_REMINDER)
  })

  /*
   * A document outside the two standard contexts — a Spearhead import here — is nothing the switch
   * can speak for, so the masthead hides it rather than showing a knob position that would lie.
   */
  it('hides the switch for a document the toggle does not speak for', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(spearheadContext.id))

    await renderHome()

    expect(container.querySelector('input[aria-label="Faction"]')).not.toBeNull()
    expect(seasonalSwitch()).toBeNull()
    expect(container.textContent).not.toContain('Seasonal rules')
  })
})
