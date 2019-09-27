import jsPDF from 'jspdf'
import { findIndex, slice, sum, range } from 'lodash'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { IReminder, TTurnAction } from 'types/data'
import { IAllySelections } from 'types/selections'
import { TStyleType, Styles } from './styles'
import { Logo } from './logo'
import { ICurrentArmy } from 'types/army'

const xMargin = 0.5
const yMargin = 0.75
const pageHeight = 13
const pageBottom = pageHeight - yMargin
const maxLineWidth = 10.4
const maxTitleLineWidth = maxLineWidth - 2

/**
 * Returns x,y
 */
const getInitialXY = () => [xMargin, yMargin]

interface IText {
  type: TStyleType
  text: string
}

interface IPrintPdf extends ICurrentArmy {
  hiddenReminders: string[]
  reminders: IReminder
}

export const savePdf = (data: IPrintPdf): jsPDF => {
  const { factionName, hiddenReminders, reminders, ...currentArmy } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  doc
    .setFont('helvetica')
    .setTextColor(0, 0, 0)
    .setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2
  const reminderText = getReminderText(doc, visibleReminders)
  const armyText = getArmyText(doc, { factionName, ...currentArmy })
  const phaseInfo = getPhaseInfo(reminderText)
  const pages = splitTextToPages(reminderText, phaseInfo, armyText)

  pages.forEach((page, pageNum) => {
    if (pageNum !== 0) doc.addPage()
    let [x, y] = getInitialXY()

    page.forEach((t, i) => {
      // Don't add spacers to the start or end of page
      if ((i === 0 || i === page.length - 1) && ['spacer', 'titlespacer', 'break'].includes(t.type)) return

      const isPhase = t.type === 'phase'
      const isArmy = t.type.startsWith('army')
      const style = Styles[t.type]
      const textX = isPhase || isArmy ? centerX : x
      const textAlign = isPhase || isArmy ? 'center' : 'left'

      doc
        .setFontSize(style.fontSize)
        .setFontStyle(style.style)
        .text(t.text, textX, y, null, null, textAlign)

      if (isPhase) {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
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
      if (t.type === 'armyName') {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, y - style.spacing, pageWidth - xMargin + 0.1, y - style.spacing)
      }

      if (t.type === 'armyEnd') {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, y + style.spacing, pageWidth - xMargin + 0.1, y + style.spacing)
      }

      y = y + style.spacing

      // Add page numbers and watermark on the first pass of a page
      if (i === 0) {
        const watermarkY = 0.33
        doc
          .setTextColor(128, 128, 128)
          .setFontSize(Styles.desc.fontSize)
          .setFontStyle(Styles.desc.style)
          .text(`${pageNum + 1}`, pageWidth - xMargin - 0.11, watermarkY)
          .setFontStyle(Styles.title.style)
          .text(`aosreminders.com`, centerX, watermarkY, null, null, 'center')
          .setTextColor(0, 0, 0) // Set color back to black
      }

      // If there's enough room on the last page, add the logo to it
      if (pageNum === pages.length - 1 && i === page.length - 1) {
        const [logoW, logoH, logoSpacer] = [1.43, 1, 0.25]

        if (y + logoH + logoSpacer <= pageBottom) {
          doc.addImage(Logo, 'png', centerX - logoW / 2 + 0.15, y + logoSpacer)
        }
      }
    })
  })

  return doc
}

const getArmyText = (
  doc: jsPDF,
  { allyFactionNames, allySelections, factionName, realmscape_feature, selections }: ICurrentArmy
): IText[] => {
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

  let text: IText[] = [
    { text: '', type: 'spacer' },
    { text: '', type: 'spacer' },
    { text: titleCase(factionName), type: 'armyName' },
  ]

  const getText = getSelections(doc)

  const selectionText = [
    getText('Unit', units),
    ...allyFactionNames.map(n =>
      getText(`Allied ${titleCase(n)} Unit`, (allySelections[n] as IAllySelections).units)
    ),
    getText('Artifact', artifacts),
    getText('Battalion', battalions),
    getText('Command Trait', traits),
    getText('Command Abilities', commands, false),
    getText('Allegiance', allegiances),
    getText('Spell', spells),
    getText('Endless Spell', endless_spells),
    getText('Scenery', scenery, false),
    getText('Realmscape Feature', realmFeature),
    getText('Triumph', triumphs),
  ].flat()

  const endText: IText[] = [
    { text: '', type: 'spacer' },
    { text: 'Generated by AoS Reminders', type: 'armyFooter' },
    { text: 'aosreminders.com', type: 'armyEnd' },
  ]

  return text.concat(selectionText, endText)
}

const getSelections = (doc: jsPDF) => (name: string, items: string[], pluralize: boolean = true): IText[] => {
  if (items.length === 0) return []
  const title = !pluralize ? name : items.length > 1 ? `${name}s` : name
  const str = `${title}: ${items.join(' | ')}`

  const lines: string[] = doc.splitTextToSize(str, maxLineWidth)

  return lines.map(text => ({
    type: 'army',
    text: text.trim().replace(/\|$/g, ''), // remove trailing pipe from EOL
  }))
}

const splitTextToPages = (allText: IText[], phaseInfo: IPhaseText[], armyText: IText[]) => {
  let y = getInitialXY()[1]
  let pages: IText[][] = [[]]
  let pageIdx = 0

  let phaseInfoIdx = 0
  let currentPhaseInfo = phaseInfo[phaseInfoIdx]
  let textPhaseIdx = 0

  const ySpacing = Styles.spacer.spacing * 4

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

      let titleSpace: IText = {
        type: 'titlespacer',
        text: '',
      }

      if (y + firstActionYHeight + ySpacing >= pageBottom) {
        // Go to next page
        pageIdx = pageIdx + 1
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

  // Handle armyText
  const armyTextYHeight = sum(armyText.map(x => Styles[x.type].spacing))
  if (y + armyTextYHeight >= pageBottom) {
    // Place on next page
    pageIdx++
    pages.push([])
    y = getInitialXY()[1] + armyTextYHeight
  } else {
    // Put on this page
    y = y + armyTextYHeight
  }
  pages[pageIdx] = pages[pageIdx].concat(...armyText)

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
