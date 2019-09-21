import jsPDF from 'jspdf'
import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'
import { IReminder, TTurnAction } from 'types/data'
import { titleCase, getActionTitle } from 'utils/textUtils'

const pageWidth = 8.5
const lineHeight = 1.2
const margin = 0.5
const maxLineWidth = pageWidth - margin * 2
const maxTitleLineWidth = maxLineWidth + 1
const ptsPerInch = 72

const fontSizes = {
  desc: 12,
  title: 12,
  phase: 20,
}

const spacing = {
  desc: 0.18,
  title: 0.18,
  phase: 0.21,
}

const styles = {
  desc: 'normal',
  title: 'bold',
  phase: 'bold',
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

  // Bottom of the page is ~11 y units (inches)
  const doc = new jsPDF({
    unit: 'in',
    lineHeight: lineHeight,
  }).setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  const pageHeight = doc.internal.pageSize.height
  let [x, y] = getInitialXY()

  const text = getAllText(doc, reminders)
  console.log('text', text)
  const splitPages = splitTextToPages(text, pageHeight)
  console.log('splitPages', splitPages)

  Object.keys(visibleReminders).forEach(phase => {
    if (y >= pageHeight - margin) {
      y = getInitialXY()[1]
      doc.addPage()
    }
    // Handle phase title (Start of Round)
    const title = titleCase(phase)
    doc
      .setFontSize(fontSizes.phase)
      .setFontStyle(styles.phase)
      .text(title, x, y)
    y = y + spacing.phase

    visibleReminders[phase].forEach(action => {
      // Handle action title
      const title = getTitle(action)
      const titleLines: string[] = doc.splitTextToSize(title, maxTitleLineWidth)
      // console.log(titleLines, y)
      doc.setFontSize(fontSizes.title).setFontStyle(styles.title)
      // console.log(actionTitle, y)
      titleLines.forEach(l => {
        doc.text(l, x, y)
        y = y + spacing.title
      })

      // Handle description
      const descLines: string[] = doc.splitTextToSize(action.desc, maxLineWidth)
      doc.setFontSize(fontSizes.desc).setFontStyle(styles.desc)
      descLines.forEach(l => {
        doc.text(l, x, y)
        y = y + spacing.desc
      })
      // Add some spacing for the next phase
      y = y + spacing.phase
    })
  })

  doc.save('two-by-four.pdf')
}

const splitTextToPages = (allText: IText[], pageHeight: number) => {
  const pageBottom = pageHeight - margin
  let [x, y] = getInitialXY()
  let pages: IText[][] = []
  let pageIdx = 0
  let currentPhase = (allText.find(x => x.type === 'phase') as IText).text
  let phaseNum = 1

  let phaseInfo: IPhaseText[] = getPhaseInfo(allText, pageHeight)
  console.log('phaseInfo', phaseInfo)

  allText.forEach(textObj => {
    // If we have to go to a next page,
    // Carry over the previous phase and have it as a header
    const textHeight = getLineHeight(textObj.fontSize) + textObj.spacing
    if (y + textHeight > pageHeight) {
      // We need to go to a new page
      pageIdx++

      // Situations where we need to check ahead:
      // 1. We don't want to have a phase at the bottom of the page and then no content
      // 2. We don't want to have a title at the bottom of the page and then no text
      // 3. We don't want to have text at the bottom that is missing its siblings
      // 4. Finally, if we know that a phase can be fit on one whole page (but not this one)
      //      we should move that entire phase to the next page

      // If this is a phase where the contents will NOT fit on an entire page,
      // Carry over the phase to the next page and have it as a header
    }
  })
}

interface IPhaseText {
  canFitOnPage: boolean
  yHeight: number
  phase: string
}

/**
 * Do a loop of each phase and assign them a property: canFitOnPage, and yHeight
 * @param allText
 * @param pageHeight
 */
const getPhaseInfo = (allText: IText[], pageHeight: number): IPhaseText[] => {
  let y = getInitialXY()[1]
  return allText.reduce(
    (a, textObj) => {
      const currentPhaseIdx = a.length - 1

      if (textObj.type === 'phase') {
        // We add padding after a phase, so represent that here
        if (currentPhaseIdx > 0) {
          a[currentPhaseIdx] = {
            ...a[currentPhaseIdx],
            yHeight: a[currentPhaseIdx].yHeight + spacing.phase,
          }
        }
        // And then push the new phase onto the accumulator
        a.push({
          canFitOnPage: true,
          yHeight: y,
          phase: textObj.text,
        })
      } else {
        const yHeight = a[currentPhaseIdx].yHeight + textObj.spacing
        a[currentPhaseIdx] = {
          ...a[currentPhaseIdx],
          yHeight,
          canFitOnPage: yHeight < pageHeight,
        }
      }
      return a
    },
    [] as IPhaseText[]
  )
}

interface IText {
  type: 'phase' | 'desc' | 'title'
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
          text,
        })
      })

      // Handle description
      const descLines: string[] = doc.splitTextToSize(action.desc, maxLineWidth)
      descLines.forEach(text => {
        allText.push({
          type: 'desc',
          fontSize: fontSizes.desc,
          style: styles.desc,
          spacing: spacing.desc,
          text,
        })
      })
    })
  })

  return allText
}

/**
 * Gets the height of a single line
 * @param fontSize
 */
const getLineHeight = (fontSize: number) => fontSize / ptsPerInch
// const getLineHeight = (fontSize: number) => (fontSize * lineHeight) / ptsPerInch

/**
 * Gets the height of multiple lines
 * @param textLines
 * @param fontSize
 */
const getMultiTextHeight = (textLines: string[], fontSize: number) =>
  (textLines.length * fontSize * lineHeight) / ptsPerInch

/**
 * Returns x,y
 */
const getInitialXY = () => [margin, margin + 2 * getLineHeight(fontSizes.phase)]
