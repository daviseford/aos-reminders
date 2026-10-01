---
title: 'Regiments of Renown: inclusion-driven availability, cross-page dedup, and carrier-faction isolation'
date: 2026-08-02
category: architecture-patterns
module: aos4-corpus
problem_type: architecture_pattern
component: service_object
severity: high
applies_when:
  - 'Modeling purchasable cross-faction bundles (a regiment bought whole by factions that do not own its units)'
  - 'Keeping non-native datasheets through the Wahapedia native-faction filter'
  - 'Deduplicating content Wahapedia republishes on every eligible faction page'
  - 'Deciding which faction a kept datasheet copy may influence (contexts, offers)'
  - 'Dispositioning official battle-profile rows from structured-reference to applied'
symptoms:
  - 'Imported roster shows a Regiment of Renown’s units but never its regiment ability (#1858)'
  - 'No regiment-of-renown entities anywhere in the corpus despite the datasheets being in accepted artifacts'
  - 'A Legends faction suddenly gains the current rules context after keeping regiment datasheets from its page'
  - 'One regiment minted 26 duplicate entities, or two Wahapedia copies of the same regiment disagree on rules text'
root_cause: logic_error
resolution_type: code_fix
related_components:
  - 'src/aos4/data/wahapediaHtml/parse.ts'
  - 'src/aos4/data/wahapediaHtml/merge.ts'
  - 'src/aos4/generate/corpus.ts'
  - 'src/aos4/generate/officialBattleProfiles.ts'
  - 'data/aos4/reviews/corpus-2026-08-02b.json'
tags:
  [
    regiment-of-renown,
    inclusion-availability,
    cross-page-dedup,
    native-faction-filter,
    carrier-faction-isolation,
    corpus-generation,
    majority-variant,
  ]
---

# Regiments of Renown: inclusion-driven availability, cross-page dedup, and carrier-faction isolation

## Problem

Issue #1858: a Skaven list with Lord Skaldior's Chosen imported cleanly but the regiment's
IRONCLAD DESPOILERS passive never appeared in reminders. The corpus contained no Regiment of
Renown content at all — `filterNativeWahapediaFactionWarscrolls` kept only datasheets whose
keyword line names the owning faction, and a regiment datasheet has no keyword line (it is a
purchasable bundle, not a unit), so all ~450 copies across the 27 collection pages were dropped
and the 76 official regiment-of-renown battle-profile rows sat dispositioned
`structured-reference`.

## Structure of the fix (mirrors the Armies of Renown classification, #1844)

1. **Marker, not heuristics.** `parseDatasheet` marks a datasheet `regimentOfRenown` from its
   `•REGIMENT OF RENOWN•` nails header and captures the INCLUSION faction list and ORGANISATION
   member links, all outside the hashed record value (`recordChecksum = sha256(JSON.stringify(value))`,
   `parse.ts:62`) so identity is unchanged. The native filter
   keeps marked sheets; generation fails closed (`unclassified-regiment-of-renown`) until a
   reviewed `regimentsOfRenown` entry covers each kept record, in both directions.
2. **Dedup before merge, by name, majority variant wins.** Every collection republishes each
   regiment its faction may include (Lord Skaldior's Chosen appears on six pages; Stumblefoot
   Gargant on 26). `dedupeWahapediaRegimentOfRenownPages` compares copies as normalized text
   (tooltip ids differ per page), keeps the most-republished variant's smallest source URL, and
   emits a `regiment-of-renown-variant` warning for real cross-page rules drift — Wahapedia
   shipped `INFANTRY` vs `non-INFANTRY` disagreements for Sky-Port Profiteers and Volt-Klaw's
   Enginecoven with no official arbiter in the accepted set. The warning lands in the reviewed
   `expectedWarnings` gate, so drift can never pass silently.
   The majority is a count of pinned pages, not of correctness. Re-pinning a single faction's pages
   brings that page's copy of every regiment it carries, and it can be the only copy that matches
   the current official text: after the 2026-09-30 Ossiarch Bonereapers re-pin (#2037) its Big
   Drogg Fort-Kicka matched official Regiments of Renown - Sons of Behemat page 4 word for word,
   yet seven stale pinned copies outvoted it. Before raising `expectedWarnings`, check each new
   variant against the official pack and battle-profile row, and record a stale winner as a gap.
   A regiment with one copy on the re-pinned page and none elsewhere is new to the corpus (it needs
   a reviewed `regimentsOfRenown` entry, as Urrgar's Maulerguts did), and a regiment already
   shipped from BSData stops generation (`duplicate-regiment-of-renown-source`) until one source is
   retired; Krong the Club moved to the page and kept its canonical ids by alias.
3. **Availability comes from INCLUSION, never from the carrier page.** The merge derives
   `regimentOfRenownFactions` availability records from the datasheet's INCLUSION block; the
   existing regiment-availability machinery then emits `offers` edges from exactly those
   factions. The kept copy's own page faction must be suppressed everywhere: the regiment's home
   faction is often not allowed to take it (Slaves to Darkness cannot field Lord Skaldior's
   Chosen), and in `sourceRulesContextIds` the regiment must not feed the carrier faction's
   contexts — the first cut let Bonesplitterz (Legends-only) reacquire the current context just
   because current regiments sit on its page, which `catalogIntegrity` caught as a 26→27
   universal-lore offering change.
4. **Members are `includes` edges resolved by collection anchor, then by unique name.** ORGANISATION
   links resolve against the kept pages' anchors; when the linked page never carries the anchor
   (Wahapedia points the Outlaw Cogfort links at the Cities of Sigmar collection, which publishes
   no Outlaw datasheet), exactly one kept datasheet with the member's name resolves the link
   (#2030). A member with no accepted datasheet still surfaces as a
   `regiment-of-renown-member-missing` warning instead of a silent or invented edge. Selecting the
   regiment therefore also selects its member warscrolls, exactly like a roster purchase. A group
   with no member and no ability chain loses every `offers` edge to the content-free prune — silent
   in the UI, which is how the two Cogfort regiments vanished (#2030). Some regiments print an
   ORGANISATION line as plain text with no link (Gotrek Gurnisson, Mask of the Deceiver, Heroes of
   The Jade Abbey, The Sorrowmourn Choir); the adapter keeps those as name-only members, which
   resolve only onto a reviewed regiment-only adoption. Gotrek's warscroll has no faction keyword,
   so it needed one, adopted from the Fyreslayers page because a same-page adoption would share
   the reviewed Cities of Sigmar regiment copy's anchor-derived source identity (#2047). To find
   this class, list regiment groups with no `includes` edge to a warscroll.
5. **Official rows flip to applied by name, with reviewed spelling maps.** The 74 rows whose
   classified runtime group exists become `applied-to-runtime`;
   `officialProfileName` entries carry the two official spellings that differ from Wahapedia's
   (`Big Drogg Fort-kicker`, `The Scions of the Necropolis`); Okar's Torrbad and Urrgar's
   Maulerguts stay `structured-reference` because Wahapedia does not yet carry their rules
   (official Ogor RoR PDF is in the accepted artifacts — future intake path), and Heroes of The
   Jade Abbey ships `secondary-provisional` + a Legends context override because no current
   official row names it.

## Why no UI change was needed

`army_builder.tsx` already carried a `regiment-of-renown` card title (AoS3 parity); the builder
derives cards from `groupType`, so classified regiments surfaced as a working selector the moment
the data existed. Import wiring (resolving the roster's bundle header line) was the deliberate
follow-up phase of #1858 and shipped in PR #1872 — see the bundle-line resolution at
`src/aos4/import/resolveRoster.ts:633-741`.
