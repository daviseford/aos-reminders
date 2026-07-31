---
title: PayPal Subscription Reliability - Plan
type: fix
date: 2026-07-28
deepened: 2026-07-28
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# PayPal Subscription Reliability - Plan

**Target repos.** Primary: `aos-reminders-subscription-api` (paths prefixed `sub-api:`). Secondary: `aos-reminders` frontend (unprefixed paths). Both repos deploy via operator-run `deploy.sh`; prod deploys are human-authorized.

---

## Goal Capsule

- **Objective:** A customer who approves a PayPal payment gets access immediately and keeps it, regardless of webhook ordering, delivery lag, or transient write failures.
- **Authority:** This plan's Product Contract governs scope; the 2026-07-28 investigation (Sources) governs factual claims about failure modes.
- **Stop conditions:** Do not touch Stripe handlers, the HTTP API v2 / JWT work (user-accounts plan U4/U7), or webhook signature verification. Do not run the U6 prod cleanup without operator approval of the dry-run output.
- **Execution profile:** Backend units first (sub-api), then the dependent frontend unit, then the one-time cleanup. Dev-stage webhook replay is the gate before any prod deploy.

---

## Product Contract

### Summary

Fix the PayPal subscription pipeline so activation is order-independent, webhook failures are retryable, and the post-payment grant cannot lose its race — plus a one-time cleanup of the 33 historically stuck rows.

### Problem Frame

Roughly 1 in 20 PayPal subscriptions historically went awry: customers paid but did not appear subscribed. The 2026-07-28 investigation quantified it from five years of prod logs and the live table: 170 grant failures across 168 paying customers (grant fired before the `BILLING.SUBSCRIPTION.CREATED` webhook created the row — median lag 12s, p95 56s, max 2.1h; the grant was attempted once and never retried), 33 rows stuck in `pending_activation`/`temporary_grant` forever, 2 customers with no row ever created (the CREATED handler acknowledges 200 before the DynamoDB write, so PayPal never retried a failed write), and 3 subscriptions whose ACTIVATED events retried for days against a row that did not exist. PayPal documents no ordering guarantee and retries only on non-2xx responses (up to 25 times over 3 days) — the current code violates both assumptions.

### Requirements

**Webhook correctness**

- R1. A subscription activates regardless of the order CREATED and ACTIVATED arrive: ACTIVATED with no matching row creates the row from its own payload.
- R2. The CREATED handler responds only after the DynamoDB write completes, and returns non-2xx on failure so PayPal's retry ladder becomes the safety net.
- R3. Unknown plan IDs and malformed payloads (missing subscriber email, missing resource fields) produce a logged non-2xx response — never an unhandled crash, a hung handler, or a silent 200.

**Immediate access after payment**

- R4. A customer who approves payment gets access without waiting for any webhook: the grant carries the approval response's subscription ID and plan ID, and creates a provisional row when none exists.
- R5. Grant validity is computed from `updatedAt` with a 60-minute window; each grant call refreshes `updatedAt`, extending the window while the confirmation modal retries. Replaces the 10-minute window from PayPal's `start_time`, which is not issuance time.
- R6. The post-subscribe flow retries the grant while the confirmation modal polls, instead of one fire-and-forget attempt with a swallowed error.

**Data hygiene**

- R7. The 33 stuck prod rows are resolved in a one-time, dry-run-reviewed pass.

### Scope Boundaries

- **Deferred to Follow-Up Work:** webhook signature verification (`verify-webhook-signature`) and rotation of the hardcoded `UI_AUTH_KEY`/`ADMIN_AUTH_KEY` — both land with the JWT authorizer / HTTP API v2 work in the user-accounts plan (U4/U7), which replaces the auth surface these would bolt onto.
- Stripe handlers are out of scope (fixed and verified 2026-07-28).
- No refactor of the callback-style handler pattern or the SDK v3 shim.

---

## Planning Contract

### Key Technical Decisions

- **ACTIVATED upserts a missing row** instead of erroring until CREATED lands. (session-settled: user-approved — chosen over relying on PayPal retry ordering: PayPal guarantees no order and gives up after 3 days, which produced permanent losses.) The ACTIVATED payload carries everything the row needs: subscriber email (userName), `payer_id`, `plan_id`, `id`, `start_time`, `create_time`.
- **The grant becomes authoritative on client-attested payment.** `paypal_grant` accepts `subscriptionId` and `planId` from the approval response and creates a provisional `temporary_grant` row when the userName query finds nothing. (session-settled: user-approved — chosen over webhook-only truth: the client's `onApprove` is the earliest payment signal, median 12s ahead of CREATED.) No security regression: `UI_AUTH_KEY` already ships to the browser, so these endpoints are client-trusted today; real auth arrives with the JWT plan.
- **Grant window: 60 minutes from `updatedAt`** (session-settled: user-approved — chosen over 10 minutes from PayPal `start_time`: `start_time` is not issuance time, and ACTIVATED lag is unbounded — hours observed). Server-side only; the frontend already trusts the server-computed `has_grant`.
- **CREATED responds after the write, with the write's outcome.** Removes the immediate `callback(null, getResponse(data))` double-callback. `getErrorResponse` returns 501, which is non-2xx, so PayPal retries. (Chosen over always-200: the 2 no-row-ever customers are the direct cost of masking write failures.)
- **Defer signature verification and key rotation.** (session-settled: user-directed — chosen over including them now: keeps this plan free of PayPal API credentials and operator prerequisites; the user-accounts plan's U4/U7 rework the auth/endpoint surface anyway.)
- **Cleanup ships as a migration-style script with a dry-run mode** (session-settled: user-directed — chosen over leaving the rows inert), following the existing `sub-api: migrations/migrate_v4.js` shape but run locally against prod with operator approval, not exposed as an endpoint.
- **Keep callback-style handlers and the `callbackify` shim.** Minimal diffs on payment code; the async refactor belongs to a later modernization.

### High-Level Technical Design

The race that caused the failures, and how the fixed flow resolves it — every path now converges on an active row:

```mermaid
sequenceDiagram
    participant B as Buyer
    participant F as Frontend
    participant P as PayPal
    participant A as sub-api
    participant D as DynamoDB

    B->>P: approve subscription
    P-->>F: onApprove (subscriptionID, planId known)
    F->>A: paypal_grant {userName, subscriptionId, planId}
    alt row exists (CREATED already landed)
        A->>D: set temporary_grant, updatedAt=now
    else no row yet (grant won the race)
        A->>D: create provisional temporary_grant row
    end
    F->>F: modal polls GET /user; re-sends grant until active/grant confirmed
    P-->>A: CREATED webhook (median +12s)
    A->>D: upsert pending fields (grant status preserved)
    A-->>P: 200 only after write succeeds (else 501 → PayPal retries)
    P-->>A: ACTIVATED webhook (seconds–hours)
    alt row found by subscriptionId
        A->>D: set active
    else no row (CREATED lost)
        A->>D: create row from ACTIVATED payload
    end
```

Ordering note: CREATED arriving after a grant-created provisional row must not demote the row's status from `temporary_grant` back to `pending_activation` — status only moves forward (`pending_activation` → `temporary_grant` → `active`/`canceled`).

### Risks & Dependencies

- **Persistent non-2xx regression.** After U1, a bug that makes CREATED fail consistently means PayPal drops the event after 3 days of retries — the failure mode moves rather than disappears. Mitigation: the V1-V4 dev replay matrix gates prod, and the first live PayPal event after deploy gets a CloudWatch log check (issue #1731 already tracks post-launch webhook monitoring).
- **At-least-once delivery.** PayPal may deliver the same event more than once; every handler path must be idempotent (covered by the forward-only status rule and the upsert-by-subscriptionId query — U1/U2 test scenarios pin this).
- **Client-attested grant abuse.** Anyone holding the public `UI_AUTH_KEY` can mint a 60-minute `temporary_grant`. This is not a new exposure — the same key already reaches `redeem`, `cancel`, and grant today — and the window self-expires with no payment attached. Real authentication is the JWT work's job (see Scope Boundaries).
- **U6 mutates prod data.** Mitigated by the dry-run gate, the `cleanupNote` attribute marking every touched row (reversible by query), and the post-apply scan.
- **Dependency: live webhook configuration.** The three live-mode PayPal/Stripe webhook URLs verified on 2026-07-28 must keep pointing at the prod API Gateway. The HTTP API v2 migration (user-accounts plan U4/U7) will change these URLs — that migration re-runs this plan's replay matrix against the new endpoints.

---

## Implementation Units

### U1. CREATED handler responds with the write outcome

**Goal:** PayPal's retry ladder becomes the safety net for failed CREATED writes.
**Requirements:** R2, R3.
**Dependencies:** none.
**Files:** `sub-api: paypal/create.js`, `sub-api: tests/paypal.test.js`.
**Approach:** Remove the trailing immediate `callback(null, getResponse(data))` from `handleCreation`; the query/put/update callbacks become the only response paths. Guard the `PLANS[planId]` destructure and missing `resource.subscriber.email_address` with logged `getErrorResponse` returns before any DB call. Preserve the forward-only status rule: when a row already exists with status `temporary_grant` or `active`, the CREATED update must not overwrite `subscriptionStatus` back to `pending_activation` (update the subscription fields, keep the stronger status).
**Patterns to follow:** existing guard-then-callback shape in `sub-api: subscription/cancel.js`; test fixtures and `invoke`/`parseBody` helpers in `sub-api: tests/paypal.test.js`.
**Test scenarios:**
- Happy path: CREATED with known plan and email → 200 only after `PutCommand` resolves; response body is the created row.
- New: DynamoDB put rejects → response is 501 (non-2xx), not 200.
- New: unknown `plan_id` → 501 with logged message, no DB call, no throw.
- New: missing `subscriber.email_address` → 501, no DB call.
- New: CREATED arriving for an existing `temporary_grant` row updates subscription fields but leaves status `temporary_grant`.
- Idempotency: duplicate CREATED delivery → update path, still exactly one row.
**Verification:** `yarn test` green in sub-api; the double-callback is gone (single response path per branch).

### U2. ACTIVATED upserts when no row exists

**Goal:** Activation is order-independent; a lost or late CREATED can no longer strand a paying customer.
**Requirements:** R1, R3.
**Dependencies:** U1 (same file; land after it).
**Files:** `sub-api: paypal/create.js`, `sub-api: tests/paypal.test.js`.
**Approach:** In `handleActivation`, when the subscriptionId query returns no row, create the full row from the ACTIVATED payload (userName from `resource.subscriber.email_address`, customerId from `payer_id`, status `active`, `createdBy: 'paypal'`) instead of returning an error. Guard `PLANS[planId]` the same way as U1. Replace the enclosing try/catch-that-swallows with error responses on every path so the handler always calls back.
**Test scenarios:**
- ACTIVATED with existing `pending_activation` row → row becomes `active` (existing behavior preserved).
- New: ACTIVATED with no row → row created with status `active`, correct userName/customerId/plan fields, 200 response.
- New: ACTIVATED with unknown `plan_id` → 501 response (PayPal will retry), no throw, no hang.
- New: ACTIVATED for a `temporary_grant` row → becomes `active`.
- Idempotency: duplicate ACTIVATED delivery (PayPal is at-least-once) → still exactly one row, status `active`, no error.
**Verification:** `yarn test` green; replaying ACTIVATED-before-CREATED against dev produces an active subscriber (Verification Contract scenario V2).

### U3. Grant creates provisional access and times its window from issuance

**Goal:** The earliest payment signal (client approval) grants access without depending on any webhook having arrived.
**Requirements:** R4, R5.
**Dependencies:** U1, U2 (forward-only status rule must exist before provisional rows do).
**Files:** `sub-api: paypal/grant.js`, `sub-api: util/user.js`, `sub-api: tests/paypal.test.js`, `sub-api: tests/user.test.js`.
**Approach:** `paypal_grant` accepts optional `subscriptionId` and `planId` alongside `userName`/`authKey`. When the userName query finds no row and both new fields are present, create a provisional row (status `temporary_grant`, plan fields from the `PLANS` map, `subscriptionStart` = now, `createdBy: 'paypal'`). Keep the existing no-op response for rows already `active`/`canceled`. In `util/user.js`, `hasTemporaryGrant` computes the window as `updatedAt + 60 minutes` (fallback to `subscriptionStart` when `updatedAt` is absent). Old callers sending only `userName` keep today's behavior.
**Patterns to follow:** row-shape from `handleCreation`; grant tests in `sub-api: tests/user.test.js` ("paypal/grant" describe block).
**Test scenarios:**
- Existing row `pending_activation` + grant → `temporary_grant` (regression).
- New: no row + grant with `subscriptionId`+`planId` → provisional row created, `GET /user` reports `has_grant: true`, `active: true` via `isActiveSubscriber` semantics.
- New: no row + grant without `subscriptionId` → current "Unable to find userName" error (backward compatible).
- New: grant with unknown `planId` → error response, no row created.
- Window: row with `updatedAt` 59 minutes ago → `has_grant` true; 61 minutes ago → false; legacy row without `updatedAt` falls back to `subscriptionStart`.
- Idempotency: second grant call on a `temporary_grant` row refreshes `updatedAt` (extends the window) rather than erroring.
**Verification:** `yarn test` green; V3 replay scenario passes on dev.

### U4. Frontend passes payment proof and retries the grant

**Goal:** The post-subscribe modal converges on access instead of spinning on a single lost grant.
**Requirements:** R4, R6.
**Dependencies:** U3 (API contract).
**Files:** `src/api/subscriptionApi.ts`, `src/components/payment/pricingPlans.tsx`, `src/components/modals/paypal_post_subscribe_modal.tsx`, `src/types/subscription.ts` (if the grant payload type lives there), `src/tests/aos4/paypal.test.ts`.
**Approach:** `handleSuccess` in `pricingPlans.tsx` receives the approval response it already gets from `PayPalButton`'s `onApprove` and forwards `subscriptionID` and the plan's PayPal plan ID to `SubscriptionApi.requestGrant`. The post-subscribe modal's existing 1-second poll loop re-sends the grant (same payload) on each tick while the user is not yet active, stopping when `isActive` flips or the modal closes; drop the silent `catch {}` in favor of letting the retry loop own failures. Keep the poll interval and modal copy as-is.
**Execution note:** Consult the react-specialist skill for hook/effect conventions before modifying the modal's `useSetInterval` flow.
**Test scenarios:**
- `requestGrant` payload includes `userName`, `subscriptionId`, `planId`, `authKey`.
- Modal poll: grant endpoint failing twice then succeeding → modal closes once `isActive` becomes true (retry actually re-fires).
- Modal closes on user action → polling and grant retries stop.
- Approval response without `subscriptionID` (defensive) → grant still fires with `userName` only.
**Verification:** frontend `yarn test` green; manual dev-stage pass in V3.

### U5. Renew and cancel guards

**Goal:** The remaining PayPal handlers fail loudly and retryably instead of crashing or hanging.
**Requirements:** R3.
**Dependencies:** none (parallel to U1-U3).
**Files:** `sub-api: paypal/renew.js`, `sub-api: paypal/cancel.js`, `sub-api: tests/paypal.test.js`.
**Approach:** `renew.js` already guards missing rows and plan info — verify and extend to missing `resource`/`billing_agreement_id` shapes. `cancel.js`: guard `resource.subscriber`/`plan_id` access and ensure every path responds. No behavior change for valid payloads.
**Test scenarios:**
- Renew with missing `resource` → 501, no throw.
- Cancel with payload missing `subscriber` → 501, no throw.
- Valid renew/cancel payloads → unchanged behavior (regression).
**Verification:** `yarn test` green.

### U6. One-time cleanup of stuck prod rows

**Goal:** The prod table stops carrying five years of stuck `pending_activation`/`temporary_grant` rows.
**Requirements:** R7.
**Dependencies:** U1-U3 deployed to prod (so no new rows get stuck while cleaning).
**Files:** `sub-api: migrations/cleanup_stuck_paypal_rows.js` (new).
**Approach:** Script scans for `createdBy = 'paypal'` rows with status `pending_activation` or `temporary_grant`, prints a dry-run report (userName, subscriptionId, createdAt, proposed action), and on an explicit `--apply` flag sets status `canceled` with a `cleanupNote` attribute. Default action for all 33: mark canceled (they never renewed; still-paying customers would have self-healed via `paypal_renew`). The one `temporary_grant` row and the row with the epoch-zero `createdAt` get called out in the report for the operator's eyes. Run locally with AWS credentials, not as an endpoint.
**Execution note:** Operator reviews the dry-run output before `--apply`; keep the report output in the PR or issue for the record.
**Test scenarios:** Test expectation: none — one-shot operational script; its safety mechanism is the dry-run review, and it never runs in CI.
**Verification:** Dry-run report reviewed and approved; post-apply scan shows zero paypal rows in `pending_activation`/`temporary_grant` older than one day.

---

## Verification Contract

| Gate | Command / procedure | Applies to |
|---|---|---|
| sub-api tests | `yarn test` in `aos-reminders-subscription-api` (node --test) | U1, U2, U3, U5 |
| sub-api CI | GitHub Actions: tests + `serverless package` step green on the PR | U1, U2, U3, U5 |
| frontend tests | `yarn test` in `aos-reminders` | U4 |
| V1: ordered replay | Deploy dev; replay CREATED then ACTIVATED (synthetic payloads, as in the 2026-07-28 session) → `GET /user` shows `active: true` | U1, U2 |
| V2: reversed replay | Replay ACTIVATED with no prior CREATED → row created active; then late CREATED → status stays `active` | U2, U1 |
| V3: grant race | Call `paypal_grant` with `subscriptionId`+`planId` before any webhook → immediate `has_grant: true`; then replay CREATED + ACTIVATED → converges to `active` with no status demotion | U3, U4 |
| V4: failure honesty | Replay CREATED with unknown `plan_id` → non-2xx response observed | U1 |
| prod deploy | Operator-run `deploy.sh` after V1-V4 pass on dev | all |
| cleanup | U6 dry-run reviewed, `--apply` run, post-scan clean | U6 |

## Definition of Done

- R1-R7 satisfied: all units landed on master of their repos, both CI pipelines green.
- Dev-stage replay matrix V1-V4 passes and is recorded on the tracking issue.
- Prod deployed by operator; a post-deploy spot-check of one grant call and `GET /user` on dev-stage semantics.
- U6 executed against prod with the dry-run report and post-apply scan recorded.
- No abandoned experimental code in the diffs; the temporary replay payloads live only in tests or the session scratchpad, not the repos.

---

## Sources & Research

- 2026-07-28 investigation (this plan's evidence base): prod CloudWatch log groups `paypalGrant` (170 grant failures, 168 users, 166 recovered, 2 never), `paypalSubscription` (3 subscriptions with ACTIVATED-vs-missing-row retries), prod table scan (33 stuck rows, statuses and plan IDs verified current), CREATED-lag distribution (median 12s, p95 56s, max 2.1h).
- PayPal webhooks: retries only on non-2xx, up to 25 attempts over 3 days; no ordering guarantee — https://developer.paypal.com/api/rest/webhooks/
- Current handler code: `sub-api: paypal/create.js` (double callback at the tail of `handleCreation`; activation error path), `sub-api: paypal/grant.js`, `sub-api: util/user.js` (`hasTemporaryGrant` 10-minute window from `subscriptionStart`).
- Frontend flow: `src/components/payment/pricingPlans.tsx` (`handleSuccess` single-shot grant with swallowed catch), `src/components/modals/paypal_post_subscribe_modal.tsx` (poll loop), `src/utils/subscriptionUtils.ts` (client trusts server-computed `has_grant`).
