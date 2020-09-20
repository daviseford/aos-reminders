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

// Battlescribe sale
// Started 10/29/19
// export const SubscriptionPlans: ISubscriptionPlan[] = [
//   {
//     cost: '0.99',
//     dev: 'plan_G0yVJPZbI0cf06',
//     discount_pct: 50,
//     monthly_cost: '0.99',
//     prod: 'plan_G0ycrWfS8rZzAE',
//     sale: true,
//     title: '1 Month',
//   },
//   {
//     cost: '2.67',
//     dev: 'plan_G54g0QyqqpjK6T',
//     discount_pct: 40,
//     monthly_cost: '0.89',
//     prod: 'plan_G54fNFZ0Oi7WXa',
//     sale: true,
//     title: '3 Months',
//   },
//   {
//     cost: '9.49',
//     dev: 'plan_G54heoB7FQLELi',
//     discount_pct: 20,
//     monthly_cost: '0.79',
//     prod: 'plan_G54gM8AIgJDIEK',
//     sale: true,
//     title: '1 Year',
//   },
// ]

export const GiftedSubscriptionPlans: IGiftedSubscriptionPlans[] = [
  {
    cost: '0.99',
    stripe_dev: 'sku_GAMOo7HKhPgOrl',
    stripe_prod: 'sku_GAqlskLWmrotl0',
    title: '1 Month',
  },
  {
    cost: '2.67',
    stripe_dev: 'sku_GAMOxUEnWQLslM',
    stripe_prod: 'sku_GAqlfasGefolVt',
    title: '3 Months',
  },
  {
    cost: '9.49',
    stripe_dev: 'sku_GAMIdacq7uChaF',
    stripe_prod: 'sku_GAqm4R7SuEJToJ',
    title: '1 Year',
  },
]

// Quarter price
// Started 10/18/19 - Ended 10/29/19
// export const SubscriptionPlans: ISubscriptionPlan[] = [
//   {
//     cost: '0.99',
//     dev: 'plan_G0yVJPZbI0cf06',
//     discount_pct: 50,
//     monthly_cost: '0.99',
//     prod: 'plan_G0ycrWfS8rZzAE',
//     sale: true,
//     title: '1 Month',
//   },
//   {
//     cost: '2.25',
//     dev: 'plan_G0yZ65ptRDRCq8',
//     discount_pct: 50,
//     monthly_cost: '0.75',
//     prod: 'plan_G0ydXormf4dUIG',
//     sale: true,
//     title: '3 Months',
//   },
//   {
//     cost: '5.99',
//     dev: 'plan_G0yb7jFjMhn2p1',
//     discount_pct: 50,
//     monthly_cost: '0.49',
//     prod: 'plan_G0ydQlnA9O63Pf',
//     sale: true,
//     title: '1 Year',
//   },
// ]

// Long-term prices (hopefully)
// Note: Amanda suggested these prices
// Started 1/30/2020 - Ended 2/6/20
// export const SubscriptionPlans: ISubscriptionPlan[] = [
//   {
//     cost: '3.99',
//     dev: 'plan_Ge65ibcpPwtIpb',
//     monthly_cost: '3.99',
//     prod: 'plan_Ge63m2HrhrZQft',
//     title: '1 Month',
//   },
//   {
//     cost: '5.99',
//     dev: 'plan_Ge6616VCSFfPyO',
//     monthly_cost: '1.99',
//     prod: 'plan_Ge64gbGneyAVE9',
//     title: '3 Months',
//   },
//   {
//     cost: '12.99',
//     dev: 'plan_Ge669qlfuLBS1y',
//     monthly_cost: '1.08',
//     prod: 'plan_Ge65SmouZEG7ia',
//     title: '1 Year',
//   },
// ]

// Price discovery #1
// Started 1/25/2020. Ended 1/30/2020
// export const SubscriptionPlans: ISubscriptionPlan[] = [
//   {
//     cost: '2.99',
//     dev: 'plan_GblPX6W3J63QVQ',
//     monthly_cost: '2.99',
//     prod: 'plan_GblMrWu14MyTIX',
//     title: '1 Month',
//   },
//   {
//     cost: '7.47',
//     dev: 'plan_GblQjaElSrCaMA',
//     monthly_cost: '2.49',
//     prod: 'plan_GblNdann3IIBaL',
//     title: '3 Months',
//   },
//   {
//     cost: '23.88',
//     dev: 'plan_GblQrGW7mAZr43',
//     monthly_cost: '1.99',
//     prod: 'plan_GblPyQOBWwGDrg',
//     title: '1 Year',
//   },
// ]

// Half price
// Started 12/30/2019 - Restarted 2/6/20
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
    paypal_prod: 'PROD-5XE01124L3315984V',
    stripe_dev: 'plan_FkxGRttbVwtLzD',
    stripe_prod: 'plan_FkxDFaZM1vCkMF',
    title: '1 Year',
  },
]
