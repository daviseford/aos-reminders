import jsPDF from 'jspdf'
import { sum, slice } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { ICompactPdfTextObj, TPdfStyles, TSavePdfType } from 'types/pdf'

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
  readonly _doc: jsPDF

  // Keeping track of pages here
  _pages: ICompactPdfTextObj[][] = [[]]
  _pageIdx: number = 0
  _currentPage = this._pages[0]
  _pageY: number

  // Phase information
  _phases: IPhaseAndRuleObj[] = []
  _phaseHeight: number

  constructor(_doc: jsPDF, _opts: IPageOpts, _style: TPdfStyles) {
    this._doc = _doc
    this._opts = _opts
    this._style = _style
    this._pageY = this._opts.yMargin
    this._phaseHeight = _style.phase.spacing
  }

  // Utilities
  private _resetY = () => {
    this._pageY = this._opts.yMargin
  }
  private _willOverrunY = (val: number) => this._pageY + val > this._opts.pageBottom
  private _yRemaining = (): number => this._opts.pageBottom - this._pageY
  private _getInitialXY = () => [this._opts.xMargin, this._opts.yMargin]
  private _goToNextPage = () => {
    this._resetY()
    this._pages.push([])
    this._pageIdx = this._pageIdx + 1
    this._currentPage = this._pages[this._pageIdx]
  }
  private _addToCurrentPage = (obj: ICompactPdfTextObj) => {
    this._currentPage.push(obj)
    if (obj.position === 'col1') return // Don't adjust spacing for col1
    this._pageY = this._pageY + this._style[obj.type].spacing
  }
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
        if (this._willOverrunY(heightOfAllRules + this._phaseHeight)) {
          this._goToNextPage() // If it won't fit on this page, go to the next one
        }
        this._addToCurrentPage(phase) // Add the phase and rules to the page
        return Cols.full.forEach(line => this._addToCurrentPage(line))
      }
    }

    // See if we should start on this page, or the next one
    const rule1Height = this._getRuleHeight(rules[0])
    const rule2Height = this._getRuleHeight(rules[1])
    if (
      this._willOverrunY(rule1Height + this._phaseHeight) ||
      this._willOverrunY(rule2Height + this._phaseHeight)
    ) {
      // We need to go to the next page
      this._goToNextPage()
    }

    // Okay, we know that at least the first two rules will fit
    this._addToCurrentPage(phase) // Add the phase

    const halfHeight = this._getRulesHeight(rules) / 2

    let col0H = 0
    let col1H = 0
    let col0IsFull = false

    rules.forEach((r, ri) => {
      const ruleHeight = this._getRuleHeight(r)
      const remainingRules = slice(rules, ri)
      const remainingRulesHeight = this._getRulesHeight(remainingRules)

      if (col0H < halfHeight && !col0IsFull) {
        if (this._willOverrunY(ruleHeight)) {
          // We can't add this because it would go over the page
          // So we need to check if we can add it to column 1
          if (this._willOverrunY(ruleHeight - col0H)) {
            // We need to go to the next page and start fresh
            this._goToNextPage()
            this._addToCurrentPage({ ...phase, text: `${phase.text} (continued)` })
            col0IsFull = false
            col0H = 0 + ruleHeight // Update the column height
            col1H = 0
            return r.forEach(line => this._addToCurrentPage({ ...line, position: 'col0' }))
          } else {
            // We can add it to column 1
            col0IsFull = true
            col1H = 0 + ruleHeight
            return r.forEach(line => this._addToCurrentPage({ ...line, position: 'col1' }))
          }
        } else if (remainingRulesHeight <= col0H) {
          // If the remaining height of all the rules we have left is less than col0
          // Let's just assign them to col1 so we can a fairly even distribution
          col0IsFull = true
        } else if (ri === rules.length - 1) {
          // If it's the last rule and we still haven't switched columns, we need to force the switch
          col0IsFull = true // Set this to true, and our col1 logic below will handle it
        } else {
          // Okay column 0 is not full yet and we can fit it on the page, add it to there
          col0H = col0H + ruleHeight // Update the column height
          return r.forEach(line => this._addToCurrentPage({ ...line, position: 'col0' }))
        }
      }

      if (col0IsFull || col0H >= halfHeight) {
        col0IsFull = true
        // Okay column 0 is full, let's see if we can add it to column 1
        // Removing the height of col0 because it's already been added to the Y axis
        if (this._willOverrunY(col1H - col0H + ruleHeight)) {
          // Oh shit, it's gonna overrun, we need to go to the next page and start this whole cycle over
          this._goToNextPage()
          this._addToCurrentPage({ ...phase, text: `${phase.text} (continued)` })
          col0IsFull = false
          col0H = 0 + ruleHeight // Update the column height
          col1H = 0
          return r.forEach(line => this._addToCurrentPage({ ...line, position: 'col0' }))
        } else {
          col1H = col1H + ruleHeight
          return r.forEach(line => this._addToCurrentPage({ ...line, position: 'col1' }))
        }
      }
    })

    // We have a remaining full width rule to add!
    if (Cols.full.length > 0) {
      const toCol = this.__fullToCol(Cols.full, 'col1')
      const colRuleHeight = this._getRuleHeight(toCol)
      const fullRuleHeight = this._getRuleHeight(Cols.full)

      // Can we shoehorn this into col1? If so, convert to a column layout and stick it in there
      if (col1H + colRuleHeight <= col0H) {
        col1H = col1H + colRuleHeight
        return toCol.forEach(line => this._addToCurrentPage(line))
      } else if (this._willOverrunY(fullRuleHeight)) {
        // Go to next page before adding it
        this._goToNextPage()
        this._addToCurrentPage({ ...phase, text: `${phase.text} (continued)` })
      }
      // Drop it on this page, and we're done :D
      return Cols.full.forEach(line => this._addToCurrentPage(line))
    }

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

  /**
   * Converts a full-width rule to a column
   */
  private __fullToCol = (rule: ICompactPdfTextObj[], position: 'col0' | 'col1'): ICompactPdfTextObj[] => {
    const updated = rule
      .map(r => {
        if (r.type === 'titlespacer') return { ...r, position }

        const lineW = r.type === 'title' ? this._opts.colTitleLineWidth : this._opts.colLineWidth

        const lines: string[] = this._doc.splitTextToSize(r.text, lineW)
        return lines.map(text => ({
          type: r.type,
          text: text.trim(),
          position: position,
        }))
      })

      .flat()

    return updated
  }

  getReminderText = (reminders: IReminder): void => {
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
        const titleLines: string[] = this._doc.splitTextToSize(this.__getTitle(action), titleWidth)
        titleLines.forEach(text => {
          ruleObj.push({
            type: 'title',
            text: text.trim(),
            position,
          })
        })

        // Handle description
        const descLines: string[] = this._doc.splitTextToSize(action.desc, lineWidth)
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

    this._phases = Phases
  }
}
