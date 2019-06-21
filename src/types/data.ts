import { TTurnWhen } from './phases'
import { ITurnAction } from 'meta/turn_structure'

export interface IEffects {
  name: string
  desc: string
  when: TTurnWhen[]
  command?: boolean
  tag?: string
}

export interface IReminder {
  [key: string]: ITurnAction[]
}
