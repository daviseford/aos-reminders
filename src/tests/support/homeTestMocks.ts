import { vi } from 'vitest'

/**
 * The mock trio five Home test suites carried byte-for-byte before this: an unauthenticated Auth0
 * session, a 404 subscription lookup (no subscriber account), and a no-op PWA registration. All
 * three stand in for a dependency none of those suites is actually testing.
 *
 * These are exported as factory *values* rather than as `vi.mock` calls, because a `vi.mock` call is
 * hoisted above every import in the file that makes it — including the import of this module — so a
 * factory imported from here and handed to `vi.mock` directly throws `ReferenceError: Cannot access
 * '...' before initialization`: the import binding is still in its temporal dead zone when the
 * hoisted call runs. What each test file does instead is call `vi.mock(specifier, async () => {...})`
 * itself (satisfying "the vi.mock call stays in the file") and `await import()` this module from
 * inside that async factory — a dynamic import is not subject to the same hoisting, because it only
 * resolves once the mocked module is actually requested, by which point this module has already
 * loaded. See the five Home suites for the pattern.
 *
 * `homePresentation.test.tsx` and `cloudArmyLinkReconciliation.test.tsx` mock `@auth0/auth0-react`
 * and `../../api/subscriptionApi` themselves rather than importing `auth0DisabledMockValue` /
 * `subscriptionApiNotFoundMockValue`: both close over `vi.hoisted` state (an authenticated user, a
 * spy-able `getSubscription`) that later assertions in those files mutate and inspect, so the mock
 * bodies genuinely differ rather than merely looking different. Only `pwaRegisterMockValue` is
 * shared with them — it is inert in every file that uses it, including those two.
 */

export const auth0DisabledMockValue = () => ({
  getAccessTokenSilently: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: undefined,
})

export const subscriptionApiNotFoundMockValue = () => ({
  cancelSubscription: vi.fn(),
  getSubscription: vi.fn().mockRejectedValue({ status: 404 }),
  updateTheme: vi.fn(),
})

export const pwaRegisterMockValue = () => ({
  registerSW: vi.fn(() => vi.fn(async () => undefined)),
})
