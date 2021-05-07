import { LinkNewTab } from 'components/helpers/link'
import { CardHeader } from 'components/info/card'
import { CustomDropdownToggle } from 'components/info/customDropdownToggle'
import { NoteDisplay, NoteInput, NoteMenu } from 'components/info/note'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import GenericDestructiveModal from 'components/modals/generic/generic_destructive_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import { selectors, visibilityActions } from 'ducks'
import { isEqual, sortBy } from 'lodash'
import { TRuleSource } from 'meta/rule_sources'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd'
import { Dropdown } from 'react-bootstrap'
import { FaEllipsisH } from 'react-icons/fa'
import { MdVisibilityOff } from 'react-icons/md'
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
  factionRuleSource?: TRuleSource
  isMobile: boolean
  when: TTurnWhen
}

export const Reminder: React.FC<IReminderProps> = props => {
  const { actions, isMobile, when, factionRuleSource } = props
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
                            factionRuleSource={factionRuleSource}
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
  draggableProps: DraggableProvided
  factionRuleSource?: TRuleSource
  isVisible: boolean
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, draggableProps, id, rule_sources: actionRuleSources, factionRuleSource } = props
  const dispatch = useDispatch()
  const { isSubscribed } = useSubscription()
  const { isGameMode } = useAppStatus()
  const handleVisibility = () => dispatch(!isVisible ? showReminder(id) : hideReminder(id))

  const noteProps = useNote(id)

  const ruleSources = useMemo(() => {
    const _sources = actionRuleSources?.length
      ? actionRuleSources
      : factionRuleSource
      ? [factionRuleSource]
      : []
    return _sources.slice().reverse() // Reverse the array so that newest entries are on top!
  }, [actionRuleSources, factionRuleSource])

  return (
    <div ref={draggableProps.innerRef} {...draggableProps.draggableProps}>
      <div className={`mb-2 ${!isVisible ? `d-print-none` : ``}`}>
        <div className={`d-flex mb-1`}>
          <div className="flex-grow-1">
            <div {...draggableProps.dragHandleProps}>
              <ActionTitle {...props} />
            </div>
          </div>
          <div className={`flex-shrink-0 pl-2 mt-1 d-print-none`}>
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
              <Dropdown>
                <Dropdown.Toggle as={CustomDropdownToggle}>
                  <FaEllipsisH />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <VisibilityToggle
                    appearance={'menuItem'}
                    text={'Rule'}
                    isVisible={isVisible}
                    setVisibility={handleVisibility}
                  />

                  {/* Note controls */}
                  {isVisible && <NoteMenu {...noteProps} />}

                  {/* Rule Sources Display */}
                  <RulesSource rule_sources={ruleSources} />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        {isVisible && <ActionDescription text={desc} />}
        {isVisible && !isGameMode && isSubscribed && <NoteInput {...noteProps} />}
        {isVisible && <NoteDisplay {...noteProps} />}

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

const ActionTitle = ({ actionTitle, name, isVisible }: IActionTextProps) => {
  const { theme } = useTheme()
  const titleStr = actionTitle ? `${actionTitle} - ` : ''

  return (
    <>
      <span className={`${theme.textMuted} font-weight-bold`}>{titleStr}</span>
      <strong className={theme.text}>{name}</strong>
      {!isVisible && (
        <span className={`${theme.text}`}>
          <MdVisibilityOff className={`${theme.text} ml-2`} />
        </span>
      )}
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

const RulesSource: React.FC<{ rule_sources: TRuleSource[] }> = ({ rule_sources }) => {
  const { isMobile } = useWindowSize()
  const numRuleSources = rule_sources.length

  if (!numRuleSources) return <></>

  return (
    <>
      <Dropdown.Divider />
      <Dropdown.Header>Source{numRuleSources > 1 ? 's' : ''}:</Dropdown.Header>

      {rule_sources.map((src, i) => {
        let TagComponent = <></>

        if (numRuleSources > 1) {
          if (i === 0) {
            TagComponent = <span className="badge badge-primary badge-pill mr-2">Current</span>
          } else if (i === numRuleSources - 1) {
            TagComponent = <span className="badge badge-secondary badge-pill mr-2">Original</span>
          } else {
            TagComponent = <span className="badge badge-secondary badge-pill mr-2">Outdated</span>
          }
        }

        return (
          <Dropdown.ItemText
            key={src.name}
            className={`${isMobile ? 'small' : 'text-nowrap'} ${
              numRuleSources > 1 && i !== 0 ? 'text-muted' : ''
            }`}
          >
            {TagComponent}
            {src.url ? (
              <LinkNewTab href={src.url} label={src.name} className={'text-reset'}>
                {src.name}
              </LinkNewTab>
            ) : (
              src.name
            )}
          </Dropdown.ItemText>
        )
      })}
    </>
  )
}
