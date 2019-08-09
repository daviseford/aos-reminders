import ReactGA from 'react-ga'
import { TSupportedFaction, SUPPORTED_FACTIONS } from 'meta/factions'

ReactGA.initialize('UA-55820654-2')

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
export const logPrintEvent = (factionName: TSupportedFaction) => {
  if (SUPPORTED_FACTIONS.includes(factionName)) {
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
export const logFactionSwitch = (factionName: TSupportedFaction) => {
  if (SUPPORTED_FACTIONS.includes(factionName)) {
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
export const logAllyFaction = (factionName: TSupportedFaction) => {
  if (SUPPORTED_FACTIONS.includes(factionName)) {
    ReactGA.event({
      category: 'select',
      action: `select-ally-${factionName}`,
      label: 'AoS Reminders',
    })
  }
}
