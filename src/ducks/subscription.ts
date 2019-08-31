import { createSlice, createSelector } from 'redux-starter-kit'
import { ISubscription } from 'types/subscription'

const initialState: ISubscription = {
  subscribed: false,
}

export const subscription = createSlice({
  slice: 'subscription',
  initialState,
  reducers: {
    resetSubscription: (state, action) => {
      state = initialState
    },
    updateSubscription: (state, action) => {
      state = action.payload
    },
  },
})

subscription.selectors.getSubscription = createSelector(
  ['subscription'],
  subscription => subscription
)
