export interface ICreateSubscriptionsActions {
  payment: null
  subscription: {
    create: (...args: unknown[]) => Promise<string>
    review: (...args: unknown[]) => Promise<string>
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
