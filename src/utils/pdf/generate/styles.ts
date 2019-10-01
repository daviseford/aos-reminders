export type TStyleType =
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

type TTextStyle = 'bold' | 'normal' | 'italic'

type TStyles = {
  [key in TStyleType]: {
    fontSize: number
    spacing: number
    style: TTextStyle
  }
}

export const Styles: TStyles = {
  army: {
    fontSize: 11.5,
    spacing: 0.22,
    style: 'normal',
  },
  armyEnd: {
    fontSize: 14,
    spacing: 0.18,
    style: 'bold',
  },
  armyFooter: {
    fontSize: 14,
    spacing: 0.28,
    style: 'bold',
  },
  armyName: {
    fontSize: 15,
    spacing: 0.3,
    style: 'bold',
  },
  break: {
    fontSize: 0,
    spacing: 0.14,
    style: 'normal',
  },
  desc: {
    fontSize: 11,
    spacing: 0.22,
    style: 'normal',
  },
  phase: {
    fontSize: 14,
    spacing: 0.28,
    style: 'bold',
  },
  spacer: {
    fontSize: 0,
    spacing: 0.28,
    style: 'normal',
  },
  title: {
    fontSize: 11.5,
    spacing: 0.22,
    style: 'bold',
  },
  titlespacer: {
    fontSize: 0,
    spacing: 0.1,
    style: 'normal',
  },
}
