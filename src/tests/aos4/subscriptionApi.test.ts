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

  /*
   * #1942: the checkout-session request states an intent only. The server owns the price, the buyer
   * identity (from the JWT), and the return URLs, so none of them may travel in the body.
   */
  it('requests a checkout session by intent, with the bearer token and no identity', async () => {
    let captured: { url: string; options: RequestInit } | null = null
    const fetcher = vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
      captured = { url: String(input), options: options || {} }
      return new Response(JSON.stringify({ url: 'https://checkout.stripe.com/c/pay/cs_test_1' }), {
        status: 200,
      })
    })
    const api = createSubscriptionApi('https://subscriptions.example.test', fetcher)

    const { body } = await api.createCheckoutSession({ kind: 'gift', plan: '3 Months', quantity: 2 }, 'token')

    expect(body).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_1' })
    expect(captured!.url).toBe('https://subscriptions.example.test/account/checkout-session')
    expect(new Headers(captured!.options.headers).get('Authorization')).toBe('Bearer token')
    expect(JSON.parse(String(captured!.options.body))).toEqual({
      kind: 'gift',
      plan: '3 Months',
      quantity: 2,
    })
  })
})
