import jsPDF from 'jspdf'
import { findIndex, slice, sum, range } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { TSupportedFaction } from 'meta/factions'
import { IReminder, TTurnAction } from 'types/data'
import { IAllySelections, ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'

const xMargin = 0.5
const yMargin = 0.75
const pageHeight = 13
const pageBottom = pageHeight - yMargin
const maxLineWidth = 10.4
const maxTitleLineWidth = maxLineWidth - 2
// const lineSpacing = 0.08

/**
 * Returns x,y
 */
const getInitialXY = () => [xMargin, yMargin]

type TStyleType = 'phase' | 'desc' | 'title' | 'spacer' | 'break' | 'titlespacer'
type TTextStyle = 'bold' | 'normal' | 'italic'

interface IText {
  type: TStyleType
  text: string
}

type TNewStyles = {
  [key in TStyleType]: {
    fontSize: number
    spacing: number
    style: TTextStyle
  }
}

const Styles: TNewStyles = {
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

interface IPrintPdf {
  allyFactionNames: TSupportedFaction[]
  allySelections: { [key: string]: IAllySelections }
  factionName: TSupportedFaction
  realmscape: TRealms | null
  realmscape_feature: string | null
  selections: ISelections
  hiddenReminders: string[]
  reminders: IReminder
}

export const savePdf = (data: IPrintPdf) => {
  const { factionName, hiddenReminders, reminders, ...armyData } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  doc.setFont('helvetica').setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  console.log('fonts', doc.getFontList())

  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2
  const text = getReminderText(doc, visibleReminders)
  const phaseInfo = getPhaseInfo(text)
  const pages = splitTextToPages(text, phaseInfo)

  console.log(pages)

  pages.forEach((page, i) => {
    if (i !== 0) doc.addPage()
    let [x, y] = getInitialXY()

    page.forEach((t, ii) => {
      // Don't add spacers to the start or end of page
      if ((ii === 0 || ii === page.length - 1) && ['spacer', 'titlespacer', 'break'].includes(t.type)) return

      const isPhase = t.type === 'phase'
      const style = Styles[t.type]
      const textX = isPhase ? centerX : x
      const textAlign = isPhase ? 'center' : 'left'
      doc
        .setFontSize(style.fontSize)
        .setFontStyle(style.style)
        .text(t.text, textX, y, null, null, textAlign)

      if (isPhase) {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(211, 211, 211)
          .roundedRect(
            x - 0.1,
            y - style.spacing + 0.02,
            pageWidth - xMargin * 2 + 0.1,
            style.spacing + 0.08,
            0.05,
            0.05,
            'S'
          )
      }

      y = y + style.spacing
    })
  })

  doc.save('two-by-four.pdf')
}

const getArmyText = (
  allyFactionNames: TSupportedFaction[],
  allySelections: { [key: string]: IAllySelections },
  factionName: TSupportedFaction,
  realmscape: TRealms | null,
  realmscape_feature: string | null,
  selections: ISelections
): IText[] => {
  let text: IText[] = [
    {
      text: titleCase(factionName),
      type: 'title',
    },
  ]
  // Handle factionName
  const faction = titleCase(factionName)

  return text
}

const splitTextToPages = (allText: IText[], phaseInfo: IPhaseText[]) => {
  let y = getInitialXY()[1]
  let pages: IText[][] = [[]]
  let pageIdx = 0

  let phaseInfoIdx = 0
  let currentPhaseInfo = phaseInfo[phaseInfoIdx]
  let textPhaseIdx = 0

  allText.forEach((textObj, i) => {
    if (i === allText.length - 1 && textObj.type !== 'phase') {
      return pages[pageIdx].push(textObj)
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
      y = y + Styles.spacer.spacing
      if (!currentPhaseInfo) return console.log('Done processing phases')
    }

    if (currentPhaseInfo.canFitOnPage) {
      // If it won't fit on this page, move it to the next page, and reset the y value
      if (y + currentPhaseInfo.yHeight >= pageBottom) {
        pageIdx++
        pages.push([])
        y = getInitialXY()[1]
      }
      // Add all elements up to the next phase to the page, and increment Y
      const nextPhaseIdx = findIndex(allText, x => x.type === 'phase', textPhaseIdx + 1)
      const objs = slice(allText, textPhaseIdx, nextPhaseIdx)

      y = y + currentPhaseInfo.yHeight
      pages[pageIdx] = pages[pageIdx].concat(objs)
      textPhaseIdx = nextPhaseIdx
      phaseInfoIdx++
      return
    } else {
      // What happens if a phase doesn't fit on one page :)
      let titleIdx = 1
      const nextPhaseIdx = findIndex(allText, x => x.text === phaseInfo[phaseInfoIdx + 1].phase)

      const objs = slice(allText, textPhaseIdx, nextPhaseIdx)
      const phase = objs.shift() as IText

      const numTitles = objs.filter(x => x.type === 'title').length

      // Handle first action
      let nextTitleIdx = findIndex(objs, x => x.type === 'title', 1)
      let firstAction = slice(objs, 0, nextTitleIdx)
      let firstActionYHeight = Styles.phase.spacing + sum(firstAction.map(x => Styles[x.type].spacing))

      const ySpacing = Styles.spacer.spacing * 3

      let titleSpace: IText = {
        type: 'titlespacer',
        text: '',
      }

      if (y + firstActionYHeight + ySpacing >= pageBottom) {
        // Go to next page
        pageIdx++
        pages.push([])
        y = getInitialXY()[1] + firstActionYHeight
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
        let items = slice(objs, titleIdx, nextTitleIdx === -1 ? undefined : nextTitleIdx)
        let itemsYHeight = sum(items.map(x => Styles[x.type].spacing))

        if (y + itemsYHeight + ySpacing >= pageBottom) {
          // Go to next page, with the phase
          let phaseContinued: IText = {
            ...phase,
            text: `${phase.text} (continued)`,
          }
          pageIdx++
          pages.push([])
          y = getInitialXY()[1] + itemsYHeight + Styles.phase.spacing
          pages[pageIdx] = pages[pageIdx].concat(phaseContinued, titleSpace, ...items)
          titleIdx = nextTitleIdx
        } else {
          // Put on this page
          y = y + itemsYHeight
          pages[pageIdx] = pages[pageIdx].concat(items)
          titleIdx = nextTitleIdx
        }
      })
      textPhaseIdx = nextPhaseIdx
      phaseInfoIdx++
    }
  })

  return pages
}

interface IPhaseText {
  canFitOnPage: boolean
  yHeight: number
  phase: string
}

/**
 * Do a loop of each phase and assign them a property: canFitOnPage, and yHeight
 * @param allText
 */
const getPhaseInfo = (allText: IText[]): IPhaseText[] => {
  return allText.reduce(
    (a, textObj) => {
      const currentPhaseIdx = a.length - 1

      if (textObj.type === 'phase') {
        // We add a spacer after a phase, so represent that here
        if (currentPhaseIdx > 0) {
          a[currentPhaseIdx] = {
            ...a[currentPhaseIdx],
            yHeight: a[currentPhaseIdx].yHeight + Styles.spacer.spacing,
          }
        }
        // And then push the new phase onto the accumulator
        a.push({
          canFitOnPage: true,
          yHeight: getInitialXY()[1],
          phase: textObj.text,
        })
      } else {
        const yHeight = a[currentPhaseIdx].yHeight + Styles[textObj.type].spacing
        a[currentPhaseIdx] = {
          ...a[currentPhaseIdx],
          yHeight,
          canFitOnPage: yHeight < pageBottom,
        }
      }
      return a
    },
    [] as IPhaseText[]
  )
}

const getTitle = (action: TTurnAction) => {
  return `${getActionTitle(action)} - ${action.name}${action.tag ? ` (${action.tag})` : ``}`
}

const getVisibleReminders = (reminders: IReminder, hiddenReminders: string[]): IReminder => {
  return Object.keys(reminders).reduce(
    (a, key) => {
      const actions = reminders[key].filter(action => {
        const name = `${key}_${action.name}_`
        return !hiddenReminders.some(hr => hr.includes(name))
      })
      if (actions.length > 0) a[key] = actions
      return a
    },
    {} as IReminder
  )
}

const getReminderText = (doc: jsPDF, reminders: IReminder): IText[] => {
  let allText: IText[] = []

  Object.keys(reminders).forEach(phase => {
    // Handle phase title (Start of Round)
    allText.push({
      type: 'phase',
      text: titleCase(phase),
    })

    reminders[phase].forEach(action => {
      // Handle action title

      // Add a titlespacer
      allText.push({
        type: 'titlespacer',
        text: '',
      })

      // Add the title itself
      const titleLines: string[] = doc.splitTextToSize(getTitle(action), maxTitleLineWidth)
      titleLines.forEach(text => {
        allText.push({
          type: 'title',
          text: text.trim(),
        })
      })

      // Handle description
      const descLines: string[] = doc.splitTextToSize(action.desc, maxLineWidth)
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
