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
  subscription: { get: (...args: unknown[]) => unknown; activate: (...args: unknown[]) => unknown }
}

export interface IApprovalResponse {
  orderID: string // '9FP07990454230111'
  payerID?: string // 'HNDNEBJEB3R5W'
  paymentID: null
  billingToken: null
  facilitatorAccessToken: string // 'A21AALg_ydToXtGEeOFjeJYy0OzSz5dNCP6hUoqglqpqXQBjYAsd39KOisJczsAuk_qgRdoyLpkJ09kUpmhLFQF0m8zu4VQfA'
  subscriptionID: string // "I-R14AD4977K5F"
}
