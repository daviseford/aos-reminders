import { useTheme } from 'context/useTheme'
import React from 'react'
import { IconBaseProps, IconContext } from 'react-icons'
import { MdNoteAdd } from 'react-icons/md'
import { INote } from 'types/notes'

export const NoteIcon = (props: IconBaseProps) => {
  const { theme } = useTheme()
  return (
    <IconContext.Provider value={{ size: `1.3em`, className: theme.text }}>
      <MdNoteAdd {...props} />
    </IconContext.Provider>
  )
}

type TNoteInputProps = {
  note: INote
  handleDeleteNote: () => void
  handleSaveNote: (content: string) => void
  handleCancel: () => void
}

export const NoteInput = (props: TNoteInputProps) => {
  const { note, handleCancel, handleDeleteNote, handleSaveNote } = props
  const [inputValue, setInputValue] = React.useState(note.content || '')

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
              setInputValue(e.target.value)
            }}
            value={inputValue}
          />
        </div>
        <div className="col-12">
          <div className="btn-group" role="group">
            {inputValue !== note.content && (
              <button type="button" className={`${btn}success`} onClick={() => handleSaveNote(inputValue)}>
                Save
              </button>
            )}

            <button type="button" className={`${btn}danger`} onClick={handleDeleteNote}>
              Delete
            </button>

            <button type="button" className={`${btn}secondary`} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

type TNoteDisplayProps = { note: INote; handleEditNote: () => void }

export const NoteDisplay = ({ note, handleEditNote }: TNoteDisplayProps) => {
  const { theme } = useTheme()
  const splitText = note.content
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  if (!note || !note.content) return <></>

  return (
    <div className={`NoteDiv d-flex align-items-center ml-3 px-2 py-1 mb-1`}>
      <div className="flex-grow-1">
        {splitText.map((text, i) => (
          <p className={`NoteText ${theme.text} mb-0`} key={i}>
            {text}
          </p>
        ))}
      </div>
      <div className={'pl-4 pr-1'}>
        <button type="button" className="btn btn-sm btn-secondary" onClick={handleEditNote}>
          Edit
        </button>
      </div>
    </div>
  )
}
