# AoS 4 automated accuracy review

AoS Reminders accepts an AoS 4 corpus for beta use only after automated checks answer:

1. Did acquisition and generation consume the intended source snapshot without inventing,
   dropping, or silently overriding structured facts?
2. Does the checksum-bound independent review cover every accepted source record, reconciliation
   decision, faction/context stratum, and high-risk cohort without unresolved findings?

A successful download, parser run, or application build is not enough. Beta readiness requires the
full automated gate.

## Current campaign

The current revision is `aos4-corpus-2026-07-30`, generated from the accepted 2026-07-30 source
snapshot. Its automated review is complete:

| Measure | Result |
| --- | ---: |
| Accepted artifacts independently inventoried | 242/242 |
| Explicit non-material discovery entries | 9 |
| Official battle-profile facts | 1,350/1,350 |
| Final official/secondary reconciliation discrepancies | 413/413 |
| Official profile-only facts | 12/12 |
| Live audit source records | 19,126/19,126 |
| Superseded source-record dispositions | 18,897/18,897 |
| Live review pairs | 39,799/39,799 |
| Independent outcomes | 79,598 pass; 0 finding; 0 cannot-verify |
| Supported faction/context strata | 129/129 |
| Populated high-risk cohorts | 19/19 |

The independent source inventory was observed at `2026-07-30T21:42:38.477Z`: 242 entries matched
accepted checksums and 9 discovery entries received explicit non-material dispositions.

`data/aos4/certifications/beta.json` binds the accepted revision to this automated evidence.
`yarn data:aos4:verify:beta` is the fail-closed beta gate. It passes for the current revision, which
completes Phase 1 under the machine-verified beta standard and allows Phase 2 to proceed. Any bound
corpus or evidence change must pass a new campaign before accepted generation or CI proceeds.

The 129 faction/context strata are the combinations declared by each faction's catalog
applicability, not a Cartesian product. A stratum counts as reviewed only when every live packet
assigned to it passes.

These results are evidence-coverage counts, not a statistical accuracy percentage. Official
reference PDF pages prove inventory and provenance only when the pipeline extracts a structured
fact from them. Games Workshop remains authoritative for every applicable detected disagreement.

## Evidence and trust boundary

Raw PDFs, HTML, CSV exports, extracted text, and review excerpts stay under `.cache/aos4/`. Source
text is delimited and treated as untrusted data, never as instructions. The repository commits
only structured facts and compact evidence records: IDs, checksums, locators, outcomes, findings,
resolutions, coverage summaries, and manifest bindings.

The packet builder creates:

- a blind packet containing source locators and a minimized source excerpt, but no generated value;
- a comparison packet containing the saved blind interpretation and generated destinations;
- a safe index containing no source excerpts; and
- concealed automated controls that never count toward corpus coverage.

Every result binds its assignment, reviewer configuration, packet ID, packet checksum, rubric,
timestamp, outcome, rationale, and findings. Calibration controls and their outcomes are committed
separately with a checksum receipt, so changing or omitting a control result blocks certification.
Changing a source, generated output, protocol, rubric, review result, source inventory, or manifest
binding makes the associated evidence stale.

## Automated workflow

All output workspaces under `.cache/aos4/review/` are create-only. Use a new revision-specific path
for every run.

### 1. Replay generation and prepare packets

```powershell
yarn data:aos4:generate:candidate
yarn data:aos4:review:prepare `
  --workspace .cache/aos4/review/workspace-<revision>
```

The generation command replays the accepted immutable source cache without relying on a beta
pointer. Packet preparation writes the sharded evidence workspace and safe index.

### 2. Observe and bind the source inventory

Run independent Games Workshop and Wahapedia observations, then combine them:

```powershell
yarn data:aos4:inventory `
  --revision <revision> `
  --observation .cache/aos4/review/games-workshop-observation.json `
  --observation .cache/aos4/review/wahapedia-observation.json
```

Any missing, unexpected, inaccessible, or ambiguous entry blocks beta readiness. A non-material
entry needs a specific evidence-backed disposition.

### 3. Run the independent campaign

```powershell
yarn data:aos4:review:adversarial `
  --workspace .cache/aos4/review/workspace-<revision> `
  --output .cache/aos4/review/adversarial-<revision> `
  --campaign-at <iso-instant>
```

Blind results are sealed before generated values are compared. Any finding or `cannot-verify`
outcome blocks the candidate until it is resolved and the affected evidence is rerun.

### 4. Prepare and verify beta evidence

```powershell
yarn data:aos4:certify:prepare `
  --output data/aos4/certifications/<revision> `
  --review-output .cache/aos4/review/adversarial-<revision> `
  --inventory .cache/aos4/review/source-inventory.json `
  --index .cache/aos4/review/workspace-<revision>/index.json `
  --workspace .cache/aos4/review/workspace-<revision>/workspace.json `
  --evaluated-at <iso-instant>
```

Inspect the manifest and summary, then point `data/aos4/certifications/beta.json` at the immutable
revision directory. Certification directories are create-only; prepare a new directory after any
changed input.

```powershell
yarn data:aos4:verify:beta
```

The beta gate validates committed checksums, source inventory, independent results, coverage
assertions, and manifest bindings in a clean checkout without network or `.cache/aos4/` access.
Use `yarn data:aos4:certify:full` when the local immutable packet workspace is also available.

The clean-checkout gate intentionally does not commit source excerpts or reconstruct packet
semantics from ignored raw artifacts. Certification preparation must therefore run the full
workspace comparison before `beta.json` is moved. A manually assembled or manually rebound
certification directory is outside the supported trust boundary; the committed gate proves
integrity of the prepared safe evidence, not independence from a maintainer who can rewrite the
repository. Beta rules reports remain an additional correctness signal.

## Findings and corrections

A passing beta certification contains zero automated findings and zero `cannot-verify` outcomes.
When the auditor reports either one, correct acquisition, decoding, normalization, identity,
reconciliation, context, generation, or the auditor itself, then regenerate and rerun. Preserve the
original report and correction in issue or pull-request history, but do not disposition a finding
inside certification evidence to manufacture a pass.

Never edit generated catalog/runtime JSON or review results to manufacture a pass.

## Beta reports

For each reported rules mistake:

1. capture the affected faction, rules context, selection, reminder, and expected official rule;
2. reproduce the behavior against the checked-in runtime;
3. verify it against the newest applicable Games Workshop publication while retaining any
   secondary-source disagreement;
4. correct pipeline inputs through a new candidate rather than editing generated JSON;
5. add focused regression coverage and rerun deterministic generation plus
   `yarn data:aos4:verify:beta`; and
6. preserve the report and resolution in issue or pull-request history.

Unconfirmed reports are not accepted facts. Confirmed material mistakes block promotion until
corrected.

## Refreshes and disputes

A new or changed source always starts a candidate cycle; never transfer a prior beta result. If
evidence cannot independently establish a fact, keep the result `cannot-verify` until the fact is
supported or removed from current scope. If Games Workshop and Wahapedia disagree, retain both
locators and values, apply the newest applicable official source, and keep the discrepancy in the
audit trail.

Model output, old AoS 3 behavior, aggregate counts, and a previous pass are never evidence for an
AoS 4 rule.
