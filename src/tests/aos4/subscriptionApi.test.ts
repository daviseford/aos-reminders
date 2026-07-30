import { SubscriptionApi } from '../../api/subscriptionApi'
import { describe, expect, it, vi } from 'vitest'

/*
 * The subscription API is an API Gateway REST API and does not decode percent-encoded path
 * parameters. A `%40` in place of `@` reaches the lambda literally, matches no stored userName, and
 * answers 501 — which `useSubscription` reads as "no subscription". Encoding the address therefore
 * made every subscriber look unsubscribed, in both the dev and prod stacks, without an error.
 */

const requested: string[] = []

vi.mock('superagent', () => {
  const chain = { timeout: () => chain, send: () => chain }
  return {
    default: {
      get: (url: string) => {
        requested.push(url)
        return chain
      },
      post: (url: string) => {
        requested.push(url)
        return chain
      },
    },
  }
})

describe('subscription API client', () => {
  it('leaves @ literal in the user lookup path', () => {
    requested.length = 0
    SubscriptionApi.getSubscription('davis.e.ford.alt@gmail.com')

    expect(requested).toHaveLength(1)
    expect(requested[0]).toContain('/user/davis.e.ford.alt@gmail.com')
    expect(requested[0]).not.toContain('%40')
  })

  it('still escapes characters that would break path routing', () => {
    requested.length = 0
    SubscriptionApi.getSubscription('a/b?c#d@example.com')

    const [url] = requested
    const path = url.slice(url.indexOf('/user/') + '/user/'.length)
    expect(path).toBe('a%2Fb%3Fc%23d@example.com')
  })

  it('preserves plus-addressed accounts', () => {
    requested.length = 0
    SubscriptionApi.getSubscription('davis+aos@gmail.com')

    expect(requested[0]).toContain('/user/davis%2Baos@gmail.com')
  })
})
