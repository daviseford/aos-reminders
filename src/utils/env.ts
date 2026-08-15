export const isDev = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

export const PAYPAL_CLIENT_ID = isProd
  ? 'AfLnIE4o2jXPWtGItGIxptUDHTHfWIJS53doOYvAM2Y3-04croyYfZPxT_JR2oRAaavF14oYNtCe7IKw'
  : 'AUdnPSV280IH8pjveo62IzfQJgfFo0MoJ9w-zouTipgjAethtmcvHFjV8DXCCqoti4WHdbjhMNnwn9oa'

export const GITHUB_URL = '//github.com/daviseford/aos-reminders'

export const ROUTES = {
  CHANGELOG: '/changelog',
  FAQ: '/faq',
  HOME: '/',
  JOIN: '/join',
  PROFILE: '/profile',
  REDEEM: '/redeem',
  SUBSCRIBE: '/subscribe',
} as const
