import React, { useState } from 'react'
import { useAuth0 } from 'react-auth0-wrapper'
import { injectStripe, Elements } from 'react-stripe-elements'
import qs from 'qs'
import { capitalize } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaGift, FaCheck } from 'react-icons/fa'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { logClick } from 'utils/analytics'
import { isDev, STRIPE_KEY } from 'utils/env'
import { LocalStoredArmy } from 'utils/localStore'
import { componentWithSize } from 'utils/mapSizesToProps'
import AsyncStripeProvider from './asyncStripeProvider'
import { GiftedSubscriptionPlans, IGiftedSubscriptionPlans } from './plans'
import GenericButton from 'components/input/generic_button'
import { IGiftSubscription } from 'types/subscription'
import { IUser } from 'types/user'

const COL_SIZE = `col-12 col-sm-12 col-md-10 col-xl-8 col-xxl-6`

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
      <PlansHeader />
      <PurchaseTable {...props} />
      <GiftTable />
    </div>
  )
})

const GiftTable = () => {
  const { theme } = useTheme()
  const { subscription } = useSubscription()
  const { giftSubscriptions = [] } = subscription

  if (giftSubscriptions.length === 0) return null

  return (
    <>
      <div className={`row d-flex justify-content-center text-center ${theme.text}`}>
        <div className={COL_SIZE}>
          <h4>Purchased Subscriptions</h4>
          <p>
            Click to copy a one-time-use link and send it to your friend.
            <br />
            When they visit the link, they'll be asked to create an account and your gifted subscription will
            be redeemed.
          </p>
        </div>
      </div>

      <div className={`row d-flex justify-content-center pb-5`}>
        <div className={`${COL_SIZE} text-center`}>
          <div className={`${theme.text}`}>
            {giftSubscriptions.map((x, i) => (
              <GiftButton {...x} key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const GiftButton = (props: IGiftSubscription) => {
  const { planInterval, planIntervalCount } = props
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const label = `${planIntervalCount} ${capitalize(planInterval)}${planIntervalCount > 1 ? `s` : ``}`

  const handleCopy = () => {
    logClick(`Copy-Gift-URL-${label}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <CopyToClipboard onCopy={handleCopy} text={props.url}>
      <GenericButton className={`${theme.genericButton} mx-2 my-2`}>
        <FaGift className="mr-2" />
        <strong className="mr-1">{label}</strong> Gift
        {copied && <FaCheck className={`text-success ml-2`} />}
      </GenericButton>
    </CopyToClipboard>
  )
}

interface IPurchaseTable {
  stripe: any
  isMobile: boolean
}

const PurchaseTable = (props: IPurchaseTable) => {
  const { isMobile } = props
  const { theme } = useTheme()
  const { user }: { user: IUser } = useAuth0()

  return (
    <>
      <div className={`row d-flex justify-content-center`}>
        <div className={`${COL_SIZE}`}>
          <table className={`table ${theme.text} ${isMobile ? `table-sm` : ``}`}>
            <thead>
              <tr>
                <th>Plan</th>
                <th>{isMobile ? `#` : `Quantity`}</th>
                <th>Cost</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {GiftedSubscriptionPlans.map((plan, i) => (
                <PlanComponent {...props} user={user} supportPlan={plan} key={i} />
              ))}
            </tbody>
          </table>
          <div className={`row text-center justify-content-center ${theme.text} pb-5`}>
            <div className="col">
              <small>
                <em>
                  Gifted subscriptions are <strong>not</strong> recurring charges. You only pay for the
                  initial subscription period.
                  <br />
                  You will receive an activation link that you can send to anyone. They will set up their
                  account using that link.
                </em>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PlansHeader = () => {
  const { theme } = useTheme()
  return (
    <div className={`col-12 text-center mb-3 ${theme.text}`}>
      <h4>Gift a Subscription!</h4>
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
          plan: supportPlan.title,
        })}`,
        cancelUrl: `${window.location.protocol}//${url}/?${qs.stringify({
          canceled: true,
          plan: supportPlan.title,
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
          style={{ maxWidth: '60px' }}
          className="form-control"
          type="number"
          value={quantity}
          onChange={handleChange}
        />
      </td>

      <td>${(parseFloat(supportPlan.cost) * quantity).toFixed(2)}</td>

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
