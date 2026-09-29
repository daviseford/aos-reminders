import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { useCallback, useRef, useState } from 'react'
import useLogin from 'utils/hooks/useLogin'

/**
 * The one action under a failed subscription lookup. An outage gets "Check again". A sign-in that
 * can no longer be renewed gets "Log in again" instead, because retrying the lookup would only fail
 * the same way; the fresh login replaces the dead refresh token, and the lookup runs once it lands.
 */
const SubscriptionRecoveryButton = ({ origin }: { origin: string }) => {
  const { getSubscription, subscriptionNeedsLogin } = useSubscription()
  const { theme } = useTheme()
  const { isLoggingIn, login } = useLogin({ origin })
  /*
   * A second click while the popup is opening would start a second Auth0 transaction, and the two
   * then fail each other's state check. The ref stops a double click inside one render; the state
   * disables the button for as long as the attempt runs.
   */
  const inFlightRef = useRef(false)
  const [inFlight, setInFlight] = useState(false)

  const logInAgain = useCallback(async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    setInFlight(true)
    try {
      try {
        await login()
      } catch {
        // A closed or blocked popup leaves the message and this button in place to try again.
        return
      }
      await getSubscription()
    } finally {
      inFlightRef.current = false
      setInFlight(false)
    }
  }, [getSubscription, login])

  if (subscriptionNeedsLogin) {
    return (
      <button
        type="button"
        className={`${theme.alertActionButton} mt-2`}
        disabled={inFlight || isLoggingIn}
        onClick={() => void logInAgain()}
      >
        Log in again
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`${theme.alertActionButton} mt-2`}
      onClick={() => void getSubscription()}
    >
      Check again
    </button>
  )
}

export default SubscriptionRecoveryButton
