import jsPDF from 'jspdf'
import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'
import { IReminder, TTurnAction } from 'types/data'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { findIndex, slice, sum, range } from 'lodash'

const xMargin = 0.5
const yMargin = 0.75
const pageHeight = 14
const pageBottom = pageHeight - yMargin
const maxLineWidth = 10.4
const maxTitleLineWidth = maxLineWidth - 2
// const lineSpacing = 0.08

/**
 * Returns x,y
 */
const getInitialXY = () => [xMargin, yMargin]

const fontSizes = {
  break: 11,
  desc: 11,
  phase: 14,
  spacer: 0,
  title: 11.5,
}

const spacing = {
  break: 0.15,
  desc: 0.22,
  phase: 0.28,
  spacer: 0.28,
  title: 0.22,
}

const styles = {
  break: 'normal',
  desc: 'normal',
  phase: 'bold',
  spacer: 'normal',
  title: 'bold',
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
  const {
    allyFactionNames,
    allySelections,
    factionName,
    realmscape,
    realmscape_feature,
    selections,
    hiddenReminders,
    reminders,
  } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  doc.setFont('helvetica').setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  console.log('fonts', doc.getFontList())
  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2
  const text = getAllText(doc, visibleReminders)
  const phaseInfo = getPhaseInfo(text)
  const pages = splitTextToPages(text, phaseInfo)

  pages.forEach((page, i) => {
    if (i !== 0) doc.addPage()
    let [x, y] = getInitialXY()

    page.forEach((t, ii) => {
      if (ii === 0 && t.type === 'spacer') return // Don't add spacers t o the start of page
      const isPhase = t.type === 'phase'
      doc
        .setFontSize(t.fontSize)
        .setFontStyle(t.style)
        .text(t.text, isPhase ? centerX : x, y, null, null, isPhase ? 'center' : null)

      // if (t.type === 'spacer') {
      //   const lineY = y + lineSpacing + t.spacing
      //   doc.setLineWidth(0.00055).setDrawColor(211, 211, 211)
      //   doc.line(x - 0.1, lineY, pageWidth - margin, lineY) // horizontal line
      // }

      // if (isPhase) {
      //   doc.setLineWidth(0.00075).setDrawColor(0, 0, 0)
      //   const phaseY = (phaseInfo.find(x => x.phase === t.text) as IPhaseText).yHeight
      //   doc.roundedRect(
      //     x - 0.1,
      //     y - spacing.spacer,
      //     pageWidth - margin * 2 + 0.1,
      //     phaseY - spacing.spacer - spacing.phase,
      //     0.05,
      //     0.05,
      //     'S'
      //   )
      // }

      y = y + t.spacing
    })
  })

  doc.save('two-by-four.pdf')
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
        fontSize: fontSizes.spacer,
        spacing: spacing.spacer,
        style: styles.spacer,
      })
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
      let firstActionObjs = slice(objs, 0, nextTitleIdx)
      let firstActionYHeight = phase.spacing + sum(firstActionObjs.map(x => x.spacing))

      if (y + firstActionYHeight >= pageBottom) {
        // Go to next page
        pageIdx++
        pages.push([])
        y = getInitialXY()[1] + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, ...firstActionObjs)
        titleIdx = nextTitleIdx
      } else {
        // Put on this page
        y = y + firstActionYHeight
        pages[pageIdx] = pages[pageIdx].concat(phase, ...firstActionObjs)
        titleIdx = nextTitleIdx
      }

      range(0, numTitles - 1).forEach(i => {
        nextTitleIdx = findIndex(objs, x => x.type === 'title', titleIdx + 1)
        let items = slice(objs, titleIdx, nextTitleIdx)
        let itemsYHeight = sum(items.map(x => x.spacing))
        if (y + itemsYHeight >= pageBottom) {
          // Go to next page, with the phase
          let phaseContinued: IText = {
            ...phase,
            text: `${phase.text} (continued)`,
          }
          pageIdx++
          pages.push([])
          y = getInitialXY()[1] + itemsYHeight + phaseContinued.spacing
          pages[pageIdx] = pages[pageIdx].concat(phaseContinued, ...items)
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

    // if (y > pageBottom) {
    // We need to go to a new page
    // pageIdx++

    // Situations where we need to check ahead:
    // 1. We don't want to have a phase at the bottom of the page and then no content
    // 2. We don't want to have a title at the bottom of the page and then no text
    // 3. We don't want to have text at the bottom that is missing its siblings
    // 4. Finally, if we know that a phase can be fit on one whole page (but not this one)
    //      we should move that entire phase to the next page

    // If this is a phase where the contents will NOT fit on an entire page,
    // Carry over the phase to the next page and have it as a header
    // }
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
            yHeight: a[currentPhaseIdx].yHeight + spacing.spacer,
          }
        }
        // And then push the new phase onto the accumulator
        a.push({
          canFitOnPage: true,
          yHeight: getInitialXY()[1],
          phase: textObj.text,
        })
      } else {
        const yHeight = a[currentPhaseIdx].yHeight + textObj.spacing
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

interface IText {
  type: 'phase' | 'desc' | 'title' | 'spacer' | 'break'
  fontSize: number
  spacing: number
  style: string
  text: string
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

const getAllText = (doc: jsPDF, reminders: IReminder): IText[] => {
  let allText: IText[] = []

  Object.keys(reminders).forEach(phase => {
    // Handle phase title (Start of Round)
    allText.push({
      type: 'phase',
      fontSize: fontSizes.phase,
      style: styles.phase,
      spacing: spacing.phase,
      text: titleCase(phase),
    })

    reminders[phase].forEach(action => {
      // Handle action title
      const titleLines: string[] = doc.splitTextToSize(getTitle(action), maxTitleLineWidth)
      titleLines.forEach(text => {
        allText.push({
          type: 'title',
          fontSize: fontSizes.title,
          style: styles.title,
          spacing: spacing.title,
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
          fontSize: fontSizes[type],
          style: styles[type],
          spacing: spacing[type],
          text: trimmed,
        })
      })
    })
  })

  return allText
}
