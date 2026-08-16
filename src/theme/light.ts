import { invariantButtons } from 'theme/helperClasses'
import { ITheme } from 'types/theme'

const bgColor = `bg-white`

const LightTheme: ITheme = {
  // `alertActionButton`, `commitButton`, `destructiveButton` — identical in both themes by design.
  ...invariantButtons,
  bgColor,
  card: `card`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone`,
  genericButton: `btn btn-outline-dark`,
  genericButtonBlock: `btn btn-outline-dark d-block w-100`,
  headerColor: `bg-themeDarkBluePrimary`,
  noteBorder: `NoteBorder`,
  profileCardHeader: `card-header bg-profileHeader text-dark`,
  purchaseTable: `GiftPurchaseTable-Light`,
  reminderHeader: `bg-themeDarkBluePrimary`,
  reminderHr: `ReminderHr`,
  reminderTags: `ReminderTags-Light`,
  sectionBand: `bg-light`,
  selectTheme: {},
  text: `text-dark`,
  textMuted: `text-muted`,
  textOpposite: `text-white`,
  textSecondary: `text-secondary`,
  tooltip: 'error',
}

export default LightTheme
