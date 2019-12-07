import { uniq, without } from 'lodash'
import { createSlice } from '@reduxjs/toolkit'
import { TSupportedFaction } from 'meta/factions'
import { TUnits, TBattalions } from 'types/army'
import { ISelectionStore, IStore } from 'types/store'
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

type TAction = { payload: string[] }

type TAddToSelectionsAction = {
  payload: {
    value: string // Hermdar Lodge
    values: string[] // ['Tyrant Slayer']
    slice: string // e.g. artifacts, spells, etc
  }
}

const deleteAllySelection = (state, action: { payload: TSupportedFaction }) => {
  delete state.allySelections[action.payload]
}
const resetAllySelection = (state, action: { payload: TSupportedFaction }) => {
  state.allySelections[action.payload] = { units: [], battalions: [] }
}
const resetAllySelections = (state, action) => {
  state.allySelections = initialState.allySelections
}
const resetSelections = (state, action) => {
  state.selections = initialState.selections
}
const updateAllyUnits = (state, action: { payload: { factionName: TSupportedFaction; units: TUnits } }) => {
  const { factionName, units } = action.payload
  state.allySelections[factionName].units = units
}
const updateAllyBattalions = (
  state,
  action: { payload: { factionName: TSupportedFaction; battalions: TBattalions } }
) => {
  const { factionName, battalions } = action.payload
  state.allySelections[factionName].battalions = battalions
}
const updateAllySelections = (state, action) => {
  state.allySelections = action.payload
}
const updateAllegiances = (state: IStore['selections'], action: TAction) => {
  handleSideEffects(state, action.payload, 'allegiances')
  state.selections.allegiances = action.payload
}
const updateArtifacts = (state: IStore['selections'], action: TAction) => {
  state.selections.artifacts = action.payload
}

/**
 * Non destructive way to add to selections
 * @param state
 * @param action
 */
const addToSelections = (state: IStore['selections'], action: TAddToSelectionsAction) => {
  const { value, slice, values } = action.payload
  state.selections[slice] = uniq(state.selections[slice].concat(values))
  state.sideEffects[value] = { ...state.sideEffects[value], [slice]: values }
}

const updateBattalions = (state: IStore['selections'], action: TAction) => {
  handleSideEffects(state, action.payload, 'battalions')
  state.selections.battalions = action.payload
}
const updateCommands = (state: IStore['selections'], action: TAction) => {
  state.selections.commands = action.payload
}
const updateEndlessSpells = (state: IStore['selections'], action: TAction) => {
  state.selections.endless_spells = action.payload
}
const updateScenery = (state: IStore['selections'], action: TAction) => {
  state.selections.scenery = action.payload
}
const updateSelections = (state: IStore['selections'], action) => {
  state.selections = action.payload
}
const updateSpells = (state: IStore['selections'], action: TAction) => {
  state.selections.spells = action.payload
}
const updateTraits = (state: IStore['selections'], action: TAction) => {
  handleSideEffects(state, action.payload, 'traits')
  state.selections.traits = action.payload
}
const updateTriumphs = (state: IStore['selections'], action: TAction) => {
  state.selections.triumphs = action.payload
}
const updateUnits = (state: IStore['selections'], action: TAction) => {
  handleSideEffects(state, action.payload, 'units')
  state.selections.units = action.payload
}

export const selections = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    addToSelections,
    deleteAllySelection,
    resetAllSelections: (state, action) => initialState,
    resetAllySelection,
    resetAllySelections,
    resetSelections,
    updateAllegiances,
    updateAllyBattalions,
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
    .reduce((a, v) => {
      if (sideEffectNames.includes(v)) a.push(v)
      return a
    }, [] as string[])
    .filter(e => !payload.includes(e))

  removedSideEffects.forEach(r => {
    const sideEffect = state.sideEffects[r]
    Object.keys(sideEffect).forEach(slice => {
      state.selections[slice] = without(state.selections[slice], ...sideEffect[slice])
    })
  })
}
