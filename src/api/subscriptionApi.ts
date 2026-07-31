import type { TThemeType } from 'types/theme'

export class SubscriptionApiError extends Error {
  readonly status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'SubscriptionApiError'
    this.status = status
  }
}

type Fetcher = typeof fetch

interface SubscriptionResponse<T = unknown> {
  body: T
}

const configuredEndpoint = (import.meta.env.VITE_SUBSCRIPTION_API_URL || '').replace(/\/+$/, '')

const responseBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return null
  }
}

const responseMessage = (value: unknown): string => {
  if (typeof value === 'string' && value) return value
  if (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    return value.message
  }
  return 'The subscription service could not complete the request.'
}

export const createSubscriptionApi = (endpoint: string, fetcher: Fetcher = fetch) => {
  const baseUrl = endpoint.replace(/\/+$/, '')

  const request = async <T>(
    path: string,
    token: string,
    options: RequestInit = {}
  ): Promise<SubscriptionResponse<T>> => {
    if (!baseUrl) throw new SubscriptionApiError('Subscriptions are not configured for this build.', 503)
    if (!token) throw new SubscriptionApiError('Please log in again to continue.', 401)

    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')
    headers.set('Authorization', `Bearer ${token}`)
    if (options.body) headers.set('Content-Type', 'application/json')

    let response: Response
    try {
      response = await fetcher(`${baseUrl}${path}`, {
        ...options,
        headers,
        signal: options.signal ?? AbortSignal.timeout(10_000),
      })
    } catch {
      throw new SubscriptionApiError('The subscription service is temporarily unavailable.')
    }

    const body = await responseBody(response)
    if (!response.ok) throw new SubscriptionApiError(responseMessage(body), response.status)
    return { body: body as T }
  }

  const post = <T>(path: string, token: string, data?: object) =>
    request<T>(path, token, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })

  return {
    isConfigured: Boolean(baseUrl),
    getSubscription: (token: string) => request('/account', token),
    cancelSubscription: (token: string) => post('/account/cancel', token),
    requestGrant: (data: { subscriptionId: string }, token: string) =>
      post('/account/paypal-grant', token, data),
    redeemCoupon: (data: { couponId: string }, token: string) =>
      post<{ error?: string; success?: boolean }>('/account/redeem-coupon', token, data),
    redeemGift: (data: { giftId: string; userId: string }, token: string) =>
      post<{ error?: string; success?: boolean }>('/account/redeem-gift', token, data),
    updateTheme: (data: { theme: TThemeType }, token: string) => post('/account/theme', token, data),
  }
}

export const SubscriptionApi = createSubscriptionApi(configuredEndpoint)
