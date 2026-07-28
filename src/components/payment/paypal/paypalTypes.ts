export interface ICreateSubscriptionsActions {
  payment: null
  subscription: {
    create: (...args: unknown[]) => Promise<string>
    review: (...args: unknown[]) => Promise<string>
  }
}

export interface IApprovalActions {
  order: {
    authorize: (...args: unknown[]) => unknown
    capture: (...args: unknown[]) => unknown
    get: (...args: unknown[]) => unknown
    patch: (...args: unknown[]) => unknown
  }
  payment: null
  redirect?: (...args: unknown[]) => unknown
  restart?: (...args: unknown[]) => unknown
  subscription: {
    get: (...args: unknown[]) => unknown
    activate: (...args: unknown[]) => unknown
  }
}

export interface IApprovalResponse {
  orderID: string
  payerID?: string
  paymentID: null
  billingToken: null
  facilitatorAccessToken: string
  subscriptionID: string
}
