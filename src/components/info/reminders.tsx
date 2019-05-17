import React, { Fragment } from 'react'

import { ITurnAction } from 'meta/turn_structure'
import { ISelections } from 'types/selections'
import { processReminders } from 'utils/processReminders'
import { TSupportedFaction } from 'meta/factions';
import './reminders.css'

const Reminders = (props: { factionName: TSupportedFaction; selections: ISelections }) => {
  let { factionName, selections } = props

  const reminders = processReminders(factionName, selections)

  return (
    <div className="Reminders">
      {Object.keys(reminders).map((key, i) => {
        return <Entry when={key} actions={reminders[key]} key={i} />
      })}
    </div>
  )
}

const Entry = (props: { when: string; actions: ITurnAction[] }) => {
  return (
    <div>
      <h2>{props.when.split('_').join(' ')}</h2>
      {props.actions.map((a, i) => {
        return (
          <Fragment key={i}>
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
