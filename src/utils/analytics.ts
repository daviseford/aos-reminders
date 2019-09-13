import ReactGA from 'react-ga'
import { isValidFactionName } from './armyUtils'

ReactGA.initialize('UA-55820654-5')

/**
 * Sends a Google Analytics event
 */
export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search)
}

/**
 * Sends a Google Analytics event indicating a print event
 * @param factionName
 */
export const logPrintEvent = (factionName: string | null) => {
  if (isValidFactionName(factionName)) {
    ReactGA.event({
      category: 'button',
      action: `print-${factionName}`,
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
  if (isValidFactionName(factionName)) {
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
  if (!!label) {
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
  if (!!event) {
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
export const logFailedImport = (value: string) => {
  if (!!value) {
    ReactGA.event({
      category: 'event',
      action: `failedImport-${value}`,
      label: 'AoS Reminders',
    })
  }
}
