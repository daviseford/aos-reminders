# AoS 4 data maintenance

AoS 4 data moves through three distinct states:

1. Candidate acquisition downloads immutable source bytes into the ignored checksum cache and
   writes manifests, diagnostics, cohort inventories, and official-page locators.
2. Reviewed inputs pin accepted artifacts and record approvals, dispositions, official evidence,
   timing overrides, and stable canonical identities under `data/aos4/`.
3. Deterministic generation writes a complete curator-facing audit catalog and a compact browser
   projection from exactly the same reviewed inputs.

A successful download never accepts data. Candidate acquisition proves only that an artifact was
retrieved safely and decoded.

## Current accepted snapshot

The accepted 2026-07-27 snapshot is defined by:

| Path | Purpose |
| --- | --- |
| `data/aos4/manifests/accepted-2026-07-27.json` | 13 Wahapedia exports, 36 official PDFs, and 55 reviewed Wahapedia pages, pinned by SHA-256 |
| `data/aos4/reviews/corpus-2026-07-27.json` | faction approval, diagnostic policies, exact exceptions, dispositions, and official evidence |
| `data/aos4/identities/corpus.json` | deterministic source aliases to stable canonical IDs |
| `data/aos4/catalog/catalog.json` | complete audit catalog with source artifacts, records, transformations, and structured facts |
| `data/aos4/catalog/official-battle-profiles.json` | every extracted official profile fact with an explicit runtime/reference/superseded disposition |
| `src/aos4/generated/corpus/runtime.json` | compact application projection |
| `src/aos4/generated/corpus/defaults.json` | accepted default faction and rules context |
| `data/aos4/reports/corpus-2026-07-27-reconciliation.json` | official-to-secondary matches, field discrepancies, and profile-only gaps |
| `data/aos4/reports/corpus-2026-07-27-summary.json` | strict-gate counts, dispositions, and product checksums |

The strict report currently records:

- 28 factions
- 1,268 warscrolls and 1,002 battle profiles
- 4,260 usable abilities
- 2,247 weapons
- 1,172 content groups, including 48 Spearhead force/unit wrappers
- 104 source artifacts and 17,443 live source records
- every live record consumed, with zero unresolved integrity issues
- 18,897 May 2026 bulk warscroll/faction-rule records explicitly superseded and excluded
- 1,350 extracted GW battle-profile facts: 928 applied to runtime, 12 profile-only gaps,
  363 structured references, and 47 superseded facts

The accepted current rules come from 27 faction `warscrolls.html` collection pages and 28 faction
roots. Collection pages contribute 1,074 native faction warscrolls; faction roots add 194
Spearhead warscrolls, 1,041 faction-rule groups, and 1,829 faction abilities. The review pins those
exact counts plus 150 parser warnings so a silent remote-shape change fails generation.

The 13 May 2026 exports remain accepted only for stable faction/publication identities and audit
history. No bulk warscroll, weapon, ability, keyword, organization, or faction-rule row may enter
the live catalog; the strict integrity test enforces that boundary. Current-standard, General's
Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends, and historical contexts isolate parallel
content. The prior 2025-26 season is retained only inside the generic historical boundary rather
than as a second selectable current context.

The current official Battle Profiles PDF and Ogor Mawtribes supplement contribute 1,303 effective
facts. Reconciliation applies official unit size, points, regiment options, notes, and bases to 928
runtime profiles and records 669 field-level secondary discrepancies. Twelve official unit facts
remain `profile-only` because current warscroll rules were not available; generation preserves
their exact facts and checksums but does not invent reminders. The official June 2026 Rules Updates
supplies the missing `Passive` timing for Sanctum of Amyntok's Multiple Parts ability.

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
  --accepted-manifest data/aos4/manifests/accepted-2026-07-27.json `
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
yarn data:aos4:generate
```

Inspect the manifest, review, identity, catalog, runtime, and checksum-report diffs together. Never
hand-edit `catalog.json`, `official-battle-profiles.json`, `identities/corpus.json`, or generated
corpus JSON.

## Verification

Routine tests stay offline and use compact fixtures. Before proposing accepted data:

```powershell
yarn data:aos4:generate
yarn lint
yarn tsc --noEmit
yarn test --run
yarn build
```

Add focused coverage for provider contract changes, malformed HTML, new timing vocabulary,
incomplete profiles, joins, official precedence, stable identities, selection reachability,
reminder ordering, persistence, attribution, and deterministic serialization.

## Refresh boundary

The accepted snapshot is a reproducible data decision, not a claim that remote sources will never
change. A newer Wahapedia export or Games Workshop publication starts a new candidate cycle. Keep
the existing accepted files reproducible until the replacement passes the same strict gate, and
keep rules/data changes separate from Phase 2 package modernization.
