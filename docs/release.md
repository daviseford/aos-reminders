# Release and production operations

AoS Reminders 6.0.0 is the clean Age of Sigmar fourth-edition launch. Release PR
[#1717](https://github.com/daviseford/aos-reminders/pull/1717) merged the `aos4-migration`
integration branch into `master` on 2026-07-31; a push to `master` starts the S3/CloudFront
production deployment.

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

For a release that changes the accepted AoS 4 corpus, restore the manifest-pinned private artifact
cache before the offline generation/certification gates:

```powershell
yarn data:aos4:cache:pull `
  --manifest data/aos4/manifests/accepted-2026-08-02.json `
  --jobs 4
yarn data:aos4:generate:candidate
yarn data:aos4:verify:beta
```

The pull is read-only against the private store and verifies every restored SHA-256. Missing or
corrupt private bytes are a no-go for offline replay; do not fall back to an unreviewed live download
during a release. A UI-only release does not need to restore the source cache, but it still runs the
checked-in beta gate.

Before merging a release into `master`, confirm all of the following:

- the PR title does not trip the WIP check and every required GitHub check is green;
- the accepted beta pointer in `data/aos4/certifications/beta.json` resolves to the certification
  directory for the currently accepted corpus, and `yarn data:aos4:verify:beta` passes. Do not
  restate the directory name here — it changes with every accepted refresh;
- the project owner explicitly authorizes the `master` merge and resulting frontend deployment;
- repository variables `PRODUCTION_ARMY_API_URL` and `PRODUCTION_SUBSCRIPTION_API_URL` contain the
  compatible production HTTP API endpoints. The deployment workflow maps them to the two Vite
  variables, validates them, and confirms both are embedded in the artifact;
- any companion-service revision the release depends on is already deployed to production, so no
  build advertises a capability the live services cannot serve.

Those are production gates, not documentation warnings. Merging without them can publish
paid-feature claims for capabilities that are unavailable or insufficiently authorized.

The two one-time 6.0.0 gates are closed and should not be restated as open work: the
subscription-account authorization work shipped and deployed on 2026-07-31 (private
`aos-reminders-subscription-api` repository; do not restate its detail here), and the coordinated
army/share rollout tracked in
[#1804](https://github.com/daviseford/aos-reminders/issues/1804) closed 2026-08-02 with both
repository variables set and the production smoke matrix recorded in #1805.

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
6. Exercise subscription status, checkout, cancellation, redemption, and theme persistence. The
   first live-money provider delivery checks are tracked in the private
   `aos-reminders-subscription-api` repository; test-mode verification is not proof of a live-money
   webhook.
7. Confirm GA4 receives one pathname-only page view per route from the production hostname, no
   localhost traffic, and the expected bounded event parameters.
8. Confirm the service worker update prompt can move an already-open tab to the new release.

## No-go and rollback signals

Treat any stale beta checksum, catalog-integrity failure, AoS 3 rule leak, failed deployment,
unconfigured army API, authorization bypass, cross-account mutation, owner data in a public share,
subscription regression, or recognizable UI/account regression as a no-go signal. Restore the last
known-good `master` revision through an explicitly authorized production change, then diagnose on a
non-production branch.
