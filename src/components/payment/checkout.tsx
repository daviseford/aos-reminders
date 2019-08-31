import React from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import { useAuth0 } from 'react-auth0-wrapper'
import { IUser } from 'types/user'
import { connect } from 'react-redux'
import { subscription } from 'ducks'
import { IStore } from 'types/store'
import { isDev } from 'utils/env'

interface ICheckoutProps {
  isSubscribed: boolean
  stripe: any
}

const CheckoutComponent: React.FC<ICheckoutProps> = props => {
  const { stripe, isSubscribed } = props
  const { user }: { user: IUser } = useAuth0()

  // TODO add a message like "Login first"
  if (!user) return null
  // TODO Flesh this out top be nicer
  if (isSubscribed) return <div>You are already a supporter :)</div>

  console.log('user for checkout', user)

  // When the customer clicks on the button, redirect them to Checkout.
  const handleSubmit = async e => {
    e.preventDefault()

    if (isDev) console.log('DEV Checkout')

    const plan = isDev ? 'plan_Fi2fEmmQwMgSGR' : 'plan_Fi2OZlDqziP4bY'
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    stripe
      .redirectToCheckout({
        items: [{ plan, quantity: 1 }],

        // Meta
        customerEmail: user.email, // Used to prefill checkout
        clientReferenceId: user.email, // Included in the checkout.session.completed webhook

        // Redirect after checkout
        successUrl: `${window.location.protocol}//${url}/`,
        cancelUrl: `${window.location.protocol}//${url}/`,
      })
      .then(function(result) {
        console.log(result)
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
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <button onClick={handleSubmit}>Buy</button>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  isSubscribed: subscription.selectors.isSubscribed(state),
})

const InjectedCheckout = connect(
  mapStateToProps,
  null
)(injectStripe(CheckoutComponent))

export const Checkout = () => {
  return (
    <Elements>
      <InjectedCheckout />
    </Elements>
  )
}
