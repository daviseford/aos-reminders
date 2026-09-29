import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { useCallback } from 'react'
import useLogin from 'utils/hooks/useLogin'

/**
 * The one action under a failed subscription lookup. An outage gets "Check again". A sign-in that
 * can no longer be renewed gets "Log in again" instead, because retrying the lookup would only fail
 * the same way; the fresh login replaces the dead refresh token, and the lookup runs once it lands.
 */
const SubscriptionRecoveryButton = ({ origin }: { origin: string }) => {
  const { getSubscription, subscriptionNeedsLogin } = useSubscription()
  const { theme } = useTheme()
  const { login } = useLogin({ origin })

  const logInAgain = useCallback(async () => {
    try {
      await login()
    } catch {
      // A closed or blocked popup leaves the message and this button in place to try again.
      return
    }
    await getSubscription()
  }, [getSubscription, login])

  if (subscriptionNeedsLogin) {
    return (
      <button type="button" className={`${theme.alertActionButton} mt-2`} onClick={() => void logInAgain()}>
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
