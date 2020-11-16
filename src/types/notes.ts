export interface INote {
  id: string
  /**
   * id of the action this Note is attached to
   */
  linked_hash: string
  /**
   * User text
   */
  content: string
}
