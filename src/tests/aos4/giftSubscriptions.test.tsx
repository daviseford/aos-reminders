// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/profile"}

import { GiftSubscriptions } from 'components/payment/giftSubscriptions'
import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { GiftedSubscriptionPlans } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const stripe = vi.hoisted(() => ({
  redirectToCheckout: vi.fn(),
}))

const analytics = vi.hoisted(() => ({
  logBeginCheckout: vi.fn(),
  logClick: vi.fn(),
}))

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

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { email: 'gifter@example.com' },
  }),
}))

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: React.PropsWithChildren<object>) => children,
  useStripe: () => stripe,
}))

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(null)),
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
    stripe.redirectToCheckout.mockResolvedValue({})
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('reports the selected quantity and keeps it in Stripe return URLs', async () => {
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
    /*
     * Built from window.location.origin, matching the subscription checkout. The pair of hardcoded
     * hosts this replaced pinned development to `localhost:3000` — the retired CRA port — so every
     * gift checkout in dev returned to an address nothing was serving.
     */
    const baseUrl = window.location.origin
    expect(stripe.redirectToCheckout).toHaveBeenCalledWith({
      cancelUrl: `${baseUrl}?canceled=true&checkout_kind=gift_subscription&plan=1%20Month&quantity=3`,
      clientReferenceId: 'gifter@example.com',
      customerEmail: 'gifter@example.com',
      lineItems: [{ price: GiftedSubscriptionPlans[0].stripe_prod, quantity: 3 }],
      mode: 'payment',
      successUrl: `${baseUrl}/profile?gifted=true&checkout_kind=gift_subscription&quantity=3&plan=1%20Month&checkout_session_id={CHECKOUT_SESSION_ID}`,
    })
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
