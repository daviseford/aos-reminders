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
 * The rules-season select (issues #1994 and #2042), driven through the real screen: the masthead
 * control the shell renders, moving a document the catalog-bound half owns, with the reminders
 * below both. A stored army seeds the render, a season is picked, and what must move together (the
 * document's context in storage, the select's own value, and the season's reminders) is read back
 * from the same DOM and storage a player's browser would hold. A remount from that storage stands
 * in for a reload.
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

const pastSeason = AOS4_CATALOG.rulesContexts.find(context => context.status === 'past-season')
if (!pastSeason) throw new Error('The catalog is missing the past-season context')

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

const SITTING_LABEL = `${seasonal.season ?? seasonal.name} (current)`
const PAST_LABEL = pastSeason.season ?? pastSeason.name
const NONE_LABEL = 'None'

const storedArmy = (rulesContextId: RulesContextId) =>
  serializeAos4ArmyDocument(
    createAos4ArmyDocument({
      id: 'army:rules-season-ui-test',
      name: 'Grand Court Nightblades',
      rulesContextId,
      explicitSelectionIds: [factionId],
    })
  )

describe('the rules-season select on the Home screen', () => {
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

  const reload = async () => {
    act(() => {
      unmountComponentAtNode(container)
    })
    await renderHome()
  }

  const seasonInput = () =>
    container.querySelector<HTMLInputElement>('input[aria-label="General\'s Handbook"]')

  // The select's shown value: the masthead's singleValue that shares a control with the input.
  const selectedSeason = () =>
    Array.from(container.querySelectorAll('[class*="singleValue"]')).find(value =>
      value.parentElement?.contains(seasonInput())
    )?.textContent ?? null

  // Open the select from the keyboard, as a player tabbing to it would, and read what it offers.
  const openSeasons = async () => {
    await act(async () => {
      seasonInput()!.focus()
      seasonInput()!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      await flush()
    })
    return Array.from(container.querySelectorAll<HTMLElement>('[role="option"]'))
  }

  const pickSeason = async (label: string) => {
    const option = (await openSeasons()).find(candidate => candidate.textContent?.trim() === label)
    expect(option, `option "${label}"`).toBeDefined()
    await act(async () => {
      option!.click()
      await flush()
    })
  }

  const storedDocument = () =>
    deserializeAos4ArmyDocumentStructure(storage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '').document

  const notice = () => container.querySelector('[data-testid="past-season-notice"]')

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

  it('offers exactly the catalog’s standard seasons, the sitting season first', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(seasonal.id))

    await renderHome()

    expect(seasonal.season).toBe('2026-27')
    expect(pastSeason.season).toBe('2025-26')
    const offered = (await openSeasons()).map(option => option.textContent?.trim())
    expect(offered).toEqual([SITTING_LABEL, PAST_LABEL, NONE_LABEL])
    // The old two-control pairing is gone.
    expect(container.querySelector('#seasonal-rules-switch')).toBeNull()
    expect(container.textContent).not.toContain('Use a past season')
  })

  /*
   * jsdom never lays text out, so it cannot see a wrap; this instead pins the real constraint a
   * wrap needs to fit under. Measured live in Chrome at 320px (iPhone SE, the narrowest width this
   * masthead supports): the select's single-line text area there holds roughly 200px, and this
   * font averages ~10px per character, so anything past ~20 characters wraps onto a second line
   * and loses its "(past)"/"(current)" qualifier (#2042, #2064's original bug). The two short
   * labels this PR introduced fit with room to spare; the verbose `General’s Handbook YYYY-YY
   * (current season)` wording this replaced (41 characters) would fail this check immediately.
   */
  it('keeps every season option short enough to stay on one line at the narrowest supported width', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(seasonal.id))

    await renderHome()

    const offered = (await openSeasons()).map(option => option.textContent?.trim() ?? '')
    for (const label of offered) {
      expect(label.length, `"${label}" is too long and will wrap at 320px`).toBeLessThanOrEqual(20)
    }
  })

  /*
   * One move per test, each with a single reload: a full Home render is heavy, and four of them in
   * one test overrun the per-test timeout when the whole suite runs.
   */
  it('moves the army from the sitting season to battletome only, and keeps it across a reload', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(seasonal.id))

    await renderHome()

    // The sitting season: the select says so and the season's reminders are on the page.
    expect(selectedSeason()).toBe(SITTING_LABEL)
    expect(container.textContent).toContain(SEASONAL_REMINDER)
    expect(notice()).toBeNull()

    await pickSeason(NONE_LABEL)

    // Battletome only: the context moved, the seasonal reminders left, the faction pick survived.
    expect(storedDocument()?.rulesContextId).toBe(current.id)
    expect(storedDocument()?.explicitSelectionIds).toEqual([factionId])
    expect(selectedSeason()).toBe(NONE_LABEL)
    expect(container.textContent).not.toContain(SEASONAL_REMINDER)
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()

    await reload()
    expect(selectedSeason()).toBe(NONE_LABEL)
  })

  it('moves the army from battletome only into the past season, and keeps it across a reload', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(current.id))

    await renderHome()
    await pickSeason(PAST_LABEL)

    // The past season: the caveat is up, the pick survived, and the sitting season's reminders
    // stayed away.
    expect(storedDocument()?.rulesContextId).toBe(pastSeason.id)
    expect(storedDocument()?.explicitSelectionIds).toEqual([factionId])
    expect(selectedSeason()).toBe(PAST_LABEL)
    expect(notice()?.textContent).toContain('current warscrolls, points, unit sizes, and battletome rules')
    expect(container.textContent).not.toContain(SEASONAL_REMINDER)
    expect(container.querySelector('#aos4-reminders')).not.toBeNull()

    await reload()
    expect(selectedSeason()).toBe(PAST_LABEL)
    expect(notice()).not.toBeNull()
  })

  it('moves the army from the past season back to the sitting season, and keeps it across a reload', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(pastSeason.id))

    await renderHome()
    await pickSeason(SITTING_LABEL)

    expect(storedDocument()?.rulesContextId).toBe(seasonal.id)
    expect(storedDocument()?.explicitSelectionIds).toEqual([factionId])
    expect(selectedSeason()).toBe(SITTING_LABEL)
    expect(notice()).toBeNull()
    expect(container.textContent).toContain(SEASONAL_REMINDER)

    await reload()
    expect(selectedSeason()).toBe(SITTING_LABEL)
  })

  it.each([
    ['battletome-only', () => current.id, NONE_LABEL],
    ['past-season', () => pastSeason.id, PAST_LABEL],
  ])('reflects a stored army already in the %s context', async (_name, contextId, label) => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(contextId()))

    await renderHome()

    expect(selectedSeason()).toBe(label)
    expect(container.textContent).not.toContain(SEASONAL_REMINDER)
  })

  /*
   * A document outside the standard seasons, a Spearhead import here, is nothing the select can
   * speak for, so the masthead hides it rather than showing a value that would lie.
   */
  it('hides the select for a document it does not speak for', async () => {
    storage.setItem(AOS4_ARMY_STORAGE_KEY, storedArmy(spearheadContext.id))

    await renderHome()

    expect(container.querySelector('input[aria-label="Faction"]')).not.toBeNull()
    expect(seasonInput()).toBeNull()
    expect(container.textContent).not.toContain("General's Handbook")
  })
})
