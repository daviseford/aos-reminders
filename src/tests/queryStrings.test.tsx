// @vitest-environment jsdom

import { PaypalProvider } from 'context/usePaypal'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { readRedemptionQuery } from 'utils/redemptionStorage'
import { afterEach, describe, expect, it } from 'vitest'

/*
 * Both query strings were built and read by `qs` until the browser's URLSearchParams replaced it.
 * These cases are the ones `qs` was checked against, so the swap cannot quietly change either one.
 */
describe('gift redemption links', () => {
  it.each([
    ['?redeem=gift-1&referrer=auth0%7Cabc', { giftId: 'gift-1', userId: 'auth0|abc' }],
    ['?referrer=auth0|abc&redeem=gift+1', { giftId: 'gift 1', userId: 'auth0|abc' }],
    ['?redeem=%E2%9C%93&referrer=x', { giftId: '✓', userId: 'x' }],
    ['?redeem=&referrer=x', { giftId: '', userId: 'x' }],
  ])('reads %s', (search, expected) => {
    expect(readRedemptionQuery(search)).toEqual(expected)
  })

  it.each(['', '?redeem=gift-1', '?redeem=a&redeem=b&referrer=x', '?redeem[]=a&referrer=x'])(
    'rejects %s',
    search => {
      expect(readRedemptionQuery(search)).toBeNull()
    }
  )
})

describe('PayPal SDK script', () => {
  let container: HTMLDivElement | undefined

  afterEach(() => {
    if (container) {
      const mounted = container
      act(() => {
        unmountComponentAtNode(mounted)
      })
      mounted.remove()
    }
    document.querySelectorAll('script[src*="paypal.com"]').forEach(script => script.remove())
  })

  it('loads the same SDK URL that qs built', async () => {
    const mounted = document.createElement('div')
    container = mounted
    document.body.appendChild(mounted)
    await act(async () => {
      render(<PaypalProvider />, mounted)
    })

    const script = document.querySelector<HTMLScriptElement>('script[src*="paypal.com"]')
    expect(script?.src).toBe(
      'https://www.paypal.com/sdk/js?client-id=AUdnPSV280IH8pjveo62IzfQJgfFo0MoJ9w-zouTipgjAethtmcvHFjV8DXCCqoti4WHdbjhMNnwn9oa' +
        '&disable-funding=credit%2Ccard&components=buttons&currency=USD&vault=true'
    )
  })
})
