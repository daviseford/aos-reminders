import {
  TURN_PHASES,
  type AbilityTiming,
  type Aos4Catalog,
  type CombatPriority,
  type TimingKind,
  type TimingPerspective,
  type UsageLimit,
  type UsageScope,
} from '../domain'
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

/**
 * Tone drives colour and fill in both renderers. It names the *facet*, not a palette entry, so the
 * web theme and the PDF can disagree about the exact colour while agreeing about the meaning.
 */
export type Aos4ReminderTagTone =
  | 'kind-active'
  | 'kind-reaction'
  | 'kind-passive'
  | 'turn-your'
  | 'turn-enemy'
  | 'turn-neutral'
  | 'usage'
  | 'priority'

export interface Aos4ReminderTag {
  label: string
  tone: Aos4ReminderTagTone
  /** Plain-language expansion. The abbreviated labels are not self-explanatory, least of all the
   * usage scope, where `unit` and `army` mean very different things at the table. */
  description: string
}

const kindDescription: Record<TimingKind, string> = {
  active: 'Used by declaring it during the listed window.',
  reaction: 'Used only when its trigger happens, interrupting the current sequence.',
  passive: 'Always in effect. There is nothing to declare.',
}

const perspectiveDescription: Record<TimingPerspective, string> = {
  your: 'Only during your own turn.',
  enemy: "Only during your opponent's turn.",
  any: "During either player's turn.",
  neutral: "Not tied to either player's turn.",
}

const usageScopeDescription: Record<UsageScope, string> = {
  unit: 'to each unit separately',
  army: 'across your whole army',
  player: 'to you as a player',
}

const usageDescription = (usage: UsageLimit): string =>
  `Can be used ${usage.limit} time${usage.limit === 1 ? '' : 's'} per ${usage.period.replace('-', ' ')}. ` +
  `That limit applies ${usageScopeDescription[usage.scope]}.`

const priorityDescription: Record<CombatPriority, string> = {
  'strike-first': 'Fights before units that do not strike first.',
  normal: 'Fights in the normal sequence.',
  'strike-last': 'Fights after units that do not strike last.',
}

const kindTone: Record<TimingKind, Aos4ReminderTagTone> = {
  active: 'kind-active',
  reaction: 'kind-reaction',
  passive: 'kind-passive',
}

const perspectiveTone = (perspective: TimingPerspective): Aos4ReminderTagTone => {
  switch (perspective) {
    case 'your':
      return 'turn-your'
    case 'enemy':
      return 'turn-enemy'
    default:
      return 'turn-neutral'
  }
}

/**
 * The same four facets `timingDetails` flattens into a string, kept discrete so each can be styled
 * and scanned on its own.
 *
 * Two deliberate differences from `typeLabel`: a `normal` combat priority is dropped because it is
 * the default and carries no information, and the usage limit is compressed to `1 / turn · army`,
 * which survives a narrow print column where `1 per turn (army)` does not.
 */
const timingTags = (timing: AbilityTiming): Aos4ReminderTag[] => [
  {
    label: titleCase(timing.kind),
    tone: kindTone[timing.kind],
    description: kindDescription[timing.kind],
  },
  ...(timing.perspective
    ? [
        {
          label: `${titleCase(timing.perspective)} turn`,
          tone: perspectiveTone(timing.perspective),
          description: perspectiveDescription[timing.perspective],
        },
      ]
    : []),
  ...(timing.priority && timing.priority !== 'normal'
    ? [
        {
          label: titleCase(timing.priority),
          tone: 'priority' as const,
          description: priorityDescription[timing.priority],
        },
      ]
    : []),
  ...(timing.usage
    ? [
        {
          label: `${timing.usage.limit} / ${timing.usage.period.replace('-', ' ')} · ${timing.usage.scope}`,
          tone: 'usage' as const,
          description: usageDescription(timing.usage),
        },
      ]
    : []),
]

export interface Aos4ReminderViewModel {
  id: ReminderOccurrenceId
  name: string
  windowKey: string
  windowLabel: string
  /** Flattened facets, retained for the accessible label and any text-only consumer. */
  typeLabel: string
  /** The same facets, discrete, for tag rendering on screen and in print. */
  tags: Aos4ReminderTag[]
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
    tags: timingTags(reminder.timing),
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
    ...(document.allowsLegends ? { allowsLegends: true } : {}),
    ...(document.allowsHistorical ? { allowsHistorical: true } : {}),
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
