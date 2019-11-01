import { ITheme } from 'types/theme'

const selectTheme = {
  /*
   * multiValue(remove)/color:hover
   */
  //  danger: 'var(--danger)',

  /*
   * multiValue(remove)/backgroundColor(focused)
   * multiValue(remove)/backgroundColor:hover
   */
  //  dangerLight: 'var(--danger-light)',

  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: '#182633', // $themeDarkBlueSecondary in theme.scss

  /*
   * control/backgroundColor(disabled)
   */
  //  neutral5: 'var(--neutral-5)',

  /*
   * control/borderColor(disabled)
   * multiValue/backgroundColor
   * indicators(separator)/backgroundColor(disabled)
   */
  neutral10: 'slategrey',

  /*
   * control/borderColor
   * option/color(disabled)
   * indicators/color
   * indicators(separator)/backgroundColor
   * indicators(loading)/color
   */
  neutral20: 'slategrey',

  /*
   * control/borderColor(focused)
   * control/borderColor:hover
   */
  // neutral30: 'var(--neutral-30)',

  /*
   * menu(notice)/color
   * singleValue/color(disabled)
   * indicators/color:hover
   */
  // neutral40: 'var(--neutral-40)',

  /*
   * placeholder/color
   */
  neutral50: 'white',

  /*
   * indicators/color(focused)
   * indicators(loading)/color(focused)
   */
  // neutral60: 'var(--neutral-60)',
  // neutral70: 'var(--neutral-70)',

  /*
   * input/color
   * multiValue(label)/color
   * singleValue/color
   * indicators/color(focused)
   * indicators/color:hover(focused)
   */
  neutral80: 'white',
  // neutral90: 'white',

  /*
   * control/boxShadow(focused)
   * control/borderColor(focused)
   * control/borderColor:hover(focused)
   * option/backgroundColor(selected)
   * option/backgroundColor:active(selected)
   */
  primary: 'white',

  /*
   * option/backgroundColor(focused)
   */
  primary25: 'slategrey',

  /*
   * option/backgroundColor:active
   */
  primary50: 'darkseagreen',
  // primary75: 'var(--primary-75)',
}

const DarkTheme: ITheme = {
  bgColor: `bg-themeDarkBlueSecondary`,
  cardBorder: `border border-dark`,
  dropzone: `dropzone-dark`,
  genericButton: `btn btn-outline-light btn-block`,
  headerColor: `bg-themeDarkBlueSecondary`,
  reminderHeader: `bg-themeLightBlue`,
  secondaryButton: `btn btn-sm btn-outline-secondary`,
  selectorHeader: `bg-themeLightBlue`,
  selectTheme,
  text: `text-white`,
  textMuted: `text-white-75`,
  textOpposite: `text-dark`,
  textSecondary: `text-light`,
}

export default DarkTheme
