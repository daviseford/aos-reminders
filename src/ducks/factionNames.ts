import { createSlice, createSelector } from 'redux-starter-kit'
import { SUPPORTED_FACTIONS } from 'meta/factions'

const initialState = {
  factionName: SUPPORTED_FACTIONS[0],
  allyFactionName: null,
}

export const factionNames = createSlice({
  slice: 'factionNames',
  initialState,
  reducers: {
    setFactionName: (state, action) => ({ ...state, factionName: action.payload }),
    setAllyFactionName: (state, action) => ({ ...state, allyFactionName: action.payload }),
  },
})

factionNames.selectors.getFactionName = createSelector(
  ['factionNames.factionName'],
  factionName => factionName
)

factionNames.selectors.getAllyFactionName = createSelector(
  ['factionNames.allyFactionName'],
  allyFactionName => allyFactionName
)
