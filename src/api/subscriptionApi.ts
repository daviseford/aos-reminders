import request from 'superagent'
import { isDev, SUBSCRIPTION_AUTH_KEY } from 'utils/env'
import { TSupportedFaction } from 'meta/factions'

const devEndpoint = `https://jzbt3cf6mj.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://f2hu69yu3a.execute-api.us-east-1.amazonaws.com/prod`

const api = isDev ? devEndpoint : prodEndpoint

interface ICancel {
  userName: string
  subscriptionId: string
}

interface IUpdateFavorite {
  id: string
  userName: string
  factionName: TSupportedFaction | null
}

const withAuth = (data: { [key: string]: any }) => ({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })

const cancelSubscription = (data: ICancel) => request.post(`${api}/cancel`).send(withAuth(data))
const getFavoriteFaction = (userName: string) => request.get(`${api}/favorite/${userName}`)
const getSubscription = (userName: string) => request.get(`${api}/user/${userName}`)
const updateFavoriteFaction = (data: IUpdateFavorite) => request.post(`${api}/favorite`).send(withAuth(data))

export const SubscriptionApi = {
  cancelSubscription,
  getFavoriteFaction,
  getSubscription,
  updateFavoriteFaction,
}
