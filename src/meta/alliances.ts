import {
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  ORDER_GRAND_ALLIANCE,
} from 'meta/factions'

type TChaos = 'Chaos'
type TDeath = 'Death'
type TDestruction = 'Destruction'
type TOrder = 'Order'
export type TGrandAlliances = TChaos | TDeath | TDestruction | TOrder

export const CHAOS: TChaos = 'Chaos'
export const DEATH: TDeath = 'Death'
export const DESTRUCTION: TDestruction = 'Destruction'
export const ORDER: TOrder = 'Order'

export type TGrandAllianceFactions =
  | 'CHAOS_GRAND_ALLIANCE'
  | 'DEATH_GRAND_ALLIANCE'
  | 'DESTRUCTION_GRAND_ALLIANCE'
  | 'ORDER_GRAND_ALLIANCE'

export const GRAND_ALLIANCE_FACTIONS: TGrandAllianceFactions[] = [
  CHAOS_GRAND_ALLIANCE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  ORDER_GRAND_ALLIANCE,
]

type TMarkKhorne = 'Khorne'
type TMarkNurgle = 'Nurgle'
type TMarkSlaanesh = 'Slaanesh'
type TMarkTzeentch = 'Tzeentch'
type TMarkUndivided = 'Undivided'

export const MARK_KHORNE: TMarkKhorne = 'Khorne'
export const MARK_NURGLE: TMarkNurgle = 'Nurgle'
export const MARK_SLAANESH: TMarkSlaanesh = 'Slaanesh'
export const MARK_TZEENTCH: TMarkTzeentch = 'Tzeentch'
export const MARK_UNDIVIDED: TMarkUndivided = 'Undivided'
