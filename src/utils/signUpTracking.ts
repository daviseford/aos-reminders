import { logSignUp, type SignUpMethod } from 'utils/analytics'

/*
 * The browser cannot tell a new account from a returning login: Auth0's hosted page handles both and
 * the standard ID token claims look the same. The signal comes from an Auth0 post-login Action that
 * adds this claim, holding the account's created_at, only on the account's first interactive login
 * (docs/auth.md, "New-account signal"). Until that Action exists the claim is absent and nothing is
 * sent.
 */
export const SIGN_UP_CLAIM = 'https://aosreminders.com/signed_up_at'

const RECORDED_KEY = 'aos-reminders-sign-up-recorded'

/*
 * A new account's first login happens within moments of its creation. The window guards against an
 * Action that marks more than the first login: an old account is never counted, whatever the claim.
 */
export const SIGN_UP_FRESHNESS_MS = 60 * 60 * 1000

interface SignUpUser {
  sub?: string
  [claim: string]: unknown
}

type RecordStorage = Pick<Storage, 'getItem' | 'setItem'>

// Covers a browser whose storage throws, so one page session still sends at most one event.
const recordedThisSession = new Set<string>()

const browserStorage = (): RecordStorage | undefined => {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

// Only the connection prefix of the subject is read; the id itself never leaves this function.
export const signUpMethod = (sub: string | undefined): SignUpMethod => {
  const connection = sub?.split('|', 1)[0]
  if (connection === 'auth0') return 'email'
  if (connection === 'google-oauth2') return 'google'
  if (connection === 'github') return 'github'
  return 'other'
}

const alreadyRecorded = (marker: string, storage: RecordStorage | undefined): boolean => {
  if (recordedThisSession.has(marker)) return true
  try {
    return storage?.getItem(RECORDED_KEY) === marker
  } catch {
    return false
  }
}

const remember = (marker: string, storage: RecordStorage | undefined): void => {
  recordedThisSession.add(marker)
  try {
    storage?.setItem(RECORDED_KEY, marker)
  } catch {
    // The in-memory record still covers this page session.
  }
}

/*
 * Sends sign_up at most once per new account per browser. The cached ID token keeps the claim, so a
 * reload, a second tab, or a refreshed token presents it again; the stored marker absorbs those.
 * Returns whether the event was sent.
 */
export const trackSignUp = (
  user: SignUpUser | undefined,
  { now = Date.now(), storage = browserStorage() }: { now?: number; storage?: RecordStorage } = {}
): boolean => {
  const marker = user?.[SIGN_UP_CLAIM]
  if (typeof marker !== 'string') return false

  const createdAt = Date.parse(marker)
  if (Number.isNaN(createdAt) || Math.abs(now - createdAt) > SIGN_UP_FRESHNESS_MS) return false
  if (alreadyRecorded(marker, storage)) return false

  remember(marker, storage)
  logSignUp(signUpMethod(user?.sub))
  return true
}
