import request from 'superagent'
import type { TThemeType } from 'types/theme'
import { SUBSCRIPTION_AUTH_KEY } from 'utils/env'
import { isDev } from 'utils/env'

const devEndpoint = 'https://pitljgzx18.execute-api.us-east-1.amazonaws.com/dev'
const prodEndpoint = 'https://kd0sjpg6oe.execute-api.us-east-1.amazonaws.com/prod'
const api = isDev ? devEndpoint : prodEndpoint
const requestTimeout = { deadline: 10_000, response: 5_000 }

const getSubscription = (userName: string) =>
  request.get(`${api}/user/${encodeURIComponent(userName)}`).timeout(requestTimeout)

const cancelSubscription = (data: { userName: string; subscriptionId: string }) =>
  request
    .post(`${api}/cancel`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

const requestGrant = (userName: string) =>
  request
    .post(`${api}/paypal_grant`)
    .send({ userName, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

const redeemCoupon = (data: { couponId: string; userName: string }) =>
  request
    .post(`${api}/redeem_coupon`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

const redeemGift = (data: { giftId: string; userId: string; userName: string }) =>
  request
    .post(`${api}/redeem`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

const updateTheme = (data: { id: string; userName: string; theme: TThemeType }) =>
  request
    .post(`${api}/theme`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

export const SubscriptionApi = {
  cancelSubscription,
  getSubscription,
  redeemCoupon,
  redeemGift,
  requestGrant,
  updateTheme,
}
