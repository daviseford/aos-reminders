// @vitest-environment jsdom

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import config from '../../auth_config.json'
import { auth0ProviderOptions } from '../../bootstrap/auth0Options'

/*
 * An installed PWA is closed and reopened constantly, and each reopen is a cold JS context. These
 * options are the whole reason a session survives that; the SDK defaults do not. Regressing any
 * one of them signs every mobile user out on reopen, which is invisible in a desktop dev browser
 * where the blocked third-party cookie path still happens to work.
 */
describe('Auth0 session persistence', () => {
  it('caches tokens somewhere that survives closing the installed app', () => {
    expect(auth0ProviderOptions.cacheLocation).toBe('localstorage')
  })

  it('renews through refresh tokens rather than the blocked silent-auth iframe', () => {
    expect(auth0ProviderOptions.useRefreshTokens).toBe(true)
    expect(auth0ProviderOptions.useRefreshTokensFallback).toBe(false)
    expect(auth0ProviderOptions.authorizationParams.scope.split(' ')).toContain('offline_access')
  })

  it('keeps the established identity, audience, and granted scopes', () => {
    expect(auth0ProviderOptions.domain).toBe(config.domain)
    expect(auth0ProviderOptions.clientId).toBe(config.clientId)
    expect(auth0ProviderOptions.authorizationParams.audience).toBe(config.audience)
    expect(auth0ProviderOptions.authorizationParams.redirect_uri).toBe(window.location.origin)
    expect(auth0ProviderOptions.authorizationParams.scope.split(' ')).toEqual(
      expect.arrayContaining(['openid', 'profile', 'email'])
    )
  })

  it('is what the application bootstrap actually mounts the provider with', async () => {
    const main = await readFile(path.resolve(process.cwd(), 'src/main.tsx'), 'utf8')

    expect(main).toContain("import { auth0ProviderOptions } from './bootstrap/auth0Options'")
    expect(main).toContain('<Auth0Provider {...auth0ProviderOptions}')
    // A second literal prop list on the provider would silently override the spread.
    expect(main).not.toMatch(/<Auth0Provider[^>]*\bcacheLocation=/)
    expect(main).not.toMatch(/<Auth0Provider[^>]*\bauthorizationParams=/)
  })
})
