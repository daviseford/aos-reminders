import { createSubscriptionApi, SubscriptionApiError } from '../api/subscriptionApi'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('subscription current-account API', () => {
  const requests: Array<{ url: string; options?: RequestInit }> = []
  const fetcher = vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
    requests.push({ url: String(url), options })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  })
  const api = createSubscriptionApi('https://subscriptions.example.test/base/', fetcher)

  beforeEach(() => {
    requests.length = 0
    fetcher.mockClear()
  })

  it('sends bearer auth and action-only bodies for every account operation', async () => {
    const token = 'audience-token'
    await api.getSubscription(token)
    await api.cancelSubscription(token)
    await api.requestGrant({ subscriptionId: 'I-ABC123XYZ' }, token)
    await api.redeemCoupon({ couponId: 'COUPON1' }, token)
    await api.redeemGift({ giftId: 'gift-1', userId: 'giver-1' }, token)
    await api.updateTheme({ theme: 'dark' }, token)

    expect(requests.map(request => request.url)).toEqual([
      'https://subscriptions.example.test/base/account',
      'https://subscriptions.example.test/base/account/cancel',
      'https://subscriptions.example.test/base/account/paypal-grant',
      'https://subscriptions.example.test/base/account/redeem-coupon',
      'https://subscriptions.example.test/base/account/redeem-gift',
      'https://subscriptions.example.test/base/account/theme',
    ])
    for (const request of requests) {
      expect(new Headers(request.options?.headers).get('Authorization')).toBe('Bearer audience-token')
    }
    expect(requests.map(request => request.options?.body)).toEqual([
      undefined,
      undefined,
      JSON.stringify({ subscriptionId: 'I-ABC123XYZ' }),
      JSON.stringify({ couponId: 'COUPON1' }),
      JSON.stringify({ giftId: 'gift-1', userId: 'giver-1' }),
      JSON.stringify({ theme: 'dark' }),
    ])
  })

  it('fails before network access when the endpoint is absent', async () => {
    const unconfigured = createSubscriptionApi('', fetcher)
    await expect(unconfigured.getSubscription('token')).rejects.toMatchObject({ status: 503 })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('preserves HTTP status for account-state recovery', async () => {
    const unavailable = createSubscriptionApi('https://subscriptions.example.test', async () =>
      Promise.resolve(new Response(JSON.stringify('Not authorized'), { status: 401 }))
    )
    await expect(unavailable.getSubscription('token')).rejects.toEqual(
      expect.objectContaining<Partial<SubscriptionApiError>>({ status: 401 })
    )
  })
})
