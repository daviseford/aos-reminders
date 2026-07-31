#!/bin/bash
# Standalone CI deploy. Keep this file, upload.sh, and
# .github/workflows/deploy.yml in step -- they carry the same upload contract.
# See docs/deployment.md for why the ordering and headers are what they are.
set -euo pipefail

# Set up environment variables
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_DEFAULT_REGION="us-east-1"
export AWS_S3_BUCKET="aosreminders.com/"
SITE_S3="s3://aosreminders.com"
SITE_BUILD_DIR="./dist"
CF_DIST_ID="E3OO9Y9QRVZ2L1"

IMMUTABLE='public, max-age=31536000, immutable'
MODERATE='public, max-age=86400'
REVALIDATE='public, max-age=0, must-revalidate'

# Set up our environment, install dependencies, and build
pip install awscli
yarn install --frozen-lockfile
yarn build

echo "Now uploading to S3"

# 1. Content-hashed assets first: a freshly revalidated index.html must never
#    reference a chunk that has not landed yet.
#
#    `cp`, not `sync`. sync skips objects whose size and mtime match, which would
#    leave a still-referenced chunk's LastModified frozen at its first upload --
#    and the bucket lifecycle rule expires by age, so it would eventually delete
#    a chunk the live index.html still points at. Uploading unconditionally
#    refreshes exactly this build's asset set and nothing else; refreshing the
#    whole remote prefix instead would also revive long-dead orphans and stop the
#    lifecycle rule ever collecting anything.
aws s3 cp "${SITE_BUILD_DIR}/assets" "${SITE_S3}/assets" \
  --recursive --cache-control "${IMMUTABLE}"

# 2. Unhashed public assets: they carry a ?v= query buster rather than a content
#    hash, so a moderate TTL and no `immutable`.
aws s3 sync "${SITE_BUILD_DIR}" "${SITE_S3}" \
  --exclude "*build_log.txt" --exclude "*.idea*" --exclude "*.sh" \
  --exclude "*.git*" --exclude "*.DS_Store" \
  --exclude "assets/*" --exclude "index.html" --exclude "site.webmanifest" \
  --exclude "service-worker.js" --exclude "workbox-*.js" --exclude "registerSW.js" \
  --exclude "sw-extras.js" \
  --cache-control "${MODERATE}"

# 3. Manifest and service worker. The worker only exists once the PWA plugin is
#    building it, so the upload is guarded.
aws s3 cp "${SITE_BUILD_DIR}/site.webmanifest" "${SITE_S3}/site.webmanifest" \
  --cache-control "${REVALIDATE}"

for worker in "${SITE_BUILD_DIR}"/service-worker.js "${SITE_BUILD_DIR}"/workbox-*.js \
              "${SITE_BUILD_DIR}"/registerSW.js "${SITE_BUILD_DIR}"/sw-extras.js; do
  [ -e "${worker}" ] || continue
  aws s3 cp "${worker}" "${SITE_S3}/$(basename "${worker}")" --cache-control "${REVALIDATE}"
done

# 4. index.html last.
aws s3 cp "${SITE_BUILD_DIR}/index.html" "${SITE_S3}/index.html" \
  --cache-control "${REVALIDATE}" --content-type "text/html; charset=utf-8"

# 5. Invalidate only the mutable entry points. `/*` is one billable path but
#    evicts every hashed asset from the edge, forcing a full refetch from S3.
echo "Now invalidating CF cache"
aws cloudfront create-invalidation --distribution-id "${CF_DIST_ID}" \
  --paths "/" "/index.html" "/site.webmanifest" "/service-worker.js"

echo "Deployed to https://aosreminders.com/"
