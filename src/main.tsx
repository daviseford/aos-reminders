import 'core-js/stable' // organize-imports-ignore
import 'css/animations.scss' // organize-imports-ignore
import 'css/aos4.scss' // organize-imports-ignore
import 'css/index.scss' // organize-imports-ignore
import App from 'components/App'
import { ThemeProvider } from 'context/useTheme'
import React from 'react'
import { render } from 'react-dom'
import { installNewWorker } from 'utils/installNewWorker'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)

// Learn more about service workers: https://cra.link/PWA
// https://github.com/facebook/create-react-app/issues/5316
// https://github.com/facebook/create-react-app/issues/7237
serviceWorkerRegistration.register({
  onUpdate: async () => {
    // We post a message letting the rest of the app know that we have updated content
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('app-update')
      bc.postMessage('App has updated.')
    }

    // We prefer using the BroadcastChannel (above) as it can reach across tabs
    // But it won't always work due to browser limitations.
    // So we always dispatch an event to the window just in case.
    window.dispatchEvent(new Event('hasNewContent'))

    // Go ahead and update to the latest cached worker
    // The user will be given an option in the UI to reload and get the newest version
    // But this ensures that they'll get the new worker next time they visit
    installNewWorker()
  },
})
