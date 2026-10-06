// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/subscribe"}

import { PlanComponent } from 'components/payment/pricingPlans'
import type { IApprovalResponse } from 'components/payment/paypal/paypalTypes'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { bestValuePlan, monthlySavingPct, SUBSCRIPTION_PLANS } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthenticationRequiredError } from 'utils/authToken'
import { SubscriptionApi, SubscriptionApiError } from '../../api/subscriptionApi'

interface PaypalButtonCallbacks {
  onCancel: () => void
  onClick: () => void
  onError: () => void
  onRenderError: () => void
  onSuccess: (data: IApprovalResponse) => Promise<void>
}

const paypal = vi.hoisted(() => ({
  callbacks: null as PaypalButtonCallbacks | null,
  modal: null as { onConfirmationTimeout?: () => void } | null,
}))

const analytics = vi.hoisted(() => ({
  logBeginCheckout: vi.fn(),
  logCheckoutCancelled: vi.fn(),
  logCheckoutError: vi.fn(),
  logClick: vi.fn(),
  logPurchase: vi.fn(),
}))

const token = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('utils/analytics', () => analytics)

vi.mock('utils/authToken', async importOriginal => ({
  ...(await importOriginal<typeof import('utils/authToken')>()),
  useApiAccessToken: () => token.get,
}))

// Mutable so individual tests can exercise the signed-out card, which renders a different control.
const auth = vi.hoisted(() => ({
  isAuthenticated: true,
  user: { email: 'general@example.com' } as { email: string } | undefined,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('components/payment/paypal/paypalButton', () => ({
  default: (callbacks: PaypalButtonCallbacks) => {
    paypal.callbacks = callbacks
    return <div>PayPal</div>
  },
}))

vi.mock('components/modals/paypal_post_subscribe_modal', () => ({
  PaypalPostSubscribeModal: (props: { onConfirmationTimeout?: () => void }) => {
    paypal.modal = props
    return null
  },
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: { genericButtonBlock: '' },
  }),
}))

const loginHook = vi.hoisted(() => ({ login: vi.fn() }))

vi.mock('utils/hooks/useLogin', () => ({
  default: () => loginHook,
}))

describe('subscription pricing plans', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    paypal.callbacks = null
    paypal.modal = null
    token.get.mockReset()
    token.get.mockResolvedValue('audience-token')
    auth.isAuthenticated = true
    auth.user = { email: 'general@example.com' }
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

  /*
   * #1942: the click asks the API for a server-created Checkout Session and simply navigates to
   * its URL — no Stripe.js involved. Since #1948 this is the only card checkout path.
   */
  it('navigates to the server-created checkout session', async () => {
    const session = vi
      .spyOn(SubscriptionApi, 'createCheckoutSession')
      .mockResolvedValue({ body: { url: 'https://checkout.stripe.com/c/pay/cs_test_123' } })
    const assign = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign },
    })

    try {
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

      expect(session).toHaveBeenCalledWith({ kind: 'subscription', plan: '1 Month' }, 'audience-token')
      expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_123')
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
      // The page is unloading; a re-enabled button would read as failure.
      expect(container.querySelector('button')?.disabled).toBe(true)
    } finally {
      Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
    }
  })

  it('keeps the established plan card stable', async () => {
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

    /*
     * The visible label is the wordmark alone, because the two payment rails sit side by side and
     * half a card cannot hold "Subscribe for 3 Months" as well. That makes the accessible name the
     * only thing carrying the plan: three cards of identically-marked buttons would otherwise be
     * indistinguishable to a screen reader, since the plan name lives in a separate heading.
     */
    expect(container.querySelector('button')?.textContent).toBe('')
    expect(container.querySelector('button')?.getAttribute('aria-label')).toBe(
      'Subscribe for 1 Month with Stripe'
    )
    expect(container.querySelector('.StripeMark svg')).not.toBeNull()
    expect(container.querySelector('.StripeMark svg')?.getAttribute('aria-hidden')).toBe('true')
    // Both rails' visible labels are logos, so this line is the card's only visible verb.
    expect(container.textContent).toContain('Subscribe with:')
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })

  /*
   * Signed out, PayPal cannot render (it needs the account e-mail), so the brand pair used to
   * collapse to one lopsided wordmark button whose accessible name promised Stripe while its click
   * opened the login popup. The signed-out card instead shows a single plainly-labelled button that
   * carries the intent to login.
   */
  it('shows a truthfully-labelled login button when signed out, with no payment branding', async () => {
    auth.isAuthenticated = false
    auth.user = undefined

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

    const buttons = container.querySelectorAll('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].textContent).toBe('Subscribe for 1 Month')
    // No brand promise it cannot keep: the click opens login, not a Stripe checkout.
    expect(buttons[0].getAttribute('aria-label')).toBeNull()
    expect(container.querySelector('.StripeMark')).toBeNull()
    expect(container.textContent).not.toContain('PayPal')
    expect(container.textContent).not.toContain('Subscribe with:')

    await act(async () => {
      buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(loginHook.login).toHaveBeenCalledTimes(1)
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
    /*
     * The card leads with a per-month figure, but this plan bills $11.88 once a year — and per-month
     * framing with the real charge nowhere on the page is the pattern the FTC's dark-patterns work
     * names as drip pricing. The fine print states the actual charge before any checkout opens.
     */
    expect(container.textContent).toContain('$11.88, billed once a year')
    expect(container.textContent).not.toContain('Total:')
  })

  /*
   * With the legacy fallback gone (#1948), a failed session request has nowhere else to land: the
   * visitor pressed the one button that takes money, so the failure must be said out loud and the
   * button must come back rather than spinning forever.
   */
  it('surfaces a failed checkout session instead of only logging it', async () => {
    vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockRejectedValue(
      Object.assign(new Error('Service unavailable'), { status: 503 })
    )
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
      // A macrotask, not microtask ticks: counting awaits is exactly what made the old form brittle.
      await new Promise(resolve => setTimeout(resolve, 0))
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

  describe('checkout_error reporting', () => {
    const monthlyItem = {
      item_category: 'subscription',
      item_id: 'subscription-1-month',
      item_name: '1 Month',
      price: 1.99,
      quantity: 1,
    }

    const renderPlan = async () => {
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
    }

    const clickStripe = async () => {
      await act(async () => {
        container.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    }

    const withLocation = async (assign: (url: string) => void, run: () => Promise<void>) => {
      const originalLocation = window.location
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...originalLocation, assign },
      })
      try {
        await run()
      } finally {
        Object.defineProperty(window, 'location', { configurable: true, value: originalLocation })
      }
    }

    // Each sensitive string is planted in the failure itself, so a leak would show up in the payload.
    const sensitive = 'https://checkout.stripe.com/c/pay/cs_live_secret?prefilled_email=general@example.com'

    it.each([
      {
        name: 'an expired sign-in',
        arrange: () => token.get.mockRejectedValue(new AuthenticationRequiredError(sensitive)),
        stage: 'auth_token',
        errorType: 'auth_required',
      },
      {
        name: 'an unreachable API',
        arrange: () =>
          vi
            .spyOn(SubscriptionApi, 'createCheckoutSession')
            .mockRejectedValue(new SubscriptionApiError(sensitive)),
        stage: 'session_create',
        errorType: 'network',
      },
      {
        name: 'a rejected token',
        arrange: () =>
          vi
            .spyOn(SubscriptionApi, 'createCheckoutSession')
            .mockRejectedValue(new SubscriptionApiError(sensitive, 401)),
        stage: 'session_create',
        errorType: 'unauthorized',
      },
      {
        name: 'a rejected request',
        arrange: () =>
          vi
            .spyOn(SubscriptionApi, 'createCheckoutSession')
            .mockRejectedValue(new SubscriptionApiError(sensitive, 400)),
        stage: 'session_create',
        errorType: 'http_4xx',
      },
      {
        name: 'a server failure',
        arrange: () =>
          vi
            .spyOn(SubscriptionApi, 'createCheckoutSession')
            .mockRejectedValue(new SubscriptionApiError(sensitive, 502)),
        stage: 'session_create',
        errorType: 'http_5xx',
      },
      {
        name: 'an unrecognised exception',
        arrange: () =>
          vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockRejectedValue(new Error(sensitive)),
        stage: 'session_create',
        errorType: 'unknown',
      },
      {
        name: 'a response without a checkout URL',
        arrange: () => vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockResolvedValue({ body: {} }),
        stage: 'session_response',
        errorType: 'missing_url',
      },
    ])('reports $name as $stage/$errorType without the raw error', async ({ arrange, stage, errorType }) => {
      arrange()
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      await renderPlan()
      await clickStripe()

      expect(analytics.logCheckoutError).toHaveBeenCalledTimes(1)
      expect(analytics.logCheckoutError).toHaveBeenCalledWith({
        errorType,
        items: [monthlyItem],
        kind: 'subscription',
        provider: 'stripe',
        stage,
      })
      const payload = JSON.stringify(analytics.logCheckoutError.mock.calls)
      for (const leak of ['cs_live', 'checkout.stripe.com', '@example.com', 'audience-token']) {
        expect(payload).not.toContain(leak)
      }
      // The visitor's experience is unchanged: the same alert, and the button comes back.
      expect(container.querySelector('[role="alert"]')!.textContent).toContain(
        'We could not open the checkout page'
      )
      expect(container.querySelector('button')?.disabled).toBe(false)
      expect(analytics.logBeginCheckout).toHaveBeenCalledTimes(1)
      expect(analytics.logPurchase).not.toHaveBeenCalled()
    })

    it('reports a hosted-checkout navigation that throws as a redirect failure', async () => {
      vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockResolvedValue({ body: { url: sensitive } })
      vi.spyOn(console, 'error').mockImplementation(() => undefined)

      await withLocation(
        () => {
          throw new DOMException(sensitive, 'SecurityError')
        },
        async () => {
          await renderPlan()
          await clickStripe()
        }
      )

      expect(analytics.logCheckoutError).toHaveBeenCalledWith({
        errorType: 'navigation_failed',
        items: [monthlyItem],
        kind: 'subscription',
        provider: 'stripe',
        stage: 'redirect',
      })
      expect(JSON.stringify(analytics.logCheckoutError.mock.calls)).not.toContain('cs_live')
    })

    it('reports nothing when the hand-off succeeds', async () => {
      vi.spyOn(SubscriptionApi, 'createCheckoutSession').mockResolvedValue({
        body: { url: 'https://checkout.stripe.com/c/pay/cs_test_123' },
      })
      const assign = vi.fn()

      await withLocation(assign, async () => {
        await renderPlan()
        await clickStripe()
      })

      expect(assign).toHaveBeenCalledTimes(1)
      expect(analytics.logCheckoutError).not.toHaveBeenCalled()
      expect(analytics.logBeginCheckout).toHaveBeenCalledTimes(1)
    })

    it('reports PayPal SDK and render failures, but never a cancellation', async () => {
      await renderPlan()

      paypal.callbacks!.onClick()
      paypal.callbacks!.onCancel()
      expect(analytics.logCheckoutError).not.toHaveBeenCalled()
      expect(analytics.logCheckoutCancelled).toHaveBeenCalledTimes(1)

      paypal.callbacks!.onError()
      paypal.callbacks!.onRenderError()

      expect(analytics.logCheckoutError).toHaveBeenNthCalledWith(1, {
        errorType: 'provider_error',
        items: [monthlyItem],
        kind: 'subscription',
        provider: 'paypal',
        stage: 'sdk_checkout',
      })
      expect(analytics.logCheckoutError).toHaveBeenNthCalledWith(2, {
        errorType: 'provider_error',
        items: [monthlyItem],
        kind: 'subscription',
        provider: 'paypal',
        stage: 'sdk_render',
      })
      expect(analytics.logPurchase).not.toHaveBeenCalled()
    })

    /*
     * PayPal's approval is the `purchase` event and stays exactly one. A confirmation that never
     * arrives is a separate activation stage, not a second purchase and not a payment failure.
     */
    it('keeps PayPal approval as one purchase and reports an unconfirmed activation separately', async () => {
      vi.spyOn(SubscriptionApi, 'requestGrant').mockRejectedValue(new SubscriptionApiError('not yet', 404))
      await renderPlan()

      await act(async () => {
        await paypal.callbacks!.onSuccess({
          billingToken: null,
          facilitatorAccessToken: 'access-token',
          orderID: 'order-id',
          paymentID: null,
          subscriptionID: 'I-SUBSCRIPTION',
        })
      })

      // The first grant racing PayPal's webhook is expected, so it is not an error.
      expect(analytics.logCheckoutError).not.toHaveBeenCalled()
      expect(analytics.logPurchase).toHaveBeenCalledTimes(1)

      act(() => paypal.modal!.onConfirmationTimeout!())

      expect(analytics.logCheckoutError).toHaveBeenCalledTimes(1)
      expect(analytics.logCheckoutError).toHaveBeenCalledWith({
        errorType: 'timeout',
        items: [monthlyItem],
        kind: 'subscription',
        provider: 'paypal',
        stage: 'activation_confirmation',
      })
      expect(JSON.stringify(analytics.logCheckoutError.mock.calls)).not.toContain('I-SUBSCRIPTION')
      expect(analytics.logPurchase).toHaveBeenCalledTimes(1)
    })
  })
})
