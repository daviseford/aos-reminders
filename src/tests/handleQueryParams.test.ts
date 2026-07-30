// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleStripeCheckout } from 'utils/handleQueryParams'

const analytics = vi.hoisted(() => ({
  logCheckoutCancelled: vi.fn(),
  logPurchase: vi.fn(),
}))

vi.mock('utils/analytics', () => analytics)

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState({}, '', '/')
})

describe('Stripe checkout return handling', () => {
  it('logs a recognized subscription purchase and preserves unrelated URL state', () => {
    window.history.replaceState(
      {},
      '',
      '/?subscribed=true&checkout_kind=subscription&plan=1%20Month&checkout_session_id=cs_live_123&campaign=summer#top'
    )

    handleStripeCheckout()

    expect(analytics.logPurchase).toHaveBeenCalledWith({
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
      transactionId: 'cs_live_123',
    })
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(
      '/?campaign=summer#top'
    )
  })

  it('logs a recognized gift purchase with a bounded numeric quantity', () => {
    window.history.replaceState(
      {},
      '',
      '/profile?gifted=true&checkout_kind=gift_subscription&plan=3%20Months&quantity=3&checkout_session_id=cs_live_gift'
    )

    handleStripeCheckout()

    expect(analytics.logPurchase).toHaveBeenCalledWith({
      items: [
        {
          item_category: 'gift_subscription',
          item_id: 'gift-subscription-3-months',
          item_name: '3 Months',
          price: 2.67,
          quantity: 3,
        },
      ],
      provider: 'stripe',
      transactionId: 'cs_live_gift',
    })
    expect(window.location.pathname + window.location.search).toBe('/profile')
  })

  it.each([
    '?subscribed=true&checkout_kind=subscription&plan=Unknown&checkout_session_id=cs_live_bad',
    '?subscribed=true&checkout_kind=subscription&plan=1%20Month',
    '?gifted=true&checkout_kind=gift_subscription&plan=1%20Month&quantity=0&checkout_session_id=cs_live_bad',
    '?gifted=true&checkout_kind=gift_subscription&plan=1%20Month&quantity=100&checkout_session_id=cs_live_bad',
    '?subscribed=true&canceled=true&checkout_kind=subscription&plan=1%20Month&checkout_session_id=cs_live_bad',
  ])('does not log forged or incomplete purchase state: %s', search => {
    window.history.replaceState({}, '', `/${search}`)

    handleStripeCheckout()

    expect(analytics.logPurchase).not.toHaveBeenCalled()
    expect(analytics.logCheckoutCancelled).not.toHaveBeenCalled()
    expect(window.location.pathname + window.location.search).toBe('/')
  })

  it('logs a bounded cancellation event for a recognized plan', () => {
    window.history.replaceState(
      {},
      '',
      '/?canceled=true&checkout_kind=gift_subscription&plan=1%20Year&quantity=3'
    )

    handleStripeCheckout()

    expect(analytics.logCheckoutCancelled).toHaveBeenCalledWith({
      items: [
        {
          item_category: 'gift_subscription',
          item_id: 'gift-subscription-1-year',
          item_name: '1 Year',
          price: 9.49,
          quantity: 3,
        },
      ],
      provider: 'stripe',
    })
    expect(window.location.pathname + window.location.search).toBe('/')
  })
})
