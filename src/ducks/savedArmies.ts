import { createSlice, createSelector } from 'redux-starter-kit'
import { TSavedArmiesStore } from 'types/store'
import { ISavedArmyFromApi } from 'types/savedArmy'

const initialState: TSavedArmiesStore = []

const createSavedArmy = (state: TSavedArmiesStore, action: { payload: ISavedArmyFromApi }) => {
  state.push(action.payload)
}

const loadSavedArmies = (state: TSavedArmiesStore, action: { payload: ISavedArmyFromApi[] }) => {
  return action.payload
}

/**
 * Pass in an id to delete
 * @param state
 * @param action
 */
const deleteSavedArmy = (state: TSavedArmiesStore, action: { payload: string }) => {
  state.splice(state.findIndex(savedArmy => savedArmy.id === action.payload), 1)
  // or (slower):
  // return state.filter(savedArmy => savedArmy.name !== action.payload)
}

const updateSavedArmy = (state: TSavedArmiesStore, action: { payload: ISavedArmyFromApi }) => {
  const army = action.payload
  state[state.findIndex(savedArmies => savedArmies.id === army.id)] = army
}

export const savedArmies = createSlice({
  slice: 'savedArmies',
  initialState,
  reducers: {
    loadSavedArmies,
    createSavedArmy,
    deleteSavedArmy,
    resetSavedArmies: (state, action) => initialState,
    updateSavedArmy,
  },
})

savedArmies.selectors.getSavedArmies = createSelector(
  ['savedArmies'],
  savedArmies => savedArmies
)
