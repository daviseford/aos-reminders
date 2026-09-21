/*
 * Read-only probe of the live Auth0 tenant's social connections (docs/auth.md).
 *
 * For each social connection it starts the same /authorize request the login popup makes, follows
 * the tenant's redirect to the provider, and reports whether the provider accepted the callback
 * https://<domain>/login/callback. No credentials, no account, nothing is written anywhere: the
 * flow stops on the provider's sign-in page (or its refusal) exactly where a user would see it.
 *
 *   yarn auth:verify-connections                 # the domain in src/auth_config.json
 *   yarn auth:verify-connections dev-tenant.auth0.com
 *
 * Exit status 1 when any provider rejects the callback or the tenant answers as another host.
 * GitHub validates the callback only for a signed-in browser, so it can report `indeterminate`
 * here; that case is checked by hand, as the docs describe.
 */
import config from '../src/auth_config.json'
import {
  authorizeUrl,
  classifyProbeResponse,
  formatProbeResult,
  socialConnections,
  type AuthConfig,
  type ProbeResponse,
} from './authConnections'

const appOrigin = 'https://aosreminders.com'
// Google and GitHub serve their interactive pages to browsers; a bare fetch UA gets an API-ish answer.
const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

const probe = async (url: string): Promise<ProbeResponse> => {
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': userAgent } })
  return { url: response.url, status: response.status, body: await response.text() }
}

const run = async () => {
  const domain = process.argv[2] || config.domain
  const auth: AuthConfig = { ...config, domain }
  console.log(`Probing ${domain} for ${socialConnections.map(connection => connection.name).join(', ')}`)

  let failed = false
  for (const connection of socialConnections) {
    const result = classifyProbeResponse(
      auth,
      connection,
      await probe(authorizeUrl(auth, connection.name, appOrigin))
    )
    console.log(formatProbeResult(auth, connection, result))
    if (
      result.status === 'callback-rejected' ||
      result.status === 'wrong-callback' ||
      result.status === 'auth0-rejected'
    ) {
      failed = true
    }
  }
  if (failed) process.exitCode = 1
}

run().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
