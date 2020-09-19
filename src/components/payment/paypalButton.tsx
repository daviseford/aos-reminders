import { usePaypal } from 'context/usePaypal'
import React from 'react'
import ReactDOM from 'react-dom'

declare global {
  interface Window {
    paypal: any
  }
}

type TCreateOrderFn = (data: any, actions: ICreateOrderActions) => Promise<string>

interface IApprovalResponse {
  orderID: string // '9FP07990454230111'
  payerID: string // 'HNDNEBJEB3R5W'
  paymentID: null
  billingToken: null
  facilitatorAccessToken: string // 'A21AALg_ydToXtGEeOFjeJYy0OzSz5dNCP6hUoqglqpqXQBjYAsd39KOisJczsAuk_qgRdoyLpkJ09kUpmhLFQF0m8zu4VQfA'
}

interface IStyle {
  layout?: 'vertical' | 'horizontal'
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
  shape?: 'pill' | 'rect'
  label?: 'paypal'
  tagline?: boolean
}

interface ICreateOrderActions {
  payment: null
  order: { create: (...args: any[]) => Promise<string> }
}
interface IApprovalActions {
  order: {
    authorize: (...args: any[]) => any
    capture: (...args: any[]) => any
    get: (...args: any[]) => any
    patch: (...args: any[]) => any
  }
  payment: null
  redirect?: (...args: any[]) => any
  restart?: (...args: any[]) => any
  subscription: { get: (...args: any[]) => any; activate: (...args: any[]) => any }
}

export interface PayPalButtonProps {
  amount: string
  catchError?: (...args: any[]) => any
  createOrder?: TCreateOrderFn
  createSubscription?: (...args: any[]) => any
  onApprove?: (...args: any[]) => any
  onButtonReady?: (...args: any[]) => any
  onError?: (...args: any[]) => any
  onSuccess?: (...args: any[]) => any
  shippingPreference: 'NO_SHIPPING' | 'GET_FROM_FILE' | 'SET_PROVIDED_ADDRESS'
  style?: IStyle
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

  const _createOrder: TCreateOrderFn = async (data, actions) => {
    console.log('the data in _createOrder is: ', data, actions)
    const { amount, shippingPreference } = props

    // This function sets up the details of the transaction, including the amount and line item details.
    const orderId: string = await actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
      application_context: {
        shipping_preference: shippingPreference,
      },
    })

    return orderId
  }

  const _onApprove = (data: IApprovalResponse, actions: IApprovalActions) => {
    console.log('onApprove', data, actions)
    return actions.order
      .capture()
      .then(details => {
        if (props.onSuccess) props.onSuccess(details, data)
      })
      .catch(err => {
        if (props.catchError) return props.catchError(err)
      })
  }

  const { onSuccess, createOrder = _createOrder, createSubscription, onApprove = _onApprove } = props

  const style: IStyle = {
    layout: 'vertical',
    color: 'gold',
    shape: 'pill',
    label: 'paypal',
    tagline: false,
    ...(props.style || {}),
  }

  const Button = window.paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  const createOrderFn = (data: any, actions: ICreateOrderActions) => createOrder(data, actions)

  return (
    <Button
      {...props}
      createOrder={createSubscription ? undefined : createOrderFn}
      createSubscription={createSubscription}
      onApprove={
        onSuccess
          ? (data: IApprovalResponse, actions: IApprovalActions) => _onApprove(data, actions)
          : (data: IApprovalResponse, actions: IApprovalActions) => onApprove(data, actions)
      }
      style={style}
    />
  )
}

export default PaypalButton2
