import { IReminder } from 'types/data'
import { GetReminderKey } from 'utils/reminderUtils'

export const getVisibleReminders = (reminders: IReminder, hiddenReminders: string[]): IReminder => {
  const GetKey = new GetReminderKey()

  return Object.keys(reminders).reduce((a, when) => {
    const actions = reminders[when].filter(action => {
      const name = GetKey.reminderKey(when, action)
      return !hiddenReminders.some(hr => hr.includes(name))
    })
    if (actions.length > 0) a[when] = actions
    return a
  }, {} as IReminder)
}
