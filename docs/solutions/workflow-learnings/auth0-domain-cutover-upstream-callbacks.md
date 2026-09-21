---
title: "An Auth0 domain change is a three-party cutover: app, API authorizers, and every social provider's callback list"
date: 2026-09-21
category: workflow-learnings
module: auth
problem_type: configuration_gap
component: auth0_custom_domain
severity: high
applies_when:
  - "Changing `domain` in src/auth_config.json, or adding a custom domain to the Auth0 tenant"
  - "Adding a social connection to the tenant (Google, GitHub, anything with an upstream OAuth client)"
  - "A user reports a social login that fails on the provider's page with 'invalid request' or 'redirect_uri' wording while email and password login works"
  - "A password-reset report arrives from someone who may have signed up through a social button"
symptoms:
  - "Continue with Google ends on Google's 'Access blocked: This app's request is invalid, Error 400: redirect_uri_mismatch'"
  - "Continue with GitHub ends on GitHub's 'Invalid Redirect URI: the redirect_uri is not associated with this application'"
  - "The same /authorize request on the canonical dev-*.auth0.com host reaches the provider's sign-in page"
  - "Password reset shows 'check your email' and nothing arrives, because the account has no database identity"
root_cause: configuration_gap
resolution_type: process_change
related_components:
  - "src/auth_config.json"
  - "src/utils/hooks/useLogin.tsx"
  - "scripts/authConnections.ts"
  - "scripts/verifyAuthConnections.ts"
  - "src/tests/authConnections.test.ts"
  - "docs/auth.md"
tags: [auth0, custom-domain, oauth, redirect-uri, google, github, password-reset, cutover-checklist, read-only-probe]
---

## The problem

#1945 moved the app onto `auth.aosreminders.com` and the API authorizers onto the new issuer, and
called that the coordinated cutover. It was two thirds of one. Auth0 presents
`https://<domain>/login/callback` to Google and GitHub as the OAuth `redirect_uri`, and both
providers only honour the callbacks registered in their own consoles, which still knew only the
canonical `dev-*.auth0.com` host. Every social login has, on that evidence, failed from the cutover on;
email and password login kept working, so nothing in the repository, CI, or the deploy contract noticed for six weeks,
until a subscriber wrote in (#2006).

The same report carried a password-reset symptom. A social-only account has no password, and Auth0
deliberately shows the same "check your email" confirmation without sending anything, so a Google
user locked out of Google looks, from the outside, like a broken email pipeline.

## The learning

- An Auth0 domain is a public identifier that three other systems store: the app config, the API
  authorizers' issuer pin, and each social provider's callback allowlist. Change one, walk all three.
  `docs/auth.md` carries the list, and `src/tests/authConnections.test.ts` fails when the config's
  domain and the documented callback disagree, which is the reminder.
- Provider-side registration cannot be tested from this repository, but it can be *probed* without
  credentials: `yarn auth:verify-connections` runs the popup's `/authorize` request pinned to each
  connection and classifies what the provider answers. Google refuses in the redirect itself, so a
  script catches it; GitHub only validates for a signed-in browser, so that one stays a manual check
  and the probe says so instead of reporting a false pass.
- Separate the two callback layers when reading a report. Auth0's own "Callback URL mismatch" is
  the app's `redirect_uri` against the Auth0 application's allowlist and shows before any login
  form; the provider's "invalid request / redirect_uri" is the tenant's callback against the
  provider and shows after the social button. The popup flow found a gap of the first kind at the
  same time (`Log in` on `/faq` sent the page URL, which the allowlist did not hold); sending the
  origin removed the per-route dependency.
- When the fix lives in a console this repository cannot reach, capture the exact failing request
  and its decoded error, prove the counterfactual on the canonical host, ship the probe and the
  checklist, and hand the console step over with the verification command that will show it done.
