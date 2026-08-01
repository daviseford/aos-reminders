# Deployment

The production site is static files in the `aosreminders.com` S3 bucket, served through CloudFront
distribution `E3OO9Y9QRVZ2L1`.

`scripts/prepare-production-release.sh` is the only production preparation contract. It validates
the API configuration, lints, verifies the accepted AoS 4 beta corpus, type-checks, builds, tests,
and inspects the artifact. `scripts/deploy-production.sh` is the only AWS publication contract.
Three entry points install dependencies, run the shared preparation contract, then publish:

- `upload.sh` - manual deploy from a workstation
- `CI-build.sh` - standalone CI deploy
- `.github/workflows/deploy.yml` - the deploy that runs on a push to `master`

## Header and publication contract

Every object is uploaded with an explicit `Cache-Control`.

| Class | Files | `Cache-Control` |
|---|---|---|
| Content-hashed | `assets/*`, `sw-extras-<hash>.js`, `workbox-<hash>.js` | `public, max-age=31536000, immutable` |
| Unhashed public | icons, `favicon.ico`, `robots.txt`, `browserconfig.xml`, `safari-pinned-tab.svg`, `img/*` | `public, max-age=86400` |
| Mutable entry points | `index.html`, `site.webmanifest`, `service-worker.js`, `registerSW.js` | `public, max-age=0, must-revalidate` |

The worker imports a content-hashed `sw-extras-<hash>.js`. Its immutable name is part of the
worker's build identity: overwriting one fixed extras key would let an interrupted deploy change
what the previously published worker imports.

Upload order matters. Immutable assets and worker dependencies go first, then the manifest and
public files, then `index.html`, and `service-worker.js` last. A freshly revalidated entry point
therefore cannot reference a dependency that has not landed, and the worker is never visible before
its complete build.

The mutable entry points must revalidate. A service worker pinned at the edge cannot be replaced:
the browser bypasses its own HTTP cache for the top-level worker, but CloudFront can still serve its
cached copy for the edge TTL.

## Deployment serialization

GitHub Actions uses the `production-deployment` concurrency group with `cancel-in-progress: false`.
That queues GitHub runs, but it cannot see manual or standalone-CI callers, so every entry point also
acquires `_deploy/production.lock` in S3.

The lock is created atomically with `put-object --if-none-match '*'`. The owner is stored in object
metadata, the returned ETag is retained by the process, and release uses
`delete-object --if-match <acquired-etag>`. A process can therefore never delete a lock another
deploy replaced. If acquisition fails, the script reports the current owner, ETag, and timestamp and
performs no publication write.

Do not delete a lock merely because it looks old. After confirming in GitHub and on the originating
host that its process is gone, recover it by supplying both values printed by the failed acquisition:

```bash
DEPLOY_LOCK_RECOVER_OWNER='github-actions:daviseford:123456:1' \
DEPLOY_LOCK_RECOVER_ETAG='"0123456789abcdef"' \
  ./upload.sh
```

Recovery re-reads and exactly matches both values, conditionally deletes that ETag, then competes for
a fresh lock. Supplying one value, a mismatch, or losing the reacquisition race fails closed.

## CloudFront settings

As measured on 2026-07-31, the distribution uses legacy cache settings with one default behavior:

| Setting | Value | Consequence |
|---|---|---|
| `MinTTL` | `0` | Origin `max-age=0, must-revalidate` takes effect. |
| `DefaultTTL` | `86400` | An object with no `Cache-Control` is cached at the edge for 24 hours. |
| `MaxTTL` | `31536000` | The one-year `immutable` on hashed assets is honored in full. |
| `ResponseHeadersPolicyId` | null | No policy rewrites headers on the way out. |

Re-check after any distribution change:

```bash
aws cloudfront get-distribution-config --id E3OO9Y9QRVZ2L1 \
  --query 'DistributionConfig.DefaultCacheBehavior.{Min:MinTTL,Default:DefaultTTL,Max:MaxTTL,Policy:CachePolicyId}'
```

If the distribution moves to a managed cache policy, prefer `UseOriginCacheControlHeaders` with a
minimum and default TTL of zero. A response headers policy does not affect edge caching.

`aws s3 sync` compares size and modification time, not metadata. To re-stamp existing object headers,
use a deliberate `aws s3 cp s3://... s3://... --recursive --metadata-directive REPLACE` operation and
confirm the result with `aws s3api head-object`.

## Asset retention

The deploy does not pass `--delete`. Removing the previous build's hashed chunks immediately would
break lazy imports in tabs that already loaded its `index.html`.

Superseded assets are bounded by a current-version lifecycle rule whose filter combines both:

- prefix `assets/`;
- tag `retire=true`; and
- expiration after 30 days.

Every current build asset is tagged `retire=false` before `index.html` is published, so the lifecycle
cannot expire the live release. After successful publication, the deploy finds remote assets absent
from the new build. An asset not already retired is self-copied once with `retire=true`; that resets
its `LastModified` at the transition and starts a full 30-day grace period. An asset already tagged
`retire=true` is untouched, so later deploys cannot extend its window.

The production lifecycle configuration should have this shape:

```json
{
  "Rules": [
    {
      "ID": "retire-superseded-assets",
      "Status": "Enabled",
      "Filter": {
        "And": {
          "Prefix": "assets/",
          "Tags": [{ "Key": "retire", "Value": "true" }]
        }
      },
      "Expiration": { "Days": 30 }
    }
  ]
}
```

The rule lives in bucket configuration, not in this repository.

## Production prerequisites

Before the first PWA deploy:

- replace any prefix-only `assets/` expiration rule with the tag-filtered rule above; verify a
  `retire=false` fixture survives and a `retire=true` fixture is lifecycle-eligible;
- grant the deploy principal `GetObject`, `PutObject`, `DeleteObject`, `GetObjectTagging`,
  `PutObjectTagging`, and `ListBucket` for the site and lock keys, including conditional put/delete;
- confirm CloudFront still honors the cache headers described above;
- confirm the build emits exactly one `sw-extras-<hash>.js` and the worker imports that exact name;
  and
- leave workflow concurrency enabled. The S3 lock remains required because external callers bypass
  GitHub concurrency.

## Withdrawing a bad build

Retired hashed assets remain publicly retrievable during the grace period. To withdraw a chunk that
contains sensitive or incorrect configuration, delete it explicitly and invalidate it:

```bash
aws s3 rm s3://aosreminders.com/assets/<chunk>.js
aws cloudfront create-invalidation --distribution-id E3OO9Y9QRVZ2L1 \
  --paths "/assets/<chunk>.js" "/" "/index.html"
```

## Rolling back the service worker

`public/rollback-service-worker.js` is a committed no-op worker that unregisters itself and deletes
every cache it can see. Before an emergency rollback, stop or wait for GitHub deployments and confirm
`_deploy/production.lock` is absent. Acquire that same lock conditionally; do not race the shared
deployment contract.

Upload the rollback worker to the worker's own path and invalidate:

```bash
aws s3 cp public/rollback-service-worker.js s3://aosreminders.com/service-worker.js \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/javascript"
aws cloudfront create-invalidation --distribution-id E3OO9Y9QRVZ2L1 \
  --paths "/service-worker.js" "/" "/index.html"
```

Release the emergency lock only with the ETag returned by its acquisition. Clients pick up the
rollback worker on their next update check, unregister, and fall back to network delivery. The
rollback worker adds `?aos-reminders-rollback=1` when it navigates each client. The app records that
marker in `sessionStorage` and disables service-worker registration for the rest of that tab's
session; without the marker, the freshly loaded app would register the still-published rollback
worker again and repeat the unregister/navigation cycle. Do not remove this marker protocol from
either side of the rollback path.

## Verifying a deploy

```bash
curl -sI https://aosreminders.com/ | grep -iE 'cache-control|age|x-cache'
curl -sI https://aosreminders.com/site.webmanifest | grep -iE 'cache-control|content-type'
curl -sI https://aosreminders.com/service-worker.js | grep -iE 'cache-control|content-type'
curl -sI https://aosreminders.com/assets/<hashed>.js | grep -i cache-control
```

Expect `max-age=0, must-revalidate` on the first three and `immutable` on the last. A non-zero `Age`
with `X-Cache: Hit` on a freshly deployed entry point means the edge is still serving a stale copy.
