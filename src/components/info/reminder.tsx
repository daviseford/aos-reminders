import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import withSizes from 'react-sizes'
import './reminders.css'
import { visibility } from 'ducks'
import { titleCase } from 'utils/titleCase'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { TTurnAction } from 'types/data'
import { IStore } from 'types/store'
import { TTurnWhen } from 'types/phases'
import { CardHeaderComponent } from './card'

interface IReminderProps {
  actions: TTurnAction[]
  hiddenReminders: string[]
  hiddenWhen: TTurnWhen[]
  hideOthers: (value: string) => void
  hideReminder: (value: string) => void
  hideWhen: (value: string) => void // dispatch
  idx: number
  isMobile: boolean
  showReminder: (value: string) => void
  showWhen: (value: string) => void // dispatch
  when: string
}

const ReminderComponent: React.FC<IReminderProps> = props => {
  const {
    actions,
    hiddenReminders,
    hiddenWhen,
    hideOthers,
    hideReminder,
    hideWhen,
    idx,
    isMobile,
    showReminder,
    showWhen,
    when,
  } = props

  const hidden = useMemo(() => {
    return hiddenReminders.filter(name => name.includes(when))
  }, [hiddenReminders, when])

  const title = useMemo(() => titleCase(when), [when])

  useEffect(() => {
    if (isMobile && idx > 0) hideWhen(title) // Hide initially on Mobile
    return () => {
      showWhen(title) // un-hide when component unloads
    }
    // eslint-disable-next-line
  }, [])

  const isCollapsed = useMemo(() => !!hiddenWhen.find(w => title === w), [hiddenWhen, title])

  const handleShowWhen = useCallback(() => {
    showWhen(title)
    if (isMobile) {
      hideOthers(title)
    }
  }, [title, showWhen, hideOthers, isMobile])

  return (
    <div className={`row d-block PageBreak ${hidden.length === actions.length && `d-print-none`}`}>
      <div className="card border-dark my-2 mx-1">
        <CardHeaderComponent
          title={title}
          showCard={handleShowWhen}
          hideCard={hideWhen}
          isVisible={!isCollapsed}
          headerClassName={`ReminderHeader`}
          iconSize={1.2}
        />
        <div className={`card-body ${isCollapsed ? `d-none` : ``}`}>
          {actions.map((action, i) => {
            const name = `${when}_${action.name}`
            const showEntry = () => showReminder(name)
            const hideEntry = () => hideReminder(name)
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
  hiddenReminders: visibility.selectors.getReminders(state),
  hiddenWhen: visibility.selectors.getWhen(state),
})

const mapDispatchToProps = {
  hideReminder: visibility.actions.addReminder,
  hideWhen: visibility.actions.addWhen,
  showReminder: visibility.actions.deleteReminder,
  showWhen: visibility.actions.deleteWhen,
}

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 480,
})

const ReminderWithSize = withSizes(mapSizesToProps)(ReminderComponent)

export const Reminder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReminderWithSize)

const getActionTitle = ({
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
          <ActionTitle {...props} />
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} />
        </div>
      </div>

      {isVisible && <ActionDescription text={desc} />}
    </div>
  )
}

const ActionTitle = (props: IActionTextProps) => (
  <>
    <span className="text-muted font-weight-bold">{getActionTitle(props)} - </span>
    <b>
      {props.name && `${props.name}`}
      {props.tag && ` (${props.tag})`}
    </b>
  </>
)

const ActionDescription = (props: { text: string }) => {
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
