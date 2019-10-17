import React, { useState, useEffect } from 'react'

interface IOfflineStatusProvider {
  isOffline: boolean
}

const OfflineStatusContext = React.createContext<IOfflineStatusProvider | void>(undefined)

const OfflineStatusProvider: React.FC = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)

  const setOffline = () => {
    console.log('No internet connection found. App is running in offline mode.')
    setIsOffline(true)
  }

  useEffect(() => {
    window.addEventListener('isOffline', setOffline)
    return () => window.removeEventListener('isOffline', setOffline)
  })

  return <OfflineStatusContext.Provider value={{ isOffline }}>{children}</OfflineStatusContext.Provider>
}

const useOfflineStatus = () => {
  const context = React.useContext(OfflineStatusContext)
  if (context === undefined) {
    throw new Error('useOfflineStatus must be used within a OfflineStatusProvider')
  }
  return context
}

export { OfflineStatusProvider, useOfflineStatus }
