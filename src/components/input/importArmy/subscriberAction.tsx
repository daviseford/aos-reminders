import { useAuth0 } from '@auth0/auth0-react'
import { useSubscription } from 'context/useSubscription'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'

interface UseSubscriberActionOptions {
  /** Display name of the gated feature, shown on /subscribe so the visitor knows why they are there. */
  featureName: string
  onAuthorized: () => void
  origin: string
}

/**
 * Runs a subscriber-only action, sending the visitor wherever they need to go first.
 *
 * Two things this used to get wrong, both at the highest-intent moment in the funnel:
 *
 * 1. An unauthenticated visitor was sent to log in and then simply left on Home. The action they
 *    asked for was dropped silently, so the only feedback for a successful login was that nothing
 *    happened. The intent is now held and completed once auth and the subscription lookup settle.
 * 2. A non-subscriber was navigated to /subscribe with no message at all — a page that opens by
 *    asking for support, arrived at for reasons it never stated. The feature's name travels with the
 *    navigation so that page can say which control sent them.
 */
export const useSubscriberAction = ({
  featureName,
  onAuthorized,
  origin,
}: UseSubscriberActionOptions): { disabled: boolean; run: () => void } => {
  const { isAuthenticated, isLoading } = useAuth0()
  const { isActive, subscriptionLoading } = useSubscription()
  const [isPending, setIsPending] = useState(false)
  // Closing the popup abandons the intent; without this it would fire on some later, unrelated login.
  const { isLoggingIn, login, popupIsClosed } = useLogin({ onPopupClose: () => setIsPending(false), origin })
  const navigate = useNavigate()

  const proceed = useCallback(() => {
    if (!isActive) {
      navigate(ROUTES.SUBSCRIBE, { state: { featureName } })
      return
    }
    onAuthorized()
  }, [featureName, isActive, navigate, onAuthorized])

  const run = useCallback(() => {
    if (!isAuthenticated) {
      setIsPending(true)
      void login()
      return
    }
    proceed()
  }, [isAuthenticated, login, proceed])

  useEffect(() => {
    if (!isPending) return
    if (popupIsClosed) {
      setIsPending(false)
      return
    }
    // Wait for the subscription answer too: acting on a stale `isActive` would route a fresh
    // subscriber to /subscribe rather than opening what they asked for.
    if (!isAuthenticated || isLoading || subscriptionLoading) return
    setIsPending(false)
    proceed()
  }, [isAuthenticated, isLoading, isPending, popupIsClosed, proceed, subscriptionLoading])

  return {
    disabled: isLoading || isLoggingIn || subscriptionLoading,
    run,
  }
}
