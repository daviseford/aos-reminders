import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaypalPostSubscribeModal } from 'components/input/paypal_post_subscribe_modal'
import { PaypalProvider } from 'context/usePaypal'
import qs from 'qs'
import React, { useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { IUseAuth0 } from 'types/auth0'
import { IUser } from 'types/user'
import { logClick } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import { ISubscriptionPlan, SubscriptionPlans } from 'utils/plans'
import PayPalButton from './paypal/paypalButton'

const PricingPlansComponent: React.FC = () => {
  const { user }: IUseAuth0 = useAuth0()

  return (
    <PaypalProvider>
      <div className="container">
        <PlansHeader />

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center text-center">
          {SubscriptionPlans.map((plan, i) => (
            <PlanComponent user={user} supportPlan={plan} key={i} />
          ))}
        </div>
        <div className="row text-center justify-content-center">
          <div className="col-12 col-sm-10 col-md-10 col-xl-8 col-xxl-6">
            <small>
              <em>
                Subscriptions are handled by Stripe/PayPal and can be canceled at any time. I do not store
                your credit card information.
                <br />
                You will have access to all subscription features until the end of your subscription, even if
                you cancel the recurring payments.
              </em>
            </small>
          </div>
        </div>
      </div>
    </PaypalProvider>
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
  user: IUser
  supportPlan: ISubscriptionPlan
}

const PlanComponent: React.FC<IPlanProps> = props => {
  const { user, supportPlan } = props
  const stripe = useStripe()
  const { isAuthenticated, loginWithRedirect }: IUseAuth0 = useAuth0()

  if (!stripe) return null

  // When the customer clicks on the Subscribe button, redirect them to Stripe Checkout.
  const handleStripeCheckout = async e => {
    e.preventDefault()

    logClick(supportPlan.title)

    const plan = isDev ? supportPlan.stripe_dev : supportPlan.stripe_prod
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
      .then(function (result) {
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer.
          console.error(result.error)
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
            isAuthenticated
              ? handleStripeCheckout
              : () => loginWithRedirect({ redirect_uri: window.location.href })
          }
        >
          Subscribe for {supportPlan.title}
        </button>

        <PayPalComponent supportPlan={supportPlan} />
      </div>
    </div>
  )
}

const PayPalComponent = (props: { supportPlan: ISubscriptionPlan }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => {
    setModalIsOpen(false)
  }

  const { paypal_dev, paypal_prod } = props.supportPlan

  return (
    <div className="col mt-2">
      <PayPalButton planId={isDev ? paypal_dev : paypal_prod} onSuccess={openModal} />
      {modalIsOpen && <PaypalPostSubscribeModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </div>
  )
}

const stripePromise = loadStripe(STRIPE_KEY)

export const PricingPlans = () => {
  return (
    <Elements stripe={stripePromise}>
      <PricingPlansComponent />
    </Elements>
  )
}
