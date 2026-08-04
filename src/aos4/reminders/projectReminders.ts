import type {
  Ability,
  AbilityCost,
  AbilityText,
  Aos4Catalog,
  CanonicalId,
  SourceReference,
} from '../domain'
import type { ResolvedSelection, SelectionCause } from '../select'
import { reminderOccurrenceId, semanticTimingKey } from './reminderIdentity'
import { orderReminders } from './orderReminders'
import type { ProjectedReminder, ReminderOccurrenceId } from './types'

const compareIds = (left: string, right: string): number => left.localeCompare(right)

const sourceReferenceKey = (reference: SourceReference): string =>
  [reference.sourceRecordId, reference.field ?? '', reference.transformation ?? ''].join('|')

const causeKey = (cause: SelectionCause): string =>
  [cause.rootId, cause.entityPath.join('>'), cause.relationshipPath.join('>')].join('|')

const uniqueBy = <T>(values: Iterable<T>, key: (value: T) => string): T[] => {
  const unique = new Map<string, T>()
  Array.from(values).forEach(value => {
    const valueKey = key(value)
    if (!unique.has(valueKey)) unique.set(valueKey, value)
  })
  return Array.from(unique.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value)
}

const textKey = (text: AbilityText): string =>
  JSON.stringify([text.declare ?? '', text.reactionTrigger ?? '', text.effect])

const normalizedResourceKey = (resource: string): string =>
  resource.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US')

const costKey = (cost: AbilityCost | undefined): string => {
  if (!cost) return 'none'
  if (cost.kind === 'faction-resource') {
    return `${cost.kind}:${normalizedResourceKey(cost.resource)}:${cost.value}`
  }
  return `${cost.kind}:${cost.value}`
}

const displayKey = (ability: Ability, timingKey: string): string =>
  JSON.stringify([ability.name, textKey(ability.text), timingKey, costKey(ability.cost)])

const contributingIds = (causes: SelectionCause[], abilityIds: CanonicalId[]): CanonicalId[] =>
  Array.from(new Set([...abilityIds, ...causes.flatMap(cause => cause.entityPath)])).sort(compareIds)

const mergeReminder = (
  reminder: ProjectedReminder,
  occurrenceId: ReminderOccurrenceId,
  ability: Ability,
  causes: SelectionCause[]
): void => {
  reminder.occurrenceIds = Array.from(new Set([...reminder.occurrenceIds, occurrenceId])).sort(compareIds)
  reminder.abilityIds = Array.from(new Set([...reminder.abilityIds, ability.id])).sort(compareIds)
  reminder.keywords = Array.from(new Set([...reminder.keywords, ...ability.keywords])).sort(compareIds)
  reminder.causes = uniqueBy([...reminder.causes, ...causes], causeKey)
  reminder.contributingEntityIds = contributingIds(reminder.causes, reminder.abilityIds)
  reminder.sourceRefs = uniqueBy([...reminder.sourceRefs, ...ability.sourceRefs], sourceReferenceKey)
  reminder.id = reminder.occurrenceIds[0]
}

export const projectReminders = (catalog: Aos4Catalog, selection: ResolvedSelection): ProjectedReminder[] => {
  const selectedIds = new Set(selection.selectedIds)
  const causesByEntityId = new Map<CanonicalId, SelectionCause[]>()
  selection.causes.forEach(cause => {
    const existing = causesByEntityId.get(cause.entityId) ?? []
    existing.push(cause)
    causesByEntityId.set(cause.entityId, existing)
  })

  const remindersByDisplay = new Map<string, ProjectedReminder>()

  catalog.entities
    .filter((entity): entity is Ability => entity.kind === 'ability' && selectedIds.has(entity.id))
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(ability => {
      const causes = uniqueBy(causesByEntityId.get(ability.id) ?? [], causeKey)
      const timingsBySemanticKey = new Map(
        ability.timings
          .map(timing => [semanticTimingKey(timing), timing] as const)
          .sort(
            ([leftKey, leftTiming], [rightKey, rightTiming]) =>
              leftKey.localeCompare(rightKey) || leftTiming.raw.localeCompare(rightTiming.raw)
          )
      )

      timingsBySemanticKey.forEach((timing, timingKey) => {
        const occurrenceId = reminderOccurrenceId(ability.id, timing)
        const key = displayKey(ability, timingKey)
        const existing = remindersByDisplay.get(key)

        if (existing) {
          mergeReminder(existing, occurrenceId, ability, causes)
          return
        }

        remindersByDisplay.set(key, {
          id: occurrenceId,
          occurrenceIds: [occurrenceId],
          abilityIds: [ability.id],
          name: ability.name,
          text: ability.text,
          ...(ability.cost ? { cost: ability.cost } : {}),
          timing,
          keywords: [...ability.keywords].sort(compareIds),
          lane: timing.kind,
          causes,
          contributingEntityIds: contributingIds(causes, [ability.id]),
          sourceRefs: uniqueBy(ability.sourceRefs, sourceReferenceKey),
        })
      })
    })

  return orderReminders(Array.from(remindersByDisplay.values()))
}
