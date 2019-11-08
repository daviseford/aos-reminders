import React, { useState, useEffect, useCallback } from 'react'
import { useSubscription } from './useSubscription'
import LightTheme from 'theme/light'
import DarkTheme from 'theme/dark'
import { SubscriptionApi } from 'api/subscriptionApi'
import { logEvent } from 'utils/analytics'
import { LocalTheme } from 'utils/localStore'
import { ITheme, TThemeType } from 'types/theme'

interface IThemeProvider {
  isDark: boolean
  isLight: boolean
  setDarkTheme: () => void
  setLightTheme: () => void
  theme: ITheme
  toggleTheme: () => void
}

const ThemeContext = React.createContext<IThemeProvider | void>(undefined)

const ThemeProvider: React.FC = ({ children }) => {
  const { subscription, isActive } = useSubscription()
  const [theme, setTheme] = useState(LocalTheme.get() === 'dark' ? DarkTheme : LightTheme)
  const [isDark, setIsDark] = useState(LocalTheme.get() === 'dark')

  const toggleTheme = useCallback(() => {
    const theme = isDark ? 'light' : 'dark'
    LocalTheme.set(theme)
    if (isActive) {
      const { id, userName } = subscription
      Promise.resolve(SubscriptionApi.updateTheme({ id, userName, theme }))
    }
    logEvent(`SetTheme-${theme}`)
    return isDark ? setLightTheme() : setDarkTheme()
  }, [subscription, isDark, isActive])

  const setLightTheme = () => {
    setTheme(LightTheme)
    setIsDark(false)
  }
  const setDarkTheme = () => {
    setTheme(DarkTheme)
    setIsDark(true)
  }
  const setThemeFromValue = useCallback((val: TThemeType | null) => {
    return val === 'dark' ? setDarkTheme() : setLightTheme()
  }, [])

  // Fetch our theme from the subscription API
  useEffect(() => {
    if (subscription && subscription.theme) {
      LocalTheme.set(subscription.theme) // Update local value
      setThemeFromValue(subscription.theme)
    }
  }, [subscription, setThemeFromValue])

  // Assign our theme's bgColor to the root element
  useEffect(() => {
    const element = document.getElementById('root')
    if (element) element.className = theme.bgColor
  }, [theme.bgColor])

  // Fetch our theme from the local store
  useEffect(() => {
    const theme = LocalTheme.get()
    setThemeFromValue(theme)
  }, [setThemeFromValue])

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        isLight: !isDark,
        setDarkTheme,
        setLightTheme,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, useTheme }
