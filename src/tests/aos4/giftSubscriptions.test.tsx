// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/profile"}

import { GiftSubscriptions } from 'components/payment/giftSubscriptions'
import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { GiftedSubscriptionPlans } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const stripe = vi.hoisted(() => ({
  redirectToCheckout: vi.fn(),
}))

const analytics = vi.hoisted(() => ({
  logBeginCheckout: vi.fn(),
  logClick: vi.fn(),
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
  useTheme: () => ({
    isDark: false,
    theme: {
      genericButtonBlock: '',
      text: '',
    },
  }),
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
    expect(stripe.redirectToCheckout).toHaveBeenCalledWith({
      cancelUrl:
        'https://aosreminders.com?canceled=true&checkout_kind=gift_subscription&plan=1%20Month&quantity=3',
      clientReferenceId: 'gifter@example.com',
      customerEmail: 'gifter@example.com',
      lineItems: [{ price: GiftedSubscriptionPlans[0].stripe_prod, quantity: 3 }],
      mode: 'payment',
      successUrl:
        'https://aosreminders.com/profile?gifted=true&checkout_kind=gift_subscription&quantity=3&plan=1%20Month&checkout_session_id={CHECKOUT_SESSION_ID}',
    })
  })
})
