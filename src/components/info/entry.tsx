import React, { useMemo, useEffect } from 'react'
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

interface IEntryProps {
  actions: TTurnAction[]
  hiddenReminders: string[]
  hiddenWhen: TTurnWhen[]
  hideOthers: (value: string) => void
  hideReminder: (value: string) => void
  hideWhen: (value: string) => void // dispatch
  isMobile: boolean
  showReminder: (value: string) => void
  showWhen: (value: string) => void // dispatch
  when: string
}

const EntryComponent: React.FC<IEntryProps> = props => {
  const {
    actions,
    hiddenReminders,
    hiddenWhen,
    hideOthers,
    hideReminder,
    hideWhen,
    isMobile,
    showReminder,
    showWhen,
    when,
  } = props

  const hidden = useMemo(() => {
    return hiddenReminders.filter(name => name.includes(when))
  }, [hiddenReminders, when])

  useEffect(() => {
    return () => {
      showWhen(when) // un-hide when component unloads
    }
    // eslint-disable-next-line
  }, [])

  const title = useMemo(() => titleCase(when), [when])
  const isCollapsed = useMemo(() => !!hiddenWhen.find(w => title === w), [hiddenWhen, title])

  const handleShowWhen = () => {
    showWhen(title)
    if (isMobile) {
      hideOthers(title)
    }
  }

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

const withSize = withSizes(mapSizesToProps)(EntryComponent)

export const Entry = connect(
  mapStateToProps,
  mapDispatchToProps
)(withSize)

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
