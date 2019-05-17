import React, { Fragment } from 'react'
import { isArray, isPlainObject } from 'lodash'

import * as SeraphonArmy from '../../army/seraphon/index'
import { ITurnAction } from 'meta/turn_structure'

const getArmyObj = (name = 'SERAPHON') => {
  return {
    SERAPHON: { ...SeraphonArmy },
  }[name]
}

const sampleArmyName = 'SERAPHON'
// const armyObj = getArmyObj('SERAPHON')

const { Units, Artifacts, Battalions } = SeraphonArmy

interface ISelections {
  units: string[]
  artifacts: string[]
  battalions: string[]
}
const sampleSelections = {
  units: [Units.ENGINE_OF_THE_GODS, Units.RIPPERDACTYLS, Units.LORD_KROAK],
  artifacts: [Artifacts.PRISM_OF_AMYNTOK.name],
  battalions: [Battalions.SHADOWSTRIKE_STARHOST.name],
}

// interface IReminder extends ITurnAction {
//   when: TTurnWhen[]
// }

interface IReminder {
  [key: string]: ITurnAction[]
}

const processReminders = (army = sampleArmyName, selections = sampleSelections): IReminder => {
  const game = getArmyObj(army).Game
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

  return reminders
}

const Reminders = (props: { army: string; selections?: ISelections }) => {
  let { army, selections = sampleSelections } = props

  const reminders = processReminders(army, selections)

  return (
    <Fragment>
      {Object.keys(reminders).map(key => {
        return <Entry when={key} actions={reminders[key]} />
      })}
    </Fragment>
  )
}

const Entry = (props: { when: string; actions: ITurnAction[] }) => {
  return (
    <div>
      <h2>{props.when.split('_').join(' ')}</h2>
      {props.actions.map(a => {
        return (
          <Fragment>
            <p>{a.action}</p>
            <small>Because you have: {a.condition.join(', ')}</small>
          </Fragment>
        )
      })}
    </div>
  )
}

export default Reminders
