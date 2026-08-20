import type { Aos4Catalog, CanonicalId, RulesContextId } from '../domain'
import type { ReminderOccurrenceId } from '../reminders'

export const AOS4_ARMY_DOCUMENT_SCHEMA_VERSION = 1 as const

export interface Aos4ReminderPreference {
  hidden?: boolean
  note?: string
  order?: number
}

export interface Aos4ArmyDocument {
  schemaVersion: typeof AOS4_ARMY_DOCUMENT_SCHEMA_VERSION
  id: string
  name: string
  rulesContextId: RulesContextId
  /**
   * The army opted into Legends content, so selection resolution overlays the Legends rules
   * context on top of `rulesContextId`. Absent means false; the field is only serialized when
   * true, so documents that never touched Legends round-trip byte-identically to schema 1 output
   * written before the field existed.
   */
  allowsLegends?: boolean
  /**
   * The army was built against a superseded season, so selection resolution overlays the
   * historical rules context on top of `rulesContextId`.
   *
   * Last season's content — the `Scourge of Ghyran` unit variants, the battle formations the
   * General's Handbook 2025-26 introduced — is catalogued as historical once its handbook lapses.
   * An army imported from a roster of that vintage holds both: its units are current, its seasonal
   * picks are not. Serialized only when true, so documents that never touched a past season
   * round-trip byte-identically to schema 1 output written before the field existed.
   */
  allowsHistorical?: boolean
  explicitSelectionIds: CanonicalId[]
  reminderPreferences: Partial<Record<ReminderOccurrenceId, Aos4ReminderPreference>>
}

export type Aos4ArmyDocumentDiagnosticCode =
  | 'invalid-json'
  | 'incompatible-schema'
  | 'invalid-document'
  | 'missing-rules-context'
  | 'missing-selection'
  | 'invalid-reminder-preference'

export interface Aos4ArmyDocumentDiagnostic {
  code: Aos4ArmyDocumentDiagnosticCode
  severity: 'warning' | 'error'
  message: string
  subject?: string
}

export interface DeserializeAos4ArmyDocumentResult {
  document?: Aos4ArmyDocument
  diagnostics: Aos4ArmyDocumentDiagnostic[]
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const sortedUnique = <T extends string>(values: T[]): T[] =>
  Array.from(new Set(values)).sort((left, right) => left.localeCompare(right))

const normalizedPreference = (value: Aos4ReminderPreference): Aos4ReminderPreference => ({
  ...(value.hidden ? { hidden: true } : {}),
  ...(value.note?.trim() ? { note: value.note.trim() } : {}),
  ...(Number.isInteger(value.order) && (value.order ?? -1) >= 0 ? { order: value.order } : {}),
})

export const createAos4ArmyDocument = (
  input: Omit<Aos4ArmyDocument, 'schemaVersion' | 'reminderPreferences'> & {
    reminderPreferences?: Aos4ArmyDocument['reminderPreferences']
  }
): Aos4ArmyDocument => ({
  schemaVersion: AOS4_ARMY_DOCUMENT_SCHEMA_VERSION,
  id: input.id.trim(),
  name: input.name.trim(),
  rulesContextId: input.rulesContextId,
  ...(input.allowsLegends ? { allowsLegends: true } : {}),
  ...(input.allowsHistorical ? { allowsHistorical: true } : {}),
  explicitSelectionIds: sortedUnique(input.explicitSelectionIds),
  reminderPreferences: Object.fromEntries(
    Object.entries(input.reminderPreferences ?? {})
      .sort(([left], [right]) => left.localeCompare(right))
      .flatMap(([id, preference]) => {
        if (!preference) return []
        const normalized = normalizedPreference(preference)
        return Object.keys(normalized).length ? [[id, normalized]] : []
      })
  ),
})

export const serializeAos4ArmyDocument = (document: Aos4ArmyDocument): string =>
  `${JSON.stringify(createAos4ArmyDocument(document), null, 2)}\n`

const isReminderPreference = (value: unknown): value is Aos4ReminderPreference => {
  if (!isObject(value)) return false
  if (value.hidden !== undefined && typeof value.hidden !== 'boolean') return false
  if (value.note !== undefined && typeof value.note !== 'string') return false
  if (value.order !== undefined && (!Number.isInteger(value.order) || (value.order as number) < 0)) {
    return false
  }
  return Object.keys(value).every(key => ['hidden', 'note', 'order'].includes(key))
}

/**
 * The document's own shape — everything readable without a catalog to check it against. Both
 * deserializers below start here; only the catalog-bound one goes on to ask whether the IDs it
 * found still name anything.
 */
interface Aos4ArmyDocumentShape {
  id: string
  name: string
  rulesContextId: string
  allowsLegends: boolean
  allowsHistorical: boolean
  explicitSelectionIds: string[]
  reminderPreferences: Record<string, unknown>
}

const readAos4ArmyDocumentShape = (
  serialized: string
): { shape?: Aos4ArmyDocumentShape; diagnostics: Aos4ArmyDocumentDiagnostic[] } => {
  let value: unknown
  try {
    value = JSON.parse(serialized)
  } catch {
    return {
      diagnostics: [
        {
          code: 'invalid-json',
          severity: 'error',
          message: 'Army document is not valid JSON',
        },
      ],
    }
  }

  if (!isObject(value)) {
    return {
      diagnostics: [
        {
          code: 'invalid-document',
          severity: 'error',
          message: 'Army document must be an object',
        },
      ],
    }
  }
  if (value.schemaVersion !== AOS4_ARMY_DOCUMENT_SCHEMA_VERSION) {
    return {
      diagnostics: [
        {
          code: 'incompatible-schema',
          severity: 'error',
          message: `Army document schema ${String(value.schemaVersion)} is not supported`,
        },
      ],
    }
  }
  if (
    typeof value.id !== 'string' ||
    !value.id.trim() ||
    typeof value.name !== 'string' ||
    !value.name.trim() ||
    typeof value.rulesContextId !== 'string' ||
    (value.allowsLegends !== undefined && typeof value.allowsLegends !== 'boolean') ||
    (value.allowsHistorical !== undefined && typeof value.allowsHistorical !== 'boolean') ||
    !Array.isArray(value.explicitSelectionIds) ||
    value.explicitSelectionIds.some(id => typeof id !== 'string') ||
    !isObject(value.reminderPreferences)
  ) {
    return {
      diagnostics: [
        {
          code: 'invalid-document',
          severity: 'error',
          message: 'Army document is missing required fields',
        },
      ],
    }
  }

  return {
    shape: {
      id: value.id as string,
      name: value.name as string,
      rulesContextId: value.rulesContextId as string,
      allowsLegends: value.allowsLegends === true,
      allowsHistorical: value.allowsHistorical === true,
      explicitSelectionIds: value.explicitSelectionIds as string[],
      reminderPreferences: value.reminderPreferences,
    },
    diagnostics: [],
  }
}

// A preference key and value are checked against the schema, never against the catalog — a
// reminder occurrence ID names a timing, not an entity — so both deserializers share this whole.
const readReminderPreferences = (
  raw: Record<string, unknown>,
  diagnostics: Aos4ArmyDocumentDiagnostic[]
): Aos4ArmyDocument['reminderPreferences'] =>
  Object.fromEntries(
    Object.entries(raw).flatMap(([id, preference]) => {
      if (!id.startsWith('reminder:') || !isReminderPreference(preference)) {
        diagnostics.push({
          code: 'invalid-reminder-preference',
          severity: 'error',
          message: `Army document has an invalid reminder preference for ${id}`,
          subject: id,
        })
        return []
      }
      return [[id, preference]]
    })
  ) as Aos4ArmyDocument['reminderPreferences']

/*
 * The membership Set over all 11,453 entity IDs, built once per catalog rather than once per
 * deserialize: the cloud-army list runs this deserializer once per army, and the catalog-bound
 * mount runs it again over storage the shell already read structurally.
 */
const entityIdSetByCatalog = new WeakMap<Aos4Catalog, Set<CanonicalId>>()
const entityIdSet = (catalog: Aos4Catalog): Set<CanonicalId> => {
  let ids = entityIdSetByCatalog.get(catalog)
  if (!ids) {
    ids = new Set(catalog.entities.map(entity => entity.id))
    entityIdSetByCatalog.set(catalog, ids)
  }
  return ids
}

export const deserializeAos4ArmyDocument = (
  serialized: string,
  catalog: Aos4Catalog
): DeserializeAos4ArmyDocumentResult => {
  const shapeResult = readAos4ArmyDocumentShape(serialized)
  if (!shapeResult.shape) return { diagnostics: shapeResult.diagnostics }
  const shape = shapeResult.shape

  const diagnostics: Aos4ArmyDocumentDiagnostic[] = []
  const contextExists = catalog.rulesContexts.some(context => context.id === shape.rulesContextId)
  if (!contextExists) {
    diagnostics.push({
      code: 'missing-rules-context',
      severity: 'error',
      message: `Army document refers to missing rules context ${shape.rulesContextId}`,
      subject: shape.rulesContextId,
    })
  }

  /*
   * A selection the catalog no longer carries is a rules update's doing, not the user's: a
   * battletome rewrite can retire a warscroll the army legitimately held. Filtering the dead ID
   * with a warning keeps the rest of the army alive; failing the whole document here used to reset
   * a stored army to the default the moment one of its units left the catalog.
   */
  const entityIds = entityIdSet(catalog)
  const explicitSelectionIds = shape.explicitSelectionIds.filter(id => {
    if (entityIds.has(id as CanonicalId)) return true
    diagnostics.push({
      code: 'missing-selection',
      severity: 'warning',
      message: `Army document refers to missing selection ${id}`,
      subject: id,
    })
    return false
  }) as CanonicalId[]

  const reminderPreferences = readReminderPreferences(shape.reminderPreferences, diagnostics)

  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    return { diagnostics }
  }

  return {
    document: createAos4ArmyDocument({
      id: shape.id,
      name: shape.name,
      rulesContextId: shape.rulesContextId as RulesContextId,
      ...(shape.allowsLegends ? { allowsLegends: true } : {}),
      ...(shape.allowsHistorical ? { allowsHistorical: true } : {}),
      explicitSelectionIds,
      reminderPreferences,
    }),
    diagnostics,
  }
}

/**
 * The same document read without a catalog, for the catalog-free Home shell.
 *
 * The two checks it drops are the only reason `deserializeAos4ArmyDocument` needs a catalog at all:
 * a rules context the catalog does not carry fails the whole document, and an entity ID it does not
 * carry is dropped with a warning. Both need all 11,453 entities in memory, which is precisely what
 * the shell paints without waiting for.
 *
 * Skipping them is safe only because this is never the last word. The catalog-bound child runs
 * `loadAos4ArmyDocument` on mount and its result wins, so a selection this accepts and the catalog
 * has since retired is pruned a moment later rather than never. What the shell must *not* do is
 * persist what this accepted before that happens — see the save guard in `Home.tsx`.
 */
export const deserializeAos4ArmyDocumentStructure = (
  serialized: string
): DeserializeAos4ArmyDocumentResult => {
  const shapeResult = readAos4ArmyDocumentShape(serialized)
  if (!shapeResult.shape) return { diagnostics: shapeResult.diagnostics }
  const shape = shapeResult.shape

  const diagnostics: Aos4ArmyDocumentDiagnostic[] = []
  const reminderPreferences = readReminderPreferences(shape.reminderPreferences, diagnostics)
  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    return { diagnostics }
  }

  return {
    document: createAos4ArmyDocument({
      id: shape.id,
      name: shape.name,
      rulesContextId: shape.rulesContextId as RulesContextId,
      ...(shape.allowsLegends ? { allowsLegends: true } : {}),
      ...(shape.allowsHistorical ? { allowsHistorical: true } : {}),
      explicitSelectionIds: shape.explicitSelectionIds as CanonicalId[],
      reminderPreferences,
    }),
    diagnostics,
  }
}

export const setAos4ReminderPreference = (
  document: Aos4ArmyDocument,
  reminderId: ReminderOccurrenceId,
  preference: Aos4ReminderPreference
): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    ...document,
    reminderPreferences: {
      ...document.reminderPreferences,
      [reminderId]: {
        ...document.reminderPreferences[reminderId],
        ...preference,
      },
    },
  })
