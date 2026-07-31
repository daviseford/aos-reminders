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
  modalSuccessClass: string
  noteBorder: string
  profileCardHeader: string
  reminderHeader: string
  reminderHr: string
  reminderTags: string
  secondaryButton: string
  /** A recessed full-bleed band that separates a section from the page around it. */
  sectionBand: string
  selectTheme: Record<string, string>
  text: string
  textMuted: string
  textOpposite: string
  textSecondary: string
  tooltip: string
}

type TLightTheme = 'light'
type TDarkTheme = 'dark'

export type TThemeType = TLightTheme | TDarkTheme

export type TBootstrapTypes =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'info'
  | 'warning'
  | 'success'
  | 'light'
  | 'dark'
