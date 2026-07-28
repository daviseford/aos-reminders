import type { Aos4ReminderViewModel } from '../../aos4/view'
import { useIsMobile } from 'components/aos4/useIsMobile'
import { useTheme } from 'context/useTheme'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd'
import { Dropdown } from 'react-bootstrap'
import { FaEllipsisH } from 'react-icons/fa'
import { MdExpandMore, MdRemove, MdVisibilityOff } from 'react-icons/md'

export interface ReminderSourceLink {
  id: string
  label: string
  href?: string
  official: boolean
}

interface RemindersProps {
  getSources: (reminder: Aos4ReminderViewModel) => ReminderSourceLink[]
  isGameMode: boolean
  onHide: (reminder: Aos4ReminderViewModel) => void
  onNote: (reminder: Aos4ReminderViewModel, note: string) => void
  onReorder: (reminders: Aos4ReminderViewModel[]) => void
  reminders: Aos4ReminderViewModel[]
}

interface ReminderGroup {
  key: string
  label: string
  reminders: Aos4ReminderViewModel[]
}

const groupReminders = (reminders: Aos4ReminderViewModel[]): ReminderGroup[] =>
  Array.from(
    reminders.reduce((groups, reminder) => {
      const current = groups.get(reminder.windowKey) ?? {
        key: reminder.windowKey,
        label: reminder.windowLabel,
        reminders: [],
      }
      current.reminders.push(reminder)
      groups.set(reminder.windowKey, current)
      return groups
    }, new Map<string, ReminderGroup>())
  ).map(([, group]) => group)

const RuleText = ({ label, text, muted = false }: { label?: string; text: string; muted?: boolean }) => {
  const { theme } = useTheme()
  return (
    <p className={`${theme.text} ${muted ? theme.textMuted : ''}`}>
      {label && <strong>{label}: </strong>}
      {text}
    </p>
  )
}

/**
 * The timing facets as discrete tags. Tag text is real text rather than decoration, so a screen
 * reader announces the same words the flattened prefix used to supply.
 *
 * The abbreviated labels are not self-explanatory, so each tag carries its expansion. `title` covers
 * mouse hover, `aria-label` covers assistive tech, and tapping toggles the expansion inline because
 * a touch device never fires hover.
 */
const ReminderTags = ({ tags }: { tags: Aos4ReminderViewModel['tags'] }) => {
  const { theme } = useTheme()
  const [explained, setExplained] = useState<string | null>(null)

  if (!tags.length) return null

  const handleToggle = (key: string) => setExplained(current => (current === key ? null : key))

  // The explainer is a sibling of the tag row, not a child: nesting it inside the row widens the
  // flex container and drags the right-aligned tags out of alignment when it opens.
  return (
    <>
      <span className={`ReminderTags ${theme.reminderTags}`}>
        {tags.map(tag => {
          const key = `${tag.tone}:${tag.label}`
          return (
            <button
              key={key}
              type="button"
              className={`ReminderTag ReminderTag--${tag.tone}`}
              title={tag.description}
              aria-label={`${tag.label}. ${tag.description}`}
              aria-expanded={explained === key}
              onClick={() => handleToggle(key)}
            >
              {tag.label}
            </button>
          )
        })}
      </span>
      {explained && (
        <span className={`ReminderTagExplainer ${theme.reminderTags}`} role="note">
          {tags.find(tag => `${tag.tone}:${tag.label}` === explained)?.description}
        </span>
      )}
    </>
  )
}

const ReminderEntry = ({
  getSources,
  isGameMode,
  onHide,
  onNote,
  provided,
  reminder,
}: {
  getSources: RemindersProps['getSources']
  isGameMode: boolean
  onHide: RemindersProps['onHide']
  onNote: RemindersProps['onNote']
  provided: Parameters<React.ComponentProps<typeof Draggable>['children']>[0]
  reminder: Aos4ReminderViewModel
}) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [editingNote, setEditingNote] = useState(false)
  const sources = getSources(reminder)

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`mb-2 ${reminder.hidden ? 'd-print-none' : ''}`}
    >
      <div className="d-flex mb-1">
        <div className="flex-grow-1 ReminderHeading" {...provided.dragHandleProps}>
          <span className="ReminderHeadingRow">
            <strong className={theme.text}>{reminder.name}</strong>
            {reminder.hidden && <MdVisibilityOff className={`${theme.text} ml-2`} />}
            {!isMobile && <ReminderTags tags={reminder.tags} />}
          </span>
          {isMobile && <ReminderTags tags={reminder.tags} />}
        </div>
        <div className="flex-shrink-0 ReminderOptions d-print-none">
          <Dropdown>
            <Dropdown.Toggle
              as="button"
              className={`btn btn-link border-0 p-0 ${theme.text}`}
              aria-label={`Options for ${reminder.name}`}
            >
              <FaEllipsisH />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight>
              <Dropdown.Item onClick={() => onHide(reminder)}>
                {reminder.hidden ? 'Show rule' : 'Hide rule'}
              </Dropdown.Item>
              {!isGameMode && (
                <Dropdown.Item onClick={() => setEditingNote(current => !current)}>
                  {reminder.note ? 'Edit note' : 'Add note'}
                </Dropdown.Item>
              )}
              {!!sources.length && <Dropdown.Divider />}
              {!!sources.length && <Dropdown.Header>Source{sources.length > 1 ? 's' : ''}:</Dropdown.Header>}
              {sources.map(source =>
                source.href ? (
                  <a
                    key={source.id}
                    className="dropdown-item"
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.official && <span className="badge badge-primary badge-pill mr-2">Official</span>}
                    {source.label}
                  </a>
                ) : (
                  <Dropdown.ItemText key={source.id}>
                    {source.official && <span className="badge badge-primary badge-pill mr-2">Official</span>}
                    {source.label}
                  </Dropdown.ItemText>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {!reminder.hidden && (
        <>
          {reminder.reactionTrigger && <RuleText label="Trigger" text={reminder.reactionTrigger} />}
          {reminder.declare && <RuleText label="Declare" text={reminder.declare} />}
          <RuleText label="Effect" text={reminder.effect} />
          {editingNote && !isGameMode && (
            <textarea
              className={`NoteInput form-control ${theme.bgColor} ${theme.text} d-print-none`}
              aria-label={`Note for ${reminder.name}`}
              placeholder="Add a note..."
              value={reminder.note ?? ''}
              onChange={event => onNote(reminder, event.target.value)}
            />
          )}
          {reminder.note && (
            <div className={`${theme.noteBorder} p-2 mb-2`}>
              <span className={`${theme.text} NoteText`}>{reminder.note}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const ReminderCard = ({
  getSources,
  group,
  isGameMode,
  onHide,
  onNote,
  onReorder,
}: Omit<RemindersProps, 'reminders'> & { group: ReminderGroup }) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(!isMobile)

  useEffect(() => {
    setIsExpanded(!isMobile)
  }, [isMobile])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return
    const ordered = [...group.reminders]
    const [moved] = ordered.splice(result.source.index, 1)
    ordered.splice(result.destination.index, 0, moved)
    onReorder(ordered)
  }

  const toggleExpanded = () => setIsExpanded(current => !current)
  const printable = group.reminders.some(reminder => !reminder.hidden)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={group.key}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`row d-block PageBreak ${printable ? '' : 'd-print-none'}`}
          >
            <div className="card border-dark my-2 mx-1">
              <div
                className={`${theme.cardHeader} text-white ${isMobile ? 'py-3 px-3' : 'py-2'}`}
                role="button"
                tabIndex={0}
                onClick={toggleExpanded}
                onKeyDown={event => event.key === 'Enter' && toggleExpanded()}
              >
                <div className={`d-flex justify-content-${isMobile ? 'end' : 'center'} align-items-center`}>
                  <div className={`flex-grow-1 text-center ${isMobile ? '' : 'pl-5'}`}>
                    {isMobile ? (
                      <h5 className="CardHeaderTitle text-nowrap">{group.label}</h5>
                    ) : (
                      <h4 className="CardHeaderTitle text-nowrap">{group.label}</h4>
                    )}
                  </div>
                  <div className={`${isMobile ? 'pr-0' : 'px-3'} d-print-none`}>
                    {isExpanded ? <MdRemove aria-hidden /> : <MdExpandMore aria-hidden />}
                  </div>
                </div>
              </div>
              <div
                className={`${theme.cardBody} ${isExpanded ? '' : 'd-none d-print-block'} ReminderCardBody`}
              >
                {group.reminders.map((reminder, index) => (
                  <Fragment key={reminder.id}>
                    {index !== 0 && <hr className={`${theme.reminderHr} mx-1`} />}
                    <Draggable draggableId={reminder.id} index={index}>
                      {provided => (
                        <ReminderEntry
                          getSources={getSources}
                          isGameMode={isGameMode}
                          onHide={onHide}
                          onNote={onNote}
                          provided={provided}
                          reminder={reminder}
                        />
                      )}
                    </Draggable>
                  </Fragment>
                ))}
                {provided.placeholder}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const Reminders = (props: RemindersProps) => {
  const visibleForMode = props.isGameMode
    ? props.reminders.filter(reminder => !reminder.hidden)
    : props.reminders
  const groups = useMemo(() => groupReminders(visibleForMode), [visibleForMode])

  return (
    <div className={`row mx-auto ${props.isGameMode ? 'mt-0' : 'mt-3'} d-flex justify-content-center`}>
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8 ReminderContainer">
        {groups.map(group => (
          <ReminderCard key={group.key} {...props} group={group} />
        ))}
      </div>
    </div>
  )
}

export default Reminders
