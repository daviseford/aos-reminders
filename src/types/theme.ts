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
  [key: string]: string
}
