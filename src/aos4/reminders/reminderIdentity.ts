import type { AbilityTiming, CanonicalId, GameWindow } from '../domain'
import type { ReminderOccurrenceId } from './types'

export const gameWindowKey = (window: GameWindow): string =>
  window.kind === 'turn-phase' ? `${window.kind}:${window.phase}` : window.kind

export const semanticTimingKey = (timing: AbilityTiming): string => {
  const usage = timing.usage
    ? `${timing.usage.limit}:${timing.usage.period}:${timing.usage.scope}`
    : 'unlimited'

  return [
    gameWindowKey(timing.window),
    timing.kind,
    timing.perspective ?? 'neutral',
    timing.priority ?? 'normal',
    usage,
  ].join('|')
}

export const reminderOccurrenceId = (
  abilityId: CanonicalId<'ability'>,
  timing: AbilityTiming
): ReminderOccurrenceId =>
  `reminder:${abilityId}@${semanticTimingKey(timing)}` as ReminderOccurrenceId
