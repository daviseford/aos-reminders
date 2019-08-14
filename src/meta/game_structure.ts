import * as Phases from 'types/phases'
import { TTurnAction } from 'types/data'

export type TGameStructure = { [key in Phases.TTurnWhen]: TTurnAction[] }

export const Game: TGameStructure = {
  // General actions
  [Phases.START_OF_GAME]: [],
  [Phases.START_OF_SETUP]: [],
  [Phases.DURING_SETUP]: [],
  [Phases.END_OF_SETUP]: [],
  [Phases.DURING_GAME]: [],

  // Any Turn/Round Actions
  [Phases.START_OF_TURN]: [],
  [Phases.START_OF_ROUND]: [],
  [Phases.DURING_TURN]: [],
  [Phases.DURING_ROUND]: [],

  // General Hero Phase
  [Phases.START_OF_HERO_PHASE]: [],
  [Phases.HERO_PHASE]: [],
  [Phases.END_OF_HERO_PHASE]: [],
  // General Movement Phase
  [Phases.START_OF_MOVEMENT_PHASE]: [],
  [Phases.MOVEMENT_PHASE]: [],
  [Phases.END_OF_MOVEMENT_PHASE]: [],
  // General Shooting Phase
  [Phases.START_OF_SHOOTING_PHASE]: [],
  [Phases.SHOOTING_PHASE]: [],
  [Phases.END_OF_SHOOTING_PHASE]: [],
  // General Charging Phase
  [Phases.START_OF_CHARGE_PHASE]: [],
  [Phases.CHARGE_PHASE]: [],
  [Phases.END_OF_CHARGE_PHASE]: [],
  // General Combat Phase
  [Phases.START_OF_COMBAT_PHASE]: [],
  [Phases.COMBAT_PHASE]: [],
  [Phases.END_OF_COMBAT_PHASE]: [],
  // General Battleshock Phase
  [Phases.START_OF_BATTLESHOCK_PHASE]: [],
  [Phases.BATTLESHOCK_PHASE]: [],
  [Phases.END_OF_BATTLESHOCK_PHASE]: [],
  // Any Turn/Round End
  [Phases.END_OF_ROUND]: [],
  [Phases.END_OF_TURN]: [],
  // Game End
  [Phases.END_OF_GAME]: [],

  // Per-turn actions
  [Phases.TURN_ONE_START_OF_TURN]: [],
  [Phases.TURN_ONE_START_OF_ROUND]: [],
  [Phases.TURN_ONE_DURING_TURN]: [],
  [Phases.TURN_ONE_DURING_ROUND]: [],
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
  [Phases.TURN_ONE_END_OF_ROUND]: [],

  [Phases.TURN_TWO_START_OF_TURN]: [],
  [Phases.TURN_TWO_START_OF_ROUND]: [],
  [Phases.TURN_TWO_DURING_TURN]: [],
  [Phases.TURN_TWO_DURING_ROUND]: [],
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
  [Phases.TURN_TWO_END_OF_ROUND]: [],

  [Phases.TURN_THREE_START_OF_TURN]: [],
  [Phases.TURN_THREE_START_OF_ROUND]: [],
  [Phases.TURN_THREE_DURING_TURN]: [],
  [Phases.TURN_THREE_DURING_ROUND]: [],
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
  [Phases.TURN_THREE_END_OF_ROUND]: [],

  [Phases.TURN_FOUR_START_OF_TURN]: [],
  [Phases.TURN_FOUR_START_OF_ROUND]: [],
  [Phases.TURN_FOUR_DURING_TURN]: [],
  [Phases.TURN_FOUR_DURING_ROUND]: [],
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
  [Phases.TURN_FOUR_END_OF_ROUND]: [],

  [Phases.TURN_FIVE_START_OF_TURN]: [],
  [Phases.TURN_FIVE_START_OF_ROUND]: [],
  [Phases.TURN_FIVE_DURING_TURN]: [],
  [Phases.TURN_FIVE_DURING_ROUND]: [],
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
  [Phases.TURN_FIVE_END_OF_ROUND]: [],
}
