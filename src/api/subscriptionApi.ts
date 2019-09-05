import request from 'superagent'
import { isDev } from 'utils/env'

const devEndpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://f2hu69yu3a.execute-api.us-east-1.amazonaws.com/prod`

const endpoint = isDev ? devEndpoint : prodEndpoint

const getSubscription = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const cancelSubscription = (subscriptionId: string) => request.get(`${endpoint}/cancel/${subscriptionId}`)

export const SubscriptionApi = {
  cancelSubscription,
  getSubscription,
}
