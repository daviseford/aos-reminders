import type { CanonicalId, EntityKind } from '../domain'

export const AOS4_CHANGELOG_SCHEMA_VERSION = 1 as const

/** JSON-serializable canonical fact value carried on change records. */
export type ChangelogJsonValue =
  string | number | boolean | null | ChangelogJsonValue[] | { [key: string]: ChangelogJsonValue }

/**
 * Reviewed disposition for a cohort of changes between two accepted snapshots.
 *
 * - `rules-driven`: real rules changes attributed to exactly one publication each
 * - `correction`: our own transcription/normalization fixes, published without a source publication
 * - `churn`: regeneration noise excluded from the changelog entirely
 */
export type ChangeDisposition = 'rules-driven' | 'correction' | 'churn'

/**
 * Scopes an acceptance cohort or publication to a set of changed facts.
 *
 * A record matches when its canonical entity ID is listed, one of its owning factions (or the
 * entity itself, for factions) is listed, or its owning warscroll (or the entity itself, for
 * warscrolls) is listed. An omitted selector matches every record; an empty selector matches none.
 */
export interface ChangelogFactSelector {
  entityIds?: CanonicalId[]
  factionIds?: CanonicalId<'faction'>[]
  warscrollIds?: CanonicalId<'warscroll'>[]
}

export interface ChangelogPublication {
  publicationId: CanonicalId<'publication'>
  name: string
  source: string
  effectiveDate?: string
}

export interface ChangelogPublicationInput extends ChangelogPublication {
  /** Required for unambiguous attribution when one acceptance carries several publications. */
  selector?: ChangelogFactSelector
}

export interface ChangelogCohortInput {
  name: string
  disposition: ChangeDisposition
  /** Which changed facts belong to this cohort; omitted means every fact. */
  selector?: ChangelogFactSelector
  /** Rules-driven only: the publications this cohort draws from; omitted means every acceptance publication. */
  publicationIds?: CanonicalId<'publication'>[]
}

/** The reviewed acceptance entry accompanying a corpus refresh, driving attribution and exclusion. */
export interface ChangelogAcceptance {
  publications: ChangelogPublicationInput[]
  cohorts: ChangelogCohortInput[]
}

/**
 * The predicate under which an army projected a changed fact, evaluated against a document's
 * explicit selection IDs plus its faction:
 *
 * - `'universal'`: auto-granted to every army regardless of selections
 * - `faction`: auto-granted by selecting the faction (battle traits and similar)
 * - `warscroll`: projected by selecting the warscroll (its abilities, weapons, battle profile)
 * - `content-group`: projected by selecting the group (formations, lores), or automatically for
 *   documents whose faction appears in `autoGrantedByFactionIds`
 */
export type ChangeSelectionPredicate =
  | 'universal'
  | { kind: 'faction'; factionId: CanonicalId<'faction'> }
  | { kind: 'warscroll'; warscrollId: CanonicalId<'warscroll'> }
  | {
      kind: 'content-group'
      contentGroupId: CanonicalId<'content-group'>
      autoGrantedByFactionIds: CanonicalId<'faction'>[]
    }

export interface ChangePublicationAttribution extends ChangelogPublication {
  kind: 'publication'
}

export interface ChangeCorrectionAttribution {
  kind: 'correction'
}

export type ChangeAttribution = ChangePublicationAttribution | ChangeCorrectionAttribution

/** One canonical fact that changed, keyed by its dotted canonical field path. */
export interface ChangeFieldDelta {
  field: string
  previous?: ChangelogJsonValue
  next?: ChangelogJsonValue
}

/** Owning IDs carried on every record so consumers never need a catalog to scope a change. */
export interface ChangeRecordOwnership {
  factionIds: CanonicalId<'faction'>[]
  warscrollId?: CanonicalId<'warscroll'>
  contentGroupIds: CanonicalId<'content-group'>[]
}

interface ChangeRecordBase {
  entityId: CanonicalId
  entityKind: EntityKind
  /** Source-faithful display name (current snapshot; prior snapshot for removals). */
  name: string
  attribution: ChangeAttribution
  predicate: ChangeSelectionPredicate
  ownership: ChangeRecordOwnership
}

export interface AddedChangeRecord extends ChangeRecordBase {
  changeKind: 'added'
  addedFacts: Record<string, ChangelogJsonValue>
}

export interface ModifiedChangeRecord extends ChangeRecordBase {
  changeKind: 'modified'
  fields: ChangeFieldDelta[]
}

export interface RemovedChangeRecord extends ChangeRecordBase {
  changeKind: 'removed'
  removedFacts: Record<string, ChangelogJsonValue>
}

export type ChangeRecord = AddedChangeRecord | ModifiedChangeRecord | RemovedChangeRecord

/** The deterministic changelog artifact produced by diffing two inflated catalogs. */
export interface ChangelogArtifact {
  schemaVersion: typeof AOS4_CHANGELOG_SCHEMA_VERSION
  priorGeneratedAt: string
  currentGeneratedAt: string
  publications: ChangelogPublication[]
  records: ChangeRecord[]
}
