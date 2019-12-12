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
  readonly __page: IPageOpts
  readonly __styles: TPdfStyles
  readonly __type: TSavePdfType

  constructor(__page: IPageOpts, __styles: TPdfStyles) {
    this.__page = __page
    this.__styles = __styles
    this.__type = 'compact'
  }

  getInitialXY = () => [this.__page.xMargin, this.__page.yMargin]

  private __getSelections = (doc: jsPDF) => (
    name: string,
    items: string[],
    pluralize: boolean = true
  ): ICompactPdfTextObj[] => {
    if (items.length === 0) return []
    const title = !pluralize ? name : items.length > 1 ? `${name}s` : name
    const str = `${title}: ${items.join(' | ')}`

    const lines: string[] = doc.splitTextToSize(str, this.__page.maxLineWidth)

    return lines.map(text => ({
      type: 'army',
      text: text.trim().replace(/\|$/g, ''), // remove trailing pipe from EOL
      position: 'full',
    }))
  }

  getPhaseInfoCompact = (allText: ICompactPdfTextObj[]): IPdfPhaseText[] => {
    let ruleCount = 0
    let colIdx: 0 | 1 = 0

    return allText.reduce((a, textObj) => {
      const currentPhaseIdx = a.length - 1

      if (textObj.type === 'phase') {
        colIdx = 0
        ruleCount = 0
        // We add a spacer after a phase, so represent that here
        if (currentPhaseIdx > 0) {
          a[currentPhaseIdx] = {
            ...a[currentPhaseIdx],
            yHeight: a[currentPhaseIdx].yHeight + this.__styles.spacer.spacing,
          }
        }
        // And then push the new phase onto the accumulator
        a.push({
          canFitOnPage: true,
          yHeight: this.getInitialXY()[1],
          phase: textObj.text,
        })
      } else {
        if (textObj.type === 'title') {
          ruleCount = ruleCount + 1
        } else if (textObj.type === 'titlespacer' && ruleCount > 0) {
          colIdx = colIdx === 0 ? 1 : 0
        }

        const yHeight =
          colIdx === 0
            ? a[currentPhaseIdx].yHeight + this.__styles[textObj.type].spacing
            : a[currentPhaseIdx].yHeight
        a[currentPhaseIdx] = {
          ...a[currentPhaseIdx],
          yHeight,
          canFitOnPage: yHeight < this.__page.pageBottom,
        }
      }
      return a
    }, [] as IPdfPhaseText[])
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

    const ySpacing = this.__styles.spacer.spacing * 4

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
        y = y + this.__styles.spacer.spacing
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
        this.__styles.phase.spacing + sum(firstAction.map(x => this.__styles[x.type].spacing))

      let titleSpace: ICompactPdfTextObj = {
        type: 'titlespacer',
        text: '',
        position: firstAction[0].position,
      }

      if (y + firstActionYHeight + ySpacing >= this.__page.pageBottom) {
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

        let itemsYHeight = sum(items.map(x => this.__styles[x.type].spacing))

        if (colIdx === 0) col0Heights.push(itemsYHeight)

        if (y + itemsYHeight + ySpacing >= this.__page.pageHeight) {
          // Go to next page, with the phase
          let phaseContinued: ICompactPdfTextObj = {
            ...phase,
            text: `${phase.text} (continued)`,
          }
          pageIdx++
          pages.push([])
          y = this.getInitialXY()[1] + itemsYHeight + this.__styles.phase.spacing
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
    const armyTextYHeight = sum(armyText.map(x => this.__styles[x.type].spacing))
    if (y + armyTextYHeight >= this.__page.pageBottom) {
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

  getArmyText = (
    doc: jsPDF,
    { allyFactionNames, allySelections, factionName, realmscape_feature, selections }: ICurrentArmy
  ): ICompactPdfTextObj[] => {
    const {
      allegiances,
      artifacts,
      battalions,
      commands,
      endless_spells,
      scenery,
      spells,
      traits,
      triumphs,
      units,
    } = selections

    const realmFeature = realmscape_feature ? [realmscape_feature] : []

    let text: ICompactPdfTextObj[] = [
      { text: '', type: 'spacer', position: 'full' },
      { text: '', type: 'spacer', position: 'full' },
      { text: titleCase(factionName), type: 'armyName', position: 'full' },
    ]

    const getText = this.__getSelections(doc)

    const selectionText = [
      getText('Unit', units),
      ...allyFactionNames.map(n =>
        getText(`Allied ${titleCase(n)} Unit`, (allySelections[n] as IAllySelections).units)
      ),
      getText('Artifact', artifacts),
      getText('Battalion', battalions),
      ...allyFactionNames.map(n =>
        getText(`Allied ${titleCase(n)} Battalion`, (allySelections[n] as IAllySelections).battalions || [])
      ),
      getText('Command Trait', traits),
      getText('Command Abilities', commands, false),
      getText('Allegiance', allegiances),
      getText('Spell', spells),
      getText('Endless Spell', endless_spells),
      getText('Scenery', scenery, false),
      getText('Realmscape Feature', realmFeature),
      getText('Triumph', triumphs),
    ].flat()

    const endText: ICompactPdfTextObj[] = [
      { text: '', type: 'spacer', position: 'full' },
      { text: 'Generated by AoS Reminders', type: 'armyFooter', position: 'full' },
      { text: 'aosreminders.com', type: 'armyEnd', position: 'full' },
    ]

    return text.concat(selectionText, endText)
  }

  getReminderText = (doc: jsPDF, reminders: IReminder): ICompactPdfTextObj[] => {
    let allText: ICompactPdfTextObj[] = []

    Object.keys(reminders).forEach(phase => {
      // Handle phase title (Start of Round)
      allText.push({
        type: 'phase',
        text: titleCase(phase),
        position: 'full',
      })

      const numRulesInPhase = reminders[phase].length

      let colIdx: 0 | 1 = 0

      reminders[phase].forEach((action, i) => {
        // Handle action title

        // Display last rules in full since they won't have a matching partner
        const isLastRuleAndOdd = i + 1 === numRulesInPhase && (i + 1) % 2 === 1

        const position = isLastRuleAndOdd ? 'full' : colIdx === 0 ? 'col0' : 'col1'

        const titleWidth = isLastRuleAndOdd ? this.__page.maxTitleLineWidth : this.__page.colTitleLineWidth

        const lineWidth = isLastRuleAndOdd ? this.__page.maxLineWidth : this.__page.colLineWidth

        // Add a titlespacer
        allText.push({
          type: 'titlespacer',
          text: '',
          position,
        })

        // Add the title itself
        const titleLines: string[] = doc.splitTextToSize(this.__getTitle(action), titleWidth)
        titleLines.forEach(text => {
          allText.push({
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
          allText.push({
            type,
            text: trimmed,
            position,
          })
        })

        if (!isLastRuleAndOdd) {
          colIdx = colIdx === 0 ? 1 : 0
        }
      })
    })

    return allText
  }
}
