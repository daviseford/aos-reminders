import { SubscriptionApi } from 'api/subscriptionApi'
import { useSubscription } from 'context/useSubscription'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { ITheme, TThemeType } from 'types/theme'
import { logEvent } from 'utils/analytics'
import { LocalTheme } from 'utils/localStore'

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
  const { subscription } = useSubscription()
  const [theme, setTheme] = useState(LocalTheme.get() === 'dark' ? DarkTheme : LightTheme)
  const [isDark, setIsDark] = useState(LocalTheme.get() === 'dark')

  const setLightTheme = useCallback(() => {
    setTheme(LightTheme)
    setIsDark(false)
  }, [])
  const setDarkTheme = useCallback(() => {
    setTheme(DarkTheme)
    setIsDark(true)
  }, [])

  const toggleTheme = useCallback(() => {
    const theme = isDark ? 'light' : 'dark'
    LocalTheme.set(theme)
    const { id, userName } = subscription
    Promise.resolve(SubscriptionApi.updateTheme({ id, userName, theme }))
    logEvent(`SetTheme-${theme}`)
    return isDark ? setLightTheme() : setDarkTheme()
  }, [subscription, isDark, setDarkTheme, setLightTheme])

  const setThemeFromValue = useCallback(
    (val: TThemeType | null) => {
      return val === 'dark' ? setDarkTheme() : setLightTheme()
    },
    [setLightTheme, setDarkTheme]
  )

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
  })

  const value = useMemo(
    () => ({
      isDark,
      isLight: !isDark,
      setDarkTheme,
      setLightTheme,
      theme,
      toggleTheme,
    }),
    [isDark, setDarkTheme, setLightTheme, theme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context as IThemeProvider
}

export { ThemeProvider, useTheme }
