import { createSlice } from '@reduxjs/toolkit'
import { uniq, without } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { TBattalions, TUnits } from 'types/army'
import { TSelectionTypes } from 'types/selections'
import { ISelectionStore, IStore } from 'types/store'

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

export const selections = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    resetAllSelections: () => initialState,

    deleteAllySelection: (state, action: { payload: TSupportedFaction }) => {
      delete state.allySelections[action.payload]
    },
    resetAllySelection: (state, action: { payload: TSupportedFaction }) => {
      state.allySelections[action.payload] = { units: [], battalions: [] }
    },
    resetAllySelections: state => {
      state.allySelections = initialState.allySelections
    },
    resetSelections: state => {
      state.selections = initialState.selections
    },
    updateAllyUnits: (
      state,
      action: { payload: { factionName: keyof TSupportedFaction; units: TUnits } }
    ) => {
      const { factionName, units } = action.payload
      state.allySelections[factionName].units = units
    },
    updateAllyBattalions: (
      state,
      action: { payload: { factionName: keyof TSupportedFaction; battalions: TBattalions } }
    ) => {
      const { factionName, battalions } = action.payload
      state.allySelections[factionName].battalions = battalions
    },
    updateAllySelections: (state, action) => {
      state.allySelections = action.payload
    },
    updateAllegiances: (state, action: TAction) => {
      handleSideEffects(state, action.payload, 'allegiances')
      state.selections.allegiances = action.payload
    },
    updateArtifacts: (state, action: TAction) => {
      state.selections.artifacts = action.payload
    },

    /**
     * Non destructive way to add to selections
     * @param state
     * @param action
     */
    addToSelections: (state, action: TAddToSelectionsAction) => {
      const { value, slice, values } = action.payload
      state.selections[slice] = uniq(state.selections[slice].concat(values))
      state.sideEffects[value] = { ...state.sideEffects[value], [slice]: values }
    },

    updateBattalions: (state, action: TAction) => {
      handleSideEffects(state, action.payload, 'battalions')
      state.selections.battalions = action.payload
    },
    updateCommands: (state, action: TAction) => {
      state.selections.commands = action.payload
    },
    updateEndlessSpells: (state, action: TAction) => {
      state.selections.endless_spells = action.payload
    },
    updateScenery: (state, action: TAction) => {
      state.selections.scenery = action.payload
    },
    updateSelections: (state, action) => {
      state.selections = action.payload
    },
    updateSpells: (state, action: TAction) => {
      state.selections.spells = action.payload
    },
    updateTraits: (state, action: TAction) => {
      handleSideEffects(state, action.payload, 'traits')
      state.selections.traits = action.payload
    },
    updateTriumphs: (state, action: TAction) => {
      state.selections.triumphs = action.payload
    },
    updateUnits: (state, action: TAction) => {
      handleSideEffects(state, action.payload, 'units')
      state.selections.units = action.payload
    },
  },
})

export const selectionActions = selections.actions

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
