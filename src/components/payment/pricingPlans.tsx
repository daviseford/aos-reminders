import { useAuth0 } from '@auth0/auth0-react'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import GenericButton from 'components/input/generic_button'
import { PaypalPostSubscribeModal } from 'components/modals/paypal_post_subscribe_modal'
import PayPalButton from 'components/payment/paypal/paypalButton'
import { PaypalProvider } from 'context/usePaypal'
import qs from 'qs'
import React, { useState } from 'react'
import { IconContext } from 'react-icons'
import { logClick, logEvent, logSubscription } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'
import { ISubscriptionPlan, SubscriptionPlans } from 'utils/plans'
import { SubscriptionApi } from '../../api/subscriptionApi'

const PricingPlansComponent = () => {
  const [paypalModalIsOpen, setPaypalModalIsOpen] = useState(false)

  return (
    <PaypalProvider>
      <div className="container">
        <PlansHeader />
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 justify-content-center text-center">
          {SubscriptionPlans.map(plan => (
            <PlanComponent
              supportPlan={plan}
              paypalModalIsOpen={paypalModalIsOpen}
              setPaypalModalIsOpen={setPaypalModalIsOpen}
              key={plan.title}
            />
          ))}
        </div>
        <div className="row text-center justify-content-center">
          <div className="col-12 col-sm-10 col-md-10 col-xl-8 col-xxl-6">
            <small>
              <em>
                AoS Reminders does not store your credit card information.
                <br />
                Subscriptions are managed by Stripe and PayPal. They can be canceled at any time.
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
  const hasSale = SubscriptionPlans.some(plan => plan.sale)

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
  supportPlan: ISubscriptionPlan
  paypalModalIsOpen: boolean
  setPaypalModalIsOpen: (isOpen: boolean) => void
}

export const PlanComponent = (props: IPlanProps) => {
  const { supportPlan } = props
  const { user, isAuthenticated } = useAuth0()
  const { login } = useLogin({ origin: supportPlan.title })
  const stripe = useStripe()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  if (!stripe) return null

  const handleStripeCheckout = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (!user) return

    logClick(supportPlan.title)
    const plan = isDev ? supportPlan.stripe_dev : supportPlan.stripe_prod
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      const result = await stripe.redirectToCheckout({
        items: [{ plan, quantity: 1 }],
        customerEmail: user.email,
        clientReferenceId: user.email,
        successUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          subscribed: true,
          plan: supportPlan.title,
        })}`,
        cancelUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          canceled: true,
          plan: supportPlan.title,
        })}`,
      })

      if (result.error) {
        setCheckoutError(result.error.message || 'Unable to start checkout. Please try again.')
      }
    } catch {
      setCheckoutError('Unable to start checkout. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-themeDarkBluePrimary text-light">
        <h3 className="my-0 font-weight-normal">{supportPlan.title}</h3>
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
        <div className="mx-3">
          <IconContext.Provider value={{ size: '1.2em' }}>
            <GenericButton
              type="button"
              className="btn btn btn-block btn-primary btn-pill py-2"
              disabled={checkoutLoading}
              onClick={isAuthenticated ? handleStripeCheckout : login}
            >
              {checkoutLoading ? 'Opening checkout...' : `Subscribe for ${supportPlan.title}`}
            </GenericButton>
          </IconContext.Provider>
        </div>
        {checkoutError && (
          <div className="alert alert-danger mx-3 mt-3 mb-0" role="alert">
            {checkoutError}
          </div>
        )}
        <PayPalComponent {...props} />
      </div>
    </div>
  )
}

const PayPalComponent = (props: IPlanProps) => {
  const { user } = useAuth0()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { paypal_dev, paypal_prod, title } = props.supportPlan

  const handleSuccess = async () => {
    setModalIsOpen(true)
    props.setPaypalModalIsOpen(true)
    logEvent(`Checkout-Subscribed-${title}`)
    logSubscription(title, 'paypal')

    try {
      if (user?.email) await SubscriptionApi.requestGrant(user.email)
    } catch {
      // The post-subscribe modal polls until PayPal confirmation is available.
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
    props.setPaypalModalIsOpen(false)
  }

  return (
    <div className="col mt-2">
      {!props.paypalModalIsOpen && (
        <PayPalButton
          onCancel={() => logEvent(`Checkout-Canceled-${title}`)}
          onSuccess={handleSuccess}
          planId={isDev ? paypal_dev : paypal_prod}
          planTitle={title}
        />
      )}
      {modalIsOpen && <PaypalPostSubscribeModal modalIsOpen={modalIsOpen} closeModal={closeModal} />}
    </div>
  )
}

const stripePromise = loadStripe(STRIPE_KEY)

export const PricingPlans = () => (
  <Elements stripe={stripePromise}>
    <PricingPlansComponent />
  </Elements>
)
