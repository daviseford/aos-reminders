# Sigdex import fixtures

Real text exports captured from the deployed Sigdex app (https://sigdex.io/), one list per army
(all 27 selectable armies, including the Legends factions Beasts of Chaos and Bonesplitterz), plus
one minimal list built entirely through the app UI and one synthetic list in the older
GitHub-main serializer shape.

Capture method (2026-07-31, App Version 22.1.0 / Server Version 3.0.58): lists were authored in
the deployed app (the first via the full create/builder UI; the rest written into the app's own
localStorage store in its exact SuperJSON shape, using unit/formation/lore names read from the
app's own IndexedDB game data), then each export was harvested from the app's own export view —
so every capture is serialized by the real deployed exporter.

Facts these captures pinned that the synthetic fixture missed:

- the deployed footer is `Created with Sigdex: sigdex.io` (not the full URL) and includes a
  `Server Version:` line;
- lore and formation rows may carry `(Scourge of Aqshy)` context qualifiers and points suffixes;
- unit names may carry `(Scourge of Aqshy)` variant qualifiers;
- a list with no formation selected emits a blank line where the formation row would be.

The harness (`src/tests/aos4/importSigdex.test.ts`) asserts every list decodes with no
diagnostics and resolves against the accepted catalog with **no error diagnostics**; warnings
(Legends content without opt-in, provider names our corpus lacks) are collected into a printed
histogram, mirroring the New Recruit corpus harness. Community-donated captures are welcome under
the same layout: `lists/<faction-slug>-<nnn>-<shape>/list.txt`.
