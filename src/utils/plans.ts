import type { AnalyticsCommerceItem } from 'utils/analytics'

export interface IGiftedSubscriptionPlans {
  analyticsId: string
  cost: string
  stripe_dev: string
  stripe_prod: string
  title: string
}

export interface ISubscriptionPlan extends IGiftedSubscriptionPlans {
  discount_pct?: number
  monthly_cost: string
  paypal_dev: string
  paypal_prod: string
  sale?: boolean
}

export const GiftedSubscriptionPlans: IGiftedSubscriptionPlans[] = [
  {
    analyticsId: 'gift-subscription-1-month',
    cost: '0.99',
    stripe_dev: 'price_1HmJnuCx8OcHZ9hn9y2JGcDo',
    stripe_prod: 'price_1HmKTgCx8OcHZ9hnRLRJrBPc',
    title: '1 Month',
  },
  {
    analyticsId: 'gift-subscription-3-months',
    cost: '2.67',
    stripe_dev: 'price_1HmKRCCx8OcHZ9hn6vTZs16V',
    stripe_prod: 'price_1HmKTgCx8OcHZ9hnfUPSwgvw',
    title: '3 Months',
  },
  {
    analyticsId: 'gift-subscription-1-year',
    cost: '9.49',
    stripe_dev: 'price_1HmKRCCx8OcHZ9hnHd9mOh0Z',
    stripe_prod: 'price_1HmKTfCx8OcHZ9hn8tunKnFb',
    title: '1 Year',
  },
]

export const SubscriptionPlans: ISubscriptionPlan[] = [
  {
    analyticsId: 'subscription-1-month',
    cost: '1.99',
    monthly_cost: '1.99',
    paypal_dev: 'P-54G67667NT497912UL5TBTBQ',
    paypal_prod: 'P-992593310M0717908L5TJ5ZA',
    stripe_dev: 'plan_FkxFLAaT1qDsha',
    stripe_prod: 'plan_FkxAvHwfImy1WU',
    title: '1 Month',
  },
  {
    analyticsId: 'subscription-3-months',
    cost: '4.47',
    monthly_cost: '1.49',
    paypal_dev: 'P-8HN142814F897112NL5TBTVA',
    paypal_prod: 'P-4SP611027V911981YL5TJ6CY',
    stripe_dev: 'plan_FkxFWSZADnJp1G',
    stripe_prod: 'plan_FkxCFxAtQuXdSm',
    title: '3 Months',
  },
  {
    analyticsId: 'subscription-1-year',
    cost: '11.88',
    monthly_cost: '0.99',
    paypal_dev: 'P-7YT370523H1387633L5TCFHI',
    paypal_prod: 'P-7W029230206518920L5TJ6GI',
    stripe_dev: 'plan_FkxGRttbVwtLzD',
    stripe_prod: 'plan_FkxDFaZM1vCkMF',
    title: '1 Year',
  },
]

export const SUBSCRIPTION_PLANS = SubscriptionPlans
export type SubscriptionPlan = ISubscriptionPlan

export const MAX_GIFT_QUANTITY = 99

export const findSubscriptionPlan = (title: string): ISubscriptionPlan | undefined =>
  SubscriptionPlans.find(plan => plan.title === title)

export const findGiftedSubscriptionPlan = (title: string): IGiftedSubscriptionPlans | undefined =>
  GiftedSubscriptionPlans.find(plan => plan.title === title)

export const toSubscriptionAnalyticsItem = (
  plan: ISubscriptionPlan,
  quantity = 1
): AnalyticsCommerceItem => ({
  item_category: 'subscription',
  item_id: plan.analyticsId,
  item_name: plan.title,
  price: parseFloat(plan.cost),
  quantity,
})

export const toGiftSubscriptionAnalyticsItem = (
  plan: IGiftedSubscriptionPlans,
  quantity = 1
): AnalyticsCommerceItem => ({
  item_category: 'gift_subscription',
  item_id: plan.analyticsId,
  item_name: plan.title,
  price: parseFloat(plan.cost),
  quantity,
})
