# Rules Radar alarm runbook

What to do when the AoS 4 Rules Radar reports a material change: an email with the subject prefix
`🚨 AoS Rules Radar`, or a new delta comment on the managed issue
([#1757](https://github.com/daviseford/aos-reminders/issues/1757)). How the sentinel itself works is
described in [`aos4-maintenance.md`](./aos4-maintenance.md) (Rules Radar section); the accuracy
gate it feeds is in [`aos4-accuracy-review.md`](./aos4-accuracy-review.md).

## What the alarm means

- **It is evidence, not acceptance.** A source the corpus watches changed. Nothing in the runtime
  moved, and nothing moves until a reviewed candidate is accepted, generated, and certified.
- **It fires at most once per material state.** The decision keys on the material fingerprint (the
  material events only). A re-run that sees the same state, operational churn beneath an unchanged
  event, or a lane resolving without new events does not re-alarm. If an alarm is lost the next run
  will not resend it; the managed issue body is the durable record.
- **Every material event has an owner action.** Either the shipped rules text is wrong until it is
  reconciled, or the event is stale-baseline noise and the config that produced it needs fixing.
  There is no "acknowledge and wait" state.

The alarm body and the managed issue list each event with its lane (`Games Workshop`, `Wahapedia`,
`BSData`), the baseline and observed identifiers, and a compare or download URL. Start from the
workflow run's curated artifacts (`report.json`, per-lane JSON, `alarm.json`) when the body is not
enough.

## Triage every event

### 1. Rule out a stale baseline

The Games Workshop lane diffs the live downloads catalog against the manifest and classification
file named in `data/aos4/radar/config.json`. If those pointers lag the accepted revision, the lane
reports publications the corpus already pins as "new" and their predecessors as "removed" (the
2026-08-04 batch reported fourteen such events; only the BSData event was real). Check:

- `acceptedManifestPath` names the newest `data/aos4/manifests/accepted-*.json`;
- `sourceClassificationsPath` names the newest reviewed
  `data/aos4/reviews/source-observation-classifications-*.json`;
- `bsData.baselineSha` is the commit the last BSData review actually ended on.

A stale pointer is fixed by a config PR (see #1928), after which the radar needs one manual
`source: all` run to clear the lane. Nothing else is owed for those events.

### 2. Games Workshop events

A genuinely new or replaced official publication is the primary source moving. Under the
official-first intake gate (#1820) reviewed intake starts immediately: acquire the document through
`yarn data:aos4:candidate --official-urls-file ...`, extract or classify it, and either accept it
through the normal candidate cycle or record an explicit non-material disposition in a new dated
`source-observation-classifications-*.json`. An official document that introduces content is never
merely reference evidence.

### 3. Wahapedia events

A changed sentinel (`Last_update.csv`, the data-export navigation, or a watched faction page)
expands to the bounded full observation the workflow already runs. Compare the candidate report's
changed records against the accepted review; a text change to a record the corpus ships starts a
normal candidate → review → accept cycle. Wahapedia is a co-equal secondary: an official document
wins any conflict, and a Wahapedia change never overrides a reviewed official fact.

### 4. BSData events

The lane reports `baseline → observed` on `BSData/age-of-sigmar-4th` with the changed paths. Most
of a signalled range is usually content the corpus does not carry, so reduce it before reading:

1. List the corpus's own pins: every `communityWarscrollSources` entry in the accepted review
   (commit + file) and every `bsdata-cat/1` artifact in the accepted manifest. Files pinned at a
   commit outside the signalled range are unaffected regardless of what the range touches.
2. For each pinned file inside the range, fetch the blob at its pin and at the observed head and
   diff them with CRLF and `&apos;`/`'` churn normalized (`diff -w` after stripping `\r`).
   Identical normalized blobs mean no accepted byte moved.
3. Classify what remains. Roster-builder plumbing — `entryLink`, `modifier`, `condition`,
   `categoryLink` wiring, new custom-hero or Army of Renown packages the corpus does not ship —
   is not a rules change. A changed `characteristic` (ability text, timing, weapon line, keyword)
   on a unit, lore, or faction option the corpus ships is.
4. Confirm at the extractor level, not just the XML: run `extractBsDataWarscrolls` over both blobs
   for the reviewed unit names and diff the facts with `sourceRecordId`/`factChecksum` stripped.
   This is the check that catches attribute-level changes hidden in a large diff (the
   `NON-GUTBUSTERS` constraint categories in #1976 surfaced here, not in the XML skim).
5. Corrections to factions the corpus does not source from BSData are never adopted from the
   signal; they can only prompt a normal candidate against Wahapedia or an official document.

Record the outcome — what moved, what was excluded and why — in the review paragraph the
maintenance runbook keeps per BSData review, so the next reviewer can start from the reduction.

## Decide the outcome

| Finding | Action | Precedent |
| --- | --- | --- |
| Every event is stale-baseline noise | Config PR re-pointing the radar; one manual `source: all` run | #1928 |
| BSData moved, no shipped record changed | Advance `bsData.baselineSha` + `baselineReviewedAt` in `data/aos4/radar/config.json`, the SHA literal in `src/tests/aos4/rulesRadarCompare.test.ts`, and add the review paragraph to the maintenance runbook | #1931 (`0d3eb56f` → `f6363c26`) |
| BSData moved and a shipped record changed | Full re-pin (checklist below) | #1968 (`c8e1b1c9` → `301477a3`), #1976 (`301477a3` → `d7377e94`) |
| Official or Wahapedia record the corpus ships changed | Normal candidate → review → accept → generate → certify cycle | `aos4-maintenance.md`, Review and acceptance |

Never advance a baseline for a range you have not reduced, and never hand-edit generated products
to apply a correction; the correction enters through the pin and regeneration.

## Re-pin checklist

PR #1976 (2026-08-25, `301477a3` → `d7377e94`) is the worked example; the steps below are the order
that its fail-closed gates enforce. Five of them are easy to miss because the generator reports
them one at a time, each only after the previous one is satisfied.

1. **Review the diff first** (see the Rules Radar section): locate the corpus's own pins inside the
   signalled range, normalize CRLF and `&apos;` churn, and name every record inside the shipped
   scope that actually changed. The re-pin is a corpus review decision; do not start it to find out
   what moved.
2. **Acquire the file at the reviewed commit** into the immutable cache:
   `yarn data:aos4:candidate:bsdata --ref <40-char sha> --path "<file>.cat" --output .cache/aos4/bsdata-candidates/<sha8>`.
   The candidate manifest it writes carries the artifact record (checksum, byte length, etag, URLs).
3. **Create the dated accepted manifest and review file** by copying the current ones
   (`accepted-<date>.json`, `corpus-<date>.json`) and swapping the artifact record in both, plus
   `commit` on the review entry. Append the reason for the re-pin to the entry's `reason`. Set the
   review's top-level `revision` to `aos4-corpus-<date>` — if it keeps the old value, packet
   preparation stamps the workspace with the old revision and `certify:prepare` later rejects the
   inventory with "Review index, source inventory, protocol, rubric, or revision do not match".
4. **Recompute every unit `recordChecksum`** on the entry with `extractBsDataWarscrolls` from
   `src/aos4/data/bsdata/library.ts`. All of them move, even for units whose text did not change,
   because each nested record's `sourceRecordId` embeds the artifact checksum. Diff the extracted
   facts with those ids stripped to confirm the content delta matches step 1 — that comparison is
   what caught the `NON-*` roster-constraint category links in #1976.
5. **Re-point the constants and config**: `src/aos4/data/acceptedRevision.ts`, `bsData.baselineSha`
   and `baselineReviewedAt` plus `acceptedManifestPath` in `data/aos4/radar/config.json`, the SHA
   literal in `src/tests/aos4/rulesRadarCompare.test.ts`, and the dated report/manifest paths in
   `src/tests/aos4/catalogIntegrity.test.ts` and `src/tests/aos4/ogorSupplementProvisional.test.ts`.
6. **Run `yarn data:aos4:generate:write`** and satisfy its gates in turn: it will first report the
   reconciliation checksum in `currentWahapediaHtml.reconciliation` (copy the new value into the
   review when only `checksum` moved and the page/fact/discrepancy counts held), then
   `identity-not-found publication:other:community:<checksum>` — add a
   `{"externalId": "community:<checksum>", "publisher": "other"}` alias to the catalogue's existing
   publication entry in `data/aos4/identities/corpus.json`, keeping the aliases sorted. Then
   `yarn data:aos4:generate:candidate` to prove the products replay deterministically, and diff the
   old and new `runtime.json` entities with the artifact checksum masked: the delta must be exactly
   the reviewed records.
7. **Certify**: live `inventory:observe-official` (from a fresh `discover-official` snapshot),
   `inventory:observe-wahapedia`, and `inventory:observe-bsdata` for every pinned commit; bind them
   with `data:aos4:inventory --revision aos4-corpus-<date> --accepted-manifest <new manifest>`;
   `review:prepare --workspace .cache/aos4/review/workspace-aos4-corpus-<date>`;
   `review:adversarial --reuse-certification <current certification>` (expect zero reuse — the
   re-key invalidates every pair on the re-pinned artifact); `certify:prepare` into
   `data/aos4/certifications/aos4-corpus-<date>-machine-r1`; point `beta.json` at it;
   `yarn data:aos4:verify:beta`; `yarn data:aos4:certify:prune`. The pruner keeps the previous
   directory when the new overlay names it as the reuse offer; that is expected.
8. **Update the prose**: the snapshot table and Ogor pin history in this document, the current
   campaign in [`aos4-accuracy-review.md`](./aos4-accuracy-review.md), the revision name in
   `AGENTS.md`, `README.md`, and `PRODUCT.md`, and the certification directory in
   `src/tests/aos4/certificationReuse.test.ts`. Then lint, typecheck, build, and the full test run.
9. **After merge**, dispatch `AoS 4 Rules Radar` once with `source: all` so it observes the new
   baseline and clears the BSData lane on the managed issue.

## Close out

- The PR title, commit, and description reference the managed issue (`#1757`); do not close the
  issue by hand — the radar closes it when the final active lane clears.
- After merge, dispatch `AoS 4 Rules Radar` with `source: all` (not report-only). Confirm the run
  posts a delta comment that clears the lane and that the new `bsData.baselineSha` appears in the
  managed issue body.
- Do not edit the managed issue body: it embeds the fingerprint state the alarm decision reads.
  The only reason to touch it is the issue-recovery path when an alarm was provably lost.
- Reproduce locally with `yarn data:aos4:radar:observe` / `observe-bsdata` / `radar --report-only`
  / `radar:notify` (mutation-free without `--notify-github`) when a run's artifacts are not enough.

## Worked reviews

| Date | Range | Outcome |
| --- | --- | --- |
| 2026-08-04 | `0d3eb56f` → `f6363c26` | Pinned files byte-identical at head; baseline advanced only (#1931) |
| 2026-08-18 | `f6363c26` → `301477a3` | Thundertusk Beastriders' Chilling Onslaught corrected; re-pinned, BSData raised to peer secondary (#1968) |
| 2026-08-25 | `301477a3` → `d7377e94` | Mawpit Hungry Sinkhole Declare corrected; `NON-*` constraint categories filtered; re-pinned (#1976) |
