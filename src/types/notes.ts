import { TTurnWhen } from './phases'

export interface INote {
  id: string
  when: TTurnWhen
  /**
   * id of the action this Note is attached to
   */
  linked_hash: string
  /**
   * User text
   */
  content: string
}
