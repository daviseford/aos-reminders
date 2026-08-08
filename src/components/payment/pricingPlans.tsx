import { useAuth0 } from '@auth0/auth0-react'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import GenericButton from 'components/input/generic_button'
import { PaypalPostSubscribeModal } from 'components/modals/paypal_post_subscribe_modal'
import { redirectToCheckout } from 'components/payment/legacyStripeCheckout'
import PayPalButton from 'components/payment/paypal/paypalButton'
import { IApprovalResponse } from 'components/payment/paypal/paypalTypes'
import { PaypalProvider } from 'context/usePaypal'
import { useTheme } from 'context/useTheme'
import qs from 'qs'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { FaStripe } from 'react-icons/fa'
import { centerContentClass } from 'theme/helperClasses'
import { logBeginCheckout, logCheckoutCancelled, logClick, logPurchase } from 'utils/analytics'
import { useApiAccessToken } from 'utils/authToken'
import { isDev, STRIPE_KEY } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'
import {
  bestValuePlan,
  ISubscriptionPlan,
  monthlySavingPct,
  SubscriptionPlans,
  toSubscriptionAnalyticsItem,
} from 'utils/plans'
import { SubscriptionApi } from '../../api/subscriptionApi'

const PricingPlansComponent = () => {
  const [paypalModalIsOpen, setPaypalModalIsOpen] = useState(false)
  const bestValue = bestValuePlan()

  return (
    <PaypalProvider>
      <div className="container">
        <PlansHeader />
        {/*
          Above the cards, not below them. These three sentences are the answer to what stops someone
          committing — no card details here, cancel whenever, keep access to the end of the period —
          and they used to sit in 12px italic underneath all three plans, arriving after the decision
          they exist to unblock.
        */}
        <TrustNote />
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center text-center">
          {SubscriptionPlans.map(plan => (
            <PlanComponent
              supportPlan={plan}
              isBestValue={plan.title === bestValue?.title}
              paypalModalIsOpen={paypalModalIsOpen}
              setPaypalModalIsOpen={setPaypalModalIsOpen}
              key={plan.title}
            />
          ))}
        </div>
      </div>
    </PaypalProvider>
  )
}

const TrustNote = () => (
  <div className="row text-center justify-content-center mb-3 mb-sm-4">
    <div className="col-12 col-sm-10 col-md-10 col-xl-8 col-xxl-6">
      <small>
        <em>
          AoS Reminders does not store your credit card information.
          <br />
          Subscriptions are managed by Stripe and PayPal. They can be canceled at any time.
          <br />
          You will have access to all subscription features until the end of your subscription, even if you
          cancel the recurring payments.
        </em>
      </small>
    </div>
  </div>
)

const PlansHeader = () => {
  const hasSale = SubscriptionPlans.some(plan => plan.sale)

  // The band behind this supplies the surface colour; hardcoding bg-light here left a white strip
  // behind the heading when the band follows the theme.
  return (
    <div className="col-12 text-center mb-3">
      <h2>
        Subscription Plans
        {hasSale && <span className="ms-2 badge bg-danger">Sale!</span>}
      </h2>
    </div>
  )
}

interface IPlanProps {
  supportPlan: ISubscriptionPlan
  isBestValue?: boolean
  paypalModalIsOpen: boolean
  setPaypalModalIsOpen: (isOpen: boolean) => void
}

export const PlanComponent = (props: IPlanProps) => {
  const { supportPlan, isBestValue } = props
  const { user, isAuthenticated } = useAuth0()
  const { login } = useLogin({ origin: supportPlan.title })
  const { theme } = useTheme()
  const stripe = useStripe()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const savingPct = monthlySavingPct(supportPlan)

  /*
   * No `if (!stripe) return null`. Stripe.js failing to load used to delete the entire card — taking
   * the PayPal button rendered inside it with it — so a visitor who could have paid by PayPal was
   * shown an empty pricing band and no explanation. The card stays; only the card button goes quiet.
   */

  const handleStripeCheckout = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (!user || !stripe || isRedirecting) return

    logClick(supportPlan.title)
    logBeginCheckout({
      items: [toSubscriptionAnalyticsItem(supportPlan)],
      provider: 'stripe',
    })
    const plan = isDev ? supportPlan.stripe_dev : supportPlan.stripe_prod
    const origin = window.location.origin
    const successQuery = qs.stringify({
      subscribed: true,
      checkout_kind: 'subscription',
      plan: supportPlan.title,
    })

    setIsRedirecting(true)
    setCheckoutError('')
    try {
      const result = await redirectToCheckout(stripe, {
        items: [{ plan, quantity: 1 }],
        customerEmail: user.email,
        clientReferenceId: user.email,
        successUrl: `${origin}/?${successQuery}&checkout_session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/?${qs.stringify({
          canceled: true,
          checkout_kind: 'subscription',
          plan: supportPlan.title,
        })}`,
      })

      /*
       * A rejected redirect used to reach console.error and nothing else, so the visitor pressed the
       * one button that takes money and watched the page do nothing at all.
       */
      if (result.error) {
        console.error(result.error)
        setCheckoutError('We could not open the checkout page. Please try again, or use PayPal instead.')
      }
    } catch (error) {
      console.error(error)
      setCheckoutError('We could not open the checkout page. Please try again, or use PayPal instead.')
    } finally {
      // Reached only when the redirect did not happen; a successful one has already left the page.
      setIsRedirecting(false)
    }
  }

  /*
   * px-0 only: this card is a direct child of a `row-cols-*` row, so Bootstrap 5's `.row > *` would
   * inset the header and body 15px inside the card's own border. Its width still comes from
   * `.row-cols-*`, so unlike the other opt-outs (see navbar_wrapper) this one must not touch it.
   */
  return (
    /*
     * The best-value card is marked by a border and by the words "Best value" in its header, never by
     * colour alone — DESIGN.md's rule that a tone always pairs with a text label, because the tone is
     * gone in print and for colour-blind players.
     */
    <div className={`${theme.card} mb-4 shadow-sm px-0${isBestValue ? ' border-primary' : ''}`}>
      <div className="card-header bg-themeDarkBluePrimary text-light">
        <h3 className="my-0 fw-normal">
          {supportPlan.title}
          {isBestValue && <span className="ms-2 badge rounded-pill bg-light text-dark">Best value</span>}
        </h3>
      </div>
      {/*
        A flex column so the CTA can be pushed to the bottom. Without it the buttons sat at different
        heights across the three cards, because only two of them carry a saving line above.
      */}
      <div className={`${theme.cardBody} d-flex flex-column`}>
        {/* A price is not a heading. The .h1 class keeps the type scale unchanged. */}
        <p className="card-title h1">
          ${supportPlan.monthly_cost}
          {/*
            theme.textMuted, not text-muted: Bootstrap's #6c757d lands at 3.28:1 on the dark card
            body, under the 4.5:1 minimum for 12px text. Dark theme's text-white-75 clears it at
            9.24:1, and light theme resolves back to text-muted.
          */}
          <small className={theme.textMuted}>/ month</small>
        </p>
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            {!!supportPlan.discount_pct && (
              <>
                <span className="badge rounded-pill bg-danger mb-2">{supportPlan.discount_pct}% off!</span>
                <br />
              </>
            )}
            {/*
              Derived from plans.ts, never written down: the figure and the prices above it cannot
              drift apart. This is the page's strongest true claim and it went unsaid for years.
            */}
            {savingPct > 0 ? (
              <>
                <strong>Save {savingPct}%</strong>
              </>
            ) : (
              // The baseline plan discounts nothing, so the row would otherwise be empty.
              <>Billed monthly</>
            )}
          </li>
        </ul>
        {/*
          No `mx-3`. That inset was sized for a single full-width button; with two rails beside each
          other it cost 32px, which was exactly what pushed them past PayPal's 150px floor and wrapped
          them at 1280 and 1440 — the two most common laptop widths. The card body's own 1.25rem
          padding is the margin now.
        */}
        <div className="mt-auto">
          {!isAuthenticated ? (
            /*
             * Signed out, the payment rails are withheld entirely. PayPal cannot render without an
             * account e-mail, so the brand pair collapsed to one lopsided wordmark button — and
             * clicking it opened the login popup while its accessible name promised Stripe. One
             * plain, truthfully-labelled button carries the intent; the rails appear after login,
             * when each really is one click from its checkout.
             */
            <GenericButton
              type="button"
              className="btn d-block w-100 btn-primary TapTargetBlock py-2"
              onClick={login}
            >
              Subscribe for {supportPlan.title}
            </GenericButton>
          ) : (
            <>
              {/*
                Names the action the brand marks below only imply. Both buttons' visible labels are
                logos, so without this line the card ends in two wordmarks and no verb.
              */}
              <p className="mb-1">
                <small className={theme.textMuted}>Subscribe with:</small>
              </p>
              {/*
                The two rails sit side by side as equal choices rather than stacked with Stripe on
                top, where PayPal read as an afterthought.

                flex-wrap rather than a breakpoint: the card's own width varies with the 1/2/3-up
                plan grid, so the pair drops to stacked exactly when there is no longer room for
                both, without guessing which viewport that happens at.
              */}
              <div className="d-flex flex-wrap align-items-start gap-2 PaymentChoice">
                <IconContext.Provider value={{ size: '1.2em' }}>
                  {/*
                    The visible label is just the wordmark, because half a card cannot hold
                    "Subscribe for 3 Months" as well. The accessible name carries the whole sentence,
                    and the plan it belongs to, since three cards of identical buttons would
                    otherwise be indistinguishable.
                  */}
                  <GenericButton
                    type="button"
                    aria-label={`Subscribe for ${supportPlan.title} with Stripe`}
                    className="btn d-block btn-primary TapTargetBlock py-2 PaymentChoiceOption--stripe"
                    disabled={isRedirecting || !stripe}
                    onClick={handleStripeCheckout}
                  >
                    {isRedirecting ? (
                      <span className={centerContentClass}>
                        <span
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Opening&hellip;
                      </span>
                    ) : (
                      <span className={centerContentClass}>
                        {/*
                          The Stripe wordmark, from the react-icons Font Awesome brand set DESIGN.md
                          already names as the product's icon source. aria-hidden because the
                          accessible name above already says "Stripe" — announcing it twice is noise.
                        */}
                        <span className="StripeMark">
                          <FaStripe size="3.4em" aria-hidden="true" />
                        </span>
                      </span>
                    )}
                  </GenericButton>
                </IconContext.Provider>
                <PayPalComponent {...props} />
              </div>
            </>
          )}
          {checkoutError && (
            <div className="alert alert-danger mt-2 mb-0 py-2" role="alert">
              <small>{checkoutError}</small>
            </div>
          )}
          {isAuthenticated && !stripe && !checkoutError && (
            <p className="mt-2 mb-0">
              <small className={theme.textMuted}>Card checkout is still loading. PayPal is ready.</small>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const PayPalComponent = (props: IPlanProps) => {
  const getAccessToken = useApiAccessToken()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [approval, setApproval] = useState<IApprovalResponse | null>(null)

  const { paypal_dev, paypal_prod, title } = props.supportPlan
  const planId = isDev ? paypal_dev : paypal_prod
  const analyticsItem = toSubscriptionAnalyticsItem(props.supportPlan)

  // The approval response supplies a locator. The API retrieves the authoritative PayPal
  // subscription before granting access, and the modal retries while callback activation lands.
  const requestGrant = async (data: IApprovalResponse | null = approval) => {
    if (!data?.subscriptionID) return null
    const token = await getAccessToken()
    return SubscriptionApi.requestGrant({ subscriptionId: data.subscriptionID }, token)
  }

  const handleSuccess = async (data: IApprovalResponse) => {
    setApproval(data)
    setModalIsOpen(true)
    props.setPaypalModalIsOpen(true)
    logPurchase({
      items: [analyticsItem],
      provider: 'paypal',
      transactionId: data.subscriptionID,
    })

    try {
      await requestGrant(data)
    } catch {
      // The post-subscribe modal keeps retrying the grant while it polls
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
    props.setPaypalModalIsOpen(false)
  }

  return (
    /*
     * A flex item beside the Stripe button now, so it carries PaymentChoiceOption rather than any
     * spacing of its own — the row's `gap-2` owns the space between the two rails.
     *
     * Historical note on what this used to be: `col mt-2`. This is a card body, not a row, so the
     * `.col` was one of the outside-a-row columns theme.scss keeps a shim for — and inside the flex
     * column it resolved to
     * `flex: 1 0 0%`, absorbing the slack the CTA's `mt-auto` needs to sit at the card's bottom edge.
     */
    <div className="PaymentChoiceOption--paypal">
      {!props.paypalModalIsOpen && (
        <PayPalButton
          onClick={() => logBeginCheckout({ items: [analyticsItem], provider: 'paypal' })}
          onCancel={() => logCheckoutCancelled({ items: [analyticsItem], provider: 'paypal' })}
          onSuccess={handleSuccess}
          planId={planId}
          planTitle={title}
        />
      )}
      {modalIsOpen && (
        <PaypalPostSubscribeModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          retryGrant={requestGrant}
        />
      )}
    </div>
  )
}

const stripePromise = loadStripe(STRIPE_KEY)

export const PricingPlans = () => (
  <Elements stripe={stripePromise}>
    <PricingPlansComponent />
  </Elements>
)
