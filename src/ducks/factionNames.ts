import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import DefaultAppState from 'store/initialAppState'
import { IFactionNameStore } from 'types/store'

const factionNames = createSlice({
  name: 'factionNames',
  initialState: DefaultAppState.factionNames,
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
