export interface ISupportPlan {
  cost: string
  dev: string // plan ID in test mode
  monthly_cost: string
  prod: string // plan ID in prod
  title: string
}

export const SupportPlans: ISupportPlan[] = [
  {
    cost: '4.79',
    dev: 'plan_Fj0pS8B1S5BCbT',
    monthly_cost: '4.79',
    prod: 'plan_FkIrgp4JMqAuOr',
    title: '1 Month',
  },
  {
    cost: '11.97',
    dev: 'plan_Fj0yqd54eh9j5M',
    monthly_cost: '3.99',
    prod: 'plan_FkIr9jyVcOSl5S',
    title: '3 Months',
  },
  //   {
  //     cost: '19.88',
  //     dev: 'plan_Fj0zcqykYVZlDw',
  //     monthly_cost: '3.31',
  //     prod: 'plan_FkIrON0CHN0HOI',
  //     title: '6 Months',
  //   },
  {
    cost: '30.00',
    dev: 'plan_Fj0vu1PrU562gd',
    monthly_cost: '2.50',
    prod: 'plan_FkIr2rAI563ONG',
    title: '1 Year',
  },
]
