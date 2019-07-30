import { createSlice, createSelector } from 'redux-starter-kit'

const initialState = null

export const realmscape = createSlice({
  slice: 'realmscape',
  initialState,
  reducers: {
    resetRealmscape: (state, action) => initialState,
    setRealmscape: (state, action) => action.payload,
  },
})

realmscape.selectors.getRealmscape = createSelector(
  ['realmscape'],
  realmscape => realmscape
)
