import { ITurnAction } from 'meta/turn_structure'
import { isArray, isPlainObject } from 'lodash'

// Armies
import * as SeraphonArmy from '../army/seraphon/index'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { IEffects } from 'types/data'

export interface IReminder {
  [key: string]: ITurnAction[]
}

const getArmy = (name: TSupportedFaction) => {
  return {
    SERAPHON: { ...SeraphonArmy },
  }[name]
}

export const processReminders = (factionName: TSupportedFaction, selections: ISelections): IReminder => {
  const armyObj = getArmy(factionName)
  const game = armyObj.Game
  const conds = Object.values(selections).reduce((a, b) => a.concat(b), [])

  const reminders = Object.keys(game).reduce((accum, key) => {
    const x = game[key]
    const addToAccum = (arr: ITurnAction[], when: string[]) => {
      arr.forEach((y: ITurnAction) => {
        const c = y.condition.filter((z: string) => conds.includes(z))
        if (c.length) {
          const e = { ...y, condition: c }
          if (when.length === 1) {
            accum[when[0]] = accum[when[0]] ? [...accum[when[0]], e] : [e]
          } else {
            const k = `${when[0]} - ${when[1]}`
            accum[k] = accum[k] ? [...accum[k], e] : [e]
          }
        }
      })
    }
    if (isArray(x) && x.length) {
      addToAccum(x, [key])
    } else if (isPlainObject(x)) {
      const turn = key
      Object.keys(x).forEach(phase => {
        const y = x[phase]
        addToAccum(y, [turn, phase])
      })
    }
    return accum
  }, {})

  // Add Abilities ()
  if (armyObj.Abilities && armyObj.Abilities.length) {
    armyObj.Abilities.forEach((a: IEffects) => {
      const t: ITurnAction = {
        name: a.name,
        action: a.desc,
        condition: [factionName],
      }
      if (a.when.length === 1) {
        reminders[a.when[0]] = reminders[a.when[0]] ? [...reminders[a.when[0]], t] : [t]
      } else {
        const k = `${a.when[0]} - ${a.when[1]}`
        reminders[k] = reminders[k] ? [...reminders[k], t] : [t]
      }
    })
  }

  return reminders
}
