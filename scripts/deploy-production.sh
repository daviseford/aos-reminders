#!/usr/bin/env bash
# Shared production publication contract. Callers build and validate dist/ first; this script owns
# every AWS mutation so manual, standalone CI, and GitHub Actions deployments cannot drift.
set -euo pipefail

SITE_S3="${SITE_S3:-s3://aosreminders.com}"
SITE_BUILD_DIR="${SITE_BUILD_DIR:-./dist}"
CF_DIST_ID="${CF_DIST_ID:-E3OO9Y9QRVZ2L1}"
DEPLOY_OWNER="${DEPLOY_OWNER:-manual:${USER:-unknown}@${HOSTNAME:-unknown}:$$}"
DEPLOY_LOCK_KEY="${DEPLOY_LOCK_KEY:-_deploy/production.lock}"

IMMUTABLE='public, max-age=31536000, immutable'
MODERATE='public, max-age=86400'
REVALIDATE='public, max-age=0, must-revalidate'

fail() {
  echo "FATAL: $*" >&2
  exit 1
}

[[ "$SITE_S3" == s3://* ]] || fail "SITE_S3 must be an s3:// URI"
[[ "$DEPLOY_OWNER" =~ ^[A-Za-z0-9._:/@+-]+$ ]] ||
  fail "DEPLOY_OWNER contains characters that cannot be stored safely in lock metadata"
command -v aws >/dev/null 2>&1 || fail "aws CLI is required"

site_location="${SITE_S3#s3://}"
SITE_BUCKET="${site_location%%/*}"
if [[ "$site_location" == */* ]]; then
  site_path="${site_location#*/}"
  SITE_PREFIX="${site_path%/}/"
else
  SITE_PREFIX=''
fi
SITE_S3="${SITE_S3%/}"
ASSET_PREFIX="${SITE_PREFIX}assets/"
LOCK_OBJECT_KEY="${SITE_PREFIX}${DEPLOY_LOCK_KEY}"

for required in index.html site.webmanifest service-worker.js; do
  [[ -f "${SITE_BUILD_DIR}/${required}" ]] ||
    fail "${SITE_BUILD_DIR}/${required} is missing; refusing to deploy"
done
[[ -d "${SITE_BUILD_DIR}/assets" ]] || fail "${SITE_BUILD_DIR}/assets is missing"

# Fail before acquiring the lock or publishing anything when the production infrastructure would
# make a coherent PWA release unsafe. These are read-only probes; changing either configuration is
# a separate operator action.
lifecycle_query='[length(Rules), length(Rules[0]), Rules[0].ID, Rules[0].Status,'
lifecycle_query+=' length(Rules[0].Filter), length(Rules[0].Filter.Tag), Rules[0].Filter.Tag.Key,'
lifecycle_query+=' Rules[0].Filter.Tag.Value, length(Rules[0].Expiration),'
lifecycle_query+=' Rules[0].Expiration.Days]'
if ! lifecycle_rule=$(aws s3api get-bucket-lifecycle-configuration \
  --bucket "$SITE_BUCKET" \
  --query "$lifecycle_query" \
  --output text 2>/dev/null); then
  fail "production lifecycle is missing; configure the single tag-filtered retire=true rule"
fi
IFS=$'\t' read -r lifecycle_rule_count lifecycle_rule_field_count lifecycle_id lifecycle_status \
  lifecycle_filter_field_count lifecycle_tag_field_count lifecycle_tag_key lifecycle_tag_value \
  lifecycle_expiration_field_count lifecycle_days <<< "$lifecycle_rule"
[[ "$lifecycle_rule_count" == '1' &&
  "$lifecycle_rule_field_count" == '4' &&
  "$lifecycle_id" == 'retire-superseded-assets' &&
  "$lifecycle_status" == 'Enabled' &&
  "$lifecycle_filter_field_count" == '1' &&
  "$lifecycle_tag_field_count" == '2' &&
  "$lifecycle_tag_key" == 'retire' &&
  "$lifecycle_tag_value" == 'true' &&
  "$lifecycle_expiration_field_count" == '1' &&
  "$lifecycle_days" == '30' ]] ||
  fail "production lifecycle must contain exactly one Enabled retire=true tag-only rule" \
    "with 30-day expiration"

cloudfront_query='DistributionConfig.[DefaultCacheBehavior.MinTTL,'
cloudfront_query+=' DefaultCacheBehavior.DefaultTTL, DefaultCacheBehavior.MaxTTL,'
cloudfront_query+=' DefaultCacheBehavior.CachePolicyId,'
cloudfront_query+=' DefaultCacheBehavior.ResponseHeadersPolicyId, CacheBehaviors.Quantity]'
if ! cloudfront_behavior=$(aws cloudfront get-distribution-config \
  --id "$CF_DIST_ID" \
  --query "$cloudfront_query" \
  --output text 2>/dev/null); then
  fail "CloudFront cache behavior could not be verified"
fi
IFS=$'\t' read -r min_ttl default_ttl max_ttl cache_policy response_headers_policy \
  ordered_behavior_count <<< "$cloudfront_behavior"
[[ "$min_ttl" == '0' &&
  "$default_ttl" == '86400' &&
  "$max_ttl" == '31536000' &&
  "$cache_policy" == 'None' &&
  "$response_headers_policy" == 'None' &&
  "$ordered_behavior_count" == '0' ]] ||
  fail "CloudFront must use only the documented default behavior and no ordered cache behaviors"

shopt -s nullglob
extras=("${SITE_BUILD_DIR}"/sw-extras-*.js)
[[ ${#extras[@]} -eq 1 ]] ||
  fail "expected exactly one content-hashed sw-extras-*.js dependency, found ${#extras[@]}"
workbox_dependencies=("${SITE_BUILD_DIR}"/workbox-*.js)
registration_dependencies=("${SITE_BUILD_DIR}"/registerSW.js)

lock_body=$(mktemp)
lock_error=$(mktemp)
cleanup_local_lock_files() {
  rm -f "$lock_body" "$lock_error"
}
trap cleanup_local_lock_files EXIT
printf '{"owner":"%s"}\n' "$DEPLOY_OWNER" > "$lock_body"

DEPLOY_LOCK_ETAG=''
try_acquire_lock() {
  if DEPLOY_LOCK_ETAG=$(aws s3api put-object \
    --bucket "$SITE_BUCKET" \
    --key "$LOCK_OBJECT_KEY" \
    --body "$lock_body" \
    --content-type 'application/json' \
    --metadata "owner=${DEPLOY_OWNER}" \
    --if-none-match '*' \
    --query ETag \
    --output text 2>"$lock_error"); then
    [[ -n "$DEPLOY_LOCK_ETAG" && "$DEPLOY_LOCK_ETAG" != 'None' ]] ||
      fail "lock acquisition returned no ETag"
    return 0
  fi
  return 1
}

describe_lock() {
  local description
  if ! description=$(aws s3api head-object \
    --bucket "$SITE_BUCKET" \
    --key "$LOCK_OBJECT_KEY" \
    --query '[ETag, Metadata.owner, LastModified]' \
    --output text 2>/dev/null); then
    fail "production lock acquisition failed and its holder could not be read: $(<"$lock_error")"
  fi
  IFS=$'\t' read -r HELD_LOCK_ETAG HELD_LOCK_OWNER HELD_LOCK_MODIFIED <<< "$description"
}

recover_owner="${DEPLOY_LOCK_RECOVER_OWNER:-}"
recover_etag="${DEPLOY_LOCK_RECOVER_ETAG:-}"
if [[ -n "$recover_owner" || -n "$recover_etag" ]]; then
  [[ -n "$recover_owner" && -n "$recover_etag" ]] ||
    fail "stale-lock recovery requires both DEPLOY_LOCK_RECOVER_OWNER and DEPLOY_LOCK_RECOVER_ETAG"
fi

if ! try_acquire_lock; then
  describe_lock
  if [[ -z "$recover_owner" ]]; then
    fail "production deploy lock is held by ${HELD_LOCK_OWNER:-unknown} at ${HELD_LOCK_MODIFIED:-unknown} (ETag ${HELD_LOCK_ETAG:-unknown})"
  fi
  [[ "$HELD_LOCK_OWNER" == "$recover_owner" && "$HELD_LOCK_ETAG" == "$recover_etag" ]] ||
    fail "stale-lock recovery refused: expected ${recover_owner}/${recover_etag}, found ${HELD_LOCK_OWNER}/${HELD_LOCK_ETAG}"

  aws s3api delete-object \
    --bucket "$SITE_BUCKET" \
    --key "$LOCK_OBJECT_KEY" \
    --if-match "$recover_etag" >/dev/null
  try_acquire_lock || fail "stale lock was removed, but another deploy acquired it first"
fi

cleanup_local_lock_files
trap - EXIT

release_lock() {
  local deploy_status=$?
  local release_status=0
  trap - EXIT
  if ! aws s3api delete-object \
    --bucket "$SITE_BUCKET" \
    --key "$LOCK_OBJECT_KEY" \
    --if-match "$DEPLOY_LOCK_ETAG" >/dev/null; then
    echo "FATAL: failed to release production deploy lock ${DEPLOY_LOCK_ETAG}" >&2
    release_status=1
  fi
  if [[ $deploy_status -ne 0 ]]; then
    exit "$deploy_status"
  fi
  exit "$release_status"
}
trap release_lock EXIT

declare -A current_immutable_objects=()
while IFS= read -r -d '' local_asset; do
  relative_asset="${local_asset#"${SITE_BUILD_DIR%/}/"}"
  current_immutable_objects["${SITE_PREFIX}${relative_asset}"]=1
done < <(find "${SITE_BUILD_DIR}/assets" -type f -print0)
[[ ${#current_immutable_objects[@]} -gt 0 ]] || fail "${SITE_BUILD_DIR}/assets contains no files"

for dependency in "${extras[@]}" "${workbox_dependencies[@]}"; do
  current_immutable_objects["${SITE_PREFIX}$(basename "$dependency")"]=1
done

# Immutable content is published first. Current files are explicitly removed from the retirement
# lifecycle before either mutable entry point can reference them.
aws s3 cp "${SITE_BUILD_DIR}/assets" "${SITE_S3}/assets" \
  --recursive \
  --cache-control "$IMMUTABLE"

for dependency in "${extras[@]}" "${workbox_dependencies[@]}"; do
  aws s3 cp "$dependency" "${SITE_S3}/$(basename "$dependency")" \
    --cache-control "$IMMUTABLE" \
    --content-type 'text/javascript; charset=utf-8'
done

for immutable_key in "${!current_immutable_objects[@]}"; do
  aws s3api put-object-tagging \
    --bucket "$SITE_BUCKET" \
    --key "$immutable_key" \
    --tagging 'TagSet=[{Key=retire,Value=false}]' >/dev/null
done

# Unhashed public assets carry a query-version buster, not a content hash.
aws s3 cp "$SITE_BUILD_DIR" "$SITE_S3" \
  --recursive \
  --exclude '*build_log.txt' --exclude '*.idea*' --exclude '*.sh' \
  --exclude '*.git*' --exclude '*.DS_Store' \
  --exclude 'assets/*' --exclude 'index.html' --exclude 'site.webmanifest' \
  --exclude 'service-worker.js' --exclude 'workbox-*.js' --exclude 'registerSW.js' \
  --exclude 'sw-extras-*.js' \
  --cache-control "$MODERATE"

aws s3 cp "${SITE_BUILD_DIR}/site.webmanifest" "${SITE_S3}/site.webmanifest" \
  --cache-control "$REVALIDATE" \
  --content-type 'application/manifest+json'

for dependency in "${registration_dependencies[@]}"; do
  aws s3 cp "$dependency" "${SITE_S3}/$(basename "$dependency")" \
    --cache-control "$REVALIDATE" \
    --content-type 'text/javascript; charset=utf-8'
done

# The app entry point is mutable and lands only after everything it can reference.
aws s3 cp "${SITE_BUILD_DIR}/index.html" "${SITE_S3}/index.html" \
  --cache-control "$REVALIDATE" \
  --content-type 'text/html; charset=utf-8'

# The worker is the final publication write. Its imported extras URL is content-hashed, so an
# interrupted deploy cannot make the previous worker observe the new build's dependency.
aws s3 cp "${SITE_BUILD_DIR}/service-worker.js" "${SITE_S3}/service-worker.js" \
  --cache-control "$REVALIDATE" \
  --content-type 'text/javascript; charset=utf-8'

aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths '/' '/index.html' '/site.webmanifest' '/service-worker.js'

# Start the 30-day clock only when an immutable file first leaves the live build. A self-copy
# preserves metadata while changing the tag and LastModified. Already-retired objects are left
# untouched, so later deployments cannot extend their retention window.
remote_immutable_output=$(
  for immutable_prefix in "$ASSET_PREFIX" "${SITE_PREFIX}sw-extras-" "${SITE_PREFIX}workbox-"; do
    aws s3api list-objects-v2 \
      --bucket "$SITE_BUCKET" \
      --prefix "$immutable_prefix" \
      --query 'Contents[].Key' \
      --output text
  done
)

while IFS= read -r remote_immutable; do
  [[ -n "$remote_immutable" ]] || continue
  relative_immutable="${remote_immutable#"$SITE_PREFIX"}"
  case "$relative_immutable" in
    assets/*) ;;
    sw-extras-*.js | workbox-*.js)
      [[ "$relative_immutable" != */* ]] || continue
      ;;
    *) continue ;;
  esac
  [[ -n "${current_immutable_objects[$remote_immutable]:-}" ]] && continue

  retire_tag=$(aws s3api get-object-tagging \
    --bucket "$SITE_BUCKET" \
    --key "$remote_immutable" \
    --query "TagSet[?Key=='retire'].Value | [0]" \
    --output text)
  [[ "$retire_tag" == 'true' ]] && continue

  aws s3api copy-object \
    --bucket "$SITE_BUCKET" \
    --key "$remote_immutable" \
    --copy-source "${SITE_BUCKET}/${remote_immutable}" \
    --metadata-directive COPY \
    --tagging-directive REPLACE \
    --tagging 'retire=true' >/dev/null
done < <(printf '%s' "$remote_immutable_output" | tr '\t' '\n')

echo 'Deployed to https://aosreminders.com/'
