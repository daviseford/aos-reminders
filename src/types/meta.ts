// Phase Stage Types
export type TPhaseStart = 'PHASE_START'
export type TPhaseDuring = 'PHASE_DURING'
export type TPhaseEnd = 'PHASE_END'

// Phase Stage Exports
export const PHASE_START: TPhaseStart = 'PHASE_START'
export const PHASE_DURING: TPhaseDuring = 'PHASE_DURING'
export const PHASE_END: TPhaseEnd = 'PHASE_END'

// Phases
// Hero
export type THeroPhaseStart = 'HERO_PHASE_START'
export type THeroPhase = 'HERO_PHASE'
export type THeroPhaseEnd = 'HERO_PHASE_END'

// Move
export type TMovementPhaseStart = 'MOVEMENT_PHASE_START'
export type TMovementPhase = 'MOVEMENT_PHASE'
export type TMovementPhaseEnd = 'MOVEMENT_PHASE_END'

// Shooting
export type TShootingPhaseStart = 'SHOOTING_PHASE_START'
export type TShootingPhase = 'SHOOTING_PHASE'
export type TShootingPhaseEnd = 'SHOOTING_PHASE_END'

// Charge
export type TChargePhaseStart = 'CHARGE_PHASE_START'
export type TChargePhase = 'CHARGE_PHASE'
export type TChargePhaseEnd = 'CHARGE_PHASE_END'

// Combat
export type TCombatPhaseStart = 'COMBAT_PHASE_START'
export type TCombatPhase = 'COMBAT_PHASE'
export type TCombatPhaseEnd = 'COMBAT_PHASE_END'

// Battleshock
export type TBattleshockPhaseStart = 'BATTLESHOCK_PHASE_START'
export type TBattleshockPhase = 'BATTLESHOCK_PHASE'
export type TBattleshockPhaseEnd = 'BATTLESHOCK_PHASE_END'

export type TPhases = THeroPhase | TMovementPhase | TShootingPhase | TChargePhase | TCombatPhase | TBattleshockPhase
export type TPhaseSegments = TPhaseStart | TPhaseDuring | TPhaseEnd

// Phases Exports
export const HERO_PHASE_START: THeroPhaseStart = 'HERO_PHASE_START'
export const HERO_PHASE: THeroPhase = 'HERO_PHASE'
export const HERO_PHASE_END: THeroPhaseEnd = 'HERO_PHASE_END'
export const MOVEMENT_PHASE_START: TMovementPhaseStart = 'MOVEMENT_PHASE_START'
export const MOVEMENT_PHASE: TMovementPhase = 'MOVEMENT_PHASE'
export const MOVEMENT_PHASE_END: TMovementPhaseEnd = 'MOVEMENT_PHASE_END'
export const SHOOTING_PHASE_START: TShootingPhaseStart = 'SHOOTING_PHASE_START'
export const SHOOTING_PHASE: TShootingPhase = 'SHOOTING_PHASE'
export const SHOOTING_PHASE_END: TShootingPhaseEnd = 'SHOOTING_PHASE_END'
export const CHARGE_PHASE_START: TChargePhaseStart = 'CHARGE_PHASE_START'
export const CHARGE_PHASE: TChargePhase = 'CHARGE_PHASE'
export const CHARGE_PHASE_END: TChargePhaseEnd = 'CHARGE_PHASE_END'
export const COMBAT_PHASE_START: TCombatPhaseStart = 'COMBAT_PHASE_START'
export const COMBAT_PHASE: TCombatPhase = 'COMBAT_PHASE'
export const COMBAT_PHASE_END: TCombatPhaseEnd = 'COMBAT_PHASE_END'
export const BATTLESHOCK_PHASE_START: TBattleshockPhaseStart = 'BATTLESHOCK_PHASE_START'
export const BATTLESHOCK_PHASE: TBattleshockPhase = 'BATTLESHOCK_PHASE'
export const BATTLESHOCK_PHASE_END: TBattleshockPhaseEnd = 'BATTLESHOCK_PHASE_END'

// Turn Types
export type TSetupStart = 'SETUP_START'
export type TSetup = 'SETUP'
export type TSetupEnd = 'SETUP_END'
export type TGameStart = 'GAME_START'
export type TGameDuring = 'GAME_DURING'
export type TTurnStart = 'TURN_START'
export type TTurnDuring = 'TURN_DURING'
export type TTurnEnd = 'TURN_END'
export type TTurnOne = 'TURN_ONE'
export type TTurnTwo = 'TURN_TWO'
export type TTurnThree = 'TURN_THREE'
export type TTurnFour = 'TURN_FOUR'
export type TTurnFive = 'TURN_FIVE'
export type TGameEnd = 'GAME_END'

// Turn Exports
export const SETUP_START: TSetupStart = 'SETUP_START'
export const SETUP: TSetup = 'SETUP'
export const SETUP_END: TSetupEnd = 'SETUP_END'
export const GAME_START: TGameStart = 'GAME_START'
export const GAME_DURING: TGameDuring = 'GAME_DURING'
export const TURN_START: TTurnStart = 'TURN_START'
export const TURN_DURING: TTurnDuring = 'TURN_DURING'
export const TURN_END: TTurnEnd = 'TURN_END'
export const TURN_ONE: TTurnOne = 'TURN_ONE'
export const TURN_TWO: TTurnTwo = 'TURN_TWO'
export const TURN_THREE: TTurnThree = 'TURN_THREE'
export const TURN_FOUR: TTurnFour = 'TURN_FOUR'
export const TURN_FIVE: TTurnFive = 'TURN_FIVE'
export const GAME_END: TGameEnd = 'GAME_END'

// When
export type TTurnWhen =
  | TSetup
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
