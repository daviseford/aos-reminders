import type { Stripe, StripeError } from '@stripe/stripe-js'

/*
 * `stripe.redirectToCheckout` was dropped from the @stripe/stripe-js types in v9 (the legacy
 * client-only hosted-Checkout surface), but the Stripe.js runtime at js.stripe.com/v3 still serves
 * it for existing Checkout integrations. The subscribe and gift flows below predate Stripe's
 * server-created Checkout Session model; replacing them needs backend work that is out of scope for
 * the package upgrade, so the exact runtime call is preserved and the legacy surface is declared
 * here.
 */
export interface ILegacyRedirectToCheckoutOptions {
  mode?: 'payment' | 'subscription'
  items?: Array<{ plan?: string; sku?: string; quantity: number }>
  lineItems?: Array<{ price: string; quantity: number }>
  customerEmail?: string
  clientReferenceId?: string
  successUrl: string
  cancelUrl: string
}

interface ILegacyCheckoutStripe extends Stripe {
  redirectToCheckout(options: ILegacyRedirectToCheckoutOptions): Promise<{ error?: StripeError }>
}

export const redirectToCheckout = (stripe: Stripe, options: ILegacyRedirectToCheckoutOptions) =>
  (stripe as ILegacyCheckoutStripe).redirectToCheckout(options)
