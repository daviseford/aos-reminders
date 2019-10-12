import request from 'superagent'
import { isDev, SUBSCRIPTION_AUTH_KEY } from 'utils/env'
import { TSupportedFaction } from 'meta/factions'

const devEndpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://f2hu69yu3a.execute-api.us-east-1.amazonaws.com/prod`

const endpoint = isDev ? devEndpoint : prodEndpoint

interface IUpdateFavorite {
  id: string
  userName: string
  factionName: TSupportedFaction | null
}

const cancelSubscription = (userName: string) => request.get(`${endpoint}/cancel/${userName}`)
const getSubscription = (userName: string) => request.get(`${endpoint}/user/${userName}`)
const getFavoriteFaction = (userName: string) => request.get(`${endpoint}/favorite/${userName}`)
const updateFavoriteFaction = (data: IUpdateFavorite) =>
  request.post(`${endpoint}/favorite`).send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })

export const SubscriptionApi = {
  cancelSubscription,
  getFavoriteFaction,
  getSubscription,
  updateFavoriteFaction,
}
