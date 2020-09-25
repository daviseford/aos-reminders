import { createSlice } from '@reduxjs/toolkit'
import { uniq, without } from 'lodash'
import { IVisibilityStore } from 'types/store'

const initialState: IVisibilityStore = {
  allies: [],
  reminders: [],
  selectors: [],
  when: [],
}

export const visibility = createSlice({
  name: 'visibility',
  initialState,
  reducers: {
    addSelector: (state, action: { payload: string }) => {
      state.selectors = uniq([...state.selectors, action.payload])
    },
    deleteSelector: (state, action: { payload: string }) => {
      state.selectors = without(state.selectors, action.payload)
    },
    addAlly: (state, action: { payload: string }) => {
      state.allies = uniq([...state.allies, action.payload])
    },
    deleteAlly: (state, action: { payload: string }) => {
      state.allies = without(state.allies, action.payload)
    },
    addReminder: (state, action: { payload: string }) => {
      state.reminders = uniq([...state.reminders, action.payload])
    },
    addReminders: (state, action: { payload: string[] }) => {
      state.reminders = uniq([...state.reminders, ...action.payload])
    },
    deleteReminder: (state, action: { payload: string }) => {
      state.reminders = without(state.reminders, action.payload)
    },
    addWhen: (state, action: { payload: string }) => {
      state.when = uniq([...state.when, action.payload])
    },
    addWhens: (state, action: { payload: string[] }) => {
      state.when = uniq([...state.when, ...action.payload])
    },
    deleteWhen: (state, action: { payload: string }) => {
      state.when = without(state.when, action.payload)
    },
    deleteWhens: (state, action: { payload: string[] }) => {
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
