import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { logLoginAttempt } from 'utils/analytics'
import openPopup from 'utils/openPopup'

interface UseLoginProps {
  origin: string
  onPopupClose?: () => unknown
}

const useLogin = ({ origin, onPopupClose }: UseLoginProps) => {
  const { isLoading, loginWithPopup } = useAuth0()
  const [popupIsClosed, setPopupIsClosed] = useState(false)
  // @types/react 19 requires an explicit initial value for useRef.
  const timerRef = useRef<number | undefined>(undefined)

  const clearPopupTimer = useCallback(() => {
    if (timerRef.current === undefined) return
    window.clearInterval(timerRef.current)
    timerRef.current = undefined
  }, [])

  useEffect(() => clearPopupTimer, [clearPopupTimer])

  const login = useCallback(
    (event?: React.MouseEvent) => {
      event?.preventDefault()
      logLoginAttempt(origin, 'started')

      const popup = openPopup()
      setPopupIsClosed(false)
      clearPopupTimer()

      /*
       * The popup flow never loads redirect_uri; Auth0 only uses it to validate the request against
       * the application's callback allowlist and to target the postMessage back to this window. That
       * allowlist holds the bare origin (and a few named routes), so sending the page URL meant Log in
       * on /faq stopped on Auth0's "Callback URL mismatch" page. The origin is what the Auth0Provider
       * in main.tsx is configured with, and it is valid from every route (#2006).
       */
      const authorizationParams = { redirect_uri: window.location.origin }

      if (!popup) {
        return loginWithPopup({ authorizationParams })
      }

      timerRef.current = window.setInterval(() => {
        if (!popup.closed) return
        clearPopupTimer()
        setPopupIsClosed(true)
        logLoginAttempt(origin, 'closed')
        onPopupClose?.()
      }, 1000)

      return loginWithPopup({ authorizationParams }, { popup })
    },
    [clearPopupTimer, loginWithPopup, onPopupClose, origin]
  )

  return {
    isLoggingIn: isLoading && !popupIsClosed,
    login,
    popupIsClosed,
  }
}

export default useLogin
