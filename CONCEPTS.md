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

### Content Group
A named grouping of rules choices a faction offers — battle formations, spell/prayer lores, heroic traits, artefacts of power, and similar. Selecting a group brings its member abilities into the army.

### Battle Formation
An additive army-structure choice within a faction: the player picks one formation and gains its ability alongside the faction's regular rules. Contrast with Army of Renown, which replaces rather than adds.

### Army of Renown
An official army variant chosen at the top level, under the faction: picking one replaces the faction's regular rules wholesale with the variant's own battle traits, enhancements, and lores, and restricts the roster.
*Avoid:* sub-faction (the AoS 3-era term for the equivalent choice)

Choosing an Army of Renown grants its entire rules set at once — its battle traits apply automatically — while the faction's regular rules-choice groups become unavailable, including content visible through overlays. An explicit conflicting pick is surfaced as a diagnostic rather than silently discarded.

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

## Sourcing & Review

### Source Tier
The three-level authority hierarchy for rules facts: official Games Workshop publications are authoritative, Wahapedia is the preferred secondary, and community transcriptions (BSData) are an acceptable fallback only while an official publication establishes the content and the secondary does not yet carry it.

### Provisional Content
Rules text admitted from the community fallback tier, pinned to an exact upstream revision and visibly attributed as provisional. Provisional facts must be replaced or verified through the standard intake as soon as a preferred source publishes the content; official facts override every overlapping field while they live.

### Accuracy Campaign
The named review process that certifies an accepted corpus revision: an independent, checksum-bound comparison of every source record against the generated output, with blind interpretation sealed before comparison and any finding blocking acceptance until corrected. A passing campaign is what the beta gate binds to; changing any bound input starts a new campaign.

### Beta Gate
The fail-closed check binding the shipped runtime to a completed Accuracy Campaign. It fails on stale checksums, uncovered records, or unresolved findings, and it runs in deployment — a corpus change cannot ship without a fresh passing campaign.

## Flagged ambiguities

- "Endless Spells" had been read as an army — it is a source container for universal Manifestations; only factions that field units are playable armies.
- "Sub-faction" and "Army of Renown" had been used interchangeably — the settled term is Army of Renown (replaces the faction's rules); a Battle Formation is the additive within-army choice and is not a sub-faction.
