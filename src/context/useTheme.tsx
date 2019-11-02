import React, { useState, useEffect, useCallback } from 'react'
import LightTheme from 'theme/light'
import DarkTheme from 'theme/dark'
import { ITheme, TThemeType } from 'types/theme'
import { LocalTheme } from 'utils/localStore'
import { useSubscription } from './useSubscription'
import { SubscriptionApi } from 'api/subscriptionApi'
import { useAppStatus } from './useAppStatus'

interface IThemeProvider {
  setDarkTheme: () => void
  setLightTheme: () => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  theme: ITheme
}

const ThemeContext = React.createContext<IThemeProvider | void>(undefined)

const ThemeProvider: React.FC = ({ children }) => {
  const { subscription, isActive } = useSubscription()
  const [theme, setTheme] = useState(DarkTheme)
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = useCallback(() => {
    const theme = isDark ? 'light' : 'dark'
    LocalTheme.set(theme)
    if (isActive) {
      const { id, userName } = subscription
      Promise.resolve(SubscriptionApi.updateTheme({ id, userName, theme }))
    }
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

  // Fetch our theme from the local store and the subscription API
  useEffect(() => {
    const setThemeHelper = (x: TThemeType | null) => {
      return !x || x === 'light' ? setLightTheme() : setDarkTheme()
    }
    setThemeHelper(LocalTheme.get()) // Use local value first

    if (subscription && subscription.theme) {
      LocalTheme.set(subscription.theme) // Update local vaue
      setThemeHelper(subscription.theme) // Set the theme to subscription value
    }
  }, [subscription])

  useEffect(() => {
    // Assign our theme's bgColor to the root element
    const element = document.getElementById('root')
    if (element) element.className = theme.bgColor
  }, [theme.bgColor])

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
