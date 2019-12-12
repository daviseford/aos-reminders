import jsPDF from 'jspdf'
import { findIndex, slice, sum, range, last } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { ICompactPdfTextObj, TPdfStyles, IPdfPhaseText, TSavePdfType } from 'types/pdf'
import { ICurrentArmy } from 'types/army'
import { IAllySelections } from 'types/selections'

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
  readonly _pages: ICompactPdfTextObj[][] = [[]]
  readonly _pageIdx: number = 0
  readonly _pageY: number

  _phases: ICompactPdfTextObj[][] = [[]]

  constructor(_opts: IPageOpts, _style: TPdfStyles) {
    this._opts = _opts
    this._style = _style
    this._pageY = this._opts.yMargin
  }

  getInitialXY = () => [this._opts.xMargin, this._opts.yMargin]

  private _willOverrunY = (val: number): boolean => {
    return this._pageY + val > this._opts.pageBottom
  }

  splitTextToPagesCompact = (
    allText: ICompactPdfTextObj[],
    phaseInfo: IPdfPhaseText[],
    armyText: ICompactPdfTextObj[]
  ) => {
    let y = this.getInitialXY()[1]
    let pages: ICompactPdfTextObj[][] = [[]]
    let pageIdx = 0

    let phaseInfoIdx = 0
    let currentPhaseInfo = phaseInfo[phaseInfoIdx]
    let textPhaseIdx = 0
    let colIdx: 0 | 1 = 0

    let col0Heights: number[] = []

    const ySpacing = this._style.spacer.spacing * 4

    allText.forEach((textObj, i) => {
      if (i === allText.length - 1 && textObj.type !== 'phase') {
        const lastEntry = last(pages[pageIdx])
        // Avoid duplicate additions (fixes issue #643)
        if (lastEntry && textObj.text !== lastEntry.text) {
          return pages[pageIdx].push(textObj)
        }
      }

      if (textObj.type !== 'phase') return

      if (textObj.text !== currentPhaseInfo.phase) {
        // New phase, handle
        currentPhaseInfo = phaseInfo[phaseInfoIdx]
        // Insert spacer for new phases
        pages[pageIdx].push({
          text: '',
          type: 'spacer',
          position: 'full',
        })
        y = y + this._style.spacer.spacing
        if (!currentPhaseInfo) return console.log('Done processing phases')
      }

      colIdx = 0
      let titleIdx = 1
      let nextPhaseIdx: number | undefined = undefined
      if (!!phaseInfo[phaseInfoIdx + 1]) {
        nextPhaseIdx = findIndex(allText, x => x.text === phaseInfo[phaseInfoIdx + 1].phase)
      }

      const objs = slice(allText, textPhaseIdx, nextPhaseIdx)
      const phase = objs.shift() as ICompactPdfTextObj

      const numTitles = objs.filter(x => x.type === 'title').length

      // Handle first action
      let nextTitleIdx = findIndex(objs, x => x.type === 'title', 2)
      let firstAction = slice(objs, 0, nextTitleIdx === -1 ? undefined : nextTitleIdx)
      let firstActionYHeight =
        this._style.phase.spacing + sum(firstAction.map(x => this._style[x.type].spacing))

      let titleSpace: ICompactPdfTextObj = {
        type: 'titlespacer',
        text: '',
        position: firstAction[0].position,
      }

      if (y + firstActionYHeight + ySpacing >= this._opts.pageBottom) {
        // Go to next page
        pageIdx = pageIdx + 1
        pages.push([])
        y = this.getInitialXY()[1] + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, titleSpace, ...firstAction)
        titleIdx = nextTitleIdx
        colIdx = 0
      } else {
        // Put on this page
        y = y + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, titleSpace, ...firstAction)
        titleIdx = nextTitleIdx
        colIdx = 1
        col0Heights.push(firstActionYHeight)
      }

      range(0, numTitles - 1).forEach(i => {
        nextTitleIdx = findIndex(objs, x => x.type === 'title', titleIdx + 1)
        if (objs[titleIdx + 1].type === 'title') {
          // Sometimes titles can stack up on each other and throw off the true nextTitleIdx
          // We need to avoid that
          const attachedTitleEnd = findIndex(
            objs,
            (x, ii) => x.type === 'title' && objs[ii + 1].type === 'desc',
            titleIdx
          )
          nextTitleIdx = findIndex(objs, x => x.type === 'title', attachedTitleEnd + 1)
        }
        let items = slice(objs, titleIdx, nextTitleIdx === -1 ? undefined : nextTitleIdx)

        if (items[0] && items[0].type === 'titlespacer') items.shift() // Remove leading titlespacers

        if (!items.length) return

        let itemsYHeight = sum(items.map(x => this._style[x.type].spacing))

        if (colIdx === 0) col0Heights.push(itemsYHeight)

        if (y + itemsYHeight + ySpacing >= this._opts.pageHeight) {
          // Go to next page, with the phase
          let phaseContinued: ICompactPdfTextObj = {
            ...phase,
            text: `${phase.text} (continued)`,
          }
          pageIdx++
          pages.push([])
          y = this.getInitialXY()[1] + itemsYHeight + this._style.phase.spacing
          pages[pageIdx] = pages[pageIdx].concat(phaseContinued, titleSpace, ...items)
          titleIdx = nextTitleIdx
          colIdx = 0
        } else {
          // Put on this page
          const nextHeight =
            colIdx === 0
              ? y + itemsYHeight // Adjust y to accomodate col0 entry
              : col0Heights[col0Heights.length - 1] >= itemsYHeight // If we've already adjusted y for col0, and col0 is the same or greater height than the col1 entry
              ? y // Then we don't need to modify y at all
              : y + (itemsYHeight - col0Heights[col0Heights.length - 1]) // Otherwise, we need to add the difference to y so we have the proper spacing

          y = nextHeight
          pages[pageIdx] = pages[pageIdx].concat(items)
          titleIdx = nextTitleIdx
          colIdx = colIdx === 0 ? 1 : 0
        }
      })
      if (nextPhaseIdx) textPhaseIdx = nextPhaseIdx
      phaseInfoIdx++
    })

    // Handle armyText
    const armyTextYHeight = sum(armyText.map(x => this._style[x.type].spacing))
    if (y + armyTextYHeight >= this._opts.pageBottom) {
      // Place on next page
      pageIdx++
      pages.push([])
      y = this.getInitialXY()[1] + armyTextYHeight
    } else {
      // Put on this page
      y = y + armyTextYHeight
    }
    pages[pageIdx] = pages[pageIdx].concat(...armyText)

    return pages
  }

  private __getTitle = (action: TTurnAction) => {
    const title = getActionTitle(action)
    const titleStr = title ? `${title} - ` : ``
    return `${titleStr}${action.name}${action.tag ? ` (${action.tag})` : ``}`
  }

  getReminderText = (doc: jsPDF, reminders: IReminder): ICompactPdfTextObj[][] => {
    const Phases: ICompactPdfTextObj[][] = []
    let phaseIdx = 0

    Object.keys(reminders).forEach(phase => {
      // Handle phase title (Start of Round)
      Phases[phaseIdx] = [
        {
          type: 'phase',
          text: titleCase(phase),
          position: 'full',
        },
      ]

      const numRulesInPhase = reminders[phase].length

      reminders[phase].forEach((action, i) => {
        // Handle action title

        // Display last rules in full since they won't have a matching partner
        const isLastRuleAndOdd = i + 1 === numRulesInPhase && (i + 1) % 2 === 1

        const position = isLastRuleAndOdd ? 'full' : 'col'

        const titleWidth = isLastRuleAndOdd ? this._opts.maxTitleLineWidth : this._opts.colTitleLineWidth

        const lineWidth = isLastRuleAndOdd ? this._opts.maxLineWidth : this._opts.colLineWidth

        // Add a titlespacer
        Phases[phaseIdx].push({
          type: 'titlespacer',
          text: '',
          position,
        })

        // Add the title itself
        const titleLines: string[] = doc.splitTextToSize(this.__getTitle(action), titleWidth)
        titleLines.forEach(text => {
          Phases[phaseIdx].push({
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
          Phases[phaseIdx].push({
            type,
            text: trimmed,
            position,
          })
        })

        phaseIdx++
      })
    })

    // TODO eventually just remove the return and only assign
    this._phases = Phases

    return Phases
  }
}
