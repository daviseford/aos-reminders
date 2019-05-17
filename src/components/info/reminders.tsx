import React, { useState, Fragment } from 'react'
import { isArray, isPlainObject } from 'lodash'

import * as SeraphonArmy from '../../army/seraphon/index'
import { ITurnAction } from 'meta/turn_structure'
import { TTurnWhen } from 'types/meta'

const getArmyObj = (name = 'SERAPHON') => {
  return {
    SERAPHON: { ...SeraphonArmy },
  }[name]
}

const sampleArmyName = 'SERAPHON'
const armyObj = getArmyObj('SERAPHON')

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

interface IReminder extends ITurnAction {
  when: TTurnWhen[]
}

const processReminders = (army = sampleArmyName, selections = sampleSelections): IReminder[] => {
  const game = getArmyObj(army).Game
  const conds = Object.values(selections).reduce((a, b) => a.concat(b), [])

  const reminders = Object.keys(game).reduce((accum: any[], key) => {
    const x = game[key]
    const addToAccum = (arr: ITurnAction[], when: string[]) => {
      arr.forEach((y: ITurnAction) => {
        if (y.condition.some((z: string) => conds.includes(z))) {
          accum.push({ ...y, when })
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
  }, [])

  return reminders
}

const Reminders = (props: { army: string; selections?: ISelections }) => {
  let { army, selections = sampleSelections } = props

  const reminders = processReminders(army, selections)

  return (
    <Fragment>
      {reminders.map(r => {
        return (
          <div>
            <h2>{r.when}</h2>
            <p>{r.action}</p>
            <small>Because you have: {r.condition}</small>
          </div>
        )
      })}
    </Fragment>
  )
}

export default Reminders
