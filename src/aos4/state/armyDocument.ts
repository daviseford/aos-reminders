import type { Aos4Catalog, CanonicalId, RulesContextId } from '../domain'
import type { ReminderOccurrenceId } from '../reminders'

export const AOS4_ARMY_DOCUMENT_SCHEMA_VERSION = 1 as const

export interface Aos4ReminderPreference {
  hidden?: boolean
  note?: string
  order?: number
}

/**
 * A selection this army had explicitly picked that a catalog update removed. The deserializer
 * filters the dead ID with a `missing-selection` warning so the army survives the update; the
 * caller then records the removal here so the changelog UI can explain what happened and where.
 * Revision and publication IDs are opaque strings at this layer — they come from the changelog
 * artifact.
 */
export interface Aos4RemovedSelection {
  selectionId: string
  /** The changelog artifact revision whose catalog first lacked the selection. */
  detectedAtRevision: string
  /** Set when the caller can attribute the removal to a specific publication. */
  publicationId?: string
}

/**
 * Per-army changelog state. Optional and serialized only when non-empty, so documents that never
 * saw a changelog round-trip byte-identically to schema 1 output written before the field existed.
 * Old clients drop the field on round-trip; that document simply re-enters the rollout rule
 * (stamped current on next new-client load, no banner) — a deliberate degrade, never a false
 * banner.
 */
export interface Aos4ChangelogState {
  /** The changelog artifact revision this army has fully caught up to. */
  lastSeenRevision?: string
  /** Publications whose changes the user has acknowledged for this army. */
  acknowledgedPublicationIds?: string[]
  /** Selections lost to catalog updates, kept until their publication is acknowledged. */
  removedSelections?: Aos4RemovedSelection[]
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
  changelog?: Aos4ChangelogState
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

// Rebuilding from only the known fields is what makes unknown-field tolerance safe: whatever a
// future client wrote alongside these fields is dropped here, exactly like the top-level document.
const normalizedRemovedSelection = (record: Aos4RemovedSelection): Aos4RemovedSelection => ({
  selectionId: record.selectionId,
  detectedAtRevision: record.detectedAtRevision,
  ...(record.publicationId ? { publicationId: record.publicationId } : {}),
})

const normalizedChangelog = (value: Aos4ChangelogState | undefined): Aos4ChangelogState | undefined => {
  if (!value) return undefined
  const lastSeenRevision = value.lastSeenRevision?.trim()
  const acknowledgedPublicationIds = sortedUnique(value.acknowledgedPublicationIds ?? [])
  const removedSelections = (value.removedSelections ?? [])
    .map(normalizedRemovedSelection)
    .sort(
      (left, right) =>
        left.selectionId.localeCompare(right.selectionId) ||
        left.detectedAtRevision.localeCompare(right.detectedAtRevision)
    )
  const changelog: Aos4ChangelogState = {
    ...(lastSeenRevision ? { lastSeenRevision } : {}),
    ...(acknowledgedPublicationIds.length ? { acknowledgedPublicationIds } : {}),
    ...(removedSelections.length ? { removedSelections } : {}),
  }
  return Object.keys(changelog).length ? changelog : undefined
}

export const createAos4ArmyDocument = (
  input: Omit<Aos4ArmyDocument, 'schemaVersion' | 'reminderPreferences'> & {
    reminderPreferences?: Aos4ArmyDocument['reminderPreferences']
  }
): Aos4ArmyDocument => {
  const changelog = normalizedChangelog(input.changelog)
  return {
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
    ...(changelog ? { changelog } : {}),
  }
}

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

// Unknown keys inside the changelog state are tolerated (and dropped on reconstruction) for the
// same reason unknown top-level fields are: a future client may write more than we know about,
// and rejecting it would reset the army. Only the known fields are type-checked.
const isRemovedSelection = (value: unknown): value is Aos4RemovedSelection =>
  isObject(value) &&
  typeof value.selectionId === 'string' &&
  Boolean(value.selectionId.trim()) &&
  typeof value.detectedAtRevision === 'string' &&
  Boolean(value.detectedAtRevision.trim()) &&
  (value.publicationId === undefined || typeof value.publicationId === 'string')

const isChangelogState = (value: unknown): value is Aos4ChangelogState =>
  isObject(value) &&
  (value.lastSeenRevision === undefined || typeof value.lastSeenRevision === 'string') &&
  (value.acknowledgedPublicationIds === undefined ||
    (Array.isArray(value.acknowledgedPublicationIds) &&
      value.acknowledgedPublicationIds.every(id => typeof id === 'string'))) &&
  (value.removedSelections === undefined ||
    (Array.isArray(value.removedSelections) && value.removedSelections.every(isRemovedSelection)))

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
    (value.allowsLegends !== undefined && typeof value.allowsLegends !== 'boolean') ||
    (value.allowsHistorical !== undefined && typeof value.allowsHistorical !== 'boolean') ||
    !Array.isArray(value.explicitSelectionIds) ||
    value.explicitSelectionIds.some(id => typeof id !== 'string') ||
    !isObject(value.reminderPreferences) ||
    (value.changelog !== undefined && !isChangelogState(value.changelog))
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

  // A catalog update that removed a selected entity must not cost the user their army: the dead
  // selection is filtered with a warning — never an error, which would reset the document to the
  // default — and each filtered ID rides the diagnostic's `subject` so the caller can write an
  // `Aos4RemovedSelection` record with the revision it detected the removal at.
  const entityIds = new Set(catalog.entities.map(entity => entity.id))
  const explicitSelectionIds = (value.explicitSelectionIds as string[]).filter(id => {
    if (entityIds.has(id as CanonicalId)) return true
    diagnostics.push({
      code: 'missing-selection',
      severity: 'warning',
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
      ...(value.allowsLegends === true ? { allowsLegends: true } : {}),
      ...(value.allowsHistorical === true ? { allowsHistorical: true } : {}),
      explicitSelectionIds,
      reminderPreferences,
      ...(value.changelog !== undefined ? { changelog: value.changelog as Aos4ChangelogState } : {}),
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

/**
 * Stamps the army as caught up to `revision`. Removal records without a publication attribution
 * clear once the stamp advances past the revision they were detected at (revisions are opaque
 * here, so "past" means the caller stamped a different, by-contract-later revision); attributed
 * records wait for their publication to be acknowledged instead.
 */
export const stampAos4ChangelogRevision = (
  document: Aos4ArmyDocument,
  revision: string
): Aos4ArmyDocument => {
  const changelog = document.changelog ?? {}
  const removedSelections = (changelog.removedSelections ?? []).filter(
    record => record.publicationId !== undefined || record.detectedAtRevision === revision
  )
  if (
    changelog.lastSeenRevision === revision &&
    removedSelections.length === (changelog.removedSelections ?? []).length
  ) {
    return document
  }
  return createAos4ArmyDocument({
    ...document,
    changelog: { ...changelog, lastSeenRevision: revision, removedSelections },
  })
}

/** Records a selection the catalog no longer carries; a selection is recorded at most once. */
export const recordAos4RemovedSelection = (
  document: Aos4ArmyDocument,
  record: Aos4RemovedSelection
): Aos4ArmyDocument => {
  const changelog = document.changelog ?? {}
  const removedSelections = changelog.removedSelections ?? []
  if (removedSelections.some(existing => existing.selectionId === record.selectionId)) return document
  return createAos4ArmyDocument({
    ...document,
    changelog: { ...changelog, removedSelections: [...removedSelections, record] },
  })
}

/**
 * Acknowledges a publication for this army, idempotently, and clears the removal records
 * attributed to it — the user has now seen why those selections disappeared.
 */
export const acknowledgeAos4Publication = (
  document: Aos4ArmyDocument,
  publicationId: string
): Aos4ArmyDocument => {
  const changelog = document.changelog ?? {}
  const acknowledgedPublicationIds = changelog.acknowledgedPublicationIds ?? []
  const removedSelections = (changelog.removedSelections ?? []).filter(
    record => record.publicationId !== publicationId
  )
  if (
    acknowledgedPublicationIds.includes(publicationId) &&
    removedSelections.length === (changelog.removedSelections ?? []).length
  ) {
    return document
  }
  return createAos4ArmyDocument({
    ...document,
    changelog: {
      ...changelog,
      acknowledgedPublicationIds: [...acknowledgedPublicationIds, publicationId],
      removedSelections,
    },
  })
}

export interface AdvanceAos4ChangelogStampInput {
  /** The changelog artifact revision the client is currently running against. */
  currentRevision: string
  /** Publication IDs the changelog artifact still retains. */
  retainedPublicationIds: string[]
  /** The subset of retained publications whose changes affect this army. */
  affectingPublicationIds: string[]
}

/**
 * Advances `lastSeenRevision` to the current revision once no retained publication affecting this
 * army remains unacknowledged; while one does, the document is returned unchanged so the banner
 * keeps pointing at it. Pure — the caller supplies the live artifact values.
 */
export const advanceAos4ChangelogStamp = (
  document: Aos4ArmyDocument,
  input: AdvanceAos4ChangelogStampInput
): Aos4ArmyDocument => {
  const acknowledged = new Set(document.changelog?.acknowledgedPublicationIds ?? [])
  const affecting = new Set(input.affectingPublicationIds)
  const blocked = input.retainedPublicationIds.some(id => affecting.has(id) && !acknowledged.has(id))
  return blocked ? document : stampAos4ChangelogRevision(document, input.currentRevision)
}
