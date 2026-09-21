# Authentication: the Auth0 contract

How login, the custom domain, the social connections, and password recovery fit together, and what
outside this repository has to agree with `src/auth_config.json`. Nothing here is a secret; every
identifier below is one the browser already sends in the clear.

## The pieces

- **Tenant and application.** `src/auth_config.json` holds the Auth0 domain, the SPA client id, and
  the API audience `https://api.aosreminders.com`. `src/main.tsx` mounts `Auth0Provider` with
  refresh tokens in localstorage (#1944) and `redirect_uri: window.location.origin`.
- **Custom domain.** The app reaches the tenant as `auth.aosreminders.com` (#1945). It is the same
  tenant and the same signing keys as the canonical `dev-*.auth0.com` host; the custom domain is
  same-site with the app, so the Auth0 session cookie is first-party. Tokens carry
  `iss https://auth.aosreminders.com/`, which both API Gateway JWT authorizers pin. The canonical host
  still answers, and a token it mints is rejected by the APIs (#1946).
- **Login.** `Log in` in the navbar opens a pre-sized popup (`src/utils/openPopup.ts`) and hands it
  to `loginWithPopup` (`src/utils/hooks/useLogin.tsx`). The popup shows Auth0's hosted Universal
  Login: email and password on the `Username-Password-Authentication` database connection, plus
  `Continue with Google` (`google-oauth2`) and `Continue with GitHub` (`github`). `/profile` is
  guarded by `withAuthenticationRequired`, which uses the redirect flow.
- **Callback URLs, two layers.** There are two different "callback" allowlists, and they fail in
  different places:
  1. The **Auth0 application's Allowed Callback URLs** validate the app's `redirect_uri`. A miss is
     Auth0's own `Callback URL mismatch` page, before any login form. The list holds the bare
     origin `https://aosreminders.com` (plus `/subscribe`, `/join`, `/redeem`, the `www` origin,
     and the local dev origins). The popup flow never loads `redirect_uri`, so the app always sends
     the origin (#2006); a new route needs nothing registered.
  2. Each **social provider's registered redirect URIs** validate the callback *Auth0* presents on
     the tenant's behalf: `https://auth.aosreminders.com/login/callback`. A miss surfaces on the
     provider's page, after the user picked `Continue with Google`/`GitHub`, and reads as
     "the app sent an invalid request" or "the redirect_uri is not associated with this
     application". The app cannot influence this; only the provider console can.

## What must know the custom domain

Changing `domain` in `src/auth_config.json` is a cutover with three external halves. The API
authorizers (#1945) are the one this repository already documents; the other two are the provider
registrations. `src/tests/authConnections.test.ts` fails when the domain in the config no longer
matches the callback written here, which is the reminder to walk this list again.

| Where | What must contain `https://auth.aosreminders.com/login/callback` |
| --- | --- |
| Google Cloud Console, APIs & Services, Credentials, the OAuth 2.0 client the `google-oauth2` connection uses | Authorized redirect URIs |
| GitHub, Settings, Developer settings, OAuth Apps, the app the `github` connection uses | Authorization callback URL |
| Auth0 dashboard, Authentication, Social, each connection | nothing to add here: the connection presents whichever host the request arrived on |

Keep the canonical `https://dev-4yesv5fz.auth0.com/login/callback` registered alongside it; it costs
nothing and keeps the control probe below meaningful.

## Verifying without credentials

`yarn auth:verify-connections` (`scripts/verifyAuthConnections.ts`) starts the exact `/authorize`
request the popup makes, pinned to one connection at a time, follows the tenant's redirect to the
provider, and classifies the provider's answer. It signs nothing in and writes nothing; the flow
stops on the provider's sign-in page, or on its refusal, exactly where a user would see it.

- `callback-accepted`: the provider offered its sign-in page for the configured callback.
- `callback-rejected`: the provider refused the callback; the output names where to register it.
- `wrong-callback`: the provider accepted a callback, but not the configured domain's. The tenant
  is answering as another host.
- `auth0-rejected`: the tenant refused the request itself (layer 1 above).
- `indeterminate`: GitHub only validates the callback for a signed-in browser, so from a script it
  always reports this. Check GitHub by hand: signed in to GitHub, open the site, `Log in`,
  `Continue with GitHub`; GitHub's authorize page is a pass, "Invalid Redirect URI" is a fail.

`yarn auth:verify-connections dev-4yesv5fz.auth0.com` is the control: the canonical host with the
same connections.

## Password recovery

`Reset password` on the hosted login page requests an email for the
`Username-Password-Authentication` connection only. Two consequences shape support answers:

- An account created through `Continue with Google` or `Continue with GitHub` has no database
  identity and therefore no password. Auth0 still shows the same "check your email" confirmation,
  and sends nothing, so it cannot be used to enumerate accounts. The FAQ entry "I can't recover my
  password!" points those users back to the social button. Which kind of account someone has is
  visible only in the Auth0 dashboard: User Management, Users, search the email, then the
  connection on the identity.
- For a database user who reports no email, the tenant log is the evidence: Monitoring, Logs,
  filter by the email; a `Success Change Password Request` without a `Failed Sending Notification`
  means Auth0 handed the message to the email provider. The provider itself is under Branding,
  Email Provider. Auth0's built-in provider is meant for testing, is rate-limited, and sends from an
  Auth0 address that spam filters dislike; a configured provider (SES, SendGrid, and so on) is the
  fix when messages leave Auth0 but never arrive.

Because the reset request travels through the custom domain, the link in the email points at
`auth.aosreminders.com` as well.

## Incident 2026-09-21 (#2006)

A subscriber could neither reset a password nor use `Continue with Google`, which reported that the
site had sent a bad link.

- **Verified.** `/authorize?connection=google-oauth2` on `auth.aosreminders.com` redirected to
  Google, which answered `Error 400: redirect_uri_mismatch` for
  `https://auth.aosreminders.com/login/callback`. The same request on `dev-4yesv5fz.auth0.com`
  reached Google's account chooser with the same Google client id. `connection=github` reached
  GitHub's "Invalid Redirect URI" page for the same callback. The production bundle was already
  built with the custom domain, and the Auth0 application accepted the app's own callback. Root
  cause: the #1945 cutover re-pointed the app and the API authorizers, but neither provider's OAuth
  client had the custom-domain callback registered, so every social login has presumably failed since
  the cutover; email-and-password login was unaffected.
- **Verified, separate.** The popup sent the page URL as `redirect_uri`, and `/faq` was not an
  allowed callback, so `Log in` from the FAQ stopped on `Callback URL mismatch`. Fixed in
  `useLogin.tsx` by sending the origin.
- **Not verifiable from here.** Whether that subscriber's reset email was ever dispatched. The
  simplest reading is a Google-only account, for which no email is sent by design, leaving a
  Google login that could not complete. The dashboard checks above settle it either way.
- **Remediation (outside this repository, no secrets).** Add
  `https://auth.aosreminders.com/login/callback` to the Google OAuth client's Authorized redirect
  URIs and to the GitHub OAuth App's callback URL, then run `yarn auth:verify-connections` for
  Google and the signed-in browser check for GitHub. No Auth0 tenant change is needed for the social
  logins; the email checks above are only needed if the subscriber turns out to have a database
  account.
