import type { CanonicalId } from '../domain'
import type { Aos4ArmyDocument, Aos4RemovedSelection } from '../state'
import type { Aos4PublishedChangelog } from './ledger'
import type {
  ChangelogPublication,
  ChangeRecord,
  ChangeSelectionPredicate,
  ModifiedChangeRecord,
  RemovedChangeRecord,
} from './types'

/**
 * Pure per-army evaluation of the published changelog artifact: which retained publications changed
 * something this army projects, so the in-army banner (and the reminder markers after it) never
 * re-derive matching rules of their own.
 */

/**
 * Evaluates a change record's selection predicate against an army's explicit selection IDs. The
 * document's faction is itself an explicit selection, so one set covers every predicate kind.
 */
export const evaluateAos4ChangePredicate = (
  predicate: ChangeSelectionPredicate,
  explicitSelectionIds: readonly string[]
): boolean => {
  if (predicate === 'universal') return true
  const selected = new Set(explicitSelectionIds)
  switch (predicate.kind) {
    case 'faction':
      return selected.has(predicate.factionId)
    case 'warscroll':
      return selected.has(predicate.warscrollId)
    case 'content-group':
      return (
        selected.has(predicate.contentGroupId) ||
        predicate.autoGrantedByFactionIds.some(factionId => selected.has(factionId))
      )
  }
}

export interface Aos4ChangelogArmyInput {
  document: Aos4ArmyDocument
  /** Canonical ability IDs the army's reminder projection currently carries (hidden ones included). */
  projectedAbilityIds: readonly string[]
}

export interface Aos4PublicationImpact {
  publication: ChangelogPublication
  /** Modified reminder-backed ability records the army currently projects. */
  reminderChanges: ModifiedChangeRecord[]
  /** Modified records on selected units outside the reminders: points, unit size, characteristics. */
  profileChanges: ModifiedChangeRecord[]
  /** Removed records that applied to this army, by predicate or by a document removal record. */
  removals: RemovedChangeRecord[]
  /** Document removal records attributed here that no retained artifact record explains. */
  unexplainedRemovedSelections: Aos4RemovedSelection[]
  /** Reminder, profile, and removal impacts combined. */
  total: number
}

const explainsSelection = (record: RemovedChangeRecord, selectionId: string): boolean =>
  selectionId === record.entityId || selectionId === record.ownership.warscrollId

/**
 * The first removed-change record that explains why `selectionId` no longer resolves: either the
 * selection itself was removed, or the warscroll that owned it was. Home uses this to attribute a
 * load-time missing-selection diagnostic to a publication without re-deriving the predicate.
 */
export const findAos4ExplainingRemovedRecord = (
  records: readonly ChangeRecord[],
  selectionId: string
): RemovedChangeRecord | undefined =>
  records.find(
    (record): record is RemovedChangeRecord =>
      record.changeKind === 'removed' && explainsSelection(record, selectionId)
  )

/**
 * Computes each retained publication's impact on one army, in the artifact's newest-first order.
 * `added` records never produce in-army impact: nothing this army already fields changed, so they
 * belong to the public /changelog page alone.
 */
export const computeAos4PublicationImpacts = (
  artifact: Aos4PublishedChangelog,
  input: Aos4ChangelogArmyInput
): Aos4PublicationImpact[] => {
  const projected = new Set(input.projectedAbilityIds)
  const selectionIds = input.document.explicitSelectionIds
  const removedSelections = input.document.changelog?.removedSelections ?? []
  return artifact.publications.map(publication => {
    const attributedRemovals = removedSelections.filter(
      selection => selection.publicationId === publication.publicationId
    )
    const reminderChanges: ModifiedChangeRecord[] = []
    const profileChanges: ModifiedChangeRecord[] = []
    const removals: RemovedChangeRecord[] = []
    artifact.records.forEach(record => {
      if (
        record.attribution.kind !== 'publication' ||
        record.attribution.publicationId !== publication.publicationId
      ) {
        return
      }
      if (record.changeKind === 'added') return
      if (record.changeKind === 'modified') {
        if (!evaluateAos4ChangePredicate(record.predicate, selectionIds)) return
        if (record.entityKind === 'ability') {
          // Reminder-backed records must also be projected: a warscroll can be selected while an
          // ability on it is filtered out of this army's reminders by its rules context.
          if (projected.has(record.entityId)) reminderChanges.push(record)
          return
        }
        if (
          record.entityKind === 'warscroll' ||
          record.entityKind === 'battle-profile' ||
          record.entityKind === 'weapon'
        ) {
          profileChanges.push(record)
        }
        return
      }
      // Removed: the predicate can no longer match a selection the update itself deleted, so a
      // document removal record attributed to this publication applies the record too.
      if (
        attributedRemovals.some(selection => explainsSelection(record, selection.selectionId)) ||
        evaluateAos4ChangePredicate(record.predicate, selectionIds)
      ) {
        removals.push(record)
      }
    })
    const unexplainedRemovedSelections = attributedRemovals.filter(
      selection => !removals.some(record => explainsSelection(record, selection.selectionId))
    )
    const total =
      reminderChanges.length + profileChanges.length + removals.length + unexplainedRemovedSelections.length
    return { publication, reminderChanges, profileChanges, removals, unexplainedRemovedSelections, total }
  })
}

/** Retained publications this army has not acknowledged yet, newest acceptance first. */
export const unacknowledgedAos4PublicationIds = (
  artifact: Aos4PublishedChangelog,
  document: Aos4ArmyDocument
): CanonicalId<'publication'>[] => {
  const acknowledged = new Set(document.changelog?.acknowledgedPublicationIds ?? [])
  return artifact.retainedPublicationIds.filter(publicationId => !acknowledged.has(publicationId))
}

export type Aos4ChangelogStampStatus =
  { kind: 'current' } | { kind: 'known'; pendingRetainedEntryIds: string[] } | { kind: 'unknown' }

/**
 * Places an army's stamp against the artifact's append-only entry knowledge (`knownEntryIds`).
 *
 * - `current`: the stamp names the newest acceptance; nothing is pending.
 * - `known`: the artifact remembers the acceptance, whatever its disposition — an army stamped at
 *   a churn-only acceptance lands here after the next rules-driven one, never in the behind path.
 *   `pendingRetainedEntryIds` lists the retained rules-driven acceptances after the stamp, newest
 *   first: their publications are enumerable, so the normal per-publication roll-up applies.
 * - `unknown`: the artifact has no memory of the acceptance, so what happened since cannot be
 *   enumerated and the banner degrades to the generic pointer at /changelog.
 */
export const resolveAos4ChangelogStampStatus = (
  artifact: Aos4PublishedChangelog,
  stamp: string
): Aos4ChangelogStampStatus => {
  if (artifact.revision !== null && stamp === artifact.revision) return { kind: 'current' }
  const position = artifact.knownEntryIds.indexOf(stamp)
  if (position === -1) return { kind: 'unknown' }
  const after = new Set(artifact.knownEntryIds.slice(position + 1))
  return {
    kind: 'known',
    pendingRetainedEntryIds: artifact.retainedEntryIds.filter(entryId => after.has(entryId)),
  }
}

/**
 * True when the army's stamp names an acceptance the artifact has no memory of: what happened
 * since cannot be enumerated, so the banner degrades to a generic pointer at /changelog. A known
 * stamp — retained, aged out, or churn-only — is never behind: its pending publications flow the
 * normal roll-up instead.
 */
export const isAos4ChangelogStampBehind = (
  artifact: Aos4PublishedChangelog,
  document: Aos4ArmyDocument
): boolean => {
  const stamp = document.changelog?.lastSeenRevision
  if (!stamp || artifact.revision === null) return false
  return resolveAos4ChangelogStampStatus(artifact, stamp).kind === 'unknown'
}

export const totalAos4ChangelogImpact = (impacts: readonly Aos4PublicationImpact[]): number =>
  impacts.reduce((sum, impact) => sum + impact.total, 0)
