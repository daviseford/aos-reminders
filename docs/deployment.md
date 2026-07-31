# Deployment

The production site is static files in the `aosreminders.com` S3 bucket, served
through CloudFront distribution `E3OO9Y9QRVZ2L1`.

Three files carry the same upload contract and must stay in step:

- `upload.sh` — manual deploy from a workstation
- `CI-build.sh` — standalone CI deploy
- `.github/workflows/deploy.yml` — the deploy that runs on a push to `master`

## Header contract

Every object is uploaded with an explicit `Cache-Control`. Before this contract
existed, nothing set one at all, and CloudFront cached whatever it liked.

| Class | Files | `Cache-Control` |
|---|---|---|
| Content-hashed | `assets/*` | `public, max-age=31536000, immutable` |
| Unhashed public | icons, `favicon.ico`, `robots.txt`, `browserconfig.xml`, `safari-pinned-tab.svg`, `img/*` | `public, max-age=86400` |
| Mutable entry points | `index.html`, `site.webmanifest`, `service-worker.js`, `sw-extras.js`, `workbox-*.js`, `registerSW.js` | `public, max-age=0, must-revalidate` |

`sw-extras.js` is in that last class because the worker pulls it in with
`importScripts`, and `importScripts` *does* go through the HTTP cache even
though the top-level worker script does not.

The unhashed public assets sit between the other two because they carry a `?v=`
query buster rather than a content hash — they are not immutable under a given
name, but they also change perhaps once a year.

**Upload order matters.** Hashed assets go first and `index.html` goes last, so a
freshly revalidated `index.html` can never reference a chunk that has not landed
yet.

**Why the entry points must revalidate.** A service worker that is pinned at the
edge cannot be replaced: the browser fetches the worker script bypassing its own
HTTP cache, but CloudFront ignores `Cache-Control` in viewer *requests*, so the
edge keeps serving the stale copy for its whole TTL. No new worker, no
`updatefound`, and installed clients stay on the old build indefinitely.

## CloudFront settings

Object headers are necessary but not sufficient — the distribution has to honour
them. As measured on 2026-07-31, it does.

The distribution uses **legacy cache settings**, not a managed cache policy
(`CachePolicyId` is null), with a single default cache behaviour and no
additional behaviours:

| Setting | Value | Consequence |
|---|---|---|
| `MinTTL` | `0` | Origin `max-age=0, must-revalidate` takes effect. A non-zero minimum would have overridden it and kept the entry points pinned. |
| `DefaultTTL` | `86400` | **An object uploaded with no `Cache-Control` is cached at the edge for 24 hours.** This is why the site currently serves cached responses despite no origin header. |
| `MaxTTL` | `31536000` | The one-year `immutable` on hashed assets is honoured in full. |
| `ResponseHeadersPolicyId` | null | No policy is rewriting headers on the way out. |

So the header contract above works as written, and **no CloudFront change is
required**. The `DefaultTTL` row is the reason it matters: a forgotten header
fails *closed* here, silently pinning a file for a day.

Re-check after any distribution change:

```bash
aws cloudfront get-distribution-config --id E3OO9Y9QRVZ2L1 \
  --query 'DistributionConfig.DefaultCacheBehavior.{Min:MinTTL,Default:DefaultTTL,Max:MaxTTL,Policy:CachePolicyId}'
```

If the distribution is ever migrated to a managed cache policy, prefer
`UseOriginCacheControlHeaders` (min 0, default 0): it keeps S3 object metadata
authoritative and makes a forgotten header fail open rather than closed.

A **response headers policy does not affect edge caching.** It rewrites the
viewer response only, so using one to set `Cache-Control` would fix the browser
and leave the stale copy at the edge untouched. Reserve response headers
policies for headers S3 cannot emit at all.

## Changing the header strategy

`aws s3 sync` compares size and modification time, **not metadata**. Changing a
`Cache-Control` value without changing the file's bytes leaves the old header in
place forever. To re-stamp existing objects:

```bash
aws s3 cp s3://aosreminders.com/ s3://aosreminders.com/ --recursive \
  --metadata-directive REPLACE --cache-control "<new value>"
```

Confirm with `aws s3api head-object --bucket aosreminders.com --key index.html`.

## Asset retention

The deploy does **not** pass `--delete`. It used to, which meant the previous
build's hashed chunks disappeared the moment a new build landed — so any browser
that had already loaded the old `index.html` got a 404 on the next lazy route
chunk it requested, and a failed dynamic import cannot be retried.

Superseded assets are instead bounded by a bucket lifecycle rule:

- **Scope:** prefix `assets/`
- **Action:** expire current versions after 30 days
- **Not** a noncurrent-version rule. Each build emits a *distinct key* rather
  than a new version of one key, so version-based expiration would never match.

Because the rule is age-based, the deploy runs a server-side
`--metadata-directive REPLACE` pass over `assets/` on every run. That refreshes
`LastModified` on chunks this build did not change, so a still-referenced chunk
cannot age out underneath loaded clients. **Removing that step re-arms exactly
the bug the retention rule exists to prevent.**

The rule lives in bucket configuration, not in this repository.

## Withdrawing a bad build

Retention has a consequence: superseded hashed assets stay publicly retrievable
until the rule expires them. Redeploying no longer withdraws anything. To pull a
build that shipped something it should not have — a mis-set `VITE_` value baked
into a chunk, say — delete the objects explicitly and invalidate:

```bash
aws s3 rm s3://aosreminders.com/assets/<chunk>.js
aws cloudfront create-invalidation --distribution-id E3OO9Y9QRVZ2L1 \
  --paths "/assets/<chunk>.js" "/" "/index.html"
```

## Rolling back the service worker

A service worker is the highest-reversal-cost artifact in this deploy: it
persists on clients until explicitly replaced or unregistered, and no automated
gate catches a bad one. `public/rollback-service-worker.js` is a committed no-op
worker that unregisters itself and deletes every cache it can see.

To un-ship a worker, upload it to the worker's own path and invalidate:

```bash
aws s3 cp public/rollback-service-worker.js s3://aosreminders.com/service-worker.js \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/javascript"
aws cloudfront create-invalidation --distribution-id E3OO9Y9QRVZ2L1 \
  --paths "/service-worker.js" "/" "/index.html"
```

Clients pick it up on their next worker update check, unregister, and fall back
to plain network delivery. Dry-run it against a local build before trusting it.

## Verifying a deploy

```bash
curl -sI https://aosreminders.com/ | grep -iE 'cache-control|age|x-cache'
curl -sI https://aosreminders.com/site.webmanifest | grep -iE 'cache-control|content-type'
curl -sI https://aosreminders.com/service-worker.js | grep -iE 'cache-control|content-type'
curl -sI https://aosreminders.com/assets/<hashed>.js | grep -i cache-control
```

Expect `max-age=0, must-revalidate` on the first three and `immutable` on the
last. A non-zero `Age` with `X-Cache: Hit` on a freshly deployed entry point
means the edge is still serving a stale copy — check the cache policy above.
