/*
 * Auth0 connection contract for the custom domain.
 *
 * The app reaches the tenant through auth.aosreminders.com (src/auth_config.json). Every upstream
 * identity provider behind a social connection has to know that host too: Auth0 sends Google and
 * GitHub `https://<domain>/login/callback` as the OAuth redirect_uri, and each provider only honours
 * the callbacks registered on its own side. Nothing in this repository can register them, so this
 * module describes the requests and classifies what the providers answer. The runner in
 * verifyAuthConnections.ts performs the requests; the classifier here is pure so it can be tested
 * against captured responses (see src/tests/authConnections.test.ts and docs/auth.md).
 */

export interface AuthConfig {
  domain: string
  clientId: string
  audience: string
}

export interface SocialConnection {
  /** Auth0 connection name, as sent in the `connection` authorize parameter. */
  name: string
  /** Hostname of the upstream provider the tenant redirects to. */
  providerHost: string
  /** Where the callback is registered on the provider's side. */
  registeredAt: string
}

export const socialConnections: readonly SocialConnection[] = [
  {
    name: 'google-oauth2',
    providerHost: 'accounts.google.com',
    registeredAt:
      'Google Cloud Console, APIs & Services, Credentials, the OAuth 2.0 client, Authorized redirect URIs',
  },
  {
    name: 'github',
    providerHost: 'github.com',
    registeredAt: 'GitHub, Settings, Developer settings, OAuth Apps, Authorization callback URL',
  },
]

/** The redirect_uri Auth0 presents to every upstream provider on behalf of the tenant. */
export const upstreamCallbackUrl = (domain: string) => `https://${domain}/login/callback`

/**
 * The `/authorize` request the app's login popup makes, pinned to one connection so the tenant
 * skips the hosted login page and redirects straight to the provider.
 */
export const authorizeUrl = (config: AuthConfig, connection: string, appOrigin: string) => {
  const url = new URL(`https://${config.domain}/authorize`)
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', appOrigin)
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('audience', config.audience)
  url.searchParams.set('connection', connection)
  url.searchParams.set('state', 'aos-reminders-auth-probe')
  return url.toString()
}

export type ProbeStatus =
  /** The provider accepted the callback and offered its sign-in page. */
  | 'callback-accepted'
  /** The provider refused the callback: it is not registered on the provider's side. */
  | 'callback-rejected'
  /** The provider accepted a callback, but not the one the configured domain implies. */
  | 'wrong-callback'
  /** The tenant refused the request itself (application callback allowlist, unknown connection). */
  | 'auth0-rejected'
  /** The provider wants a signed-in browser before it validates anything; verify by hand. */
  | 'indeterminate'

export interface ProbeResponse {
  /** Final URL after following every redirect. */
  url: string
  status: number
  body: string
}

export interface ProbeResult {
  connection: string
  status: ProbeStatus
  /** The callback the provider saw, when the response reveals it. */
  redirectUri?: string
  detail: string
}

const callbackPattern = /https?:\/\/[^\s"'<>]+\/login\/callback/

/** Google encodes its OAuth error as base64url protobuf; the message text and redirect_uri are plain inside. */
const decodeGoogleAuthError = (authError: string) => {
  const padded = authError.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(padded, 'base64').toString('latin1')
}

const nestedParam = (url: URL, wrapper: string, name: string) => {
  const inner = url.searchParams.get(wrapper)
  if (!inner) return null
  try {
    return new URL(inner, url.origin).searchParams.get(name)
  } catch {
    return null
  }
}

const titleOf = (body: string) => body.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim()

const classifyGoogle = (url: URL, body: string): Omit<ProbeResult, 'connection'> => {
  if (url.pathname === '/signin/oauth/error') {
    const decoded = decodeGoogleAuthError(url.searchParams.get('authError') || '')
    const redirectUri = decoded.match(callbackPattern)?.[0]
    if (/redirect_uri_mismatch/.test(decoded)) {
      return {
        status: 'callback-rejected',
        redirectUri,
        detail: 'Google answered Error 400: redirect_uri_mismatch',
      }
    }
    return {
      status: 'indeterminate',
      redirectUri,
      detail: `Google answered an OAuth error: ${decoded.slice(0, 120)}`,
    }
  }
  const redirectUri = url.searchParams.get('redirect_uri') ?? nestedParam(url, 'continue', 'redirect_uri')
  if (redirectUri) {
    return {
      status: 'callback-accepted',
      redirectUri,
      detail: `Google offered ${titleOf(body) || 'its sign-in page'}`,
    }
  }
  return { status: 'indeterminate', detail: `Google answered ${url.pathname} without a redirect_uri` }
}

const classifyGitHub = (url: URL, body: string): Omit<ProbeResult, 'connection'> => {
  if (url.pathname === '/login/oauth/authorize') {
    const redirectUri = url.searchParams.get('redirect_uri') ?? undefined
    if (/redirect_uri is not associated with this application/i.test(body)) {
      return { status: 'callback-rejected', redirectUri, detail: 'GitHub answered "Invalid Redirect URI"' }
    }
    return {
      status: 'callback-accepted',
      redirectUri,
      detail: `GitHub offered ${titleOf(body) || 'its authorize page'}`,
    }
  }
  if (url.pathname === '/login') {
    const redirectUri = nestedParam(url, 'return_to', 'redirect_uri') ?? undefined
    return {
      status: 'indeterminate',
      redirectUri,
      detail:
        'GitHub asks for a signed-in browser before it validates the callback; try Continue with GitHub while signed in to GitHub',
    }
  }
  return { status: 'indeterminate', detail: `GitHub answered ${url.pathname}` }
}

export const classifyProbeResponse = (
  config: AuthConfig,
  connection: SocialConnection,
  response: ProbeResponse
): ProbeResult => {
  const url = new URL(response.url)
  const expected = upstreamCallbackUrl(config.domain)

  if (url.hostname === config.domain) {
    const reason = /callback url mismatch/i.test(response.body)
      ? 'Callback URL mismatch: the app origin is not an allowed callback on the Auth0 application'
      : `HTTP ${response.status} from the tenant (${titleOf(response.body) || url.pathname})`
    return { connection: connection.name, status: 'auth0-rejected', detail: reason }
  }
  if (url.hostname !== connection.providerHost) {
    return {
      connection: connection.name,
      status: 'indeterminate',
      detail: `expected ${connection.providerHost}, reached ${url.hostname}`,
    }
  }

  const classified =
    connection.providerHost === 'accounts.google.com'
      ? classifyGoogle(url, response.body)
      : classifyGitHub(url, response.body)

  if (classified.status === 'callback-accepted' && classified.redirectUri !== expected) {
    return {
      connection: connection.name,
      status: 'wrong-callback',
      redirectUri: classified.redirectUri,
      detail: `the provider saw ${classified.redirectUri}, not ${expected}; the tenant is not answering as ${config.domain}`,
    }
  }
  return { connection: connection.name, ...classified }
}

export const formatProbeResult = (config: AuthConfig, connection: SocialConnection, result: ProbeResult) => {
  const lines = [`${result.connection}: ${result.status} (${result.detail})`]
  if (result.status === 'callback-rejected') {
    lines.push(`  register ${upstreamCallbackUrl(config.domain)} under ${connection.registeredAt}`)
  }
  return lines.join('\n')
}
