import GenericButton from 'components/input/generic_button'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { INote } from 'types/notes'

const BADGE_CLASS = `badge badge-pill badge-`

export const NoteMenu = (props: TNoteInputProps) => {
  const { note, handleAddNote, handleEditNote, handleSaveNote, handleDeleteNote, isEditingNote } = props

  const [txt, handleClick, btnClass] = !note
    ? ['Add', handleAddNote, 'light']
    : isEditingNote
    ? ['Save', handleSaveNote, 'success']
    : ['Edit', handleEditNote, 'light']

  return (
    <>
      <GenericButton className={`${BADGE_CLASS}${btnClass} ml-1`} onClick={handleClick}>
        {txt} Note
      </GenericButton>

      {note && !isEditingNote && (
        <GenericButton className={`${BADGE_CLASS}light ml-1`} onClick={handleDeleteNote}>
          Delete Note
        </GenericButton>
      )}
    </>
  )
}

type TNoteInputProps = {
  handleAddNote: () => void
  handleCancel: () => void
  handleDeleteNote: () => void
  handleEditNote: () => void
  handleSaveNote: () => void
  isEditingNote: boolean
  note?: INote
  noteValue: string
  setNoteValue: (txt: string) => void
}

export const NoteInput = (props: TNoteInputProps) => {
  const { note, handleCancel, handleDeleteNote, handleSaveNote, noteValue, setNoteValue } = props

  if (!note) return <></>

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
            <GenericButton className={`${BADGE_CLASS}success mr-1`} onClick={handleSaveNote}>
              Save
            </GenericButton>

            <GenericButton className={`${BADGE_CLASS}danger mr-1`} onClick={handleDeleteNote}>
              Delete
            </GenericButton>

            <GenericButton className={`${BADGE_CLASS}light`} onClick={handleCancel}>
              Cancel
            </GenericButton>
          </div>
        </div>
      </div>
    </>
  )
}

export const NoteDisplay = ({ note }: TNoteInputProps) => {
  const { theme } = useTheme()

  if (!note) return <></>

  const splitText = (note.content || `Empty note`)
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  return (
    <div className={`${theme.noteBorder} align-items-center ml-3 px-2 py-1 mb-1`}>
      {splitText.map((text, i) => (
        <p className={`NoteText ${theme.text} mb-0`} key={i}>
          {text}
        </p>
      ))}
    </div>
  )
}
