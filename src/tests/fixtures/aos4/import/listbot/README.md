# Listbot import fixtures

The two checked-in text files are small format fixtures for the Listbot 4.0 decoder. For exhaustive
name-resolution coverage, generate the private all-units corpus:

```sh
yarn corpus:listbot
```

This writes one synthetic roster for every AoS 4 army, plus separate supplemental Listbot
catalogues, under `data/aos4/import-corpus/listbot/`. That directory is gitignored. Pass `--force`
to replace an existing generated corpus, or `--output <path>` to choose another location below
`data/aos4/import-corpus/`.

## Why this is programmatic

Listbot publishes its current desktop inventory in the read-only `/listbot/` page and a versioned
JSON snapshot at `/api/gamedata/`. The JSON snapshot includes Legends and supplemental catalogues
that are not selectable in the current desktop builder, but it can lag the desktop inventory.
The command therefore prefers the desktop data for live armies and uses the API only for those
additional catalogues. It:

1. retrieves the current page, API snapshot, and bracketing API version markers through the
   repository's HTTPS-only, public-IP-pinned acquisition layer;
2. checks the API version and faction/unit counts agree before and after retrieval;
3. decodes current inline data as bounded fields without evaluating provider JavaScript;
4. validates source-scoped identities and faction references against an explicit bridge of
   canonical faction IDs, Listbot API IDs, and current-page IDs; names are drift assertions only;
5. reconciles the one currently known page record attached to an unselectable faction through an
   explicit current-unit/API-unit ID binding and verifies that its composition has not changed;
6. records label drift between the current builder and versioned API;
7. matches every army in the checked-in AoS 4 catalog, including Legends armies;
8. emits every selected source unit entry exactly once and round-trips each roster through the real
   Listbot decoder;
9. runs each army roster through canonical resolution and records unresolved labels in
   `manifest.json`.

The generated rosters are intentionally illegal, over-points coverage inputs. They are not claimed
to be playable army lists.

## Content boundary

The raw provider response is cached only below `.cache/aos4/`. The roster projection retains the
composition fields needed to test imports: faction, battle formation, unit name, model count, and
points. Weapons, characteristics, abilities, and rule text are dropped before roster generation.

The manifest records source URLs, immutable SHA-256 checksums, byte lengths, the Listbot API
version, current/API drift, per-faction counts, generated-file checksums, and
canonical-resolution results. If Listbot drops a catalog army, changes either response contract,
returns an unexpected media type, or changes the API marker during retrieval, generation fails
closed. Additional provider catalogs are preserved as supplemental coverage. Output publication
rejects symlink/junction escapes and restores the previous corpus if an atomic replacement fails.
