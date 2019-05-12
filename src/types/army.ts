import { TTurnWhen } from './meta'

export interface IArtifacts {
  [artifact: string]: {
    desc: string
    when: TTurnWhen[]
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

export interface IArmy {
  heroes: {
    name: string
    desc: string
    tags?: string[]
  }[]
  units: {
    name: string
    models: string
    desc: string
    tags?: string[]
  }[]
  monsters: {
    name: string
    desc: string
    tags?: string[]
  }[]
  formations: {
    name: string
    desc: string
  }[]
}
