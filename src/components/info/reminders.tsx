import React, { useState, Fragment } from 'react'
import { isArray, isPlainObject } from 'lodash'

import * as SeraphonArmy from '../../army/seraphon/index'
import { ITurnAction } from 'meta/turn_structure'
import { jsxExpressionContainer } from '@babel/types'
import { TTurnWhen } from 'types/meta'

const getArmyObj = (name = 'SERAPHON') => {
  return {
    SERAPHON: { ...SeraphonArmy },
  }[name]
}

const sampleArmyName = 'SERAPHON'
const armyObj = getArmyObj('SERAPHON')

const { Units, Artifacts, Battalions } = SeraphonArmy

const sampleSelections = {
  units: [Units.ENGINE_OF_THE_GODS, Units.RIPPERDACTYLS, Units.LORD_KROAK],
  artifacts: [Artifacts.PRISM_OF_AMYNTOK.name],
  battalions: [Battalions.SHADOWSTRIKE_STARHOST.name],
}

const processReminders = (army = sampleArmyName, selections = sampleSelections) => {
  const game = getArmyObj(army).Game
  const conds = Object.values(selections).reduce((a, b) => a.concat(b), [])
  //   debugger

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
    //   debugger
      // Is a turn object
      // TODO
    }
    return accum
  }, [])

  return reminders
}

const Reminders = (props: { army: string }) => {
  // const [armyName, ]

  return (
    <Fragment>
      {JSON.stringify(
        // getArmyList(props.army)
        processReminders(props.army, sampleSelections)
      )}
    </Fragment>
  )
}

export default Reminders
