---
title: "deploy-production.sh: the contract test's fake aws and CI's bash are not production"
date: 2026-08-01
category: workflow-learnings
module: deployment
problem_type: workflow_issue
component: shell_script
severity: high
applies_when:
  - "Changing scripts/deploy-production.sh or any AWS call it makes"
  - "Adding or relaxing a case in the fake `aws` inside src/tests/deploymentContract.test.ts"
  - "A deploy-contract test passes but you have not asked what the real CLI, real S3, or real CloudFront would do"
  - "Adding a new build artifact the deploy script must publish, or removing one it still references"
  - "Relying on a bash construct that is not in bash 3.2 (macOS ships 3.2; upload.sh runs /bin/bash)"
symptoms:
  - "Production deploy fails partway with a nonzero exit while the full contract suite is green"
  - "Deploy succeeds but the live site is missing or eventually loses an asset it references"
  - "A guard in the script has no test that fails when the guard is inverted or deleted"
  - "A behaviour only reproduces on a macOS operator's manual deploy, never in GitHub Actions"
root_cause: environment_mismatch
resolution_type: process_change
related_components:
  - "scripts/deploy-production.sh"
  - "src/tests/deploymentContract.test.ts"
  - "upload.sh"
  - "CI-build.sh"
  - ".github/workflows/deploy.yml"
  - "docs/deployment.md"
tags: [deploy-script, contract-test-fidelity, fake-aws, bash-portability, s3-semantics, cloudfront, mutation-testing, test-doubles]
---

# `deploy-production.sh`: the contract test's fake `aws` and CI's bash are not production

## Context

`scripts/deploy-production.sh` was introduced on 2026-08-01 in PR #1809 as the single owner of every
AWS mutation, so manual (`upload.sh`), standalone-CI (`CI-build.sh`), and GitHub Actions deploys
could not drift. It shipped with `src/tests/deploymentContract.test.ts`, a contract suite that runs
the **real script** against a **fake `aws`** on `PATH` and asserts on the logged calls.

That design is sound, and the suite is genuinely good — it catches ordering, header, tagging, and
lock-protocol regressions. But in the first day of its life the script took **four** corrective PRs,
and every one of them was a defect the suite could not see, because the defect lived in the gap
between a stand-in and the real thing:

| PR | Defect | What the stand-in got wrong |
| --- | --- | --- |
| #1839 | Published a phantom `dist/registerSW.js` that `injectRegister: false` means the build never emits. First production deploy of #1809 died at exit 255 after publishing immutable assets, before `index.html`. | The fake `aws` accepted **any** `cp` source; the real CLI validates local paths first. |
| #1841 | Tag-only self-copy used `--metadata-directive COPY`, which real S3 rejects with `InvalidRequest`. Separately, `printf '%s' \| read` silently skipped the **last** retirement-eligible object on every deploy. | The fake never enforced S3's self-copy rule and never answered `head-object`; no fixture put an eligible key last. |
| #1843 | The ~12 MB catalog chunk shipped uncompressed to every visitor (12.25 MiB on the wire). | Nothing modelled CloudFront's ~10,000,000-byte compression ceiling — the behaviour is not an `aws` call at all. |
| #1842 | `declare -A` (bash 4+) made the **manual** deploy impossible on macOS, which ships bash 3.2. Review then found `workbox_dependencies` had no count check, so a workbox-less build would deploy "successfully" and tag the live runtime for deletion. | The suite spawns whatever `bash` is on `PATH`; CI is `ubuntu-latest`, so only bash 5 is ever exercised. |

Note the shape: **every commit that has ever touched the script also touched the contract test.**
That is the tell. The suite is not wrong — it is a model, and each defect was a place the model had
not yet been taught about reality.

## Guidance

When you change `scripts/deploy-production.sh`, do not ask "do the contract tests pass?" Ask the
four fidelity questions:

**1. Would the real `aws` CLI accept this?** The fake is permissive by default — it logs the call
and exits 0. Before trusting a green run, check whether the real CLI validates something the fake
does not. It already learned two lessons: local `cp` sources must exist (#1839), and a self-copy
changing only tags needs `--metadata-directive REPLACE` (#1841). If your change relies on any other
CLI-side validation, **teach the fake that rule in the same PR** — that is the established pattern,
not an optional extra.

**2. Would the real AWS *service* behave this way?** Distinct from the CLI. S3's self-copy rule and
CloudFront's compression ceiling are service behaviours with no local proxy at all. #1843's fix
exists entirely because a service limit was invisible to every test in the repo. When your change
depends on a service threshold or quota, write it down in `docs/deployment.md` and, where possible,
make it a named overridable variable so the suite can exercise the path with small fixtures — the
way `PRECOMPRESS_THRESHOLD_BYTES` does.

**3. Would this run on bash 3.2?** macOS has shipped bash 3.2.57 since 2007 for GPLv3 reasons, and
`upload.sh` — the manual production deploy — invokes `bash scripts/deploy-production.sh`, which
resolves to `/bin/bash`. Every workflow is `ubuntu-latest`, so **CI can never catch a bash-4-ism.**
Concretely, avoid `declare -A`, `mapfile`/`readarray`, `${var,,}` / `${var^^}`, and negative array
indices. Guard element-expansions of possibly-empty arrays with `${arr[@]+"${arr[@]}"}` — bash 3.2
treats a bare `"${arr[@]}"` on an empty array as an unbound variable under `set -u`, while bash 5
does not. (Length expansions like `${#arr[@]}` are safe on both.)

`bash -n` is **not** the check for this. It only parses, and every construct above fails bash 3.2 at
*run* time, not at parse time: `declare -A` is an invalid option to a builtin that exists, `mapfile`
is a builtin that does not exist, `${var,,}` is applied during expansion, and `${arr[-1]}` is
evaluated as a subscript. `bash -n` exits 0 on all four, so it certifies exactly the defect it would
be run to find. The cheap local check that can actually fail is a construct grep:

```bash
grep -nE '^[^#]*(declare -A|mapfile|readarray|\$\{[A-Za-z_][A-Za-z0-9_]*(,,|\^\^)|\[ *-[0-9])' \
  scripts/deploy-production.sh
```

Expect no hits (the `^[^#]*` prefix keeps the comment that *names* `declare -A` from matching).
Verified against #1842: it hits `declare -A` on the pre-fix script and is clean on the fixed one,
while `bash -n` exits 0 on both. For real coverage, run the deployment-contract suite against a
pinned `bash:3.2` container — see Known gaps below. Keep `bash -n` only as a syntax smoke test.

**4. Would a test fail if this guard were wrong?** A guard whose inversion leaves the suite green is
decoration. Two separate reviewers found exactly this in #1842: stubbing `is_current_immutable_object`
to always report "not current" — the failure that tags every live asset for 30-day deletion — left
all 14 tests passing. **Mutate the guard and re-run.** If the suite stays green, the assertion you
need does not exist yet. This is the single highest-yield check on this file, because the script's
worst failures are silent and delayed: a wrong retirement tag does nothing visible for 30 days.

### The verification that actually works here

For any behaviour-preserving change (refactors especially), run the real script against a stubbed
`aws` under both bash majors and diff the emitted calls. #1842 used a throwaway harness that creates
a fake `dist/`, puts a logging stub on `PATH`, and runs the script; comparing sorted logs from
bash 3.2 and bash 5.2 — and against the pre-change script — is what made a rewrite of the
production deploy path reviewable. Compare the **sorted** log for set equality and say so; iteration
order is not always preserved (that rewrite changed `put-object-tagging` from associative-array hash
order to `find` order, which is inert but real).

## Why This Matters

- **The blast radius is production and it is delayed.** This script publishes to a live site, holds
  a distributed lock, and tags objects for a lifecycle rule that deletes them 30 days later. The
  ordered-publish design contains the damage — a mid-deploy failure leaves prod on the previous
  coherent build and releases the lock — but a *wrong* retirement tag is not a failure at all until
  a month later.
- **Four same-day fixes is a pattern, not bad luck.** Each was a competent change that passed a
  competent test suite. The recurring cause is structural: a test double is a hypothesis about the
  real system, and this script's real system is three services, a CLI, and two shell majors.
- **CI's platform coverage is narrower than the script's.** `upload.sh` is a supported entry point
  and runs on the maintainer's Mac. Anything the deploy contract asserts is asserted only under
  Linux + bash 5 until someone runs the suite locally.

## When to Apply

- Before merging any change to `scripts/deploy-production.sh` — walk the four questions above.
- When adding a case to the fake `aws`: prefer teaching it to **reject** what the real thing rejects
  over teaching it to accept what you need.
- When a deploy fails in production: check whether the contract suite could have caught it, and if
  not, add the missing fidelity in the same PR as the fix. That is how the fake accumulated its
  current rules.
- When adding a build artifact the script must publish, or a `dist/` file it references: add a
  fixture and, if absence is fatal, a fail-closed guard with a test that fails without it.

## Examples

### Teaching the fake to reject what the real CLI rejects (#1839)

```bash
# The real CLI validates local cp sources before any request; a phantom build artifact in the
# script must fail here exactly as it would in production.
if [[ "$1 $2" == "s3 cp" && "$3" != s3://* && ! -e "$3" ]]; then
  echo "The user-provided path $3 does not exist." >&2
  exit 255
fi
```

### Teaching the fake a service rule (#1841)

```bash
# Real S3 refuses an in-place copy that changes nothing but tags; only the REPLACE metadata
# directive makes a self-copy legal. Enforce it so the script cannot regress to COPY.
if [[ "$1 $2" == "s3api copy-object" && "$*" == *"--metadata-directive COPY"* ]]; then
  echo 'An error occurred (InvalidRequest) when calling the CopyObject operation: illegal self-copy without metadata change' >&2
  exit 254
fi
```

### The assertion a mutation test demanded (#1842)

Before, the suite asserted that *superseded* keys get retired but never that *live* keys do not, so
an always-false membership check passed 14/14:

```ts
// The live build's own keys must never be tagged for retirement: the lifecycle rule would
// delete them 30 days later. Without these, a membership check that always reported "not
// current" would still pass every other assertion in this suite.
expect(copiesFor('assets/current-123.js')).toHaveLength(0)
expect(copiesFor('sw-extras-abc123.js')).toHaveLength(0)
expect(copiesFor('workbox-abc123.js')).toHaveLength(0)
```

### Fail closed on a missing artifact rather than deploying a broken site (#1842)

`dist/service-worker.js` opens with `define(["./workbox-<hash>"])`, so a build with no workbox chunk
is broken — but without this the deploy succeeds, never uploads the chunk, and tags the live one for
deletion:

```bash
[[ ${#workbox_dependencies[@]} -ge 1 ]] ||
  fail "expected at least one content-hashed workbox-*.js runtime, found 0"
```

Placed beside its `extras` sibling, before the lock is acquired — a precondition failure should
never reach the point of holding the deploy lock.

## Known gaps

- **No CI job runs this script under bash 3.2.** Until one exists, bash-4-isms ship green and only
  surface on a manual macOS deploy. A pinned `bash:3.2` container step running the deployment
  contract suite, or a lint step banning the constructs listed above, would close it.
- **No `shellcheck` step** anywhere in the repo.
- The fake `aws` models the calls this script makes today; it is not a general AWS simulator, and
  should not be mistaken for one.

## Related

- GitHub #1809 — feat(pwa): introduced the script and its contract suite
- GitHub #1839 — fix(deploy): drop the phantom registerSW.js publication step
- GitHub #1841 — fix(deploy): make asset retirement survive real S3 semantics
- GitHub #1843 — perf: pre-gzip assets above CloudFront's compression ceiling
- GitHub #1840 / PR #1842 — bash 3.2 portability, plus the workbox guard and retirement coverage this review surfaced
- docs/deployment.md — the S3/CloudFront header contract, asset retention, and worker rollback
- docs/pwa.md — how the service worker, install, and offline behaviour fit together
