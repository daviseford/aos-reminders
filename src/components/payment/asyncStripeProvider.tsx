import React, { useState, useEffect, useRef } from 'react'
import { StripeProvider } from 'react-stripe-elements'

interface IProps {
  apiKey: string
}

interface IState {
  stripe: null | any
}

export default class AsyncStripeProvider extends React.Component<IProps, IState> {
  _mounted: boolean = false

  // constructor
  constructor(props) {
    super(props)
    this.state = {
      stripe: null,
    }
  }

  // life-cycle
  componentDidMount() {
    this._mounted = true
    const { apiKey } = this.props

    const stripeJs = document.createElement('script')
    stripeJs.src = 'https://js.stripe.com/v3/'
    stripeJs.async = true
    stripeJs.onload = () => {
      if (this._mounted) {
        this.setState({
          stripe: window.Stripe(apiKey),
        })
      }
    }
    document.body && document.body.appendChild(stripeJs)
  }

  componentWillUnmount() {
    this._mounted = false
  }

  // render
  render() {
    const { stripe } = this.state

    return (
      <StripeProvider stripe={stripe}>
        <>{this.props.children}</>
      </StripeProvider>
    )
  }
}

type TProvider = React.FC<{ apiKey: string }>

const AsyncStripeProviderFC: TProvider = props => {
  const { apiKey, children } = props
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    // Create the script element
    const stripeJs = document.createElement('script')
    stripeJs.src = 'https://js.stripe.com/v3/'
    stripeJs.async = true
    // Tell our component what to do once the script has loaded
    stripeJs.onload = () => {
      // Only update Stripe if this component is still mounted
      if (isMounted) setStripe(window.Stripe(apiKey))
    }

    // Add the script to the document
    document.body && document.body.appendChild(stripeJs)

    return () => {
      isMounted.current = false
    }
  }, [stripe])

  return (
    <StripeProvider stripe={stripe}>
      <>{children}</>
    </StripeProvider>
  )
}
