import React, { useCallback, useEffect, useMemo, useState } from 'react'

interface AppStatusValue {
  isGameMode: boolean
  isOffline: boolean
  isOnline: boolean
  toggleGameMode: () => void
}

const AppStatusContext = React.createContext<AppStatusValue | undefined>(undefined)

const AppStatusProvider = ({ children }: React.PropsWithChildren<object>) => {
  const [isGameMode, setIsGameMode] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  const toggleGameMode = useCallback(() => {
    setIsGameMode(current => !current)
  }, [])

  useEffect(() => {
    const setOnline = () => setIsOffline(false)
    const setOffline = () => setIsOffline(true)

    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)
    window.addEventListener('isOffline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
      window.removeEventListener('isOffline', setOffline)
    }
  }, [])

  const value = useMemo(
    () => ({
      isGameMode,
      isOffline,
      isOnline: !isOffline,
      toggleGameMode,
    }),
    [isGameMode, isOffline, toggleGameMode]
  )

  return <AppStatusContext.Provider value={value}>{children}</AppStatusContext.Provider>
}

const useAppStatus = () => {
  const context = React.useContext(AppStatusContext)
  if (!context) throw new Error('useAppStatus must be used within an AppStatusProvider')
  return context
}

export { AppStatusProvider, useAppStatus }
