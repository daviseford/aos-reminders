import { createSubscriptionApi } from '../../api/subscriptionApi'
import { describe, expect, it, vi } from 'vitest'

describe('subscription API ownership boundary', () => {
  it('never puts caller identity or the retired browser key into a request', async () => {
    const requests: RequestInit[] = []
    const fetcher = vi.fn(async (_input: RequestInfo | URL, options?: RequestInit) => {
      requests.push(options || {})
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    })
    const api = createSubscriptionApi('https://subscriptions.example.test', fetcher)

    await api.cancelSubscription('token')
    await api.updateTheme({ theme: 'light' }, 'token')
    await api.redeemCoupon({ couponId: 'COUPON1' }, 'token')

    for (const options of requests) {
      const serialized = String(options.body || '')
      expect(serialized).not.toMatch(/authKey|userName|email|subscriptionId|"id"/)
    }
  })
})
