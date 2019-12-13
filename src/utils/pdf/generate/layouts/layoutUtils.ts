import jsPDF from 'jspdf'
import { findIndex, slice, sum, range, last } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { IPdfTextObj, TPdfStyles, IPdfPhaseText, TSavePdfType } from 'types/pdf'
import { ICurrentArmy } from 'types/army'
import { IAllySelections } from 'types/selections'

interface IPageOpts {
  maxLineWidth: number
  maxTitleLineWidth: number
  pageBottom: number
  pageHeight: number
  xMargin: number
  yMargin: number
}

export default class PdfLayout {
  readonly __page: IPageOpts
  readonly __styles: TPdfStyles
  readonly __type: TSavePdfType

  constructor(__type: TSavePdfType, __page: IPageOpts, __styles: TPdfStyles) {
    this.__page = __page
    this.__styles = __styles
    this.__type = __type
  }

  getInitialXY = () => [this.__page.xMargin, this.__page.yMargin]

  private __getSelections = (doc: jsPDF) => (
    name: string,
    items: string[],
    pluralize: boolean = true
  ): IPdfTextObj[] => {
    if (items.length === 0) return []
    const title = !pluralize ? name : items.length > 1 ? `${name}s` : name
    const str = `${title}: ${items.join(' | ')}`

    const lines: string[] = doc.splitTextToSize(str, this.__page.maxLineWidth)

    return lines.map(text => ({
      type: 'army',
      text: text.trim().replace(/\|$/g, ''), // remove trailing pipe from EOL
    }))
  }

  /**
   * Do a loop of each phase and assign them a property: canFitOnPage, and yHeight
   * @param allText
   */
  getPhaseInfo = (allText: IPdfTextObj[]): IPdfPhaseText[] => {
    return allText.reduce((a, textObj) => {
      const currentPhaseIdx = a.length - 1

      if (textObj.type === 'phase') {
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
        const yHeight = a[currentPhaseIdx].yHeight + this.__styles[textObj.type].spacing
        a[currentPhaseIdx] = {
          ...a[currentPhaseIdx],
          yHeight,
          canFitOnPage: yHeight < this.__page.pageBottom,
        }
      }
      return a
    }, [] as IPdfPhaseText[])
  }

  splitTextToPages = (allText: IPdfTextObj[], phaseInfo: IPdfPhaseText[], armyText: IPdfTextObj[]) => {
    let y = this.getInitialXY()[1]
    let pages: IPdfTextObj[][] = [[]]
    let pageIdx = 0

    let phaseInfoIdx = 0
    let currentPhaseInfo = phaseInfo[phaseInfoIdx]
    let textPhaseIdx = 0

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
        })
        y = y + this.__styles.spacer.spacing
        if (!currentPhaseInfo) return console.log('Done processing phases')
      }

      let titleIdx = 1
      let nextPhaseIdx: number | undefined = undefined
      if (!!phaseInfo[phaseInfoIdx + 1]) {
        nextPhaseIdx = findIndex(allText, x => x.text === phaseInfo[phaseInfoIdx + 1].phase)
      }

      const objs = slice(allText, textPhaseIdx, nextPhaseIdx)
      const phase = objs.shift() as IPdfTextObj

      const numTitles = objs.filter(x => x.type === 'title').length

      // Handle first action
      let nextTitleIdx = findIndex(objs, x => x.type === 'title', 2)
      let firstAction = slice(objs, 0, nextTitleIdx === -1 ? undefined : nextTitleIdx)
      let firstActionYHeight =
        this.__styles.phase.spacing + sum(firstAction.map(x => this.__styles[x.type].spacing))

      let titleSpace: IPdfTextObj = {
        type: 'titlespacer',
        text: '',
      }

      if (y + firstActionYHeight + ySpacing >= this.__page.pageBottom) {
        // Go to next page
        pageIdx = pageIdx + 1
        pages.push([])
        y = this.getInitialXY()[1] + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, titleSpace, ...firstAction)
        titleIdx = nextTitleIdx
      } else {
        // Put on this page
        y = y + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, titleSpace, ...firstAction)
        titleIdx = nextTitleIdx
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
        let itemsYHeight = sum(items.map(x => this.__styles[x.type].spacing))

        if (y + itemsYHeight + ySpacing >= this.__page.pageBottom) {
          // Go to next page, with the phase
          let phaseContinued: IPdfTextObj = {
            ...phase,
            text: `${phase.text} (continued)`,
          }
          pageIdx++
          pages.push([])
          y = this.getInitialXY()[1] + itemsYHeight + this.__styles.phase.spacing
          pages[pageIdx] = pages[pageIdx].concat(phaseContinued, titleSpace, ...items)
          titleIdx = nextTitleIdx
        } else {
          // Put on this page
          y = y + itemsYHeight
          pages[pageIdx] = pages[pageIdx].concat(items)
          titleIdx = nextTitleIdx
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
  ): IPdfTextObj[] => {
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

    let text: IPdfTextObj[] = [
      { text: '', type: 'spacer' },
      { text: '', type: 'spacer' },
      { text: titleCase(factionName), type: 'armyName' },
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

    const endText: IPdfTextObj[] = [
      { text: '', type: 'spacer' },
      { text: 'Generated by AoS Reminders', type: 'armyFooter' },
      { text: 'aosreminders.com', type: 'armyEnd' },
    ]

    return text.concat(selectionText, endText)
  }

  getReminderText = (doc: jsPDF, reminders: IReminder): IPdfTextObj[] => {
    let allText: IPdfTextObj[] = []

    Object.keys(reminders).forEach(phase => {
      // Handle phase title (Start of Round)
      allText.push({
        type: 'phase',
        text: titleCase(phase),
      })

      reminders[phase].forEach((action, i) => {
        // Handle action title

        // Add a titlespacer
        allText.push({
          type: 'titlespacer',
          text: '',
        })

        const titleWidth = this.__page.maxTitleLineWidth
        const lineWidth = this.__page.maxLineWidth

        // Add the title itself
        const titleLines: string[] = doc.splitTextToSize(this.__getTitle(action), titleWidth)
        titleLines.forEach(text => {
          allText.push({
            type: 'title',
            text: text.trim(),
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
          })
        })
      })
    })

    return allText
  }
}
