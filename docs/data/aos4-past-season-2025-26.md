# General's Handbook 2025-26 as a past season (#2042)

This records the Stage 0 source audit behind the `past-season` rules context
`rules-context:90000000-0000-4000-8000-000000000005` ("Age of Sigmar Fourth Edition General's
Handbook 2025-26 (Past Season)", battlepack `Scourge of Ghyran`, `validTo 2026-07-05`), what the
context contains, and what it deliberately does not.

## What the context is

An **approximate** season: General's Handbook 2025-26 content (the Scourge of Ghyran unit variants,
battle formations, enhancement tables, lores, and the handbook's own rules) paired with **today's**
warscrolls, battletomes, points, unit sizes, and regiment options. It is not a reconstruction of
the game as it stood on a 2025-26 date. No accepted source records in-season points or warscrolls:
the earliest pinned Battle Profiles is the 2026-27 launch edition, and the warscroll pages were
retrieved after the season. Every surface that offers or shows the context says so
(`pastSeasonCaveat` in `src/aos4/view/pastSeason.ts`).

## Stage 0 audit (baseline `aos4-corpus-2026-09-30`)

The historical context held 685 entities. Classified by the source records behind them:

| Cohort | Entities | Evidence |
| --- | ---: | --- |
| 2025-26 Scourge of Ghyran | 586 (263 abilities, 42 warscrolls, 42 battle profiles, 76 weapons, 113 content groups, 50 publications) | Wahapedia faction-page blocks under a Scourge of Ghyran source title or name (the only way the decoder assigns the historical kind on a faction page), the Wahapedia `general-s-handbook-2025-26` rules page, 16 reviewed context overrides citing an official Scourge of Ghyran pack (Ossiarch Bonereapers, Sons of Behemat), and the 26 official Scourge of Ghyran documents |
| 2024-25 handbook | 41 (21 abilities, 20 content groups) | the Wahapedia `general-s-handbook-2024-25` rules page only |
| Retired after the season | 4 (Stumblefoot Gargant) | context overrides citing the September 2026 Battle Profiles (page 59, `DELETED`) and Rules Updates (page 31) |
| Shared, multi-context | 53 | core rules, faction rows, export metadata, Quick Start / Rules Updates / Core Rules publications |
| Other | 1 (Red Gobbo Battleplan) | a standalone December 2025 Grotmas battleplan, not part of the handbook |

The 2025-26 and 2024-25 cohorts separate by source URL alone, with no judgement call.

### Official coverage

The accepted manifest pins 24 official Scourge of Ghyran faction packs plus "Using the Scourge of
Ghyran Rules" (all `games-workshop-pdf/1`, SHA-256 in the review's `officialDocuments`; Last-Modified
2025-05-05 to 2026-04-27, so the latest revisions, not necessarily each pack's first printing).
Every Wahapedia-derived 2025-26 formation, lore, enhancement table, and variant warscroll was found
by name in its faction's pack text. The 19 packs that print battle formations match the 19 factions
with Scourge of Ghyran formations in the catalog; the six without (Fyreslayers, Kharadron
Overlords, Lumineth Realm-lords, Maggotkin of Nurgle, Seraphon, Stormcast Eternals) have none in
the catalog either. Beasts of Chaos, Bonesplitterz (Legends armies) and the Endless Spells container
have no pack and no season content.

### Gaps found

- **Daughters of Khaine** had three official 2025-26 groups (Arena Veterans, Coven Zealots,
  Bloodshadow Rites) that no army could reach, even through the historical overlay: the faction
  has no Scourge of Ghyran warscroll, and faction context membership follows its warscrolls. In the
  past season the faction's standard warscrolls carry it there, so the three are offered.
- **Stumblefoot Gargant** was deleted by the September 2026 Battle Profiles, after the season.
  No accepted source shows it on an in-season official list, so it stays historical only; a
  2025-26 army still reaches it through the historical overlay, as before.
- **Wahapedia's "Bendictions of Sickness"** misspells the Scourge of Ghyran Maggotkin lore the
  official pack prints as BENEDICTIONS OF SICKNESS. A reviewed import alias scoped to past-season
  contexts maps the correct spelling; the 2026-27 lore of that name keeps its own verbatim match.
- The September 2026 Rules Updates page 22 erratum giving `SACRED RITES` a chanting value of 2
  remains a recorded gap (no accepted text source carries it), as it was before.

## How the boundary is generated

`CorpusReview.pastSeasonContexts` names, for each past-season context, the Wahapedia URL prefixes
whose historical-kind records belong to it: `https://wahapedia.ru/aos4/factions/` and
`https://wahapedia.ru/aos4/the-rules/general-s-handbook-2025-26/`. Generation adds the past season
to those records and keeps `historical` on them ("add, don't move"), so documents saved with the
historical overlay resolve exactly as they did. The Wahapedia decoder is unchanged, so no record
checksum moves. Standard content (current warscrolls, battletomes, Battle Profiles, core rules,
BSData standard records) joins every standard season, sitting or past. The 2026-27 `seasonal` kind
stays seasonal only. Context overrides are explicit: the 16 citing a Scourge of Ghyran pack name
the past season, and Stumblefoot Gargant's do not.

`src/tests/aos4/pastSeason2025.test.ts` pins the boundary: nothing from 2026-27 or 2024-25, every
standard entity present, every season-only entity also historical, and the pack scoping.

## Import and builder behaviour

- A roster declaring "General's Handbook 2025-26", "GHB 2025-26", or "Scourge of Ghyran" imports into
  the past season with the historical overlay on (for anything retired later). 2024-25 and older,
  and unknown seasons, fall back to the sitting season as before. A Legends-only army still moves to
  Legends; the past season is never chosen for a roster that did not declare it.
- The import preview lists the past season after the everyday rulesets and shows the caveat.
- In edit mode the masthead's "Seasonal rules" select offers "General's Handbook 2026-27 (current
  season)", "General's Handbook 2025-26 (past season)", and "None: battletome and core rules only",
  derived from the catalog's standard contexts by status. It replaced the earlier seasonal switch
  and past-season link. A past-season army shows the caveat beneath the select, and the season's
  name and caveat in play mode. Every move changes only `rulesContextId`.
- Existing documents are not migrated.

Across the 448 checked-in import fixtures, the 253 that declare 2025-26 move to the past season and
lose the superseded-season warning. 35 picks those rosters used to resolve to the 2026-27 (Scourge
of Aqshy) entity of the same name (Glamourweave, Cosmopolitan Leader, Vulkyn Gifts, Thickened
Scales, Immortal Ego, Big 'Un, Benedictions of Sickness) now resolve to the 2025-26 one, and 13 picks
that failed (8 Daughters of Khaine formations and lores, 5 Blades of Khorne Frenzied Taskmaster
enhancements that were ambiguous) now resolve. The New Recruit, Listbot, and every non-2025-26
roster resolve byte-identically. Nine Lumineth rosters now
report "Flawless Commander" as ambiguous: the battletome's Facets of Brilliance and the Scourge of
Ghyran Aspects of Enlightenment heroic-trait tables both print one, with different rules, and the
roster does not say which table was used. The owner chose to keep this warning rather than guess
(the one agreed exception to #2042's "no new warnings"). The warning names both tables and asks the
player to pick the one their list used; the builder offers each as a Heroic Traits option (the
season's under the General's Handbook 2025-26 header). There is no picker inside the import dialog.

## Future seasons

Whether a lapsed season stays selectable is policy outside #2042. When 2026-27 lapses, its
`seasonal` records need the same treatment, and the decoder's `historical` kind will then span two
seasons' faction content; the URL-prefix boundary above would have to be narrowed at that point.
