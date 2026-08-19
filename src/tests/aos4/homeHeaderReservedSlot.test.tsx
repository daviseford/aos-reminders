// @vitest-environment jsdom

import { Header } from 'components/page/homeHeader'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act } from 'react'
import { MemoryRouter } from 'react-router'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

  it('keeps the reserved placeholder disabled, busy, and named like the control it replaces', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true })

    const row = armyOfRenownRow()
    expect(row).not.toBeNull()
    expect(row!.getAttribute('aria-busy')).toBe('true')

    const input = container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')
    expect(input).not.toBeNull()
    expect(input!.disabled).toBe(true)
    expect(row!.querySelector('[class*="placeholder"]')?.textContent).toBe('Loading...')
  })

  it('drops the reservation the moment a real list arrives', async () => {
    await renderHeader({ armiesOfRenown: ARMIES_OF_RENOWN, reserveArmyOfRenownSlot: true })

    const row = armyOfRenownRow()!
    expect(row.getAttribute('aria-busy')).toBeNull()
    expect(container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')!.disabled).toBe(
      false
    )
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
   */
  it('does not invert in dark theme', async () => {
    await renderHeader({ reserveArmyOfRenownSlot: true }, { dark: true })

    const reserved = controlIn(armyOfRenownRow()!)
    const factionControl = container
      .querySelector<HTMLInputElement>('input[aria-label="Faction"]')!
      .closest('.col-12')!
      .querySelector<HTMLElement>('[class*="-control"]')!

    const background = getComputedStyle(reserved).backgroundColor
    expect(background).toBe(getComputedStyle(factionControl).backgroundColor)
    expect(background).not.toBe('')
  })
})
