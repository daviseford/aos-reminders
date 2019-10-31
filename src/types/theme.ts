// type TThemeEntry =
//   | {
//       [key: string]: string
//     }
//   | string
//   | string[]

export interface ITheme {
  bgColor: string

  text: string
  textSecondary: string
  textMuted: string

  genericButton: string
  secondaryButton: string

  [key: string]: string
}
