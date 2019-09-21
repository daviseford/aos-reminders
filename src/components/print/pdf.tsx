import jsPDF from 'jspdf'
import { TSupportedFaction } from 'meta/factions'
import { IAllySelections, ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'
import { IReminder, TTurnAction } from 'types/data'
import { titleCase, getActionTitle } from 'utils/textUtils'

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

  Object.keys(visibleReminders).forEach(key => {
    const title = titleCase(key)
    doc.text(title, x, y)
    y = y + 10
    visibleReminders[key].forEach(action => {
      const actionTitle = getTitle(action)
      doc.text(actionTitle, x, y)
      y = y + 10
      const desc = getActionDesc(action)
      desc.forEach(d => {
        doc.text(d, x, y)
        y = y + 10
      })
    })
  })

  // doc.text('Hello world!', 20, 20);
  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  doc.save('two-by-four.pdf')
}

const getActionDesc = (action: TTurnAction) => {
  return action.desc
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)
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
