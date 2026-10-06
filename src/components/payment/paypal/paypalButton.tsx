import { useAuth0 } from '@auth0/auth0-react'
import { IApprovalResponse, ICreateSubscriptionsActions } from 'components/payment/paypal/paypalTypes'
import { usePaypal } from 'context/usePaypal'
import React, { useEffect, useRef } from 'react'
import useLogin from 'utils/hooks/useLogin'

interface IStyle {
  layout?: 'vertical' | 'horizontal'
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
  shape?: 'pill' | 'rect'
  /** PayPal accepts 25-55. Anything outside that range is rejected and the button fails to render. */
  height?: number
  label?: 'paypal'
  tagline?: boolean
}

interface IPaypalButtonsOptions {
  style?: IStyle
  createSubscription?: (data: unknown, actions: ICreateSubscriptionsActions) => Promise<string>
  onApprove?: (data: IApprovalResponse) => unknown
  onCancel?: (data: unknown) => unknown
  onClick?: () => unknown
  onError?: (error: unknown) => unknown
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
  /** The SDK reported an error inside its checkout. The error itself is never passed on. */
  onError?: () => unknown
  /** The button could not be rendered, so this plan has no PayPal rail. */
  onRenderError?: () => unknown
  style?: IStyle
}

/*
 * height: 44 is load-bearing. Left unset, PayPal sizes the button itself — it came out at 35px, so
 * beside the 44px Stripe button the pair sat at two different heights with a 9px gap under PayPal.
 * 44 is also the touch target DESIGN.md sets, and it is inside PayPal's own 25-55 range.
 */
const DEFAULT_STYLE: IStyle = {
  layout: 'vertical',
  color: 'gold',
  shape: 'rect',
  height: 44,
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
  const { onClick, onSuccess, onCancel, onError, onRenderError, planId, style } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const handlersRef = useRef({ onClick, onSuccess, onCancel, onError, onRenderError, login })
  const email = user?.email

  // Keep the latest callbacks reachable without making them effect dependencies.
  useEffect(() => {
    handlersRef.current = { onClick, onSuccess, onCancel, onError, onRenderError, login }
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
      onClick: () => (isAuthenticated ? handlersRef.current.onClick?.() : handlersRef.current.login()),
      /*
       * Cancelling is onCancel, never this. The handler adds nothing to the page; it reports the
       * stage and keeps the error itself in the console, where it went before there was a handler.
       */
      onError: (error: unknown) => {
        console.error('The PayPal checkout reported an error.', error)
        handlersRef.current.onError?.()
      },
    })

    if (buttons.isEligible && !buttons.isEligible()) return

    void buttons.render(container).catch((error: unknown) => {
      // A rejection after teardown just means the container went away first.
      if (cancelled) return
      console.error('Unable to render the PayPal button.', error)
      handlersRef.current.onRenderError?.()
    })

    return () => {
      cancelled = true
      void buttons.close().catch(() => undefined)
    }
  }, [paypalIsReady, isAuthenticated, planId, email, styleKey])

  return <div ref={containerRef} />
}

export default PaypalButton
