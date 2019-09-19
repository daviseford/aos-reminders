import React from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import { useAuth0 } from 'react-auth0-wrapper'
import { isDev } from 'utils/env'
import { SupportPlans, ISupportPlan } from './plans'
import { IUser } from 'types/user'
import { logClick } from 'utils/analytics'
import qs from 'qs'

interface ICheckoutProps {
  stripe?: any
}

const PricingPlansComponent: React.FC<ICheckoutProps> = props => {
  const { stripe } = props
  const { user }: { user: IUser } = useAuth0()

  return (
    <div className="container">
      <div className="card-deck mb-3 text-center">
        {SupportPlans.map((plan, i) => (
          <PlanComponent stripe={stripe} user={user} supportPlan={plan} key={i} />
        ))}
      </div>
    </div>
  )
}

interface IPlanProps {
  stripe: any
  user: IUser
  supportPlan: ISupportPlan
}

const PlanComponent: React.FC<IPlanProps> = props => {
  const { stripe, user, supportPlan } = props
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  // When the customer clicks on the button, redirect them to Checkout.
  const handleCheckout = async e => {
    e.preventDefault()

    logClick(supportPlan.title)

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
      <div className="card-header">
        <h4 className="my-0 font-weight-normal">{supportPlan.title}</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title">
          ${supportPlan.monthly_cost} <small className="text-muted">/ mo</small>
        </h1>
        <ul className="list-unstyled mt-3 mb-4">
          <li>Total: ${supportPlan.cost}</li>
        </ul>
        <button
          type="button"
          className="btn btn btn-block btn-outline-primary"
          onClick={isAuthenticated ? handleCheckout : loginWithRedirect}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

const InjectedPricingPlans = injectStripe(PricingPlansComponent)

export const PricingPlans = () => {
  return (
    <Elements>
      <InjectedPricingPlans />
    </Elements>
  )
}
