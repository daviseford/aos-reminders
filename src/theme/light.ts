import { ITheme } from 'types/theme'

const bgColor = `bg-white`

const LightTheme: ITheme = {
  bgColor,
  card: `card`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone`,
  genericButton: `btn btn-outline-dark`,
  genericButtonBlock: `btn btn-outline-dark btn-block`,
  headerColor: `bg-themeDarkBluePrimary`,
  modalConfirmClass: `btn btn-outline-dark ml-3 mr-5`,
  modalDangerClass: `btn btn-outline-danger ml-3`,
  noteBorder: `NoteBorder`,
  profileCardHeader: `card-header bg-profileHeader text-dark mb-0 pb-1`,
  reminderHeader: `bg-themeDarkBluePrimary`,
  reminderHr: `ReminderHr`,
  secondaryButton: `btn btn-sm btn-outline-secondary`,
  selectTheme: {},
  text: `text-dark`,
  textMuted: `text-muted`,
  textOpposite: `text-white`,
  textSecondary: `text-secondary`,
  tooltip: 'error',
}

export default LightTheme
