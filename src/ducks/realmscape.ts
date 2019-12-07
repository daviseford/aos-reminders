import { createSlice } from '@reduxjs/toolkit'
import { SUPPORTED_BATTLE_REALMS } from 'types/realmscapes'
import { IRealmscapeStore, IStore } from 'types/store'

const initialState: IRealmscapeStore = {
  origin_realm: null,
  realmscape: null,
  realmscape_feature: null,
}

const setOriginRealm = (state: IStore['realmscape'], action) => {
  state.origin_realm = action.payload
}

const setRealmscape = (state: IStore['realmscape'], action) => {
  const realmscape = action.payload
  let realmscape_feature = state.realmscape_feature
  if (realmscape && realmscape_feature && !realmscape_feature.includes(realmscape)) {
    realmscape_feature = null // Reset the realmscape_feature
  }
  return { ...state, realmscape, realmscape_feature }
}

const getRealmscapeFromFeature = (feature: string): string | null => {
  return SUPPORTED_BATTLE_REALMS.find(realm => feature.includes(realm)) || null
}

const setRealmscapeFeature = (state: IStore['realmscape'], action) => {
  let realmscape = state.realmscape
  if (!state.realmscape && action.payload) {
    realmscape = getRealmscapeFromFeature(action.payload) as any
  }
  return {
    ...state,
    realmscape,
    realmscape_feature: action.payload,
  }
}

export const realmscape = createSlice({
  name: 'realmscape',
  initialState,
  reducers: {
    resetRealmscapeStore: (state, action) => initialState,
    setOriginRealm,
    setRealmscape,
    setRealmscapeFeature,
  },
})
