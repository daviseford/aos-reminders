import React, { useState, useEffect, useCallback } from 'react'
import LightTheme from 'theme/light'
import DarkTheme from 'theme/dark'
import { ITheme, TThemeType } from 'types/theme'
import { LocalTheme } from 'utils/localStore'
import { useSubscription } from './useSubscription'
import { SubscriptionApi } from 'api/subscriptionApi'

interface IThemeProvider {
  saveTheme: (theme: TThemeType) => void
  setDarkTheme: () => void
  setLightTheme: () => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  theme: ITheme
}

const ThemeContext = React.createContext<IThemeProvider | void>(undefined)

const ThemeProvider: React.FC = ({ children }) => {
  const { subscription } = useSubscription()
  const [theme, setTheme] = useState(DarkTheme)
  const [isDark, setIsDark] = useState(true)

  const saveTheme = useCallback(
    (theme: TThemeType) => {
      LocalTheme.set(theme)
      if (!subscription) return
      const { id, userName } = subscription
      SubscriptionApi.updateTheme({ id, userName, theme })
    },
    [subscription]
  )

  const setLightTheme = () => {
    setTheme(LightTheme)
    setIsDark(false)
  }
  const setDarkTheme = () => {
    setTheme(DarkTheme)
    setIsDark(true)
  }
  const toggleTheme = () => (isDark ? setLightTheme() : setDarkTheme())

  // Fetch our theme from the local store and the subscription API
  useEffect(() => {
    const setThemeHelper = (name: TThemeType | null) => {
      return !name || name === 'light' ? setLightTheme() : setDarkTheme()
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
        saveTheme,
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
