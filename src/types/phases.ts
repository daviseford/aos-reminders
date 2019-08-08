// Phase Stage Types
export type TPhaseStart = 'START_OF_PHASE'
export type TPhaseDuring = 'DURING_PHASE'
export type TPhaseEnd = 'END_OF_PHASE'

// Phase Stage Exports
export const PHASE_START: TPhaseStart = 'START_OF_PHASE'
export const PHASE_DURING: TPhaseDuring = 'DURING_PHASE'
export const PHASE_END: TPhaseEnd = 'END_OF_PHASE'

// Phases
// Hero
export type THeroPhaseStart = 'START_OF_HERO_PHASE'
export type THeroPhase = 'DURING_HERO_PHASE'
export type THeroPhaseEnd = 'END_OF_HERO_PHASE'

// Move
export type TMovementPhaseStart = 'START_OF_MOVEMENT_PHASE'
export type TMovementPhase = 'DURING_MOVEMENT_PHASE'
export type TMovementPhaseEnd = 'END_OF_MOVEMENT_PHASE'

// Shooting
export type TShootingPhaseStart = 'START_OF_SHOOTING_PHASE'
export type TShootingPhase = 'DURING_SHOOTING_PHASE'
export type TShootingPhaseEnd = 'END_OF_SHOOTING_PHASE'

// Charge
export type TChargePhaseStart = 'START_OF_CHARGE_PHASE'
export type TChargePhase = 'DURING_CHARGE_PHASE'
export type TChargePhaseEnd = 'END_OF_CHARGE_PHASE'

// Combat
export type TCombatPhaseStart = 'START_OF_COMBAT_PHASE'
export type TCombatPhase = 'DURING_COMBAT_PHASE'
export type TCombatPhaseEnd = 'END_OF_COMBAT_PHASE'

// Battleshock
export type TBattleshockPhaseStart = 'START_OF_BATTLESHOCK_PHASE'
export type TBattleshockPhase = 'DURING_BATTLESHOCK_PHASE'
export type TBattleshockPhaseEnd = 'END_OF_BATTLESHOCK_PHASE'

export type TPhases =
  | THeroPhase
  | TMovementPhase
  | TShootingPhase
  | TChargePhase
  | TCombatPhase
  | TBattleshockPhase
export type TPhaseSegments = TPhaseStart | TPhaseDuring | TPhaseEnd

// Phases Exports
export const START_OF_HERO_PHASE: THeroPhaseStart = 'START_OF_HERO_PHASE'
export const HERO_PHASE: THeroPhase = 'DURING_HERO_PHASE'
export const END_OF_HERO_PHASE: THeroPhaseEnd = 'END_OF_HERO_PHASE'
export const START_OF_MOVEMENT_PHASE: TMovementPhaseStart = 'START_OF_MOVEMENT_PHASE'
export const MOVEMENT_PHASE: TMovementPhase = 'DURING_MOVEMENT_PHASE'
export const END_OF_MOVEMENT_PHASE: TMovementPhaseEnd = 'END_OF_MOVEMENT_PHASE'
export const START_OF_SHOOTING_PHASE: TShootingPhaseStart = 'START_OF_SHOOTING_PHASE'
export const SHOOTING_PHASE: TShootingPhase = 'DURING_SHOOTING_PHASE'
export const END_OF_SHOOTING_PHASE: TShootingPhaseEnd = 'END_OF_SHOOTING_PHASE'
export const START_OF_CHARGE_PHASE: TChargePhaseStart = 'START_OF_CHARGE_PHASE'
export const CHARGE_PHASE: TChargePhase = 'DURING_CHARGE_PHASE'
export const END_OF_CHARGE_PHASE: TChargePhaseEnd = 'END_OF_CHARGE_PHASE'
export const START_OF_COMBAT_PHASE: TCombatPhaseStart = 'START_OF_COMBAT_PHASE'
export const COMBAT_PHASE: TCombatPhase = 'DURING_COMBAT_PHASE'
export const END_OF_COMBAT_PHASE: TCombatPhaseEnd = 'END_OF_COMBAT_PHASE'
export const START_OF_BATTLESHOCK_PHASE: TBattleshockPhaseStart = 'START_OF_BATTLESHOCK_PHASE'
export const BATTLESHOCK_PHASE: TBattleshockPhase = 'DURING_BATTLESHOCK_PHASE'
export const END_OF_BATTLESHOCK_PHASE: TBattleshockPhaseEnd = 'END_OF_BATTLESHOCK_PHASE'

// Turn Types
export type TSetupStart = 'START_OF_SETUP'
export type TDuringSetup = 'DURING_SETUP'
export type TSetupEnd = 'END_OF_SETUP'
export type TGameStart = 'START_OF_GAME'
export type TGameDuring = 'DURING_GAME'
export type TTurnStart = 'START_OF_TURN'
export type TRoundStart = 'START_OF_ROUND'
export type TTurnDuring = 'DURING_TURN'
export type TRoundDuring = 'DURING_ROUND'
export type TTurnEnd = 'END_OF_TURN'
export type TRoundEnd = 'END_OF_ROUND'
export type TGameEnd = 'END_OF_GAME'

// Turn Exports
export const START_OF_SETUP: TSetupStart = 'START_OF_SETUP'
export const DURING_SETUP: TDuringSetup = 'DURING_SETUP'
export const END_OF_SETUP: TSetupEnd = 'END_OF_SETUP'
export const START_OF_GAME: TGameStart = 'START_OF_GAME'
export const DURING_GAME: TGameDuring = 'DURING_GAME'
export const START_OF_TURN: TTurnStart = 'START_OF_TURN'
export const START_OF_ROUND: TRoundStart = 'START_OF_ROUND'
export const DURING_TURN: TTurnDuring = 'DURING_TURN'
export const DURING_ROUND: TRoundDuring = 'DURING_ROUND'
export const END_OF_TURN: TTurnEnd = 'END_OF_TURN'
export const END_OF_ROUND: TRoundEnd = 'END_OF_ROUND'
export const END_OF_GAME: TGameEnd = 'END_OF_GAME'

// Specific Turn Phases
export type TTurnOne_START_OF_TURN = 'TURN_ONE_START_OF_TURN'
export type TTurnOne_START_OF_ROUND = 'TURN_ONE_START_OF_ROUND'
export type TTurnOne_DURING_TURN = 'TURN_ONE_DURING_TURN'
export type TTurnOne_DURING_ROUND = 'TURN_ONE_DURING_ROUND'
export type TTurnOne_START_OF_HERO_PHASE = 'TURN_ONE_START_OF_HERO_PHASE'
export type TTurnOne_HERO_PHASE = 'TURN_ONE_DURING_HERO_PHASE'
export type TTurnOne_END_OF_HERO_PHASE = 'TURN_ONE_END_OF_HERO_PHASE'
export type TTurnOne_START_OF_MOVEMENT_PHASE = 'TURN_ONE_START_OF_MOVEMENT_PHASE'
export type TTurnOne_MOVEMENT_PHASE = 'TURN_ONE_DURING_MOVEMENT_PHASE'
export type TTurnOne_END_OF_MOVEMENT_PHASE = 'TURN_ONE_END_OF_MOVEMENT_PHASE'
export type TTurnOne_START_OF_SHOOTING_PHASE = 'TURN_ONE_START_OF_SHOOTING_PHASE'
export type TTurnOne_SHOOTING_PHASE = 'TURN_ONE_DURING_SHOOTING_PHASE'
export type TTurnOne_END_OF_SHOOTING_PHASE = 'TURN_ONE_END_OF_SHOOTING_PHASE'
export type TTurnOne_START_OF_CHARGE_PHASE = 'TURN_ONE_START_OF_CHARGE_PHASE'
export type TTurnOne_CHARGE_PHASE = 'TURN_ONE_DURING_CHARGE_PHASE'
export type TTurnOne_END_OF_CHARGE_PHASE = 'TURN_ONE_END_OF_CHARGE_PHASE'
export type TTurnOne_START_OF_COMBAT_PHASE = 'TURN_ONE_START_OF_COMBAT_PHASE'
export type TTurnOne_COMBAT_PHASE = 'TURN_ONE_DURING_COMBAT_PHASE'
export type TTurnOne_END_OF_COMBAT_PHASE = 'TURN_ONE_END_OF_COMBAT_PHASE'
export type TTurnOne_START_OF_BATTLESHOCK_PHASE = 'TURN_ONE_START_OF_BATTLESHOCK_PHASE'
export type TTurnOne_BATTLESHOCK_PHASE = 'TURN_ONE_DURING_BATTLESHOCK_PHASE'
export type TTurnOne_END_OF_BATTLESHOCK_PHASE = 'TURN_ONE_END_OF_BATTLESHOCK_PHASE'
export type TTurnOne_END_OF_TURN = 'TURN_ONE_END_OF_TURN'
export type TTurnOne_END_OF_ROUND = 'TURN_ONE_END_OF_ROUND'
export type TTurnTwo_START_OF_TURN = 'TURN_TWO_START_OF_TURN'
export type TTurnTwo_START_OF_ROUND = 'TURN_TWO_START_OF_ROUND'
export type TTurnTwo_DURING_TURN = 'TURN_TWO_DURING_TURN'
export type TTurnTwo_DURING_ROUND = 'TURN_TWO_DURING_ROUND'
export type TTurnTwo_START_OF_HERO_PHASE = 'TURN_TWO_START_OF_HERO_PHASE'
export type TTurnTwo_HERO_PHASE = 'TURN_TWO_DURING_HERO_PHASE'
export type TTurnTwo_END_OF_HERO_PHASE = 'TURN_TWO_END_OF_HERO_PHASE'
export type TTurnTwo_START_OF_MOVEMENT_PHASE = 'TURN_TWO_START_OF_MOVEMENT_PHASE'
export type TTurnTwo_MOVEMENT_PHASE = 'TURN_TWO_DURING_MOVEMENT_PHASE'
export type TTurnTwo_END_OF_MOVEMENT_PHASE = 'TURN_TWO_END_OF_MOVEMENT_PHASE'
export type TTurnTwo_START_OF_SHOOTING_PHASE = 'TURN_TWO_START_OF_SHOOTING_PHASE'
export type TTurnTwo_SHOOTING_PHASE = 'TURN_TWO_DURING_SHOOTING_PHASE'
export type TTurnTwo_END_OF_SHOOTING_PHASE = 'TURN_TWO_END_OF_SHOOTING_PHASE'
export type TTurnTwo_START_OF_CHARGE_PHASE = 'TURN_TWO_START_OF_CHARGE_PHASE'
export type TTurnTwo_CHARGE_PHASE = 'TURN_TWO_DURING_CHARGE_PHASE'
export type TTurnTwo_END_OF_CHARGE_PHASE = 'TURN_TWO_END_OF_CHARGE_PHASE'
export type TTurnTwo_START_OF_COMBAT_PHASE = 'TURN_TWO_START_OF_COMBAT_PHASE'
export type TTurnTwo_COMBAT_PHASE = 'TURN_TWO_DURING_COMBAT_PHASE'
export type TTurnTwo_END_OF_COMBAT_PHASE = 'TURN_TWO_END_OF_COMBAT_PHASE'
export type TTurnTwo_START_OF_BATTLESHOCK_PHASE = 'TURN_TWO_START_OF_BATTLESHOCK_PHASE'
export type TTurnTwo_BATTLESHOCK_PHASE = 'TURN_TWO_DURING_BATTLESHOCK_PHASE'
export type TTurnTwo_END_OF_BATTLESHOCK_PHASE = 'TURN_TWO_END_OF_BATTLESHOCK_PHASE'
export type TTurnTwo_END_OF_TURN = 'TURN_TWO_END_OF_TURN'
export type TTurnTwo_END_OF_ROUND = 'TURN_TWO_END_OF_ROUND'
export type TTurnThree_START_OF_TURN = 'TURN_THREE_START_OF_TURN'
export type TTurnThree_START_OF_ROUND = 'TURN_THREE_START_OF_ROUND'
export type TTurnThree_DURING_TURN = 'TURN_THREE_DURING_TURN'
export type TTurnThree_DURING_ROUND = 'TURN_THREE_DURING_ROUND'
export type TTurnThree_START_OF_HERO_PHASE = 'TURN_THREE_START_OF_HERO_PHASE'
export type TTurnThree_HERO_PHASE = 'TURN_THREE_DURING_HERO_PHASE'
export type TTurnThree_END_OF_HERO_PHASE = 'TURN_THREE_END_OF_HERO_PHASE'
export type TTurnThree_START_OF_MOVEMENT_PHASE = 'TURN_THREE_START_OF_MOVEMENT_PHASE'
export type TTurnThree_MOVEMENT_PHASE = 'TURN_THREE_DURING_MOVEMENT_PHASE'
export type TTurnThree_END_OF_MOVEMENT_PHASE = 'TURN_THREE_END_OF_MOVEMENT_PHASE'
export type TTurnThree_START_OF_SHOOTING_PHASE = 'TURN_THREE_START_OF_SHOOTING_PHASE'
export type TTurnThree_SHOOTING_PHASE = 'TURN_THREE_DURING_SHOOTING_PHASE'
export type TTurnThree_END_OF_SHOOTING_PHASE = 'TURN_THREE_END_OF_SHOOTING_PHASE'
export type TTurnThree_START_OF_CHARGE_PHASE = 'TURN_THREE_START_OF_CHARGE_PHASE'
export type TTurnThree_CHARGE_PHASE = 'TURN_THREE_DURING_CHARGE_PHASE'
export type TTurnThree_END_OF_CHARGE_PHASE = 'TURN_THREE_END_OF_CHARGE_PHASE'
export type TTurnThree_START_OF_COMBAT_PHASE = 'TURN_THREE_START_OF_COMBAT_PHASE'
export type TTurnThree_COMBAT_PHASE = 'TURN_THREE_DURING_COMBAT_PHASE'
export type TTurnThree_END_OF_COMBAT_PHASE = 'TURN_THREE_END_OF_COMBAT_PHASE'
export type TTurnThree_START_OF_BATTLESHOCK_PHASE = 'TURN_THREE_START_OF_BATTLESHOCK_PHASE'
export type TTurnThree_BATTLESHOCK_PHASE = 'TURN_THREE_DURING_BATTLESHOCK_PHASE'
export type TTurnThree_END_OF_BATTLESHOCK_PHASE = 'TURN_THREE_END_OF_BATTLESHOCK_PHASE'
export type TTurnThree_END_OF_TURN = 'TURN_THREE_END_OF_TURN'
export type TTurnThree_END_OF_ROUND = 'TURN_THREE_END_OF_ROUND'
export type TTurnFour_START_OF_TURN = 'TURN_FOUR_START_OF_TURN'
export type TTurnFour_START_OF_ROUND = 'TURN_FOUR_START_OF_ROUND'
export type TTurnFour_DURING_TURN = 'TURN_FOUR_DURING_TURN'
export type TTurnFour_DURING_ROUND = 'TURN_FOUR_DURING_ROUND'
export type TTurnFour_START_OF_HERO_PHASE = 'TURN_FOUR_START_OF_HERO_PHASE'
export type TTurnFour_HERO_PHASE = 'TURN_FOUR_DURING_HERO_PHASE'
export type TTurnFour_END_OF_HERO_PHASE = 'TURN_FOUR_END_OF_HERO_PHASE'
export type TTurnFour_START_OF_MOVEMENT_PHASE = 'TURN_FOUR_START_OF_MOVEMENT_PHASE'
export type TTurnFour_MOVEMENT_PHASE = 'TURN_FOUR_DURING_MOVEMENT_PHASE'
export type TTurnFour_END_OF_MOVEMENT_PHASE = 'TURN_FOUR_END_OF_MOVEMENT_PHASE'
export type TTurnFour_START_OF_SHOOTING_PHASE = 'TURN_FOUR_START_OF_SHOOTING_PHASE'
export type TTurnFour_SHOOTING_PHASE = 'TURN_FOUR_DURING_SHOOTING_PHASE'
export type TTurnFour_END_OF_SHOOTING_PHASE = 'TURN_FOUR_END_OF_SHOOTING_PHASE'
export type TTurnFour_START_OF_CHARGE_PHASE = 'TURN_FOUR_START_OF_CHARGE_PHASE'
export type TTurnFour_CHARGE_PHASE = 'TURN_FOUR_DURING_CHARGE_PHASE'
export type TTurnFour_END_OF_CHARGE_PHASE = 'TURN_FOUR_END_OF_CHARGE_PHASE'
export type TTurnFour_START_OF_COMBAT_PHASE = 'TURN_FOUR_START_OF_COMBAT_PHASE'
export type TTurnFour_COMBAT_PHASE = 'TURN_FOUR_DURING_COMBAT_PHASE'
export type TTurnFour_END_OF_COMBAT_PHASE = 'TURN_FOUR_END_OF_COMBAT_PHASE'
export type TTurnFour_START_OF_BATTLESHOCK_PHASE = 'TURN_FOUR_START_OF_BATTLESHOCK_PHASE'
export type TTurnFour_BATTLESHOCK_PHASE = 'TURN_FOUR_DURING_BATTLESHOCK_PHASE'
export type TTurnFour_END_OF_BATTLESHOCK_PHASE = 'TURN_FOUR_END_OF_BATTLESHOCK_PHASE'
export type TTurnFour_END_OF_TURN = 'TURN_FOUR_END_OF_TURN'
export type TTurnFour_END_OF_ROUND = 'TURN_FOUR_END_OF_ROUND'
export type TTurnFive_START_OF_TURN = 'TURN_FIVE_START_OF_TURN'
export type TTurnFive_START_OF_ROUND = 'TURN_FIVE_START_OF_ROUND'
export type TTurnFive_DURING_TURN = 'TURN_FIVE_DURING_TURN'
export type TTurnFive_DURING_ROUND = 'TURN_FIVE_DURING_ROUND'
export type TTurnFive_START_OF_HERO_PHASE = 'TURN_FIVE_START_OF_HERO_PHASE'
export type TTurnFive_HERO_PHASE = 'TURN_FIVE_DURING_HERO_PHASE'
export type TTurnFive_END_OF_HERO_PHASE = 'TURN_FIVE_END_OF_HERO_PHASE'
export type TTurnFive_START_OF_MOVEMENT_PHASE = 'TURN_FIVE_START_OF_MOVEMENT_PHASE'
export type TTurnFive_MOVEMENT_PHASE = 'TURN_FIVE_DURING_MOVEMENT_PHASE'
export type TTurnFive_END_OF_MOVEMENT_PHASE = 'TURN_FIVE_END_OF_MOVEMENT_PHASE'
export type TTurnFive_START_OF_SHOOTING_PHASE = 'TURN_FIVE_START_OF_SHOOTING_PHASE'
export type TTurnFive_SHOOTING_PHASE = 'TURN_FIVE_DURING_SHOOTING_PHASE'
export type TTurnFive_END_OF_SHOOTING_PHASE = 'TURN_FIVE_END_OF_SHOOTING_PHASE'
export type TTurnFive_START_OF_CHARGE_PHASE = 'TURN_FIVE_START_OF_CHARGE_PHASE'
export type TTurnFive_CHARGE_PHASE = 'TURN_FIVE_DURING_CHARGE_PHASE'
export type TTurnFive_END_OF_CHARGE_PHASE = 'TURN_FIVE_END_OF_CHARGE_PHASE'
export type TTurnFive_START_OF_COMBAT_PHASE = 'TURN_FIVE_START_OF_COMBAT_PHASE'
export type TTurnFive_COMBAT_PHASE = 'TURN_FIVE_DURING_COMBAT_PHASE'
export type TTurnFive_END_OF_COMBAT_PHASE = 'TURN_FIVE_END_OF_COMBAT_PHASE'
export type TTurnFive_START_OF_BATTLESHOCK_PHASE = 'TURN_FIVE_START_OF_BATTLESHOCK_PHASE'
export type TTurnFive_BATTLESHOCK_PHASE = 'TURN_FIVE_DURING_BATTLESHOCK_PHASE'
export type TTurnFive_END_OF_BATTLESHOCK_PHASE = 'TURN_FIVE_END_OF_BATTLESHOCK_PHASE'
export type TTurnFive_END_OF_TURN = 'TURN_FIVE_END_OF_TURN'
export type TTurnFive_END_OF_ROUND = 'TURN_FIVE_END_OF_ROUND'

// Specific Turn Consts
export const TURN_ONE_START_OF_TURN: TTurnOne_START_OF_TURN = 'TURN_ONE_START_OF_TURN'
export const TURN_ONE_START_OF_ROUND: TTurnOne_START_OF_ROUND = 'TURN_ONE_START_OF_ROUND'
export const TURN_ONE_DURING_TURN: TTurnOne_DURING_TURN = 'TURN_ONE_DURING_TURN'
export const TURN_ONE_DURING_ROUND: TTurnOne_DURING_ROUND = 'TURN_ONE_DURING_ROUND'
export const TURN_ONE_START_OF_HERO_PHASE: TTurnOne_START_OF_HERO_PHASE = 'TURN_ONE_START_OF_HERO_PHASE'
export const TURN_ONE_HERO_PHASE: TTurnOne_HERO_PHASE = 'TURN_ONE_DURING_HERO_PHASE'
export const TURN_ONE_END_OF_HERO_PHASE: TTurnOne_END_OF_HERO_PHASE = 'TURN_ONE_END_OF_HERO_PHASE'
export const TURN_ONE_START_OF_MOVEMENT_PHASE: TTurnOne_START_OF_MOVEMENT_PHASE =
  'TURN_ONE_START_OF_MOVEMENT_PHASE'
export const TURN_ONE_MOVEMENT_PHASE: TTurnOne_MOVEMENT_PHASE = 'TURN_ONE_DURING_MOVEMENT_PHASE'
export const TURN_ONE_END_OF_MOVEMENT_PHASE: TTurnOne_END_OF_MOVEMENT_PHASE = 'TURN_ONE_END_OF_MOVEMENT_PHASE'
export const TURN_ONE_START_OF_SHOOTING_PHASE: TTurnOne_START_OF_SHOOTING_PHASE =
  'TURN_ONE_START_OF_SHOOTING_PHASE'
export const TURN_ONE_SHOOTING_PHASE: TTurnOne_SHOOTING_PHASE = 'TURN_ONE_DURING_SHOOTING_PHASE'
export const TURN_ONE_END_OF_SHOOTING_PHASE: TTurnOne_END_OF_SHOOTING_PHASE = 'TURN_ONE_END_OF_SHOOTING_PHASE'
export const TURN_ONE_START_OF_CHARGE_PHASE: TTurnOne_START_OF_CHARGE_PHASE = 'TURN_ONE_START_OF_CHARGE_PHASE'
export const TURN_ONE_CHARGE_PHASE: TTurnOne_CHARGE_PHASE = 'TURN_ONE_DURING_CHARGE_PHASE'
export const TURN_ONE_END_OF_CHARGE_PHASE: TTurnOne_END_OF_CHARGE_PHASE = 'TURN_ONE_END_OF_CHARGE_PHASE'
export const TURN_ONE_START_OF_COMBAT_PHASE: TTurnOne_START_OF_COMBAT_PHASE = 'TURN_ONE_START_OF_COMBAT_PHASE'
export const TURN_ONE_COMBAT_PHASE: TTurnOne_COMBAT_PHASE = 'TURN_ONE_DURING_COMBAT_PHASE'
export const TURN_ONE_END_OF_COMBAT_PHASE: TTurnOne_END_OF_COMBAT_PHASE = 'TURN_ONE_END_OF_COMBAT_PHASE'
export const TURN_ONE_START_OF_BATTLESHOCK_PHASE: TTurnOne_START_OF_BATTLESHOCK_PHASE =
  'TURN_ONE_START_OF_BATTLESHOCK_PHASE'
export const TURN_ONE_BATTLESHOCK_PHASE: TTurnOne_BATTLESHOCK_PHASE = 'TURN_ONE_DURING_BATTLESHOCK_PHASE'
export const TURN_ONE_END_OF_BATTLESHOCK_PHASE: TTurnOne_END_OF_BATTLESHOCK_PHASE =
  'TURN_ONE_END_OF_BATTLESHOCK_PHASE'
export const TURN_ONE_END_OF_TURN: TTurnOne_END_OF_TURN = 'TURN_ONE_END_OF_TURN'
export const TURN_ONE_END_OF_ROUND: TTurnOne_END_OF_ROUND = 'TURN_ONE_END_OF_ROUND'
export const TURN_TWO_START_OF_TURN: TTurnTwo_START_OF_TURN = 'TURN_TWO_START_OF_TURN'
export const TURN_TWO_START_OF_ROUND: TTurnTwo_START_OF_ROUND = 'TURN_TWO_START_OF_ROUND'
export const TURN_TWO_DURING_TURN: TTurnTwo_DURING_TURN = 'TURN_TWO_DURING_TURN'
export const TURN_TWO_DURING_ROUND: TTurnTwo_DURING_ROUND = 'TURN_TWO_DURING_ROUND'
export const TURN_TWO_START_OF_HERO_PHASE: TTurnTwo_START_OF_HERO_PHASE = 'TURN_TWO_START_OF_HERO_PHASE'
export const TURN_TWO_HERO_PHASE: TTurnTwo_HERO_PHASE = 'TURN_TWO_DURING_HERO_PHASE'
export const TURN_TWO_END_OF_HERO_PHASE: TTurnTwo_END_OF_HERO_PHASE = 'TURN_TWO_END_OF_HERO_PHASE'
export const TURN_TWO_START_OF_MOVEMENT_PHASE: TTurnTwo_START_OF_MOVEMENT_PHASE =
  'TURN_TWO_START_OF_MOVEMENT_PHASE'
export const TURN_TWO_MOVEMENT_PHASE: TTurnTwo_MOVEMENT_PHASE = 'TURN_TWO_DURING_MOVEMENT_PHASE'
export const TURN_TWO_END_OF_MOVEMENT_PHASE: TTurnTwo_END_OF_MOVEMENT_PHASE = 'TURN_TWO_END_OF_MOVEMENT_PHASE'
export const TURN_TWO_START_OF_SHOOTING_PHASE: TTurnTwo_START_OF_SHOOTING_PHASE =
  'TURN_TWO_START_OF_SHOOTING_PHASE'
export const TURN_TWO_SHOOTING_PHASE: TTurnTwo_SHOOTING_PHASE = 'TURN_TWO_DURING_SHOOTING_PHASE'
export const TURN_TWO_END_OF_SHOOTING_PHASE: TTurnTwo_END_OF_SHOOTING_PHASE = 'TURN_TWO_END_OF_SHOOTING_PHASE'
export const TURN_TWO_START_OF_CHARGE_PHASE: TTurnTwo_START_OF_CHARGE_PHASE = 'TURN_TWO_START_OF_CHARGE_PHASE'
export const TURN_TWO_CHARGE_PHASE: TTurnTwo_CHARGE_PHASE = 'TURN_TWO_DURING_CHARGE_PHASE'
export const TURN_TWO_END_OF_CHARGE_PHASE: TTurnTwo_END_OF_CHARGE_PHASE = 'TURN_TWO_END_OF_CHARGE_PHASE'
export const TURN_TWO_START_OF_COMBAT_PHASE: TTurnTwo_START_OF_COMBAT_PHASE = 'TURN_TWO_START_OF_COMBAT_PHASE'
export const TURN_TWO_COMBAT_PHASE: TTurnTwo_COMBAT_PHASE = 'TURN_TWO_DURING_COMBAT_PHASE'
export const TURN_TWO_END_OF_COMBAT_PHASE: TTurnTwo_END_OF_COMBAT_PHASE = 'TURN_TWO_END_OF_COMBAT_PHASE'
export const TURN_TWO_START_OF_BATTLESHOCK_PHASE: TTurnTwo_START_OF_BATTLESHOCK_PHASE =
  'TURN_TWO_START_OF_BATTLESHOCK_PHASE'
export const TURN_TWO_BATTLESHOCK_PHASE: TTurnTwo_BATTLESHOCK_PHASE = 'TURN_TWO_DURING_BATTLESHOCK_PHASE'
export const TURN_TWO_END_OF_BATTLESHOCK_PHASE: TTurnTwo_END_OF_BATTLESHOCK_PHASE =
  'TURN_TWO_END_OF_BATTLESHOCK_PHASE'
export const TURN_TWO_END_OF_TURN: TTurnTwo_END_OF_TURN = 'TURN_TWO_END_OF_TURN'
export const TURN_TWO_END_OF_ROUND: TTurnTwo_END_OF_ROUND = 'TURN_TWO_END_OF_ROUND'
export const TURN_THREE_START_OF_TURN: TTurnThree_START_OF_TURN = 'TURN_THREE_START_OF_TURN'
export const TURN_THREE_START_OF_ROUND: TTurnThree_START_OF_ROUND = 'TURN_THREE_START_OF_ROUND'
export const TURN_THREE_DURING_TURN: TTurnThree_DURING_TURN = 'TURN_THREE_DURING_TURN'
export const TURN_THREE_DURING_ROUND: TTurnThree_DURING_ROUND = 'TURN_THREE_DURING_ROUND'
export const TURN_THREE_START_OF_HERO_PHASE: TTurnThree_START_OF_HERO_PHASE = 'TURN_THREE_START_OF_HERO_PHASE'
export const TURN_THREE_HERO_PHASE: TTurnThree_HERO_PHASE = 'TURN_THREE_DURING_HERO_PHASE'
export const TURN_THREE_END_OF_HERO_PHASE: TTurnThree_END_OF_HERO_PHASE = 'TURN_THREE_END_OF_HERO_PHASE'
export const TURN_THREE_START_OF_MOVEMENT_PHASE: TTurnThree_START_OF_MOVEMENT_PHASE =
  'TURN_THREE_START_OF_MOVEMENT_PHASE'
export const TURN_THREE_MOVEMENT_PHASE: TTurnThree_MOVEMENT_PHASE = 'TURN_THREE_DURING_MOVEMENT_PHASE'
export const TURN_THREE_END_OF_MOVEMENT_PHASE: TTurnThree_END_OF_MOVEMENT_PHASE =
  'TURN_THREE_END_OF_MOVEMENT_PHASE'
export const TURN_THREE_START_OF_SHOOTING_PHASE: TTurnThree_START_OF_SHOOTING_PHASE =
  'TURN_THREE_START_OF_SHOOTING_PHASE'
export const TURN_THREE_SHOOTING_PHASE: TTurnThree_SHOOTING_PHASE = 'TURN_THREE_DURING_SHOOTING_PHASE'
export const TURN_THREE_END_OF_SHOOTING_PHASE: TTurnThree_END_OF_SHOOTING_PHASE =
  'TURN_THREE_END_OF_SHOOTING_PHASE'
export const TURN_THREE_START_OF_CHARGE_PHASE: TTurnThree_START_OF_CHARGE_PHASE =
  'TURN_THREE_START_OF_CHARGE_PHASE'
export const TURN_THREE_CHARGE_PHASE: TTurnThree_CHARGE_PHASE = 'TURN_THREE_DURING_CHARGE_PHASE'
export const TURN_THREE_END_OF_CHARGE_PHASE: TTurnThree_END_OF_CHARGE_PHASE = 'TURN_THREE_END_OF_CHARGE_PHASE'
export const TURN_THREE_START_OF_COMBAT_PHASE: TTurnThree_START_OF_COMBAT_PHASE =
  'TURN_THREE_START_OF_COMBAT_PHASE'
export const TURN_THREE_COMBAT_PHASE: TTurnThree_COMBAT_PHASE = 'TURN_THREE_DURING_COMBAT_PHASE'
export const TURN_THREE_END_OF_COMBAT_PHASE: TTurnThree_END_OF_COMBAT_PHASE = 'TURN_THREE_END_OF_COMBAT_PHASE'
export const TURN_THREE_START_OF_BATTLESHOCK_PHASE: TTurnThree_START_OF_BATTLESHOCK_PHASE =
  'TURN_THREE_START_OF_BATTLESHOCK_PHASE'
export const TURN_THREE_BATTLESHOCK_PHASE: TTurnThree_BATTLESHOCK_PHASE =
  'TURN_THREE_DURING_BATTLESHOCK_PHASE'
export const TURN_THREE_END_OF_BATTLESHOCK_PHASE: TTurnThree_END_OF_BATTLESHOCK_PHASE =
  'TURN_THREE_END_OF_BATTLESHOCK_PHASE'
export const TURN_THREE_END_OF_TURN: TTurnThree_END_OF_TURN = 'TURN_THREE_END_OF_TURN'
export const TURN_THREE_END_OF_ROUND: TTurnThree_END_OF_ROUND = 'TURN_THREE_END_OF_ROUND'
export const TURN_FOUR_START_OF_TURN: TTurnFour_START_OF_TURN = 'TURN_FOUR_START_OF_TURN'
export const TURN_FOUR_START_OF_ROUND: TTurnFour_START_OF_ROUND = 'TURN_FOUR_START_OF_ROUND'
export const TURN_FOUR_DURING_TURN: TTurnFour_DURING_TURN = 'TURN_FOUR_DURING_TURN'
export const TURN_FOUR_DURING_ROUND: TTurnFour_DURING_ROUND = 'TURN_FOUR_DURING_ROUND'
export const TURN_FOUR_START_OF_HERO_PHASE: TTurnFour_START_OF_HERO_PHASE = 'TURN_FOUR_START_OF_HERO_PHASE'
export const TURN_FOUR_HERO_PHASE: TTurnFour_HERO_PHASE = 'TURN_FOUR_DURING_HERO_PHASE'
export const TURN_FOUR_END_OF_HERO_PHASE: TTurnFour_END_OF_HERO_PHASE = 'TURN_FOUR_END_OF_HERO_PHASE'
export const TURN_FOUR_START_OF_MOVEMENT_PHASE: TTurnFour_START_OF_MOVEMENT_PHASE =
  'TURN_FOUR_START_OF_MOVEMENT_PHASE'
export const TURN_FOUR_MOVEMENT_PHASE: TTurnFour_MOVEMENT_PHASE = 'TURN_FOUR_DURING_MOVEMENT_PHASE'
export const TURN_FOUR_END_OF_MOVEMENT_PHASE: TTurnFour_END_OF_MOVEMENT_PHASE =
  'TURN_FOUR_END_OF_MOVEMENT_PHASE'
export const TURN_FOUR_START_OF_SHOOTING_PHASE: TTurnFour_START_OF_SHOOTING_PHASE =
  'TURN_FOUR_START_OF_SHOOTING_PHASE'
export const TURN_FOUR_SHOOTING_PHASE: TTurnFour_SHOOTING_PHASE = 'TURN_FOUR_DURING_SHOOTING_PHASE'
export const TURN_FOUR_END_OF_SHOOTING_PHASE: TTurnFour_END_OF_SHOOTING_PHASE =
  'TURN_FOUR_END_OF_SHOOTING_PHASE'
export const TURN_FOUR_START_OF_CHARGE_PHASE: TTurnFour_START_OF_CHARGE_PHASE =
  'TURN_FOUR_START_OF_CHARGE_PHASE'
export const TURN_FOUR_CHARGE_PHASE: TTurnFour_CHARGE_PHASE = 'TURN_FOUR_DURING_CHARGE_PHASE'
export const TURN_FOUR_END_OF_CHARGE_PHASE: TTurnFour_END_OF_CHARGE_PHASE = 'TURN_FOUR_END_OF_CHARGE_PHASE'
export const TURN_FOUR_START_OF_COMBAT_PHASE: TTurnFour_START_OF_COMBAT_PHASE =
  'TURN_FOUR_START_OF_COMBAT_PHASE'
export const TURN_FOUR_COMBAT_PHASE: TTurnFour_COMBAT_PHASE = 'TURN_FOUR_DURING_COMBAT_PHASE'
export const TURN_FOUR_END_OF_COMBAT_PHASE: TTurnFour_END_OF_COMBAT_PHASE = 'TURN_FOUR_END_OF_COMBAT_PHASE'
export const TURN_FOUR_START_OF_BATTLESHOCK_PHASE: TTurnFour_START_OF_BATTLESHOCK_PHASE =
  'TURN_FOUR_START_OF_BATTLESHOCK_PHASE'
export const TURN_FOUR_BATTLESHOCK_PHASE: TTurnFour_BATTLESHOCK_PHASE = 'TURN_FOUR_DURING_BATTLESHOCK_PHASE'
export const TURN_FOUR_END_OF_BATTLESHOCK_PHASE: TTurnFour_END_OF_BATTLESHOCK_PHASE =
  'TURN_FOUR_END_OF_BATTLESHOCK_PHASE'
export const TURN_FOUR_END_OF_TURN: TTurnFour_END_OF_TURN = 'TURN_FOUR_END_OF_TURN'
export const TURN_FOUR_END_OF_ROUND: TTurnFour_END_OF_ROUND = 'TURN_FOUR_END_OF_ROUND'
export const TURN_FIVE_START_OF_TURN: TTurnFive_START_OF_TURN = 'TURN_FIVE_START_OF_TURN'
export const TURN_FIVE_START_OF_ROUND: TTurnFive_START_OF_ROUND = 'TURN_FIVE_START_OF_ROUND'
export const TURN_FIVE_DURING_TURN: TTurnFive_DURING_TURN = 'TURN_FIVE_DURING_TURN'
export const TURN_FIVE_DURING_ROUND: TTurnFive_DURING_ROUND = 'TURN_FIVE_DURING_ROUND'
export const TURN_FIVE_START_OF_HERO_PHASE: TTurnFive_START_OF_HERO_PHASE = 'TURN_FIVE_START_OF_HERO_PHASE'
export const TURN_FIVE_HERO_PHASE: TTurnFive_HERO_PHASE = 'TURN_FIVE_DURING_HERO_PHASE'
export const TURN_FIVE_END_OF_HERO_PHASE: TTurnFive_END_OF_HERO_PHASE = 'TURN_FIVE_END_OF_HERO_PHASE'
export const TURN_FIVE_START_OF_MOVEMENT_PHASE: TTurnFive_START_OF_MOVEMENT_PHASE =
  'TURN_FIVE_START_OF_MOVEMENT_PHASE'
export const TURN_FIVE_MOVEMENT_PHASE: TTurnFive_MOVEMENT_PHASE = 'TURN_FIVE_DURING_MOVEMENT_PHASE'
export const TURN_FIVE_END_OF_MOVEMENT_PHASE: TTurnFive_END_OF_MOVEMENT_PHASE =
  'TURN_FIVE_END_OF_MOVEMENT_PHASE'
export const TURN_FIVE_START_OF_SHOOTING_PHASE: TTurnFive_START_OF_SHOOTING_PHASE =
  'TURN_FIVE_START_OF_SHOOTING_PHASE'
export const TURN_FIVE_SHOOTING_PHASE: TTurnFive_SHOOTING_PHASE = 'TURN_FIVE_DURING_SHOOTING_PHASE'
export const TURN_FIVE_END_OF_SHOOTING_PHASE: TTurnFive_END_OF_SHOOTING_PHASE =
  'TURN_FIVE_END_OF_SHOOTING_PHASE'
export const TURN_FIVE_START_OF_CHARGE_PHASE: TTurnFive_START_OF_CHARGE_PHASE =
  'TURN_FIVE_START_OF_CHARGE_PHASE'
export const TURN_FIVE_CHARGE_PHASE: TTurnFive_CHARGE_PHASE = 'TURN_FIVE_DURING_CHARGE_PHASE'
export const TURN_FIVE_END_OF_CHARGE_PHASE: TTurnFive_END_OF_CHARGE_PHASE = 'TURN_FIVE_END_OF_CHARGE_PHASE'
export const TURN_FIVE_START_OF_COMBAT_PHASE: TTurnFive_START_OF_COMBAT_PHASE =
  'TURN_FIVE_START_OF_COMBAT_PHASE'
export const TURN_FIVE_COMBAT_PHASE: TTurnFive_COMBAT_PHASE = 'TURN_FIVE_DURING_COMBAT_PHASE'
export const TURN_FIVE_END_OF_COMBAT_PHASE: TTurnFive_END_OF_COMBAT_PHASE = 'TURN_FIVE_END_OF_COMBAT_PHASE'
export const TURN_FIVE_START_OF_BATTLESHOCK_PHASE: TTurnFive_START_OF_BATTLESHOCK_PHASE =
  'TURN_FIVE_START_OF_BATTLESHOCK_PHASE'
export const TURN_FIVE_BATTLESHOCK_PHASE: TTurnFive_BATTLESHOCK_PHASE = 'TURN_FIVE_DURING_BATTLESHOCK_PHASE'
export const TURN_FIVE_END_OF_BATTLESHOCK_PHASE: TTurnFive_END_OF_BATTLESHOCK_PHASE =
  'TURN_FIVE_END_OF_BATTLESHOCK_PHASE'
export const TURN_FIVE_END_OF_TURN: TTurnFive_END_OF_TURN = 'TURN_FIVE_END_OF_TURN'
export const TURN_FIVE_END_OF_ROUND: TTurnFive_END_OF_ROUND = 'TURN_FIVE_END_OF_ROUND'

// When
export type TTurnWhen =
  | TSetupStart
  | TDuringSetup
  | TSetupEnd
  | TGameStart
  | TGameDuring
  | TTurnStart
  | TRoundStart
  | TTurnEnd
  | TRoundEnd
  | TGameEnd
  | THeroPhaseStart
  | THeroPhase
  | THeroPhaseEnd
  | TMovementPhaseStart
  | TMovementPhase
  | TMovementPhaseEnd
  | TShootingPhaseStart
  | TShootingPhase
  | TShootingPhaseEnd
  | TChargePhaseStart
  | TChargePhase
  | TChargePhaseEnd
  | TCombatPhaseStart
  | TCombatPhase
  | TCombatPhaseEnd
  | TBattleshockPhaseStart
  | TBattleshockPhase
  | TBattleshockPhaseEnd
  | TTurnOne_START_OF_TURN
  | TTurnOne_START_OF_ROUND
  | TTurnOne_DURING_TURN
  | TTurnOne_DURING_ROUND
  | TTurnOne_START_OF_HERO_PHASE
  | TTurnOne_HERO_PHASE
  | TTurnOne_END_OF_HERO_PHASE
  | TTurnOne_START_OF_MOVEMENT_PHASE
  | TTurnOne_MOVEMENT_PHASE
  | TTurnOne_END_OF_MOVEMENT_PHASE
  | TTurnOne_START_OF_SHOOTING_PHASE
  | TTurnOne_SHOOTING_PHASE
  | TTurnOne_END_OF_SHOOTING_PHASE
  | TTurnOne_START_OF_CHARGE_PHASE
  | TTurnOne_CHARGE_PHASE
  | TTurnOne_END_OF_CHARGE_PHASE
  | TTurnOne_START_OF_COMBAT_PHASE
  | TTurnOne_COMBAT_PHASE
  | TTurnOne_END_OF_COMBAT_PHASE
  | TTurnOne_START_OF_BATTLESHOCK_PHASE
  | TTurnOne_BATTLESHOCK_PHASE
  | TTurnOne_END_OF_BATTLESHOCK_PHASE
  | TTurnOne_END_OF_TURN
  | TTurnOne_END_OF_ROUND
  | TTurnTwo_START_OF_TURN
  | TTurnTwo_START_OF_ROUND
  | TTurnTwo_DURING_TURN
  | TTurnTwo_DURING_ROUND
  | TTurnTwo_START_OF_HERO_PHASE
  | TTurnTwo_HERO_PHASE
  | TTurnTwo_END_OF_HERO_PHASE
  | TTurnTwo_START_OF_MOVEMENT_PHASE
  | TTurnTwo_MOVEMENT_PHASE
  | TTurnTwo_END_OF_MOVEMENT_PHASE
  | TTurnTwo_START_OF_SHOOTING_PHASE
  | TTurnTwo_SHOOTING_PHASE
  | TTurnTwo_END_OF_SHOOTING_PHASE
  | TTurnTwo_START_OF_CHARGE_PHASE
  | TTurnTwo_CHARGE_PHASE
  | TTurnTwo_END_OF_CHARGE_PHASE
  | TTurnTwo_START_OF_COMBAT_PHASE
  | TTurnTwo_COMBAT_PHASE
  | TTurnTwo_END_OF_COMBAT_PHASE
  | TTurnTwo_START_OF_BATTLESHOCK_PHASE
  | TTurnTwo_BATTLESHOCK_PHASE
  | TTurnTwo_END_OF_BATTLESHOCK_PHASE
  | TTurnTwo_END_OF_TURN
  | TTurnTwo_END_OF_ROUND
  | TTurnThree_START_OF_TURN
  | TTurnThree_START_OF_ROUND
  | TTurnThree_DURING_TURN
  | TTurnThree_DURING_ROUND
  | TTurnThree_START_OF_HERO_PHASE
  | TTurnThree_HERO_PHASE
  | TTurnThree_END_OF_HERO_PHASE
  | TTurnThree_START_OF_MOVEMENT_PHASE
  | TTurnThree_MOVEMENT_PHASE
  | TTurnThree_END_OF_MOVEMENT_PHASE
  | TTurnThree_START_OF_SHOOTING_PHASE
  | TTurnThree_SHOOTING_PHASE
  | TTurnThree_END_OF_SHOOTING_PHASE
  | TTurnThree_START_OF_CHARGE_PHASE
  | TTurnThree_CHARGE_PHASE
  | TTurnThree_END_OF_CHARGE_PHASE
  | TTurnThree_START_OF_COMBAT_PHASE
  | TTurnThree_COMBAT_PHASE
  | TTurnThree_END_OF_COMBAT_PHASE
  | TTurnThree_START_OF_BATTLESHOCK_PHASE
  | TTurnThree_BATTLESHOCK_PHASE
  | TTurnThree_END_OF_BATTLESHOCK_PHASE
  | TTurnThree_END_OF_TURN
  | TTurnThree_END_OF_ROUND
  | TTurnFour_START_OF_TURN
  | TTurnFour_START_OF_ROUND
  | TTurnFour_DURING_TURN
  | TTurnFour_DURING_ROUND
  | TTurnFour_START_OF_HERO_PHASE
  | TTurnFour_HERO_PHASE
  | TTurnFour_END_OF_HERO_PHASE
  | TTurnFour_START_OF_MOVEMENT_PHASE
  | TTurnFour_MOVEMENT_PHASE
  | TTurnFour_END_OF_MOVEMENT_PHASE
  | TTurnFour_START_OF_SHOOTING_PHASE
  | TTurnFour_SHOOTING_PHASE
  | TTurnFour_END_OF_SHOOTING_PHASE
  | TTurnFour_START_OF_CHARGE_PHASE
  | TTurnFour_CHARGE_PHASE
  | TTurnFour_END_OF_CHARGE_PHASE
  | TTurnFour_START_OF_COMBAT_PHASE
  | TTurnFour_COMBAT_PHASE
  | TTurnFour_END_OF_COMBAT_PHASE
  | TTurnFour_START_OF_BATTLESHOCK_PHASE
  | TTurnFour_BATTLESHOCK_PHASE
  | TTurnFour_END_OF_BATTLESHOCK_PHASE
  | TTurnFour_END_OF_TURN
  | TTurnFour_END_OF_ROUND
  | TTurnFive_START_OF_TURN
  | TTurnFive_START_OF_ROUND
  | TTurnFive_DURING_TURN
  | TTurnFive_DURING_ROUND
  | TTurnFive_START_OF_HERO_PHASE
  | TTurnFive_HERO_PHASE
  | TTurnFive_END_OF_HERO_PHASE
  | TTurnFive_START_OF_MOVEMENT_PHASE
  | TTurnFive_MOVEMENT_PHASE
  | TTurnFive_END_OF_MOVEMENT_PHASE
  | TTurnFive_START_OF_SHOOTING_PHASE
  | TTurnFive_SHOOTING_PHASE
  | TTurnFive_END_OF_SHOOTING_PHASE
  | TTurnFive_START_OF_CHARGE_PHASE
  | TTurnFive_CHARGE_PHASE
  | TTurnFive_END_OF_CHARGE_PHASE
  | TTurnFive_START_OF_COMBAT_PHASE
  | TTurnFive_COMBAT_PHASE
  | TTurnFive_END_OF_COMBAT_PHASE
  | TTurnFive_START_OF_BATTLESHOCK_PHASE
  | TTurnFive_BATTLESHOCK_PHASE
  | TTurnFive_END_OF_BATTLESHOCK_PHASE
  | TTurnFive_END_OF_TURN
  | TTurnFive_END_OF_ROUND
  | TTurnDuring
  | TRoundDuring
