import GenericButton from 'components/input/generic_button'
import SubscriberOnlyModal from 'components/modals/subscriber_only_modal'
import { useAppStatus } from 'context/useAppStatus'
import { useSubscription } from 'context/useSubscription'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import { EMPTY_NOTE_TEXT } from 'types/pdf'
import { TUseNoteValue } from 'utils/hooks/useNote'

const BADGE_CLASS = `badge badge-pill badge-`

export const NoteMenu = (props: TUseNoteValue) => {
  const { note, add, edit, save, isEditing } = props
  const { isSubscribed } = useSubscription()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  let [txt, handleClick, btnClass] = !note
    ? ['Add', add, 'light']
    : isEditing
    ? ['Save', save, 'success']
    : ['Edit', edit, 'light']

  if (!isSubscribed) {
    handleClick = () => setModalIsOpen(true)
    txt = 'Add'
    btnClass = 'light'
  }

  return (
    <>
      <GenericButton className={`${BADGE_CLASS}${btnClass} mr-1`} onClick={handleClick}>
        {txt} Note
      </GenericButton>
      {modalIsOpen && (
        <SubscriberOnlyModal
          isOpen={modalIsOpen}
          closeModal={() => setModalIsOpen(false)}
          featureName={'Add Note'}
        />
      )}
    </>
  )
}

export const NoteInput = (props: TUseNoteValue) => {
  const { note, cancel, remove, save, noteValue, setNoteValue, isEditing } = props

  if (!note || !isEditing) return <></>

  return (
    <>
      <div className="row">
        <div className="col-12">
          <textarea
            name="name"
            className={'NoteInput'}
            onChange={e => {
              e.preventDefault()
              setNoteValue(e.target.value)
            }}
            value={noteValue}
          />
        </div>
        <div className="col-12">
          <div className="btn-group" role="group">
            <GenericButton className={`${BADGE_CLASS}success mr-1`} onClick={save}>
              Save
            </GenericButton>

            <GenericButton className={`${BADGE_CLASS}danger mr-1`} onClick={remove}>
              Delete
            </GenericButton>

            <GenericButton className={`${BADGE_CLASS}light`} onClick={cancel}>
              Cancel
            </GenericButton>
          </div>
        </div>
      </div>
    </>
  )
}

export const NoteDisplay = ({ note, isEditing }: TUseNoteValue) => {
  const { theme } = useTheme()
  const { isGameMode } = useAppStatus()

  if (!note || (isEditing && !isGameMode)) return <></>

  const splitText = (note.content || EMPTY_NOTE_TEXT)
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  const borderClass = `${theme.noteBorder} ${
    !note.content ? 'd-print-none' : ''
  } align-items-center ml-3 px-2 py-1 mb-1`

  return (
    <div className={borderClass}>
      {splitText.map((text, i) => (
        <p className={`NoteText ${theme.text} mb-0`} key={i}>
          {text}
        </p>
      ))}
    </div>
  )
}
