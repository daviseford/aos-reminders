import { useAuth0 } from '@auth0/auth0-react'
import {
  IApprovalActions,
  IApprovalResponse,
  ICreateSubscriptionsActions,
} from 'components/payment/paypal/paypalTypes'
import { usePaypal } from 'context/usePaypal'
import React from 'react'
import ReactDOM from 'react-dom'
import useLogin from 'utils/hooks/useLogin'

declare global {
  interface Window {
    paypal: unknown
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

  const { onSuccess = undefined, onCancel = undefined, planId, style = {} } = props

  if (!paypalIsReady || typeof window === 'undefined' || window.paypal === undefined || !user) {
    return <></>
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _onApprove = (data: IApprovalResponse, _actions: IApprovalActions) => {
    if (onSuccess) onSuccess(data)
  }

  const _createSubscription = async (_data: unknown, actions: ICreateSubscriptionsActions) => {
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

  // @ts-expect-error It's there
  const Button = window.paypal.Buttons.driver('react', {
    React,
    ReactDOM,
  })

  return (
    <Button
      {...props}
      createSubscription={!isAuthenticated ? undefined : _createSubscription}
      onApprove={(data: IApprovalResponse, actions: IApprovalActions) => _onApprove(data, actions)}
      style={btnStyle}
      onClick={isAuthenticated ? undefined : login}
      onCancel={onCancel}
    />
  )
}

export default PaypalButton
