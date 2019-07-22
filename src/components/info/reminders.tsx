import React, { useMemo, useState } from 'react'
import './reminders.css'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/titleCase'
import { TSupportedFaction } from 'meta/factions'
import { ISelections, IAllySelections } from 'types/selections'
import { IArmy } from 'types/army'
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
  const [numVisible, setNumVisible] = useState(props.actions.length)
  const showEntry = () => setNumVisible(numVisible + 1)
  const hideEntry = () => setNumVisible(numVisible - 1)

  return (
    <div className={`row d-block PageBreak ${!numVisible && `d-print-none`}`}>
      <div className="card border-dark my-3">
        <div className="card-header text-center">
          <h4 className="ReminderHeader">{titleCase(props.when)}</h4>
        </div>
        <div className="card-body">
          {props.actions.map((action, i) => (
            <ActionText {...action} key={i} showEntry={showEntry} hideEntry={hideEntry} />
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

const VisibilityToggle = (props: { isVisible: boolean; setVisibility: (e) => void }) => {
  const { isVisible, setVisibility } = props
  const VisibilityComponent = isVisible ? MdVisibility : MdVisibilityOff
  const hideTip = `${isVisible ? `Hidden rules` : `This rule`} will not be printed.`
  return (
    <>
      <VisibilityComponent onClick={setVisibility} data-tip={hideTip} />
      <ReactTooltip place="bottom" type="light" effect="float" />
    </>
  )
}

interface IActionTextProps extends ITurnAction {
  hideEntry: () => void
  showEntry: () => void
}

const ActionText = (props: IActionTextProps) => {
  const { name, desc, command_ability, tag, showEntry, hideEntry } = props
  const [isVisible, setIsVisibile] = useState(true)
  const handleVisibility = e => {
    e.preventDefault()
    setIsVisibile(!isVisible)
    !isVisible ? showEntry() : hideEntry()
  }

  return (
    <div className={`ReminderEntry mb-2 ${!isVisible && `d-print-none`}`}>
      <div className="d-flex">
        <div className="flex-grow-1">
          <span className="text-muted font-weight-bold">{getTitle(props)} - </span>
          <b>
            {command_ability && `Command Ability: `}
            {name && `${name}`}
            {tag && ` (${tag})`}
          </b>
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} />
        </div>
      </div>

      {isVisible && desc}
    </div>
  )
}

export default Reminders
