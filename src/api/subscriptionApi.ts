import request from 'superagent'

const endpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev/user`

const getSubscription = (userName: string) => request.get(`${endpoint}/${userName}`)

export const SubscriptionApi = {
  getSubscription,
}
