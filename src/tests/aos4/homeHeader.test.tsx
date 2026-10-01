// @vitest-environment jsdom

import { Header, type Aos4RulesSeasonBinding } from 'components/page/homeHeader'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryStorage } from 'tests/support/memoryStorage'
import type { CanonicalId, RulesContextId } from '../../aos4/domain'

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
                  onRulesSeasonChange={vi.fn()}
                  rulesSeason={null}
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

  /*
   * The rules-season select (issues #1994 and #2042) renders only when the catalog-bound half has
   * told the masthead which standard season the document sits in. `null` covers both silences (the
   * catalog still pending, and a document outside the standard seasons such as Spearhead or a
   * Legends-moved import), and both hide the row rather than showing a value that would lie.
   */
  const SITTING = 'rules-context:test-seasonal' as RulesContextId
  const PAST = 'rules-context:test-past-season' as RulesContextId
  const CURRENT = 'rules-context:test-current' as RulesContextId
  const rulesSeason = (
    value: RulesContextId,
    pastSeason: Aos4RulesSeasonBinding['pastSeason'] = null
  ): Aos4RulesSeasonBinding => ({
    options: [
      { label: '2026-27 (current)', value: SITTING },
      { label: '2025-26', value: PAST },
      { label: 'None', value: CURRENT },
    ],
    value,
    pastSeason,
  })

  const seasonInput = () =>
    container.querySelector<HTMLInputElement>('input[aria-label="General\'s Handbook"]')

  const pressKey = async (key: string) => {
    await act(async () => {
      seasonInput()!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    })
  }

  it('renders no rules-season select when no state is published', async () => {
    await renderHeader({})

    expect(seasonInput()).toBeNull()
    expect(container.textContent).not.toContain("General's Handbook")
  })

  it('replaces the old switch and past-season link with one labeled select', async () => {
    await renderHeader({ rulesSeason: rulesSeason(SITTING) })

    expect(seasonInput()).not.toBeNull()
    expect(container.textContent).toContain("General's Handbook")
    expect(container.textContent).toContain('2026-27 (current)')
    expect(container.querySelector('#seasonal-rules-switch')).toBeNull()
    expect(container.textContent).not.toContain('Use a past season')
  })

  it.each([
    [SITTING, '2026-27 (current)'],
    [PAST, '2025-26'],
    [CURRENT, 'None'],
  ])('shows the document’s own season (%s)', async (value, label) => {
    await renderHeader({ rulesSeason: rulesSeason(value) })

    // The season row is the masthead's last select, below the faction.
    const values = Array.from(container.querySelectorAll('[class*="singleValue"]'))
    expect(values.at(-1)?.textContent).toBe(label)
  })

  /*
   * Keyboard path: the select is focusable through its input, arrow keys open and move through the
   * options a screen reader announces, and Enter reports the pick by context id.
   */
  it('lists every season and reports a keyboard pick by context id', async () => {
    const onRulesSeasonChange = vi.fn()
    await renderHeader({ rulesSeason: rulesSeason(SITTING), onRulesSeasonChange })

    await pressKey('ArrowDown')
    const offered = Array.from(container.querySelectorAll('[role="option"]')).map(option =>
      option.textContent?.trim()
    )
    expect(offered).toEqual(['2026-27 (current)', '2025-26', 'None'])

    await pressKey('ArrowDown')
    await pressKey('Enter')
    expect(onRulesSeasonChange).toHaveBeenCalledTimes(1)
    expect(onRulesSeasonChange).toHaveBeenCalledWith(PAST)
  })

  it('carries a past season’s caveat in edit and play mode', async () => {
    const pastSeason = { label: 'General’s Handbook 2025-26', caveat: 'A past season. Test caveat.' }

    await renderHeader({ rulesSeason: rulesSeason(PAST, pastSeason) })
    expect(container.querySelector('[data-testid="past-season-notice"]')?.textContent).toContain(
      'Test caveat.'
    )

    act(() => {
      unmountComponentAtNode(container)
    })
    await renderHeader({ rulesSeason: rulesSeason(PAST, pastSeason), isGameMode: true })
    const notice = container.querySelector('[data-testid="past-season-notice"]')
    expect(notice?.textContent).toContain('General’s Handbook 2025-26 (past season)')
    expect(notice?.textContent).toContain('Test caveat.')
  })

  it('hides the rules-season select in play mode, with the other army-configuration controls', async () => {
    await renderHeader({ rulesSeason: rulesSeason(SITTING), isGameMode: true })

    expect(seasonInput()).toBeNull()
  })

  /*
   * The options name the handbooks, not what a season adds, so the row carries an info control whose
   * tooltip explains the choice. It lives and dies with the select, and focusing it shows the
   * explanation.
   */
  it('offers a focusable explanation of the seasonal rules choice', async () => {
    await renderHeader({ rulesSeason: rulesSeason(SITTING) })

    const info = container.querySelector<HTMLButtonElement>(
      'button[aria-label="What does the General\'s Handbook season affect?"]'
    )
    expect(info).not.toBeNull()

    await act(async () => {
      info!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const tooltip = document.body.querySelector('.tooltip')
    expect(tooltip).not.toBeNull()
    expect(tooltip!.textContent).toContain("Choose which season's rules")
    expect(tooltip!.textContent).toContain('battletome and core rules only')
  })

  it('hides the seasonal rules explanation when the select is hidden', async () => {
    await renderHeader({})

    expect(
      container.querySelector('button[aria-label="What does the General\'s Handbook season affect?"]')
    ).toBeNull()
  })
})
