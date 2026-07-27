import ReactGA from 'react-ga4'

const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD
const isTest = import.meta.env.MODE === 'test'

if (!isTest) {
  ReactGA.initialize('G-EM4GX294XG', {
    gaOptions: { siteSpeedSampleRate: 100 },
  })
}

export const logEvent = (event: string): void => {
  if (!event) return

  const payload = {
    category: 'Event',
    action: `Event-${event}`,
    label: 'AoS Reminders',
  }

  if (isDevelopment) {
    console.log('GA Event: ', payload)
  } else if (isProduction) {
    ReactGA.event(payload)
  }
}
