import type { Aos4Catalog } from '../domain'
import { AOS4_DEFAULT_RULES_CONTEXT_ID, AOS4_DEFAULT_SELECTION_IDS } from '../generated'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
  type Aos4ArmyDocumentDiagnostic,
} from '../state'

export const AOS4_ARMY_STORAGE_KEY = 'aos-reminders:aos4:army:v1'

export const AOS3_BROWSER_STORAGE_KEYS = [
  'persist:root',
  'loadedArmy',
  'reminderOrder',
  'savedArmies',
] as const

export interface LoadAos4ArmyDocumentResult {
  document: Aos4ArmyDocument
  diagnostics: Aos4ArmyDocumentDiagnostic[]
  source: 'default' | 'storage' | 'reset'
}

export const createDefaultAos4ArmyDocument = (): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:aos4-migration-preview',
    name: 'Stormcast Eternals',
    rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
  })

export const saveAos4ArmyDocument = (storage: Storage, document: Aos4ArmyDocument): void => {
  storage.setItem(AOS4_ARMY_STORAGE_KEY, serializeAos4ArmyDocument(document))
}

const retireAos3BrowserState = (storage: Storage): void => {
  AOS3_BROWSER_STORAGE_KEYS.forEach(key => storage.removeItem(key))
}

export const loadAos4ArmyDocument = (storage: Storage, catalog: Aos4Catalog): LoadAos4ArmyDocumentResult => {
  retireAos3BrowserState(storage)

  const serialized = storage.getItem(AOS4_ARMY_STORAGE_KEY)
  if (!serialized) {
    const document = createDefaultAos4ArmyDocument()
    saveAos4ArmyDocument(storage, document)
    return { document, diagnostics: [], source: 'default' }
  }

  const restored = deserializeAos4ArmyDocument(serialized, catalog)
  if (restored.document) {
    return { document: restored.document, diagnostics: restored.diagnostics, source: 'storage' }
  }

  const document = createDefaultAos4ArmyDocument()
  saveAos4ArmyDocument(storage, document)
  return { document, diagnostics: restored.diagnostics, source: 'reset' }
}
