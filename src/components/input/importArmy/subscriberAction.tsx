import { useAuth0 } from '@auth0/auth0-react'
import { useSubscription } from 'context/useSubscription'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from 'utils/env'
import useLogin from 'utils/hooks/useLogin'

interface UseSubscriberActionOptions {
  onAuthorized: () => void
  origin: string
}

export const useSubscriberAction = ({
  onAuthorized,
  origin,
}: UseSubscriberActionOptions): { disabled: boolean; run: () => void } => {
  const { isAuthenticated, isLoading } = useAuth0()
  const { isActive, subscriptionLoading } = useSubscription()
  const { isLoggingIn, login } = useLogin({ origin })
  const navigate = useNavigate()

  const run = useCallback(() => {
    if (!isAuthenticated) {
      void login()
      return
    }
    if (!isActive) {
      navigate(ROUTES.SUBSCRIBE)
      return
    }
    onAuthorized()
  }, [isActive, isAuthenticated, login, navigate, onAuthorized])

  return {
    disabled: isLoading || isLoggingIn || subscriptionLoading,
    run,
  }
}
