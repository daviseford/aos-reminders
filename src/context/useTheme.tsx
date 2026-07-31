import { useSubscription } from 'context/useSubscription'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { ITheme, TThemeType } from 'types/theme'
import { logThemeChange } from 'utils/analytics'
import { useApiAccessToken } from 'utils/authToken'
import { SubscriptionApi } from '../api/subscriptionApi'

const LOCAL_THEME_KEY = 'theme'

const getLocalTheme = () => localStorage.getItem(LOCAL_THEME_KEY) as TThemeType | null

const setLocalTheme = (theme: TThemeType) => localStorage.setItem(LOCAL_THEME_KEY, theme)

interface IThemeProvider {
  isDark: boolean
  isLight: boolean
  setDarkTheme: () => void
  setLightTheme: () => void
  theme: ITheme
  toggleTheme: () => void
}

const ThemeContext = React.createContext<IThemeProvider | void>(undefined)

const ThemeProvider = ({ children }: React.PropsWithChildren<object>) => {
  const { isActive, subscription } = useSubscription()
  const getAccessToken = useApiAccessToken()
  const [theme, setTheme] = useState(getLocalTheme() === 'dark' ? DarkTheme : LightTheme)
  const [isDark, setIsDark] = useState(getLocalTheme() === 'dark')

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
    setLocalTheme(theme)
    if (isActive) {
      void getAccessToken()
        .then(token => SubscriptionApi.updateTheme({ theme }, token))
        .catch(error => {
          console.error('Unable to save subscriber theme', error)
        })
    }
    logThemeChange(theme)
    return isDark ? setLightTheme() : setDarkTheme()
  }, [getAccessToken, isActive, isDark, setDarkTheme, setLightTheme])

  const setThemeFromValue = useCallback(
    (val: TThemeType | null) => {
      return val === 'dark' ? setDarkTheme() : setLightTheme()
    },
    [setLightTheme, setDarkTheme]
  )

  // Assign our theme's bgColor to the root element
  useEffect(() => {
    const element = document.getElementById('root')
    if (element) element.className = theme.bgColor
  }, [theme.bgColor])

  useEffect(() => setThemeFromValue(getLocalTheme()), [setThemeFromValue])

  useEffect(() => {
    if (!subscription.theme) return
    setLocalTheme(subscription.theme)
    setThemeFromValue(subscription.theme)
  }, [setThemeFromValue, subscription.theme])

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
  return context
}

export { ThemeProvider, useTheme }
