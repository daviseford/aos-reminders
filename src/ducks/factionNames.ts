import { createSlice } from 'redux-starter-kit'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { IFactionNameStore } from 'types/store'

const initialState: IFactionNameStore = {
  factionName: SUPPORTED_FACTIONS[0],
}

export const factionNames = createSlice({
  slice: 'factionNames',
  initialState,
  reducers: {
    setFactionName: (state, action) => {
      state.factionName = action.payload
    },
  },
})
