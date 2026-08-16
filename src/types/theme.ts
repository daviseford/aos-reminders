export interface ITheme {
  /**
   * A recovery control that sits on a Bootstrap `alert-*`. Theme-invariant, because an alert's
   * palette stays light in both themes — see The Alert Surface Rule in DESIGN.md.
   */
  alertActionButton: string
  bgColor: string
  card: string
  cardBody: string
  cardHeader: string
  /** The one filled control that commits. Theme-invariant, so the decision reads the same weight in both themes. */
  commitButton: string
  /** The filled control that destroys data. Theme-invariant, for the same reason as `commitButton`. */
  destructiveButton: string
  dropzone: string
  genericButton: string
  genericButtonBlock: string
  headerColor: string
  noteBorder: string
  profileCardHeader: string
  /** The gift-purchase table's surface, text, and divider treatment. */
  purchaseTable: string
  reminderHeader: string
  reminderHr: string
  reminderTags: string
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
  'primary' | 'secondary' | 'danger' | 'info' | 'warning' | 'success' | 'light' | 'dark'
