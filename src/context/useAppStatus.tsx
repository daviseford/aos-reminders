import React, { useState, useEffect } from 'react'

interface IAppStatusProvider {
  isOffline: boolean
  isOnline: boolean
  hasNewContent: boolean
}

const timeout = (ms: number, promise) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'))
    }, ms)
    promise.then(resolve, reject)
  })
}

const AppStatusContext = React.createContext<IAppStatusProvider | void>(undefined)

const AppStatusProvider: React.FC = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)
  const [hasNewContent, setHasNewContent] = useState(true) // just doing this for dev, switch to false for prod

  const setOffline = () => {
    console.log('No internet connection found. App is running in offline mode.')
    setIsOffline(true)
  }

  const setContent = () => {
    console.log(
      'New content is available and will be used when all tabs for this page are closed. See https://create-react-app.dev/docs/making-a-progressive-web-app/#offline-first-considerations.'
    )
    setHasNewContent(true)
  }

  useEffect(() => {
    window.addEventListener('isOffline', setOffline)
    window.addEventListener('hasNewContent', setContent)

    const poll = async () => {
      try {
        await timeout(
          10000,
          fetch('https://google.com', {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Access-Control-Allow-Origin': '*' },
          })
        )
      } catch (error) {
        if (!isOffline) setOffline()
      }
    }

    poll() // See if we're on the Internet

    return () => {
      window.removeEventListener('isOffline', setOffline)
      window.removeEventListener('hasNewContent', setContent)
    }
  })

  return (
    <AppStatusContext.Provider value={{ isOffline, isOnline: !isOffline, hasNewContent }}>
      {children}
    </AppStatusContext.Provider>
  )
}

const useAppStatus = () => {
  const context = React.useContext(AppStatusContext)
  if (context === undefined) {
    throw new Error('useAppStatus must be used within a AppStatusProvider')
  }
  return context
}

export { AppStatusProvider, useAppStatus }
