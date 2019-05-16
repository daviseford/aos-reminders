import { TTurnWhen } from './meta'

export interface IEffects {
  name?: string
  desc: string
  when: TTurnWhen[]
}

export interface IArtifacts {
  [artifact: string]: {
    name: string
    effects: IEffects[]
  }
}

export interface IBattalions {
  [battalion: string]: {
    name: string
    effects: IEffects[]
  }
}

export interface ICommandTraits {
  [trait: string]: {
    [unit: string]: {
      desc: string
      when: TTurnWhen[]
    }
  }
}

export interface IUnit {
  name: string
  models: string
  desc: string
  tags?: string[]
}

export interface IMonster {
  name: string
  desc: string
  tags?: string[]
}
export interface IHero {
  name: string
  desc: string
  tags?: string[]
}

export interface IBattalion {
  name: string
  desc: string
}

export interface IArmy {
  heroes: IHero[]
  units: IUnit[]
  monsters: IMonster[]
  battalions: IBattalion[]
}
