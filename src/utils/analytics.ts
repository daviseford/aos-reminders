import ReactGA from 'react-ga4'
import type { Aos4ImportSource } from '../aos4/import'
import type { PrintPageSize } from '../aos4/print/presets'
import type { PrintPreset } from '../aos4/print/types'

const MEASUREMENT_ID = 'G-EM4GX294XG'
const PRODUCTION_HOSTS = new Set(['aosreminders.com', 'www.aosreminders.com'])
const isTest = import.meta.env.MODE === 'test'

let initialized = false

export interface AnalyticsEnvironment {
  hostname: string
  isProduction: boolean
}

interface PageLocation {
  pathname: string
}

interface TrackedLocation extends PageLocation {
  key: string
}

interface PageViewRouter {
  state: { location: TrackedLocation }
  subscribe: (listener: (state: { location: TrackedLocation }) => void) => () => void
}

export interface AnalyticsCommerceItem {
  item_category: 'subscription' | 'gift_subscription'
  item_id: string
  item_name: string
  price: number
  quantity: number
}

interface CheckoutEvent {
  items: AnalyticsCommerceItem[]
  provider: 'paypal' | 'stripe'
}

interface PurchaseEvent extends CheckoutEvent {
  transactionId: string
}

type AnalyticsParameters = Record<string, unknown>

const currentEnvironment = (): AnalyticsEnvironment => ({
  hostname: typeof window === 'undefined' ? '' : window.location.hostname,
  isProduction: import.meta.env.PROD,
})

export const canCollectAnalytics = ({ hostname, isProduction }: AnalyticsEnvironment): boolean =>
  isProduction && PRODUCTION_HOSTS.has(hostname.toLowerCase())

export const initializeAnalytics = (environment = currentEnvironment()): boolean => {
  if (initialized || !canCollectAnalytics(environment)) return false

  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: { siteSpeedSampleRate: 100 },
    gtagOptions: { send_page_view: false },
  })
  initialized = true
  return true
}

const logToGA = (name: string, parameters: AnalyticsParameters = {}): void => {
  if (!isTest && import.meta.env.DEV) console.debug('GA4 Event:', name, parameters)
  if (initialized) ReactGA.event(name, parameters)
}

const sanitizedPath = (pathname: string): string => (pathname.startsWith('/') ? pathname : '/')

export const logPageView = ({ pathname }: PageLocation): void => {
  if (!initialized || typeof window === 'undefined' || typeof document === 'undefined') return
  const page = sanitizedPath(pathname)
  ReactGA.send({
    hitType: 'pageview',
    location: `${window.location.origin}${page}`,
    page,
    title: document.title,
  })
}

/*
 * router.subscribe fires on every router state update, not just navigations. The location key
 * changes exactly once per navigation, which preserves the old history.listen semantics of one
 * page view per navigation (and per the initial load).
 */
export const startPageViewTracking = (router: PageViewRouter): (() => void) => {
  if (!initialized) return () => undefined
  logPageView(router.state.location)
  let lastLocationKey = router.state.location.key
  return router.subscribe(({ location }) => {
    if (location.key === lastLocationKey) return
    lastLocationKey = location.key
    logPageView(location)
  })
}

export const logClick = (interactionName: string): void => {
  logToGA('ui_interaction', { interaction_name: interactionName })
}

export const logThemeChange = (themeName: string): void => {
  logToGA('theme_change', { theme_name: themeName })
}

export const logBannerView = (bannerName: string): void => {
  logToGA('banner_view', { banner_name: bannerName })
}

export const logBannerClose = (bannerName: string): void => {
  logToGA('banner_close', { banner_name: bannerName })
}

export const logGameModeChange = (isGameMode: boolean): void => {
  logToGA('game_mode_change', { game_mode: isGameMode ? 'play' : 'edit' })
}

export const logFactionSelection = (factionId: string, factionName: string): void => {
  logToGA('select_content', {
    content_type: 'faction',
    faction_name: factionName,
    item_id: factionId,
  })
}

export const logPdfDownload = (layout: PrintPreset['id'], pageSize: PrintPageSize): void => {
  logToGA('file_download', {
    file_extension: 'pdf',
    file_name: `reminders-${layout}-${pageSize}.pdf`,
    print_layout: layout,
    print_page_size: pageSize,
  })
}

export const logRosterImport = ({
  diagnosticCount,
  outcome,
  selectionCount,
  source,
}: {
  diagnosticCount: number
  outcome: 'error' | 'success'
  selectionCount: number
  source: Aos4ImportSource | 'unknown'
}): void => {
  logToGA('roster_import', {
    diagnostic_count: diagnosticCount,
    import_outcome: outcome,
    roster_source: source,
    selection_count: selectionCount,
  })
}

export const logAccountAction = (
  accountAction: 'coupon_redeemed' | 'gift_redeemed' | 'subscription_cancelled'
): void => {
  logToGA('account_action', { account_action: accountAction })
}

export const logLoginAttempt = (loginOrigin: string, outcome: 'closed' | 'started'): void => {
  logToGA(outcome === 'started' ? 'login_start' : 'login_closed', { login_origin: loginOrigin })
}

export const logBeginCheckout = ({ items, provider }: CheckoutEvent): void => {
  logToGA('begin_checkout', {
    currency: 'USD',
    items,
    payment_provider: provider,
    value: commerceValue(items),
  })
}

export const logPurchase = ({ items, provider, transactionId }: PurchaseEvent): void => {
  if (!transactionId.trim()) return
  logToGA('purchase', {
    currency: 'USD',
    items,
    payment_provider: provider,
    transaction_id: transactionId,
    value: commerceValue(items),
  })
}

export const logCheckoutCancelled = ({ items, provider }: CheckoutEvent): void => {
  logToGA('checkout_cancelled', {
    items,
    payment_provider: provider,
    value: commerceValue(items),
  })
}

const commerceValue = (items: AnalyticsCommerceItem[]): number =>
  Number(items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2))
