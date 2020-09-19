export interface ICaptureResponse {
  create_time: string // "2020-09-19T13:00:13Z",
  update_time: string // "2020-09-19T13:00:32Z",
  id: string // "8NP41764TP743840R",
  intent: string // "CAPTURE",
  status: string // "COMPLETED",
  payer: {
    email_address: string // "sb-dosqr3246474@personal.example.com",
    payer_id: string // "HNDNEBJEB3R5W",
    address: {
      country_code: string // "US"
    }
    name: {
      given_name: string // "John",
      surname: string // "Doe"
    }
  }
  purchase_units: [
    {
      reference_id: string // "default",
      amount: {
        value: string // "4.47",
        currency_code: string // "USD"
      }
      payee: {
        email_address: string // "sb-vepvn3253845@business.example.com",
        merchant_id: string // "8YX4H4QLFWMSJ"
      }
      shipping: {
        name: {
          full_name: string // "John Doe"
        }
        address: {
          address_line_1: string // "1 Main St",
          admin_area_2: string // "San Jose",
          admin_area_1: string // "CA",
          postal_code: string // "95131",
          country_code: string // "US"
        }
      }
      payments: {
        captures: [
          {
            status: 'COMPLETED' // "COMPLETED",
            id: string // "4D597618CP084044B",
            final_capture: boolean /// true
            create_time: string // "2020-09-19T13:00:32Z",
            update_time: string // "2020-09-19T13:00:32Z",
            amount: {
              value: string // "4.47",
              currency_code: string // "USD"
            }
            seller_protection: {
              status: 'ELIGIBLE' | string // "ELIGIBLE",
              dispute_categories: ('ITEM_NOT_RECEIVED' | 'UNAUTHORIZED_TRANSACTION')[]
            }
            links: [
              {
                href: string // "https://api.sandbox.paypal.com/v2/payments/captures/4D597618CP084044B",
                rel: 'self' // "self",
                method: 'GET' // "GET",
                title: 'GET' // "GET"
              },
              {
                href: string // "https://api.sandbox.paypal.com/v2/payments/captures/4D597618CP084044B/refund",
                rel: 'refund' // "refund",
                method: 'POST' // "POST",
                title: 'POST' // "POST"
              },
              {
                href: string // "https://api.sandbox.paypal.com/v2/checkout/orders/8NP41764TP743840R",
                rel: 'up' // "up",
                method: 'GET' // "GET",
                title: 'GET' // "GET"
              }
            ]
          }
        ]
      }
    }
  ]
  links: [
    {
      href: string // "https://api.sandbox.paypal.com/v2/checkout/orders/8NP41764TP743840R",
      rel: 'self' // "self",
      method: 'GET' // "GET",
      title: 'GET' // "GET"
    }
  ]
}

export interface ICreateOrderActions {
  payment: null
  order: { create: (...args: any[]) => Promise<string> }
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
  payerID: string // 'HNDNEBJEB3R5W'
  paymentID: null
  billingToken: null
  facilitatorAccessToken: string // 'A21AALg_ydToXtGEeOFjeJYy0OzSz5dNCP6hUoqglqpqXQBjYAsd39KOisJczsAuk_qgRdoyLpkJ09kUpmhLFQF0m8zu4VQfA'
}
