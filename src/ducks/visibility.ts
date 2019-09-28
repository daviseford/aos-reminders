import { uniq, without } from 'lodash'
import { createSlice } from 'redux-starter-kit'
import { IVisibilityStore as IHiddenStore } from 'types/store'

const initialState: IHiddenStore = {
  allies: [],
  reminders: [],
  selectors: [],
  when: [],
}

const addSelector = (state: IHiddenStore, action: { payload: string }) => {
  state.selectors = uniq([...state.selectors, action.payload])
}
const deleteSelector = (state: IHiddenStore, action: { payload: string }) => {
  state.selectors = without(state.selectors, action.payload)
}
const addAlly = (state: IHiddenStore, action: { payload: string }) => {
  state.allies = uniq([...state.allies, action.payload])
}
const deleteAlly = (state: IHiddenStore, action: { payload: string }) => {
  state.allies = without(state.allies, action.payload)
}
const addReminder = (state: IHiddenStore, action: { payload: string }) => {
  state.reminders = uniq([...state.reminders, action.payload])
}
const deleteReminder = (state: IHiddenStore, action: { payload: string }) => {
  state.reminders = without(state.reminders, action.payload)
}
const addWhen = (state: IHiddenStore, action: { payload: string }) => {
  state.when = uniq([...state.when, action.payload])
}
const addWhens = (state: IHiddenStore, action: { payload: string[] }) => {
  state.when = uniq([...state.when, ...action.payload])
}
const deleteWhen = (state: IHiddenStore, action: { payload: string }) => {
  state.when = without(state.when, action.payload)
}
const deleteWhens = (state: IHiddenStore, action: { payload: string[] }) => {
  state.when = without(state.when, ...action.payload)
}
const clearWhen = (state: IHiddenStore) => {
  state.when = initialState.when
}
const clearReminder = (state: IHiddenStore) => {
  state.reminders = initialState.reminders
}

export const visibility = createSlice({
  slice: 'visibility',
  initialState,
  reducers: {
    addAlly,
    addReminder,
    addSelector,
    addWhen,
    addWhens,
    clearReminder,
    clearWhen,
    deleteAlly,
    deleteReminder,
    deleteSelector,
    deleteWhen,
    deleteWhens,
  },
})
