import { invariantButtons } from 'theme/helperClasses'
import { ITheme } from 'types/theme'

const selectTheme = {
  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: '#182633', // $themeDarkBlueSecondary in theme.scss

  /*
   * control/backgroundColor(disabled)
   *
   * react-select defaults this to a near-white grey, so a disabled select rendered the one bright
   * box on a dark page — and with `neutral50` below set to white, its placeholder was white on
   * near-white. The Home masthead's reserved Army of Renown slot is the first disabled select the
   * app renders, so the slot gets a value rather than the default.
   */
  neutral5: '#182633',

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
  // `alertActionButton`, `commitButton`, `destructiveButton` — identical in both themes by design.
  ...invariantButtons,
  bgColor,
  card: `card border border-dark`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone-dark`,
  genericButton: `btn btn-outline-light`,
  genericButtonBlock: `btn btn-outline-light d-block w-100`,
  headerColor: bgColor,
  noteBorder: `NoteBorder-Dark`,
  /*
   * `.card` never gets a themed background, so the light theme's 15% wash composites over Bootstrap's
   * white card and renders as a bright band — the only light surface on a dark page, and louder than
   * the Signal Teal headers everywhere else. Dark supplies its own opaque value instead.
   */
  profileCardHeader: `card-header bg-profileHeader-dark text-white`,
  purchaseTable: `GiftPurchaseTable-Dark`,
  reminderHeader: `bg-themeLightBlue`,
  reminderHr: `ReminderHr-Dark`,
  reminderTags: `ReminderTags-Dark`,
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
