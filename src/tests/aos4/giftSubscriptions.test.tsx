// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/profile"}

import { GiftSubscriptions } from 'components/payment/giftSubscriptions'
import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { GiftedSubscriptionPlans } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubscriptionApi } from '../../api/subscriptionApi'

const analytics = vi.hoisted(() => ({
  logBeginCheckout: vi.fn(),
  logClick: vi.fn(),
}))

const token = vi.hoisted(() => ({ get: vi.fn() }))

const themeContext = vi.hoisted(() => ({
  isDark: false,
  theme: {
    bgColor: 'bg-white',
    genericButtonBlock: '',
    purchaseTable: 'GiftPurchaseTable-Light',
    text: 'text-dark',
  },
}))

vi.mock('utils/analytics', () => analytics)

vi.mock('utils/authToken', () => ({
  useApiAccessToken: () => token.get,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { email: 'gifter@example.com' },
  }),
}))

vi.mock('context/useSubscription', () => ({
  useSubscription: () => ({
    isActive: true,
    subscription: { giftSubscriptions: [] },
  }),
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => themeContext,
}))

vi.mock('utils/hooks/useLogin', () => ({
  default: () => ({ login: vi.fn() }),
}))

vi.mock('utils/hooks/useWindowSize', () => ({
  default: () => ({ isMobile: false }),
}))

describe('gift subscription checkout', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.clearAllMocks()
    themeContext.isDark = false
    themeContext.theme = LightTheme
    token.get.mockResolvedValue('audience-token')
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  /*
   * #1942: the click states an intent — plan and quantity — and the API answers with the session
   * URL to navigate to; the server owns the price and the return URLs. Since #1948 this is the
   * only card checkout path.
   */
  it('reports the selected quantity and sends it to the checkout session endpoint', async () => {
    const session = vi
      .spyOn(SubscriptionApi, 'createCheckoutSession')
      .mockResolvedValue({ body: { url: 'https://checkout.stripe.com/c/pay/cs_test_gift' } })
    const assign = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign },
    })

    try {
      await act(async () => {
        render(<GiftSubscriptions />, container)
      })

      const quantity = container.querySelector<HTMLInputElement>(
        'input[aria-label="Quantity of 1 Month gifts"]'
      )
      const purchase = container.querySelector<HTMLButtonElement>('tbody button')
      expect(quantity).not.toBeNull()
      expect(purchase).not.toBeNull()

      await act(async () => {
        quantity!.value = '3'
        Simulate.change(quantity!)
      })
      await act(async () => {
        purchase!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await Promise.resolve()
        await Promise.resolve()
      })

      expect(analytics.logBeginCheckout).toHaveBeenCalledWith({
        items: [
          {
            item_category: 'gift_subscription',
            item_id: 'gift-subscription-1-month',
            item_name: '1 Month',
            price: 0.99,
            quantity: 3,
          },
        ],
        provider: 'stripe',
      })
      expect(session).toHaveBeenCalledWith({ kind: 'gift', plan: '1 Month', quantity: 3 }, 'audience-token')
      expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_gift')
      // The page is unloading; a re-enabled button would read as failure.
      expect(container.querySelector<HTMLButtonElement>('tbody button')?.disabled).toBe(true)
    } finally {
      Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
    }
  })

  /*
   * With the legacy fallback gone (#1948), a failed session request has nowhere else to land: the
   * failure must be said out loud and the button must come back rather than spinning forever.
   */
  it('surfaces a failed checkout session instead of only logging it', async () => {
    vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockRejectedValue(
      Object.assign(new Error('Service unavailable'), { status: 503 })
    )
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await act(async () => {
      render(<GiftSubscriptions />, container)
    })

    const purchase = container.querySelector<HTMLButtonElement>('tbody button')
    expect(purchase).not.toBeNull()

    await act(async () => {
      purchase!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeNull()
    expect(alert!.textContent).toContain('We could not open the checkout page')
    // The control comes back rather than stranding the buyer on a dead button.
    expect(container.querySelector<HTMLButtonElement>('tbody button')?.disabled).toBe(false)
  })

  it('uses dark-theme surfaces for the purchase table and quantity fields', async () => {
    themeContext.isDark = true
    themeContext.theme = DarkTheme

    await act(async () => {
      render(<GiftSubscriptions />, container)
    })

    const table = container.querySelector('table')
    const quantities = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="number"]'))

    expect(table?.classList.contains('GiftPurchaseTable-Dark')).toBe(true)
    expect(quantities).toHaveLength(GiftedSubscriptionPlans.length)
    quantities.forEach(quantity => {
      expect(quantity.classList.contains('bg-themeDarkBlueSecondary')).toBe(true)
      expect(quantity.classList.contains('text-white')).toBe(true)
    })
  })
})
