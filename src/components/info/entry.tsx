import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import './reminders.css'
import { visibility } from 'ducks'
import { titleCase } from 'utils/titleCase'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { TTurnAction } from 'types/data'
import { IStore } from 'types/store'

interface IEntryProps {
  actions: TTurnAction[]
  addReminder: (value: string) => void
  deleteReminder: (value: string) => void
  reminders: string[]
  when: string
}

const EntryComponent: React.FC<IEntryProps> = props => {
  const { when, actions, addReminder, deleteReminder, reminders } = props

  const hidden = useMemo(() => {
    return reminders.filter(name => name.includes(when))
  }, [reminders, when])

  return (
    <div className={`row d-block PageBreak ${hidden.length === actions.length && `d-print-none`}`}>
      <div className="card border-dark my-3 mx-1">
        <div className="card-header text-center ReminderHeader">
          <h4 className="ReminderH4">{titleCase(when)}</h4>
        </div>
        <div className="card-body">
          {actions.map((action, i) => {
            const name = `${when}_${action.name}`
            const showEntry = () => deleteReminder(name)
            const hideEntry = () => addReminder(name)
            const isHidden = !!hidden.find(k => name === k)

            return (
              <ActionText
                {...action}
                isVisible={!isHidden}
                hideEntry={hideEntry}
                showEntry={showEntry}
                key={i}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  reminders: visibility.selectors.getReminders(state),
})

const mapDispatchToProps = {
  addReminder: visibility.actions.addReminder,
  deleteReminder: visibility.actions.deleteReminder,
}

export const Entry = connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryComponent)

const getTitle = ({
  artifact,
  command_ability,
  command_trait,
  condition,
  endless_spell,
  name,
  scenery,
  spell,
  triumph,
}: TTurnAction): string => {
  const suffix = name === condition ? `` : `: ${condition}`
  if (artifact) return `Artifact${suffix}`
  if (command_ability) return `Command Ability${suffix}`
  if (command_trait) return `Command Trait${suffix}`
  if (endless_spell) return `Endless Spell${suffix}`
  if (scenery) return `Scenery${suffix}`
  if (spell) return `Spell${suffix}`
  if (triumph) return `Triumph${suffix}`
  return condition
}

interface IActionTextProps extends TTurnAction {
  hideEntry: () => void
  showEntry: () => void
  isVisible: boolean
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, showEntry, hideEntry } = props

  const handleVisibility = e => {
    e.preventDefault()
    !isVisible ? showEntry() : hideEntry()
  }

  useEffect(() => {
    return () => {
      showEntry() // Remove this from the hidden array on unload
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={`mb-2 ${!isVisible && `d-print-none`}`}>
      <div className="d-flex mb-1">
        <div className="flex-grow-1">
          <EntryTitle {...props} />
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} />
        </div>
      </div>

      {isVisible && <EntryDescription text={desc} />}
    </div>
  )
}

const EntryTitle = (props: IActionTextProps) => (
  <>
    <span className="text-muted font-weight-bold">{getTitle(props)} - </span>
    <b>
      {props.name && `${props.name}`}
      {props.tag && ` (${props.tag})`}
    </b>
  </>
)

const EntryDescription = (props: { text: string }) => {
  const splitText = props.text
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  return (
    <>
      {splitText.map((text, i) => (
        <p className="EntryText" key={i}>
          {text}
        </p>
      ))}
    </>
  )
}
