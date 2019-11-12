import React, { useState } from 'react'
import { injectStripe, Elements } from 'react-stripe-elements'
import qs from 'qs'
import { useAuth0 } from 'react-auth0-wrapper'
import AsyncStripeProvider from './asyncStripeProvider'
import { useSavedArmies } from 'context/useSavedArmies'
import { logClick } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import { GiftedSubscriptionPlans, IGiftedSubscriptionPlans } from './plans'
import { IUser } from 'types/user'
import { LocalStoredArmy } from 'utils/localStore'
import { useSubscription } from 'context/useSubscription'
import { componentWithSize } from 'utils/mapSizesToProps'
import { IGiftSubscription } from 'types/subscription'
import { capitalize } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useTheme } from 'context/useTheme'
import GenericButton from 'components/input/generic_button'
import { FaLink, FaCheck } from 'react-icons/fa'

const HAS_SALE = GiftedSubscriptionPlans.some(x => x.sale)

interface ICheckoutProps {
  stripe?: any
  isMobile?: boolean
}

const GiftSubscriptionsComponent: React.FC<ICheckoutProps> = componentWithSize(props => {
  const { stripe } = props
  const { isActive } = useSubscription()

  if (!stripe || !isActive) return <></>

  return (
    <div className="container">
      <GiftTable />
      <PlansHeader />
      <PurchaseTable {...props} />
    </div>
  )
})

const GiftTable = () => {
  const { subscription } = useSubscription()
  const { giftSubscriptions = [] } = subscription

  if (giftSubscriptions.length === 0) return null

  return (
    <table className={`table`}>
      {giftSubscriptions.map((x, i) => (
        <GiftRow {...x} key={i} />
      ))}
    </table>
  )
}

const GiftRow = (props: IGiftSubscription) => {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <tr>
      <td>{props.planIntervalCount}</td>
      <td>{`${capitalize(props.planInterval)}${props.planIntervalCount > 1 ? `s` : ``}`}</td>
      <td>
        <CopyToClipboard onCopy={handleCopy} text={props.url}>
          <GenericButton className={theme.modalConfirmClass}>
            <FaLink className="mr-2" /> Copy Invite URL{copied && <FaCheck className={`text-success ml-2`} />}
          </GenericButton>
        </CopyToClipboard>
      </td>
    </tr>
  )
}

interface IPurchaseTable {
  stripe: any
  isMobile: boolean
}

const PurchaseTable = (props: IPurchaseTable) => {
  const { isMobile } = props
  const { user }: { user: IUser } = useAuth0()

  return (
    <>
      <table className={`table ${isMobile ? `table-sm` : ``}`}>
        <thead>
          <tr>
            <th>Plan</th>
            <th>{isMobile ? `#` : `Quantity`}</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {GiftedSubscriptionPlans.map((plan, i) => (
            <PlanComponent {...props} user={user} supportPlan={plan} key={i} />
          ))}
        </tbody>
      </table>
      <div className="row text-center justify-content-center">
        <div className="col">
          <small>
            <em>
              Gifted subscriptions are <strong>not</strong> recurring charges. You only pay for the initial
              subscription period.
              <br />
              You will receive an activation link that you can send to anyone. They will set up their account
              using that link.
            </em>
          </small>
        </div>
      </div>
    </>
  )
}

const PlansHeader = () => {
  return (
    <div className="col-12 text-center mb-3">
      <h4>
        Gift a Subscription!
        {HAS_SALE && <span className="ml-2 badge badge-danger">Sale!</span>}
      </h4>
    </div>
  )
}

interface IPlanProps {
  stripe: any
  user: IUser
  supportPlan: IGiftedSubscriptionPlans
  isMobile: boolean
}

const PlanComponent: React.FC<IPlanProps> = props => {
  const { stripe, user, supportPlan, isMobile } = props
  const { isAuthenticated } = useAuth0()
  const { handleLogin } = useSavedArmies()
  const [quantity, setQuantity] = useState(1)

  // When the customer clicks on the button, redirect them to Checkout.
  const handleCheckout = async e => {
    e.preventDefault()

    if (quantity === 0) return // Can't do anything with zero quantity

    logClick(`${supportPlan.title}-GiftedSubscription`)

    LocalStoredArmy.set() // Store our current army in local storage so we don't lose it

    const sku = isDev ? supportPlan.dev : supportPlan.prod
    const url = isDev ? 'localhost:3000' : 'aosreminders.com'

    const item = { sku, quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity }

    stripe
      .redirectToCheckout({
        items: [item],

        // Meta
        customerEmail: user.email, // Used to prefill checkout
        clientReferenceId: user.email, // Included in the checkout.session.completed webhook

        // Redirect after checkout
        successUrl: `${window.location.protocol}//${url}/profile/?${qs.stringify({
          gifted: true,
          quantity,
          sku: supportPlan.title,
        })}`,
        cancelUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          canceled: true,
          sku: supportPlan.title,
        })}`,
      })
      .then(function(result) {
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer.
          console.log(result.error)
          // var displayError = document.getElementById('error-message');
          // displayError.textContent = result.error.message;
        }
      })
  }

  const handleChange = e => {
    const value = e.target.value
    setQuantity(value)
  }

  return (
    <tr>
      <td>
        <strong>{supportPlan.title}</strong>
      </td>
      <td>
        <input
          style={{ maxWidth: '50px' }}
          className="form-control"
          type="number"
          value={quantity}
          onChange={handleChange}
        />
      </td>

      <td>${(parseFloat(supportPlan.cost) * quantity).toFixed(2)}</td>

      {HAS_SALE && !isMobile && (
        <td>
          <span className="badge badge-pill badge-danger mb-2">{supportPlan.discount_pct}% off!</span>
        </td>
      )}

      <td>
        <button
          type="button"
          className={`btn btn ${isMobile ? `btn-sm` : ``} btn-block btn-primary`}
          onClick={isAuthenticated ? handleCheckout : handleLogin}
        >
          {isMobile ? `Buy` : `Purchase`}
        </button>
      </td>
    </tr>
  )
}

const InjectedGiftSubscriptions = injectStripe(GiftSubscriptionsComponent)

export const GiftSubscriptions = () => {
  return (
    <AsyncStripeProvider apiKey={STRIPE_KEY}>
      <Elements>
        <InjectedGiftSubscriptions />
      </Elements>
    </AsyncStripeProvider>
  )
}
