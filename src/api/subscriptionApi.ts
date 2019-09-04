import request from 'superagent'

const devEndpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev`

const getSubscription = (userName: string) => request.get(`${devEndpoint}/user/${userName}`)
const cancelSubscription = (subscriptionId: string) => request.get(`${devEndpoint}/cancel/${subscriptionId}`)

export const SubscriptionApi = {
  cancelSubscription,
  getSubscription,
}
