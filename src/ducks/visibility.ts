import { uniq, without } from 'lodash'
import { createSlice, createSelector } from 'redux-starter-kit'
import { IVisibilityStore as IHiddenStore } from 'types/store'
import { TTurnWhen } from 'types/phases'

const initialState: IHiddenStore = {
  cards: [],
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
const addCard = (state: IHiddenStore, action: { payload: TTurnWhen }) => {
  state.cards = uniq([...state.cards, action.payload])
}
const deleteCard = (state: IHiddenStore, action: { payload: TTurnWhen }) => {
  state.cards = without(state.cards, action.payload)
}
const clearCards = (state: IHiddenStore) => {
  state.cards = initialState.cards
}
const clearReminders = (state: IHiddenStore) => {
  state.reminders = initialState.reminders
}

export const visibility = createSlice({
  slice: 'visibility',
  initialState,
  reducers: {
    addCard,
    addReminder,
    addSelector,
    clearCards,
    clearReminders,
    deleteCard,
    deleteReminder,
    deleteSelector,
  },
})

visibility.selectors.getCards = createSelector(
  ['visibility.cards'],
  cards => cards
)

visibility.selectors.getReminders = createSelector(
  ['visibility.reminders'],
  reminders => reminders
)

visibility.selectors.getSelectors = createSelector(
  ['visibility.selectors'],
  selectors => selectors
)
