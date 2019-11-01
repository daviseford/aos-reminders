import React, { useState, useEffect } from 'react'
import LightTheme from 'theme/light'
import DarkTheme from 'theme/dark'
import { ITheme } from 'types/theme'

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
  const [theme, setTheme] = useState(DarkTheme)
  const [isDark, setIsDark] = useState(true)

  const setLightTheme = () => {
    setTheme(LightTheme)
    setIsDark(false)
  }
  const setDarkTheme = () => {
    setTheme(DarkTheme)
    setIsDark(true)
  }
  const toggleTheme = () => (isDark ? setLightTheme() : setDarkTheme())

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
