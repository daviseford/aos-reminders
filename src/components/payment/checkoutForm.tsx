import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

class CheckoutFormComponent extends Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  async submit(e) {
    // User clicked submit
  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    )
  }
}

export const Class_CheckoutForm = injectStripe(CheckoutFormComponent)

const FC_CheckoutFormComponent = props => {
  const handleSubmit = async e => {
    // User clicked submit
  }

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      <button onClick={handleSubmit}>Send</button>
    </div>
  )
}

export const FC_CheckoutForm = injectStripe(FC_CheckoutFormComponent)
