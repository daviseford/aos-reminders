import ReactGA from 'react-ga'
import { isValidFactionName } from 'utils/armyUtils'
import { isTest, isProd, isDev } from 'utils/env'
import { TImportParsers } from 'types/import'
import { generateUUID } from 'utils/textUtils'
import { SubscriptionPlans, GiftedSubscriptionPlans } from 'components/payment/plans'

if (!isTest) {
  ReactGA.initialize('UA-55820654-5', {
    titleCase: false,
    gaOptions: { siteSpeedSampleRate: 100 },
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
 * Generic wrapper for logging events
 * Will print to console in dev, will actually log in prod
 */
const logToGA = (event: { category: string; action: string; label: string }) => {
  if (isDev) {
    console.log(`GA Event: `, event)
  } else if (isProd) {
    ReactGA.event(event)
  }
}

/**
 * Sends a Google Analytics event indicating a pdf download
 * @param factionName
 */
export const logDownloadEvent = (factionName: string | null) => {
  if (isValidFactionName(factionName)) {
    logToGA({
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
  if (isValidFactionName(factionName)) {
    logToGA({
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
  if (isValidFactionName(factionName)) {
    logToGA({
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
  if (label) {
    logToGA({
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
  if (event) {
    logToGA({
      category: 'Event',
      action: `Event-${event}`,
      label: 'AoS Reminders',
    })
  }
}

/**
 * Used for logging individual units, traits, abilities, etc
 * @param trait
 * @param name
 */
export const logIndividualSelection = (trait: string, name: string) => {
  if (name && trait) {
    logToGA({
      category: `Individual-Selection`,
      action: `${trait}-${name}`,
      label: `${trait}`,
    })
  }
}

/**
 * Sends a Google Analytics event
 * @param value
 */
export const logFailedImport = (value: string, type: TImportParsers) => {
  if (value) {
    logToGA({
      category: 'Event',
      action: `failedImport-${type}-${value}`,
      label: 'AoS Reminders',
    })
  }
}

export const logDisplay = (element: string) => {
  if (element) {
    logToGA({
      category: 'Display',
      action: `Display-${element}`,
      label: 'AoS Reminders',
    })
  }
}

export const logSubscription = (planTitle: string) => {
  const plan = SubscriptionPlans.find(x => x.title === planTitle)
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

export const logGiftedSubscription = (planTitle: string, quantity: string) => {
  const plan = GiftedSubscriptionPlans.find(x => x.title === planTitle)
  if (!isProd || !plan) return
  try {
    const id = generateUUID()
    const revenue = (parseFloat(plan.cost) * parseInt(quantity)).toFixed(2)

    ReactGA.plugin.execute('ecommerce', 'addItem', {
      id,
      name: plan.title,
      sku: plan.prod,
      price: plan.cost,
      category: 'Gifted-Subscription',
      quantity,
    })
    ReactGA.plugin.execute('ecommerce', 'addTransaction', { id, revenue })
    ReactGA.plugin.execute('ecommerce', 'send', 'ga')
    ReactGA.plugin.execute('ecommerce', 'clear', 'ga')
  } catch (err) {}
}
