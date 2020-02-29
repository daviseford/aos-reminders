import { IReminder } from 'types/data'
import { hashCode } from 'utils/textUtils'

export const getVisibleReminders = (reminders: IReminder, hiddenReminders: string[]): IReminder => {
  return Object.keys(reminders).reduce((a, when) => {
    const actions = reminders[when].filter(action => {
      return !hiddenReminders.some(hr => hr.includes(action.id))
    })
    if (actions.length > 0) a[when] = actions
    return a
  }, {} as IReminder)
}

export const hashReminder = (phase: string, name: string, desc: string): string => {
  const str = `${phase}_${name}_${desc}`.split(' ').join('_')
  return `${phase}_${hashCode(str)}`
}
