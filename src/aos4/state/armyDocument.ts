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
  /**
   * Which unit carries each enhancement, keyed enhancement ID → bearer warscroll ID.
   *
   * An imported roster assigns its artefacts and heroic traits to a specific hero, and without
   * this the flat selection set forgets that — the enhancement's reminder reads as if it applied
   * to every unit (#1989). Entries are kept only while both IDs are explicit selections, and the
   * field is only serialized when non-empty, so documents without bearers round-trip
   * byte-identically to schema 1 output written before the field existed.
   */
  enhancementBearers?: Partial<Record<CanonicalId, CanonicalId>>
  reminderPreferences: Partial<Record<ReminderOccurrenceId, Aos4ReminderPreference>>
  /**
   * Top-level fields this build doesn't recognize, carried through unread so a stale client (an
   * older service-worker build reading a document a newer client wrote) doesn't silently delete
   * whatever a future field added under the unchanged schemaVersion 1 — the same forward-compatible
   * pattern `allowsLegends`, `allowsHistorical`, and `enhancementBearers` shipped under, generalized
   * (#1991). Bounded in `readAos4ArmyDocumentShape`/`createAos4ArmyDocument` (count, key length,
   * value depth/width, and byte size, with `__proto__`/`constructor`/`prototype` always rejected) so
   * hostile or oversized data can never accumulate; anything over the bound is dropped with a
   * warning diagnostic rather than failing the document. Serialized only when non-empty, so
   * documents without unrecognized fields round-trip byte-identically to output written before this
   * existed.
   */
  unknownFields?: Record<string, unknown>
}

export type Aos4ArmyDocumentDiagnosticCode =
  | 'invalid-json'
  | 'incompatible-schema'
  | 'invalid-document'
  | 'missing-rules-context'
  | 'missing-selection'
  | 'invalid-reminder-preference'
  | 'unsupported-unknown-field'

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

/**
 * A bearer entry is presentation metadata over the selection set, so it lives and dies with the
 * selections it names: an entry whose enhancement or bearer is no longer an explicit selection —
 * pruned by a catalog update, or removed by the player — is dropped rather than left dangling.
 */
const normalizedBearers = (
  bearers: Aos4ArmyDocument['enhancementBearers'],
  explicitSelectionIds: CanonicalId[]
): Aos4ArmyDocument['enhancementBearers'] => {
  const explicitIds = new Set(explicitSelectionIds)
  const entries = Object.entries(bearers ?? {})
    .filter(
      (entry): entry is [CanonicalId, CanonicalId] =>
        Boolean(entry[1]) &&
        entry[0] !== entry[1] &&
        explicitIds.has(entry[0] as CanonicalId) &&
        explicitIds.has(entry[1] as CanonicalId)
    )
    .sort(([left], [right]) => left.localeCompare(right))
  return entries.length ? Object.fromEntries(entries) : undefined
}

const KNOWN_TOP_LEVEL_FIELDS = new Set([
  'schemaVersion',
  'id',
  'name',
  'rulesContextId',
  'allowsLegends',
  'allowsHistorical',
  'explicitSelectionIds',
  'enhancementBearers',
  'reminderPreferences',
])

// Never carried, regardless of nesting depth: a literal object-literal key with this name sets a
// prototype rather than an own property, and downstream code (a future deep-merge, a naive clone)
// may not use spread's safer semantics. Rejecting the key is cheap insurance against a class of bug
// nothing here needs to specifically anticipate.
const UNKNOWN_FIELD_DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

const MAX_UNKNOWN_TOP_LEVEL_KEYS_SCANNED = 4_096
const MAX_UNKNOWN_FIELD_COUNT = 32
const MAX_UNKNOWN_FIELD_KEY_LENGTH = 128
const MAX_UNKNOWN_FIELD_VALUE_BYTES = 4_096
const MAX_UNKNOWN_FIELDS_TOTAL_BYTES = 16_384
const MAX_UNKNOWN_FIELD_VALUE_DEPTH = 6
const MAX_UNKNOWN_FIELD_VALUE_NODES = 500

/**
 * Whether a JSON value (from `JSON.parse`, so never a function, symbol, or cycle) stays within the
 * nesting-depth and node-count bounds, walked breadth-first with a shrinking budget so neither a
 * deeply-nested payload (stack depth) nor a very wide one (a single huge array/object literal
 * pushed onto the queue in one step) can cost more than `MAX_UNKNOWN_FIELD_VALUE_NODES` work. Also
 * rejects a dangerous key at any nesting level, not only the top.
 */
const isBoundedJsonValue = (root: unknown): boolean => {
  let remaining = MAX_UNKNOWN_FIELD_VALUE_NODES
  const queue: { value: unknown; depth: number }[] = [{ value: root, depth: 0 }]
  while (queue.length) {
    const { value, depth } = queue.shift() as { value: unknown; depth: number }
    remaining -= 1
    if (remaining < 0 || depth > MAX_UNKNOWN_FIELD_VALUE_DEPTH) return false
    if (Array.isArray(value)) {
      if (value.length > remaining) return false
      value.forEach(item => queue.push({ value: item, depth: depth + 1 }))
    } else if (isObject(value)) {
      const entries = Object.entries(value)
      if (entries.length > remaining) return false
      for (const [key, item] of entries) {
        if (UNKNOWN_FIELD_DANGEROUS_KEYS.has(key)) return false
        queue.push({ value: item, depth: depth + 1 })
      }
    }
  }
  return true
}

const jsonByteLength = (value: unknown): number | undefined => {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length
  } catch {
    return undefined
  }
}

/**
 * Bounds an unknown-field bucket so data this module never validated — a hand-edited document, a
 * compromised or buggy API response — can't accumulate without limit: a dangerous key, an over-deep
 * or over-wide value, a value over the per-field byte cap, or a bucket over the total field
 * count/byte cap is dropped rather than carried through. Idempotent, so re-normalizing an
 * already-bounded bucket (every round trip through `createAos4ArmyDocument`) is a no-op, and safe to
 * call from both deserializers (with a diagnostics sink) and the builder (without one).
 */
const boundedUnknownFields = (
  candidate: Record<string, unknown> | undefined,
  diagnostics?: Aos4ArmyDocumentDiagnostic[]
): Record<string, unknown> | undefined => {
  if (!candidate) return undefined
  const keys = Object.keys(candidate).sort((left, right) => left.localeCompare(right))
  if (!keys.length) return undefined

  if (keys.length > MAX_UNKNOWN_TOP_LEVEL_KEYS_SCANNED) {
    diagnostics?.push({
      code: 'unsupported-unknown-field',
      severity: 'warning',
      message: `Army document has ${keys.length} unrecognized top-level fields, over the safe scan limit; all were dropped`,
    })
    return undefined
  }

  let droppedCount = 0
  let totalBytes = 0
  const accepted: [string, unknown][] = []

  for (const key of keys) {
    if (
      accepted.length >= MAX_UNKNOWN_FIELD_COUNT ||
      UNKNOWN_FIELD_DANGEROUS_KEYS.has(key) ||
      !key.length ||
      key.length > MAX_UNKNOWN_FIELD_KEY_LENGTH ||
      !isBoundedJsonValue(candidate[key])
    ) {
      droppedCount += 1
      continue
    }
    const size = jsonByteLength(candidate[key])
    if (
      size === undefined ||
      size > MAX_UNKNOWN_FIELD_VALUE_BYTES ||
      totalBytes + size > MAX_UNKNOWN_FIELDS_TOTAL_BYTES
    ) {
      droppedCount += 1
      continue
    }
    totalBytes += size
    accepted.push([key, candidate[key]])
  }

  if (droppedCount > 0) {
    diagnostics?.push({
      code: 'unsupported-unknown-field',
      severity: 'warning',
      message: `Army document had ${droppedCount} unrecognized field(s) dropped for exceeding the safe size, depth, or count bound`,
    })
  }

  return accepted.length ? Object.fromEntries(accepted) : undefined
}

export const createAos4ArmyDocument = (
  input: Omit<Aos4ArmyDocument, 'schemaVersion' | 'reminderPreferences'> & {
    reminderPreferences?: Aos4ArmyDocument['reminderPreferences']
  }
): Aos4ArmyDocument => {
  const explicitSelectionIds = sortedUnique(input.explicitSelectionIds)
  const enhancementBearers = normalizedBearers(input.enhancementBearers, explicitSelectionIds)
  const unknownFields = boundedUnknownFields(input.unknownFields)
  return {
    schemaVersion: AOS4_ARMY_DOCUMENT_SCHEMA_VERSION,
    id: input.id.trim(),
    name: input.name.trim(),
    rulesContextId: input.rulesContextId,
    ...(input.allowsLegends ? { allowsLegends: true } : {}),
    ...(input.allowsHistorical ? { allowsHistorical: true } : {}),
    explicitSelectionIds,
    ...(enhancementBearers ? { enhancementBearers } : {}),
    reminderPreferences: Object.fromEntries(
      Object.entries(input.reminderPreferences ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .flatMap(([id, preference]) => {
          if (!preference) return []
          const normalized = normalizedPreference(preference)
          return Object.keys(normalized).length ? [[id, normalized]] : []
        })
    ),
    ...(unknownFields ? { unknownFields } : {}),
  }
}

/**
 * Unlike every other field, `unknownFields` is not written as its own JSON property: its entries
 * belong at the top level of the wire format, the same level a future known field will actually
 * occupy once a client recognizes it. Keeping it as a nested bucket on the in-memory
 * `Aos4ArmyDocument` (rather than an index signature spread across the whole type) keeps every other
 * property precisely typed; this is the one place that reshapes it back to the wire's flat shape.
 * A document with no unknown fields produces exactly the object `createAos4ArmyDocument` returns
 * minus the always-absent bucket, so the byte-identical round trip for schema-1 output written
 * before this existed is unaffected.
 *
 * Every caller that hands an `Aos4ArmyDocument` to `JSON.stringify` for another system to read back
 * — local storage below, and the army API client's create/update/share request bodies — must go
 * through this rather than stringifying the document directly. Skipping it nests the bucket under a
 * literal `unknownFields` key instead of flattening it, and that key doesn't match anything in
 * `KNOWN_TOP_LEVEL_FIELDS`, so the next read treats the whole bucket as one more unrecognized field
 * and wraps it again — an extra nesting level on every round trip through that path.
 */
export const toWireAos4ArmyDocument = (document: Aos4ArmyDocument): Record<string, unknown> => {
  const { unknownFields, ...known } = createAos4ArmyDocument(document)
  return unknownFields ? { ...known, ...unknownFields } : known
}

export const serializeAos4ArmyDocument = (document: Aos4ArmyDocument): string =>
  `${JSON.stringify(toWireAos4ArmyDocument(document), null, 2)}\n`

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
  enhancementBearers: Record<string, string>
  reminderPreferences: Record<string, unknown>
  unknownFields?: Record<string, unknown>
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
    (value.enhancementBearers !== undefined &&
      (!isObject(value.enhancementBearers) ||
        Object.values(value.enhancementBearers).some(id => typeof id !== 'string'))) ||
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

  const shapeDiagnostics: Aos4ArmyDocumentDiagnostic[] = []
  const unknownFieldCandidate = Object.fromEntries(
    Object.entries(value).filter(([key]) => !KNOWN_TOP_LEVEL_FIELDS.has(key))
  )

  return {
    shape: {
      id: value.id as string,
      name: value.name as string,
      rulesContextId: value.rulesContextId as string,
      allowsLegends: value.allowsLegends === true,
      allowsHistorical: value.allowsHistorical === true,
      explicitSelectionIds: value.explicitSelectionIds as string[],
      enhancementBearers: (value.enhancementBearers ?? {}) as Record<string, string>,
      reminderPreferences: value.reminderPreferences,
      unknownFields: boundedUnknownFields(unknownFieldCandidate, shapeDiagnostics),
    },
    diagnostics: shapeDiagnostics,
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
 * The membership Set over all 11,480 entity IDs, built once per catalog rather than once per
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

  const diagnostics: Aos4ArmyDocumentDiagnostic[] = [...shapeResult.diagnostics]
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
      // Normalization drops any entry whose enhancement or bearer was filtered above, so a
      // catalog update that retires either ID costs the army the attribution, never the document.
      enhancementBearers: shape.enhancementBearers as Aos4ArmyDocument['enhancementBearers'],
      reminderPreferences,
      unknownFields: shape.unknownFields,
    }),
    diagnostics,
  }
}

/**
 * The same document read without a catalog, for the catalog-free Home shell.
 *
 * The two checks it drops are the only reason `deserializeAos4ArmyDocument` needs a catalog at all:
 * a rules context the catalog does not carry fails the whole document, and an entity ID it does not
 * carry is dropped with a warning. Both need all 11,480 entities in memory, which is precisely what
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

  const diagnostics: Aos4ArmyDocumentDiagnostic[] = [...shapeResult.diagnostics]
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
      enhancementBearers: shape.enhancementBearers as Aos4ArmyDocument['enhancementBearers'],
      reminderPreferences,
      unknownFields: shape.unknownFields,
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
