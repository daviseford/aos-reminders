import { IReminder, TTurnAction } from 'types/data'
import { hashCode } from './textUtils'

export class GetReminderKey {
  private _names: string[] = []

  public reminderKey = (phase: string, action: TTurnAction): string => {
    const initialName = `${phase}_${action.condition}_${action.name}`.split(' ').join('_')
    const existingIdx = this._names.indexOf(initialName)
    const name = existingIdx === -1 ? initialName : `${initialName}_${existingIdx + 1}`
    this._names.push(name)
    return name
  }
}

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

export const hashReminder = (phase: string, name: string, desc: string): string => {
  const str = `${phase}_${name}_${desc}`.split(' ').join('_')
  return hashCode(str)
}
