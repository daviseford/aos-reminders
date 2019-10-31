import React, { useState } from 'react'
import LightTheme from 'theme/light'
import DarkTheme from 'theme/dark'
import { ITheme } from 'types/theme'

interface IThemeProvider {
  setDarkTheme: () => void
  setLightTheme: () => void
  theme: ITheme
}

const ThemeContext = React.createContext<IThemeProvider | void>(undefined)

const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState(DarkTheme)

  const setLightTheme = () => setTheme(LightTheme)
  const setDarkTheme = () => setTheme(DarkTheme)

  return (
    <ThemeContext.Provider value={{ theme, setLightTheme, setDarkTheme }}>{children}</ThemeContext.Provider>
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
