import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import DefaultAppState from 'store/initialAppState'
import { INote } from 'types/notes'

const notes = createSlice({
  name: 'notes',
  initialState: DefaultAppState.notes,
  reducers: {
    resetNotes: () => DefaultAppState.notes,
    addNote: (state, action: PayloadAction<INote>) => {
      state.notes = uniq([...state.notes, action.payload])
    },
    addNotes: (state, action: PayloadAction<INote[]>) => {
      state.notes = uniq([...state.notes, ...action.payload])
    },
    setNotes: (state, action: PayloadAction<INote[]>) => {
      state.notes = action.payload
    },
    updateNote: (state, action: PayloadAction<INote>) => {
      const idx = state.notes.findIndex(x => x.id === action.payload.id)
      state.notes[idx] = action.payload
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(x => x.id !== action.payload)
    },
  },
})

export const notesActions = notes.actions
export default notes.reducer
