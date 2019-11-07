import { IReminder } from 'types/data'
import { getReminderKey } from 'utils/reminderUtils'

export const getVisibleReminders = (reminders: IReminder, hiddenReminders: string[]): IReminder => {
  return Object.keys(reminders).reduce(
    (a, when) => {
      const actions = reminders[when].filter(action => {
        const name = getReminderKey(when, action)
        return !hiddenReminders.some(hr => hr.includes(name))
      })
      if (actions.length > 0) a[when] = actions
      return a
    },
    {} as IReminder
  )
}
