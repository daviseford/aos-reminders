import { createSlice } from 'redux-starter-kit'
import { TSupportedFaction } from 'meta/factions'
import { TUnits } from 'types/army'
import { ISelectionStore } from 'types/store'

const initialState: ISelectionStore = {
  selections: {
    allegiances: [],
    artifacts: [],
    battalions: [],
    commands: [],
    endless_spells: [],
    scenery: [],
    spells: [],
    traits: [],
    triumphs: [],
    units: [],
  },
  allySelections: {},
}

const deleteAllySelection = (state, action: { payload: TSupportedFaction }) => {
  delete state.allySelections[action.payload]
}
const resetAllySelection = (state, action: { payload: TSupportedFaction }) => {
  state.allySelections[action.payload] = { units: [] }
}
const resetAllySelections = (state, action) => {
  state.allySelections = initialState.allySelections
}
const resetSelections = (state, action) => {
  state.selections = initialState.selections
}
const updateAllegiances = (state, action) => {
  state.selections.allegiances = action.payload
}
const updateAllyUnits = (state, action: { payload: { factionName: TSupportedFaction; units: TUnits } }) => {
  const { factionName, units } = action.payload
  state.allySelections[factionName] = { units }
}
const updateAllySelections = (state, action) => {
  state.allySelections = action.payload
}
const updateArtifacts = (state, action) => {
  state.selections.artifacts = action.payload
}
const updateBattalions = (state, action) => {
  state.selections.battalions = action.payload
}
const updateCommands = (state, action) => {
  state.selections.commands = action.payload
}
const updateEndlessSpells = (state, action) => {
  state.selections.endless_spells = action.payload
}
const updateScenery = (state, action) => {
  state.selections.scenery = action.payload
}
const updateSelections = (state, action) => {
  state.selections = action.payload
}
const updateSpells = (state, action) => {
  state.selections.spells = action.payload
}
const updateTraits = (state, action) => {
  state.selections.traits = action.payload
}
const updateTriumphs = (state, action) => {
  state.selections.triumphs = action.payload
}
const updateUnits = (state, action) => {
  state.selections.units = action.payload
}

export const selections = createSlice({
  slice: 'selections',
  initialState,
  reducers: {
    deleteAllySelection,
    resetAllSelections: (state, action) => initialState,
    resetAllySelection,
    resetAllySelections,
    resetSelections,
    updateAllegiances,
    updateAllySelections,
    updateAllyUnits,
    updateArtifacts,
    updateBattalions,
    updateCommands,
    updateEndlessSpells,
    updateScenery,
    updateSelections,
    updateSpells,
    updateTraits,
    updateTriumphs,
    updateUnits,
  },
})
