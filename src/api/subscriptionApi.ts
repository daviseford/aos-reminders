import request from 'superagent'

const endpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev`

const getSubscription = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const cancelSubscription = (subscriptionId: string) => request.get(`${endpoint}/cancel/${subscriptionId}`)

export const SubscriptionApi = {
  cancelSubscription,
  getSubscription,
}
