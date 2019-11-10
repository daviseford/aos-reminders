import { createSlice } from 'redux-starter-kit'
import { IFactionOriginStore } from 'types/store'

const initialState: IFactionOriginStore = {
  factionOrigin: 'None',
}

export const factionOrigins = createSlice({
  name: 'factionOrigins',
  initialState,
  reducers: {
    setFactionOrigin: (state, action) => {
      state.factionOrigin = action.payload
    },
  },
})
