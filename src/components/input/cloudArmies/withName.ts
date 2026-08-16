import { createAos4ArmyDocument, type Aos4ArmyDocument } from '../../../aos4/state'

export const withName = (document: Aos4ArmyDocument, name: string): Aos4ArmyDocument =>
  createAos4ArmyDocument({ ...document, name: name.trim() || document.name })
