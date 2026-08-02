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
   member links, all outside the hashed record value so identity is unchanged. The native filter
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
3. **Availability comes from INCLUSION, never from the carrier page.** The merge derives
   `regimentOfRenownFactions` availability records from the datasheet's INCLUSION block; the
   existing regiment-availability machinery then emits `offers` edges from exactly those
   factions. The kept copy's own page faction must be suppressed everywhere: the regiment's home
   faction is often not allowed to take it (Slaves to Darkness cannot field Lord Skaldior's
   Chosen), and in `sourceRulesContextIds` the regiment must not feed the carrier faction's
   contexts — the first cut let Bonesplitterz (Legends-only) reacquire the current context just
   because current regiments sit on its page, which `catalogIntegrity` caught as a 26→27
   universal-lore offering change.
4. **Members are `includes` edges resolved by collection anchor.** ORGANISATION links resolve
   against the kept pages' anchors; a member with no accepted datasheet (the two Cogfort crews)
   surfaces as a `regiment-of-renown-member-missing` warning instead of a silent or invented
   edge. Selecting the regiment therefore also selects its member warscrolls, exactly like a
   roster purchase.
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
the data existed. Import wiring (resolving the roster's bundle header line) is the deliberate
follow-up phase of #1858.
