import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { visibility, selectors } from 'ducks'
import { useTheme } from 'context/useTheme'
import { useAppStatus } from 'context/useAppStatus'
import { hashReminder } from 'utils/reminderUtils'
import { titleCase, getActionTitle } from 'utils/textUtils'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { CardHeaderComponent } from 'components/info/card'
import { TTurnAction } from 'types/data'
import { IStore } from 'types/store'
import { TTurnWhen } from 'types/phases'

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

interface TActionWithId extends TTurnAction {
  id: string
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
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

  const getActionWithId = useMemo(() => {
    return actions.map(x => ({ ...x, id: hashReminder(when, x) }))
  }, [actions, when])

  const [actionsWithId, setActionsWithId] = useState<TActionWithId[]>(getActionWithId)

  useEffect(() => {
    setActionsWithId(actions.map(x => ({ ...x, id: hashReminder(when, x) })))
  }, [actions, when])

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) return
      if (result.destination.index === result.source.index) return

      const newState = reorder(actionsWithId, result.source.index, result.destination.index)

      setActionsWithId(newState)
    },
    [actionsWithId]
  )

  useEffect(() => {
    if (!isMobile) showWhen(title) // Auto-open reminders on desktop
  }, [isMobile, title, showWhen])

  const handleShowWhen = useCallback(() => {
    showWhen(title)
  }, [title, showWhen])

  const bodyClass = `${theme.cardBody} ${isVisible ? `` : `d-none d-print-block`} ReminderCardBody`

  console.log(actionsWithId)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`row d-block PageBreak ${!isPrintable ? `d-print-none` : ``}`}
          >
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
                {actionsWithId.map((action, i) => {
                  const showEntry = () => showReminder(action.id)
                  const hideEntry = () => hideReminder(action.id)
                  const isHidden = !!hidden.find(k => action.id === k)

                  return (
                    <Draggable draggableId={action.id} index={i} key={action.id}>
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ActionText
                            {...action}
                            isVisible={!isHidden}
                            hideEntry={hideEntry}
                            showEntry={showEntry}
                            key={action.id}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
              </div>
            </div>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
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

export const Reminder = connect(mapStateToProps, mapDispatchToProps)(ReminderComponent)

interface IActionTextProps extends TTurnAction {
  actionTitle?: string
  hideEntry: () => void
  showEntry: () => void
  isVisible: boolean
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, showEntry, hideEntry } = props
  const { isGameMode } = useAppStatus()

  const handleVisibility = () => (!isVisible ? showEntry() : hideEntry())

  return (
    <div className={`mb-2 ${!isVisible ? `d-print-none` : ``}`}>
      <div className="d-flex mb-1">
        <div className="flex-grow-1">
          <ActionTitle {...props} />
        </div>
        <div className="px-2 d-print-none">
          {isGameMode ? (
            <VisibilityToggle
              isVisible={isVisible}
              setVisibility={handleVisibility}
              withConfirmation={true}
              type="clear"
              size={1}
            />
          ) : (
            <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} />
          )}
        </div>
      </div>

      {isVisible && <ActionDescription text={desc} />}
    </div>
  )
}

const ActionTitle = ({ actionTitle, name, tag }: IActionTextProps) => {
  const { theme } = useTheme()
  const titleStr = actionTitle ? `${actionTitle} - ` : ''

  return (
    <>
      <span className={`${theme.textMuted} font-weight-bold`}>{titleStr}</span>
      <strong className={theme.text}>
        {name}
        {tag && ` (${tag})`}
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
