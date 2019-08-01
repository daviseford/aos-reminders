import { createSlice, createSelector } from 'redux-starter-kit'
import { SUPPORTED_REALMSCAPES } from 'types/realmscapes'

const initialState = {
  realmscape: null,
  realmscape_feature: null,
}

const getRealmscapeFromFeature = (feature: string): string | null => {
  if (!feature) return null
  return SUPPORTED_REALMSCAPES.find(realm => feature.includes(realm)) || null
}

export const realmscape = createSlice({
  slice: 'realmscape',
  initialState,
  reducers: {
    resetRealmscape: (state, action) => initialState,
    setRealmscapeFeature: (state, action) => ({
      realmscape: getRealmscapeFromFeature(action.payload) as any,
      realmscape_feature: action.payload,
    }),
  },
})

realmscape.selectors.getRealmscape = createSelector(
  ['realmscape.realmscape'],
  realmscape => realmscape
)

realmscape.selectors.getRealmscapeFeature = createSelector(
  ['realmscape.realmscape_feature'],
  realmscape_feature => realmscape_feature
)
