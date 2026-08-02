#!/usr/bin/env bash
# Manual production deploy. scripts/deploy-production.sh owns the AWS publication contract.
set -euo pipefail

export DEPLOY_OWNER="${DEPLOY_OWNER:-manual:${USER:-unknown}@${HOSTNAME:-unknown}:$$}"

yarn install --frozen-lockfile
bash scripts/prepare-production-release.sh

bash scripts/deploy-production.sh
