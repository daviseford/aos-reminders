import React from 'react'
import ReactDOM from 'react-dom'

declare global {
  interface Window {
    paypal: any
  }
}

export interface PayPalButtonProps {
  amount: number | string
  shippingPreference: 'NO_SHIPPING' | 'GET_FROM_FILE' | 'SET_PROVIDED_ADDRESS'
  onSuccess?: (...args: any[]) => any
  catchError?: (...args: any[]) => any
  onError?: (...args: any[]) => any
  createOrder?: (...args: any[]) => any
  createSubscription?: (...args: any[]) => any
  onApprove?: (...args: any[]) => any
  style?: Record<string, string>
  onButtonReady?: (...args: any[]) => any
}

export interface IPayPalButtonState {
  isSdkReady: boolean
}

export interface IPaypalOptions {
  'client-id': string
  'merchant-id'?: string
  currency?: number | string
  debug?: boolean | string
}

class PayPalButton extends React.Component<PayPalButtonProps, IPayPalButtonState> {
  private readonly _options: IPaypalOptions = {
    'client-id': 'AUdnPSV280IH8pjveo62IzfQJgfFo0MoJ9w-zouTipgjAethtmcvHFjV8DXCCqoti4WHdbjhMNnwn9oa',
    currency: 'USD',
  }

  constructor(props: PayPalButtonProps) {
    super(props)

    this.state = {
      isSdkReady: false,
    }
  }

  componentDidMount = () => {
    if (typeof window !== 'undefined' && window !== undefined && window.paypal === undefined) {
      this.addPaypalSdk()
    } else if (
      typeof window !== 'undefined' &&
      window !== undefined &&
      window.paypal !== undefined &&
      this.props.onButtonReady
    ) {
      this.props.onButtonReady()
    }
  }

  public readonly createOrder = (data: any, actions: any) => {
    console.log('the data is: ', data)
    const { amount = 1, shippingPreference } = this.props

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: this._options.currency,
            value: amount.toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: shippingPreference,
      },
    })
  }

  public readonly onApprove = (data: any, actions: any) => {
    console.log(data, actions, typeof data, typeof actions)
    return actions.order
      .capture()
      .then(details => {
        if (this.props.onSuccess) {
          return this.props.onSuccess(details, data)
        }
      })
      .catch(err => {
        if (this.props.catchError) {
          return this.props.catchError(err)
        }
      })
  }

  render() {
    const { amount, onSuccess, createOrder, createSubscription, onApprove, style } = this.props
    const { isSdkReady } = this.state

    if (!isSdkReady && (typeof window === 'undefined' || window.paypal === undefined)) {
      return <></>
    }

    const Button = window.paypal.Buttons.driver('react', {
      React,
      ReactDOM,
    })

    const createOrderFn =
      amount && !createOrder
        ? (data: any, actions: any) => this.createOrder(data, actions)
        : (data: any, actions: any) => (createOrder as Function)(data, actions)

    return (
      <Button
        {...this.props}
        createOrder={createSubscription ? undefined : createOrderFn}
        createSubscription={createSubscription}
        onApprove={
          onSuccess
            ? (data: any, actions: any) => this.onApprove(data, actions)
            : (data: any, actions: any) => (onApprove as Function)(data, actions)
        }
        style={style}
      />
    )
  }

  private addPaypalSdk = () => {
    const { onButtonReady } = this.props

    const queryParams: string[] = []

    // replacing camelCase with dashes
    Object.keys(this._options).forEach(k => {
      const name = k
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase()
      queryParams.push(`${name}=${this._options[k]}`)
    })

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?${queryParams.join('&')}`
    script.async = true
    script.onload = () => {
      this.setState({ isSdkReady: true })

      if (onButtonReady) {
        onButtonReady()
      }
    }
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded.')
    }

    document.body.appendChild(script)
  }
}

export { PayPalButton }
