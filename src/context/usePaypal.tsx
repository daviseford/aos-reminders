import qs from 'qs'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PAYPAL_CLIENT_ID } from 'utils/env'

interface IPaypalStatusProvider {
  paypalIsReady: boolean
}

const DEFAULT_OPTS = {
  'client-id': PAYPAL_CLIENT_ID,
  'disable-funding': 'credit,card',
  components: 'buttons',
  currency: 'USD',
  vault: true,
}

const PaypalContext = React.createContext<IPaypalStatusProvider | void>(undefined)

const PaypalProvider: React.FC = ({ children }) => {
  const [paypalIsReady, setIsPaypalReady] = useState<boolean>(false)
  const isMounted = useRef(false)

  const unmountFn = () => {
    isMounted.current = false
  }

  useEffect(() => {
    isMounted.current = true

    // If we already have paypal loaded, we don't need to do anything
    if (paypalIsReady) return unmountFn

    // Check if Paypal already exists in the window (probably from a previous mount)
    if (window.paypal) {
      setIsPaypalReady(true)
      return unmountFn
    }

    const script = document.createElement('script')

    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?${qs.stringify(DEFAULT_OPTS)}`
    script.async = true

    script.onload = () => {
      // Only update if this component is still mounted
      if (isMounted) setIsPaypalReady(true)
    }

    script.onerror = () => {
      if (isMounted) setIsPaypalReady(false)
      console.error('The Paypal SDK could not be loaded.')
    }

    document.body && document.body.appendChild(script)

    return unmountFn
  }, [paypalIsReady])

  const value = useMemo(
    () => ({
      paypalIsReady,
    }),
    [paypalIsReady]
  )

  return <PaypalContext.Provider value={value}>{children}</PaypalContext.Provider>
}

const usePaypal = () => {
  const context = React.useContext(PaypalContext)
  if (context === undefined) {
    throw new Error('usePaypal must be used within a PaypalProvider')
  }
  return context
}

export { PaypalProvider, usePaypal }
