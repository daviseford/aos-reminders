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
  primary50: '#93A9FA', // $themeYellow
  // primary75: 'var(--primary-75)',
}

const bgColor = `bg-themeDarkBlueSecondary`

const DarkTheme: ITheme = {
  bgColor,
  card: `card border border-dark`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone-dark`,
  genericButton: `btn btn-outline-light`,
  genericButtonBlock: `btn btn-outline-light btn-block`,
  headerColor: bgColor,
  modalConfirmClass: `btn btn-outline-light ml-3 mr-5`,
  modalDangerClass: `btn btn-danger ml-3`,
  profileCardHeader: `card-header bg-profileHeader text-dark mb-0 pb-1`,
  reminderHeader: `bg-themeLightBlue`,
  secondaryButton: `btn btn-sm btn-outline-secondary`,
  selectTheme,
  text: `text-white`,
  textMuted: `text-white-75`,
  textOpposite: `text-dark`,
  textSecondary: `text-light`,
  tooltip: 'light',
}

export default DarkTheme
