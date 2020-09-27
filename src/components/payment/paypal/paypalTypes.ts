export interface ICreateSubscriptionsActions {
  payment: null
  subscription: {
    create: (...args: any[]) => Promise<string>
    review: (...args: any[]) => Promise<string>
  }
}
export interface IApprovalActions {
  order: {
    authorize: (...args: any[]) => any
    capture: (...args: any[]) => any
    get: (...args: any[]) => any
    patch: (...args: any[]) => any
  }
  payment: null
  redirect?: (...args: any[]) => any
  restart?: (...args: any[]) => any
  subscription: { get: (...args: any[]) => any; activate: (...args: any[]) => any }
}

export interface IApprovalResponse {
  orderID: string // '9FP07990454230111'
  payerID?: string // 'HNDNEBJEB3R5W'
  paymentID: null
  billingToken: null
  facilitatorAccessToken: string // 'A21AALg_ydToXtGEeOFjeJYy0OzSz5dNCP6hUoqglqpqXQBjYAsd39KOisJczsAuk_qgRdoyLpkJ09kUpmhLFQF0m8zu4VQfA'
  subscriptionID: string // "I-R14AD4977K5F"
}
