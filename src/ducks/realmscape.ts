import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import DefaultAppState from 'store/initialAppState'
import { RealmscapesEnum, SUPPORTED_REALMSCAPES } from 'types/realmscapes'

const getRealmscapeFromFeature = (feature: string): RealmscapesEnum | null => {
  return SUPPORTED_REALMSCAPES.find(realm => feature.includes(realm)) || null
}

const realmscape = createSlice({
  name: 'realmscape',
  initialState: DefaultAppState.realmscape,
  reducers: {
    resetRealmscapeStore: () => DefaultAppState.realmscape,

    setOriginRealm: (state, action: PayloadAction<RealmscapesEnum | null>) => {
      state.origin_realm = action.payload
    },

    setRealmscape: (state, action: PayloadAction<RealmscapesEnum | null>) => {
      const realmscape = action.payload
      const realmscape_feature = state.realmscape_feature
      if (realmscape && realmscape_feature && !realmscape_feature.includes(realmscape)) {
        state.realmscape_feature = null // Reset the realmscape_feature
      }
      state.realmscape = realmscape
    },

    setRealmscapeFeature: (state, action: PayloadAction<string | null>) => {
      if (!state.realmscape && action.payload) {
        state.realmscape = getRealmscapeFromFeature(action.payload)
      }
      state.realmscape_feature = action.payload
    },
  },
})

export const realmscapeActions = realmscape.actions
export default realmscape.reducer
