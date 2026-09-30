// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const ga = vi.hoisted(() => ({
  event: vi.fn(),
  initialize: vi.fn(),
  send: vi.fn(),
}))

vi.mock('react-ga4', () => ({ default: ga }))

const CLAIM = 'https://aosreminders.com/signed_up_at'
const NOW = Date.parse('2026-09-30T12:00:00.000Z')
const JUST_CREATED = '2026-09-30T11:59:30.000Z'

// A fresh module graph is a page load: the in-memory session record starts empty, storage persists.
const loadPage = async () => {
  vi.resetModules()
  const analytics = await import('utils/analytics')
  analytics.initializeAnalytics({ hostname: 'aosreminders.com', isProduction: true })
  return import('utils/signUpTracking')
}

const memoryStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

const throwingStorage = {
  getItem: () => {
    throw new Error('SecurityError')
  },
  setItem: () => {
    throw new Error('QuotaExceededError')
  },
}

const newUser = (sub = 'auth0|64f0c0ffee', createdAt = JUST_CREATED) => ({
  email: 'someone@example.com',
  name: 'Someone',
  sub,
  [CLAIM]: createdAt,
})

const signUpEvents = () => ga.event.mock.calls.filter(([name]) => name === 'sign_up')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('sign_up tracking', () => {
  it('sends one sign_up carrying only the sign-in method for a newly created account', async () => {
    const { trackSignUp } = await loadPage()

    expect(trackSignUp(newUser(), { now: NOW, storage: memoryStorage() })).toBe(true)

    expect(ga.event).toHaveBeenCalledTimes(1)
    expect(ga.event).toHaveBeenCalledWith('sign_up', { method: 'email' })
    const payload = JSON.stringify(ga.event.mock.calls)
    expect(payload).not.toContain('someone@example.com')
    expect(payload).not.toContain('64f0c0ffee')
    expect(payload).not.toContain(JUST_CREATED)
  })

  it('sends nothing for a returning login, whose token carries no new-account claim', async () => {
    const { trackSignUp } = await loadPage()
    const storage = memoryStorage()

    expect(
      trackSignUp({ email: 'someone@example.com', sub: 'auth0|64f0c0ffee' }, { now: NOW, storage })
    ).toBe(false)
    expect(trackSignUp(undefined, { now: NOW, storage })).toBe(false)
    expect(ga.event).not.toHaveBeenCalled()
  })

  it('sends nothing when the claim names an account created outside the freshness window', async () => {
    const { SIGN_UP_FRESHNESS_MS, trackSignUp } = await loadPage()
    const storage = memoryStorage()
    const old = new Date(NOW - SIGN_UP_FRESHNESS_MS - 1).toISOString()
    const future = new Date(NOW + SIGN_UP_FRESHNESS_MS + 1).toISOString()

    expect(trackSignUp(newUser('auth0|a', old), { now: NOW, storage })).toBe(false)
    expect(trackSignUp(newUser('auth0|b', future), { now: NOW, storage })).toBe(false)
    expect(trackSignUp({ sub: 'auth0|c', [CLAIM]: 'not a date' }, { now: NOW, storage })).toBe(false)
    expect(trackSignUp({ sub: 'auth0|d', [CLAIM]: true }, { now: NOW, storage })).toBe(false)
    expect(ga.event).not.toHaveBeenCalled()
  })

  it('does not send again when the same account is seen again in the page or after a reload', async () => {
    const storage = memoryStorage()
    const first = await loadPage()

    expect(first.trackSignUp(newUser(), { now: NOW, storage })).toBe(true)
    // The Auth0 user object is re-published (callback handling, a second render, a token refresh).
    expect(first.trackSignUp(newUser(), { now: NOW + 1_000, storage })).toBe(false)

    // The cached ID token survives a reload and still carries the claim.
    const reloaded = await loadPage()
    expect(reloaded.trackSignUp(newUser(), { now: NOW + 60_000, storage })).toBe(false)

    expect(signUpEvents()).toHaveLength(1)
  })

  it('counts a second new account created later in the same browser', async () => {
    const { trackSignUp } = await loadPage()
    const storage = memoryStorage()

    expect(trackSignUp(newUser('auth0|first'), { now: NOW, storage })).toBe(true)
    expect(
      trackSignUp(newUser('github|second', '2026-09-30T12:30:00.000Z'), {
        now: Date.parse('2026-09-30T12:30:05.000Z'),
        storage,
      })
    ).toBe(true)

    expect(signUpEvents()).toEqual([
      ['sign_up', { method: 'email' }],
      ['sign_up', { method: 'github' }],
    ])
  })

  it('still sends at most once per page when browser storage throws', async () => {
    const { trackSignUp } = await loadPage()

    expect(trackSignUp(newUser(), { now: NOW, storage: throwingStorage })).toBe(true)
    expect(trackSignUp(newUser(), { now: NOW, storage: throwingStorage })).toBe(false)
    expect(signUpEvents()).toHaveLength(1)
  })

  it('sends nothing to GA4 off the production hosts', async () => {
    vi.resetModules()
    const analytics = await import('utils/analytics')
    analytics.initializeAnalytics({ hostname: 'localhost', isProduction: true })
    const { trackSignUp } = await import('utils/signUpTracking')

    trackSignUp(newUser(), { now: NOW, storage: memoryStorage() })

    expect(ga.initialize).not.toHaveBeenCalled()
    expect(ga.event).not.toHaveBeenCalled()
  })

  it.each([
    ['auth0|64f0c0ffee', 'email'],
    ['google-oauth2|1098', 'google'],
    ['github|4521', 'github'],
    ['windowslive|77', 'other'],
    [undefined, 'other'],
  ] as const)('maps the subject %s to the method %s', async (sub, method) => {
    const { signUpMethod } = await loadPage()
    expect(signUpMethod(sub)).toBe(method)
  })
})
