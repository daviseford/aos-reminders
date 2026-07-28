import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { logEvent } from 'utils/analytics'

interface AppStatusValue {
  hasNewContent: boolean
  isGameMode: boolean
  isOffline: boolean
  isOnline: boolean
  toggleGameMode: () => void
}

const AppStatusContext = React.createContext<AppStatusValue | undefined>(undefined)

const AppStatusProvider = ({ children }: React.PropsWithChildren<object>) => {
  const [isGameMode, setIsGameMode] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [hasNewContent, setHasNewContent] = useState(false)

  const toggleGameMode = useCallback(() => {
    setIsGameMode(current => {
      logEvent(`ToggleGameMode-${current ? 'Off' : 'On'}`)
      return !current
    })
  }, [])

  useEffect(() => {
    const setOnline = () => setIsOffline(false)
    const setOffline = () => setIsOffline(true)
    const setContent = () => setHasNewContent(true)
    let updateChannel: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== 'undefined') {
      updateChannel = new BroadcastChannel('app-update')
      updateChannel.addEventListener('message', setContent)
    }
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)
    window.addEventListener('isOffline', setOffline)
    window.addEventListener('hasNewContent', setContent)

    return () => {
      updateChannel?.removeEventListener('message', setContent)
      updateChannel?.close()
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
      window.removeEventListener('isOffline', setOffline)
      window.removeEventListener('hasNewContent', setContent)
    }
  }, [])

  const value = useMemo(
    () => ({
      hasNewContent,
      isGameMode,
      isOffline,
      isOnline: !isOffline,
      toggleGameMode,
    }),
    [hasNewContent, isGameMode, isOffline, toggleGameMode]
  )

  return <AppStatusContext.Provider value={value}>{children}</AppStatusContext.Provider>
}

const useAppStatus = () => {
  const context = React.useContext(AppStatusContext)
  if (!context) throw new Error('useAppStatus must be used within an AppStatusProvider')
  return context
}

export { AppStatusProvider, useAppStatus }
