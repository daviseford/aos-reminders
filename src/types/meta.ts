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
export type THeroPhase = 'HERO_PHASE'
export type THeroPhaseEnd = 'END_OF_HERO_PHASE'

// Move
export type TMovementPhaseStart = 'START_OF_MOVEMENT_PHASE'
export type TMovementPhase = 'MOVEMENT_PHASE'
export type TMovementPhaseEnd = 'END_OF_MOVEMENT_PHASE'

// Shooting
export type TShootingPhaseStart = 'START_OF_SHOOTING_PHASE'
export type TShootingPhase = 'SHOOTING_PHASE'
export type TShootingPhaseEnd = 'END_OF_SHOOTING_PHASE'

// Charge
export type TChargePhaseStart = 'START_OF_CHARGE_PHASE'
export type TChargePhase = 'CHARGE_PHASE'
export type TChargePhaseEnd = 'END_OF_CHARGE_PHASE'

// Combat
export type TCombatPhaseStart = 'START_OF_COMBAT_PHASE'
export type TCombatPhase = 'COMBAT_PHASE'
export type TCombatPhaseEnd = 'END_OF_COMBAT_PHASE'

// Battleshock
export type TBattleshockPhaseStart = 'START_OF_BATTLESHOCK_PHASE'
export type TBattleshockPhase = 'BATTLESHOCK_PHASE'
export type TBattleshockPhaseEnd = 'END_OF_BATTLESHOCK_PHASE'

export type TPhases = THeroPhase | TMovementPhase | TShootingPhase | TChargePhase | TCombatPhase | TBattleshockPhase
export type TPhaseSegments = TPhaseStart | TPhaseDuring | TPhaseEnd

// Phases Exports
export const HERO_PHASE_START: THeroPhaseStart = 'START_OF_HERO_PHASE'
export const HERO_PHASE: THeroPhase = 'HERO_PHASE'
export const HERO_PHASE_END: THeroPhaseEnd = 'END_OF_HERO_PHASE'
export const MOVEMENT_PHASE_START: TMovementPhaseStart = 'START_OF_MOVEMENT_PHASE'
export const MOVEMENT_PHASE: TMovementPhase = 'MOVEMENT_PHASE'
export const MOVEMENT_PHASE_END: TMovementPhaseEnd = 'END_OF_MOVEMENT_PHASE'
export const SHOOTING_PHASE_START: TShootingPhaseStart = 'START_OF_SHOOTING_PHASE'
export const SHOOTING_PHASE: TShootingPhase = 'SHOOTING_PHASE'
export const SHOOTING_PHASE_END: TShootingPhaseEnd = 'END_OF_SHOOTING_PHASE'
export const CHARGE_PHASE_START: TChargePhaseStart = 'START_OF_CHARGE_PHASE'
export const CHARGE_PHASE: TChargePhase = 'CHARGE_PHASE'
export const CHARGE_PHASE_END: TChargePhaseEnd = 'END_OF_CHARGE_PHASE'
export const COMBAT_PHASE_START: TCombatPhaseStart = 'START_OF_COMBAT_PHASE'
export const COMBAT_PHASE: TCombatPhase = 'COMBAT_PHASE'
export const COMBAT_PHASE_END: TCombatPhaseEnd = 'END_OF_COMBAT_PHASE'
export const BATTLESHOCK_PHASE_START: TBattleshockPhaseStart = 'START_OF_BATTLESHOCK_PHASE'
export const BATTLESHOCK_PHASE: TBattleshockPhase = 'BATTLESHOCK_PHASE'
export const BATTLESHOCK_PHASE_END: TBattleshockPhaseEnd = 'END_OF_BATTLESHOCK_PHASE'

// Turn Types
export type TSetupStart = 'START_OF_SETUP'
export type TDuringSetup = 'DURING_SETUP'
export type TSetupEnd = 'END_OF_SETUP'
export type TGameStart = 'START_OF_GAME'
export type TGameDuring = 'DURING_GAME'
export type TTurnStart = 'START_OF_TURN'
export type TTurnDuring = 'DURING_TURN'
export type TTurnEnd = 'END_OF_TURN'
export type TTurnOne = 'TURN_ONE'
export type TTurnTwo = 'TURN_TWO'
export type TTurnThree = 'TURN_THREE'
export type TTurnFour = 'TURN_FOUR'
export type TTurnFive = 'TURN_FIVE'
export type TGameEnd = 'END_OF_GAME'

// Turn Exports
export const SETUP_START: TSetupStart = 'START_OF_SETUP'
export const SETUP_DURING: TDuringSetup = 'DURING_SETUP'
export const SETUP_END: TSetupEnd = 'END_OF_SETUP'
export const GAME_START: TGameStart = 'START_OF_GAME'
export const GAME_DURING: TGameDuring = 'DURING_GAME'
export const TURN_START: TTurnStart = 'START_OF_TURN'
export const TURN_DURING: TTurnDuring = 'DURING_TURN'
export const TURN_END: TTurnEnd = 'END_OF_TURN'
export const TURN_ONE: TTurnOne = 'TURN_ONE'
export const TURN_TWO: TTurnTwo = 'TURN_TWO'
export const TURN_THREE: TTurnThree = 'TURN_THREE'
export const TURN_FOUR: TTurnFour = 'TURN_FOUR'
export const TURN_FIVE: TTurnFive = 'TURN_FIVE'
export const GAME_END: TGameEnd = 'END_OF_GAME'

// When
export type TTurnWhen =
  | TSetupStart
  | TDuringSetup
  | TSetupEnd
  | TGameStart
  | TGameDuring
  | TTurnStart
  | TTurnEnd
  | TTurnOne
  | TTurnTwo
  | TTurnThree
  | TTurnFour
  | TTurnFive
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
