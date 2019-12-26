import { TTurnAction } from 'types/data'

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
