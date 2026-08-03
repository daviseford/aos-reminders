#!/usr/bin/env bash
# Build and verify the exact artifact that is eligible for production publication.
set -euo pipefail

yarn release:validate-config

# These gates have no shared outputs. The build already begins with tsc, so a separate typecheck
# would only compile the same revision twice.
yarn lint &
lint_pid=$!
yarn data:aos4:verify:beta &
beta_pid=$!
yarn build &
build_pid=$!

gate_status=0
wait "$lint_pid" || gate_status=1
wait "$beta_pid" || gate_status=1
wait "$build_pid" || gate_status=1
[[ $gate_status -eq 0 ]] || exit "$gate_status"

# Both consumers read the completed dist tree without mutating it.
yarn test --run &
test_pid=$!
yarn release:inspect-artifact &
inspection_pid=$!

gate_status=0
wait "$test_pid" || gate_status=1
wait "$inspection_pid" || gate_status=1
exit "$gate_status"
