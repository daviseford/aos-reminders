# AoS 4 data accuracy review

AoS Reminders accepts an AoS 4 corpus only after two separate questions pass:

1. Did the acquisition and generation pipeline consume the intended source snapshot without
   inventing, dropping, or silently overriding structured facts?
2. Did independent reviewers confirm that the source evidence, canonical catalog, and runtime
   projection agree?

A successful download, parser run, or application build is not an accuracy certification.

## Current campaign

The candidate revision is `aos4-corpus-2026-07-28`, generated from the accepted 2026-07-27 source
snapshot. Its machine review is complete:

| Measure | Result |
| --- | ---: |
| Accepted artifacts independently inventoried | 241/241 |
| Explicit non-material discovery entries | 9 |
| Official battle-profile facts | 1,350/1,350 |
| Final official/secondary reconciliation discrepancies | 406/406 |
| Official profile-only facts | 12/12 |
| Live audit source records | 19,057/19,057 |
| Superseded source-record dispositions | 18,897/18,897 |
| Live review pairs | 39,723/39,723 |
| Agent outcomes | 79,446 pass; 0 finding; 0 cannot-verify |
| Supported faction/context strata | 129/129 |
| Populated high-risk cohorts | 16/16 |
| Deterministic human sample | 169 pairs |

The independent source inventory was observed at `2026-07-28T18:21:35.398Z`: 241 entries matched
accepted checksums and 9 discovery entries received explicit non-material dispositions.

The final certificate remains blocked until a named human AoS reviewer completes and signs all 169
sample pairs. Do not describe Phase 1 as certified, enable the CI certificate gate, or begin Phase
2 implementation before that ledger produces `status: "pass"`.

The 129 faction/context strata are the combinations declared by each faction's catalog
applicability, not a Cartesian product. The previous 140 count was inflated by global rules that
were incorrectly allowed to stand in for unsupported or faction-specific strata. Every selected
stratum now uses faction-specific source evidence that projects to runtime; shared/global faction
records cannot satisfy it.

These results are evidence-coverage counts, not a statistical accuracy percentage. Official
reference PDF pages prove inventory and provenance unless a structured fact is extracted from
them; the 1,350 official battle-profile facts and their reconciliations are the current
fact-by-fact official extraction scope. Games Workshop still wins every applicable detected
disagreement.

## Evidence and trust boundary

Raw PDFs, HTML, CSV exports, extracted text, and review excerpts stay under `.cache/aos4/`. Source
text is delimited and treated as untrusted data, never reviewer instructions. The repository may
commit only structured facts and compact review records: IDs, checksums, locators, outcomes,
findings, resolutions, verifications, sign-offs, coverage summaries, and the certificate manifest.

The packet builder creates:

- a blind packet containing source locators and a minimized source excerpt, but no generated value;
- a comparison packet containing the saved blind interpretation and generated destinations;
- a safe index containing no source excerpts;
- four hidden-outcome calibration controls that never count toward corpus coverage.

Every result binds its assignment, reviewer configuration, packet ID, packet checksum, rubric,
timestamp, outcome, rationale, and findings. Changing source, generated output, protocol, rubric,
review records, sign-offs, or inventory makes the certificate stale.

## Full review workflow

All timestamps below must be canonical ISO instants. Output directories are create-only so a new
attempt cannot overwrite prior evidence.

### 1. Replay and prepare

Populate the accepted checksum cache, then run:

```powershell
yarn data:aos4:generate:candidate
yarn data:aos4:review:prepare `
  --workspace .cache/aos4/review/workspace-<revision>
```

The first command proves accepted generation from cached immutable bytes without requiring an
existing passing certificate. The second writes the create-only sharded evidence workspace and
safe index to the specified ignored directory. Use a new revision-specific path for every
preparation; an existing workspace is immutable and is never resumed or overwritten.

Run independent Games Workshop and Wahapedia observations immediately before sign-off, then
combine them:

```powershell
yarn data:aos4:inventory `
  --revision aos4-corpus-2026-07-28 `
  --observation .cache/aos4/review/games-workshop-observation.json `
  --observation .cache/aos4/review/wahapedia-observation.json
```

Any missing, unexpected, inaccessible, or ambiguous entry blocks certification. A non-material
entry needs a specific reviewed rationale; it is not a way to waive a source that can change
player-facing meaning.

### 2. Run the independent machine campaign

```powershell
yarn data:aos4:review:adversarial `
  --workspace .cache/aos4/review/workspace-<revision> `
  --output .cache/aos4/review/adversarial-<revision> `
  --campaign-at <iso-instant>
```

The reviewer must pass the exact rubric calibration before live outcomes are accepted. Blind
results are recorded before comparison results. Any finding or `cannot-verify` outcome blocks the
certificate until adjudicated and re-reviewed.

### 3. Run the human faction/context sample

Use a durable reviewer identity; do not use a placeholder or another person's name:

```powershell
yarn data:aos4:review:human prepare `
  --output .cache/aos4/review/human-<reviewer>-<revision> `
  --reviewer-id <reviewer-id> `
  --assigned-at <iso-instant> `
  --index .cache/aos4/review/workspace-<revision>/index.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json
```

This initially creates only `calibration-blind-tasks.json` and its result template. For every
task, the reviewer records a source-derived interpretation, outcome, and substantive rationale
explaining why the source supports it. The four calibration controls do not reveal their expected
outcome.

Save the completed calibration blind results, then reveal their comparisons:

```powershell
yarn data:aos4:review:human calibrate `
  --review-dir .cache/aos4/review/human-<reviewer>-<revision> `
  --blind-results calibration-blind-results.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json
```

The command seals the entered blind results and writes the revealed tasks plus template under
`calibration-comparison/`. Complete `calibration-comparison/results.template.json`, then validate
calibration and release the live sample:

```powershell
yarn data:aos4:review:human start `
  --review-dir .cache/aos4/review/human-<reviewer>-<revision> `
  --comparison-results calibration-comparison/results.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json
```

The `start` command fails unless the reviewer finds every planted material defect, proposes no
unsupported correction, and returns `cannot-verify` for the insufficient-evidence case. Only a
passing calibration creates `sample-blind/tasks.json` and
`sample-blind/results.template.json` for the 169 live sample pairs. Reviewers may omit finding `id`
and `schemaVersion` fields from entered result files; the command derives those structural fields
from the finding content before validation.

Save the completed blind results as `sample-blind/results.json`, then reveal comparisons:

```powershell
yarn data:aos4:review:human compare `
  --review-dir .cache/aos4/review/human-<reviewer>-<revision> `
  --blind-results sample-blind/results.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json
```

The command seals the entered blind results and writes the revealed tasks plus template under
`sample-comparison/`. Complete `sample-comparison/results.template.json` against the generated
destinations. A source conflict, unclear evidence, or suspected defect must be recorded as
`finding` or `cannot-verify`; never turn uncertainty into a pass.

After all findings have been adjudicated and corrected upstream, submit the clean re-review:

```powershell
yarn data:aos4:review:human submit `
  --review-dir .cache/aos4/review/human-<reviewer>-<revision> `
  --comparison-results sample-comparison/results.json `
  --signed-at <iso-instant-after-all-results> `
  --statement "I independently checked every assigned packet against its cited evidence and applied the AoS 4 source hierarchy." `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json
```

Submission fails if calibration is wrong, a pair is incomplete, comparison preceded blind review,
a checksum is stale, any sample result is not `pass`, or the signature does not cover every
sampled faction and context. Each stage is create-only and carries a checksum receipt, so reruns
cannot silently replace saved blind work. The output `ledger.json` is the human input to
certification.

### 4. Adjudicate findings

Every finding needs an evidence-backed disposition:

- `fixed`: correct acquisition, decoding, normalization, identity, reconciliation, context, or
  generation upstream; regenerate and re-review the changed packets;
- `false-positive`: explain why the cited evidence supports the current value;
- `accepted-limitation`: minor only, incapable of misleading player-facing meaning, with explicit
  human approval and an owner.

Blocker and major fixes require verification by a person or reviewer distinct from the original
reviewer and resolver. Never edit generated catalog/runtime JSON or reviewer output to manufacture
a pass.

### 5. Prepare and verify the certificate

After machine and human review pass:

```powershell
yarn data:aos4:certify:prepare `
  --output data/aos4/certifications/<revision> `
  --review-output .cache/aos4/review/adversarial-<revision> `
  --index .cache/aos4/review/workspace-<revision>/index.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json `
  --human-ledger .cache/aos4/review/human-<reviewer>-<revision>/ledger.json `
  --evaluated-at <iso-instant> `
  --require-pass
```

Inspect the manifest and summary. Add `data/aos4/certifications/current.json` only when the
manifest reports `pass`, pointing it at that immutable revision directory. Certification
directories are create-only; never edit a summary, ledger, or sign-off in place. Prepare a new
revision directory after any correction. Then run:

```powershell
yarn data:aos4:certify
yarn data:aos4:certify:full
```

`data:aos4:certify` is the final checked-in-only gate used by CI after the current pointer exists.
It must pass in a clean checkout with no `.cache/aos4/` directory and no network.
`data:aos4:certify:full` additionally replays accepted generation and the local packet workspace.

While the committed candidate is blocked only on human review, CI runs
`yarn data:aos4:certify:pending`. That command still verifies every committed checksum, source
inventory, machine result, coverage assertion, and manifest binding. It exits successfully only
when the remaining issues are human review/sign-off gaps; it never turns the manifest into a pass
or permits Phase 2 to begin.

## Refreshes and disputes

A new or changed source always starts a candidate cycle; never transfer a prior certificate.
Preserve the old immutable certification directory. If evidence cannot independently establish a
fact, keep the result `cannot-verify` until the fact is supported, removed from current scope, or
accepted as a genuinely non-material minor limitation. If Games Workshop and Wahapedia disagree,
retain both locators and values, apply the newest applicable official source, and keep the
discrepancy in the audit trail.

Model output, old AoS 3 behavior, aggregate counts, and a previous pass are never evidence for an
AoS 4 rule.
