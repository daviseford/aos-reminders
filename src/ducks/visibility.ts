import { uniq, without } from 'lodash'
import { createSlice, createSelector } from 'redux-starter-kit'
import { IVisibilityStore as IHiddenStore } from 'types/store'
import { TTurnWhen } from 'types/phases'

const initialState: IHiddenStore = {
  when: [],
  reminders: [],
  selectors: [],
}

const addSelector = (state: IHiddenStore, action: { payload: string }) => {
  state.selectors = uniq([...state.selectors, action.payload])
}
const deleteSelector = (state: IHiddenStore, action: { payload: string }) => {
  state.selectors = without(state.selectors, action.payload)
}
const addReminder = (state: IHiddenStore, action: { payload: string }) => {
  state.reminders = uniq([...state.reminders, action.payload])
}
const deleteReminder = (state: IHiddenStore, action: { payload: string }) => {
  state.reminders = without(state.reminders, action.payload)
}
const addWhen = (state: IHiddenStore, action: { payload: TTurnWhen }) => {
  state.when = uniq([...state.when, action.payload])
}
const deleteWhen = (state: IHiddenStore, action: { payload: TTurnWhen }) => {
  state.when = without(state.when, action.payload)
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
    addReminder,
    addSelector,
    addWhen,
    clearReminder,
    clearWhen,
    deleteReminder,
    deleteSelector,
    deleteWhen,
  },
})

visibility.selectors.getWhen = createSelector(
  ['visibility.when'],
  when => when
)

visibility.selectors.getReminders = createSelector(
  ['visibility.reminders'],
  reminders => reminders
)

visibility.selectors.getSelectors = createSelector(
  ['visibility.selectors'],
  selectors => selectors
)
