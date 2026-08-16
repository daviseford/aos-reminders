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

The accepted 2026-08-02 snapshot is defined by:

| Path | Purpose |
| --- | --- |
| `data/aos4/manifests/accepted-2026-08-02.json` | 13 Wahapedia exports, 157 official PDFs, 72 reviewed Wahapedia pages, and 3 commit-pinned BSData catalogues, pinned by SHA-256 |
| `data/aos4/reviews/corpus-2026-08-02b.json` | faction approval, diagnostic policies, exact exceptions, semantic overrides, dispositions, and official evidence |
| `data/aos4/identities/corpus.json` | deterministic source aliases to stable canonical IDs |
| `data/aos4/catalog/catalog.json` | complete audit catalog with source artifacts, records, transformations, and structured facts |
| `data/aos4/catalog/official-battle-profiles.json` | every extracted official profile fact with an explicit runtime/reference/superseded disposition |
| `src/aos4/generated/corpus/runtime.json` | compact application projection |
| `src/aos4/generated/corpus/defaults.json` | accepted default faction and rules context |
| `data/aos4/reports/corpus-2026-08-02b-reconciliation.json` | official-to-secondary matches, field discrepancies, and profile-only gaps |
| `data/aos4/reports/corpus-2026-08-02b-summary.json` | strict-gate counts, dispositions, and product checksums |

The strict report currently records:

- 28 decoded source factions: 27 playable armies plus the Endless Spells container
- 1,297 warscrolls and 1,013 battle profiles
- 4,939 usable abilities
- 2,280 weapons
- 1,418 content groups, including 48 Spearhead force/unit wrappers
- 245 source artifacts and 19,333 live source records
- every live record consumed or explicitly dispositioned, with zero unresolved integrity issues
- 6 illustrative core-rules example ability cards (Mystic Shield / Resurrection) explicitly
  ignored so they never appear as reminders (customer report 2026-07-31)
- 18,897 May 2026 bulk warscroll/faction-rule records explicitly superseded and excluded
- 1,350 extracted GW battle-profile facts: 939 applied to runtime, 1 profile-only gap,
  363 structured references, and 47 superseded facts
- 10 provisional community warscrolls (the Ogor Mawtribes supplement units) and 13 provisional
  Ogor Mawtribes battletome faction-package entries (4 battle formations, 3 heroic traits,
  3 artefacts of power, the army-wide battle traits, and the Lore of Gut Magic and Lore of the
  Everwinter) transcribed from three commit-pinned BSData catalogues under the fallback-tier
  source policy, with official battle-profile facts overriding every overlapping field; Lorai,
  Child of the Abyss completed the provisional-to-verified swap when Wahapedia published her
  datasheet
- all 60 source-classified Armies of Renown classified as `army-of-renown` roots with replace
  semantics: `excludes` edges suppress the faction's regular rules-choice groups while a root is
  selected, and the root's battle traits apply automatically (issues #1833/#1834/#1844). The 12
  seasonal armies and 12 battletome armies carry official naming evidence (Armies of Renown,
  Battle Profiles, and Rules Updates July 2026); the remaining 36 roots are classified on the
  reviewed `secondary-provisional` evidence tier because the accepted faction pages themselves
  classify the sections (the `h2_ArmyOfRenown` marker or the White Dwarf replace-rules intro) and
  no free accepted official document names them. Generation fails closed in both directions: a
  source-classified group without a reviewed entry, and a reviewed entry targeting an unmarked
  group, are both errors

The accepted current rules come from 27 faction `warscrolls.html` collection pages, 28 faction
roots, and 17 current rules pages. Collection pages contribute 1,074 native faction warscrolls.
Faction roots add 194 Spearhead warscrolls and, because Wahapedia publishes no separate collection
for Endless Spells, 18 universal manifestation warscrolls from that container page. The reviewed
relationship graph offers the universal manifestation lores and warscrolls to all 27 playable
armies while never offering Endless Spells as an army. The rules pages add the general, seasonal,
Spearhead, and reference structures needed for the supported game contexts. The review pins exact
counts and diagnostics so a silent remote-shape change fails generation.

The 13 May 2026 exports remain accepted only for stable faction/publication identities and audit
history. No bulk warscroll, weapon, ability, keyword, organization, or faction-rule row may enter
the live catalog; the strict integrity test enforces that boundary. Current-standard, General's
Handbook 2026-27 (`Scourge of Aqshy`), Spearhead, Legends, and historical contexts isolate parallel
content. The prior 2025-26 season is retained only inside the generic historical boundary rather
than as a second selectable current context.

The current official Battle Profiles PDF and Ogor Mawtribes supplement contribute 1,303 effective
facts. Reconciliation applies official unit size, points, regiment options, notes, and bases to 939
runtime profiles and now records 411 field-level secondary discrepancies after upstream parser and
normalization corrections. One official unit fact (The Emberwatch, Legends) remains `profile-only`
because current warscroll rules are not available anywhere; generation preserves its exact fact
and checksum but does not invent reminders, and the accepted gap is recorded in the profile-only
deviation ledger described below. The official July 2026 Rules Updates supplies reviewed
ability-text and timing corrections where the accepted secondary pages have not yet caught up.
When an official publication introduces units whose rules no accepted source carries, reviewed
intake — extraction from the official publication itself, or the BSData fallback tier when its
conditions hold — is the primary path and starts immediately; it is not an option to weigh, and
an official document is never merely reference evidence for content it introduces. Official pages
that introduce no new content remain reviewer evidence and do not invent structured runtime facts.

### The official-first intake gate (#1820)

`profile-only` is a gated state, not a resting state. Every profile-only official unit fact must
carry an explicit reviewed deviation in `data/aos4/reviews/profile-only-deviations.json` — the
faction, unit name, a rationale, a target date, and the recording date. Both strict generation and
`yarn data:aos4:verify:beta` fail closed, naming the unit and its source publication, when:

- a profile-only unit fact has no recorded deviation (any increase beyond the accepted population
  is unaccepted until reviewed), or
- a recorded deviation is malformed or duplicated, or
- a deviation no longer matches any profile-only fact (resolved entries must be removed so they
  cannot shield a future regression).

The deployment workflow runs the beta gate, so a release that would ship a new profile-only unit
stops before S3. The accepted 2026-08-01b baseline is exactly one entry: The Emberwatch
(Warhammer Legends), deferred with a rationale referencing its Legends context. The Rules Radar's
managed issue states this obligation whenever it observes a new or replaced official publication.

The ten July 2026 Ogor Mawtribes battletome units (Redd the Maw, Tyrant on Glutthorn, Morga the
Mighty, Grell Firefist, Gutseers, Cleavers, Gluttons, Hunters with Sabrefangs, Maulbeast Cavalry,
and Maulbeast Raiders) ship provisionally under
the fallback-tier source policy: their existence, points, unit sizes, bases, and roster notes are
established by accepted official Battle Profiles documents, Wahapedia still lists only the
pre-supplement warscrolls, and the free official "Battletome Supplement: Ogor Mawtribes" PDF
contains only the legacy-unit warscrolls. Their rules text therefore comes from the commit-pinned
BSData Ogor library catalogue (`BSData/age-of-sigmar-4th@c8e1b1c9`, branch `ogors`) recorded as
`communityWarscrollSources` review entries — commit-pinned, per-unit checksum-pinned, marked
`provisional-pending-official-verification`, and visibly attributed as provisional community
transcriptions in the reminder source links. The five BSData/official base-size formatting
disagreements are logged reconciliation discrepancies resolved official-side. When Wahapedia or an
owner-supplied official source publishes the warscrolls, the standard candidate intake replaces
these provisional facts; `src/tests/aos4/ogorSupplementProvisional.test.ts` and
`src/tests/aos4/bsDataLibrary.test.ts` pin the boundary and the policy record until then.

The battletome's replacement roster options ship the same way (beta report #1828, snapshot
2026-08-01c): the official Battle Profiles - Ogor Mawtribes document establishes four battle
formations (Hunger-filled Tribe, Vanguard of the Mawpath, Hinterland Hunters, Maw-cult Fanatics),
three heroic traits (The Crusherguts, Leave Not a Morsel, Dreaded Far and Wide), and three
artefacts of power (Trophy Rack, Carvalox Hide, Mantle of Entrails), and marks the index-era set
superseded. Wahapedia still presents the index-era options as current (verified 2026-08-01), so
their rules text comes provisionally from the commit-pinned BSData main-branch faction catalogue
(`BSData/age-of-sigmar-4th@a882188b`), recorded as `factionOptions` on a
`communityWarscrollSources` review entry with per-option checksums, official spellings winning
every name conflict. Reviewed `contextOverrides` apply official precedence to the superseded
index-era formations, traits, and artefacts, moving them to the historical context until the
secondary source catches up.

The battletome's two lores and its army-wide battle traits ship the same way since the 2026-08-02
revision (Discord beta report of index-era cards remaining current). The earlier finding that
BSData had not transcribed the lores was a provisional-watch coverage gap, not a source gap: the
faction catalogue's lore entries are links into the shared `Lores.cat` catalogue, which carries
the full Lore of Gut Magic and Lore of the Everwinter definitions at the already-pinned commit and
which the watch never fetched. Both lores are officially established as page 2 roster options
(`Spell Lore` / `Prayer Lore`) of the Battle Profiles - Ogor Mawtribes document. The army-wide
battle traits (Eat 'Em Alive, Bull Charge, Jaws of the Beast, Closing the Jaws) have no
battle-profile row of their own; their fallback-tier anchor is the source-level official evidence
on the review entry — the same document's per-option "Battletome: Ogor Mawtribes" notes establish
that the battletome package replaced the index-era faction rules for the current context. This is
a deliberate, owner-reviewed extension of fallback condition (a) for exactly this content class.
Reviewed `contextOverrides` retire the index-era battle traits and both index-era lores to the
historical context. Big Names remain absent: nothing official establishes a battletome Big Names
package. `src/tests/aos4/ogorBattletomeFactionPackage.test.ts` pins this boundary, including the
faction-only reminder set that the beta report exercised. Legacy-unit warscroll text (the
battletome also rewrites the pre-supplement warscrolls, e.g. the Bloodpelt Hunter) remains
secondary-sourced from the index-era Wahapedia pages and is tracked as follow-up intake.

Every official document is limited to the rules contexts it actually governs. Spearhead,
2026-27 `Scourge of Aqshy`, Legends, and historical `Scourge of Ghyran` records must not leak
across context boundaries merely because they share the Games Workshop downloads catalog.

The strict generation gate and the checksum-bound machine review are green for the current beta
snapshot. See [`aos4-accuracy-review.md`](./aos4-accuracy-review.md) for the review, correction,
verification, and staleness workflow.

### Review lineage: corpus-2026-07-31 and the 2026-08-01 acceptance

`data/aos4/reviews/corpus-2026-07-31.json` was a prepared, not-then-accepted revision carrying the
2026-07-30 review forward plus six ignored dispositions for the illustrative `EXAMPLE SPELL`
(Mystic Shield) and `EXAMPLE PRAYER` (Resurrection) cards that the core rules and the
2024-25/2025-26 General's Handbook pages reproduce to show the ability-card format. They are not
playable abilities, and the universal core-rules wiring was surfacing them as reminders for every
army (customer report 2026-07-31). Sacred Rites is not excluded ("All PRIESTS know the following
prayer"), and the Ascension page's Mystic Shield and Resurrection are genuine Path rank rewards on
an already reference-only page, so they stay.

Because the accepted 2026-07-30 immutable artifact cache was no longer available and live
Wahapedia bytes had drifted from the pinned checksums, that revision was accepted through a fresh
candidate acquisition instead of an offline replay: the 2026-08-01 snapshot re-pins every source
(all 13 exports and 157 official PDFs were byte-identical; 65 Wahapedia HTML pages drifted),
carries the corpus-2026-07-31 dispositions forward, and additionally reviews the drift: a new
reference-only historical "Standard Bearers" section on the General's Handbook 2025-26 page, three
Skaven Devious Machinations heroic-trait renames matching the official July 2026 Scourge of Aqshy
Skaven document, a Wahapedia `{Army)` timing typo fix on Cursed Stele, and Wahapedia catching up
to the official Thyrielle's Zephyrites HERO-keyword removal (which retired the reviewed keyword
override). `src/tests/aos4/coreRulesExampleAbilities.test.ts` guards the exclusion list and proves
the shipped selection graph drops exactly the example cards.

The 2026-08-01b revision extends that snapshot on the same acquisition: it adds the two
commit-pinned BSData catalogues and the `communityWarscrollSources` review entries that ship the
Ogor supplement units and Lorai provisionally under the fallback-tier source policy described in
the Source policy section. Every Wahapedia and Games Workshop artifact is byte-identical to the
2026-08-01 pins.

The 2026-08-01c revision extends 2026-08-01b the same way for the battletome roster options
(beta report #1828): it adds one commit-pinned BSData faction catalogue, the `factionOptions`
scope on a new community source entry, and the reviewed `contextOverrides` that retire the
superseded index-era options to the historical context. Every other artifact is byte-identical
to the 2026-08-01b pins.

The 2026-08-01d revision completes the first provisional-to-verified swap: the accepted Stormcast
Eternals collection page carries Lorai, Child of the Abyss's full datasheet, so her Wahapedia
rules replace the BSData transcription, retiring the Stormcast library catalogue and its
community source entry. Her keyword line names Idoneth Deepkin and The Blacktalons rather than
Stormcast Eternals, so the intake introduced the reviewed `adoptedWarscrolls` mechanism: a
`currentWahapediaHtml` entry that names the collection page and datasheet, cites the official
Battle Profiles record establishing her roster home, and fails closed if the datasheet stops
matching exactly one non-native page. Every other artifact is byte-identical to the 2026-08-01c
pins. Note that a provisional swap replaces canonical identities: an army document that selected
the provisional entity resolves it with a diagnostic and reselects the verified one.

The 2026-08-01e revision classifies the 12 official Armies of Renown (beta direction in #1834,
correctness bug #1833) on the same artifacts and manifest: all 24 pages of the accepted official
Armies of Renown document become reviewed source records, and the new `armiesOfRenown` review
input names each army's faction-page root. Generation types those roots `army-of-renown`, hangs
their subgroups behind the root (battle traits auto-included, enhancements offered), and emits
`excludes` edges so selecting an army suppresses the faction's regular battle traits, formations,
enhancements, and lores — the official replacement semantic. Canonical identities are unchanged;
only group typing and the relationship graph moved. `src/tests/aos4/armiesOfRenown.test.ts` pins
the classification, the replacement, and the #1833 regression.

The 2026-08-01f revision extends the classification to every battletome and White Dwarf (Legends)
Army of Renown (issue #1844) on the same artifacts and manifest. The Wahapedia faction-page
decoder now captures the source's own classification — the `h2_ArmyOfRenown` marker before a
section heading, or the White Dwarf replace-rules intro sentence — as a derived flag outside the
hashed record value, so record identities are unchanged. Forty-eight new `armiesOfRenown` entries
classify the source-marked roots: twelve on official naming evidence (Battle Profiles pages 3-4,
24, and 38; Rules Updates pages 4, 6, 12, 37, 39, 48, 53, 56, 69, and 73-74, which became
reviewed source records), and thirty-six on the new `secondary-provisional` evidence tier, an
extension of the standing three-tier source policy for classifications the secondary source makes
explicitly while no free accepted official document names the army. The Lords of the Clan entry
preserves an official discrepancy: Battle Profiles page 24 lists it as a 0-point battle formation
of Battletome: Sylvaneth while the accepted transcription is an explicit replace-rules Army of
Renown. Generation now fails closed on any source-classified group without a reviewed entry, so a
new Army of Renown appearing on a faction page can never again decode as a generic content group
(the #1844 bug class). The White Dwarf armies decode in the Legends context and surface under the
masthead dropdown's Legends group header. `src/tests/aos4/armyPackageTriage.test.ts` pins the
retirement of the interim builder triage this revision replaces.

The 2026-08-02 revision completes the Ogor battletome faction package on the same acquisition
(Discord beta report: index-era Trampling Charge, Unrelenting Hunter, and Call of the Blizzard
still presented as current). It adds one commit-pinned BSData catalogue — the shared `Lores.cat`
at the already-accepted `a882188b` commit — carrying the Lore of Gut Magic and Lore of the
Everwinter transcriptions the faction catalogue only links to (the prior "dangling links" finding
was a provisional-watch coverage gap; the watch config now carries the battle-trait sentinels and
drops the satisfied BSData lore watches). The `communityWarscrollSources` scopes grow three
entries: the two lores (each a `spell-lore`/`prayer-lore` option pinned to its exact faction-page
type record) and the army-wide battle traits (a `battle-trait` option carrying the four battletome
trait abilities subtype-less on the faction's mandatory Battle Traits type). Reviewed
`contextOverrides` retire the index-era battle traits and lores to the historical context. Every
Wahapedia and Games Workshop artifact is byte-identical to the 2026-08-01 pins.

The 2026-08-16 regeneration (beta report: two "Devious Machinations" heroic-trait options in the
Skaven builder) is a generation-logic change on the same artifacts, manifest, and review. The
2026-08-03 snapshot's faction pages carry both a battletome enhancement table and the General's
Handbook 2026-27 replacement section under the same table name — 18 tables across 18 factions —
and generation offered both in the seasonal context because a `standard` section spans the current
and seasonal contexts. Generation now applies the replacement structurally: a standard subtype
(and its abilities) drops the seasonal context whenever a seasonal subtype shares its faction,
parent group, and name, with reviewed `contextOverrides` still outranking the rule. The importer
names the boundary when a roster carries a replaced battletome enhancement instead of reporting it
unknown. `src/tests/aos4/seasonalEnhancementSupersede.test.ts` pins a corpus-wide invariant — no
faction offers two identically named groups of one category in the same context — and the machine
review recertified as `aos4-corpus-2026-08-03-machine-r4` (72 fresh pairs, r3 evidence reused).

The older `candidate-*`, `cohort-*`, and `official-rules-*` reports are provenance for the review
journey. Their `blocked` or `candidate-review-required` statuses describe pre-acceptance inputs, not
the current runtime.

## Source policy

Sources form a three-tier hierarchy:

1. **Official Games Workshop publications are authoritative.** Use the newest applicable
   publication; it wins every conflict.
2. **Wahapedia is the preferred secondary.** Use
   [Wahapedia's AoS 4 exports](https://wahapedia.ru/aos4/the-rules/data-export/) and bounded
   current faction pages as the coherent secondary datasets for discovery, joins, and coverage.
3. **BSData is an acceptable fallback**, by owner decision (2026-08-01, see
   [#1812](https://github.com/daviseford/aos-reminders/issues/1812)): community-transcribed rules
   from [BSData/age-of-sigmar-4th](https://github.com/BSData/age-of-sigmar-4th) may enter the
   accepted corpus only when **(a)** an official Games Workshop publication establishes the
   content (the unit exists in an accepted official battle-profile fact), **(b)** Wahapedia does
   not yet carry the rules, **(c)** the facts are recorded as a commit-pinned
   `communityWarscrollSources` review entry marked `provisional-pending-official-verification`
   with per-unit checksums and their attribution visibly provisional, and **(d)** they are
   verified or replaced through the standard candidate intake as soon as Wahapedia or an
   owner-supplied official source becomes available. BSData never overrides an official fact, and
   it never supplies battle-profile values (points, unit sizes, bases, roster notes) that
   officialdom already provides. It replaces accepted Wahapedia text in exactly one reviewed
   shape (owner-approved extension for
   [#1850](https://github.com/daviseford/aos-reminders/issues/1850)): when an official
   publication has superseded that text — a battletome rewrite — and Wahapedia demonstrably still
   serves the previous book's rules, a per-unit `replacesSourceRecordId` pin may swap in the
   community transcription. The pin must name the stale current-standard datasheet by source
   record; the community record adopts that datasheet's canonical identity so saved armies keep
   resolving; the stale rows are dispositioned superseded; the intake remains provisional with a
   watch sentinel per unit; and the merge fails closed on an unknown pin, a non-standard-context
   record, or an official-name mismatch. Wahapedia text the official sources have not superseded
   is never replaced. BSData also underpins much of the wider AoS tool ecosystem, so alignment
   with it has value in itself — but only inside these conditions.

Other sources may identify gaps but must not silently override any tier above them.

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
prepared. Within the Rules Radar, BSData is a change signal; BSData bytes enter a candidate only
through the fallback-tier source policy above (commit-pinned, provisional, official-established),
never through radar automation.

The companion **AoS 4 Provisional Watch** workflow (`aos4-provisional-watch.yml`, daily at
14:07 UTC) checks the concrete pages where the corpus's provisional community-fallback content
would be verified or replaced — the Wahapedia pages named by each `communityWarscrollSources`
verification condition, plus the moving BSData files for transcriptions the fallback tier is
still missing. The reviewed sentinel list is `data/aos4/radar/provisional-watch.json`; a hit
comments once per finding-set on the tracking issue (deduplicated by a fingerprint marker) so the
standard candidate intake can run. Like the radar, the watch is evidence, not acceptance. Run it
locally with `yarn data:aos4:radar:watch-provisional --output <new-directory>`.

Scheduled workflows run only from the repository's default branch, so the Rules Radar becomes
active when Version 6 reaches `master`. Immediately after launch, first run `AoS 4 Rules Radar`
manually with `source: all` and `report_only: true`. Inspect the uploaded lanes, report, event
counts, fingerprints, URL lists, and managed issue body. Then inspect the first daily and weekly
scheduled runs before relying on issue lifecycle automation.

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

Its `acceptedManifestPath` and `sourceClassificationsPath` are the Games Workshop lane's baseline
and must move with every accepted snapshot. The config only proves those paths exist, so a
superseded pointer reports each publication the intake accepted as a new one and each publication
it replaced as removed — a full lane of material events with nothing to intake behind them.
`src/tests/aos4/rulesRadarCompare.test.ts` fails when either pointer is not the newest reviewed
file of its kind.

A BSData review starts by locating the corpus's own pins inside the signalled range, because the
radar baseline and the accepted pins move independently: the accepted artifacts are pinned per file
at their own commits, so most of a signalled range is usually content a prior intake already
reviewed. Compare each pinned file's blob at its pin against the same path at the observed head —
identical blobs mean no accepted byte moved and the review reduces to the remainder. The
2026-08-04 review (`0d3eb56f` → `f6363c26`, issue #1757) is the worked example: all three pinned
Ogor catalogues were byte-identical at head, the cross-faction points changes matched official
facts the corpus already applied from the July 2026 Battle Profiles, and most remaining lines were
apostrophe re-escaping. Community corrections to factions the corpus does not source from BSData
are never adopted from the signal; they can only prompt a normal candidate against Wahapedia or an
official document.

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
  --accepted-manifest data/aos4/manifests/accepted-2026-07-30.json `
  --offline `
  --output <new-directory>
```

Offline replay fails when any checksum-addressed cache entry is missing or corrupt.

### Restore the private immutable artifact cache

Repeated refreshes should not download bytes that are already pinned by checksum. The store is
provisioned as `aos-reminders-aos4-artifact-cache` in `us-east-1` under the `aos4-artifacts`
prefix. Authenticate the AWS CLI with least-privilege `GetObject` and `PutObject` access, and set:

```powershell
$env:AOS4_ARTIFACT_STORE_BUCKET = 'aos-reminders-aos4-artifact-cache'
$env:AOS4_ARTIFACT_STORE_EXPECTED_OWNER = '<12-digit-aws-account-id>'
$env:AOS4_ARTIFACT_STORE_PREFIX = 'aos4-artifacts'
$env:AWS_REGION = 'us-east-1'
$env:AWS_PROFILE = '<profile>'                     # optional
```

These are per-shell and do not persist. A shell without them falls back to the local cache alone,
which is why a bare `cache:pull` reports that the bucket is required rather than doing nothing.

Restore or seed the bytes pinned by a reviewed manifest:

```powershell
yarn data:aos4:cache:pull `
  --manifest data/aos4/manifests/accepted-2026-08-02.json `
  --jobs 4

yarn data:aos4:cache:push `
  --manifest data/aos4/manifests/accepted-2026-08-02.json `
  --jobs 4
```

The local cache remains the first tier. Accepted replay and generation restore a missing pinned
blob from the private tier before failing; online candidate acquisition still revalidates remote
sources, and `--offline` never contacts a source website. Objects live at
`<prefix>/blobs/<sha256>`. Pull verifies the server checksum, byte length, and downloaded SHA-256
before an atomic local publish. Push verifies local bytes and uses a create-only conditional write,
so an existing checksum key is never silently replaced. A corrupt local or private object blocks
the command.

Both commands confirm the bucket with `head-bucket` before transferring anything. S3 answers
`head-object` with a bare 404 when a bucket is missing or inaccessible — it will not say
`NoSuchBucket`, because that would leak whether a bucket the caller cannot reach exists. Without
the preflight a typo'd bucket, a wrong `--expected-owner`, or an unprovisioned store all reported
as `Remote artifact <sha256> is missing`, pointing at the manifest instead of the configuration.
A pull whose local cache already satisfies the manifest still contacts nothing.

The bucket is operational infrastructure, not provisioned or seeded by this repository. It is
configured with S3 Block Public Access on all four settings, `BucketOwnerEnforced` ownership,
default SSE-S3 encryption with a bucket key, and a bucket policy denying both non-TLS requests and
principals outside the owner account. Its lifecycle rule aborts incomplete multipart uploads after
seven days and expires nothing — pinned checksum objects are retained indefinitely, since deleting
one makes every manifest that names it unreplayable. Do not put credentials, pre-signed URLs, or
bucket inventory in logs or PRs. To test recovery, pull into a new temporary cache with
`--cache <temporary-directory>`, replay the accepted manifest offline from that cache, then remove
only that verified temporary directory.

Incremental certification overlays are also immutable dependency chains. Retain every certification
directory named by a current descendant's `reuseSource`; deleting or relocating one makes the
descendant unverifiable. The preparer automatically compacts after three overlay levels by resolving
the retained evidence into a new self-contained certification, after which ancestors no longer named
by any current certification may be archived under the normal release-retention policy.

Fallback-tier BSData catalogues are acquired separately, always pinned to a full commit SHA so the
bytes are immutable:

```powershell
yarn data:aos4:candidate:bsdata `
  --repository BSData/age-of-sigmar-4th `
  --ref <full-commit-sha> `
  --path "Ogor Mawtribes - Library.cat" `
  --output <new-directory>
```

The command verifies the commit exists, caches the pinned bytes by SHA-256, and writes a
`bsdata-manifest.json` plus provenance record. Like every acquisition, it proves retrieval only;
acceptance happens through a reviewed `communityWarscrollSources` entry that satisfies the
fallback-tier conditions.

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
campaign. The campaign may carry forward an exact passing pair verdict only when its pair key,
blind and comparison packet IDs/checksums, protocol, rubric, reviewer configuration, and review
engine all match a prior passing certification. Use `--reuse-certification`; never copy, edit, or
manually rebind an old ledger. Ambiguous or changed evidence becomes fresh work, and calibration
controls are always rerun.

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
keep rules/data changes separate from package modernization.
