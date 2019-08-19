export type TChaos = 'Chaos'
export type TDeath = 'Death'
export type TDestruction = 'Destruction'
export type TOrder = 'Order'
export type TGrandAlliances = TChaos | TDeath | TDestruction | TOrder

export const CHAOS: TChaos = 'Chaos'
export const DEATH: TDeath = 'Death'
export const DESTRUCTION: TDestruction = 'Destruction'
export const ORDER: TOrder = 'Order'
export const GRAND_ALLIANCES: TGrandAlliances[] = [CHAOS, DEATH, DESTRUCTION, ORDER]

type TMarkKhorne = 'Khorne'
type TMarkNurgle = 'Nurgle'
type TMarkSlaanesh = 'Slaanesh'
type TMarkTzeentch = 'Tzeentch'
type TMarkUndivided = 'Undivided'
export type TMarksOfChaos = TMarkKhorne | TMarkNurgle | TMarkSlaanesh | TMarkTzeentch | TMarkUndivided

export const MARK_KHORNE: TMarkKhorne = 'Khorne'
export const MARK_NURGLE: TMarkNurgle = 'Nurgle'
export const MARK_SLAANESH: TMarkSlaanesh = 'Slaanesh'
export const MARK_TZEENTCH: TMarkTzeentch = 'Tzeentch'
export const MARK_UNDIVIDED: TMarkUndivided = 'Undivided'

export const MARKS_OF_CHAOS: TMarksOfChaos[] = [
  MARK_KHORNE,
  MARK_NURGLE,
  MARK_SLAANESH,
  MARK_TZEENTCH,
  MARK_UNDIVIDED,
]
