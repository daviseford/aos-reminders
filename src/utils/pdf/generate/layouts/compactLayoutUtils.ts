import jsPDF from 'jspdf'
import { findIndex, slice, sum, range, last, ceil, chunk } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { ICompactPdfTextObj, TPdfStyles, TSavePdfType } from 'types/pdf'
import { ICurrentArmy } from 'types/army'
import { IAllySelections } from 'types/selections'

interface IPhaseAndRuleObj {
  phase: ICompactPdfTextObj
  rules: ICompactPdfTextObj[][]
}

interface IRulesToColumns {
  col0: ICompactPdfTextObj[][]
  col1: ICompactPdfTextObj[][]
  full: ICompactPdfTextObj[]
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
  _currentPage = this._pages[0]
  _pageY: number

  // Phase information
  _phases: IPhaseAndRuleObj[] = []

  constructor(_opts: IPageOpts, _style: TPdfStyles) {
    this._opts = _opts
    this._style = _style
    this._pageY = this._opts.yMargin
  }

  // Utilities
  private _resetY = () => {
    this._pageY = this._opts.yMargin
  }
  private _willOverrunY = (val: number) => this._pageY + val > this._opts.pageBottom
  private _yRemaining = (): number => this._opts.pageBottom - this._pageY
  private _getInitialXY = () => [this._opts.xMargin, this._opts.yMargin]
  private _goToNextPage = () => {
    this._pages.push([])
    this._pageIdx = this._pageIdx + 1
    this._currentPage = this._pages[this._pageIdx]
  }
  private _addToCurrentPage = (obj: ICompactPdfTextObj) => {
    this._currentPage.push(obj)
    this._pageY = this._pageY + this._style[obj.type].spacing
  }
  private _getPhaseHeight = () => this._style.phase.spacing
  private _getRuleHeight = (rule: ICompactPdfTextObj[]) => sum(rule.map(y => this._style[y.type].spacing))
  private _getRulesHeight = (rules: ICompactPdfTextObj[][]) =>
    sum(rules.map(x => x.map(y => this._style[y.type].spacing)).flat())

  private _addPhaseAndRuleObjToPages = ({ rules, phase }: IPhaseAndRuleObj) => {
    const Cols = {
      col0: [],
      col1: [],
      full: [],
    } as IRulesToColumns

    const heightOfAllRules = this._getRulesHeight(rules)

    // If there's an odd number of rules, add the last rule 'full'
    if (rules.length % 2 === 1) {
      Cols.full = rules.pop() as ICompactPdfTextObj[]
      // If there was only one rule and it'll fit with the phase, we're done now
      if (!rules.length) {
        if (this._willOverrunY(heightOfAllRules + this._getPhaseHeight())) {
          this._goToNextPage() // If it won't fit on this page, go to the next one
        }
        this._addToCurrentPage(phase) // Add the phase and rules to the page
        Cols.full.forEach(line => this._addToCurrentPage(line))
      }
      return
    }

    const halfHeight = this._getRulesHeight(rules) / 2
    const left = [] as ICompactPdfTextObj[]
    let currentH = 0

    let currentLeftH = 0
    let desiredLeft = rules.reduce((a, b) => {
      if (currentLeftH >= halfHeight) return a
      currentLeftH = currentLeftH + this._getRuleHeight(b)
      a.push(b)
      return a
    }, [] as ICompactPdfTextObj[][])

    if (desiredLeft) rules.forEach((r, ri) => {})

    // const pivot = ceil(rules.length / 2);
    // const [left, right] = chunk(rules, pivot)

    debugger

    // if (this._willOverrunY(heightOfAllRules)) {
    //   console.log('Will overrun')
    // }

    return Cols
  }

  splitTextToPagesCompact = () => {
    this._phases.forEach(x => {
      this._addPhaseAndRuleObjToPages(x)
    })

    return this._pages
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
