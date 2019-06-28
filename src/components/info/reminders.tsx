import React, { useMemo } from 'react'
import './reminders.css'
import { ITurnAction } from 'meta/turn_structure'
import { TSupportedFaction } from 'meta/factions'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/titleCase'
import { ISelections } from 'types/selections'
import { IArmy } from 'types/army'
import PrintButton from 'components/print/button'

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
    <div className="row w-75 mx-auto mt-3 d-block">
      <div>
        {Object.keys(reminders).map((key, i) => {
          return <Entry when={key} actions={reminders[key]} key={i} idx={i} factionName={factionName} />
        })}
      </div>
    </div>
  )
}

const Entry = (props: { when: string; actions: ITurnAction[]; idx: number; factionName: TSupportedFaction }) => {
  return (
    <div className="row d-block PageBreak">
      <div className="card border-dark my-3">
        <div className="card-header text-center">
          <h4 className="ReminderHeader">{titleCase(props.when)}</h4>
          {props.idx === 0 ? <PrintButton factionName={props.factionName} /> : null}
        </div>
        <div className="card-body">
          {props.actions.map((action, i) => (
            <ActionText {...action} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ActionText = (props: ITurnAction) => {
  const { name, action, condition, command, tag } = props
  return (
    <>
      <p className="ReminderEntry mb-2">
        <span className="text-muted font-weight-bold">{condition} - </span>
        <b>
          {command && `Command Ability: `}
          {name && `${name}`}
          {tag && ` (${tag})`}
        </b>
        <br />
        {action}
      </p>
    </>
  )
}

export default Reminders
