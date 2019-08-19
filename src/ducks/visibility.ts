import { uniq, without } from 'lodash'
import { createSlice, createSelector } from 'redux-starter-kit'
import { IVisibilityStore } from 'types/store'

const initialState: IVisibilityStore = {
  reminders: {
    items: [],
    hidden: false,
  },
  selectors: [],
}

const addReminder = (state: IVisibilityStore, action: { payload: string }) => {
  state.reminders.items = uniq([...state.reminders.items, action.payload])
}
const addSelector = (state: IVisibilityStore, action: { payload: string }) => {
  state.selectors = uniq([...state.selectors, action.payload])
}
const deleteReminder = (state: IVisibilityStore, action: { payload: string }) => {
  state.reminders.items = without(state.reminders.items, action.payload)
}
const deleteSelector = (state: IVisibilityStore, action: { payload: string }) => {
  state.selectors = without(state.selectors, action.payload)
}
const toggleVisibility = (state: IVisibilityStore) => {
  state.reminders.hidden = !state.reminders.hidden
}

export const visibility = createSlice({
  slice: 'visibility',
  initialState,
  reducers: {
    addReminder,
    addSelector,
    deleteReminder,
    deleteSelector,
    toggleVisibility,
  },
})

visibility.selectors.getReminders = createSelector(
  ['visibility.reminders.items'],
  reminders => reminders
)

visibility.selectors.getSelectors = createSelector(
  ['visibility.selectors'],
  selectors => selectors
)

visibility.selectors.getVisibility = createSelector(
  ['visibility.reminders.hidden'],
  hidden => hidden
)
