import { usePaypal } from 'context/usePaypal'
import React from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import ReactDOM from 'react-dom'
import { IUseAuth0 } from 'types/auth0'
import { IApprovalActions, IApprovalResponse, ICreateSubscriptionsActions } from './paypalTypes'

declare global {
  interface Window {
    paypal: any
  }
}

interface IStyle {
  layout?: 'vertical' | 'horizontal'
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
  shape?: 'pill' | 'rect'
  label?: 'paypal'
  tagline?: boolean
}

export interface PayPalButtonProps {
  planId: string
  onSuccess?: (data: IApprovalResponse) => any
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

const PaypalButton: React.FC<PayPalButtonProps> = props => {
  const { user, isAuthenticated, loginWithRedirect }: IUseAuth0 = useAuth0()
  const { paypalIsReady } = usePaypal()

  if (!paypalIsReady || typeof window === 'undefined' || window.paypal === undefined) {
    return <></>
  }

  const _onApprove = (data: IApprovalResponse, actions: IApprovalActions) => {
    console.log('_onApprove', data, actions)
    if (props.onSuccess) props.onSuccess(data)
  }

  const _createSubscription = async (data, actions: ICreateSubscriptionsActions) => {
    console.log('_createSubscription', data, actions)
    return actions.subscription.create({
      plan_id: props.planId,
      subscriber: {
        email_address: user.email,
      },
    })
  }

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

  return (
    <Button
      {...props}
      createSubscription={!isAuthenticated ? undefined : _createSubscription}
      onApprove={(data: IApprovalResponse, actions: IApprovalActions) => _onApprove(data, actions)}
      style={style}
      onClick={isAuthenticated ? undefined : () => loginWithRedirect({ redirect_uri: window.location.href })}
    />
  )
}

export default PaypalButton
