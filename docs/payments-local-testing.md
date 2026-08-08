# Testing checkout locally

How to exercise the Stripe and PayPal subscription flows from `yarn start` against a deployed
non-production subscription API.

This document covers only what this repository owns: which environment variables the client reads,
which port it must serve on, and which build mode it must run in. Endpoint URLs, test accounts,
provider dashboard wiring, and the account-matching rules the API enforces are billing detail and
live in the private `aos-reminders-subscription-api` repository — see its
`docs/local-ui-testing.md`. AGENTS.md keeps that material out of this repository.

## Point the client at a deployed API

`.env.local` (gitignored) overrides the endpoint the client calls:

```
VITE_SUBSCRIPTION_API_URL=<subscription API base URL>
VITE_ARMY_API_URL=<army API base URL, or leave mocked>
```

Only the subscription URL matters for checkout. Subscription state is read exclusively through
`SubscriptionApi` in `src/context/useSubscription.tsx`; the army API backs saved armies and sharing
and can stay pointed at a mock.

Vite reads `.env.local` once at server start, so restart after editing it.

## Serve on port 5173, and enforce it

```sh
yarn start --port 5173 --strictPort
```

The API stage's allowed origin is a single fixed value, and it drives three things at once: the CORS
allowance on every account route, the success and cancel URLs the server builds into a Stripe
Checkout Session, and — because `Auth0Provider` passes `redirect_uri: window.location.origin`
(`src/main.tsx`) — the Auth0 callback.

Vite's default is 5173, but it silently walks to 5174 when the port is busy. That failure is worth
naming because it does not look like a port problem: preflight fails on every account call, login
returns to an unregistered callback, and checkout completes but returns the buyer to an origin
nothing is running on. `--strictPort` turns it into an immediate, obvious startup error instead.

## Use the dev server, never a production build

`src/utils/env.ts` derives `isDev` from `process.env.NODE_ENV`, which Vite substitutes at build
time. That one flag selects **both** the PayPal client ID and the PayPal plan IDs
(`src/utils/plans.ts`, consumed in `src/components/payment/pricingPlans.tsx`).

So `yarn build && yarn preview` renders the **live** PayPal button and charges a real card, no
matter which API `VITE_SUBSCRIPTION_API_URL` points at. Only `yarn start` is safe for PayPal
testing.

Stripe does not share this hazard. Since #1942 the browser sends an intent — `{ kind, plan }` — and
the server chooses the price from its own catalog, so the API's own stage decides whether the
session is a test one. The client cannot select a price at all.

## Stripe

`/subscribe` → the Stripe button → `POST /account/checkout-session` → navigate to the returned URL.
Test card `4242 4242 4242 4242`, any future expiry, any CVC, any postal code.

You return to `/?subscribed=true&checkout_kind=subscription&plan=…&checkout_session_id=…`, which
`src/utils/handleQueryParams` and the checkout outcome banner read.

Activation does not arrive with that redirect. The provider posts `checkout.session.completed` to
the deployed callback API, which the local app never sees, so the account row flips a moment after
you land. Reload `/profile` to confirm rather than treating the immediate state as final.

## PayPal

The button is rendered imperatively by `src/components/payment/paypal/paypalButton.tsx` and needs a
signed-in user with an e-mail before it will mount at all. On approval the client posts the
subscription ID to `/account/paypal-grant`; the API treats it only as a locator and re-fetches the
authoritative subscription before granting anything.

The API requires the approving PayPal account's e-mail to match the signed-in account's. Set up a
sandbox buyer that satisfies this before testing — the private repository's `docs/local-ui-testing.md`
records how. A mismatch surfaces in the UI as a rejected grant, not as a login problem.

The post-subscribe modal polls the grant while provider activation lands, so a brief spinner there
is the normal path, not a failure.

## Between runs

Cancel from `/profile` after each test. An account that already holds an active subscription renders
the already-subscribed path instead of the checkout controls, so the next run silently tests
something else.
