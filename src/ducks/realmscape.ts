import { createSlice, createSelector } from 'redux-starter-kit'
import { SUPPORTED_REALMSCAPES } from 'types/realmscapes'

const initialState = {
  realmscape: null,
  realmscape_feature: null,
}

const setRealmscape = (state, action) => {
  const realmscape = action.payload
  let realmscape_feature = state.realmscape_feature
  if (realmscape && realmscape_feature && !realmscape_feature.includes(realmscape)) {
    realmscape_feature = null // Reset the realmscape_feature
  }
  return { realmscape, realmscape_feature }
}

const getRealmscapeFromFeature = (feature: string): string | null => {
  return SUPPORTED_REALMSCAPES.find(realm => feature.includes(realm)) || null
}

const setRealmscapeFeature = (state, action) => {
  let realmscape = state.realmscape
  if (!state.realmscape && action.payload) {
    realmscape = getRealmscapeFromFeature(action.payload) as any
  }
  return {
    realmscape,
    realmscape_feature: action.payload,
  }
}

export const realmscape = createSlice({
  slice: 'realmscape',
  initialState,
  reducers: {
    resetRealmscape: (state, action) => initialState,
    setRealmscape,
    setRealmscapeFeature,
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
