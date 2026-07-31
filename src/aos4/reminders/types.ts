import type { AbilityText, AbilityTiming, CanonicalId, SourceReference, TimingKind } from '../domain'
import type { SelectionCause } from '../select'

declare const reminderOccurrenceIdBrand: unique symbol

export type ReminderOccurrenceId = `reminder:${string}` & {
  readonly [reminderOccurrenceIdBrand]: true
}

export interface ProjectedReminder {
  id: ReminderOccurrenceId
  occurrenceIds: ReminderOccurrenceId[]
  abilityIds: CanonicalId<'ability'>[]
  name: string
  text: AbilityText
  timing: AbilityTiming
  lane: TimingKind
  causes: SelectionCause[]
  contributingEntityIds: CanonicalId[]
  sourceRefs: SourceReference[]
}
