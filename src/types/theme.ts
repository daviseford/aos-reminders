export interface ITheme {
  bgColor: string

  text: string
  textMuted: string
  textOpposite: string
  textSecondary: string

  genericButton: string
  secondaryButton: string

  reminderHeader: string

  selectTheme: {
    [key: string]: string
  }
}
