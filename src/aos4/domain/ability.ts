import type { DomainEntity } from './entity'
import type { AbilityTiming } from './game'

export type AbilityKind = 'active' | 'reaction' | 'passive'
export type AbilityActor = 'unit' | 'player' | 'army' | 'terrain' | 'manifestation' | 'other'

export interface AbilityText {
  declare?: string
  reactionTrigger?: string
  effect: string
}

export type AbilityCost =
  | { kind: 'spell'; value: number }
  | { kind: 'prayer'; value: number }
  | { kind: 'command-points'; value: number }
  | { kind: 'faction-resource'; resource: string; value: number }

export interface Ability extends DomainEntity<'ability'> {
  abilityKind: AbilityKind
  actor: AbilityActor
  text: AbilityText
  timings: AbilityTiming[]
  keywords: string[]
  cost?: AbilityCost
}
