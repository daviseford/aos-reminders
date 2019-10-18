export interface ISupportPlan {
  cost: string
  dev: string // plan ID in test mode
  monthly_cost: string
  prod: string // plan ID in prod
  title: string
  sale?: boolean
  discount_pct?: number
}

// Half off sale (started 10/18/19)
const SupportPlans: ISupportPlan[] = [
  {
    cost: '0.99',
    dev: 'plan_G0yVJPZbI0cf06',
    discount_pct: 50,
    monthly_cost: '0.99',
    prod: 'plan_G0ycrWfS8rZzAE',
    sale: true,
    title: '1 Month',
  },
  {
    cost: '2.25',
    dev: 'plan_G0yZ65ptRDRCq8',
    discount_pct: 50,
    monthly_cost: '0.75',
    prod: 'plan_G0ydXormf4dUIG',
    sale: true,
    title: '3 Months',
  },
  {
    cost: '5.99',
    dev: 'plan_G0yb7jFjMhn2p1',
    discount_pct: 50,
    monthly_cost: '0.49',
    prod: 'plan_G0ydQlnA9O63Pf',
    sale: true,
    title: '1 Year',
  },
]

// const SupportPlans: ISupportPlan[] = [
//   {
//     cost: '1.99',
//     dev: 'plan_FkxFLAaT1qDsha',
//     monthly_cost: '1.99',
//     prod: 'plan_FkxAvHwfImy1WU',
//     title: '1 Month',
//   },
//   {
//     cost: '4.47',
//     dev: 'plan_FkxFWSZADnJp1G',
//     monthly_cost: '1.49',
//     prod: 'plan_FkxCFxAtQuXdSm',
//     title: '3 Months',
//   },
//   {
//     cost: '11.88',
//     dev: 'plan_FkxGRttbVwtLzD',
//     monthly_cost: '0.99',
//     prod: 'plan_FkxDFaZM1vCkMF',
//     title: '1 Year',
//   },
// ]

export default SupportPlans
