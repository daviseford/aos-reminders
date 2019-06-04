import React, { useMemo } from 'react'
import './reminders.css'
import { ITurnAction } from 'meta/turn_structure'
import { TSupportedFaction } from 'meta/factions'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/titleCase'
import { ISelections } from 'types/selections'
import { IArmy } from 'types/army'

interface IRemindersProps {
  army: IArmy
  factionName: TSupportedFaction
  selections: ISelections
  realmscape: string
}

const Reminders = (props: IRemindersProps) => {
  const { factionName, selections, army, realmscape } = props
  const reminders = useMemo(() => {
    return processReminders(army, factionName, selections, realmscape)
  }, [army, factionName, selections, realmscape])

  return (
    <div className="row w-75 mx-auto pt-5 d-block">
      <PrintRemindersButton />

      <div>
        {Object.keys(reminders).map((key, i) => {
          return <Entry when={key} actions={reminders[key]} key={i} />
        })}
      </div>
    </div>
  )
}

const PrintRemindersButton = () => {
  return (
    <div className="row ml-auto d-flex justify-content-end d-print-none">
      <button className="btn btn-primary" onClick={() => window.print()}>PRINT</button>
    </div>
  )
}

const Entry = (props: { when: string; actions: ITurnAction[] }) => {
  return (
    <div className="row d-block">
      <div className="card border-dark my-3">
        <div className="card-header text-center">
          <h4 className="ReminderHeader">{titleCase(props.when)}</h4>
        </div>
        <div className="card-body">
          {props.actions.map((action, i) => (
            <ActionText {...action} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ActionText = (props: ITurnAction) => {
  const { name, action, condition } = props
  return (
    <>
      <p className="ReminderEntry mb-2">
        <span className="text-muted font-weight-bold">{condition} - </span>
        {name ? <b>{name}</b> : null}
        <br />
        {action}
      </p>
    </>
  )
}

export default Reminders
