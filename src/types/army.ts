import { TTurnWhen } from './meta'

export interface IArtifacts {
  [key: string]: {
    desc: string
    when: TTurnWhen[]
  }
}

export interface IArmy {
  heroes: {
    name: string
    wounds: string
    desc: string
    points: string
  }[]
  units: {
    name: string
    wounds: string
    models: string
    desc: string
    points: string
  }[]
  monsters: {
    name: string
    wounds: string
    desc: string
    points: string
  }[]
  formations: {
    name: string
    desc: string
    points: string
  }[]
}
