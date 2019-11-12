import React, { useState } from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import qs from 'qs'
import { useAuth0 } from 'react-auth0-wrapper'
import AsyncStripeProvider from './asyncStripeProvider'
import { useSavedArmies } from 'context/useSavedArmies'
import { logClick } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import { GiftedSubscriptionPlans, IGiftedSubscriptionPlans } from './plans'
import { IUser } from 'types/user'
import { LocalStoredArmy } from 'utils/localStore'
import { useSubscription } from 'context/useSubscription'
import { componentWithSize } from 'utils/mapSizesToProps'

const HAS_SALE = GiftedSubscriptionPlans.some(x => x.sale)

interface ICheckoutProps {
  stripe?: any
}

const GiftSubscriptionsComponent: React.FC<ICheckoutProps> = props => {
  const { stripe } = props
  const { user }: { user: IUser } = useAuth0()
  const { isActive } = useSubscription()

  if (!stripe || !isActive) return <></>

  return (
    <div className="container">
      <PlansHeader />

      <table className="table">
        <thead>
          <td>
            <strong>Plan</strong>
          </td>
          <td>
            <strong>Quantity</strong>
          </td>
          <td>
            <strong>Cost</strong>
          </td>
        </thead>
        <tbody>
          {GiftedSubscriptionPlans.map((plan, i) => (
            <PlanComponent stripe={stripe} user={user} supportPlan={plan} key={i} />
          ))}
        </tbody>
      </table>
      <div className="row text-center justify-content-center">
        <div className="col">
          <small>
            <em>
              Gifted subscriptions are <strong>not</strong> recurring charges. You only pay for the initial
              subscription period.
              <br />
              You will receive an activation link that you can send to anyone. They will set up their account
              using that link.
            </em>
          </small>
        </div>
      </div>
    </div>
  )
}

const PlansHeader = () => {
  return (
    <div className="col-12 text-center mb-3">
      <h4>
        Gift a Subscription!
        {HAS_SALE && <span className="ml-2 badge badge-danger">Sale!</span>}
      </h4>
    </div>
  )
}

interface IPlanProps {
  stripe: any
  user: IUser
  supportPlan: IGiftedSubscriptionPlans
  isMobile?: boolean
  isTinyMobile?: boolean
}

const PlanComponent: React.FC<IPlanProps> = componentWithSize(props => {
  const { stripe, user, supportPlan, isMobile } = props
  const { isAuthenticated } = useAuth0()
  const { handleLogin } = useSavedArmies()
  const [quantity, setQuantity] = useState(1)

  // When the customer clicks on the button, redirect them to Checkout.
  const handleCheckout = async e => {
    e.preventDefault()

    if (quantity === 0) return // Can't do anything with zero quantity

    logClick(`${supportPlan.title}-GiftedSubscription`)

    LocalStoredArmy.set() // Store our current army in local storage so we don't lose it

    const plan = isDev ? supportPlan.dev : supportPlan.prod
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    const item = { plan, quantity }

    stripe
      .redirectToCheckout({
        items: [item],

        // Meta
        customerEmail: user.email, // Used to prefill checkout
        clientReferenceId: user.email, // Included in the checkout.session.completed webhook

        // Redirect after checkout
        successUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          gifted: true,
          quantity,
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

  const handleChange = e => {
    const value = e.target.value
    setQuantity(value)
  }

  return (
    <tr>
      <td>
        {' '}
        <strong className="">{supportPlan.title}</strong>{' '}
      </td>
      <td>
        <input
          style={{ maxWidth: '50px' }}
          className="form-control"
          type="number"
          value={quantity}
          onChange={handleChange}
        />
      </td>

      <td>${(parseFloat(supportPlan.cost) * quantity).toFixed(2)}</td>

      {HAS_SALE && !isMobile && (
        <td>
          <span className="badge badge-pill badge-danger mb-2">{supportPlan.discount_pct}% off!</span>
        </td>
      )}

      <td>
        <button
          type="button"
          className="btn btn btn-block btn-primary"
          onClick={isAuthenticated ? handleCheckout : handleLogin}
        >
          Purchase
        </button>
      </td>
    </tr>
  )
})

const InjectedGiftSubscriptions = injectStripe(GiftSubscriptionsComponent)

export const GiftSubscriptions = () => {
  return (
    <AsyncStripeProvider apiKey={STRIPE_KEY}>
      <Elements>
        <InjectedGiftSubscriptions />
      </Elements>
    </AsyncStripeProvider>
  )
}
