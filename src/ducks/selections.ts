import { createSlice } from 'redux-starter-kit'
import { TSupportedFaction } from 'meta/factions'
import { TUnits } from 'types/army'
import { ISelectionStore, IStore } from 'types/store'
import { uniq, without } from 'lodash'
import { TSelectionTypes } from 'types/selections'

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
  sideEffects: {},
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
const updateAllegiances = (state: IStore['selections'], action) => {
  handleSideEffects(state, action.payload, 'allegiances')

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

type TAddToSelectionsAction = {
  payload: {
    value: string // Hermdar Lodge
    values: string[] // ['Tyrant Slayer']
    type: string // e.g. artifacts, spells, etc
  }
}

/**
 * Non destructive way to add to selections - big potential for side effects :(
 * @param state
 * @param action
 */
const addToSelections = (state, action: TAddToSelectionsAction) => {
  const { value, type, values } = action.payload
  state.selections[type] = uniq(state.selections[type].concat(values))
  state.sideEffects[value] = { ...state.sideEffects[value], [type]: values }
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
    addToSelections,
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

const handleSideEffects = (state: IStore['selections'], payload: string[], type: TSelectionTypes) => {
  const sideEffectNames = Object.keys(state.sideEffects)

  const removedSideEffects = state.selections[type]
    .reduce(
      (a, v) => {
        if (sideEffectNames.includes(v)) a.push(v)
        return a
      },
      [] as string[]
    )
    .filter(e => !payload.includes(e))

  removedSideEffects.forEach(r => {
    const sideEffect = state.sideEffects[r]
    Object.keys(sideEffect).forEach(slice => {
      state.selections[slice] = without(state.selections[slice], ...sideEffect[slice])
    })
  })
}
