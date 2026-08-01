import { useSubscription } from 'context/useSubscription'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { ITheme, TThemeType } from 'types/theme'
import { logThemeChange } from 'utils/analytics'
import { useApiAccessToken } from 'utils/authToken'
import { SubscriptionApi } from '../api/subscriptionApi'

const LOCAL_THEME_KEY = 'theme'

/*
 * Every page background a theme can ask for, so the effect below can clear whichever one <body> is
 * already wearing before it applies the current one.
 */
const BG_CLASS_NAMES = [LightTheme.bgColor, DarkTheme.bgColor]

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

    /*
     * ...and to <body>, which owns the canvas. `#root` covers the document, but the area outside it
     * is painted from <body>: iOS rubber-band overscroll, and the gap a page shorter than the
     * viewport leaves once a route sizes `#root` below its min-height floor. Left white, those read
     * as a flash of the light theme.
     *
     * `classList` rather than `className`, which is what `#root` above can safely use: react-modal
     * writes `ReactModal__Body--open` onto <body> for as long as a modal is open, and assigning
     * `className` would drop it.
     */
    document.body.classList.remove(...BG_CLASS_NAMES)
    document.body.classList.add(theme.bgColor)
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
