import { useAuth0 } from '@auth0/auth0-react'
import { usePaypal } from 'context/usePaypal'
import React from 'react'
import ReactDOM from 'react-dom'
import openPopup from 'utils/openPopup'
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

interface IPayPalButtonProps {
  planId: string
  onSuccess?: (data: IApprovalResponse) => any
  onCancel?: (data: any) => any
  style?: IStyle
}

const PaypalButton: React.FC<IPayPalButtonProps> = props => {
  const { user, isAuthenticated, loginWithPopup } = useAuth0()
  const { paypalIsReady } = usePaypal()

  const { onSuccess = undefined, onCancel = undefined, planId, style = {} } = props

  if (!paypalIsReady || typeof window === 'undefined' || window.paypal === undefined) {
    return <></>
  }

  const _onApprove = (data: IApprovalResponse, actions: IApprovalActions) => {
    if (onSuccess) onSuccess(data)
  }

  const _createSubscription = async (data, actions: ICreateSubscriptionsActions) => {
    return actions.subscription.create({
      plan_id: planId,
      subscriber: {
        email_address: user.email,
      },
    })
  }

  const btnStyle: IStyle = {
    layout: 'vertical',
    color: 'gold',
    shape: 'rect',
    label: 'paypal',
    tagline: false,
    ...(style || {}),
  }

  const Button = window.paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  const handleLogin = () => {
    const popup = openPopup()
    loginWithPopup({ redirect_uri: window.location.href }, { popup })
  }

  return (
    <Button
      {...props}
      createSubscription={!isAuthenticated ? undefined : _createSubscription}
      onApprove={(data: IApprovalResponse, actions: IApprovalActions) => _onApprove(data, actions)}
      style={btnStyle}
      onClick={isAuthenticated ? undefined : handleLogin}
      onCancel={onCancel}
    />
  )
}

export default PaypalButton
