import { TTurnAction } from 'types/data'

export const getReminderKey = (phase: string, action: TTurnAction): string => {
  return `${phase}_${action.condition}_${action.name}`.split(' ').join('_')
}
