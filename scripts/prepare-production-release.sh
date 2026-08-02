#!/usr/bin/env bash
# Build and verify the exact artifact that is eligible for production publication.
set -euo pipefail

yarn release:validate-config
yarn lint
yarn data:aos4:verify:beta
yarn tsc --noEmit
yarn build
yarn test --run
yarn release:inspect-artifact
