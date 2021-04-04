import { useAuth0 } from '@auth0/auth0-react'
import { useMemo, useState } from 'react'
import { logClick, logEvent } from 'utils/analytics'
import openPopup from 'utils/openPopup'

interface IUseLoginProps {
  /**
   * The source of this login, e.g. 'Navbar'
   */
  origin: string
  /**
   * An optional function to run after the user has closed the login popup
   *
   * Note: This is triggered whether the user logged in successfully, or just closed the window.
   */
  onPopupClose?: () => unknown
}

/**
 * A useful hook to help with logins
 *
 * Includes a tracker for the login window that can notify you when closed.
 *
 * @param props
 *
 * @example const { login } =  useLogin({ origin: 'Navbar' })
 */
const useLogin = (props: IUseLoginProps) => {
  const { isLoading, loginWithPopup } = useAuth0()
  const [popupIsClosed, setPopupIsClosed] = useState(false)

  const value = useMemo(
    () => ({
      isLoggingIn: isLoading && !popupIsClosed,
      popupIsClosed,
      login: (e?: any) => {
        e?.preventDefault?.()
        logClick(`${props.origin}-Login`)

        const popup = openPopup()
        setPopupIsClosed(false)

        // https://stackoverflow.com/a/48240128
        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer)
            setPopupIsClosed(true)
            logEvent(`${props.origin}-Login-Closed`)
            if (props.onPopupClose) props.onPopupClose()
          }
        }, 1000)

        return loginWithPopup({ redirect_uri: window.location.href }, { popup })
      },
    }),
    [isLoading, loginWithPopup, popupIsClosed, props]
  )

  return value
}

export default useLogin
