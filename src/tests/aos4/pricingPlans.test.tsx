// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/subscribe"}

import { PlanComponent } from 'components/payment/pricingPlans'
import type { IApprovalResponse } from 'components/payment/paypal/paypalTypes'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { SUBSCRIPTION_PLANS } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubscriptionApi } from '../../api/subscriptionApi'

interface PaypalButtonCallbacks {
  onCancel: () => void
  onClick: () => void
  onSuccess: (data: IApprovalResponse) => Promise<void>
}

const stripe = vi.hoisted(() => ({
  redirectToCheckout: vi.fn(),
}))

const paypal = vi.hoisted(() => ({
  callbacks: null as PaypalButtonCallbacks | null,
}))

const analytics = vi.hoisted(() => ({
  logBeginCheckout: vi.fn(),
  logCheckoutCancelled: vi.fn(),
  logClick: vi.fn(),
  logPurchase: vi.fn(),
}))

const token = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('utils/analytics', () => analytics)

vi.mock('utils/authToken', () => ({
  useApiAccessToken: () => token.get,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { email: 'general@example.com' },
  }),
}))

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: React.PropsWithChildren<object>) => children,
  useStripe: () => stripe,
}))

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(null)),
}))

vi.mock('components/payment/paypal/paypalButton', () => ({
  default: (callbacks: PaypalButtonCallbacks) => {
    paypal.callbacks = callbacks
    return <div>PayPal</div>
  },
}))

vi.mock('components/modals/paypal_post_subscribe_modal', () => ({
  PaypalPostSubscribeModal: () => null,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: { genericButtonBlock: '' },
  }),
}))

vi.mock('utils/hooks/useLogin', () => ({
  default: () => ({ login: vi.fn() }),
}))

describe('subscription pricing plans', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    stripe.redirectToCheckout.mockReset()
    paypal.callbacks = null
    token.get.mockReset()
    token.get.mockResolvedValue('audience-token')
    vi.clearAllMocks()
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

  it('keeps the established plan card stable while handing checkout to Stripe', async () => {
    stripe.redirectToCheckout.mockResolvedValue({})

    /*
     * Render and click must be separate act() blocks. A concurrent root schedules the render rather
     * than performing it inline, so the button does not exist until act() flushes — under the old
     * synchronous ReactDOM.render both could share one block.
     */
    await act(async () => {
      render(
        <PlanComponent
          supportPlan={SUBSCRIPTION_PLANS[0]}
          paypalModalIsOpen={false}
          setPaypalModalIsOpen={vi.fn()}
        />,
        container
      )
    })

    const checkoutButton = container.querySelector('button')
    expect(checkoutButton).not.toBeNull()

    await act(async () => {
      checkoutButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(stripe.redirectToCheckout).toHaveBeenCalledTimes(1)
    expect(stripe.redirectToCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        cancelUrl: 'https://preview.example.test/?canceled=true&checkout_kind=subscription&plan=1%20Month',
        clientReferenceId: 'general@example.com',
        customerEmail: 'general@example.com',
        items: [{ plan: SUBSCRIPTION_PLANS[0].stripe_prod, quantity: 1 }],
        successUrl:
          'https://preview.example.test/?subscribed=true&checkout_kind=subscription&plan=1%20Month&checkout_session_id={CHECKOUT_SESSION_ID}',
      })
    )
    expect(analytics.logBeginCheckout).toHaveBeenCalledWith({
      items: [
        {
          item_category: 'subscription',
          item_id: 'subscription-1-month',
          item_name: '1 Month',
          price: 1.99,
          quantity: 1,
        },
      ],
      provider: 'stripe',
    })
    expect(container.querySelector('button')?.textContent).toBe('Subscribe for 1 Month')
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })

  it('reports the PayPal checkout lifecycle with the same stable commerce item', async () => {
    vi.spyOn(SubscriptionApi, 'requestGrant').mockImplementation(() => Promise.resolve() as never)

    await act(async () => {
      render(
        <PlanComponent
          supportPlan={SUBSCRIPTION_PLANS[0]}
          paypalModalIsOpen={false}
          setPaypalModalIsOpen={vi.fn()}
        />,
        container
      )
    })

    expect(paypal.callbacks).not.toBeNull()
    paypal.callbacks!.onClick()
    paypal.callbacks!.onCancel()

    await act(async () => {
      await paypal.callbacks!.onSuccess({
        billingToken: null,
        facilitatorAccessToken: 'access-token',
        orderID: 'order-id',
        paymentID: null,
        subscriptionID: 'subscription-id',
      })
    })

    const expectedItem = {
      item_category: 'subscription',
      item_id: 'subscription-1-month',
      item_name: '1 Month',
      price: 1.99,
      quantity: 1,
    }
    expect(analytics.logBeginCheckout).toHaveBeenCalledWith({
      items: [expectedItem],
      provider: 'paypal',
    })
    expect(analytics.logCheckoutCancelled).toHaveBeenCalledWith({
      items: [expectedItem],
      provider: 'paypal',
    })
    expect(analytics.logPurchase).toHaveBeenCalledWith({
      items: [expectedItem],
      provider: 'paypal',
      transactionId: 'subscription-id',
    })
    expect(SubscriptionApi.requestGrant).toHaveBeenCalledWith(
      { subscriptionId: 'subscription-id' },
      'audience-token'
    )
  })
})
