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

export const deserializeAos4ArmyDocument = (
  serialized: string,
  catalog: Aos4Catalog
): DeserializeAos4ArmyDocumentResult => {
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

  const diagnostics: Aos4ArmyDocumentDiagnostic[] = []
  const documentId = value.id as string
  const documentName = value.name as string
  const rulesContext = value.rulesContextId as string
  const contextExists = catalog.rulesContexts.some(context => context.id === rulesContext)
  if (!contextExists) {
    diagnostics.push({
      code: 'missing-rules-context',
      severity: 'error',
      message: `Army document refers to missing rules context ${rulesContext}`,
      subject: rulesContext,
    })
  }

  const entityIds = new Set(catalog.entities.map(entity => entity.id))
  const explicitSelectionIds = (value.explicitSelectionIds as string[]).filter(id => {
    if (entityIds.has(id as CanonicalId)) return true
    diagnostics.push({
      code: 'missing-selection',
      severity: 'error',
      message: `Army document refers to missing selection ${id}`,
      subject: id,
    })
    return false
  }) as CanonicalId[]

  const reminderPreferences = Object.fromEntries(
    Object.entries(value.reminderPreferences).flatMap(([id, preference]) => {
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

  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) {
    return { diagnostics }
  }

  return {
    document: createAos4ArmyDocument({
      id: documentId,
      name: documentName,
      rulesContextId: rulesContext as RulesContextId,
      explicitSelectionIds,
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
