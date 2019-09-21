import jsPDF from 'jspdf'
import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'
import { IReminder, TTurnAction } from 'types/data'
import { titleCase, getActionTitle } from 'utils/textUtils'

const fontSizes = {
  desc: 12,
  title: 12,
  phase: 20,
}

const spacing = {
  desc: 5,
  title: 5,
  phase: 8,
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

  console.log(visibleReminders)

  // I think a single page can handle 300 y units
  const doc = new jsPDF()
  let [x, y] = [20, 20]

  Object.keys(visibleReminders).forEach(phase => {
    if (y >= 300) {
      y = 20
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
      const titleLines: string[] = doc.splitTextToSize(title, 185)
      console.log(titleLines, titleLines[0].length)
      doc.setFontSize(fontSizes.title).setFontStyle(styles.title)
      // console.log(actionTitle, y)
      titleLines.forEach(l => {
        doc.text(l, x, y)
        y = y + spacing.title
      })

      // Handle description
      const descLines: string[] = doc.splitTextToSize(action.desc, 190)
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
