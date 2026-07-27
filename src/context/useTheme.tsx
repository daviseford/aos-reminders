import React, { useCallback, useEffect, useMemo, useState } from 'react'
import DarkTheme from 'theme/dark'
import LightTheme from 'theme/light'
import { ITheme, TThemeType } from 'types/theme'
import { logEvent } from 'utils/analytics'

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
    logEvent(`SetTheme-${theme}`)
    return isDark ? setLightTheme() : setDarkTheme()
  }, [isDark, setDarkTheme, setLightTheme])

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
