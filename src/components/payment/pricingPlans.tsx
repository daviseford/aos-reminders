import React from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import qs from 'qs'
import { useAuth0 } from 'react-auth0-wrapper'
import { useSavedArmies } from 'context/useSavedArmies'
import { logClick } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import { LocalStoredArmy } from 'utils/localStore'
import AsyncStripeProvider from 'components/payment/asyncStripeProvider'
import { SubscriptionPlans, ISubscriptionPlan } from 'utils/plans'
import { IUser } from 'types/user'

interface ICheckoutProps {
  stripe?: any
}

const PricingPlansComponent: React.FC<ICheckoutProps> = props => {
  const { stripe } = props
  const { user }: { user: IUser } = useAuth0()

  return (
    <div className="container">
      <PlansHeader />

      <div className="card-deck text-center">
        {SubscriptionPlans.map((plan, i) => (
          <PlanComponent stripe={stripe} user={user} supportPlan={plan} key={i} />
        ))}
      </div>
      <div className="row text-center justify-content-center">
        <div className="col-12 col-sm-10 col-md-10 col-xl-8 col-xxl-6">
          <small>
            <em>
              Subscriptions are handled by Stripe and can be canceled at any time. I do not store your credit
              card information.
              <br />
              You will have access to all subscription features until the end of your subscription, even if
              you cancel the recurring payments.
            </em>
          </small>
        </div>
      </div>
    </div>
  )
}

const PlansHeader = () => {
  const hasSale = SubscriptionPlans.some(x => x.sale)

  return (
    <div className="col-12 bg-light text-center mb-3">
      <h2>
        Subscription Plans
        {hasSale && <span className="ml-2 badge badge-danger">Sale!</span>}
      </h2>
    </div>
  )
}

interface IPlanProps {
  stripe: any
  user: IUser
  supportPlan: ISubscriptionPlan
}

const PlanComponent: React.FC<IPlanProps> = props => {
  const { stripe, user, supportPlan } = props
  const { isAuthenticated } = useAuth0()
  const { handleLogin } = useSavedArmies()

  // When the customer clicks on the button, redirect them to Checkout.
  const handleCheckout = async e => {
    e.preventDefault()

    logClick(supportPlan.title)

    LocalStoredArmy.set() // Store our current army in local storage so we don't lose it

    const plan = isDev ? supportPlan.dev : supportPlan.prod
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    const item = { plan, quantity: 1 }

    stripe
      .redirectToCheckout({
        items: [item],

        // Meta
        customerEmail: user.email, // Used to prefill checkout
        clientReferenceId: user.email, // Included in the checkout.session.completed webhook

        // Redirect after checkout
        successUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          subscribed: true,
          plan: supportPlan.title,
        })}`,
        cancelUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          canceled: true,
          plan: supportPlan.title,
        })}`,
      })
      .then(function(result) {
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer.
          console.log(result.error)
          // var displayError = document.getElementById('error-message');
          // displayError.textContent = result.error.message;
        }
      })
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-themeDarkBluePrimary text-light">
        <h4 className="my-0 font-weight-normal">{supportPlan.title}</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title">
          ${supportPlan.monthly_cost}
          <small className="text-muted">/ month</small>
        </h1>
        <ul className="list-unstyled mt-3 mb-4">
          <li>
            {!!supportPlan.discount_pct && (
              <>
                <span className="badge badge-pill badge-danger mb-2">{supportPlan.discount_pct}% off!</span>
                <br />
              </>
            )}
            Total: ${supportPlan.cost}
          </li>
        </ul>
        <button
          type="button"
          className="btn btn btn-block btn-primary"
          onClick={
            isAuthenticated ? handleCheckout : () => handleLogin({ redirect_uri: window.location.href })
          }
        >
          Subscribe for {supportPlan.title}
        </button>
      </div>
    </div>
  )
}

const InjectedPricingPlans = injectStripe(PricingPlansComponent)

export const PricingPlans = () => {
  return (
    <AsyncStripeProvider apiKey={STRIPE_KEY}>
      <Elements>
        <InjectedPricingPlans />
      </Elements>
    </AsyncStripeProvider>
  )
}
