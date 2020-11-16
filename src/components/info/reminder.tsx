import { CardHeader } from 'components/info/card'
import { NoteDisplay, NoteInput, NoteMenu } from 'components/info/note'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import GenericDestructiveModal from 'components/modals/generic/generic_destructive_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { selectors, visibilityActions } from 'ducks'
import { isEqual, sortBy } from 'lodash'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { TTurnAction } from 'types/data'
import { TTurnWhen } from 'types/phases'
import useNote from 'utils/hooks/useNote'
import useWindowSize from 'utils/hooks/useWindowSize'
import { LocalReminderOrder } from 'utils/localStore'
import { reorder, reorderViaIndex } from 'utils/reorder'
import { titleCase } from 'utils/textUtils'

const { addReminder: hideReminder, deleteReminder: showReminder, addWhen: showWhen } = visibilityActions

interface IReminderProps {
  actions: TTurnAction[]
  isMobile: boolean
  when: TTurnWhen
}

export const Reminder: React.FC<IReminderProps> = props => {
  const { actions, isMobile, when } = props
  const { loadedArmy, setHasOrderChanges } = useSavedArmies()
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const hiddenReminders = useSelector(selectors.selectReminders)
  const visibleWhens = useSelector(selectors.selectWhen)

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

      LocalReminderOrder.setByWhen(when, ids)
      setHasOrderChanges(true) // Make our context aware that we've updated the order
    },
    [actionsState, setHasOrderChanges, when]
  )

  useEffect(() => {
    if (!isMobile) dispatch(showWhen(title)) // Auto-open reminders on desktop
  }, [dispatch, isMobile, title])

  useEffect(() => {
    // If we've previously dragged some reminders around,
    // and the stored reminder order has the same ids as our current actions
    // Go ahead and set the actionState to be ordered properly
    const currentIds = sortBy(actions.map(x => x.id))
    const storedIds = LocalReminderOrder.getWhen(when)

    if (storedIds.length > 0 && isEqual(currentIds, sortBy(storedIds))) {
      const reordered = reorderViaIndex(actions, storedIds)
      setActionsState(reordered)
    } else {
      setActionsState(actions)
    }
  }, [actions, when, loadedArmy])

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
              <CardHeader
                title={title}
                isVisible={isVisible}
                headerClassName={`${theme.reminderHeader} text-white`}
                iconSize={1.2}
                show={visibilityActions.addWhen}
                hide={visibilityActions.deleteWhen}
              />
              <div className={bodyClass}>
                {actionsState.map((action, i) => {
                  const isHidden = !!hidden.find(k => action.id === k)

                  return (
                    <Fragment key={i}>
                      {/* Add a spacer between rules */}
                      {i !== 0 && <hr className={`${theme.reminderHr} mx-1`} />}
                      <Draggable draggableId={action.id} index={i} key={action.id}>
                        {provided => (
                          <ActionText
                            {...action}
                            isVisible={!isHidden}
                            key={action.id}
                            draggableProps={provided}
                          />
                        )}
                      </Draggable>
                    </Fragment>
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

interface IActionTextProps extends TTurnAction {
  actionTitle?: string
  isVisible: boolean
  draggableProps: DraggableProvided
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, draggableProps, id } = props
  const dispatch = useDispatch()
  const { isSubscribed } = useSubscription()
  const { isGameMode } = useAppStatus()
  const { isMobile } = useWindowSize()
  const handleVisibility = () => dispatch(!isVisible ? showReminder(id) : hideReminder(id))

  const noteProps = useNote(id)

  return (
    <div ref={draggableProps.innerRef} {...draggableProps.draggableProps}>
      <div className={`mb-2 ${!isVisible ? `d-print-none` : ``}`}>
        <div className={`d-flex ${isMobile ? 'flex-column' : ''} mb-1`}>
          <div className="flex-grow-1">
            <div {...draggableProps.dragHandleProps}>
              <ActionTitle {...props} />
            </div>
          </div>
          <div className={`flex-shrink-0 ${isMobile ? 'align-self-center' : 'px-2'} d-print-none`}>
            {isVisible && !isGameMode && <NoteMenu {...noteProps} />}
            {isGameMode ? (
              <VisibilityToggle
                appearance={'icon'}
                isVisible={isVisible}
                setVisibility={handleVisibility}
                withConfirmation={true}
                type="clear"
                size={1}
              />
            ) : (
              <VisibilityToggle
                appearance={'pill'}
                pillText={'Rule'}
                className={`badge badge-pill badge-light`}
                isVisible={isVisible}
                setVisibility={handleVisibility}
              />
            )}
          </div>
        </div>

        {isVisible && <ActionDescription text={desc} />}
        {isVisible && !isGameMode && isSubscribed && <NoteInput {...noteProps} />}
        {isVisible && isSubscribed && <NoteDisplay {...noteProps} />}

        {noteProps.modal.isOpen && (
          <GenericDestructiveModal
            isOpen={noteProps.modal.isOpen}
            onConfirm={noteProps.remove}
            closeModal={noteProps.modal.close}
            headerText={'Delete this note?'}
          />
        )}
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
        <p className={theme.text} key={i}>
          {text}
        </p>
      ))}
    </>
  )
}
