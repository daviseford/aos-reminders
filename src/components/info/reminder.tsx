import { CardHeaderComponent } from 'components/info/card'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { selectors, visibility } from 'ducks'
import { isEqual, sortBy } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { TTurnAction } from 'types/data'
import { TTurnWhen } from 'types/phases'
import { IStore } from 'types/store'
import { LocalReminderOrder } from 'utils/localStore'
import { reorder, reorderViaIndex } from 'utils/reorder'
import { titleCase } from 'utils/textUtils'

interface IReminderProps {
  actions: TTurnAction[]
  hiddenReminders: string[]
  visibleWhens: TTurnWhen[]
  hideReminder: (value: string) => void
  hideWhen: (value: string) => void // dispatch
  isMobile: boolean
  showReminder: (value: string) => void
  showWhen: (value: string) => void // dispatch
  when: TTurnWhen
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
    return hiddenReminders.filter(id => id.includes(when))
  }, [hiddenReminders, when])

  const title = useMemo(() => titleCase(when), [when])
  const isVisible = useMemo(() => !!visibleWhens.find(w => title === w), [visibleWhens, title])
  const isPrintable = useMemo(() => hidden.length !== actions.length, [hidden, actions])

  const [actionsState, setActionsState] = useState<TTurnAction[]>(actions)

  const onDragEnd = useCallback(
    result => {
      if (!result.destination) return
      if (result.destination.index === result.source.index) return

      const orderedActions: TTurnAction[] = reorder(
        actionsState,
        result.source.index,
        result.destination.index
      )
      const ids = orderedActions.map(x => x.id)

      setActionsState(orderedActions)
      LocalReminderOrder.set(when, ids)
    },
    [actionsState, when]
  )

  useEffect(() => {
    if (!isMobile) showWhen(title) // Auto-open reminders on desktop
  }, [isMobile, title, showWhen])

  const handleShowWhen = useCallback(() => {
    showWhen(title)
  }, [title, showWhen])

  useEffect(() => {
    // If we've previously dragged some reminders around,
    // and the stored reminder order has the same ids as our current actions
    // Go ahead and set the actionState to be ordered properly
    const currentIds = sortBy(actions.map(x => x.id))
    const storedIds = LocalReminderOrder.getWhen(when) || []

    if (storedIds.length > 0 && isEqual(currentIds, sortBy(storedIds))) {
      const reordered = reorderViaIndex(actions, storedIds)
      setActionsState(reordered)
    } else {
      setActionsState(actions)
    }
  }, [actions, when])

  const bodyClass = `${theme.cardBody} ${isVisible ? `` : `d-none d-print-block`} ReminderCardBody`

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
                {actionsState.map((action, i) => {
                  const showEntry = () => showReminder(action.id)
                  const hideEntry = () => hideReminder(action.id)
                  const isHidden = !!hidden.find(k => action.id === k)

                  return (
                    <Draggable draggableId={action.id} index={i} key={action.id}>
                      {provided => (
                        <ActionText
                          {...action}
                          isVisible={!isHidden}
                          hideEntry={hideEntry}
                          showEntry={showEntry}
                          key={action.id}
                          draggableProps={provided}
                        />
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
  draggableProps: DraggableProvided
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, showEntry, hideEntry, draggableProps } = props
  const { isGameMode } = useAppStatus()

  const handleVisibility = () => (!isVisible ? showEntry() : hideEntry())

  return (
    <div ref={draggableProps.innerRef} {...draggableProps.draggableProps}>
      <div className={`mb-2 ${!isVisible ? `d-print-none` : ``}`}>
        <div className="d-flex mb-1">
          <div className="flex-grow-1">
            <div {...draggableProps.dragHandleProps}>
              <ActionTitle {...props} />
            </div>
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
