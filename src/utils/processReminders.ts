import { ITurnAction, Game } from 'meta/turn_structure'

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
    const addToAccum = (actions: ITurnAction[], when: string) => {
      actions.forEach((y: ITurnAction) => {
        const c = y.condition.filter((z: string) => conds.includes(z))
        if (c.length) {
          const e = { ...y, condition: c }
          accum[when] = accum[when] ? [...accum[when], e] : [e]
        }
      })
    }
    if (x.length) {
      addToAccum(x, key)
    }
    return accum
  }, {})

  // Add Abilities
  if (armyObj.Abilities && armyObj.Abilities.length) {
    armyObj.Abilities.forEach((a: IEffects) => {
      const t: ITurnAction = {
        name: a.name,
        action: a.desc,
        condition: [factionName],
      }
      reminders[a.when] = reminders[a.when] ? [...reminders[a.when], t] : [t]
    })
  }

  // Last step, we need to sort by the original order
  const ordered = Object.keys(Game).reduce((accum, key) => {
    if (reminders[key]) {
      accum[key] = reminders[key]
    }
    return accum
  }, {})

  return ordered
}
