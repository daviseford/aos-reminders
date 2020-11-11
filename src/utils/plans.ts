export interface IGiftedSubscriptionPlans {
  cost: string
  stripe_dev: string // stripe plan ID in test mode
  stripe_prod: string // stripe plan ID in prod
  title: string
}

export interface ISubscriptionPlan extends IGiftedSubscriptionPlans {
  paypal_dev: string // paypal plan ID in sandbox mode
  paypal_prod: string // paypal plan ID in prod
  monthly_cost: string
  sale?: boolean
  discount_pct?: number
}

export const GiftedSubscriptionPlans: IGiftedSubscriptionPlans[] = [
  {
    cost: '0.99',
    stripe_dev: 'price_1HmJnuCx8OcHZ9hn9y2JGcDo',
    stripe_prod: 'price_1HmKTgCx8OcHZ9hnRLRJrBPc',
    title: '1 Month',
  },
  {
    cost: '2.67',
    stripe_dev: 'price_1HmKRCCx8OcHZ9hn6vTZs16V',
    stripe_prod: 'price_1HmKTgCx8OcHZ9hnfUPSwgvw',
    title: '3 Months',
  },
  {
    cost: '9.49',
    stripe_dev: 'price_1HmKRCCx8OcHZ9hnHd9mOh0Z',
    stripe_prod: 'price_1HmKTfCx8OcHZ9hn8tunKnFb',
    title: '1 Year',
  },
]

export const SubscriptionPlans: ISubscriptionPlan[] = [
  {
    cost: '1.99',
    monthly_cost: '1.99',
    paypal_dev: 'P-54G67667NT497912UL5TBTBQ',
    paypal_prod: 'P-992593310M0717908L5TJ5ZA',
    stripe_dev: 'plan_FkxFLAaT1qDsha',
    stripe_prod: 'plan_FkxAvHwfImy1WU',
    title: '1 Month',
  },
  {
    cost: '4.47',
    monthly_cost: '1.49',
    paypal_dev: 'P-8HN142814F897112NL5TBTVA',
    paypal_prod: 'P-4SP611027V911981YL5TJ6CY',
    stripe_dev: 'plan_FkxFWSZADnJp1G',
    stripe_prod: 'plan_FkxCFxAtQuXdSm',
    title: '3 Months',
  },
  {
    cost: '11.88',
    monthly_cost: '0.99',
    paypal_dev: 'P-7YT370523H1387633L5TCFHI',
    paypal_prod: 'P-7W029230206518920L5TJ6GI',
    stripe_dev: 'plan_FkxGRttbVwtLzD',
    stripe_prod: 'plan_FkxDFaZM1vCkMF',
    title: '1 Year',
  },
]
