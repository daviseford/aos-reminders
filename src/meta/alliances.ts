export type TChaos = 'CHAOS'
export type TDeath = 'DEATH'
export type TDestruction = 'DESTRUCTION'
export type TOrder = 'ORDER'
export type TGrandAlliances = TChaos | TDeath | TDestruction | TOrder

export const CHAOS: TChaos = 'CHAOS'
export const DEATH: TDeath = 'DEATH'
export const DESTRUCTION: TDestruction = 'DESTRUCTION'
export const ORDER: TOrder = 'ORDER'
export const GRAND_ALLIANCES: TGrandAlliances[] = [CHAOS, DEATH, DESTRUCTION, ORDER]
