import React, { useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { visibility, selectors } from 'ducks'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { TTurnAction } from 'types/data'
import { IStore } from 'types/store'
import { TTurnWhen } from 'types/phases'
import { CardHeaderComponent } from './card'
import { useTheme } from 'context/useTheme'

interface IReminderProps {
  actions: TTurnAction[]
  hiddenReminders: string[]
  visibleWhens: TTurnWhen[]
  hideReminder: (value: string) => void
  hideWhen: (value: string) => void // dispatch
  isMobile: boolean
  showReminder: (value: string) => void
  showWhen: (value: string) => void // dispatch
  when: string
}

const ReminderComponent: React.FC<IReminderProps> = props => {
  const {
    actions,
    hiddenReminders,
    visibleWhens,
    hideReminder,
    hideWhen,
    isMobile,
    showReminder,
    showWhen,
    when,
  } = props

  const { theme } = useTheme()

  const hidden = useMemo(() => {
    return hiddenReminders.filter(name => name.includes(when))
  }, [hiddenReminders, when])

  const title = useMemo(() => titleCase(when), [when])
  const isVisible = useMemo(() => !!visibleWhens.find(w => title === w), [visibleWhens, title])
  const isPrintable = useMemo(() => hidden.length !== actions.length, [hidden.length, actions.length])

  useEffect(() => {
    if (!isMobile) showWhen(title) // Auto-open reminders on desktop
  }, [isMobile, title, showWhen])

  const handleShowWhen = useCallback(() => {
    showWhen(title)
  }, [title, showWhen])

  const bodyClass = `${theme.cardBody} ${isVisible ? `` : `d-none d-print-block`} ReminderCardBody`

  return (
    <div className={`row d-block PageBreak ${!isPrintable ? `d-print-none` : ``}`}>
      <div className="card border-dark my-2 mx-1">
        <CardHeaderComponent
          title={title}
          showCard={handleShowWhen}
          hideCard={hideWhen}
          isVisible={isVisible}
          headerClassName={`${theme.reminderHeader} text-white`}
          iconSize={1.2}
          isMobile={isMobile}
        />
        <div className={bodyClass}>
          {actions.map((action, i) => {
            const name = `${when}_${action.condition}_${action.name}`.split(' ').join('_')
            const showEntry = () => showReminder(name)
            const hideEntry = () => hideReminder(name)
            const isHidden = !!hidden.find(k => name === k)

            return (
              <ActionText
                {...action}
                isVisible={!isHidden}
                hideEntry={hideEntry}
                showEntry={showEntry}
                key={name}
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
  hiddenReminders: selectors.getReminders(state),
  visibleWhens: selectors.getWhen(state),
})

const mapDispatchToProps = {
  hideReminder: visibility.actions.addReminder,
  hideWhen: visibility.actions.deleteWhen,
  showReminder: visibility.actions.deleteReminder,
  showWhen: visibility.actions.addWhen,
}

export const Reminder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReminderComponent)

interface IActionTextProps extends TTurnAction {
  hideEntry: () => void
  showEntry: () => void
  isVisible: boolean
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, showEntry, hideEntry } = props

  const handleVisibility = () => (!isVisible ? showEntry() : hideEntry())

  return (
    <div className={`mb-2 ${!isVisible ? `d-print-none` : ``}`}>
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

const ActionTitle = (props: IActionTextProps) => {
  const { theme } = useTheme()

  return (
    <>
      <span className={`${theme.textMuted} font-weight-bold`}>{getActionTitle(props)} - </span>
      <strong className={theme.text}>
        {props.name && `${props.name}`}
        {props.tag && ` (${props.tag})`}
      </strong>
    </>
  )
}

const ActionDescription = (props: { text: string }) => {
  const { theme } = useTheme()

  const splitText = props.text
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  return (
    <>
      {splitText.map((text, i) => (
        <p className={`EntryText ${theme.text}`} key={i}>
          {text}
        </p>
      ))}
    </>
  )
}
