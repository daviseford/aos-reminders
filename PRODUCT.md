# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: Warhammer: Age of Sigmar fourth-edition players**, in two distinct situations that the
application models explicitly as Edit and Play mode.

- **Preparing, at home, on a desktop or tablet — Edit mode.** The player selects a faction and
  builds or imports an army, then curates the resulting reminders: hiding rules they already know,
  adding notes, reordering within a phase, and exporting a PDF. Time is not scarce. The job is to
  arrive at the table with a sheet that says only what they need.
- **Playing, at the table, on a phone — Play mode.** Mid-game, one hand on the phone, dice in the
  other, an opponent waiting on them. Play mode strips the builder and toolbar and filters out
  hidden reminders. The job is to find what fires in the current phase, immediately, without
  reading past anything they already decided was noise.

**Secondary: subscribers.** The paying tier. They reach the same screens plus cloud armies,
sharing, and dark theme, and they are the audience for whom incorrect claims on `/subscribe` are a
refund-and-trust problem rather than a copy defect.

**Secondary: players using assistive technology or with motor impairments.** The reminders screen
renders roughly 39 reminders and 24 collapsible cards on the default army, so every repeated
control multiplies any interaction defect by that factor.

## Product Purpose

AoS Reminders turns an Age of Sigmar army configuration into phase-ordered reminders, so a player
never forgets an ability they own during the turn it applies.

The product resolves a specific army's selections against a canonical rules corpus, projects the
abilities those selections grant into discrete reminder occurrences, and orders them by the window
in which they fire — deployment, each of the seven turn phases, round boundaries, reactions, and
phase-independent effects.

**Success for the current stretch of work is Phase 2 modernization to launch-ready**: package and
framework upgrades, and closing the subscription-API authorization gap that blocks production
launch, so the `aos4-migration` branch can merge to `master`. Phase 1 (data and domain correctness)
is complete and machine-verified for beta.

## Positioning

**Phase-ordered projection from your own list.**

Neighbouring products in this space are rules databases (Wahapedia, the official Warhammer app) or
list builders (Listbot, New Recruit). Both answer "what does this rule say?" and require the player
to already know which rule to look for.

AoS Reminders answers a different question: *what fires now, for the army I actually brought?* It
computes the set of abilities a specific configuration grants and orders them by when they happen
in a turn. That makes it usable during play rather than as a lookup between turns — and it is a
mechanism a rules database cannot truthfully copy without also modelling army composition, and a
list builder cannot copy without also modelling rules timing.

Roster imports reinforce rather than dilute this: rosters from other tools are *inputs*, never
rules authorities.

## Operating Context

- **A physical tabletop game.** The usage scene is a table with terrain, models, and dice, an
  opponent, and often a tournament round clock. Attention is contested and interruptions are
  constant.
- **The turn structure is the organising principle**, not the product's own information
  architecture. Reminders are grouped by the game's windows because that is the order the player
  encounters them.
- **The roster is usually built elsewhere.** Players commonly arrive with a list already made in
  the official Warhammer app, Listbot 4.0, or New Recruit, and import it rather than rebuilding it.
- **Paper is a real output.** Many players print the reminders or export a PDF and use that at the
  table instead of a screen — phones die, and some venues discourage them. Print is a supported
  output path with its own layout engine, not a browser afterthought.
- **Connectivity is unreliable.** Game venues and tournament halls have poor signal. The
  application is a PWA with a service worker, keeps the army document in `localStorage`, and never
  fetches rules data at runtime — the corpus is checked in and shipped with the bundle.

## Capabilities and Constraints

### Confirmed capabilities

- Faction selection across all 28 decoded factions, and a builder covering warscrolls and content
  groups (battle formations, artefacts of power, spell/prayer/manifestation lores, regiments of
  renown).
- Reminder projection grouped by timing window, with per-reminder hide/show, free-text notes, and
  drag reordering within a group.
- Source attribution per reminder, badged `Official` for Games Workshop records and linked where a
  source URL exists.
- Browser print and jsPDF export with standard and compact presets, A4 and Letter.
- Roster import from official Warhammer app text, Listbot 4.0 text or file upload, and New Recruit
  `.ros`/`.rosz`/`.json`.
- Auth0 authentication; cloud armies and army sharing against an Auth0-authorized API.
- Subscription via Stripe and PayPal, gift subscriptions, and redemption.
- Light and dark theme, persisted per account.
- An opt-in Legends overlay (`allowsLegends`) applied on top of the document's rules context.

### The free and paid boundary is a durable product fact

Preserve it; do not change it as a side effect of other work.

- **Free**: faction selection, the builder, reminders, hide/show, notes, reordering, roster import,
  browser print, and PDF export.
- **Requires an active subscription** (`useSubscriberAction` routes an unauthenticated user to
  login, then a non-subscriber to `/subscribe`): cloud armies (`My Armies`), army sharing, and dark
  theme.

### Durable constraints

- **AoS 4 is a hard cutover.** No AoS 3 rule, timing, phase, category, alias, importer correction,
  fixture, or data shape is evidence for an AoS 4 decision, and no AoS 3 module may be restored to
  make a feature convenient. A temporarily incomplete AoS 4-only app is preferable to parallel live
  rule models.
- **The live application at `https://aosreminders.com/` is the interaction baseline.** The
  community trusts that experience, and the data migration does not authorize a redesign. Treat any
  interface change the user did not explicitly ask for as a code smell. Data-driven changes — phase
  names, content-group cards, reminder text — are the expected exception.
- **Source precedence**: Games Workshop publications are authoritative; Wahapedia exports and
  bounded faction pages are the preferred secondary discovery source; other community sources may
  identify gaps but never silently override official material. Preserve discrepancies rather than
  resolving them silently.
- **The runtime never fetches rules source data.** It loads checked-in generated artifacts only.
  Acquisition and reconciliation stay out of React components.
- **Generated data is never hand-edited.** Corrections go through the candidate → review → accept →
  generate pipeline, including corrections prompted by beta feedback.
- **Names are display text, never durable identity.** Everything resolves through stable canonical
  IDs.
- **A push to `master` deploys production.** Migration work targets `aos4-migration`; merging or
  pushing `master` requires explicit authorization.

### Known blocker

**Production launch is blocked on subscription-API authorization.** The restored subscription API
uses a public shared browser key and does not verify the user's Auth0 token or derive account
ownership server-side. An Auth0-protected route is not API authorization. Launch requires
server-side bearer-token verification, server-derived ownership, rejection of cross-account access,
key rotation, and passing negative authorization tests. Do not describe the subscription API as
secure. The separate army/share API (`src/api/armyApi.ts`) does send the user's Auth0 bearer token
on every account operation.

### Terminology

Warscroll, battle profile, content group, ability, rules context, window, phase, reminder
occurrence, Legends, Spearhead, General's Handbook 2026-27 (`Scourge of Aqshy`). "AoS 4" is the
2024 game edition and is unrelated to the application version in `package.json`.

## Brand Commitments

- **Name**: AoS Reminders. Authored by Davis E. Ford (`daviseford.com`), credited in the masthead.
- **Unofficial and fan-made.** The Games Workshop disclaimer appears on every page and must stay:
  the tool is in no way endorsed or sanctioned by Games Workshop, and takes no credit for Games
  Workshop content. The product must never adopt an official Games Workshop voice or identity.
- **"Powered by Wahapedia" attribution** is required for published features derived from the
  Wahapedia exports.
- **Voice**: plain, direct, second person. Controls are named as verbs and nouns (`Clear Army`,
  `Download PDF`, `Show Hidden`). No marketing cadence in the product surface.
- **Provenance is a product commitment, not a footnote.** Reminders carry their source and mark
  official records as such.
- **Community**: Discord, and GitHub Issues on `daviseford/aos-reminders` as the sole issue
  tracker.

## Evidence on Hand

- **The accepted corpus** `aos4-corpus-2026-07-28`: 28 decoded factions, 1,268 warscrolls, 1,002
  battle profiles, 4,850 abilities, 2,247 weapons, 1,402 content groups, and 19,057 live source
  records. Checked in under `src/aos4/generated/corpus/`.
- **A beta certification** binding that corpus to a complete machine review — 79,446 results across
  39,723 source/generated pairs, zero live findings, zero `cannot-verify` outcomes. Verifiable
  offline via `yarn data:aos4:verify:beta`.
- **An official battle-profile ledger** dispositioning all 1,350 extracted Games Workshop facts,
  with 12 profile-only gaps left deliberately visible rather than filled by invention.
- **A byte-pinned New Recruit import fixture corpus**
  (`src/tests/fixtures/aos4/import/new-recruit/`), captured from opted-in accounts and
  self-checking across all three formats.
- **A mobile and accessibility audit**, `docs/design/2026-07-28-mobile-accessibility-audit.md`
  (score 11/20). Most of its P0 and P1 findings have since been fixed; treat it as history and
  re-run an audit before relying on the score.

**Absences that future work must not fabricate**: there are no testimonials, no case studies, no
press, no usage or subscriber metrics, and no benchmark data. Nothing in this repository supports a
claim about how many people use the product or how well it performs against alternatives.

## Product Principles

1. **The table is the hard case.** Design and scope for a phone, one-handed, mid-turn, with an
   opponent waiting — before designing for the desktop builder. Anything that costs time or
   attention at the table is a real cost; anything that only reads well in a screenshot is not a
   real benefit.

2. **Continuity outranks improvement.** The live site is the baseline the community trusts. Fix
   defects, preserve the experience, and let the user ask for change rather than inferring it.
   When a correctness fix has a visible consequence, choose the variant that preserves current
   behavior, state the delta, and let the user accept it.

3. **Say only what is true, and show where it came from.** Every user-facing claim must match what
   the application ships today, and every rule must be traceable to an accepted source. Stale copy
   on a paid surface is a blocking defect. Never invent a fact to fill a gap — record the gap.

4. **Correctness flows through the pipeline, never around it.** Rules mistakes are fixed by
   acquiring, reviewing, and accepting a new candidate, not by patching generated data or
   hard-coding an exception in the interface.

5. **Reminders belong to the game's structure, not the product's.** Grouping, ordering, and naming
   follow Age of Sigmar's phases and timing windows, because that is the order the player meets
   them. The product does not impose an information architecture of its own.

## Accessibility & Inclusion

- **Target: WCAG 2.2 AA**, treated as a correctness requirement rather than an enhancement.
- **Target size (2.5.8) is a first-class concern.** The primary usage scene is a phone held in one
  hand while the other holds dice, so controls are sized by the finger, never by the icon.
- **Defects multiply.** The reminders screen repeats its controls dozens of times per army, so a
  single per-reminder interaction defect is dozens of failures for a keyboard or screen-reader
  user.
- **Prefer the native element** — a real `<button>`, `<fieldset>`/`<legend>`, `<main>` — over ARIA
  applied to a `div`. The native fix is usually the one that also renders identically, which is
  what the continuity constraint requires.
- **Motion is minimal by design** and should stay that way; the product has no motion-heavy
  surfaces to reduce.
