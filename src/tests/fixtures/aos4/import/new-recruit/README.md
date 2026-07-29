# New Recruit import fixtures

Real army lists exported from [New Recruit](https://www.newrecruit.eu/), captured in **all three
formats it exports** — `.ros`, `.rosz`, and `.json`.

Strategy: `docs/plans/2026-07-29-002-strategy-new-recruit-import-test-corpus.md`
Adapter: plan `2026-07-29-001` step **U4**.

## Why all three formats

The redundancy is the point. New Recruit's three exports are the same tree:

- `.rosz` is a single-entry zip containing a **byte-identical** `.ros`
- `.json` is a **mechanical transliteration** of the same XML — identical field names, `$text` for
  element text, numeric and boolean attributes typed

So every captured list carries a **self-checking oracle**: all three files must decode to the same
roster. That holds without any hand-authored expected value, and it held before the importer
existed. `src/tests/aos4/importFixtures.test.ts` enforces it.

## Layout

```
new-recruit/
  manifest.json          generated index — do not edit by hand
  lists/<id>/
    list.ros             as exported, byte-for-byte
    list.rosz
    list.json
    meta.json            provenance, composition counts, shapes covered, legality, sanitisation
    expected.json        curated goldens only — canonical IDs and expected diagnostics
  adversarial/           synthetic hostile inputs, each with its expected rejection
```

Naming: `<faction-slug>-<nnn>-<shape>`, e.g. `fec-001-ghb-kitchen-sink`.

## Invariants

Enforced for every list by `importFixtures.test.ts`:

1. `.rosz` is a single-entry, unencrypted zip whose payload is byte-identical to `.ros`, with no
   path-traversal entry names.
2. `.json` is an exact transliteration of `.ros`.
3. *(with U4)* all three formats decode to an identical normalized roster.
4. *(with U4)* decoding is deterministic across runs.

Plus: the manifest is current, every list has all three formats, `meta.json` composition counts
match the file's real contents, and no personal fields are present.

## Game legality is not checked

AoS Reminders turns a list into reminders; whether the list is *legal* is a list builder's and a
tournament organiser's concern. Fixtures deliberately include illegal compositions — over-points,
hero spam, undersize units, empty regiments — and they must **import cleanly, not warn**.

New Recruit's own `Illegal Units` and `Undersize Unit` category markers are structural
bookkeeping: the adapter discards them and never raises diagnostics from them. `fec-001` carries
both on purpose. Fail closed on *malformed or hostile files*, never on *illegal armies*.

## Adding a fixture

1. Build the list in New Recruit. Aim to exercise shapes the corpus is missing — check
   `manifest.json` → `coverage`.
2. Export all three formats from the list view.
3. `mkdir lists/<id>/` and save them as `list.ros`, `list.rosz`, `list.json`. **Do not reformat,
   re-zip, or pretty-print** — invariant 1 compares bytes.
4. Write `meta.json` (copy `fec-001`'s as a template). Composition counts are asserted, so get
   them right or let the test tell you what they are.
5. Run `yarn fixtures:new-recruit` to regenerate the manifest.
6. Run `yarn vitest run src/tests/aos4/importFixtures.test.ts`.

## Sanitisation

Audit every capture before committing. New Recruit's AoS 4 export carries no author, account,
email, or notes fields — `fec-001`'s audit found nothing to redact — but that is a property of the
current export, not a guarantee. The test asserts no `author`/`user`/`email`/`owner`/`player`/
`notes` keys appear.

If a capture ever does need redaction: redact the `.ros`, **re-zip it into the `.rosz`**, and
regenerate the `.json`, so invariants 1 and 2 still hold. Record what was redacted in
`meta.json` → `sanitisation.redactions`.

Lists sourced from tournaments or community submissions do **not** belong here. They live
uncommitted in `data/aos4/import-corpus/` with a provenance manifest, and run in a separate lane.

## Size

`fec-001` is 367 KB across three files — a 2500pt list where **42% of the bytes are ability rules
text the adapter must ignore**. Keep the committed set to lists that earn their place by covering
distinct shapes; breadth belongs in the uncommitted corpus.
