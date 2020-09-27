import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SUPPORTED_BATTLE_REALMS, TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { IRealmscapeStore } from 'types/store'

const initialState: IRealmscapeStore = {
  origin_realm: null,
  realmscape: null,
  realmscape_feature: null,
}

const getRealmscapeFromFeature = (feature: string): TBattleRealms | null => {
  return SUPPORTED_BATTLE_REALMS.find(realm => feature.includes(realm)) || null
}

const realmscape = createSlice({
  name: 'realmscape',
  initialState,
  reducers: {
    resetRealmscapeStore: () => initialState,

    setOriginRealm: (state, action: PayloadAction<TOriginRealms | null>) => {
      state.origin_realm = action.payload
    },

    setRealmscape: (state, action: PayloadAction<TBattleRealms | null>) => {
      const realmscape = action.payload
      let realmscape_feature = state.realmscape_feature
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
