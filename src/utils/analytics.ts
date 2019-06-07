import ReactGA from 'react-ga'
import { TSupportedFaction } from 'meta/factions'

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
  ReactGA.event({
    category: 'button',
    action: `print-${factionName}`,
    label: 'AoS Reminders',
  })
}

/**
 * Sends a Google Analytics event telling us which faction the user has selected
 * @param factionName
 */
export const logFactionSwitch = (factionName: TSupportedFaction) => {
  ReactGA.event({
    category: 'select',
    action: `select-${factionName}`,
    label: 'AoS Reminders',
  })
}
