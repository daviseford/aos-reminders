export interface ISupportPlan {
  cost: string
  dev: string // plan ID in test mode
  monthly_cost: string
  prod: string // plan ID in prod
  title: string
  sale?: boolean
}

// Half off sale (started 10/18/19)
const SupportPlansHalfOff: ISupportPlan[] = [
  {
    cost: '0.99',
    dev: 'plan_G0yVJPZbI0cf06',
    monthly_cost: '0.99',
    prod: 'plan_G0ycrWfS8rZzAE',
    title: '1 Month',
    sale: true,
  },
  {
    cost: '2.25',
    dev: 'plan_G0yZ65ptRDRCq8',
    monthly_cost: '0.75',
    prod: 'plan_G0ydXormf4dUIG',
    title: '3 Months',
    sale: true,
  },
  {
    cost: '5.99',
    dev: 'plan_G0yb7jFjMhn2p1',
    monthly_cost: '0.49',
    prod: 'plan_G0ydQlnA9O63Pf',
    title: '1 Year',
    sale: true,
  },
]

// eslint-disable-next-line
const SupportPlans: ISupportPlan[] = [
  {
    cost: '1.99',
    dev: 'plan_FkxFLAaT1qDsha',
    monthly_cost: '1.99',
    prod: 'plan_FkxAvHwfImy1WU',
    title: '1 Month',
  },
  {
    cost: '4.47',
    dev: 'plan_FkxFWSZADnJp1G',
    monthly_cost: '1.49',
    prod: 'plan_FkxCFxAtQuXdSm',
    title: '3 Months',
  },
  {
    cost: '11.88',
    dev: 'plan_FkxGRttbVwtLzD',
    monthly_cost: '0.99',
    prod: 'plan_FkxDFaZM1vCkMF',
    title: '1 Year',
  },
]

export default SupportPlansHalfOff
