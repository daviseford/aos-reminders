import { ITheme } from 'types/theme'

const bgColor = `bg-white`

const LightTheme: ITheme = {
  bgColor,
  card: `card`,
  cardBody: `card-body ${bgColor}`,
  cardHeader: `card-header bg-themeLightBlue text-white`,
  dropzone: `dropzone`,
  genericButton: `btn btn-outline-dark btn-block`,
  headerColor: `bg-themeDarkBluePrimary`,
  modal: 'Modal-Light',
  modalConfirmClass: `btn btn-outline-dark ml-3 mr-5`,
  modalDenyClass: `btn btn-outline-danger ml-3`,
  modalOverlay: 'Overlay-Light',
  profileCardHeader: `card-header bg-profileHeader text-dark mb-0 pb-1`,
  reminderHeader: `bg-themeDarkBluePrimary`,
  secondaryButton: `btn btn-sm btn-outline-secondary`,
  selectTheme: {},
  text: `text-dark`,
  textMuted: `text-muted`,
  textOpposite: `text-white`,
  textSecondary: `text-secondary`,
}

export default LightTheme
