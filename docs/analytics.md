# Analytics

AoS Reminders uses the GA4 property `AoS Reminders - GA4`, web stream `5494190629`, and
measurement ID `G-EM4GX294XG`. Analytics is directional product telemetry. It is never used to
authorize an account, fulfill a payment, or provide canonical army or rules data.

## Collection boundary

`src/utils/analytics.ts` is the only GA4 adapter. Importing it has no side effects. Collection starts
only when both conditions are true:

- Vite built the application in production mode.
- The browser hostname is exactly `aosreminders.com` or `www.aosreminders.com`.

Development, test, preview, `localhost`, and `127.0.0.1` traffic do not initialize GA. Development
actions may be written to the browser console for local diagnosis.

The application owns page views. GA initializes with `send_page_view: false`, then
`src/components/App.tsx` sends one initial page view and subscribes once to React Router history.
Page paths contain only the pathname: query strings and fragments are never included. In the web
stream's Enhanced Measurement settings, page loads remain enabled and browser-history page changes
remain disabled. Enabling history-based measurement would create a second SPA page-view owner.

## Event contract

Event names are fixed. Categorical values belong in parameters and must never be interpolated into
new event names.

| Event | When | Parameters |
|---|---|---|
| `page_view` | Initial load and each SPA route change | Standard page path, location, and title; pathname only |
| `ui_interaction` | Existing navigation or generic UI interaction | `interaction_name` |
| `theme_change` | A visitor changes theme | `theme_name` |
| `banner_view` | A notification banner is shown | `banner_name` |
| `banner_close` | A notification banner is dismissed | `banner_name` |
| `game_mode_change` | Edit/play mode changes | `game_mode` |
| `select_content` | A faction is selected | Standard `content_type`, `item_id`; `faction_name` |
| `file_download` | A reminders PDF is generated successfully | Standard `file_name`, `file_extension`; `print_layout`, `print_page_size` |
| `roster_import` | An import preview succeeds or fails | `roster_source`, `import_outcome`, aggregate `selection_count`, `diagnostic_count` |
| `account_action` | A coupon or gift is redeemed, or a subscription is cancelled | `account_action` |
| `login_start` | Hosted login starts | `login_origin` |
| `login_closed` | Hosted login closes without redirecting | `login_origin` |
| `begin_checkout` | Stripe or PayPal checkout starts | Standard `currency`, `value`, `items`; `payment_provider` |
| `purchase` | A recognized checkout return or PayPal approval completes | Standard `transaction_id`, `currency`, `value`, `items`; `payment_provider` |
| `checkout_cancelled` | A recognized checkout is cancelled | `value`, `items`, `payment_provider` |

The item catalog in `src/utils/plans.ts` owns stable analytics item IDs and numeric unit prices.
Subscription and gift items use the categories `subscription` and `gift_subscription`.

Changelog surfaces reuse the fixed events above with bounded parameter values:

- The in-army changelog banner logs `banner_view`/`banner_close` with `banner_name` values of the
  form `changelog:<publicationId>` (publication IDs come from the reviewed ledger, a bounded set)
  or `changelog:behind` for the behind-window banner.
- Expanding a reminder's changed marker logs `ui_interaction` with
  `interaction_name: changelog_marker_expand`. Collapse logs nothing.
- The `/changelog` page needs no bespoke event; the router subscription reports its `page_view`.
- Change detail (old and new rules text) is rules text and must never ride an event parameter.

## Custom definitions

The following event-scoped custom dimensions are registered in GA4 Admin. Names mirror their event
parameters so the mapping stays obvious:

| Dimension | Event parameter |
|---|---|
| Interaction name | `interaction_name` |
| Theme name | `theme_name` |
| Banner name | `banner_name` |
| Game mode | `game_mode` |
| Faction name | `faction_name` |
| Print layout | `print_layout` |
| Print page size | `print_page_size` |
| Roster source | `roster_source` |
| Import outcome | `import_outcome` |
| Account action | `account_action` |
| Login origin | `login_origin` |
| Payment provider | `payment_provider` |

The legacy `Event Category` and `Event Label` definitions remain for historical reports. No custom
metrics are registered: ecommerce value and item quantity use GA4's standard fields, while import
counts are diagnostic payloads rather than long-lived reporting dimensions. Custom definitions are
not retroactive.

## Privacy rules

Analytics helpers accept only allowlisted, bounded metadata. Do not send:

- email addresses, Auth0 identifiers, or other account identifiers;
- army names, notes, roster contents, uploaded file names, or cloud-army identifiers;
- share tokens, full URLs, query strings, fragments, or arbitrary error text;
- rules text or user-authored content.

The sole provider identifier is Stripe's Checkout Session ID or PayPal's subscription ID in the
standard `purchase.transaction_id` field. Checkout query parameters are removed before the initial
page view. Unknown plans, invalid gift quantities, and returns without a transaction ID do not
produce a purchase event.

## Ecommerce limitations

Browser purchase events are useful for funnel and revenue analysis, but they are not payment proof.
A return URL can be forged, a customer can close the browser before returning, and client-side
collection can be blocked. Stripe, PayPal, and the subscription API remain authoritative.

Authoritative server-side Measurement Protocol events should be added only with verified payment
webhooks and a deliberate deduplication contract. That work belongs with the subscription
authorization and Stripe modernization program.

## Validation

After a production deployment:

1. In Realtime or DebugView, load production and navigate between two routes. Confirm one
   pathname-only page view per route.
2. Exercise one product action. Confirm its stable event name and the expected custom parameter.
3. Confirm the hostname report accumulates `aosreminders.com` traffic but no new `localhost` or
   `127.0.0.1` traffic from this application.
4. For the next real purchase, confirm `purchase` has one item, numeric USD value, provider, and a
   transaction ID, and that the checkout parameters disappear from the returned URL.
5. Keep `purchase` marked as a key event and keep browser-history Enhanced Measurement disabled.

The original failure diagnosis and implementation units are recorded in
`docs/plans/2026-07-30-001-fix-google-analytics-reporting-plan.md`.
