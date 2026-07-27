import { TURN_PHASES, type AbilityTiming, type Aos4Catalog } from '../domain'
import {
  gameWindowKey,
  projectReminders,
  type ProjectedReminder,
  type ReminderOccurrenceId,
} from '../reminders'
import { resolveSelection } from '../select'
import type { Aos4ArmyDocument } from '../state'

const phaseNames = new Map(TURN_PHASES.map(phase => [phase.id, phase.name]))

const windowLabel = (timing: AbilityTiming): string => {
  switch (timing.window.kind) {
    case 'battle-start':
      return 'Start of Battle'
    case 'deployment':
      return 'Deployment'
    case 'battle-round-start':
      return `Start of Battle Round${timing.window.round ? ` ${timing.window.round}` : ''}`
    case 'phase-independent':
      return 'No Named Phase'
    case 'turn-phase':
      return `${phaseNames.get(timing.window.phase) ?? timing.window.phase} Phase`
    case 'battle-round-end':
      return `End of Battle Round${timing.window.round ? ` ${timing.window.round}` : ''}`
    case 'battle-end':
      return 'End of Battle'
    case 'reaction':
      return 'Triggered Reaction'
    case 'always':
      return 'Passive'
    case 'unknown':
      return 'Timing Requires Review'
  }
}

const titleCase = (value: string): string =>
  value
    .split('-')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const timingDetails = (timing: AbilityTiming): string[] => [
  titleCase(timing.kind),
  ...(timing.perspective ? [`${titleCase(timing.perspective)} turn`] : []),
  ...(timing.priority ? [titleCase(timing.priority)] : []),
  ...(timing.usage
    ? [`${timing.usage.limit} per ${timing.usage.period.replace('-', ' ')} (${timing.usage.scope})`]
    : []),
]

export interface Aos4ReminderViewModel {
  id: ReminderOccurrenceId
  name: string
  windowKey: string
  windowLabel: string
  typeLabel: string
  accessibleLabel: string
  declare?: string
  reactionTrigger?: string
  effect: string
  hidden: boolean
  note?: string
  order?: number
  sourceRecordIds: string[]
  projected: ProjectedReminder
}

const withPreferences = (reminder: ProjectedReminder, document: Aos4ArmyDocument): Aos4ReminderViewModel => {
  const preference = document.reminderPreferences[reminder.id]
  const details = timingDetails(reminder.timing)
  const label = windowLabel(reminder.timing)
  return {
    id: reminder.id,
    name: reminder.name,
    windowKey: gameWindowKey(reminder.timing.window),
    windowLabel: label,
    typeLabel: details.join(' · '),
    accessibleLabel: [
      reminder.name,
      label,
      ...details,
      ...(reminder.text.reactionTrigger ? [`Trigger: ${reminder.text.reactionTrigger}`] : []),
    ].join('; '),
    ...(reminder.text.declare ? { declare: reminder.text.declare } : {}),
    ...(reminder.text.reactionTrigger ? { reactionTrigger: reminder.text.reactionTrigger } : {}),
    effect: reminder.text.effect,
    hidden: preference?.hidden ?? false,
    ...(preference?.note ? { note: preference.note } : {}),
    ...(preference?.order !== undefined ? { order: preference.order } : {}),
    sourceRecordIds: reminder.sourceRefs.map(reference => String(reference.sourceRecordId)),
    projected: reminder,
  }
}

export const createAos4ReminderViewModel = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4ReminderViewModel[] => {
  const selection = resolveSelection(catalog, {
    explicitIds: document.explicitSelectionIds,
    rulesContextId: document.rulesContextId,
  })
  const reminders = projectReminders(catalog, selection).map(reminder => withPreferences(reminder, document))
  const baseOrder = new Map(reminders.map((reminder, index) => [reminder.id, index]))
  return reminders.sort((left, right) => {
    if (left.windowKey !== right.windowKey) {
      return (baseOrder.get(left.id) ?? 0) - (baseOrder.get(right.id) ?? 0)
    }
    return (
      (left.order ?? baseOrder.get(left.id) ?? 0) - (right.order ?? baseOrder.get(right.id) ?? 0) ||
      left.id.localeCompare(right.id)
    )
  })
}

export const createPrintableAos4Reminders = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(catalog, document).filter(reminder => !reminder.hidden)
