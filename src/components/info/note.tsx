import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import React from 'react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { INote } from 'types/notes'

export const NoteMenu = (props: TNoteInputProps) => {
  const { note, handleAddNote, handleEditNote, handleSaveNote, handleDeleteNote, isEditingNote } = props

  let [txt, handleClick, btnClass] = !note
    ? ['Add', handleAddNote, 'primary']
    : isEditingNote
    ? ['Save', handleSaveNote, 'success']
    : ['Edit', handleEditNote, 'warning']

  return (
    <>
      <GenericButton className={`badge badge-pill badge-${btnClass}`} onClick={handleClick}>
        {txt} Note
      </GenericButton>
      {note && (
        <GenericButton className={`badge badge-pill badge-danger`} onClick={handleDeleteNote}>
          Delete Note
        </GenericButton>
      )}
      {isEditingNote && (
        <GenericButton className={`badge badge-pill badge-secondary`} onClick={handleDeleteNote}>
          Cancel
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

  const btn = 'btn btn-sm btn-'

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
            <GenericButton className={`${btn}success mr-1`} onClick={handleSaveNote}>
              Save
            </GenericButton>

            <GenericButton className={`${btn}danger mr-1`} onClick={handleDeleteNote}>
              Delete
            </GenericButton>

            <GenericButton className={`${btn}secondary`} onClick={handleCancel}>
              Cancel
            </GenericButton>
          </div>
        </div>
      </div>
    </>
  )
}

export const NoteDisplay = ({ note, handleEditNote, handleDeleteNote }: TNoteInputProps) => {
  const { theme } = useTheme()
  const { isGameMode } = useAppStatus()

  if (!note) return <></>

  const splitText = (note.content || `Empty note`)
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  return (
    <div className={`${theme.noteBorder} d-flex align-items-center ml-3 px-2 py-1 mb-1`}>
      <div className="flex-grow-1">
        {splitText.map((text, i) => (
          <p className={`NoteText ${theme.text} mb-0`} key={i}>
            {text}
          </p>
        ))}
      </div>
      {!isGameMode && (
        <div className={'pl-4 pr-1'}>
          <GenericButton className="btn btn-secondary mr-2" onClick={handleEditNote}>
            <FaPencilAlt />
          </GenericButton>
          <GenericButton className="btn btn-danger" onClick={handleDeleteNote}>
            <FaTrashAlt />
          </GenericButton>
        </div>
      )}
    </div>
  )
}
