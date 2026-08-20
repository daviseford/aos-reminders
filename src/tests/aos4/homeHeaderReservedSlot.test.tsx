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
 * KTD8's reserved Army of Renown slot, measured against the live control it stands in for.
 *
 * The row renders conditionally on a non-empty list, so a shell that could not reserve it would
 * have the label and select *inserted* when the catalog landed — pushing the builder and every
 * reminder below it down the page at the exact moment a player has started reading. What this file
 * holds is that the placeholder occupies the same box as the real thing, and that it is a disabled
 * control rather than a decoration.
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

describe('the masthead Army of Renown slot', () => {
  let container: HTMLDivElement

  const renderHeader = async (
    props: Partial<Parameters<typeof Header>[0]>,
    { dark = false }: { dark?: boolean } = {}
  ) => {
    // `ThemeProvider` reads this key in a state initializer and again in a mount effect, so it is
    // the whole of what puts a tree in dark theme without a subscriber account.
    window.localStorage.setItem('theme', dark ? 'dark' : 'light')
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

  const controlIn = (row: HTMLElement) => row.querySelector<HTMLElement>('[class*="-control"]')!

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

  it('renders nothing when the faction has no Armies of Renown and none is reserved', async () => {
    await renderHeader({})

    expect(armyOfRenownRow()).toBeNull()
    expect(container.querySelector('input[aria-label="Army of Renown"]')).toBeNull()
  })

  it('keeps the reserved placeholder disabled and named like the control it replaces', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true })

    const row = armyOfRenownRow()
    expect(row).not.toBeNull()

    const input = container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')
    expect(input).not.toBeNull()
    expect(input!.disabled).toBe(true)
    expect(row!.querySelector('[class*="placeholder"]')?.textContent).toBe('Loading...')
  })

  /*
   * `aria-busy` used to sit on this row's wrapper. react-select never forwarded it to the control,
   * so it decorated a plain <div> that assistive technology has no reason to inspect — the pending
   * state is reported by the live region Home owns instead. It is asserted absent so it cannot
   * quietly come back as a substitute for that region.
   */
  it('does not decorate the row with an inert aria-busy', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true })

    expect(armyOfRenownRow()!.getAttribute('aria-busy')).toBeNull()
    expect(container.querySelector('[aria-busy]')).toBeNull()
  })

  it('drops the reservation the moment a real list arrives', async () => {
    await renderHeader({ armiesOfRenown: ARMIES_OF_RENOWN, reserveArmyOfRenownSlot: true })

    expect(container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')!.disabled).toBe(
      false
    )
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
    await renderHeader({ reserveArmyOfRenownSlot: true })

    expect(container.querySelector<HTMLInputElement>('input[aria-label="Faction"]')!.disabled).toBe(false)
  })

  /*
   * The layout-shift proof. Everything that decides where the row sits and how tall it is — the
   * flex wrapper's padding utilities, the responsive column, and react-select's own control height
   * — has to be byte-identical between the placeholder and the live control. Only the contents of
   * the control box may differ.
   */
  it('occupies the same box as the live control', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true })
    const reserved = armyOfRenownRow()!
    const reservedShape = {
      row: reserved.className,
      column: reserved.firstElementChild!.className,
      minHeight: getComputedStyle(controlIn(reserved)).minHeight,
    }

    act(() => {
      unmountComponentAtNode(container)
    })
    await renderHeader({ armiesOfRenown: ARMIES_OF_RENOWN, armyOfRenownId: ARMY_OF_RENOWN_ID })
    const live = armyOfRenownRow()!

    expect(reservedShape).toEqual({
      row: live.className,
      column: live.firstElementChild!.className,
      minHeight: getComputedStyle(controlIn(live)).minHeight,
    })
    // The measurement is only worth anything if jsdom actually resolved react-select's emotion
    // styles; an unresolved property would compare two empty strings and pass either way.
    expect(reservedShape.minHeight).toBe('38px')
  })

  /*
   * DESIGN.md's Slot Rule. react-select paints a disabled control from `neutral5`, which it
   * defaults to a near-white grey — and the dark theme sets the placeholder colour to white. The
   * reserved slot was the app's first disabled select, so it was also the first place that pair
   * could render white on near-white.
   *
   * `neutral5` (this control's background) and `neutral0` (the live control's background) are both
   * Midnight Slate in dark theme — the Slot Rule names one dark surface, not two — so the two
   * controls' backgrounds are expected to match. What has to differ is the *disabled* affordance:
   * this control carries `styles={{ control: opacity: 0.65 }}` and the live one does not, so
   * asserting equal backgrounds would pass on a reserved slot indistinguishable from a live one.
   * Opacity is what a screen can show a colour-blind or colour-off (printed-page-habituated) player
   * that mirrors an equal background never would.
   */
  it('reads as disabled against the live control, on the shared dark surface', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true }, { dark: true })

    const reserved = controlIn(armyOfRenownRow()!)
    const factionControl = container
      .querySelector<HTMLInputElement>('input[aria-label="Faction"]')!
      .closest('.col-12')!
      .querySelector<HTMLElement>('[class*="-control"]')!

    const reservedStyle = getComputedStyle(reserved)
    const factionStyle = getComputedStyle(factionControl)

    // Same surface: both controls read `neutral5`/`neutral0`, and both resolve to Midnight Slate.
    expect(reservedStyle.backgroundColor).toBe(factionStyle.backgroundColor)
    expect(reservedStyle.backgroundColor).not.toBe('')
    // Different affordance: only the reserved control fades, so it cannot be mistaken for live.
    expect(reservedStyle.opacity).toBe('0.65')
    expect(factionStyle.opacity).not.toBe('0.65')
  })

  /*
   * The layout-shift guarantee has to survive the opacity fix above: `styles.control` composes with
   * (rather than replaces) react-select's own emotion styles, so it must not perturb the box the
   * placeholder-vs-live test already pins.
   */
  it('keeps its box even with the disabled-opacity style applied', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true }, { dark: true })

    const control = controlIn(armyOfRenownRow()!)
    expect(getComputedStyle(control).minHeight).toBe('38px')
  })
})
