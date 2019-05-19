import * as Phases from 'types/phases'

export interface ITurnAction {
  condition: string[]
  action: string
  name?: string
  hint?: string
}

export const Game: { [key: string]: ITurnAction[] } = {
  // General actions
  [Phases.GAME_START]: [],
  [Phases.SETUP_START]: [],
  [Phases.SETUP_DURING]: [],
  [Phases.SETUP_END]: [],
  [Phases.GAME_DURING]: [],

  // Per-turn actions
  [Phases.TURN_ONE_START_OF_TURN]: [],
  [Phases.TURN_ONE_DURING_TURN]: [],
  // Hero
  [Phases.TURN_ONE_START_OF_HERO_PHASE]: [],
  [Phases.TURN_ONE_HERO_PHASE]: [],
  [Phases.TURN_ONE_END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.TURN_ONE_START_OF_MOVEMENT_PHASE]: [],
  [Phases.TURN_ONE_MOVEMENT_PHASE]: [],
  [Phases.TURN_ONE_END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.TURN_ONE_START_OF_SHOOTING_PHASE]: [],
  [Phases.TURN_ONE_SHOOTING_PHASE]: [],
  [Phases.TURN_ONE_END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.TURN_ONE_START_OF_CHARGE_PHASE]: [],
  [Phases.TURN_ONE_CHARGE_PHASE]: [],
  [Phases.TURN_ONE_END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.TURN_ONE_START_OF_COMBAT_PHASE]: [],
  [Phases.TURN_ONE_COMBAT_PHASE]: [],
  [Phases.TURN_ONE_END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.TURN_ONE_START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_ONE_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_ONE_END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_ONE_END_OF_TURN]: [],

  [Phases.TURN_TWO_START_OF_TURN]: [],
  [Phases.TURN_TWO_DURING_TURN]: [],
  // Hero
  [Phases.TURN_TWO_START_OF_HERO_PHASE]: [],
  [Phases.TURN_TWO_HERO_PHASE]: [],
  [Phases.TURN_TWO_END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.TURN_TWO_START_OF_MOVEMENT_PHASE]: [],
  [Phases.TURN_TWO_MOVEMENT_PHASE]: [],
  [Phases.TURN_TWO_END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.TURN_TWO_START_OF_SHOOTING_PHASE]: [],
  [Phases.TURN_TWO_SHOOTING_PHASE]: [],
  [Phases.TURN_TWO_END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.TURN_TWO_START_OF_CHARGE_PHASE]: [],
  [Phases.TURN_TWO_CHARGE_PHASE]: [],
  [Phases.TURN_TWO_END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.TURN_TWO_START_OF_COMBAT_PHASE]: [],
  [Phases.TURN_TWO_COMBAT_PHASE]: [],
  [Phases.TURN_TWO_END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.TURN_TWO_START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_TWO_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_TWO_END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_TWO_END_OF_TURN]: [],

  [Phases.TURN_THREE_START_OF_TURN]: [],
  [Phases.TURN_THREE_DURING_TURN]: [],
  // Hero
  [Phases.TURN_THREE_START_OF_HERO_PHASE]: [],
  [Phases.TURN_THREE_HERO_PHASE]: [],
  [Phases.TURN_THREE_END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.TURN_THREE_START_OF_MOVEMENT_PHASE]: [],
  [Phases.TURN_THREE_MOVEMENT_PHASE]: [],
  [Phases.TURN_THREE_END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.TURN_THREE_START_OF_SHOOTING_PHASE]: [],
  [Phases.TURN_THREE_SHOOTING_PHASE]: [],
  [Phases.TURN_THREE_END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.TURN_THREE_START_OF_CHARGE_PHASE]: [],
  [Phases.TURN_THREE_CHARGE_PHASE]: [],
  [Phases.TURN_THREE_END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.TURN_THREE_START_OF_COMBAT_PHASE]: [],
  [Phases.TURN_THREE_COMBAT_PHASE]: [],
  [Phases.TURN_THREE_END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.TURN_THREE_START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_THREE_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_THREE_END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_THREE_END_OF_TURN]: [],

  [Phases.TURN_FOUR_START_OF_TURN]: [],
  [Phases.TURN_FOUR_DURING_TURN]: [],
  // Hero
  [Phases.TURN_FOUR_START_OF_HERO_PHASE]: [],
  [Phases.TURN_FOUR_HERO_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.TURN_FOUR_START_OF_MOVEMENT_PHASE]: [],
  [Phases.TURN_FOUR_MOVEMENT_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.TURN_FOUR_START_OF_SHOOTING_PHASE]: [],
  [Phases.TURN_FOUR_SHOOTING_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.TURN_FOUR_START_OF_CHARGE_PHASE]: [],
  [Phases.TURN_FOUR_CHARGE_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.TURN_FOUR_START_OF_COMBAT_PHASE]: [],
  [Phases.TURN_FOUR_COMBAT_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.TURN_FOUR_START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_FOUR_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_FOUR_END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_FOUR_END_OF_TURN]: [],

  [Phases.TURN_FIVE_START_OF_TURN]: [],
  [Phases.TURN_FIVE_DURING_TURN]: [],
  // Hero
  [Phases.TURN_FIVE_START_OF_HERO_PHASE]: [],
  [Phases.TURN_FIVE_HERO_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.TURN_FIVE_START_OF_MOVEMENT_PHASE]: [],
  [Phases.TURN_FIVE_MOVEMENT_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.TURN_FIVE_START_OF_SHOOTING_PHASE]: [],
  [Phases.TURN_FIVE_SHOOTING_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.TURN_FIVE_START_OF_CHARGE_PHASE]: [],
  [Phases.TURN_FIVE_CHARGE_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.TURN_FIVE_START_OF_COMBAT_PHASE]: [],
  [Phases.TURN_FIVE_COMBAT_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.TURN_FIVE_START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_FIVE_BATTLESHOCK_PHASE]: [],
  [Phases.TURN_FIVE_END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_FIVE_END_OF_TURN]: [],

  // Any Turn Actions
  [Phases.START_OF_TURN]: [],
  [Phases.DURING_TURN]: [],
  // Hero
  [Phases.START_OF_HERO_PHASE]: [],
  [Phases.HERO_PHASE]: [],
  [Phases.END_OF_HERO_PHASE]: [],
  // Movement
  [Phases.START_OF_MOVEMENT_PHASE]: [],
  [Phases.MOVEMENT_PHASE]: [],
  [Phases.END_OF_MOVEMENT_PHASE]: [],
  // Shooting
  [Phases.START_OF_SHOOTING_PHASE]: [],
  [Phases.SHOOTING_PHASE]: [],
  [Phases.END_OF_SHOOTING_PHASE]: [],
  // Charging
  [Phases.START_OF_CHARGE_PHASE]: [],
  [Phases.CHARGE_PHASE]: [],
  [Phases.END_OF_CHARGE_PHASE]: [],
  // Combat
  [Phases.START_OF_COMBAT_PHASE]: [],
  [Phases.COMBAT_PHASE]: [],
  [Phases.END_OF_COMBAT_PHASE]: [],
  // Battleshock
  [Phases.START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.BATTLESHOCK_PHASE]: [],
  [Phases.END_OF_BATTLESHOCK_PHASE]: [],
  // Turn End
  [Phases.TURN_END]: [],
  // Game End
  [Phases.GAME_END]: [],
}
