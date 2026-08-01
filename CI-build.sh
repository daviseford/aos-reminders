#!/usr/bin/env bash
# Standalone CI deploy. scripts/deploy-production.sh owns the AWS publication contract.
set -euo pipefail

# Legacy callers may still inject these values before running the script.
export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-us-east-1}"
export SITE_S3="${SITE_S3:-s3://aosreminders.com}"
export SITE_BUILD_DIR="${SITE_BUILD_DIR:-./dist}"
export CF_DIST_ID="${CF_DIST_ID:-E3OO9Y9QRVZ2L1}"
export DEPLOY_OWNER="${DEPLOY_OWNER:-standalone-ci:${CI_BUILD_ID:-unknown}:$$}"

pip install awscli
yarn install --frozen-lockfile
yarn build

bash scripts/deploy-production.sh
