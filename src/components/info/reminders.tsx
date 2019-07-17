import React, { useMemo } from 'react'
import './reminders.css'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/titleCase'
import { ISelections, IAllySelections } from 'types/selections'
import { IArmy } from 'types/army'
import { TSupportedFaction } from 'meta/factions'
import { ITurnAction } from 'types/data'

interface IRemindersProps {
  allyArmy: IArmy
  allySelections: IAllySelections
  army: IArmy
  factionName: TSupportedFaction
  realmscape: string
  selections: ISelections
}

const Reminders = (props: IRemindersProps) => {
  const { factionName, selections, army, realmscape, allyArmy, allySelections } = props
  const reminders = useMemo(() => {
    return processReminders(army, factionName, selections, realmscape, allyArmy, allySelections)
  }, [army, factionName, selections, realmscape, allyArmy, allySelections])

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

const getTitle = ({
  allegiance_ability,
  artifact,
  condition,
  name,
  command_trait,
  command_ability,
}: ITurnAction): string => {
  if (artifact) return `Artifact${name === condition ? `` : `: ${condition}`}`
  if (allegiance_ability || command_ability) return condition
  if (command_trait) return `Command Trait`
  return condition
}

const ActionText = (props: ITurnAction) => {
  const { name, desc, command_ability, tag } = props
  return (
    <>
      <p className="ReminderEntry mb-2">
        <span className="text-muted font-weight-bold">{getTitle(props)} - </span>
        <b>
          {command_ability && `Command Ability: `}
          {name && `${name}`}
          {tag && ` (${tag})`}
        </b>
        <br />
        {desc}
      </p>
    </>
  )
}

export default Reminders
