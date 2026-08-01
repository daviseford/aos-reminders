#!/usr/bin/env bash
# Manual production deploy. scripts/deploy-production.sh owns the AWS publication contract.
set -euo pipefail

export SITE_S3="${SITE_S3:-s3://aosreminders.com}"
export SITE_BUILD_DIR="${SITE_BUILD_DIR:-./dist}"
export CF_DIST_ID="${CF_DIST_ID:-E3OO9Y9QRVZ2L1}"
export DEPLOY_OWNER="${DEPLOY_OWNER:-manual:${USER:-unknown}@${HOSTNAME:-unknown}:$$}"

yarn install --frozen-lockfile
yarn build

bash scripts/deploy-production.sh
