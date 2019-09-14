/**
 * There is a special built-in environment variable called NODE_ENV.
 *
 * When you run `yarn start`, it is always equal to 'development',
 * when you run `yarn test` it is always equal to 'test',
 * and when you run `yarn build` to make a production bundle,
 * it is always equal to 'production'.
 *
 * You cannot override NODE_ENV manually.
 */
export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

export const STRIPE_KEY = isProd
  ? 'pk_live_wFgX8L9sjPz6S9eLxfd4c0sR00beXWRLyZ'
  : 'pk_test_ZqzFFxNXK1SD7PANrrk6cVmE00SokPm82b'

export const BASE_URL = isProd ? `https://aosreminders.com` : `http://localhost:3000`
