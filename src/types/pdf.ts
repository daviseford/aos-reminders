import { ICurrentArmy } from 'types/army'
import { IReminder } from 'types/data'
import { INote } from './notes'

type TPdfStylePdf =
  | 'army'
  | 'armyEnd'
  | 'armyFooter'
  | 'armyName'
  | 'break'
  | 'desc'
  | 'note'
  | 'phase'
  | 'spacer'
  | 'title'
  | 'titlespacer'

type TPdfTextStyle = 'bold' | 'normal' | 'italic'

export type TPdfStyles = Record<
  TPdfStylePdf,
  {
    fontSize: number
    spacing: number
    style: TPdfTextStyle
  }
>

export type TSavePdfType = 'default' | 'compact'

export interface ICompactPdfTextObj {
  type: TPdfStylePdf
  text: string
  position: 'col' | 'full' | 'col0' | 'col1'
}

export interface IPrintPdf extends ICurrentArmy {
  hiddenReminders: string[]
  reminders: IReminder
  notes: INote[]
}
