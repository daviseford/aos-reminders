import React, { useState, useEffect } from 'react'

interface IOfflineStatusProvider {
  isOffline: boolean
  isOnline: boolean
}

const OfflineStatusContext = React.createContext<IOfflineStatusProvider | void>(undefined)

const OfflineStatusProvider: React.FC = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false) // just doing this for dev, switch to false for prod

  const setOffline = () => {
    console.log('No internet connection found. App is running in offline mode.')
    setIsOffline(true)
  }

  useEffect(() => {
    window.addEventListener('isOffline', setOffline)
    return () => window.removeEventListener('isOffline', setOffline)
  })

  return (
    <OfflineStatusContext.Provider value={{ isOffline, isOnline: !isOffline }}>
      {children}
    </OfflineStatusContext.Provider>
  )
}

const useOfflineStatus = () => {
  const context = React.useContext(OfflineStatusContext)
  if (context === undefined) {
    throw new Error('useOfflineStatus must be used within a OfflineStatusProvider')
  }
  return context
}

export { OfflineStatusProvider, useOfflineStatus }
