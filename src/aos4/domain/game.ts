export const TURN_PHASES = [
  { id: 'start-of-turn', name: 'Start of Turn', order: 0 },
  { id: 'hero', name: 'Hero', order: 1 },
  { id: 'movement', name: 'Movement', order: 2 },
  { id: 'shooting', name: 'Shooting', order: 3 },
  { id: 'charge', name: 'Charge', order: 4 },
  { id: 'combat', name: 'Combat', order: 5 },
  { id: 'end-of-turn', name: 'End of Turn', order: 6 },
] as const

export type TurnPhaseId = (typeof TURN_PHASES)[number]['id']

const TURN_PHASE_IDS = new Set<string>(TURN_PHASES.map(phase => phase.id))

export const isTurnPhaseId = (value: string): value is TurnPhaseId => TURN_PHASE_IDS.has(value)

export type GameWindow =
  | { kind: 'battle-start' }
  | { kind: 'deployment' }
  | { kind: 'battle-round-start'; round?: number }
  | { kind: 'turn-phase'; phase: TurnPhaseId }
  | { kind: 'battle-round-end'; round?: number }
  | { kind: 'battle-end' }
  | { kind: 'reaction' }
  | { kind: 'always' }
  | { kind: 'unknown' }

export type TimingPerspective = 'your' | 'enemy' | 'any' | 'neutral'
export type TimingKind = 'active' | 'reaction' | 'passive'
export type CombatPriority = 'strike-first' | 'normal' | 'strike-last'
export type UsagePeriod = 'phase' | 'turn' | 'battle-round' | 'battle'
export type UsageScope = 'unit' | 'player' | 'army'

export interface UsageLimit {
  limit: number
  period: UsagePeriod
  scope: UsageScope
}

export interface AbilityTiming {
  kind: TimingKind
  window: GameWindow
  raw: string
  perspective?: TimingPerspective
  priority?: CombatPriority
  usage?: UsageLimit
}
