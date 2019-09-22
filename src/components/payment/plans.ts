export interface ISupportPlan {
  cost: string
  dev: string // plan ID in test mode
  monthly_cost: string
  prod: string // plan ID in prod
  title: string
}

export const SupportPlans: ISupportPlan[] = [
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
