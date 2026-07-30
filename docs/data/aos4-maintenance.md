# AoS 4 data maintenance

AoS 4 data moves through four distinct states:

1. Candidate acquisition downloads immutable source bytes into the ignored checksum cache and
   writes manifests, diagnostics, cohort inventories, and official-page locators.
2. Reviewed inputs pin accepted artifacts and record approvals, dispositions, official evidence,
   semantic overrides, and stable canonical identities under `data/aos4/`.
3. Deterministic generation writes a complete curator-facing audit catalog and a compact browser
   projection from exactly the same reviewed inputs.
4. Checksum-bound certification independently inventories sources, reviews every required record,
   exercises planted controls, and fails closed on missing or stale machine evidence.

A successful download never accepts data. Candidate acquisition proves only that an artifact was
retrieved safely and decoded.

## Current accepted snapshot

The accepted 2026-07-29 snapshot is defined by:

| Path | Purpose |
| --- | --- |
| `data/aos4/manifests/accepted-2026-07-29.json` | 13 Wahapedia exports, 157 official PDFs, and 72 reviewed Wahapedia pages, pinned by SHA-256 |
| `data/aos4/reviews/corpus-2026-07-29.json` | faction approval, diagnostic policies, exact exceptions, semantic overrides, dispositions, and official evidence |
| `data/aos4/identities/corpus.json` | deterministic source aliases to stable canonical IDs |
| `data/aos4/catalog/catalog.json` | complete audit catalog with source artifacts, records, transformations, and structured facts |
| `data/aos4/catalog/official-battle-profiles.json` | every extracted official profile fact with an explicit runtime/reference/superseded disposition |
| `src/aos4/generated/corpus/runtime.json` | compact application projection |
| `src/aos4/generated/corpus/defaults.json` | accepted default faction and rules context |
| `data/aos4/reports/corpus-2026-07-29-reconciliation.json` | official-to-secondary matches, field discrepancies, and profile-only gaps |
| `data/aos4/reports/corpus-2026-07-29-summary.json` | strict-gate counts, dispositions, and product checksums |

The strict report currently records:

- 28 factions
- 1,268 warscrolls and 1,002 battle profiles
- 4,850 usable abilities
- 2,247 weapons
- 1,402 content groups, including 48 Spearhead force/unit wrappers
- 242 source artifacts and 18,974 live source records
- every live record consumed, with zero unresolved integrity issues
- 18,897 May 2026 bulk warscroll/faction-rule records explicitly superseded and excluded
- 1,350 extracted GW battle-profile facts: 928 applied to runtime, 12 profile-only gaps,
  363 structured references, and 47 superseded facts

The accepted current rules come from 27 faction `warscrolls.html` collection pages, 28 faction
roots, and 17 current rules pages. Collection pages contribute 1,074 native faction warscrolls;
faction roots add 194 Spearhead warscrolls, 1,041 faction-rule groups, and 1,829 faction abilities.
The rules pages add the general, seasonal, Spearhead, and reference structures needed for the
supported game contexts. The review pins exact counts and diagnostics so a silent remote-shape
change fails generation.

The 13 May 2026 exports remain accepted only for stable faction/publication identities and audit
history. No bulk warscroll, weapon, ability, keyword, organization, or faction-rule row may enter
the live catalog; the strict integrity test enforces that boundary. Current-standard, General's
Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends, and historical contexts isolate parallel
content. The prior 2025-26 season is retained only inside the generic historical boundary rather
than as a second selectable current context.

The current official Battle Profiles PDF and Ogor Mawtribes supplement contribute 1,303 effective
facts. Reconciliation applies official unit size, points, regiment options, notes, and bases to 928
runtime profiles and now records 413 field-level secondary discrepancies after upstream parser and
normalization corrections. Twelve official unit facts remain `profile-only` because current
warscroll rules were not available; generation preserves their exact facts and checksums but does
not invent reminders. The official July 2026 Rules Updates supplies reviewed ability-text, timing,
and keyword corrections where the accepted secondary pages have not yet caught up. The other
accepted official documents are reference evidence: their pages are available to reviewers but do
not invent structured runtime facts.

Every official document is limited to the rules contexts it actually governs. Spearhead,
2026-27 `Scourge of Aqshy`, Legends, and historical `Scourge of Ghyran` records must not leak
across context boundaries merely because they share the Games Workshop downloads catalog.

The strict generation gate and the checksum-bound machine review are green for the current beta
snapshot. See [`aos4-accuracy-review.md`](./aos4-accuracy-review.md) for the review, correction,
verification, and staleness workflow.

The older `candidate-*`, `cohort-*`, and `official-rules-*` reports are provenance for the review
journey. Their `blocked` or `candidate-review-required` statuses describe pre-acceptance inputs, not
the current runtime.

## Source policy

Use the newest applicable Games Workshop publication as authoritative. Use
[Wahapedia's AoS 4 exports](https://wahapedia.ru/aos4/the-rules/data-export/) and bounded current
faction pages as the coherent secondary datasets for discovery, joins, and coverage. Other sources
may identify gaps but must not silently override either source.

Every accepted fact must retain:

- publisher, authority, title, edition, language, version, and effective date when known
- source URL, immutable artifact checksum, byte length, and retrieval time
- page, row, section, or document locator and record checksum
- applicable rules context
- transformation, diagnostic approval, disposition, or override rationale

Wahapedia-derived features retain `Powered by Wahapedia`. Raw PDFs, exports, and extracted page
text stay under ignored `.cache/aos4/`; Git contains structured reviewed facts, manifests, and
generated application data only.

## Rules Radar

The Rules Radar is a quiet, official-first source-change sentinel. The workflow checks Games
Workshop daily at minute 17 and checks Wahapedia plus BSData weekly at minute 43. A changed
Wahapedia sentinel expands to the existing bounded full observation before candidate evidence is
prepared. BSData is a community signal only and never supplies candidate or accepted rules data.

The workflow is deliberately dormant while this file exists only on `aos4-migration`: scheduled
workflows run from the repository's default branch. After the implementation reaches the default
branch, first run `AoS 4 Rules Radar` manually with `source: all` and `report_only: true`. Inspect
the uploaded lanes, report, event counts, fingerprints, URL lists, and managed issue body. Then
inspect the first daily and weekly scheduled runs before relying on issue lifecycle automation.

For a local report-only smoke run, use a new output directory:

```powershell
yarn data:aos4:radar:observe `
  --source all `
  --output .cache/aos4/radar/manual-observation
yarn data:aos4:radar:observe-bsdata `
  --output .cache/aos4/radar/manual-observation
yarn data:aos4:radar `
  --lane .cache/aos4/radar/manual-observation/games-workshop-lane.json `
  --lane .cache/aos4/radar/manual-observation/wahapedia-lane.json `
  --lane .cache/aos4/radar/manual-observation/bsdata-lane.json `
  --output .cache/aos4/radar/manual-report `
  --report-only
yarn data:aos4:radar:notify `
  --report .cache/aos4/radar/manual-report/report.json `
  --output .cache/aos4/radar/manual-report/managed-issue-body.md
```

`data:aos4:radar:notify` is mutation-free unless `--notify-github` is explicit. Only that opt-in
path reads `GITHUB_TOKEN`. Scheduled non-report-only runs maintain one labeled, assigned issue:
new or changed source lanes update it, unresolved lanes survive partial observations, and clearing
the final lane closes it. Operational failures remain separate from material rules-source changes,
notification is attempted after candidate failures, and the workflow still ends in failure.

The issue body contains a machine state marker. If notification reports a malformed machine state,
do not guess at or partially edit its encoded value. Compare the issue with the uploaded
`managed-issue-body.md`. Either restore the complete uploaded managed body or remove the Rules Radar
marker from the corrupt issue and close it so the next enabled run can create a clean managed issue.
Resolve duplicate marker-bearing issues before retrying.

The durable configuration is `data/aos4/radar/config.json`. A BSData signal is resolved only after
reviewing its `.cat`/`.gst` diff against official sources. If the signal is understood, update
`bsData.baselineSha` to the reviewed commit and `baselineReviewedAt` to the review instant in a
normal PR. Likewise, accepted Games Workshop or Wahapedia baselines change only through the
candidate-review-accept-generate-certify process below.

Radar output is evidence, not acceptance. Automation may acquire source-scoped candidate bytes and
compact manifests, but it never accepts a source, edits reviewed inputs, regenerates runtime data,
or updates the beta certification pointer.

## Candidate acquisition

Start official discovery at the
[Warhammer Community AoS downloads page](https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/).
Independently verify each official PDF and pass its immutable asset URL explicitly.

First discover the current official catalog without downloading documents:

```powershell
yarn data:aos4:discover-official `
  --language english `
  --output .cache/aos4/games-workshop/downloads.json
```

Review that result and create explicit JSON URL lists. Then acquire all 13 Wahapedia exports,
bounded current faction pages, and official documents:

```powershell
yarn data:aos4:candidate `
  --official-urls-file <reviewed-official-json-url-list> `
  --wahapedia-pages-file <reviewed-wahapedia-json-url-list> `
  --official-search "rules section heading" `
  --faction SE `
  --output <new-directory>
```

`--official-url`, `--wahapedia-page`, `--official-search`, and `--faction` are repeatable. Output
directories are create-only. The command:

- permits only configured HTTPS hosts and public resolved addresses
- bounds redirects, time, response size, media type, encoding, and PDF extraction
- pauses between requests and caches immutable bytes by SHA-256
- writes `candidate-manifest.json`, `candidate-report.json`, and
  `candidate-diagnostics.json`
- writes a non-verbatim `official-document-report.json` with page IDs/checksums
- decodes bounded faction collection/root HTML and records diagnostics without accepting it
- optionally writes `cohort-<faction-id>-report.json`

Replay pinned artifacts without network access:

```powershell
yarn data:aos4:candidate `
  --accepted-manifest data/aos4/manifests/accepted-2026-07-29.json `
  --offline `
  --output <new-directory>
```

Offline replay fails when any checksum-addressed cache entry is missing or corrupt.

## Review and acceptance

For a refresh:

1. Confirm that all 13 export files, intended official documents, and bounded current faction
   pages are present.
2. Compare artifact checksums, byte lengths, redirects, HTTP metadata, `Last_update.csv`, and
   source dates with the accepted manifest.
3. Review every new or changed decoder/normalization diagnostic by source record and cohort.
4. Reconcile conflicting facts against the newest applicable official publication. Preserve the
   secondary fact and cite exact official page records. Every extracted official battle-profile
   fact must receive one disposition.
5. Preserve existing canonical IDs. Add a deterministic source alias only for genuinely new
   entities; never derive identity from mutable display text.
6. Give each ignored record a specific non-empty reason. Unresolved records remain strict errors.
7. Record semantic corrections as exact reviewed policies or overrides. Broad policies are allowed
   only for bounded mechanical transformations whose behavior is tested.
8. Update the accepted manifest/review inputs only after review. There is intentionally no
   automatic `--accept` command.

Candidate data must never write the runtime directly.

## Generation

Verify the accepted snapshot without writing:

```powershell
yarn data:aos4:generate
```

The command:

- checks every accepted cache artifact's SHA-256 and byte length
- re-extracts each reviewed official PDF and verifies cited page IDs/checksums
- decodes all Wahapedia exports plus reviewed collection/root pages
- requires exact reviewed counts for HTML artifacts, warscrolls, Spearhead records, faction groups,
  faction abilities, and warnings
- reconciles official battle-profile facts, preserves field discrepancies, and emits the complete
  official fact ledger
- requires every decoder and normalization diagnostic to match a reviewed policy
- validates the stable identity registry and approved faction set
- builds the complete catalog, then requires every source record to be consumed or dispositioned
- rejects unknown timing, unsafe HTML, missing graph references, duplicate identities, untrusted
  sources, and unacknowledged incomplete data
- compares every generated file byte-for-byte with the checked-in product

After deliberately changing accepted inputs, regenerate:

```powershell
yarn data:aos4:generate:write
yarn data:aos4:generate:candidate
```

Inspect the manifest, review, identity, catalog, runtime, and checksum-report diffs together. Never
hand-edit `catalog.json`, `official-battle-profiles.json`, `identities/corpus.json`, or generated
corpus JSON.

## Accuracy certification

Generation proves deterministic structure; certification records why the resulting game data is
accepted. A full campaign must:

- independently inventory current Games Workshop and Wahapedia discovery surfaces
- cover every official fact, reconciliation decision, live record, superseded disposition,
  faction/context stratum, and high-risk semantic cohort
- save blind evidence interpretations before comparing generated values
- adjudicate and independently verify material corrections
- bind the exact source, review, catalog, ledger, runtime, protocol, rubric, inventory, and review
  records by checksum

Use the commands and file-handling boundaries in
[`aos4-accuracy-review.md`](./aos4-accuracy-review.md). A changed bound checksum starts a new
campaign. Do not copy forward an old result ledger.

## Verification

Routine tests stay offline and use compact fixtures. Before proposing accepted data:

```powershell
yarn data:aos4:generate:candidate
yarn data:aos4:review:prepare
yarn data:aos4:certify:full
yarn data:aos4:verify:beta
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Normal `data:aos4:generate` always fails closed when the beta certification pointer is missing
or any bound input is stale. Use `data:aos4:generate:candidate` while preparing a replacement
revision; never weaken or bypass the accepted gate.

Add focused coverage for provider contract changes, malformed HTML, new timing vocabulary,
incomplete profiles, joins, official precedence, stable identities, selection reachability,
reminder ordering, persistence, attribution, and deterministic serialization.

## Refresh boundary

The accepted snapshot is a reproducible data decision, not a claim that remote sources will never
change. A newer Wahapedia export or Games Workshop publication starts a new candidate cycle. Keep
the existing accepted files reproducible until the replacement passes the same strict gate, and
keep rules/data changes separate from Phase 2 package modernization.
