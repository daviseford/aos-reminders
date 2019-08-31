import React from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import { useAuth0 } from 'react-auth0-wrapper'
import { IUser } from 'types/user'

const isDev = process.env.REACT_APP_AOS_ENV === 'dev'

const CheckoutComponent = props => {
  const { user }: { user: IUser } = useAuth0()
  console.log(user)

  const handleSubmit = async e => {
    // When the customer clicks on the button, redirect
    // them to Checkout.

    if (isDev) console.log('Redirecting to DEV Checkout')

    const plan = isDev ? 'plan_Fi2fEmmQwMgSGR' : 'plan_Fi2OZlDqziP4bY'
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    props.stripe
      .redirectToCheckout({
        items: [{ plan, quantity: 1 }],

        // Meta
        customerEmail: user.email, // Used to prefill checkout
        clientReferenceId: user.email, // Included in the checkout.session.completed webhook

        // Do not rely on the redirect to the successUrl for fulfilling
        // purchases, customers may not always reach the success_url after
        // a successful payment.
        // Instead use one of the strategies described in
        // https://stripe.com/docs/payments/checkout/fulfillment
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

const CheckoutThing = injectStripe(CheckoutComponent)

export const Checkout = () => {
  return (
    <Elements>
      <CheckoutThing />
    </Elements>
  )
}
