import { createSlice, createSelector } from 'redux-starter-kit'

export const realmscape = createSlice({
  slice: 'realmscape',
  initialState: 'None',
  reducers: {
    setRealmscape: (state, action) => action.payload,
  },
})

realmscape.selectors.getRealmscape = createSelector(
  ['realmscape'],
  realmscape => realmscape
)
