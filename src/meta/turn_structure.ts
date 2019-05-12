import * as Meta from 'types/meta'

const Turn = {
  // Turn Start
  [Meta.TURN_START]: {},
  [Meta.TURN_DURING]: {},
  // Hero
  [Meta.HERO_PHASE_START]: {},
  [Meta.HERO_PHASE]: {},
  [Meta.HERO_PHASE_END]: {},
  // Movement
  [Meta.MOVEMENT_PHASE_START]: {},
  [Meta.MOVEMENT_PHASE]: {},
  [Meta.MOVEMENT_PHASE_END]: {},
  // Shooting
  [Meta.SHOOTING_PHASE_START]: {},
  [Meta.SHOOTING_PHASE]: {},
  [Meta.SHOOTING_PHASE_END]: {},
  // Charging
  [Meta.CHARGE_PHASE_START]: {},
  [Meta.CHARGE_PHASE]: {},
  [Meta.CHARGE_PHASE_END]: {},
  // Combat
  [Meta.COMBAT_PHASE_START]: {},
  [Meta.COMBAT_PHASE]: {},
  [Meta.COMBAT_PHASE_END]: {},
  // Battleshock
  [Meta.BATTLESHOCK_PHASE_START]: {},
  [Meta.BATTLESHOCK_PHASE]: {},
  [Meta.BATTLESHOCK_PHASE_END]: {},
  // Turn End
  [Meta.TURN_END]: {},
}

const Game = {
  [Meta.GAME_START]: {},
  [Meta.SETUP_START]: {},
  [Meta.SETUP]: {},
  [Meta.SETUP_END]: {},
  [Meta.GAME_DURING]: {},
  [Meta.TURN_ONE]: { ...Turn },
  [Meta.TURN_TWO]: { ...Turn },
  [Meta.TURN_THREE]: { ...Turn },
  [Meta.TURN_FOUR]: { ...Turn },
  [Meta.TURN_FIVE]: { ...Turn },
  [Meta.GAME_END]: {},
}

export default {
  Game,
  Turn,
}
