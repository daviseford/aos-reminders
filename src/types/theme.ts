export interface ITheme {
  bgColor: string

  text: string
  textMuted: string
  textOpposite: string
  textSecondary: string

  genericButton: string
  secondaryButton: string

  headerColor: string
  reminderHeader: string
  selectorHeader: string

  cardBorder: string

  selectTheme: {
    [key: string]: string
  }
}
