import request from 'superagent'
import type { TThemeType } from 'types/theme'
import { SUBSCRIPTION_AUTH_KEY } from 'utils/env'
import { isDev } from 'utils/env'

const devEndpoint = 'https://pitljgzx18.execute-api.us-east-1.amazonaws.com/dev'
const prodEndpoint = 'https://kd0sjpg6oe.execute-api.us-east-1.amazonaws.com/prod'
const api = isDev ? devEndpoint : prodEndpoint
const requestTimeout = { deadline: 10_000, response: 5_000 }

/*
 * The subscription API is an API Gateway REST API, and it does not decode percent-encoded path
 * parameters — `%40` arrives at the lambda literally, never matches a stored userName, and the
 * lookup answers 501. `useSubscription` reads 501 as "this user has no subscription", so a plain
 * `encodeURIComponent` here makes every subscriber look unsubscribed, silently.
 *
 * `@` is a legal path character (RFC 3986 pchar), so leaving it alone is correct as well as
 * necessary. Encoding the rest still guards against `/`, `?`, and `#` in an address.
 */
const encodeUserName = (userName: string) => encodeURIComponent(userName).replace(/%40/g, '@')

const getSubscription = (userName: string) =>
  request.get(`${api}/user/${encodeUserName(userName)}`).timeout(requestTimeout)

const cancelSubscription = (data: { userName: string; subscriptionId: string }) =>
  request
    .post(`${api}/cancel`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
    .timeout(requestTimeout)

// subscriptionId + planId let the API create a provisional row when the
// CREATED webhook hasn't arrived yet (the grant-vs-webhook race)
const requestGrant = (data: { userName: string; subscriptionId?: string; planId?: string }) =>
  request
    .post(`${api}/paypal_grant`)
    .send({ ...data, authKey: SUBSCRIPTION_AUTH_KEY })
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
