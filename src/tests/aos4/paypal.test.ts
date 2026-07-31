import { describe, expect, it } from 'vitest'
import { getPaypalSubscriptionManagementUrl } from '../../utils/paypal'

describe('PayPal subscription management', () => {
  it('builds the production management URL and safely encodes the billing ID', () => {
    expect(getPaypalSubscriptionManagementUrl('billing/id', false)).toBe(
      'https://www.paypal.com/myaccount/autopay/connect/billing%2Fid'
    )
  })

  it('uses PayPal sandbox during development', () => {
    expect(getPaypalSubscriptionManagementUrl('billing-id', true)).toBe(
      'https://www.sandbox.paypal.com/myaccount/autopay/connect/billing-id'
    )
  })
})
