import ReactGA from 'react-ga4'
import { TImportParsers, TLoadedArmy } from 'types/import'
import { TSavePdfType } from 'types/pdf'
import { TSelections } from 'types/selections'
import { isValidFactionName } from 'utils/armyUtils'
import { isDev, isProd, isTest } from 'utils/env'
import { GiftedSubscriptionPlans, SubscriptionPlans } from 'utils/plans'
import { generateUUID, titleCase } from 'utils/textUtils'

if (!isTest) {
  ReactGA.initialize('G-EM4GX294XG', {
    // titleCase: false,
    gaOptions: { siteSpeedSampleRate: 100 },
  })
  // if (isProd) ReactGA.plugin.require('ecommerce')
}

/**
 * Sends a Google Analytics event
 */
export const logPageView = () => {
  if (isProd) {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
    // ReactGA.pageview(window.location.pathname + window.location.search)
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
export const logDownloadEvent = (factionName: string | null, layout: TSavePdfType) => {
  if (isValidFactionName(factionName)) {
    logToGA({
      category: 'Button',
      action: `Download-${factionName}`,
      label: `DownloadPDF-${layout}`,
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
      label: factionName,
    })
  }
}

/**
 * Sends a Google Analytics event telling us which subfaction the user has selected
 * @param subFaction
 */
export const logSubFactionSwitch = (subFaction = '') => {
  if (!subFaction) return
  logToGA({
    category: 'Select',
    action: `Select-SubFaction-${subFaction}`,
    label: subFaction,
  })
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
      label: factionName,
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
 * This variable stores individual selections that we've already seen
 * To prevent logging duplicate selections
 */
let selectionStore: string[] = []

/**
 * Utility to reset the selectionStore
 */
export const resetAnalyticsStore = () => {
  selectionStore = []
}

/**
 * Used for logging individual units, traits, abilities, etc
 * @param trait
 * @param name
 */
export const logIndividualSelection = (trait: string, name: string, label: string) => {
  if (!name || !trait) return

  const lookup = `${trait}-${name}-${label}`

  if (selectionStore.includes(lookup)) return
  selectionStore.push(lookup)

  logToGA({
    category: `Individual-Selection`,
    action: `${trait}-${name}`,
    label,
  })
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
      label: 'FailedImport',
    })
  }
}

/**
 * Sends a Google Analytics event telling us which faction the user has attempted to load
 * @param factionName
 */
export const logInvalidFactionLookup = (factionName: string | null) => {
  if (factionName) {
    logToGA({
      category: 'Event',
      action: `InvalidFactionLookup-${factionName}`,
      label: factionName,
    })
  }
}

export const logDeprecatedImport = (value: string, type: TImportParsers) => {
  if (value) {
    logToGA({
      category: 'Event',
      action: `deprecatedImport-${type}-${value}`,
      label: 'DeprecatedImport',
    })
  }
}

export const logIgnoredImport = (value: string, type: TImportParsers) => {
  if (value) {
    logToGA({
      category: 'Event',
      action: `IgnoredImport-${type}-${value}`,
      label: 'IgnoredImport',
    })
  }
}

export const logDisplay = (element: string) => {
  if (element) {
    logToGA({
      category: 'Display',
      action: `Display-${element}`,
      label: 'Display',
    })
  }
}

export const logNote = (action: string, factionName: string) => {
  logToGA({
    category: 'Note',
    action: `${action}-Note-${factionName}`,
    label: factionName,
  })
}

export const logMigration = (version: number) => {
  logToGA({
    category: 'Migration',
    action: `Migrate-to-v${version}`,
    label: `Migrate-to-v${version}`,
  })
}

export const logSubscription = (planTitle: string, provider: 'stripe' | 'paypal') => {
  const plan = SubscriptionPlans.find(x => x.title === planTitle)
  if (!isProd || !plan) return
  try {
    const transaction_id = generateUUID()

    // https://github.com/codler/react-ga4/issues/11

    // ReactGA.gtag('event', 'addItem', {
    //   transaction_id,
    //   name: plan.title,
    //   sku: provider === 'paypal' ? plan.paypal_prod : plan.stripe_prod,
    //   price: plan.cost,
    //   category: 'Subscription',
    //   quantity: '1',
    // })

    ReactGA.gtag('event', 'purchase', {
      transaction_id,
      value: plan.cost,
      items: [
        {
          transaction_id,
          name: plan.title,
          sku: provider === 'paypal' ? plan.paypal_prod : plan.stripe_prod,
          price: plan.cost,
          category: 'Subscription',
          quantity: '1',
        },
      ],
    })

    // ReactGA.gtag('event', 'send', 'ga')
    // ReactGA.gtag('event', 'clear', 'ga')
  } catch (err) {}
}

export const logGiftedSubscription = (planTitle: string, quantity: string) => {
  const plan = GiftedSubscriptionPlans.find(x => x.title === planTitle)
  if (!isProd || !plan) return
  try {
    const transaction_id = generateUUID()
    const value = (parseFloat(plan.cost) * parseInt(quantity)).toFixed(2)

    // https://github.com/codler/react-ga4/issues/11
    // ReactGA.gtag('event', 'addItem', {
    //   transaction_id,
    //   name: plan.title,
    //   sku: plan.stripe_prod,
    //   price: plan.cost,
    //   category: 'Gifted-Subscription',
    //   quantity,
    // })
    ReactGA.gtag('event', 'purchase', {
      transaction_id,
      value,
      items: [
        {
          transaction_id,
          name: plan.title,
          sku: plan.stripe_prod,
          price: plan.cost,
          category: 'Gifted-Subscription',
          quantity,
        },
      ],
    })

    // ReactGA.gtag('event', 'send', 'ga')
    // ReactGA.gtag('event', 'clear', 'ga')
  } catch (err) {}
}

/**
 * Logs all the pertinent details of a loaded army to Google Analytics
 * @param army
 */
export const logLoadedArmy = (army: TLoadedArmy) => {
  try {
    const {
      selections = [] as unknown as TSelections,
      allySelections = {},
      origin_realm = null,
      realmscape = null,
      realmscape_feature = null,
      factionName,
    } = army

    // Log the faction name
    logFactionSwitch(factionName)

    // Log each selection
    Object.keys(selections).forEach(key => {
      const trait = titleCase(key)
      const _selections = selections[key as keyof typeof selections] || []
      _selections.forEach((name: string) => logIndividualSelection(trait, name, factionName))
    })

    // Log each allied faction + selection
    Object.keys(allySelections).forEach(allyFactionName => {
      logAllyFaction(allyFactionName)
      const _units = allySelections[allyFactionName as keyof typeof allySelections]?.units || []
      _units.forEach(name => logIndividualSelection('AlliedUnits', name, allyFactionName))
    })

    // Log Realm information
    if (origin_realm) logIndividualSelection('Realm of Origin', origin_realm, factionName)
    if (realmscape) logIndividualSelection('Realm of Battle', realmscape, factionName)
    if (realmscape_feature) logIndividualSelection('Realm Feature', realmscape_feature, factionName)
  } catch (err) {
    console.error(err)
  }
}
