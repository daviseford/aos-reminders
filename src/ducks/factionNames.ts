import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { IFactionNameStore } from 'types/store'

const initialState: IFactionNameStore = {
  factionName: SUPPORTED_FACTIONS[0],
  subFactionName: '', // TODO: Can we fetch this?
}

const factionNames = createSlice({
  name: 'factionNames',
  initialState,
  reducers: {
    setFactionName: (state, action: PayloadAction<IFactionNameStore['factionName']>) => {
      state.factionName = action.payload
    },
    setSubFactionName: (state, action: PayloadAction<IFactionNameStore['subFactionName']>) => {
      state.subFactionName = action.payload
    },
  },
})

export const factionNamesActions = factionNames.actions
export default factionNames.reducer
