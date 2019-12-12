import jsPDF from 'jspdf'
import { findIndex, slice, sum, range, last } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { ICompactPdfTextObj, TPdfStyles, IPdfPhaseText, TSavePdfType } from 'types/pdf'
import { ICurrentArmy } from 'types/army'
import { IAllySelections } from 'types/selections'

interface IPhaseAndRuleObj {
  phase: ICompactPdfTextObj
  rules: ICompactPdfTextObj[][]
}

interface IPageOpts {
  colLineWidth: number
  colTitleLineWidth: number
  maxLineWidth: number
  maxTitleLineWidth: number
  pageBottom: number
  pageHeight: number
  xMargin: number
  yMargin: number
}

export default class CompactPdfLayout {
  readonly _opts: IPageOpts
  readonly _style: TPdfStyles
  readonly _type: TSavePdfType = 'compact'

  // Keeping track of pages here
  _pages: ICompactPdfTextObj[][] = [[]]
  _pageIdx: number = 0
  _pageY: number

  // Phase information
  _phases: IPhaseAndRuleObj[] = []

  constructor(_opts: IPageOpts, _style: TPdfStyles) {
    this._opts = _opts
    this._style = _style
    this._pageY = this._opts.yMargin
  }

  // Utilities
  private _willOverrunY = (val: number) => this._pageY + val > this._opts.pageBottom
  private _yRemaining = (): number => this._opts.pageBottom - this._pageY
  private _getInitialXY = () => [this._opts.xMargin, this._opts.yMargin]

  splitTextToPagesCompact = () => {
    let y = this._getInitialXY()[1]
    let pages: ICompactPdfTextObj[][] = [[]]
    let pageIdx = 0

    let phaseInfoIdx = 0
    // let currentPhaseInfo = phaseInfo[phaseInfoIdx]
    let textPhaseIdx = 0
    let colIdx: 0 | 1 = 0

    let col0Heights: number[] = []

    const ySpacing = this._style.spacer.spacing * 4

    return pages
  }

  private __getTitle = (action: TTurnAction) => {
    const title = getActionTitle(action)
    const titleStr = title ? `${title} - ` : ``
    return `${titleStr}${action.name}${action.tag ? ` (${action.tag})` : ``}`
  }

  getReminderText = (doc: jsPDF, reminders: IReminder): IPhaseAndRuleObj[] => {
    const Phases: IPhaseAndRuleObj[] = []

    Object.keys(reminders).forEach(phase => {
      const phaseObj = {
        // Handle phase title (Start of Round)
        phase: {
          type: 'phase',
          text: titleCase(phase),
          position: 'full',
        },
        rules: [],
      } as IPhaseAndRuleObj

      const numRulesInPhase = reminders[phase].length

      reminders[phase].forEach((action, i) => {
        const ruleObj = [] as ICompactPdfTextObj[]
        // Handle action title

        // Display last rules in full since they won't have a matching partner
        const isLastRuleAndOdd = i + 1 === numRulesInPhase && (i + 1) % 2 === 1

        const position = isLastRuleAndOdd ? 'full' : 'col'

        const titleWidth = isLastRuleAndOdd ? this._opts.maxTitleLineWidth : this._opts.colTitleLineWidth

        const lineWidth = isLastRuleAndOdd ? this._opts.maxLineWidth : this._opts.colLineWidth

        // Add a titlespacer
        ruleObj.push({
          type: 'titlespacer',
          text: '',
          position,
        })

        // Add the title itself
        const titleLines: string[] = doc.splitTextToSize(this.__getTitle(action), titleWidth)
        titleLines.forEach(text => {
          ruleObj.push({
            type: 'title',
            text: text.trim(),
            position,
          })
        })

        // Handle description
        const descLines: string[] = doc.splitTextToSize(action.desc, lineWidth)
        descLines.forEach(text => {
          const trimmed = text.trim()
          const type = trimmed === '' ? 'break' : 'desc'
          ruleObj.push({
            type,
            text: trimmed,
            position,
          })
        })

        phaseObj.rules.push(ruleObj)
      })

      Phases.push(phaseObj)
    })

    // TODO eventually just remove the return and only assign
    this._phases = Phases

    return Phases
  }
}
