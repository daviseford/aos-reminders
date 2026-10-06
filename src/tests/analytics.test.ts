// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const ga = vi.hoisted(() => ({
  event: vi.fn(),
  initialize: vi.fn(),
  send: vi.fn(),
}))

vi.mock('react-ga4', () => ({ default: ga }))

const loadAnalytics = async () => {
  vi.resetModules()
  return import('utils/analytics')
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('analytics collection boundary', () => {
  it('is inert on import and rejects non-production hosts', async () => {
    const analytics = await loadAnalytics()
    const router = {
      state: { location: { key: 'default', pathname: '/' } },
      subscribe: vi.fn(() => vi.fn()),
    }

    expect(ga.initialize).not.toHaveBeenCalled()
    expect(analytics.canCollectAnalytics({ hostname: 'aosreminders.com', isProduction: false })).toBe(false)
    expect(analytics.canCollectAnalytics({ hostname: 'localhost', isProduction: true })).toBe(false)
    expect(analytics.canCollectAnalytics({ hostname: '127.0.0.1', isProduction: true })).toBe(false)
    expect(analytics.canCollectAnalytics({ hostname: 'preview.aosreminders.com', isProduction: true })).toBe(
      false
    )
    expect(analytics.startPageViewTracking(router)).toEqual(expect.any(Function))
    expect(router.subscribe).not.toHaveBeenCalled()
  })

  it.each(['aosreminders.com', 'www.aosreminders.com'])(
    'initializes once on the production hostname %s with automatic pageviews disabled',
    async hostname => {
      const analytics = await loadAnalytics()

      expect(analytics.initializeAnalytics({ hostname, isProduction: true })).toBe(true)
      expect(analytics.initializeAnalytics({ hostname, isProduction: true })).toBe(false)
      expect(ga.initialize).toHaveBeenCalledTimes(1)
      expect(ga.initialize).toHaveBeenCalledWith('G-EM4GX294XG', {
        gaOptions: { siteSpeedSampleRate: 100 },
        gtagOptions: { send_page_view: false },
      })
    }
  )

  it('tracks the initial path and subsequent history paths without query or fragment data', async () => {
    const analytics = await loadAnalytics()
    analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })

    let listener: ((state: { location: { key: string; pathname: string } }) => void) | undefined
    const unsubscribe = vi.fn()
    const router = {
      state: { location: { key: 'default', pathname: '/faq', search: '?army=secret', hash: '#private' } },
      subscribe: vi.fn((nextListener: (state: { location: { key: string; pathname: string } }) => void) => {
        listener = nextListener
        return unsubscribe
      }),
    }

    expect(analytics.startPageViewTracking(router)).toBe(unsubscribe)
    listener?.({ location: { key: 'nav-1', pathname: '/subscribe' } })
    // Router state updates that are not navigations repeat the location key and must not re-log.
    listener?.({ location: { key: 'nav-1', pathname: '/subscribe' } })

    expect(ga.send).toHaveBeenNthCalledWith(1, {
      hitType: 'pageview',
      location: 'http://localhost:3000/faq',
      page: '/faq',
      title: document.title,
    })
    expect(ga.send).toHaveBeenNthCalledWith(2, {
      hitType: 'pageview',
      location: 'http://localhost:3000/subscribe',
      page: '/subscribe',
      title: document.title,
    })
    expect(ga.send).toHaveBeenCalledTimes(2)
    expect(JSON.stringify(ga.send.mock.calls)).not.toContain('secret')
    expect(router.subscribe).toHaveBeenCalledTimes(1)
  })
})

describe('analytics event taxonomy', () => {
  it('uses stable event names and bounded parameters for product actions', async () => {
    const analytics = await loadAnalytics()
    analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })

    analytics.logFactionSelection('faction:stormcast-eternals', 'Stormcast Eternals')
    analytics.logFactionSelection('faction:skaven', 'Skaven')
    analytics.logGameModeChange(true)
    analytics.logPdfDownload('compact', 'a4')
    analytics.logRosterImport({
      diagnosticCount: 2,
      outcome: 'success',
      selectionCount: 12,
      source: 'official-app-text',
    })

    expect(ga.event.mock.calls.map(([name]) => name)).toEqual([
      'select_content',
      'select_content',
      'game_mode_change',
      'file_download',
      'roster_import',
    ])
    expect(ga.event).toHaveBeenNthCalledWith(1, 'select_content', {
      content_type: 'faction',
      faction_name: 'Stormcast Eternals',
      item_id: 'faction:stormcast-eternals',
    })
    expect(ga.event).toHaveBeenCalledWith('file_download', {
      file_extension: 'pdf',
      file_name: 'reminders-compact-a4.pdf',
      print_layout: 'compact',
      print_page_size: 'a4',
    })
    expect(JSON.stringify(ga.event.mock.calls)).not.toContain('army=')
  })

  it('emits valid ecommerce events with numeric totals and a provider transaction id', async () => {
    const analytics = await loadAnalytics()
    analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })
    const item = {
      item_category: 'gift_subscription',
      item_id: 'gift-subscription-3-months',
      item_name: '3 Months',
      price: 2.67,
      quantity: 3,
    } as const

    analytics.logBeginCheckout({ items: [item], provider: 'stripe' })
    analytics.logPurchase({
      items: [item],
      provider: 'stripe',
      transactionId: 'cs_live_123',
    })

    expect(ga.event).toHaveBeenNthCalledWith(1, 'begin_checkout', {
      currency: 'USD',
      items: [item],
      payment_provider: 'stripe',
      value: 8.01,
    })
    expect(ga.event).toHaveBeenNthCalledWith(2, 'purchase', {
      currency: 'USD',
      items: [item],
      payment_provider: 'stripe',
      transaction_id: 'cs_live_123',
      value: 8.01,
    })
  })
})

describe('checkout_error', () => {
  it('sends only the closed provider, kind, stage, and error-type vocabulary', async () => {
    const analytics = await loadAnalytics()
    analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })
    const item = {
      item_category: 'subscription',
      item_id: 'subscription-1-year',
      item_name: '1 Year',
      price: 11.88,
      quantity: 1,
    } as const

    analytics.logCheckoutError({
      errorType: 'http_5xx',
      items: [item],
      kind: 'subscription',
      provider: 'stripe',
      stage: 'session_create',
    })
    analytics.logCheckoutError({
      errorType: 'provider_error',
      kind: 'subscription',
      provider: 'paypal',
      stage: 'sdk_load',
    })

    expect(ga.event).toHaveBeenNthCalledWith(1, 'checkout_error', {
      checkout_error_type: 'http_5xx',
      checkout_kind: 'subscription',
      checkout_stage: 'session_create',
      items: [item],
      payment_provider: 'stripe',
    })
    // An availability failure belongs to no plan, so it carries no items rather than an empty list.
    expect(ga.event).toHaveBeenNthCalledWith(2, 'checkout_error', {
      checkout_error_type: 'provider_error',
      checkout_kind: 'subscription',
      checkout_stage: 'sdk_load',
      payment_provider: 'paypal',
    })
    // Not a purchase, so it must not look like one to GA4's ecommerce reports.
    for (const [, parameters] of ga.event.mock.calls) {
      expect(parameters).not.toHaveProperty('transaction_id')
      expect(parameters).not.toHaveProperty('value')
    }
  })

  it('never throws into the checkout path, even when GA4 does', async () => {
    const analytics = await loadAnalytics()
    analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })
    ga.event.mockImplementationOnce(() => {
      throw new Error('gtag is unavailable')
    })

    expect(() =>
      analytics.logCheckoutError({
        errorType: 'network',
        kind: 'gift_subscription',
        provider: 'stripe',
        stage: 'session_create',
      })
    ).not.toThrow()
  })

  it('is inert outside production', async () => {
    const analytics = await loadAnalytics()

    analytics.logCheckoutError({
      errorType: 'unknown',
      kind: 'subscription',
      provider: 'stripe',
      stage: 'redirect',
    })

    expect(ga.event).not.toHaveBeenCalled()
  })
})
