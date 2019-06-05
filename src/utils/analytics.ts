import ReactGA from 'react-ga'
import { TSupportedFaction } from 'meta/factions'

ReactGA.initialize('UA-55820654-2')

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search)
}

export const logPrintEvent = (factionName: TSupportedFaction) => {
  ReactGA.event({
    category: 'button',
    action: `print-${factionName}`,
    label: 'AoS Reminders',
  })
}

export const logFactionSwitch = (factionName: TSupportedFaction) => {
  ReactGA.event({
    category: 'select',
    action: `select-${factionName}`,
    label: 'AoS Reminders',
  })
}
