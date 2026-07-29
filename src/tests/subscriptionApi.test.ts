import { beforeEach, describe, expect, it, vi } from 'vitest'

const timeout = vi.fn(() => Promise.resolve({ ok: true }))
const send = vi.fn((data: Record<string, unknown>) => ({ timeout, data }))
const post = vi.fn((url: string) => ({ send, url }))
const get = vi.fn((url: string) => ({ timeout, url }))

vi.mock('superagent', () => ({
  default: {
    post: (url: string) => post(url),
    get: (url: string) => get(url),
  },
}))

import { SubscriptionApi } from '../api/subscriptionApi'

describe('SubscriptionApi.requestGrant', () => {
  beforeEach(() => {
    post.mockClear()
    send.mockClear()
  })

  it('sends the payment proof (subscriptionId + planId) with the grant request', async () => {
    await SubscriptionApi.requestGrant({
      userName: 'user@example.com',
      subscriptionId: 'I-ABC123XYZ',
      planId: 'P-54G67667NT497912UL5TBTBQ',
    })

    expect(post).toHaveBeenCalledWith(expect.stringContaining('/paypal_grant'))
    const payload = send.mock.calls[0][0]
    expect(payload.userName).toEqual('user@example.com')
    expect(payload.subscriptionId).toEqual('I-ABC123XYZ')
    expect(payload.planId).toEqual('P-54G67667NT497912UL5TBTBQ')
    expect(typeof payload.authKey).toEqual('string')
  })

  it('degrades to a userName-only grant when no approval data is available', async () => {
    await SubscriptionApi.requestGrant({ userName: 'user@example.com' })

    const payload = send.mock.calls[0][0]
    expect(payload.userName).toEqual('user@example.com')
    expect(payload.subscriptionId).toBeUndefined()
    expect(payload.planId).toBeUndefined()
  })
})
