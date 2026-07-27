# AoS 4 data maintenance

AoS 4 data moves through three distinct states:

1. **Candidate acquisition** downloads immutable source bytes into the ignored checksum cache and
   writes a candidate manifest, summary, and row-addressable diagnostics.
2. **Reviewed source data** records accepted artifact revisions, canonical identities, explicit
   dispositions, and justified overrides in `data/aos4/`.
3. **Generated products** separate the complete curator-facing audit catalog from the compact
   application projection.

Candidate output is never accepted automatically. A successful download only proves that the
artifact was retrieved safely and decoded; it does not prove that its rules are correct or suitable
for publication.

## Source policy

Use the newest applicable Games Workshop publication as authoritative. Use
[Wahapedia's AoS 4 exports](https://wahapedia.ru/aos4/the-rules/data-export/) as the coherent
secondary dataset for discovery, joins, and coverage. Other sources may reveal gaps but must not
silently override either source.

Every accepted fact must retain enough provenance to identify:

- publisher, title, edition, language, version, and effective date
- source URL, immutable content checksum, and retrieval time
- page, row, section, or document locator
- applicable rules context
- any transformation or reviewed override

Wahapedia-derived runtime data must retain the `Powered by Wahapedia` attribution. Do not commit
downloaded PDFs, bulk exports, or full verbatim rules text. Raw artifacts belong in `.cache/aos4/`,
which is ignored by Git.

## Candidate acquisition

Start official discovery at the
[Warhammer Community AoS downloads page](https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/).
The private download-search endpoint is unstable and is isolated behind an adapter; independently
verify each chosen official PDF URL and pass it explicitly to the maintenance command.

Acquire all 13 documented Wahapedia exports and one or more reviewed official documents with:

```powershell
yarn data:aos4:candidate --official-url <official-pdf-url>
```

`--official-url` is repeatable. By default, the command writes a new timestamped directory under
`.cache/aos4/candidates/`. Use `--output <directory>` for a stable review location. The output
directory must not already exist, so the command fails instead of overwriting an earlier candidate.
Add one or more `--faction <Wahapedia-faction-id>` arguments to emit bounded, non-verbatim faction
cohort reports alongside the full-corpus diagnostics:

```powershell
yarn data:aos4:candidate `
  --official-url <official-pdf-url> `
  --official-search "rules section heading" `
  --faction SE
```

A cohort report inventories linked records with source-record IDs and exact row checksums, then
blocks the cohort when it contains decoder errors, unknown weapon types, unresolved timing, or a
contradictory reaction flag. It never promotes the records or copies rule text into the repository.

`--official-search` is repeatable and performs a bounded, case-insensitive literal search over
extracted official pages. Reports contain only the requested term and matching page numbers, not
page text. Use it to locate sections for source review before writing a publication-specific fact
extractor.

The acquisition layer:

- allows HTTPS only and resolves only configured public hosts
- pins each request to a validated public DNS address
- bounds redirects, response size, and request duration
- rejects unexpected media types, encodings, truncation, and checksum mismatches
- caches bytes by SHA-256 checksum
- pauses between requests
- writes `candidate-manifest.json`, `candidate-report.json`, and
  `candidate-diagnostics.json`
- extracts bounded, page-addressable text from each requested official PDF and writes a
  non-verbatim `official-document-report.json` with page source-record checksums
- optionally writes `cohort-<faction-id>-report.json` for each requested faction

To replay an accepted manifest entirely from the checksum cache:

```powershell
yarn data:aos4:candidate `
  --accepted-manifest <accepted-manifest.json> `
  --official-url <official-pdf-url> `
  --official-search "rules section heading" `
  --faction <Wahapedia-faction-id> `
  --offline
```

Offline replay fails on a missing or corrupt cache entry and never calls the network.

## Review and promotion

Review candidate output before copying any metadata into `data/aos4/`:

1. Confirm that all 13 Wahapedia exports are present and that each official URL still resolves to
   the intended publication.
2. Compare checksums, byte lengths, media types, redirects, `Last_update.csv`, HTTP metadata, and
   source-level dates with the previously accepted revision.
3. Review every error and each changed diagnostic cohort by file, field, and row. Repeated
   identical rows and empty association sentinels may be source-shape warnings; unresolved joins,
   conflicting keys, header drift, and unknown vocabulary require a decision.
4. Reconcile candidate facts with the applicable official publication. Preserve both facts when
   sources disagree, and select the newest applicable official value.
5. Add or update canonical identities. A source alias is unique within its canonical entity kind;
   include the export filename when a Wahapedia identifier is only unique within a table.
6. Record ignored source records with a non-empty reason. Unresolved records remain generation
   errors. Never disposition a record that is already consumed.
7. Add a manual override only when it has a reason, author, UTC review time, applicable context,
   and cited source-record IDs.
8. Promote the candidate manifest only after review. There is intentionally no automatic
   `--accept` command.

Repository locations:

| Path | Purpose |
| --- | --- |
| `data/aos4/manifests/` | Candidate or explicitly accepted immutable artifact metadata |
| `data/aos4/identities/` | Reviewed source aliases to stable canonical IDs |
| `data/aos4/overrides/` | Reviewed, attributable conflict decisions |
| `data/aos4/reports/` | Non-verbatim coverage and validation summaries |
| `data/aos4/catalog/` | Future complete curator-facing audit catalog |
| `src/aos4/generated/` | Compact, offline application data |

The checked-in `candidate-2026-07-27` files are reconnaissance only and explicitly remain
unaccepted. The representative Stormcast cohort is the current strict-pass proof; it is not a
complete AoS 4 corpus.

The checked-in `cohort-stormcast-2026-07-27-summary` is the first full-faction inventory. Official
core-rule review resolved every phase-independent Reaction timing structurally. The cohort remains
blocked by two rows whose `is_reaction=false` flag contradicts their explicit Reaction text. The
current official Stormcast Eternals erratum corroborates that Reaction text, but the evidence still
needs formal fact linking and the rest of the applicable faction publication family has not been
reconciled. The cohort does not change the runtime catalog.

The checked-in `official-rules-2026-07-27-summary` records the checksums and page locators supporting
the triggered Reaction window. The base rules and June 2026 update both extracted without
diagnostics; neither raw PDF nor page text is committed.

The checked-in `cohort-index-2026-07-27` applies the same non-verbatim inventory to all 28 factions:
17 have no automated blocker and still require source review, while 11 are blocked by decoder
errors or contradictory reaction flags. “Reviewable” is not “accepted”; no full faction has entered
the runtime catalog.

Synthetic timing fixtures remain useful in the offline test matrix, but they are not accepted game
data. The representative runtime no longer displays the former synthetic reaction, and strict
generation rejects any consumed source whose authority is unknown. A real reaction enters the
runtime only with an applicable reviewed cohort and traceable source evidence.

## Generation gates

Strict generation fails when:

- domain references, rules contexts, or provenance are invalid
- a source record is neither consumed nor dispositioned
- a disposition is duplicated, lacks a reason, or contradicts consumption
- an unresolved source record remains
- player-facing runtime content consumes an unknown-authority or test-fixture source
- runtime timing is unclassified
- normalized entities retain HTML
- reconciliation contains an error
- canonical IDs or same-kind source aliases collide

Audit and runtime JSON use stable object keys and stable outer collection ordering. The runtime
projection retains compact source links but omits artifacts, retrieval metadata, checksums, record
checksums, and transformation notes. Candidate acquisition timestamps are expected to change;
determinism applies when generating from the same accepted manifest, identity registry, and
overrides.

Run focused checks while reviewing data:

```powershell
yarn test src/tests/aos4/catalogIntegrity.test.ts --run
yarn test src/tests/aos4/acquisition.test.ts src/tests/aos4/wahapediaAdapter.test.ts --run
```

Before proposing a cohort for integration, run:

```powershell
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

## Current known candidate gaps

The 2026-07-27 live snapshot decodes 28 factions, 1,795 warscrolls, 4,092 abilities, and 2,147
weapons after excluding 559 empty keyword association sentinels. All timing windows are classified;
two abilities still use the lossy source-phase fallback, 13 reaction flags contradict explicit
Reaction text, and two Regiment of Renown joins reference the absent `LCA` faction. Those items are
review work, not accepted exceptions.

Eighteen earlier fallbacks were resolved from the condition field itself: first/third battle-round
boundaries now retain their round qualifier, and the adapter corrects only eight instances of the
two exact observed source typos `Any Comhat Phase` and `Your Hero Quest` while emitting
`source-timing-correction`. The remaining Nighthaunt and Ossiarch Bonereapers rows are not guessed.
The checked candidate summary records the exact two fallback and eight corrected source-record IDs.

Official full-corpus discovery, publication-family extraction, identity review, and conflict
resolution remain cohort work. Expand from the representative faction rather than treating a
successful bulk decode as release-ready data.
