import type { AbilityTiming, CanonicalId, GameWindow } from '../domain'
import type { ReminderOccurrenceId } from './types'

export const gameWindowKey = (window: GameWindow): string => {
  if (window.kind === 'turn-phase') return `${window.kind}:${window.phase}`
  if (
    (window.kind === 'battle-round-start' || window.kind === 'battle-round-end') &&
    window.round !== undefined
  ) {
    return `${window.kind}:${window.round}`
  }
  return window.kind
}

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
): ReminderOccurrenceId => `reminder:${abilityId}@${semanticTimingKey(timing)}` as ReminderOccurrenceId

/**
 * The canonical ability ID an occurrence ID embeds, or undefined for a foreign shape. Ability IDs
 * carry no `@`, so the first `@` always separates identity from the semantic timing key.
 */
export const reminderOccurrenceAbilityId = (occurrenceId: string): CanonicalId<'ability'> | undefined => {
  const match = /^reminder:(ability:[^@]+)@./.exec(occurrenceId)
  return match ? (match[1] as CanonicalId<'ability'>) : undefined
}
