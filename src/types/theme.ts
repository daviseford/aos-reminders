export interface ITheme {
  bgColor: string
  card: string
  cardBody: string
  cardHeader: string
  dropzone: string
  genericButton: string
  genericButtonBlock: string
  headerColor: string
  modalConfirmClass: string
  modalDangerClass: string
  profileCardHeader: string
  reminderHeader: string
  secondaryButton: string
  selectTheme: { [key: string]: string }
  text: string
  textMuted: string
  textOpposite: string
  textSecondary: string
  tooltip: string
}

type TLightTheme = 'light'
type TDarkTheme = 'dark'

export type TThemeType = TLightTheme | TDarkTheme
