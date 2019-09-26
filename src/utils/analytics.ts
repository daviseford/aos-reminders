import ReactGA from 'react-ga'
import { isValidFactionName } from './armyUtils'
import { isTest, isProd } from './env'
import { TImportParsers } from 'types/import'

if (!isTest) {
  ReactGA.initialize('UA-55820654-5')
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
      category: 'button',
      action: `download-${factionName}`,
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
      category: 'select',
      action: `select-${factionName}`,
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
      category: 'select',
      action: `select-ally-${factionName}`,
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
      category: 'click',
      action: `click-${label}`,
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
      category: 'event',
      action: `event-${event}`,
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
      category: 'event',
      action: `failedImport-${type}-${value}`,
      label: 'AoS Reminders',
    })
  }
}
