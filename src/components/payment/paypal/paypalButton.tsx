import { useAuth0 } from '@auth0/auth0-react'
import { IApprovalResponse, ICreateSubscriptionsActions } from 'components/payment/paypal/paypalTypes'
import { usePaypal } from 'context/usePaypal'
import React from 'react'
import ReactDOM from 'react-dom'
import useLogin from 'utils/hooks/useLogin'

declare global {
  interface Window {
    paypal: {
      Buttons: {
        driver: (
          framework: string,
          integrations: { React: typeof React; ReactDOM: typeof ReactDOM }
        ) => React.ComponentType<Record<string, unknown>>
      }
    }
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
  planTitle: string
  onSuccess?: (data: IApprovalResponse) => unknown
  onCancel?: (data: unknown) => unknown
  style?: IStyle
}

const PaypalButton = (props: IPayPalButtonProps) => {
  const { user, isAuthenticated } = useAuth0()
  const { login } = useLogin({ origin: props.planTitle })
  const { paypalIsReady } = usePaypal()
  const { onSuccess, onCancel, planId, style = {} } = props

  if (!paypalIsReady || typeof window === 'undefined' || window.paypal === undefined || !user) {
    return null
  }

  const onApprove = (data: IApprovalResponse) => {
    if (onSuccess) onSuccess(data)
  }

  const createSubscription = async (_data: unknown, actions: ICreateSubscriptionsActions) =>
    actions.subscription.create({
      plan_id: planId,
      subscriber: {
        email_address: user.email,
      },
    })

  const btnStyle: IStyle = {
    layout: 'vertical',
    color: 'gold',
    shape: 'rect',
    label: 'paypal',
    tagline: false,
    ...style,
  }

  const Button = window.paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  return (
    <Button
      {...props}
      createSubscription={!isAuthenticated ? undefined : createSubscription}
      onApprove={onApprove}
      style={btnStyle}
      onClick={isAuthenticated ? undefined : login}
      onCancel={onCancel}
    />
  )
}

export default PaypalButton
