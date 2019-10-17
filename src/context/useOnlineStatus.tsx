import React, { useState, useEffect } from 'react'

interface IOnlineStatusContext {
  isOnline: boolean
}

const OnlineStatusContext = React.createContext<IOnlineStatusContext | void>(undefined)

const OnlineStatusProvider: React.FC = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true)

  const setOffline = () => {
    console.log('No internet connection found. App is running in offline mode.')
    setIsOnline(false)
  }

  useEffect(() => {
    window.addEventListener('isOffline', setOffline)
    return () => window.removeEventListener('isOffline', setOffline)
  })

  return <OnlineStatusContext.Provider value={{ isOnline }}>{children}</OnlineStatusContext.Provider>
}

const useOnlineStatus = () => {
  const context = React.useContext(OnlineStatusContext)
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within a OnlineStatusProvider')
  }
  return context
}

export { OnlineStatusProvider, useOnlineStatus }
