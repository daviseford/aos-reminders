import { usePaypal } from 'context/usePaypal'
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

const PaypalButton2: React.FC<PayPalButtonProps> = props => {
  const { paypalIsReady } = usePaypal()

  if (!paypalIsReady && (typeof window === 'undefined' || window.paypal === undefined)) {
    return <></>
  }

  const _createOrder = (data: any, actions: any) => {
    console.log('the data is: ', data)
    const { amount, shippingPreference } = props

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString(),
          },
        },
      ],
      application_context: {
        shipping_preference: shippingPreference,
      },
    })
  }

  const _onApprove = (data: any, actions: any) => {
    console.log(data, actions, typeof data, typeof actions)
    return actions.order
      .capture()
      .then(details => {
        if (props.onSuccess) {
          return props.onSuccess(details, data)
        }
      })
      .catch(err => {
        if (props.catchError) {
          return props.catchError(err)
        }
      })
  }

  const {
    onSuccess,
    createOrder = _createOrder,
    createSubscription,
    onApprove = _onApprove,
    style = {},
  } = props

  const Button = window.paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  const createOrderFn = (data: any, actions: any) => {
    console.log('createOrderFn', data, actions)
    createOrder(data, actions)
  }

  return (
    <Button
      {...props}
      createOrder={createSubscription ? undefined : createOrderFn}
      createSubscription={createSubscription}
      onApprove={
        onSuccess
          ? (data: any, actions: any) => _onApprove(data, actions)
          : (data: any, actions: any) => onApprove(data, actions)
      }
      style={style}
    />
  )
}

export default PaypalButton2
