import { createSlice, createSelector } from 'redux-starter-kit'
import { ISubscription } from 'types/subscription'
import { isSubscriber } from 'utils/subscriptionUtils'

const initialState: ISubscription = {
  subscribed: false,
}

export const subscription = createSlice({
  slice: 'subscription',
  initialState,
  reducers: {
    resetSubscription: (state, action) => initialState,
    updateSubscription: (state, action) => action.payload,
  },
})

subscription.selectors.getSubscription = createSelector(
  ['subscription'],
  subscription => subscription
)

// @ts-ignore
subscription.selectors.isSubscribed = createSelector(
  ['subscription'],
  subscription => isSubscriber(subscription)
)
