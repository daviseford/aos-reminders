import { useAuth0 } from '@auth0/auth0-react'

import GenericButton from 'components/input/generic_button'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { capitalize } from 'lodash'
import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaCheck, FaGift, FaRegSmileBeam } from 'react-icons/fa'
import { centerContentClass } from 'theme/helperClasses'
import { IGiftSubscription } from 'types/subscription'
import { logBeginCheckout, logClick } from 'utils/analytics'
import { useApiAccessToken } from 'utils/authToken'
import useLogin from 'utils/hooks/useLogin'
import useWindowSize from 'utils/hooks/useWindowSize'
import {
  GiftedSubscriptionPlans,
  IGiftedSubscriptionPlans,
  MAX_GIFT_QUANTITY,
  toGiftSubscriptionAnalyticsItem,
} from 'utils/plans'
import { SubscriptionApi } from '../../api/subscriptionApi'

const COL_SIZE = 'col-12 col-sm-12 col-md-10 col-xl-8 col-xxl-6'
export const GiftSubscriptions = () => {
  const { isActive } = useSubscription()
  if (!isActive) return null

  return (
    <div className="container">
      <GiftTable />
      <PlansHeader />
      <PurchaseTable />
    </div>
  )
}

const GiftTable = () => {
  const { theme, isDark } = useTheme()
  const { subscription } = useSubscription()
  const { isMobile } = useWindowSize()
  const { giftSubscriptions = [] } = subscription
  if (giftSubscriptions.length === 0) return null

  const purchasedSubs = giftSubscriptions.filter(gift => gift.origin === 'stripe')
  const adminCreatedSubs = giftSubscriptions.filter(gift => gift.origin !== 'stripe')
  const rowClass = `row d-flex justify-content-center text-center ${theme.text} mx-1`

  return (
    <div className={`row d-flex justify-content-center pb-5 ${theme.text}`}>
      <div className={`${COL_SIZE} border border-${isDark ? 'dark' : 'light-gray'} rounded py-3`}>
        <div className={rowClass}>
          <div className="col-12">
            {/* Sits directly under the page <h1> like the profile cards do; .h4 keeps the size. */}
            <h2 className="h4">Your Gift Subscriptions</h2>
          </div>
          <div className="col-12">
            <p>Click to copy a one-time-use link and send it to your friend.</p>
          </div>
        </div>
        {purchasedSubs.length > 0 && (
          <div className={rowClass}>
            {/* px-0 w-auto flex-shrink-1: non-column child of a .row — see navbar_wrapper. */}
            <div className={`${theme.text} px-0 w-auto flex-shrink-1`}>
              {purchasedSubs.map(gift => (
                <GiftButton {...gift} key={gift.id} />
              ))}
            </div>
          </div>
        )}
        {purchasedSubs.length > 0 && adminCreatedSubs.length > 0 && <hr />}
        {adminCreatedSubs.length > 0 && (
          <>
            <div className={rowClass}>
              {/* px-0 w-auto flex-shrink-1: non-column child of a .row — see navbar_wrapper. */}
              <p className={`mb-1 ${theme.text} ${centerContentClass} px-0 w-auto flex-shrink-1`}>
                These gifts were given to you by the AoS Reminders team. Spread them around!
                {!isMobile && <FaRegSmileBeam className="ms-2" />}
              </p>
            </div>
            <div className={rowClass}>
              {adminCreatedSubs.map(gift => (
                <GiftButton {...gift} key={gift.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const GiftButton = (props: IGiftSubscription) => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()
  const [copied, setCopied] = useState(false)
  const label = `${props.planIntervalCount} ${capitalize(props.planInterval)}${
    props.planIntervalCount > 1 ? 's' : ''
  }`

  const handleCopy = () => {
    logClick(`Copy-Gift-URL-${label}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <CopyToClipboard onCopy={handleCopy} text={props.url}>
      {/*
        w-auto flex-shrink-1 (but not px-0): these buttons are rendered straight into a .row in the
        admin-gift list, and Bootstrap 5's `.row > *` would stretch each one to full width. The
        padding needs no fix — `.btn` is declared after `.row > *` in Bootstrap's own source, so the
        button's padding already wins.
      */}
      <GenericButton className={`${theme.genericButton} mx-2 my-2 w-auto flex-shrink-1`}>
        <FaGift className="me-2" aria-hidden="true" />
        <strong className="me-1">{label}</strong>
        {!isMobile && ' Gift'}
        {copied && <FaCheck className="text-success ms-2" aria-hidden="true" />}
        {/*
         * The tick was the only confirmation that the link reached the clipboard, and an icon
         * announces nothing. A permanently-present live region reports the change instead.
         */}
        <span className="visually-hidden" role="status">
          {copied ? 'Link copied' : ''}
        </span>
      </GenericButton>
    </CopyToClipboard>
  )
}

const PurchaseTable = () => {
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  return (
    <div className="row d-flex justify-content-center">
      <div className={COL_SIZE}>
        <table className={`table ${theme.purchaseTable} ${isMobile ? 'table-sm' : ''}`}>
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">{isMobile ? '#' : 'Quantity'}</th>
              <th scope="col">Cost</th>
              <th scope="col">
                <span className="visually-hidden">Purchase</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {GiftedSubscriptionPlans.map(plan => (
              <PlanComponent supportPlan={plan} key={plan.title} />
            ))}
          </tbody>
        </table>
        <div className={`row text-center justify-content-center ${theme.text} pb-5`}>
          <div className="col">
            <small>
              <em>
                Gifted subscriptions are <strong>not</strong> recurring charges. You only pay for the initial
                subscription period.
                <br />
                You will receive an activation link that you can send to anyone. They will set up their
                account using that link.
              </em>
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

const PlansHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`col-12 text-center mb-3 ${theme.text}`}>
      <h2 className="h4">Gift a Subscription!</h2>
    </div>
  )
}

const PlanComponent = ({ supportPlan }: { supportPlan: IGiftedSubscriptionPlans }) => {
  const origin = `${supportPlan.title}-GiftedSubscription`
  const { user, isAuthenticated } = useAuth0()
  const { login } = useLogin({ origin })
  const { theme } = useTheme()
  const getAccessToken = useApiAccessToken()
  const { isMobile } = useWindowSize()
  const [quantity, setQuantity] = useState(1)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  if (!user) return null

  /*
   * parseInt('') is NaN, which priced the row "$NaN" and — because the checkout guard only compared
   * against 0 — was still forwarded to Stripe as the line-item quantity. A negative value priced the
   * gift negatively and passed the same guard.
   */
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(event.target.value, 10)
    if (Number.isNaN(parsed)) return setQuantity(0)
    setQuantity(Math.max(0, Math.min(parsed, MAX_GIFT_QUANTITY)))
  }

  const handleCheckout = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (quantity < 1 || isRedirecting) return

    logClick(origin)
    logBeginCheckout({
      items: [toGiftSubscriptionAnalyticsItem(supportPlan, quantity)],
      provider: 'stripe',
    })

    setIsRedirecting(true)
    setCheckoutError('')

    /*
     * The API chooses the price, the buyer identity, and the return URLs (#1942), and this
     * navigation is the whole client-side job. `isRedirecting` is deliberately left on after a
     * successful hand-off — the page is unloading, and re-enabling the button reads as failure.
     * A failed hand-off is the one place it must come back off, because there is no fallback
     * checkout any more: the alert and a live button are all the buyer gets.
     */
    try {
      const token = await getAccessToken()
      const { body } = await SubscriptionApi.createCheckoutSession(
        { kind: 'gift', plan: supportPlan.title, quantity },
        token
      )
      if (!body?.url) throw new Error('The checkout session endpoint answered without a URL.')
      window.location.assign(body.url)
    } catch (error) {
      console.error(error)
      setCheckoutError('We could not open the checkout page. Please try again.')
      setIsRedirecting(false)
    }
  }

  return (
    <tr>
      <td>
        <strong>{supportPlan.title}</strong>
      </td>
      <td>
        <input
          style={{ maxWidth: '60px' }}
          className={`form-control ${theme.bgColor} ${theme.text}`}
          type="number"
          min={1}
          max={MAX_GIFT_QUANTITY}
          aria-label={`Quantity of ${supportPlan.title} gifts`}
          value={quantity}
          onChange={handleQuantityChange}
        />
      </td>
      <td>${(parseFloat(supportPlan.cost) * quantity).toFixed(2)}</td>
      <td>
        <GenericButton
          className={`${theme.commitButton} ${isMobile ? 'btn-sm' : ''} d-block w-100 TapTargetBlock`}
          disabled={isAuthenticated && (quantity < 1 || isRedirecting)}
          onClick={isAuthenticated ? handleCheckout : login}
        >
          {isRedirecting ? 'Opening…' : isMobile ? 'Buy' : 'Purchase'}
        </GenericButton>
        {checkoutError && (
          <div className="alert alert-danger mt-2 mb-0 py-1" role="alert">
            <small>{checkoutError}</small>
          </div>
        )}
      </td>
    </tr>
  )
}
