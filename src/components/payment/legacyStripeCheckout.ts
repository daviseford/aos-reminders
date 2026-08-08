import type { Stripe, StripeConstructor, StripeError } from '@stripe/stripe-js'

/*
 * The client-only hosted-Checkout call this product's subscribe and gift flows are built on.
 *
 * `stripe.redirectToCheckout` was removed outright in Stripe's Clover release (changelog
 * 2025-09-30), and the versioned runtime that @stripe/stripe-js v9 pins refuses it with an
 * IntegrationError — which silently broke every card checkout on the site. The evergreen build at
 * js.stripe.com/v3 still honours the call for this grandfathered integration: verified 2026-08-07
 * with a live test-mode call that redirected to checkout.stripe.com.
 *
 * So this module loads /v3 itself, the same way context/usePaypal.tsx loads PayPal's SDK, and the
 * checkout surfaces use `loadLegacyStripe` instead of the package's `loadStripe`. The two loaders
 * must not mix: whichever build defines `window.Stripe` first wins, and the versioned build answers
 * redirectToCheckout by throwing. Replacing this properly means server-created Checkout Sessions,
 * which is subscription-API work, not frontend work.
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

// window.Stripe is already declared by @stripe/stripe-js as StripeConstructor | undefined.
const LEGACY_SCRIPT_URL = 'https://js.stripe.com/v3'

let scriptPromise: Promise<StripeConstructor | null> | null = null

/*
 * One script tag per page, shared by the subscribe and gift surfaces. Resolves null rather than
 * rejecting on a load failure, matching what loadStripe callers already handle: the buttons stay
 * disabled and the card explains that card checkout is unavailable.
 */
const loadScript = (): Promise<StripeConstructor | null> => {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise(resolve => {
    if (typeof window === 'undefined') return resolve(null)
    if (window.Stripe) return resolve(window.Stripe)

    const script = document.createElement('script')
    script.src = LEGACY_SCRIPT_URL
    script.async = true
    script.onload = () => resolve(window.Stripe ?? null)
    script.onerror = () => {
      console.error('The Stripe checkout script could not be loaded.')
      resolve(null)
    }
    document.body.appendChild(script)
  })

  return scriptPromise
}

/** Drop-in for `loadStripe`, returning an instance whose redirectToCheckout actually works. */
export const loadLegacyStripe = async (key: string): Promise<Stripe | null> => {
  const factory = await loadScript()
  return factory ? factory(key) : null
}

export const redirectToCheckout = (stripe: Stripe, options: ILegacyRedirectToCheckoutOptions) =>
  (stripe as ILegacyCheckoutStripe).redirectToCheckout(options)
