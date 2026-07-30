import { useAuth0 } from '@auth0/auth0-react'
import { IApprovalResponse, ICreateSubscriptionsActions } from 'components/payment/paypal/paypalTypes'
import { usePaypal } from 'context/usePaypal'
import React, { useEffect, useRef } from 'react'
import useLogin from 'utils/hooks/useLogin'

interface IStyle {
  layout?: 'vertical' | 'horizontal'
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
  shape?: 'pill' | 'rect'
  label?: 'paypal'
  tagline?: boolean
}

interface IPaypalButtonsOptions {
  style?: IStyle
  createSubscription?: (data: unknown, actions: ICreateSubscriptionsActions) => Promise<string>
  onApprove?: (data: IApprovalResponse) => unknown
  onCancel?: (data: unknown) => unknown
  onClick?: () => unknown
}

interface IPaypalButtonsInstance {
  render: (container: HTMLElement) => Promise<void>
  close: () => Promise<void>
  isEligible?: () => boolean
}

declare global {
  interface Window {
    paypal: {
      Buttons: (options: IPaypalButtonsOptions) => IPaypalButtonsInstance
    }
  }
}

interface IPayPalButtonProps {
  planId: string
  planTitle: string
  onClick?: () => unknown
  onSuccess?: (data: IApprovalResponse) => unknown
  onCancel?: (data: unknown) => unknown
  style?: IStyle
}

const DEFAULT_STYLE: IStyle = {
  layout: 'vertical',
  color: 'gold',
  shape: 'rect',
  label: 'paypal',
  tagline: false,
}

/**
 * The PayPal subscription button.
 *
 * This drives the PayPal SDK imperatively — `Buttons({...}).render(el)` — rather than through
 * `Buttons.driver('react', { React, ReactDOM })`. The driver is zoid's legacy React adapter, and its
 * `componentDidMount` calls `ReactDOM.findDOMNode(this)`, which React 19 removed; on React 19 the
 * button throws before it ever paints. The imperative API is the same SDK doing the same work, and
 * it needs nothing from `react-dom` at all.
 *
 * The button renders into a container div and is torn down on unmount. Callbacks are read through a
 * ref so an ordinary re-render does not close and rebuild the PayPal iframe — only a change of plan,
 * sign-in state, account e-mail, or style does.
 */
const PaypalButton = (props: IPayPalButtonProps) => {
  const { user, isAuthenticated } = useAuth0()
  const { login } = useLogin({ origin: props.planTitle })
  const { paypalIsReady } = usePaypal()
  const { onClick, onSuccess, onCancel, planId, style } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const handlersRef = useRef({ onClick, onSuccess, onCancel, login })
  const email = user?.email

  // Keep the latest callbacks reachable without making them effect dependencies.
  useEffect(() => {
    handlersRef.current = { onClick, onSuccess, onCancel, login }
  })

  // Serialised so a fresh style object literal on every render does not re-mount the button.
  const styleKey = JSON.stringify(style ?? {})

  useEffect(() => {
    if (!paypalIsReady || typeof window === 'undefined' || window.paypal === undefined) return
    if (!email) return

    const container = containerRef.current
    if (!container) return

    let cancelled = false

    const buttons = window.paypal.Buttons({
      style: { ...DEFAULT_STYLE, ...(JSON.parse(styleKey) as IStyle) },
      createSubscription: isAuthenticated
        ? (_data: unknown, actions: ICreateSubscriptionsActions) =>
            actions.subscription.create({
              plan_id: planId,
              subscriber: { email_address: email },
            })
        : undefined,
      onApprove: (data: IApprovalResponse) => handlersRef.current.onSuccess?.(data),
      onCancel: (data: unknown) => handlersRef.current.onCancel?.(data),
      onClick: () =>
        isAuthenticated ? handlersRef.current.onClick?.() : handlersRef.current.login(),
    })

    if (buttons.isEligible && !buttons.isEligible()) return

    void buttons.render(container).catch((error: unknown) => {
      // A rejection after teardown just means the container went away first.
      if (!cancelled) console.error('Unable to render the PayPal button.', error)
    })

    return () => {
      cancelled = true
      void buttons.close().catch(() => undefined)
    }
  }, [paypalIsReady, isAuthenticated, planId, email, styleKey])

  return <div ref={containerRef} />
}

export default PaypalButton
