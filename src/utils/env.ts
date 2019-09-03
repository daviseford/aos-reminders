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
