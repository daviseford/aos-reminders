import { createSlice, createSelector } from 'redux-starter-kit'
import { uniq, without } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'

const initialState = {
  factionName: SUPPORTED_FACTIONS[0],
  allyFactionNames: [] as TSupportedFaction[],
}

const addAllyFactionName = (state, action: { payload: TSupportedFaction }) => {
  state.allyFactionNames = uniq(state.allyFactionNames.push(action.payload))
}

const removeAllyFactionName = (state, action: { payload: TSupportedFaction }) => {
  state.allyFactionNames = without(state.allyFactionNames, action.payload)
}

export const factionNames = createSlice({
  slice: 'factionNames',
  initialState,
  reducers: {
    addAllyFactionName,
    removeAllyFactionName,
    setFactionName: (state, action) => {
      state.factionName = action.payload
    },
    setAllyFactionNames: (state, action: { payload: TSupportedFaction[] }) => {
      state.allyFactionNames = action.payload
    },
  },
})

factionNames.selectors.getFactionName = createSelector(
  ['factionNames.factionName'],
  factionName => factionName
)

factionNames.selectors.getAllyFactionNames = createSelector(
  ['factionNames.allyFactionNames'],
  allyFactionNames => allyFactionNames
)
