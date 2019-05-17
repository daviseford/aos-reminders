import * as Meta from 'types/meta'

export interface ITurnAction {
  condition: string[]
  action: string
  name?: string
}
export const Turn: { [key: string]: ITurnAction[] } = {
  // Turn Start
  [Meta.TURN_START]: [],
  [Meta.TURN_DURING]: [],
  // Hero
  [Meta.HERO_PHASE_START]: [],
  [Meta.HERO_PHASE]: [],
  [Meta.HERO_PHASE_END]: [],
  // Movement
  [Meta.MOVEMENT_PHASE_START]: [],
  [Meta.MOVEMENT_PHASE]: [],
  [Meta.MOVEMENT_PHASE_END]: [],
  // Shooting
  [Meta.SHOOTING_PHASE_START]: [],
  [Meta.SHOOTING_PHASE]: [],
  [Meta.SHOOTING_PHASE_END]: [],
  // Charging
  [Meta.CHARGE_PHASE_START]: [],
  [Meta.CHARGE_PHASE]: [],
  [Meta.CHARGE_PHASE_END]: [],
  // Combat
  [Meta.COMBAT_PHASE_START]: [],
  [Meta.COMBAT_PHASE]: [],
  [Meta.COMBAT_PHASE_END]: [],
  // Battleshock
  [Meta.BATTLESHOCK_PHASE_START]: [],
  [Meta.BATTLESHOCK_PHASE]: [],
  [Meta.BATTLESHOCK_PHASE_END]: [],
  // Turn End
  [Meta.TURN_END]: [],
}

export const Game = {
  // General actions
  [Meta.GAME_START]: [] as ITurnAction[],
  [Meta.SETUP_START]: [] as ITurnAction[],
  [Meta.SETUP_DURING]: [] as ITurnAction[],
  [Meta.SETUP_END]: [] as ITurnAction[],
  [Meta.GAME_DURING]: [] as ITurnAction[],
  // Any Turn Start
  [Meta.TURN_START]: [] as ITurnAction[],
  [Meta.TURN_DURING]: [] as ITurnAction[],
  // Hero
  [Meta.HERO_PHASE_START]: [] as ITurnAction[],
  [Meta.HERO_PHASE]: [] as ITurnAction[],
  [Meta.HERO_PHASE_END]: [] as ITurnAction[],
  // Movement
  [Meta.MOVEMENT_PHASE_START]: [] as ITurnAction[],
  [Meta.MOVEMENT_PHASE]: [] as ITurnAction[],
  [Meta.MOVEMENT_PHASE_END]: [] as ITurnAction[],
  // Shooting
  [Meta.SHOOTING_PHASE_START]: [] as ITurnAction[],
  [Meta.SHOOTING_PHASE]: [] as ITurnAction[],
  [Meta.SHOOTING_PHASE_END]: [] as ITurnAction[],
  // Charging
  [Meta.CHARGE_PHASE_START]: [] as ITurnAction[],
  [Meta.CHARGE_PHASE]: [] as ITurnAction[],
  [Meta.CHARGE_PHASE_END]: [] as ITurnAction[],
  // Combat
  [Meta.COMBAT_PHASE_START]: [] as ITurnAction[],
  [Meta.COMBAT_PHASE]: [] as ITurnAction[],
  [Meta.COMBAT_PHASE_END]: [] as ITurnAction[],
  // Battleshock
  [Meta.BATTLESHOCK_PHASE_START]: [] as ITurnAction[],
  [Meta.BATTLESHOCK_PHASE]: [] as ITurnAction[],
  [Meta.BATTLESHOCK_PHASE_END]: [] as ITurnAction[],
  // Turn End
  [Meta.TURN_END]: [] as ITurnAction[],

  // Per-turn actions
  [Meta.TURN_ONE]: { ...Turn },
  [Meta.TURN_TWO]: { ...Turn },
  [Meta.TURN_THREE]: { ...Turn },
  [Meta.TURN_FOUR]: { ...Turn },
  [Meta.TURN_FIVE]: { ...Turn },
  [Meta.GAME_END]: [] as ITurnAction[],
}
