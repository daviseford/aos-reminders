import { TURN_PHASES, type AbilityTiming, type TimingPerspective } from '../domain'
import { gameWindowKey } from './reminderIdentity'
import type { ProjectedReminder } from './types'

const phaseOrder = new Map(TURN_PHASES.map(phase => [phase.id, phase.order]))

const windowOrder = (timing: AbilityTiming): number => {
  switch (timing.window.kind) {
    case 'battle-start':
      return 0
    case 'deployment':
      return 10
    case 'battle-round-start':
      return 20
    case 'turn-phase':
      return 30 + (phaseOrder.get(timing.window.phase) ?? TURN_PHASES.length)
    case 'battle-round-end':
      return 40
    case 'battle-end':
      return 50
    case 'reaction':
      return 60
    case 'always':
      return 70
    case 'unknown':
      return 80
  }
}

const priorityOrder = {
  'strike-first': 0,
  normal: 1,
  'strike-last': 2,
} as const

const laneOrder = {
  active: 0,
  reaction: 1,
  passive: 2,
} as const

const roundOrder = (timing: AbilityTiming): number =>
  timing.window.kind === 'battle-round-start' || timing.window.kind === 'battle-round-end'
    ? (timing.window.round ?? 0)
    : 0

const perspectiveOrder: Record<TimingPerspective, number> = {
  your: 0,
  any: 1,
  enemy: 2,
  neutral: 3,
}

export const compareReminders = (left: ProjectedReminder, right: ProjectedReminder): number =>
  windowOrder(left.timing) - windowOrder(right.timing) ||
  roundOrder(left.timing) - roundOrder(right.timing) ||
  priorityOrder[left.timing.priority ?? 'normal'] - priorityOrder[right.timing.priority ?? 'normal'] ||
  laneOrder[left.lane] - laneOrder[right.lane] ||
  perspectiveOrder[left.timing.perspective ?? 'neutral'] -
    perspectiveOrder[right.timing.perspective ?? 'neutral'] ||
  left.name.localeCompare(right.name) ||
  gameWindowKey(left.timing.window).localeCompare(gameWindowKey(right.timing.window)) ||
  left.id.localeCompare(right.id)

export const orderReminders = (reminders: ProjectedReminder[]): ProjectedReminder[] =>
  [...reminders].sort(compareReminders)
