// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/subscribe"}

import { PlanComponent } from 'components/payment/pricingPlans'
import type { IApprovalResponse } from 'components/payment/paypal/paypalTypes'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { bestValuePlan, monthlySavingPct, SUBSCRIPTION_PLANS } from 'utils/plans'
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

  /*
   * The annual plan really is half the monthly rate, and the page never said so. The figure is
   * derived from plans.ts rather than written into the markup, so it cannot drift from the prices
   * printed beside it.
   */
  it('states the saving against the monthly rate and marks the best-value plan', async () => {
    const yearly = SUBSCRIPTION_PLANS.find(plan => plan.title === '1 Year')!
    expect(monthlySavingPct(yearly)).toBe(50)
    expect(bestValuePlan()?.title).toBe('1 Year')
    // The baseline plan discounts nothing, so it must not claim a saving.
    expect(monthlySavingPct(SUBSCRIPTION_PLANS[0])).toBe(0)

    await act(async () => {
      render(
        <PlanComponent
          supportPlan={yearly}
          isBestValue
          paypalModalIsOpen={false}
          setPaypalModalIsOpen={vi.fn()}
        />,
        container
      )
    })

    expect(container.textContent).toContain('Save 50%')
    // Never colour alone: the marker is a word, so it survives print and colour blindness.
    expect(container.textContent).toContain('Best value')
  })

  /*
   * A rejected redirect used to reach console.error and nothing else, so the visitor pressed the one
   * button that takes money and watched the page do nothing at all.
   */
  it('surfaces a failed checkout redirect instead of only logging it', async () => {
    stripe.redirectToCheckout.mockResolvedValue({ error: { message: 'nope' } })
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

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

    await act(async () => {
      container.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    const alert = container.querySelector('[role="alert"]')
    expect(alert).not.toBeNull()
    expect(alert!.textContent).toContain('We could not open the checkout page')
    // The control comes back rather than stranding the visitor on a dead button.
    expect(container.querySelector('button')?.disabled).toBe(false)
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
