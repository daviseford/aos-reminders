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

const PaypalProvider = ({ children }: React.PropsWithChildren<object>) => {
  const [paypalIsReady, setIsPaypalReady] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    if (paypalIsReady) return () => void (isMounted.current = false)

    if (window.paypal) {
      setIsPaypalReady(true)
      return () => void (isMounted.current = false)
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?${qs.stringify(DEFAULT_OPTS)}`
    script.async = true
    script.onload = () => {
      if (isMounted.current) setIsPaypalReady(true)
    }
    script.onerror = () => {
      if (isMounted.current) setIsPaypalReady(false)
      console.error('The Paypal SDK could not be loaded.')
    }
    document.body?.appendChild(script)

    return () => void (isMounted.current = false)
  }, [paypalIsReady])

  const value = useMemo(() => ({ paypalIsReady }), [paypalIsReady])

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
