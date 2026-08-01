# Release and production operations

AoS Reminders 6.0.0 is the clean Age of Sigmar fourth-edition launch. Release PR
[#1717](https://github.com/daviseford/aos-reminders/pull/1717) merges `aos4-migration` into
`master`; a push to `master` starts the S3/CloudFront production deployment.

This runbook records the launch gates separately from the migration's implementation history. It
does not authorize a merge, API deployment, or production configuration change.

## What ships in 6.0.0

- the canonical AoS 4 domain, selection, reminder, state, and generated-data runtime;
- the accepted `aos4-corpus-2026-08-01b` snapshot and checksum-bound beta gate;
- 27 playable armies, with universal manifestations sourced from the Endless Spells container;
- official-app, Listbot, and New Recruit `.ros`/`.rosz`/`.json` roster imports;
- PDF export, cloud armies, opaque sharing, Auth0, subscriptions, themes, and account pages;
- Bootstrap 5.3, React 19, maintained drag-and-drop, production-only GA4, and the Rules Radar;
- the established AoS Reminders visual and interaction model, not a redesign.

## Pre-merge gates

Run from a clean Node 22/Yarn Classic checkout:

```powershell
yarn install --frozen-lockfile
yarn lint
yarn tsc --noEmit
yarn test --run
yarn data:aos4:verify:beta
$env:VITE_ARMY_API_URL = 'https://<production-army-api-id>.execute-api.us-east-1.amazonaws.com'
$env:VITE_SUBSCRIPTION_API_URL = 'https://<production-subscription-api-id>.execute-api.us-east-1.amazonaws.com'
yarn release:validate-config
yarn build
yarn release:inspect-artifact
```

Before merging #1717, confirm all of the following:

- the PR title does not trip the WIP check and every required GitHub check is green;
- the accepted beta pointer still resolves to
  `data/aos4/certifications/aos4-corpus-2026-08-01b-machine-r1`;
- the project owner explicitly authorizes the `master` merge and resulting frontend deployment;
- the AoS 4-native army/share service through `aos-reminders-rest-api#11` is deployed to production
  with the production entitlement URL, Auth0 issuer/audience, share base URL, and CORS origins;
  [#1804](https://github.com/daviseford/aos-reminders/issues/1804) tracks the coordinated rollout;
- repository variables `PRODUCTION_ARMY_API_URL` and `PRODUCTION_SUBSCRIPTION_API_URL` contain the
  compatible production HTTP API endpoints. The deployment workflow maps them to the two Vite
  variables, validates them, and confirms both are embedded in the artifact;
- the subscription-account authorization work in
  [#1720](https://github.com/daviseford/aos-reminders/issues/1720) is resolved and its negative
  authorization matrix passes. The public shared browser key is not an identity boundary and must
  not be described as secure.

The last two bullets are production gates, not documentation warnings. Merging without them can
publish paid-feature claims for capabilities that are unavailable or insufficiently authorized.

## Cutover evidence record

Create the release-window record in #1805 before the first production mutation. Do not put tokens,
provider secrets, raw callback bodies, account emails, or database rows in the issue. Record only:

- the owner's authorization timestamp and the exact operation it covers;
- frontend, subscription API, and army API commit SHAs;
- reviewed CloudFormation change-set IDs and confirmation that retained tables have no replacement
  or deletion action;
- DynamoDB backup names and restore checkpoints;
- Auth0 issuer/audience, CORS origin, share base, entitlement route, and provider endpoint mappings
  as redacted fingerprints or route names rather than secrets;
- the dev verification case counts, cleanup counts, and any intentionally retained test event;
- the two GitHub repository-variable names and redacted endpoint host fingerprints;
- start/end times, CloudWatch alarm state, go/no-go decision, and rollback revision.

Production operations remain individually authorized. Approval to prepare or review this record is
not approval to deploy either API, change provider configuration, rotate credentials, merge #1717,
push `master`, upload S3 assets, or invalidate CloudFront.

## Deployment mechanics

`.github/workflows/deploy.yml` builds the exact `master` revision, synchronizes `dist/` to the
production S3 bucket with deletion enabled, and invalidates the CloudFront distribution. Before it
loads AWS credentials or mutates production, that same job validates both API endpoints, runs lint,
Vitest, the beta gate, TypeScript, the production build, and artifact inspection. The separate
`Lint, Test, and Build` workflow remains an earlier non-credentialed signal but is not treated as a
deployment dependency.

The Rules Radar schedule also becomes active only after the workflow exists on the default branch.
After the merge, manually run `AoS 4 Rules Radar` once with `source: all` and `report_only: true`,
inspect its evidence artifact, and then inspect the first daily and weekly scheduled runs.

## Post-deploy validation

Validate the deployed commit rather than only the local build. Record the complete handoff in
[#1805](https://github.com/daviseford/aos-reminders/issues/1805):

1. Confirm the deployment and `Lint, Test, and Build` workflows succeed and the production footer
   reports version 6.0.0.
2. At desktop and mobile widths, create an army, switch Edit/Play mode, add a note, hide/show and
   reorder reminders, change faction, and reload to prove local persistence.
3. Import one official-app roster, Listbot text/file, and New Recruit `.ros`, `.rosz`, and `.json`
   roster. Confirm malformed files fail without replacing the local army.
4. Generate Standard and Compact PDFs in A4 and Letter.
5. With two authenticated accounts, exercise cloud create/list/load/update/rename/delete and prove
   cross-account mutations fail. Create a share, open it signed out, and confirm the response and
   browser state contain no owner identity.
6. Exercise subscription status, checkout, cancellation, redemption, and theme persistence. Follow
   [#1731](https://github.com/daviseford/aos-reminders/issues/1731) for the first live Stripe and
   PayPal delivery checks; test-mode verification is not proof of a live-money webhook.
7. Confirm GA4 receives one pathname-only page view per route from the production hostname, no
   localhost traffic, and the expected bounded event parameters.
8. Confirm the service worker update prompt can move an already-open tab to the new release.

## No-go and rollback signals

Treat any stale beta checksum, catalog-integrity failure, AoS 3 rule leak, failed deployment,
unconfigured army API, authorization bypass, cross-account mutation, owner data in a public share,
subscription regression, or recognizable UI/account regression as a no-go signal. Restore the last
known-good `master` revision through an explicitly authorized production change, then diagnose on a
non-production branch.
