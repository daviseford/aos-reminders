import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniq, without } from 'lodash'
import { IVisibilityStore } from 'types/store'

const initialState: IVisibilityStore = {
  allies: [],
  reminders: [],
  selectors: [],
  when: [],
}

const visibility = createSlice({
  name: 'visibility',
  initialState,
  reducers: {
    addSelector: (state, action: PayloadAction<string>) => {
      state.selectors = uniq([...state.selectors, action.payload])
    },
    deleteSelector: (state, action: PayloadAction<string>) => {
      state.selectors = without(state.selectors, action.payload)
    },
    addAlly: (state, action: PayloadAction<string>) => {
      state.allies = uniq([...state.allies, action.payload])
    },
    deleteAlly: (state, action: PayloadAction<string>) => {
      state.allies = without(state.allies, action.payload)
    },
    addReminder: (state, action: PayloadAction<string>) => {
      state.reminders = uniq([...state.reminders, action.payload])
    },
    addReminders: (state, action: PayloadAction<string[]>) => {
      state.reminders = uniq([...state.reminders, ...action.payload])
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = without(state.reminders, action.payload)
    },
    addWhen: (state, action: PayloadAction<string>) => {
      state.when = uniq([...state.when, action.payload])
    },
    addWhens: (state, action: PayloadAction<string[]>) => {
      state.when = uniq([...state.when, ...action.payload])
    },
    deleteWhen: (state, action: PayloadAction<string>) => {
      state.when = without(state.when, action.payload)
    },
    deleteWhens: (state, action: PayloadAction<string[]>) => {
      state.when = without(state.when, ...action.payload)
    },
    clearWhen: state => {
      state.when = initialState.when
    },
    clearReminder: state => {
      state.reminders = initialState.reminders
    },
  },
})

export const visibilityActions = visibility.actions

export default visibility.reducer
