import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniq, without } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { TSelectionTypes } from 'types/selections'
import { ISelectionStore, IStore, TAllySelectionStore } from 'types/store'

const initialState: ISelectionStore = {
  selections: {
    artifacts: [],
    battalions: [],
    command_abilities: [],
    command_traits: [],
    endless_spells: [],
    flavors: [],
    mount_traits: [],
    prayers: [],
    scenery: [],
    spells: [],
    triumphs: [],
    units: [],
  },
  allySelections: {},
  sideEffects: {},
}

type TAddToSelectionsAction = {
  payload: {
    value: string // Hermdar Lodge
    values: string[] // ['Tyrant Slayer']
    slice: TSelectionTypes // e.g. artifacts, spells, etc
  }
}

const selections = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    resetAllSelections: () => initialState,
    deleteAllySelection: (state, action: PayloadAction<TSupportedFaction>) => {
      delete state.allySelections[action.payload]
    },
    resetAllySelection: (state, action: PayloadAction<TSupportedFaction>) => {
      state.allySelections[action.payload] = { units: [], battalions: [] }
    },
    resetAllySelections: state => {
      state.allySelections = initialState.allySelections
    },
    resetSelections: state => {
      state.selections = initialState.selections
    },
    updateAllyUnits: (state, action: PayloadAction<{ factionName: TSupportedFaction; units: string[] }>) => {
      const { factionName, units } = action.payload
      const battalions = state.allySelections[factionName]?.battalions || []
      state.allySelections[factionName] = { battalions, units }
    },
    updateAllyBattalions: (
      state,
      action: PayloadAction<{ factionName: TSupportedFaction; battalions: string[] }>
    ) => {
      const { factionName, battalions } = action.payload
      const units = state.allySelections[factionName]?.units || []
      state.allySelections[factionName] = { battalions, units }
    },
    setAllySelections: (state, action: PayloadAction<TAllySelectionStore>) => {
      state.allySelections = action.payload
    },
    setFlavors: (state, action: PayloadAction<string[]>) => {
      handleSideEffects(state, action.payload, 'flavors')
    },
    setArtifacts: (state, action: PayloadAction<string[]>) => {
      state.selections.artifacts = action.payload
    },

    /**
     * Non destructive way to add to selections
     * @param state
     * @param action
     */
    addToSelections: (state, action: TAddToSelectionsAction) => {
      const { value, slice, values } = action.payload
      state.selections[slice] = uniq((state.selections[slice] || []).concat(values))
      state.sideEffects[value] = { ...state.sideEffects[value], [slice]: values }
    },

    setBattalions: (state, action: PayloadAction<string[]>) => {
      handleSideEffects(state, action.payload, 'battalions')
    },
    setCommandAbilities: (state, action: PayloadAction<string[]>) => {
      state.selections.command_abilities = action.payload
    },
    setEndlessSpells: (state, action: PayloadAction<string[]>) => {
      state.selections.endless_spells = action.payload
    },
    setScenery: (state, action: PayloadAction<string[]>) => {
      state.selections.scenery = action.payload
    },
    setSelections: (state, action) => {
      state.selections = action.payload
    },
    setSpells: (state, action: PayloadAction<string[]>) => {
      state.selections.spells = action.payload
    },
    setPrayers: (state, action: PayloadAction<string[]>) => {
      state.selections.prayers = action.payload
    },
    setCommandTraits: (state, action: PayloadAction<string[]>) => {
      handleSideEffects(state, action.payload, 'command_traits')
    },
    setMountTraits: (state, action: PayloadAction<string[]>) => {
      handleSideEffects(state, action.payload, 'mount_traits')
    },
    setTriumphs: (state, action: PayloadAction<string[]>) => {
      state.selections.triumphs = action.payload
    },
    setUnits: (state, action: PayloadAction<string[]>) => {
      handleSideEffects(state, action.payload, 'units')
    },
  },
})

export const selectionActions = selections.actions
export default selections.reducer

const handleSideEffects = (state: IStore['selections'], payload: string[], type: TSelectionTypes) => {
  const sideEffectNames = Object.keys(state.sideEffects)

  const removedParentEffects = state.selections[type]
    .reduce((a, v) => {
      if (sideEffectNames.includes(v)) a.push(v)
      return a
    }, [] as string[])
    .filter(e => !payload.includes(e))

  let removedSideEffects: string[] = []

  removedParentEffects.forEach(r => {
    const sideEffect = state.sideEffects[r]
    const slices = Object.keys(sideEffect) as TSelectionTypes[]
    slices.forEach(slice => {
      state.selections[slice] = without(state.selections[slice], ...sideEffect[slice])
      removedSideEffects = removedSideEffects.concat(sideEffect[slice]) // Store for later reference
    })
  })

  // We don't want to re-add side effects that we just removed
  state.selections[type] = payload.filter(x => !removedSideEffects.includes(x))
}
