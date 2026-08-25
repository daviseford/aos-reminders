# AoS 4 automated accuracy review

AoS Reminders accepts an AoS 4 corpus for beta use only after automated checks answer:

1. Did acquisition and generation consume the intended source snapshot without inventing,
   dropping, or silently overriding structured facts?
2. Does the checksum-bound independent review cover every accepted source record, reconciliation
   decision, faction/context stratum, and high-risk cohort without unresolved findings?

A successful download, parser run, or application build is not enough. Beta readiness requires the
full automated gate.

## Current campaign

The current revision is `aos4-corpus-2026-08-25`, generated from the 2026-08-01 source
acquisition plus three commit-pinned BSData catalogues (manifest `accepted-2026-08-25`). It
re-pins the Ogor Mawtribes library catalogue from `301477a3` to `d7377e94` on `main`; the only
content that moved is the Mawpit's Hungry Sinkhole Declare, corrected upstream to "that you have
not already picked to be a sinkhole".
Its automated review is complete:

| Measure | Result |
| --- | ---: |
| Accepted artifacts independently inventoried | 245/245 |
| Explicit non-material discovery entries | 9 |
| Official battle-profile facts | 1,350/1,350 |
| Final official/secondary reconciliation discrepancies | 423/423 |
| Official profile-only facts | 1/1 |
| Live audit source records | 20,084/20,084 |
| Ignored-record dispositions (superseded + explicit) | 19,119/19,119 |
| Live review pairs | 40,978/40,978 |
| Independent outcomes | 81,956 pass; 0 finding; 0 cannot-verify |
| Supported faction/context strata | 129/129 |
| Populated high-risk cohorts | 18/18 |

The independent source inventory was observed on 2026-08-25: 245 entries matched accepted
checksums (including the three commit-pinned BSData catalogues, observed live by the
`data:aos4:inventory:observe-bsdata` observer at both pinned commits) and 9 discovery entries
received explicit non-material dispositions carried forward from the 2026-08-01b review.

The current certification is `aos4-corpus-2026-08-25-machine-r1` (2026-08-25). As on 2026-08-18,
the re-pinned Ogor library artifact re-keys every source record that carries its checksum, so the
`--reuse-certification` offer of `machine-r1` (2026-08-18) carried nothing forward: all 40,978 pairs
were evaluated fresh — 81,956 checks, 0 findings, 0 cannot-verify. Its overlay still names the
2026-08-18 directory as the reuse source it was offered, so `certify:prune` keeps both.

`aos4-corpus-2026-08-18-machine-r1` (2026-08-18) preceded it. That re-pin (`c8e1b1c9` on branch
`ogors` → `301477a3` on `main`) moved only Thundertusk Beastriders' Chilling Onslaught, corrected
upstream to "subtract 1 from hit rolls"; it likewise reused nothing and retired both 2026-08-03
directories (314.0 MB).

`aos4-corpus-2026-08-03-machine-r3` (2026-08-04) preceded it. It re-campaigned
`machine-r2` because the command-point cost work (#1856) landed on top of the pdfjs-dist 6 upgrade,
leaving a corpus that matches neither parent; a prior result is never inherited by a changed corpus,
so all 40,978 pairs were evaluated fresh under `evidence-auditor/v3` — 81,956 checks, 0 findings,
0 cannot-verify. It reused the 2026-08-02 inventory observations unchanged, exactly as `machine-r2`
did, since no acquisition occurred. Generated ability costs are the only corpus-visible difference
from `machine-r2`.

`machine-r2` (2026-08-04) preceded it. The pdfjs-dist 6
upgrade (#1900) changed official-PDF text extraction, so 1,078 of the 1,090 pinned
official-evidence page checksums in the corpus review were re-pinned to the faithful extraction
(checksums only; no record or page changed) and one letterspacing artifact in the battle-profile
ledger corrected itself (`Cr y ptguard` -> `Cryptguard`). The re-campaign reused the 2026-08-02
inventory observations unchanged and evaluated all 40,978 pairs fresh against the r1 reuse offer —
0 findings, 0 cannot-verify. Runtime products, identities, and the reconciliation report are
byte-identical to machine-r1.

Provisional community-tier records receive the same treatment as secondary ones: their source
records are independently compared against the generated entities, their artifacts must carry the
`community` authority and a visibly provisional title, and the official battle-profile facts they
depend on are certified as applied-to-runtime overrides.

The first 2026-08-01 campaign returned 12 findings; both underlying causes were corrected and the
complete campaign was rerun from freshly prepared packets. Six findings retired ability-text
overrides whose secondary source had caught up to the cited official Rules Updates corrections,
and six exposed an auditor gap for live-but-ignored source records: the packet builder now binds
the durable review disposition into the source-record packet, and the independent comparison
verifies the reviewed absence (no generated entities, matching target, non-empty reason) instead
of demanding a generated entity.

`data/aos4/certifications/beta.json` binds the accepted revision to this automated evidence.
`yarn data:aos4:verify:beta` is the fail-closed beta gate. It passes for the current revision under
the machine-verified beta standard. Any bound corpus or evidence change must pass a new campaign
before accepted generation or CI proceeds.

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
  --campaign-at <iso-instant> `
  --jobs 8
```

Blind results are sealed before generated values are compared. Any finding or `cannot-verify`
outcome blocks the candidate until it is resolved and the affected evidence is rerun.

Use `--jobs 1` as the serial reference or on a constrained machine. The default leaves one available
processor for the parent, uses at least one worker, and never exceeds eight workers; `--jobs` accepts
1 through 32. Pass an explicit value when reproducing a campaign so execution provenance stays
byte-stable across machines with different processor counts.
Workers receive only their assigned fresh packet shards, save blind evidence before comparison,
and return checksum receipts. The parent validates those receipts and merges evidence in canonical
workspace order.

To reuse a prior passing certification, write to a new output directory and add:

```powershell
yarn data:aos4:review:adversarial `
  --workspace .cache/aos4/review/workspace-<revision> `
  --output .cache/aos4/review/adversarial-<revision>-incremental `
  --campaign-at <iso-instant> `
  --reuse-certification data/aos4/certifications/<prior-revision> `
  --jobs 8
```

Reuse is pair-scoped, not campaign-scoped. The compact certification receipt binds each passing
verdict to the exact pair key, packet IDs/checksums, assignment-scoped calibration, protocol,
rubric, reviewer configuration, and engine version. Changed, missing, duplicate, corrupt, or
ambiguous evidence is evaluated fresh. Concealed calibration controls are always fresh. A no-op
campaign starts zero workers; a sparse change starts workers only for affected shards.

`execution.json`, `results-index.json`, the certification manifest, and the summary expose the
reused/fresh pair counts, pair-set checksums, contributing assignments, requested jobs, peak child
count, and source-certification checksum. Reused result evidence is retained through checksum-bound
overlays rather than recopied or silently trusted. The standalone certification check resolves the
overlay and revalidates the complete result population.
Incremental result overlays retain their referenced certification directories as immutable inputs.
Keep every referenced ancestor while a descendant remains current. The preparer limits generated
chains to three overlay levels; the next sparse campaign resolves the source evidence once and writes
a self-contained result set, so verification cost and retention ancestry cannot grow without bound.
Run `yarn data:aos4:certify:prune` after accepting a new certification to list the directories that
fell out of the live chain; `--apply` stages their deletion with `git rm -r`. The command keeps the
`beta.json` target plus every certification directory its evidence mentions, so it over-retains
rather than risking the live chain.

Retention: keep the certification `beta.json` points at plus every ancestor its overlay references,
and delete the remaining superseded directories when a new certification is accepted. Verification
resolves only that live chain, and git history preserves the deleted evidence, so retiring a
superseded directory loses no provenance.

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

### Performance reference

The following `aos4-corpus-2026-08-02b` fixed-campaign measurements used Windows, Node 22.23.2,
Yarn 1.22.19, 20 logical processors, about 64 GiB of RAM, a warm local artifact cache, and 40,780
live pairs. Times are wall clock and exclude source acquisition/network access.

| Campaign | Review | Prepare | Combined | Reused / fresh | Peak children |
| --- | ---: | ---: | ---: | ---: | ---: |
| Cold, `--jobs 1` | 16.929 s | 23.253 s | 40.183 s | 0 / 40,780 | 1 |
| Cold, `--jobs 8` | 7.343 s | — | — | 0 / 40,780 | 8 |
| Unchanged incremental, `--jobs 8` | 2.468 s | 5.161 s | 7.629 s | 40,780 / 0 | 0 |
| Controlled 2.00% delta, `--jobs 8` | 3.324 s | 7.621 s | 10.944 s | 39,964 / 816 | 4 |

Cold parallel review was 56.6% faster than the serial review with byte-identical verdict evidence
apart from execution provenance. The unchanged incremental review-plus-preparation path was 81.0%
faster than the cold serial reference. The controlled 2.00% delta was 72.8% faster than the same
reference and passed the small-delta target; only four children were needed for its four fresh
shards. The final standalone certification check took 7.793 seconds for cold evidence, 7.746 seconds
for the unchanged overlay, and 7.909 seconds for the controlled delta. Including that check, the
unchanged path was 68.0% faster end to end. A representative eight-worker cold process tree on this
implementation used about 2.0 GiB of working set. Re-run this table after changing packet size,
evidence schemas, reviewer behavior, or worker orchestration; do not compare timings from different
revisions or machines as if they were the same experiment.

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

A new or changed source always starts a candidate cycle and produces a new immutable campaign. Do
not transfer a prior beta pointer or campaign pass wholesale. Exact pair verdicts may be retained
only through `--reuse-certification`; changed or ambiguous pairs remain fresh, while the new
inventory, controls, execution record, manifest, and full coverage gate are current. If evidence
cannot independently establish a fact, keep the result `cannot-verify` until the fact is supported
or removed from current scope. If Games Workshop and Wahapedia disagree, retain both locators and
values, apply the newest applicable official source, and keep the discrepancy in the audit trail.

Model output, old AoS 3 behavior, aggregate counts, and a previous pass are never evidence for an
AoS 4 rule.
