import type { CanonicalId } from '../domain'
import type { Aos4ArmyDocument, Aos4RemovedSelection } from '../state'
import type { Aos4PublishedChangelog } from './ledger'
import type {
  ChangelogPublication,
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

const explainsSelection = (record: RemovedChangeRecord, selection: Aos4RemovedSelection): boolean =>
  selection.selectionId === record.entityId || selection.selectionId === record.ownership.warscrollId

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
        attributedRemovals.some(selection => explainsSelection(record, selection)) ||
        evaluateAos4ChangePredicate(record.predicate, selectionIds)
      ) {
        removals.push(record)
      }
    })
    const unexplainedRemovedSelections = attributedRemovals.filter(
      selection => !removals.some(record => explainsSelection(record, selection))
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

/**
 * True when the army's stamp names an acceptance the artifact no longer retains: the per-change
 * roll-up cannot be reconstructed, so the banner degrades to a generic pointer at /changelog.
 */
export const isAos4ChangelogStampBehind = (
  artifact: Aos4PublishedChangelog,
  document: Aos4ArmyDocument
): boolean => {
  const stamp = document.changelog?.lastSeenRevision
  if (!stamp || artifact.revision === null) return false
  return stamp !== artifact.revision && !artifact.retainedEntryIds.includes(stamp)
}

export const totalAos4ChangelogImpact = (impacts: readonly Aos4PublicationImpact[]): number =>
  impacts.reduce((sum, impact) => sum + impact.total, 0)
