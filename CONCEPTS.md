# Concepts

Shared domain vocabulary for this project — entities, named processes, and status concepts with project-specific meaning. Seeded with core domain vocabulary, then accretes as ce-compound and ce-compound-refresh process learnings; direct edits are fine. Glossary only, not a spec or catch-all.

## Relationships

The army-building hierarchy, top to bottom — this structure is load-bearing for the whole product and deliberately mirrors the AoS 3 app's faction → sub-faction experience:

- A player picks exactly one **Faction**; everything below derives from it.
- Under the faction sits an optional **Army of Renown** — the modern equivalent of the AoS 3 sub-faction slot. Picking one *swaps out* the faction's regular rules set: its battle traits apply automatically, its enhancements and lores replace the faction's, and the regular choices (including Battle Formations) become unavailable. Leaving it at "None" plays the regular faction.
- A regular faction army then chooses one **Battle Formation** (additive: the faction's rules plus one formation ability) and picks from the faction's **Content Groups** — lores, heroic traits, artefacts. An Army of Renown army instead receives the variant's own granted content, with nothing else to mix in.
- **Warscrolls** (with their **Battle Profiles**) populate the roster in either shape; universal **Manifestation** lores remain available to both, because they belong to no faction.
- **Rules Contexts** cut across the whole hierarchy: every layer declares where it is legal, and **Overlays** widen what a given army can see without collapsing the partition.

The invariant to protect: additive choices (formations, lore picks) never displace faction rules; replacing choices (Armies of Renown) displace all of them at once. Blurring that line is how mutually exclusive rule sets end up applied together.

## Corpus & Rules Content

### Faction
A playable Age of Sigmar army a player can select to build a force. Not every decoded source faction is playable — a source may publish container rows that hold shared content without being selectable armies.

### Warscroll
The per-unit datasheet: a unit's characteristics, weapons, and abilities. Warscrolls belong to factions and are the unit-level building block of an army.

### Battle Profile
The matched-play record for a unit — unit size, points, base sizes, and roster notes. Kept distinct from the Warscroll because it comes from a different official publication cadence and only exists where the governing Rules Context defines points.

### Battle Profile Disposition
The reviewed verdict on what each extracted official profile fact is for: applied to the shipped runtime, kept as a structured reference the runtime does not serve, superseded by a later publication, or recorded as a profile-only gap where the profile exists but no rules text has been sourced yet. Every extracted fact carries exactly one, so a fact is never silently dropped — the ones that do not reach players are explained rather than absent.

### Content Group
A named grouping of rules choices a faction offers — battle formations, spell/prayer lores, heroic traits, artefacts of power, and similar. Selecting a group brings its member abilities into the army.

### Battle Formation
An additive army-structure choice within a faction: the player picks one formation and gains its ability alongside the faction's regular rules. Contrast with Army of Renown, which replaces rather than adds.

### Army of Renown
An official army variant chosen at the top level, under the faction: picking one replaces the faction's regular rules wholesale with the variant's own battle traits, enhancements, and lores, and restricts the roster.
*Avoid:* sub-faction (the AoS 3-era term for the equivalent choice)

Choosing an Army of Renown grants its entire rules set at once — its battle traits apply automatically — while the faction's regular rules-choice groups become unavailable, including content visible through overlays. An explicit conflicting pick is surfaced as a diagnostic rather than silently discarded.

Armies of Renown arrive through three publication flavors with identical semantics: the seasonal set (a free official document), battletome armies (one or two per battletome), and White Dwarf armies, which are Legends content and therefore appear under the overlay's Legends grouping. The same army can be a root under several factions (Big Waaagh!, The Duardin Ascendant), and an army may share its name with an unrelated regular content group of its faction (Lords of the Clan), so identity is the per-faction root, never the name.

### Regiment of Renown
A purchasable cross-faction bundle: a fixed set of units bought whole, offered to the factions its own rules name rather than to the faction whose page happens to carry it. Contrast with Army of Renown, which replaces a faction's rules; a Regiment of Renown adds units and is available by inclusion.

Availability comes only from the regiment's own inclusion list, never from the page it was found on — the carrying faction gains no claim on it, and does not become current merely by hosting a current regiment. Because the secondary source republishes the same regiment on every eligible faction's page, the duplicates are collapsed to one entity before acceptance; where the republished copies disagree, the majority text wins and the disagreement is recorded for review.

### Source-Marked Classification
The contract that a classification must agree with the secondary source's own machine-readable marking of the section — for Armies of Renown (a marker element on current sections, the replace-rules intro sentence on White Dwarf ones) and equally for Regiments of Renown (a nails header on the datasheet). Generation fails closed in both directions: a source-marked section without a reviewed classification blocks generation — newly published content can never silently decode as a generic content group — and a reviewed classification of an unmarked section is an invalid review.

The marking is derived metadata held outside the hashed record value, so adding or changing it never churns record identity.

### Manifestation
A summonable endless-spell-style unit belonging to a Manifestation Lore. Manifestations are a category of unit, not an army: universal lores are offered to every playable army rather than by any single faction.

### Rules Context
The partition of all rules content by where it is legal: current standard, the current seasonal handbook, Spearhead, Legends, and historical. Every entity and relationship declares the contexts it applies in, so parallel and retired rules never leak into each other.

### Overlay
An opt-in widening of an army's Rules Context: Legends and historical content is offered on top of the primary context, grouped so its provenance stays visible. Replacement effects (an Army of Renown's exclusions) must reach overlay content too, or retired choices resurface.

## Selection & Reminders

### Selection
The resolution of a player's explicit picks through the content graph: explicit choices expand into everything they include, and everything they offer becomes available to pick next. Illegal combinations surface as diagnostics rather than silent removals of what the player chose.

### Reminder
The product's output unit: one ability occurrence projected into the timing window where it fires, ordered by phase. Reminders derive from the selected army; hiding, notes, and ordering are player preferences layered on top.

### Rules-Demanded Choice
The test for whether something gets a builder card: the card exists only if the rules force the player to decide it. The AoS 3 app had a Spells selector because AoS 3 made each wizard choose one spell from the lore; AoS 4 removed that rule — picking a spell lore is the entire decision, and every wizard knows all of its spells — so the AoS 4 app deliberately has no individual-spell selector (settled 2026-08-01). A selector for a non-choice would mislead: deselecting a spell would look like the wizards no longer know it. Reminder decluttering belongs to hide preferences; spell provenance belongs to granting-source attribution.
*Avoid:* Spells card, individual spell selection

## Sourcing & Review

### Source Tier
The authority hierarchy for rules facts: official Games Workshop publications are authoritative, and Wahapedia and BSData are co-equal preferred secondaries whose rules text is accepted as fact. BSData was raised from fallback to peer by owner decision on 2026-08-18 (#1757), retiring the former three-level hierarchy. Official publications still win every conflict, and neither secondary supplies battle-profile values officialdom already provides.

### Provisional Content
Legacy vocabulary from the pre-2026-08-18 three-tier policy: rules text admitted from the community fallback tier, pinned to an exact upstream revision, visibly attributed as provisional, and obliged to be replaced or verified once a preferred source published it. BSData is now a peer secondary (see Source Tier), so nothing new is admitted on those terms; accepted entries keep the provisional wording only until the legacy tier vocabulary is flattened in code. Official facts override every overlapping field either way.

### Classification Evidence Tier
The evidence basis for a reviewed classification (today: Armies of Renown). The official tier cites an accepted official record naming the thing classified; the secondary-provisional tier rests on the secondary source's own explicit marking when no free accepted official document names it, with official records as optional corroboration. Distinct from Provisional Content: here the rules text is ordinary preferred-secondary content — only the *classification* awaits official naming, which verifies or corrects the entry when accepted.

### Accuracy Campaign
The named review process that certifies an accepted corpus revision: an independent, checksum-bound comparison of every source record against the generated output, with blind interpretation sealed before comparison and any finding blocking acceptance until corrected. A passing campaign is what the beta gate binds to. Changing any bound input starts a new immutable campaign, but the new campaign may retain an exact prior pair verdict when its semantic pair and reviewer bindings are byte-identical. The current inventory, concealed controls, execution record, manifest, and complete coverage gate are never inherited wholesale.

### Beta Gate
The fail-closed check binding the shipped runtime to a completed Accuracy Campaign. It fails on stale checksums, uncovered records, or unresolved findings, and it runs in deployment — a corpus change cannot ship without a fresh passing campaign.

### Rules Radar
The standing watch over the rules sources, which reports what changed upstream as evidence and never as acceptance — a hit starts the normal candidate intake, and nothing reaches the corpus because the radar saw it.

The radar keeps its own state between runs in a managed tracking issue, so each run reports against what the previous run already recorded. Observations divide into Material and Operational Events, and only the material ones raise a maintainer alarm.

### Material Event
A radar observation that shipped rules text may now be wrong: a source the corpus depends on actually changed. Its counterpart, an Operational Event, records trouble with the observation itself — a rate limit, a truncated comparison — and says nothing about whether the rules are correct.

The distinction is what makes the alarm trustworthy. Alarms key on material state alone, so operational churn cannot re-raise one, and an unchanged material state never re-sends. That deliberate at-most-once behavior has a cost worth knowing: the alarm has no natural redelivery, so anything that loses it between the recorded state advancing and the message arriving loses it permanently.

## Flagged ambiguities

- "Endless Spells" had been read as an army — it is a source container for universal Manifestations; only factions that field units are playable armies.
- "Sub-faction" and "Army of Renown" had been used interchangeably — the settled term is Army of Renown (replaces the faction's rules); a Battle Formation is the additive within-army choice and is not a sub-faction.
- "Provisional" covers two distinct states — Provisional Content (community-tier rules text awaiting a preferred source) and a secondary-provisional Classification Evidence Tier (preferred-secondary rules text whose classification awaits official naming). Say which one is meant.
