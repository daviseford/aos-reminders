import { notesActions, visibilityActions } from 'ducks'
import { selectFactionName, selectNotes } from 'ducks/selectors'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { INote } from 'types/notes'
import { logNote } from 'utils/analytics'
import { generateUUID } from 'utils/textUtils'

export interface TUseNoteValue {
  note?: INote

  add: () => void
  cancel: () => void
  edit: () => void
  remove: () => void
  save: () => void

  isEditing: boolean
  noteValue: string
  setNoteValue: (txt: string) => void

  modal: {
    isOpen: boolean
    close: () => void
    open: () => void
  }
}

const useNote = (actionId: string): TUseNoteValue => {
  const dispatch = useDispatch()
  const factionName = useSelector(selectFactionName)

  const notes = useSelector(selectNotes)
  const note = useMemo(() => notes.find(x => x.linked_hash === actionId), [actionId, notes])

  const [isEditing, setIsEditing] = useState(false)
  const [noteValue, setNoteValue] = useState(note?.content || '')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const noteProps: TUseNoteValue = useMemo(
    () => ({
      isEditing,
      note,
      noteValue,
      setNoteValue,
      modal: {
        isOpen: modalIsOpen,
        open: () => setModalIsOpen(true),
        close: () => setModalIsOpen(false),
      },
      add: () => {
        dispatch(
          notesActions.addNote({
            id: generateUUID(),
            linked_hash: actionId,
            content: '',
          })
        )
        setIsEditing(true)
        logNote('Add', factionName)
        dispatch(visibilityActions.deleteReminder(actionId)) // Show this rule
      },
      cancel: () => {
        logNote('Cancel', factionName)
        setIsEditing(false)
      },
      edit: () => {
        if (!note) return
        logNote('Edit', factionName)
        setIsEditing(true)
      },
      remove: () => {
        if (!note) return

        // If we've already had the modal open, we confirmed the delete - do it!
        if (modalIsOpen) {
          setIsEditing(false)
          logNote('Delete', factionName)
          return dispatch(notesActions.deleteNote(note.id))
        }

        // If there is content, confirm before deletion
        if (note.content || noteValue) return setModalIsOpen(true)

        // Otherwise just delete
        setIsEditing(false)
        logNote('Delete', factionName)
        dispatch(notesActions.deleteNote(note.id))
      },
      save: () => {
        if (!note) return
        logNote('Save', factionName)
        dispatch(notesActions.updateNote({ ...note, content: noteValue }))
        setIsEditing(false)
      },
    }),
    [isEditing, note, noteValue, modalIsOpen, dispatch, actionId, factionName]
  )

  return noteProps
}

export default useNote
