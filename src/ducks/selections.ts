import { createSlice, createSelector } from 'redux-starter-kit'
import { ISelections, IAllySelections } from 'types/selections'

type TInitialStateType = {
  selections: ISelections
  allySelections: IAllySelections
}

const initialState: TInitialStateType = {
  selections: {
    artifacts: [] as string[],
    battalions: [] as string[],
    endless_spells: [] as string[],
    spells: [] as string[],
    traits: [] as string[],
    units: [] as string[],
  },
  allySelections: {
    units: [] as string[],
  },
}

const resetSelections = (state, action) => {
  state.selections = initialState.selections
}
const resetAllySelections = (state, action) => {
  state.allySelections = initialState.allySelections
}
const updateUnits = (state, action) => {
  state.selections.units = action.payload
}
const updateTraits = (state, action) => {
  state.selections.traits = action.payload
}
const updateBattalions = (state, action) => {
  state.selections.battalions = action.payload
}
const updateArtifacts = (state, action) => {
  state.selections.artifacts = action.payload
}
const updateSpells = (state, action) => {
  state.selections.spells = action.payload
}
const updateEndlessSpells = (state, action) => {
  state.selections.endless_spells = action.payload
}
const updateAllyUnits = (state, action) => {
  state.allySelections.units = action.payload
}

export const selections = createSlice({
  slice: 'selections',
  initialState,
  reducers: {
    resetAllSelections: (state, action) => initialState,
    resetAllySelections,
    resetSelections,
    updateAllyUnits,
    updateArtifacts,
    updateBattalions,
    updateEndlessSpells,
    updateSpells,
    updateTraits,
    updateUnits,
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
