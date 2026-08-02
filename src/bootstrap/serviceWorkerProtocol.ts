/*
 * Keep these values private to this PWA generation. The CRA worker that is live before the Vite
 * cutover posts the generic Workbox `SKIP_WAITING` message as soon as it finds an update. Accepting
 * only this versioned token lets the replacement worker wait for the new app's explicit prompt.
 */
export const SERVICE_WORKER_ACTIVATION_MESSAGE = 'AOS_REMINDERS_SKIP_WAITING_V1'

export const SERVICE_WORKER_UPDATE_ACCEPTED_STORAGE_KEY = 'aos-reminders:pwa:update-accepted-at'
export const SERVICE_WORKER_UPDATE_ACCEPTANCE_MAX_AGE_MS = 5 * 60 * 1000

export const SERVICE_WORKER_ROLLBACK_QUERY_PARAM = 'aos-reminders-rollback'
export const SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY = 'aos-reminders:pwa:rollback-disabled'
