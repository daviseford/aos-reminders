import { TTurnWhen } from './phases'
import { ITurnAction } from 'meta/turn_structure'

export interface IEffects {
  name: string
  desc: string
  when: TTurnWhen[]
  allegiance_ability?: boolean
  artifact?: boolean
  command_ability?: boolean
  tag?: string
}

export interface IReminder {
  [key: string]: ITurnAction[]
}
