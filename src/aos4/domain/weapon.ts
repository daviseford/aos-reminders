import type { DomainEntity } from './entity'

export type WeaponType = 'melee' | 'ranged'

export type KnownWeaponKeyword =
  | 'anti'
  | 'charge'
  | 'companion'
  | 'crit-two-hits'
  | 'crit-auto-wound'
  | 'crit-mortal'
  | 'shoot-in-combat'

export interface WeaponKeyword {
  kind: KnownWeaponKeyword | 'other'
  raw: string
  target?: string
  modifier?: string
}

export interface WeaponProfile {
  rangeInches?: number
  attacks: string
  hit: string
  wound: string
  rend: string
  damage: string
}

export interface Weapon extends DomainEntity<'weapon'> {
  weaponType: WeaponType
  profile: WeaponProfile
  keywords: WeaponKeyword[]
}
