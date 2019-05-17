import React, { Fragment } from 'react'

import * as SeraphonArmy from '../../army/seraphon/index'
import { ITurnAction } from 'meta/turn_structure'
import { ISelections } from 'types/selections'
import { processReminders } from 'utils/processReminders'

const { Units, Artifacts, Battalions } = SeraphonArmy

const sampleSelections: ISelections = {
  units: [Units.ENGINE_OF_THE_GODS.name, Units.RIPPERDACTYLS.name, Units.LORD_KROAK.name],
  artifacts: [Artifacts.PRISM_OF_AMYNTOK.name],
  battalions: [Battalions.SHADOWSTRIKE_STARHOST.name],
}

const Reminders = (props: { army: string; selections?: ISelections }) => {
  let { army = 'SERAPHON', selections = sampleSelections } = props

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
            <p>
              {a.name ? <b>{a.name}: </b> : null}
              {a.action}
            </p>
            <small>Because you have: {a.condition.join(', ')}</small>
          </Fragment>
        )
      })}
    </div>
  )
}

export default Reminders
