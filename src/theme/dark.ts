import { ITheme } from 'types/theme'

const selectTheme = {
  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: '#182633', // $themeDarkBlueSecondary in theme.scss

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
   * placeholder/color
   */
  neutral50: 'white',

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
}

const bgColor = `bg-themeDarkBlueSecondary`

const DarkTheme: ITheme = {
  bgColor,
  card: `card border border-dark`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone-dark`,
  genericButton: `btn btn-outline-light`,
  genericButtonBlock: `btn btn-outline-light d-block w-100`,
  headerColor: bgColor,
  modalConfirmClass: `btn btn-outline-light`,
  modalDangerClass: `btn btn-danger`,
  modalSuccessClass: `btn btn-outline-success`,
  noteBorder: `NoteBorder-Dark`,
  /*
   * `.card` never gets a themed background, so the light theme's 15% wash composites over Bootstrap's
   * white card and renders as a bright band — the only light surface on a dark page, and louder than
   * the Signal Teal headers everywhere else. Dark supplies its own opaque value instead.
   */
  profileCardHeader: `card-header bg-profileHeader-dark text-white`,
  reminderHeader: `bg-themeLightBlue`,
  reminderHr: `ReminderHr-Dark`,
  reminderTags: `ReminderTags-Dark`,
  secondaryButton: `btn btn-sm btn-outline-secondary`,
  /*
   * Light theme separates this band with a tonal shelf; dark theme separates with the card borders
   * instead, so the band takes the page colour. $themeDarkBluePrimary was the obvious candidate but
   * it is exactly what the plan-card headers already use — the headers would vanish into the band.
   */
  sectionBand: bgColor,
  selectTheme,
  text: `text-white`,
  textMuted: `text-white-75`,
  textOpposite: `text-dark`,
  textSecondary: `text-light`,
  tooltip: 'light',
}

export default DarkTheme
