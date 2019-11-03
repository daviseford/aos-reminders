export interface ITheme {
  bgColor: string
  card: string
  cardBody: string
  cardHeader: string
  dropzone: string
  genericButton: string
  headerColor: string
  modal: string
  profileCardHeader: string
  reminderHeader: string
  secondaryButton: string
  selectTheme: { [key: string]: string }
  text: string
  textMuted: string
  textOpposite: string
  textSecondary: string
}

type TLightTheme = 'light'
type TDarkTheme = 'dark'

export type TThemeType = TLightTheme | TDarkTheme
