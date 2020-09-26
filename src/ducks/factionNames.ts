import { createSlice } from '@reduxjs/toolkit'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { IFactionNameStore } from 'types/store'

const initialState: IFactionNameStore = {
  factionName: SUPPORTED_FACTIONS[0],
}

const factionNames = createSlice({
  name: 'factionNames',
  initialState,
  reducers: {
    setFactionName: (state, action) => {
      state.factionName = action.payload
    },
  },
})

export const factionNamesActions = factionNames.actions

export default factionNames.reducer
