import { createSlice } from '@reduxjs/toolkit'
import { SUPPORTED_BATTLE_REALMS } from 'types/realmscapes'
import { IRealmscapeStore } from 'types/store'

const initialState: IRealmscapeStore = {
  origin_realm: null,
  realmscape: null,
  realmscape_feature: null,
}

const getRealmscapeFromFeature = (feature: string): string | null => {
  return SUPPORTED_BATTLE_REALMS.find(realm => feature.includes(realm)) || null
}

export const realmscape = createSlice({
  name: 'realmscape',
  initialState,
  reducers: {
    resetRealmscapeStore: () => initialState,

    setOriginRealm: (state, action) => {
      state.origin_realm = action.payload
    },

    setRealmscape: (state, action) => {
      const realmscape = action.payload
      let realmscape_feature = state.realmscape_feature
      if (realmscape && realmscape_feature && !realmscape_feature.includes(realmscape)) {
        realmscape_feature = null // Reset the realmscape_feature
      }
      return { ...state, realmscape, realmscape_feature }
    },

    setRealmscapeFeature: (state, action) => {
      let realmscape = state.realmscape
      if (!state.realmscape && action.payload) {
        realmscape = getRealmscapeFromFeature(action.payload)
      }
      return {
        ...state,
        realmscape,
        realmscape_feature: action.payload,
      }
    },
  },
})
