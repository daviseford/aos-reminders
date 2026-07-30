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

      if (!popup) {
        return loginWithPopup({ authorizationParams: { redirect_uri: window.location.href } })
      }

      timerRef.current = window.setInterval(() => {
        if (!popup.closed) return
        clearPopupTimer()
        setPopupIsClosed(true)
        logLoginAttempt(origin, 'closed')
        onPopupClose?.()
      }, 1000)

      return loginWithPopup({ authorizationParams: { redirect_uri: window.location.href } }, { popup })
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
