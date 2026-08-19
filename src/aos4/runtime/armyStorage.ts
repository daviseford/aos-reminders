import type { Aos4Catalog, CanonicalId } from '../domain'
import defaultsJson from '../generated/corpus/defaults.json'
import { resolveSelection } from '../select'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
  type Aos4ArmyDocumentDiagnostic,
} from '../state'

/*
 * The two default ids come from the generated defaults file rather than the generated barrel that
 * also exports them: the barrel re-exports the whole corpus, so reading a couple of hundred bytes
 * of ids through it would pull the 13 MB catalog into every graph that stores an army.
 */
const defaults = defaultsJson as unknown as {
  rulesContextId: Aos4Catalog['rulesContexts'][number]['id']
  defaultFactionId: CanonicalId<'faction'>
}
const defaultSelectionIds = [defaults.defaultFactionId]

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
    rulesContextId: defaults.rulesContextId,
    explicitSelectionIds: defaultSelectionIds,
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

// The builder offers Legends and historical content to everyone, so the document's overlay flags
// follow the selections instead of a user setting. Validation elsewhere (the army API client, the
// reminder view) still resolves with exactly the flags a document carries, so a document that
// selects overlay content must declare it — and one that no longer does should not.
export const deriveAos4OverlayFlags = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4ArmyDocument => {
  const inapplicableUnder = (flags: { allowsLegends?: boolean; allowsHistorical?: boolean }) =>
    new Set(
      resolveSelection(catalog, {
        explicitIds: document.explicitSelectionIds,
        rulesContextId: document.rulesContextId,
        ...flags,
      })
        .diagnostics.filter(diagnostic => diagnostic.code === 'inapplicable-explicit-selection')
        .flatMap(diagnostic => diagnostic.entityIds ?? [])
    )

  const strict = inapplicableUnder({})
  let needsLegends = false
  let needsHistorical = false
  if (strict.size > 0) {
    const stillWithLegends = inapplicableUnder({ allowsLegends: true })
    const stillWithHistorical = inapplicableUnder({ allowsHistorical: true })
    needsLegends = Array.from(strict).some(id => !stillWithLegends.has(id))
    needsHistorical = Array.from(strict).some(id => !stillWithHistorical.has(id))
  }

  if (
    Boolean(document.allowsLegends) === needsLegends &&
    Boolean(document.allowsHistorical) === needsHistorical
  ) {
    return document
  }
  return createAos4ArmyDocument({
    ...document,
    allowsLegends: needsLegends,
    allowsHistorical: needsHistorical,
  })
}
