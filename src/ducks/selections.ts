import { createSlice, createSelector } from 'redux-starter-kit'

const initialState = {
  selections: {
    artifacts: [] as string[],
    battalions: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  },
  allySelections: {
    units: [] as string[],
  },
}

const resetSelections = (state, action) => ({
  allySelections: state.allySelections,
  selections: initialState.selections,
})

const resetAllySelections = (state, action) => ({
  allySelections: initialState.allySelections,
  selections: state.selections,
})

// const addSelection

export const selections = createSlice({
  slice: 'selections',
  initialState,
  reducers: {
    resetSelections,
    resetAllySelections,
    resetAllSelections: (state, action) => initialState,
  },
})

selections.selectors.getSelections = createSelector(
  ['selections.selections'],
  selections => selections
)

selections.selectors.getAllySelections = createSelector(
  ['selections.allySelections'],
  allySelections => allySelections
)
