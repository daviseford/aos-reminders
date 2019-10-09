import ReactGA from 'react-ga'
import { isValidFactionName } from './armyUtils'
import { isTest, isProd } from './env'
import { TImportParsers } from 'types/import'
import { generateUUID } from './textUtils'
import { SupportPlans } from 'components/payment/plans'

if (!isTest) {
  ReactGA.initialize('UA-55820654-5', {
    titleCase: false,
  })
  if (isProd) ReactGA.plugin.require('ecommerce')
}

/**
 * Sends a Google Analytics event
 */
export const logPageView = () => {
  if (isProd) {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }
}

/**
 * Sends a Google Analytics event indicating a pdf download
 * @param factionName
 */
export const logDownloadEvent = (factionName: string | null) => {
  if (isProd && isValidFactionName(factionName)) {
    ReactGA.event({
      category: 'Button',
      action: `Download-${factionName}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Sends a Google Analytics event telling us which faction the user has selected
 * @param factionName
 */
export const logFactionSwitch = (factionName: string | null) => {
  if (isProd && isValidFactionName(factionName)) {
    ReactGA.event({
      category: 'Select',
      action: `Select-${factionName}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Sends a Google Analytics event telling us which allied faction the user has selected
 * @param factionName
 */
export const logAllyFaction = (factionName: string | null) => {
  if (isProd && isValidFactionName(factionName)) {
    ReactGA.event({
      category: 'Select',
      action: `Select-Ally-${factionName}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Sends a Google Analytics event telling us about a click event
 * @param label
 */
export const logClick = (label: string) => {
  if (isProd && !!label) {
    ReactGA.event({
      category: 'Click',
      action: `Click-${label}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Sends a Google Analytics event
 * @param event
 */
export const logEvent = (event: string) => {
  if (isProd && !!event) {
    ReactGA.event({
      category: 'Event',
      action: `Event-${event}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Sends a Google Analytics event
 * @param value
 */
export const logFailedImport = (value: string, type: TImportParsers) => {
  if (isProd && !!value) {
    ReactGA.event({
      category: 'Event',
      action: `failedImport-${type}-${value}`,
      label: 'AoS Reminders',
    })
  }
}

export const logSubscription = (planTitle: string) => {
  const plan = SupportPlans.find(x => x.title === planTitle)
  if (!isProd || !plan) return
  try {
    const id = generateUUID()
    ReactGA.plugin.execute('ecommerce', 'addItem', {
      id,
      name: plan.title,
      sku: plan.prod,
      price: plan.cost,
      category: 'Subscription',
      quantity: '1',
    })
    ReactGA.plugin.execute('ecommerce', 'addTransaction', { id, revenue: plan.cost })
    ReactGA.plugin.execute('ecommerce', 'send', 'ga')
    ReactGA.plugin.execute('ecommerce', 'clear', 'ga')
  } catch (err) {}
}
