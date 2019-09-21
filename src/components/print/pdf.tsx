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
  phase: 10,
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

  const doc = new jsPDF()
  let [x, y] = [20, 20]

  Object.keys(visibleReminders).forEach(phase => {
    // Handle phase title (Start of Round)
    const title = titleCase(phase)
    doc
      .setFontSize(fontSizes.phase)
      .setFontStyle(styles.phase)
      .text(title, x, y)
    y = y + spacing.phase

    visibleReminders[phase].forEach(action => {
      // Handle action title
      const actionTitle = getTitle(action)
      doc
        .setFontSize(fontSizes.title)
        .setFontStyle(styles.title)
        .text(actionTitle, x, y)
      y = y + spacing.title

      // Handle description
      const lines = doc.splitTextToSize(action.desc, 170)
      doc.setFontSize(fontSizes.desc).setFontStyle(styles.desc)
      lines.forEach(l => {
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
