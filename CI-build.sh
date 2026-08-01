#!/usr/bin/env bash
# Standalone CI deploy. scripts/deploy-production.sh owns the AWS publication contract.
set -euo pipefail

export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-us-east-1}"
export DEPLOY_OWNER="${DEPLOY_OWNER:-standalone-ci:${CI_BUILD_ID:-unknown}:$$}"

pip install awscli
yarn install --frozen-lockfile
yarn build

bash scripts/deploy-production.sh
