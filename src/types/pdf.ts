import { ICurrentArmy } from './army'
import { IReminder } from './data'

export type TPdfStylePdf =
  | 'army'
  | 'armyEnd'
  | 'armyFooter'
  | 'armyName'
  | 'break'
  | 'desc'
  | 'phase'
  | 'spacer'
  | 'title'
  | 'titlespacer'

type TPdfTextStyle = 'bold' | 'normal' | 'italic'

export type TPdfStyles = {
  [key in TPdfStylePdf]: {
    fontSize: number
    spacing: number
    style: TPdfTextStyle
  }
}

export type TSavePdfType = 'default' | 'compact' | 'title-only'

export interface IPdfTextObj {
  type: TPdfStylePdf
  text: string
}

export interface IPrintPdf extends ICurrentArmy {
  hiddenReminders: string[]
  reminders: IReminder
}

export interface IPdfPhaseText {
  canFitOnPage: boolean
  yHeight: number
  phase: string
}
