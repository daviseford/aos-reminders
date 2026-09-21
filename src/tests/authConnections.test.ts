// @vitest-environment node

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  authorizeUrl,
  classifyProbeResponse,
  formatProbeResult,
  socialConnections,
  upstreamCallbackUrl,
  type AuthConfig,
} from '../../scripts/authConnections'
import { describe, expect, it } from 'vitest'
import config from '../auth_config.json'

const customDomain: AuthConfig = {
  domain: 'auth.aosreminders.com',
  clientId: 'client-id',
  audience: 'https://api.aosreminders.com',
}
const canonicalDomain: AuthConfig = { ...customDomain, domain: 'dev-tenant.auth0.com' }

const google = socialConnections[0]
const github = socialConnections[1]

/*
 * Captured on 2026-09-21 from the production tenant (#2006), Google's OAuth client id replaced by a
 * placeholder. The authError payload is Google's own base64url message; its decoded text carries the
 * redirect_uri that Auth0 presented, which is the whole point of keeping the encoded form.
 */
const googleRejection =
  'https://accounts.google.com/signin/oauth/error?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2gSsAEKWW91IGNhbid0IHNpZ24gaW4gdG8gdGhpcyBhcHAgYmVjYXVzZSBpdCBkb2Vzbid0IGNvbXBseSB3aXRoIEdvb2dsZSdzIE9BdXRoIDIuMCBwb2xpY3kuCgpJZiB5b3UncmUgdGhlIGFwcCBkZXZlbG9wZXIsIHJlZ2lzdGVyIHRoZSByZWRpcmVjdCBVUkkgaW4gdGhlIEdvb2dsZSBDbG91ZCBDb25zb2xlLgogIBptaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvcHJvdG9jb2xzL29hdXRoMi93ZWItc2VydmVyI2F1dGhvcml6YXRpb24tZXJyb3JzLXJlZGlyZWN0LXVyaS1taXNtYXRjaCCQAyo8CgxyZWRpcmVjdF91cmkSLGh0dHBzOi8vYXV0aC5hb3NyZW1pbmRlcnMuY29tL2xvZ2luL2NhbGxiYWNr&flowName=GeneralOAuthLite&client_id=000000000000-placeholder.apps.googleusercontent.com'

const googleClient = 'client_id=000000000000-placeholder.apps.googleusercontent.com'

const googleSignIn = (callback: string) =>
  `https://accounts.google.com/v3/signin/identifier?${googleClient}&o2v=1&redirect_uri=${encodeURIComponent(
    callback
  )}&response_type=code&scope=email+profile&service=lso&flowName=GeneralOAuthLite`

const googleAccountChooser = (callback: string) =>
  `https://accounts.google.com/v3/signin/accountchooser?${googleClient}&library_name=Auth0&redirect_uri=${encodeURIComponent(
    callback
  )}&response_type=code&scope=email+profile&continue=${encodeURIComponent(
    'https://accounts.google.com/signin/oauth/consent?authuser=unknown&flowName=GeneralOAuthFlow'
  )}`

const githubClient = 'client_id=0123456789abcdef0123'

const githubAuthorize = (callback: string) =>
  `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
    callback
  )}&scope=user%3Aemail&state=state&${githubClient}`

const githubSignIn = (callback: string) =>
  `https://github.com/login?${githubClient}&return_to=${encodeURIComponent(
    `/login/oauth/authorize?${githubClient}&redirect_uri=${encodeURIComponent(callback)}&response_type=code&scope=user%3Aemail&state=state`
  )}`

const githubInvalidRedirectBody = `<!DOCTYPE html><html><head><title>Invalid Redirect URI</title></head><body>
<main><h2>Be careful!</h2><p>The redirect_uri is not associated with this application.</p>
<p>The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.</p></main></body></html>`

const page = (title: string) =>
  `<!DOCTYPE html><html><head><title>${title}</title></head><body></body></html>`

describe('Auth0 social connection probe', () => {
  it('derives the upstream callback from the configured domain and pins the production one', () => {
    expect(upstreamCallbackUrl(customDomain.domain)).toBe('https://auth.aosreminders.com/login/callback')
    expect(upstreamCallbackUrl(config.domain)).toBe('https://auth.aosreminders.com/login/callback')
  })

  it('starts the same authorize request the login popup makes, pinned to one connection', () => {
    const url = new URL(authorizeUrl(customDomain, 'google-oauth2', 'https://aosreminders.com'))
    expect(url.origin + url.pathname).toBe('https://auth.aosreminders.com/authorize')
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      client_id: 'client-id',
      response_type: 'code',
      redirect_uri: 'https://aosreminders.com',
      scope: 'openid profile email',
      audience: 'https://api.aosreminders.com',
      connection: 'google-oauth2',
    })
  })

  it('recognises Google refusing the custom-domain callback, and names the callback it refused', () => {
    const result = classifyProbeResponse(customDomain, google, {
      url: googleRejection,
      status: 200,
      body: page('Sign in with Google'),
    })
    expect(result).toEqual({
      connection: 'google-oauth2',
      status: 'callback-rejected',
      redirectUri: 'https://auth.aosreminders.com/login/callback',
      detail: 'Google answered Error 400: redirect_uri_mismatch',
    })
    expect(formatProbeResult(customDomain, google, result)).toContain(
      'register https://auth.aosreminders.com/login/callback under Google Cloud Console'
    )
  })

  it('accepts Google offering its sign-in page for the configured callback, from either landing page', () => {
    const callback = upstreamCallbackUrl(canonicalDomain.domain)
    const body = page('Sign in - Google Accounts')
    expect(
      classifyProbeResponse(canonicalDomain, google, { url: googleSignIn(callback), status: 200, body })
    ).toMatchObject({ status: 'callback-accepted', redirectUri: callback })
    expect(
      classifyProbeResponse(canonicalDomain, google, {
        url: googleAccountChooser(callback),
        status: 200,
        body,
      })
    ).toMatchObject({ status: 'callback-accepted', redirectUri: callback })
  })

  it('flags a tenant that presents another host than the configured domain', () => {
    const result = classifyProbeResponse(customDomain, google, {
      url: googleSignIn('https://dev-tenant.auth0.com/login/callback'),
      status: 200,
      body: page('Sign in - Google Accounts'),
    })
    expect(result).toMatchObject({
      status: 'wrong-callback',
      redirectUri: 'https://dev-tenant.auth0.com/login/callback',
    })
    expect(result.detail).toContain('not https://auth.aosreminders.com/login/callback')
  })

  it('recognises GitHub refusing the callback on its authorize page', () => {
    const result = classifyProbeResponse(customDomain, github, {
      url: githubAuthorize('https://auth.aosreminders.com/login/callback'),
      status: 200,
      body: githubInvalidRedirectBody,
    })
    expect(result).toEqual({
      connection: 'github',
      status: 'callback-rejected',
      redirectUri: 'https://auth.aosreminders.com/login/callback',
      detail: 'GitHub answered "Invalid Redirect URI"',
    })
  })

  it('accepts GitHub offering its authorize page for the configured callback', () => {
    const result = classifyProbeResponse(customDomain, github, {
      url: githubAuthorize('https://auth.aosreminders.com/login/callback'),
      status: 200,
      body: page('Authorize AoS Reminders'),
    })
    expect(result).toMatchObject({
      status: 'callback-accepted',
      redirectUri: 'https://auth.aosreminders.com/login/callback',
    })
  })

  it('leaves GitHub indeterminate when it demands a signed-in browser first, keeping the callback it will check', () => {
    const result = classifyProbeResponse(customDomain, github, {
      url: githubSignIn('https://auth.aosreminders.com/login/callback'),
      status: 200,
      body: page('Sign in to GitHub · GitHub'),
    })
    expect(result).toMatchObject({
      status: 'indeterminate',
      redirectUri: 'https://auth.aosreminders.com/login/callback',
    })
    expect(result.detail).toContain('signed in to GitHub')
  })

  it('separates the tenant refusing the app callback from a provider refusing the tenant callback', () => {
    const result = classifyProbeResponse(customDomain, google, {
      url: 'https://auth.aosreminders.com/authorize?client_id=client-id&redirect_uri=https%3A%2F%2Fevil.example',
      status: 403,
      body: `${page('AoS Reminders')}<h1>Callback URL mismatch.</h1>`,
    })
    expect(result).toMatchObject({ status: 'auth0-rejected' })
    expect(result.detail).toContain('Callback URL mismatch')
  })

  it('does not guess when the redirect lands somewhere unexpected', () => {
    const result = classifyProbeResponse(customDomain, google, {
      url: 'https://example.com/',
      status: 200,
      body: '',
    })
    expect(result).toMatchObject({ status: 'indeterminate' })
  })
})

describe('the documented Auth0 contract', () => {
  const doc = readFileSync(join(process.cwd(), 'docs/auth.md'), 'utf8')

  it('names the upstream callback for the configured domain so a domain change revisits the providers', () => {
    // If src/auth_config.json moves the tenant to another host, this fails until docs/auth.md, and
    // therefore the provider-side registration checklist it carries, catches up. The 2026-09-21
    // outage was exactly a domain move whose upstream callbacks nobody re-registered (#2006).
    expect(doc).toContain(upstreamCallbackUrl(config.domain))
    socialConnections.forEach(connection => expect(doc).toContain(connection.name))
  })
})
