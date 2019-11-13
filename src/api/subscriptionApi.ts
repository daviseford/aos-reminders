import request from 'superagent'
import { isDev, SUBSCRIPTION_AUTH_KEY } from 'utils/env'
import { TSupportedFaction } from 'meta/factions'
import { TThemeType } from 'types/theme'

const devEndpoint = `https://pitljgzx18.execute-api.us-east-1.amazonaws.com/dev`
const prodEndpoint = `https://kd0sjpg6oe.execute-api.us-east-1.amazonaws.com/prod`

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

interface IUpdateTheme {
  id: string
  userName: string
  theme: TThemeType
}

interface IRedeemGift {
  giftId: string
  userId: string // userId of the referrer
  userName: string // userName receiving the gift
}

const withAuth = (data: { [key: string]: any }) => ({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })

const cancelSubscription = (data: ICancel) => request.post(`${api}/cancel`).send(withAuth(data))
const getFavoriteFaction = (userName: string) => request.get(`${api}/favorite/${userName}`)
const getSubscription = (userName: string) => request.get(`${api}/user/${userName}`)
const redeemGift = (data: IRedeemGift) => request.post(`${api}/redeem`).send(withAuth(data))
const updateFavoriteFaction = (data: IUpdateFavorite) => request.post(`${api}/favorite`).send(withAuth(data))
const updateTheme = (data: IUpdateTheme) => request.post(`${api}/theme`).send(withAuth(data))

export const SubscriptionApi = {
  cancelSubscription,
  getFavoriteFaction,
  getSubscription,
  redeemGift,
  updateFavoriteFaction,
  updateTheme,
}
