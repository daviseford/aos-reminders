// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/subscribe"}

import { PlanComponent } from 'components/payment/pricingPlans'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { SUBSCRIPTION_PLANS } from 'utils/plans'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const stripe = vi.hoisted(() => ({
  redirectToCheckout: vi.fn(),
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
  default: () => <div>PayPal</div>,
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

    await act(async () => {
      render(
        <PlanComponent
          supportPlan={SUBSCRIPTION_PLANS[0]}
          paypalModalIsOpen={false}
          setPaypalModalIsOpen={vi.fn()}
        />,
        container
      )
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(stripe.redirectToCheckout).toHaveBeenCalledTimes(1)
    expect(stripe.redirectToCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        cancelUrl: 'https://preview.example.test/?canceled=true&plan=1%20Month',
        clientReferenceId: 'general@example.com',
        customerEmail: 'general@example.com',
        items: [{ plan: SUBSCRIPTION_PLANS[0].stripe_prod, quantity: 1 }],
        successUrl: 'https://preview.example.test/?subscribed=true&plan=1%20Month',
      })
    )
    expect(container.querySelector('button')?.textContent).toBe('Subscribe for 1 Month')
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})
