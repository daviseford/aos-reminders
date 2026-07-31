# Strategy: a real New Recruit roster corpus for import testing

Date: 2026-07-29 (revised)
Status: strategy proposal (feeds plan `2026-07-29-001` step **U4**)
Owner: davis

## Position

We ship import of `.ros` / `.rosz` / `.json` files produced by New Recruit as a user-facing
service. The corpus should therefore be **real lists produced by New Recruit**, acquired at volume
through sanctioned channels. Synthesis is reduced to the one job real lists cannot do: adversarial
fail-closed cases.

An earlier revision of this document proposed generating rosters from the BSData catalogue and
using round-trip property tests as an oracle. That was the wrong emphasis:

- **It cannot reach `.json` at all.** A BSData `.cat` walker knows nothing about how New Recruit
  serialises a *roster*, in any format. Only real exports teach us that, and `.json` is one of the
  three formats we have committed to accepting.
- **A generator emits *legal* rosters. Users produce illegal ones.** New Recruit lets people save
  half-finished lists, over-points lists, lists built against a catalogue revision that has since
  changed. That class of input is most of the real failure surface and a constraint-respecting
  generator never reaches it.
- **It assumes serialisation is stable.** It is not — it drifts across New Recruit app versions
  and across the age of the saved list. Real lists from many dates capture that for free.
- **A faithful BSData walker is comparable work to the importer itself** (entryLinks,
  selectionEntryGroups, constraints, modifiers, categoryLinks), and its output is only ever as
  good as our inference of a format we would be guessing at.

I also overstated the access concern. Building a few dozen lists in your own account is using the
product as intended, not abuse.

## Evidence: the FEC1 reference triple

A real Flesh-eater Courts list captured in all three formats
([share link](https://www.newrecruit.eu/app/list/9BLBv)) settles most open questions. Every claim
below is measured from those files, not inferred.

### The three formats collapse to one decode target

- `.rosz` is a **single-entry zip** containing `FEC1.ros`, deflate, **byte-identical** (sha256
  match), no metadata or directory entries.
- `.json` is a **mechanical transliteration of the same XML tree** — identical field names
  (`forces`, `selections`, `categories`, `entryId`, `entryGroupId`, `number`, `type`, `from`), with
  XML text nodes as `$text`. A structural diff of `.ros` against `.json` is **isomorphic**; the
  entire delta is (a) numeric attributes typed as numbers, (b) `primary`/`hidden` typed as bools,
  (c) `$text` for element text.

So one normalizer serves all three, and `.json` is a far smaller addition to `U4` than assumed.

**This makes the three-format capture the cheapest oracle we have.** For every list, decoding
`.ros`, `.rosz`, and `.json` must yield an identical normalized roster — a self-checking triangle
invariant per list, requiring no hand-authored expected value. That is precisely why capturing all
three is not redundant.

### Structural facts the adapter must handle

- **Regiments are nested `<force>` elements**, not selections: `force.forces[]`, `name="Regiment"`,
  with composite `entryId` joined by `::` (`b016-…::376a-…`). The adapter must recurse forces.
- **Units nest models**: `type="unit"` → children `type="model"` carrying counts. Reinforcement is
  expressed as model counts, not a marker — Crypt Ghouls appear as `1 + 19`, the champion split
  out. Unit display names may *also* carry a count (`Crypt Flayers (2 Models)`).
- **Enhancements are `type="upgrade" from="group"`** (`Charnel Vestments` 20pts, `Cruel Taskmaster`);
  `General` is `from="entry"`.
- **Seasonal variants live in the display name**: this one list contains both `Royal Decapitator`
  *and* `Royal Decapitator (Scourge of Aqshy)`. Name → canonical ID resolution must treat the
  suffix as rules-context identity. No catalogue-walking generator would have produced that pairing.
- **The force name carries the rules context**: `✦ General's Handbook 2026-27` (leading U+2726,
  curly apostrophe). `Allow Legends` appears as a Configuration selection.
- **Categories mix three unrelated things**: keywords that matter to reminders (`HERO`,
  `WIZARD (1)`, `WARD (6+)`), structural roles (`Regimental Leader`, `Regimental Hero`,
  `Regimental Option`), and New Recruit's own legality markers (`Undersize Unit`, force-level
  `Illegal Units`). The adapter partitions them and **discards the legality markers** — see
  "Legality is not our concern" below.
- **Duplicates are normal**: 3× Royal Decapitator, 3× Cryptguard, 3× Varghulf Courtier. Never
  dedupe by name.
- **IDs are not hex/GUIDs**: `gameSystemId="e51d-b1a3-75fc-dc3g"` ends in `g`. Do not validate them
  as UUIDs.
- **Detection markers**: `battleScribeVersion="2.03"`, `generatedBy="https://newrecruit.eu"`,
  `gameSystemName="Age of Sigmar 4.0"`, `gameSystemRevision`, per-force `catalogueRevision`
  (the staleness signal), namespace `http://www.battlescribe.net/schema/rosterSchema`.

### Sizing — this corrects a real hazard in `U4`

One 2500pt list: **191,910 B `.ros` / 167,141 B `.json` / 16,719 B `.rosz`** — 145 selections,
178 profiles, 714 characteristics. **41.9% of the bytes are ability rules text we must ignore**,
which independently validates `U4`'s "composition labels and type hints only" rule.

Two consequences for the byte budgets:

1. A conservative expanded-byte cap (256 KB, say) would **reject ordinary real rosters**. Size the
   expanded budget in megabytes, and derive it from the largest observed real list, not intuition.
2. Legitimate compression here is **11.5:1**. A zip-bomb guard keyed on compression ratio alone
   would fire on genuine `.rosz` files. Gate on *absolute expanded bytes* with a streaming abort,
   as the plan already specifies — not on ratio.

## Legality is not our concern

AoS Reminders turns a list into phase-ordered reminders. Whether that list is *legal* is a list
builder's and a tournament organiser's problem, not ours. People will import lists with too many
heroes, undersize units, illegal allies, wrong points totals, and half-finished regiments, and our
job is to import them as faithfully as we can.

**Separate two ideas that are easy to conflate in implementation:**

| | Meaning | Behaviour |
|---|---|---|
| **Structural validity** | Is this a well-formed, safe, in-edition New Recruit file? | **Fail closed.** Malformed XML, zip bombs, XXE, traversal, wrong game system, wrong edition. |
| **Game legality** | Is this army composition legal to play? | **Never gate on it.** Not an error, not a warning, not a filter. |

Consequences:

- Discard `Illegal Units` and `Undersize Unit` categories with the rest of the structural
  bookkeeping. Do not raise diagnostics from them.
- Never validate against points limits, force-organisation constraints, hero caps, or regiment
  composition rules. `costLimits` is metadata, not a check.
- The only diagnostics that reach the user are about **our** failure to interpret the file: an
  unresolved name, an unsupported source, an unreadable file.
- Invalid lists are **first-class corpus members**, not edge cases. This strengthens the community
  call (tier 3): those messy real lists are the ones that exercise the resolver hardest, and a
  constraint-respecting generator could never have produced them.
- Corollary for the corpus: deliberately capture illegal lists in tier 1 — over-points, hero spam,
  a lone undersize unit, an empty regiment — and assert they import cleanly rather than warn.

## Acquisition ladder

Ordered by cost-to-first-list. Run 1 and 2 in parallel.

### 1. Your own account (~30–50 lists, days)

Build a spanning set by hand in `newrecruit.eu/app/MyLists` and export each as `.ros`, `.rosz`,
and `.json`. You need this tier regardless, because it is the only one where you control the
*structural* shapes rather than the popularity distribution:

minimum viable list · standard 2000pt · Spearhead · GHB 2026-27 (`Scourge of Aqshy`) · hero with
artefact + heroic trait + lore · reinforced and duplicated units · faction terrain and
manifestation lore · Regiment of Renown / auxiliary / allies · Legends unit · unicode and emoji
names · unnamed roster · stale catalogue revision · list with user notes · a 40k or Old World list
(wrong-game rejection) · an AoS 3rd list if one exists (wrong-edition rejection)

Deliberately include **illegal** compositions, which must import cleanly rather than warn:
over-points · hero spam · undersize units · empty regiment · missing general · illegal allies ·
a list saved mid-edit

Claude in Chrome can drive the repetitive ones against your logged-in session.

### 2. New Recruit's own APIs — the unlock

New Recruit publishes a credentialed API that exposes tournament results *including exported army
lists*:

- `POST /api/systems` — resolve the AoS 4 `id_game_system`
- `POST /api/tournaments` — `{start, end, id_game_system, status, page}`, 50 per page
- `POST /api/reports` — `{id_tournament}` → report objects, and **"exported army lists are
  included in the `exported_list` field for each player when available"**

Auth is `NR-Login` / `NR-Password` headers. The docs explicitly invite access requests
("contact NR if you need to access this API") and note that requests are logged internally.

**Action: email New Recruit, explain that AoS Reminders is adding New Recruit import and ask for
API access for corpus building.** This is the single highest-leverage step in the whole plan. It
yields hundreds of current, competitive, real lists across factions, weighted by what people
actually play — which is exactly the distribution our resolver needs to be good at.

Two unknowns to confirm on first contact: the `exported_list` encoding (text / `.ros` XML / NR
JSON — undocumented), and any rate limit. Pull politely, cache locally, never re-fetch in tests.

### 3. Community call (best source of *messy* lists)

AoS Reminders has an existing user base. A short "send us your New Recruit export and help us test
import" post gets consented, diverse, real-world-broken lists — the half-finished and stale ones
that tournament packs, by definition, will not contain. Cheap, and it doubles as pre-launch
signal for the feature.

### 4. Public packs and share links

Published tournament list packs, forum and Discord posts, and New Recruit share links (lists are
viewable by link without an account). Opportunistic top-up; check licensing before committing
anything.

## What synthesis is still for

Exactly two things, both narrow:

1. **Adversarial fail-closed cases (~30, all committed).** These cannot be obtained from real
   lists and `U4` requires them: oversized compressed / oversized expanded (zip bomb),
   selection-count overflow, encrypted zip entry, path-traversal entry name, multiple candidate
   roster entries, zip metadata-only entries (must *not* trigger a multi-roster error), doctype
   and entity declarations (XXE, billion laughs), malformed XML, two roster roots, wrong game
   system, wrong edition, truncated file, HTML/script payloads in name attributes.
2. **Mechanical mutations of real files.** CRLF/LF, BOM, minified vs pretty-printed, whitespace.
   Trivial to apply over tier 1, no generator required.

The BSData catalogue walker is dropped. BSData keeps one reduced role — see below.

## The oracle, revised

I over-weighted the need for per-file expected values. For an importer, the highest-value
assertions are **self-checking** and need no oracle:

- every selection name in the file resolved to a canonical AoS 4 ID
- faction and rules context resolved
- no crash, no hang, no network request during processing, no XML-derived HTML rendered
- determinism — same input yields the same output across runs (this is the regression guard)

The **unresolved-name histogram** is the primary artifact, and on real lists it is strictly better
than on synthetic ones, because it is weighted by actual play. It ranks what to fix next.

Layer hand-authored expected values on only the ~20 curated goldens. Snapshot the rest, with
review-on-diff.

The one assertion that matters most: **zero silently-wrong resolutions.** A wrong canonical ID is
far worse than an honest diagnostic, because it produces confidently incorrect reminders.

## BSData's reduced role

Not a generator. Three uses:

- **Alias reconciliation.** BSData/NR display names diverge from canonical AoS 4 names in
  hyphenation, subfaction wording, punctuation, and option suffixes. Build the name → canonical ID
  table through the existing reconciliation machinery (`src/aos4/reconcile/`, `data/aos4/reviews/`).
- **Blind-spot measurement.** Real lists only cover what people play. Diffing BSData's full entry
  set against names seen in the corpus tells us precisely which units we have *never* tested —
  that list is our known risk register, and it is not obtainable any other way.
- **Phase 1 rules cross-check.** The Phase 1 pipeline is already multi-source:
  `SourcePublisher` (`src/aos4/domain/source.ts`) admits another publisher, and
  `resolveFactPrecedence` ranks official > secondary > community. Registered at `community`
  authority, BSData can never *change* a resolved value — only corroborate or disagree — which is
  the right posture for a verification source: zero risk to shipped data, pure signal. It is
  genuinely independent triangulation (separate maintainers from Wahapedia, transcribing the same
  GW publications) and it is *load-bearing* data — thousands of players build legal lists from it
  daily, so points, composition, keyword, and force-org errors get found and patched fast.

  Strong on structured facts: points, unit characteristics, weapon profiles, keywords/categories,
  enhancement lists, battle formations, force organisation, and ability Timing/Declare/Effect
  fields — the last directly relevant to reminder projection. Weak on prose: ability text is
  community transcription, sometimes abbreviated — fuzzy-match or skip text fields.

  Two implementation notes. First, the precedence engine will not surface these disagreements
  today: `conflicting-authoritative-facts` only fires *within* the top authority tier, so a
  community fact disagreeing with an official one loses silently. Run the comparison as an
  **offline report lane** (like the existing certification runs) emitting a discrepancy histogram
  alongside the unresolved-name histogram; a cross-authority disagreement diagnostic (precedent:
  `secondary-newer-than-official`) can come later if we want it in shipped reconciliation. Second,
  the alias table is the prerequisite — and building it is itself a verification pass: every
  BSData entry that cannot map to a canonical ID is either a naming divergence or a unit we are
  missing, so the cross-check produces findings before any fact comparison runs.

Plus a scheduled drift check against BSData `main`, since new community entries are the realistic
production failure mode.

Licensing boundary: never ship BSData-derived content in the runtime bundle. Community catalogue
licensing is grey; offline comparison is fine, redistribution is not. The Phase 1 audit-catalog /
runtime-projection split is the enforcement point.

## Fixture directory design

Every list is captured as a **triple** — `.ros`, `.rosz`, `.json` — in one directory per list, so
cross-referencing is a directory listing rather than a lookup table.

```
src/tests/fixtures/aos4/import/new-recruit/
  README.md                     # capture + sanitisation procedure
  manifest.json                 # index of every list: shapes covered, provenance, checksums
  lists/
    fec-001-ghb-kitchen-sink/
      list.ros                  # as exported, sanitised
      list.rosz
      list.json
      meta.json                 # faction, points, context, NR share id, capture date,
                                #   NR app + catalogue revision, shapes[] covered
      expected.json             # curated goldens only — canonical IDs + expected diagnostics
    fec-002-minimal-general-only/
    sce-001-spearhead/
    ...
  adversarial/                  # synthetic, ~30, each with expected rejection reason
    zip-bomb-expanded/
    xxe-doctype/
    path-traversal/
    ...
```

Naming: `<faction-slug>-<nnn>-<shape>`. `manifest.json` is generated by a capture script, never
hand-maintained, and records for each list which coverage dimensions it hits — so we can report
*coverage*, not just file count.

**Invariants enforced across every triple** (no expected value needed):

1. `unzip(list.rosz)` is byte-identical to `list.ros`, single entry.
2. `list.json` is isomorphic to `list.ros` under the transliteration rules above.
3. All three decode to an identical normalized roster.
4. Decoding is deterministic across runs.

These four run over the *whole* corpus, committed and generated alike. Hand-authored
`expected.json` is layered onto only the ~20 curated goldens.

`FEC1` becomes `fec-001-ghb-kitchen-sink` — it already covers GHB 2026-27 context, nested regiment
force, enhancements, reinforced units, duplicates, monsters, seasonal name variants, undersize and
illegal-unit markers, and Legends-allowed configuration. It is a strong first fixture and a good
template for what a single capture should aim to exercise.

**Capture cost.** Export is three downloads per list from the New Recruit list view. Claude in
Chrome can drive the repetitive export-and-rename loop against your logged-in session, then run
sanitisation and manifest generation. The manual work is *building* varied lists; the capture
itself should be scripted.

## Handling, sanitisation, licensing

Real lists carry real people's data. Non-negotiable before anything is committed:

- strip account identifiers, player names, and user notes; replace roster GUIDs deterministically
- keep tournament-derived and community-submitted lists **out of the committed tree** — they live
  in gitignored `data/aos4/import-corpus/` with a provenance manifest
- committed fixtures (~40 small files) are sanitised own-account lists, one per structural shape,
  plus all adversarial cases — satisfying the plan's "minimal synthetic fixtures" and keeping
  `yarn test` fast
- the full corpus runs in a separate nightly/pre-release lane, never on every commit

## Scope gaps to resolve in `U4`

1. **`.json` is unscoped.** `U4` names `.ros` and `.rosz` only; JSON appears nowhere in
   `2026-07-29-001`. The FEC1 evidence makes this cheap — JSON is the same tree, so it needs a
   decode front-end and its own detection markers and byte caps, not a second adapter. Amend `U4`
   rather than deferring it.
2. **The byte budgets are unsized.** `U4` says "enforce the named compressed/text and expanded
   limits" without naming them. Derive them from measured real lists (see Sizing above), and
   explicitly *do not* gate on compression ratio.
3. **Nested forces.** `U4`'s parsing notes describe selections, not recursive forces. Regiments are
   nested `<force>` elements; the adapter contract needs to say so.
4. **Legality markers are ignored, not surfaced.** `U4` should state explicitly that `Illegal
   Units`, `Undersize Unit`, points totals, and force-organisation constraints never influence
   import — see below.

## Sequencing

1. **Email New Recruit for API access.** Longest lead time, highest payoff — start today.
2. ~~Stand up the fixture directory and land `FEC1` as `fec-001-ghb-kitchen-sink`, with the
   capture, sanitisation, and manifest scripts and the triple invariants as an executable test.~~
   **Done 2026-07-29** — `src/tests/fixtures/aos4/import/new-recruit/`,
   `src/tests/aos4/importFixtures.test.ts`, `yarn fixtures:new-recruit`. Invariants 1 and 2 are
   enforced now; 3 and 4 land with the adapter.
3. Build the own-account spanning set against the coverage matrix, capturing all three formats.
4. Amend `U4` for the four scope gaps above.
5. Build adversarial cases alongside `U4`'s fail-closed paths.
6. Post the community call once import is demoable.
7. Wire the full-corpus lane and the unresolved-name histogram.
8. Add BSData alias reconciliation, blind-spot/drift reporting, and the Phase 1 cross-check
   report lane.

Steps 1–3 are independent of `U4`'s implementation and on its critical path.

## Risks

| Risk | Mitigation |
|---|---|
| New Recruit declines API access | Tiers 1, 3, 4 still stand; community call becomes primary |
| `exported_list` is a text summary, not a file | Confirm on first contact; falls back to tiers 1/3/4 |
| Real lists carry personal data | Sanitise; keep uncommitted with provenance manifest |
| Corpus skewed to competitive meta | BSData blind-spot diff quantifies the gap explicitly |
| `.json` unscoped in the plan | Resolve before implementation (above) |
| Corpus size slows CI | ~40 committed files; full corpus in a separate lane |
| BSData catalogue licensing is grey | Offline comparison only; nothing BSData-derived ships in the runtime bundle |

## Sources

- [New Recruit Tournaments API](https://www.newrecruit.eu/tutorials/tournaments)
- [New Recruit Reports API](https://www.newrecruit.eu/tutorials/reports)
- [New Recruit Systems API](https://www.newrecruit.eu/tutorials/systems)
- [BSData/age-of-sigmar-4th](https://github.com/BSData/age-of-sigmar-4th)
