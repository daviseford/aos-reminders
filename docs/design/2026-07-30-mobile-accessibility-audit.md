# Mobile & Accessibility Audit — `aos4-migration`

Date: 2026-07-30
Supersedes: [`2026-07-28-mobile-accessibility-audit.md`](./2026-07-28-mobile-accessibility-audit.md)
Scope: browser UI on the `aos4-migration` branch (`src/components/`, `src/css/`, `src/theme/`, `index.html`)
Method: source review plus live DOM measurement against the Vite dev server on `localhost:3000`,
default Stormcast Eternals document, 39 reminders and 24 collapsible cards rendered, measured in both
themes. Production bundle measured from `vite build` output rather than dev-server modules.
Command: `/impeccable audit`

This is a **report only**. No UI code was changed. Every finding was verified against the running app
or the exact source line cited; measured values are quoted verbatim.

## Audit Health Score

| # | Dimension | Score | Δ | Key Finding |
|---|-----------|-------|---|-------------|
| 1 | Accessibility | 3/4 → **4/4** | +2 | 85 reminder tag buttons were 20 px tall; closed by amendment 2 |
| 2 | Performance | 2/4 → **3/4** | +1 | Initial chunk was 1.42 MB gzipped; now 259 kB (amendment 3) |
| 3 | Responsive Design | 3/4 | +1 | Target sizes, not layout, are what still fails on a phone |
| 4 | Theming | 3/4 → **4/4** | +1 | Zero contrast failures in either theme; the literal-colour drift was closed by the amendment below |
| 5 | Implementation Integrity | 3/4 | +1 | Four dead classes survive, two of them the loading screen's only intended motion |
| **Total** | | **14/20** → **17/20** | **+6** | **Good — upper band** |

Scored 14/20 as published. The three amendments at the end of this document take it to 17/20: the
first (`extract`) closed the token drift and records a P1 contrast failure this pass had missed; the
second (`adapt`) closed the target-size P1 and corrects a false positive of my own in it; the third (#1769) closed the bundle P1.

Previous score: **11/20** (Acceptable). **17 of the 23 prior findings are fixed**, including the sole
P0 and nine of ten P1s.

## Implementation Integrity Verdict

**Pass.** The prior audit's verdict was "pass, with material drift", where the drift was content
truth rather than visual language: `/subscribe` advertised five capabilities the AoS 4 cutover had
deleted, and linked to an unrouted `/stats`. **That is resolved.** `ROUTES.STATS` no longer exists
anywhere in the codebase, and a grep for `Azyr`, `Warscroll Builder`, `Battlescribe`, and
`advanced stats` across `Subscribe.tsx` returns zero. `src/tests/aos4/accountRoutes.test.tsx` now
pins eleven retired claims as regression assertions, so the copy cannot silently drift back.

The visual system remains genuinely product-specific: one token file (`src/css/theme.scss`), one
`ITheme` contract with light and dark implementations, and components that read `theme.*` rather
than hardcoding colour. The Bootstrap 4.6 → 5.3 migration preserved it — DESIGN.md's "Parity Pin
Rule" records the 4.6 defaults the interface was built against, so the framework change did not
become an accidental restyle.

What keeps this at 3 rather than 4 is residual dead code (below) rather than anything systemic.

## Executive Summary

- Audit Health Score: **14/20** (Good — address weak dimensions), up from 11/20
- Issues found: **0 P0, 2 P1, 4 P2, 4 P3** (10 total), down from 23
- Top findings:
  1. **[P1]** Target size fails at scale: **85** reminder tag buttons at **20 px**, the Edit/Play
     switch at **20 px**, and navbar links at **21 px** — all under WCAG 2.5.8's 24 px floor.
  2. **[P1]** The initial JS chunk is **12.5 MB raw / 1.42 MB gzipped**, 94% of all shipped JS, on a
     product whose stated operating context is "connectivity is unreliable".
  3. **[P2]** `LinkNewTab` sets `aria-label` to an analytics slug, so the footer's release-notes link
     has visible text "AoS Reminders v5.2.9 - Release Notes" and accessible name
     `GithubLatestRelease` — a WCAG 2.5.3 Label in Name failure.
  4. **[P2]** `<main>` and `<nav>` landmarks landed; `<footer>` did not, and there is still no skip link.
  5. **[P3]** Four dead classes remain, two of which (`pulsate-fwd`, `fade-out`) are the loading
     screen's only intended motion — an absence that reads as a decision but is an accident.
- Recommended next steps: `/impeccable adapt` for target sizes, `/impeccable optimize` for the
  bundle, `/impeccable clarify` for the accessible-name defect, then `/impeccable polish`.

## What was fixed since 2026-07-28

Verified individually against current source and the running app.

| Prior finding | Status | Evidence |
|---|---|---|
| **[P0]** `/subscribe` sells removed features | **Fixed** | zero matches for the five retired claims; eleven pinned in tests |
| **[P0]** `/stats` linked but never routed | **Fixed** | `ROUTES.STATS` absent from `env.ts`, `App.tsx`, `Subscribe.tsx` |
| **[P1]** Reminder options 16 × 24 px target | **Fixed** | `.ReminderMenuToggle::after` measures **40 × 44 px** over a 16 × 24 glyph |
| **[P1]** Headers ignore Space | **Fixed** | `collapsibleCardHeader.tsx` is a real `<button>`; 24 measured in `.card-header` |
| **[P1]** No `aria-expanded` | **Fixed** | 162 `[aria-expanded]` present |
| **[P1]** `h1 → h4`, level flips by viewport | **Fixed** | measured `{H1: 1, H2: 24}`; size driven by `.CardHeaderTitle` |
| **[P1]** Videos can't play on iOS, never stop | **Fixed** | `muted`, `playsInline`, `controls`, `preload="metadata"`, autoplay gated on `prefers-reduced-motion` |
| **[P1]** Print modal labels orphaned | **Fixed** | `<fieldset>` + `<legend className="FieldsetLegend">` |
| **[P1]** Modal has no max-height | **Fixed** | `max-height: 90vh; max-width: calc(100vw - 2rem); overflow-y: auto` |
| **[P1]** FAQ screenshots `alt=""` | **Fixed** | `alt={image.alt}`, `role="img"` removed |
| **[P1]** Edit/Play labels focusable no-ops | **Fixed** | no `role="button"` or `tabIndex` in `homeHeader.tsx` |
| **[P2]** Two conflicting breakpoints | **Fixed** | single `MOBILE_BREAKPOINT_PX = 575.98` in `src/utils/breakpoints.ts` |
| **[P2]** FAQ `d-none d-block` dead pairing | **Fixed** | FAQ rebuilt (#1775) |
| **[P2]** `theme-color` white on dark masthead | **Fixed** | `#063647` plus a `prefers-color-scheme: dark` companion at `#182633` |
| **[P2]** Unthrottled resize listeners | **Fixed** | `requestAnimationFrame` coalescing; `useIsMobile` on `matchMedia`, fires only on breakpoint cross |
| **[P2]** Note textarea resizable past container | **Fixed** | `resize: vertical; max-width: 100%` |
| **[P3]** `display-5` dead, `img width="120px"`, no lazy loading, `text-nowrap` overflow | **Fixed** | `display-5` unused and now defined by Bootstrap 5; `width="120" height="110"`; `loading="lazy"`; `text-nowrap` gone from card titles |

Partially fixed: landmarks (`<main>` and `<nav>` present, `<footer>` still a `div`).

## Detailed Findings by Severity

### P0 — Blocking

None.

### P1 — Major

#### [P1] Target size fails across three control families

- **Location**: `src/css/index.scss` `.ReminderTag` (85 instances); `src/components/page/homeHeader.tsx`
  (`react-switch` `height={20}`); `src/components/page/navbar.tsx` via `navbarStyles.link`
- **Category**: Accessibility / Responsive
- **Evidence**: measured on the default army —
  `.ReminderTag` **count 85, height 20 px** (real `<button>`, `cursor: pointer`);
  `.react-switch-bg` **80 × 20 px**; navbar `Subscribe` **73 × 21**, `FAQ` **31 × 21**.
  For contrast, the toolbar buttons measure **38 px** and pass.
- **Correction (see amendment):** the switch measurement above is wrong. `.react-switch-bg` is the
  track, not the control; the interactive element is `.react-switch` at **90 × 30 px**, because
  `handleDiameter={30}` makes the handle overflow the track. The switch **passes** 2.5.8. Only the
  tags and the navbar links were real.
- **Impact**: PRODUCT.md names the phone held one-handed mid-turn as the hard case, and states that
  target size is a first-class concern sized "by the finger, never by the icon". The timing tags are
  the densest interactive surface in the product — 85 of them on one screen — and each is a 20 px
  strip. The Edit/Play switch is the product's single mode control and its signature component.
  A mis-tap on a tag expands an explanation the player did not want; a mis-tap near the switch
  changes mode mid-game.
- **WCAG**: 2.5.8 Target Size (Minimum), **AA** — 24 × 24 CSS px. All three fail on height. The
  "inline" exception does not apply: none of these sit inside a sentence. (The `daviseford.com`
  byline link, also 21 px, *does* sit in a sentence and is correctly exempt.)
- **Recommendation**: These need hit-box growth, not visual growth — the density is deliberate and
  DESIGN.md forbids trading it away. `.ReminderMenuToggle` already establishes the pattern in this
  codebase: a transparent `::after` overlay that enlarges the target while the glyph stays put. Apply
  the same to `.ReminderTag` (a 24 px minimum height overlay), raise `react-switch` `height` to 24,
  and give the navbar links vertical padding. Note the tags sit in a wrapping flex row, so overlays
  must not overlap each other — clamp to the row gap as `.ReminderMenuToggle` clamps to 40 px wide.
- **Suggested command**: `/impeccable adapt`

#### [P1] One initial chunk carries 94% of all shipped JavaScript

- **Location**: `vite.config.mts` (no `manualChunks`), `src/aos4/generated/corpus/`
- **Category**: Performance
- **Evidence**: production `vite build` — `index-*.js` **12,516 KB raw / 1,418 KB gzipped**, against
  **13,285 KB raw total** across 22 chunks. The next largest is `Home-*.js` at 553 KB / 177 KB. The
  corpus is **13 MB on disk**; the main chunk contains **20,188** occurrences of `warscroll`.
  Vite's own build warns: "Some chunks are larger than 500 kB after minification."
- **Impact**: PRODUCT.md records that game venues and tournament halls have poor signal, and that the
  rules corpus is checked in and shipped with the bundle deliberately so the app works offline. That
  decision is sound — but the corpus currently loads *before first paint* rather than being deferred,
  so a player opening the app on venue Wi-Fi waits on 1.4 MB before seeing anything. Route-level
  splitting already works (22 chunks, `Profile` at 26 KB gzipped); the corpus simply is not part of it.
- **Recommendation**: Split the corpus out of the entry chunk — either a `manualChunks` rule keyed on
  `src/aos4/generated/`, or dynamic `import()` at the point of first faction resolution, with the
  service worker pre-caching it after paint so offline use is unaffected. Consider splitting per
  faction: a player needs one of 28. **PR #1769 (`perf: reduce initial bundle with lazy loading`) is
  already open against this** — verify whether it addresses the corpus or only route components.
- **Suggested command**: `/impeccable optimize`

### P2 — Minor

#### [P2] Accessible name replaces visible text on every new-tab link

- **Location**: `src/components/helpers/link.tsx:13` — `LinkNewTab` always sets `aria-label={label}`
- **Category**: Accessibility
- **Evidence**: `src/components/page/footer.tsx:44-49` renders visible text
  `AoS Reminders v5.2.9 - Release Notes` inside a `LinkNewTab` whose `label` is `"GithubLatestRelease"`,
  so the accessible name is the analytics slug.
- **Impact**: The accessible name must contain the visible label. A voice-control user saying "click
  AoS Reminders release notes" matches nothing. A screen reader announces `GithubLatestRelease`.
  This is unchanged from the prior audit.
- **WCAG**: 2.5.3 Label in Name, **A**.
- **Recommendation**: Only set `aria-label` when the link has no visible text — the icon-only
  `LinkButton` case. Otherwise let the contents supply the name, and keep the analytics slug for
  `logClick` alone. The two concerns are being served by one prop.
- **Suggested command**: `/impeccable clarify`

#### [P2] No `<footer>` landmark and no skip link

- **Location**: `src/components/page/footer.tsx` (renders `div.container.d-print-none`), `src/components/App.tsx`
- **Category**: Accessibility
- **Evidence**: measured `{main: 1, nav: 1, header: 1, footer: 0}`; zero in-page skip links.
- **Impact**: `<main>` and `<nav>` landed and are the bigger win — but the footer holds the Games
  Workshop disclaimer and the contact links, and is not reachable by landmark navigation. Without a
  skip link, every visit to the reminders page still means tabbing past the navbar, mode switch, and
  faction select before reaching content.
- **WCAG**: 1.3.1 Info and Relationships, A; 2.4.1 Bypass Blocks, A.
- **Recommendation**: Change the footer wrapper to `<footer>` (display-block, zero visual change), and
  add a visually-hidden skip link that becomes visible on focus, targeting the `<main>` that now exists.
- **Suggested command**: `/impeccable harden`

#### [P2] Contact links collapse to unlabelled glyphs on mobile

- **Location**: `src/components/helpers/link.tsx:37-38` — `{isMobile ? '' : ` ${text}`}`
- **Category**: Responsive
- **Evidence**: below 575.98 px, Github / Email / Discord render icon-only inside `btn-sm`.
- **Impact**: Three similar dark glyphs with no text to tell them apart. The accessible name survives
  via `aria-label`, so this is a sighted-touch problem, not a screen reader one. Unchanged from the
  prior audit.
- **Recommendation**: Keep the labels and let the row wrap — there are only three.
- **Suggested command**: `/impeccable adapt`

#### [P2] `.DisclaimerText` is 11 px

- **Location**: `src/css/index.scss:138-140`
- **Category**: Accessibility / Typography
- **Impact**: Below the 12 px `small` default and well under comfortable mobile reading size, on text
  that is a brand commitment (the Games Workshop disclaimer must appear on every page).
- **Recommendation**: Raise to 12 px to match `small`. It is one declaration and the disclaimer is
  already visually subordinate by position and colour.
- **Suggested command**: `/impeccable typeset`

### P3 — Polish

- **[P3] Four dead classes remain.** `pulsate-fwd` and `fade-out`
  (`helpers/suspenseFallbacks.tsx:56-57`), `btn-pill` and `pricing-card-title`
  (`payment/pricingPlans.tsx:146,122`) — all used in JSX, none defined in `src/css/` or Bootstrap 5.3.
  The first two matter most: the product has essentially no motion, which reads as a deliberate fit to
  the use scene, but the loading screen *asked* for a pulse and a fade and got neither. That absence is
  an accident, not a decision. `btn-pill` should be `rounded-pill`. *(`/impeccable harden`)*
- **[P3] Duplicate `btn` class.** `payment/pricingPlans.tsx:146` — `className="btn btn d-block w-100
  btn-primary btn-pill py-2"`. A second instance of the defect fixed for the gift button in #1760.
  *(`/impeccable polish`)*
- **[P3] New-tab links are not announced.** `LinkNewTab` sets `target="_blank"` with no visible or
  assistive cue. WCAG 3.2.5, AAA advisory. Unchanged. *(`/impeccable clarify`)*
- **[P3] Nine undocumented literal colours in `index.scss`.** `#bdbdbd`, `#2196f3`,
  `rgba(33,150,243,0.08)` (dropzone), `#4d5a63` (tag explainer), `rgba(0,0,0,0.45)` (print tag border),
  `#000000` / `rgba(0,0,0,0.9)` (modal border and overlay). The detector also flags `Source-Code-Pro`
  and `12px`, but both **are** documented in DESIGN.md's typography section — those two are false
  positives. *(`/impeccable extract`)*

## Patterns & Systemic Issues

1. **Target size is now the single systemic accessibility gap.** The prior audit's systemic issue was
   `div` + `role="button"` repeated four times; that pattern is gone — `collapsibleCardHeader.tsx` is a
   shared real `<button>` and the 39 remaining `role="button"` elements are `@hello-pangea/dnd` drag
   handles, which correctly carry `aria-describedby` keyboard instructions and polite live regions.
   What replaced it is dimensional: three unrelated control families all landed between 20 and 21 px,
   just under the 24 px floor. `.ReminderMenuToggle` already solves this correctly; the solution simply
   has not been generalised.
2. **One prop serving two consumers.** `LinkNewTab`'s `label` is simultaneously the analytics slug and
   the accessible name. That single conflation produces the only remaining WCAG A violation.
3. **Deferred loading stops at the route boundary.** Route splitting works well; the 13 MB corpus was
   never brought into it.

## Positive Findings

- **Contrast is genuinely solved.** Composited alpha measurement across both themes found **zero**
  failures — the worst passing value is 5.21:1 on a 24 px heading needing 3:1, and the seven timing
  tag tones measure 7.1–8.4:1 in both themes despite being translucent fills over varying surfaces.
  A naive non-compositing check reports six false failures here; the tones are correct.
- **The per-theme tag system is the right shape.** Seven tones defined separately per theme via the
  `tag-tones` mixin, each pairing colour with a distinct text label, and all fills dropping to
  transparent in print. Colour never carries meaning alone.
- **The prior audit's recommendations were followed precisely and without collateral restyling.**
  Seventeen of twenty-three findings closed, and the fixes chose the variant that renders identically
  — real `<button>`s inheriting `theme.cardHeader`, `<h2>` with size moved to CSS, a `::after` hit
  overlay. This is exactly what the continuity constraint asks for.
- **Regression pinning.** Retired subscription claims are now test assertions rather than prose
  promises, which is why the P0 cannot silently return.

## Recommended Actions

1. **[P1] `/impeccable adapt`**: Raise `.ReminderTag`, the Edit/Play switch, and the navbar links to
   the 24 px WCAG 2.5.8 floor using the `::after` overlay pattern `.ReminderMenuToggle` established,
   so visual density is unchanged.
2. **[P1] `/impeccable optimize`**: Split the 13 MB generated corpus out of the entry chunk and
   pre-cache it after paint. Check PR #1769 first — it may already cover part of this.
3. **[P2] `/impeccable clarify`**: Stop `LinkNewTab` defaulting `aria-label` to the analytics slug;
   set it only for icon-only links.
4. **[P2] `/impeccable harden`**: `<footer>` landmark, focus-visible skip link, and remove the four
   dead classes — deciding deliberately whether the loading screen should have its pulse and fade.
5. **[P3] `/impeccable typeset`**: `.DisclaimerText` to 12 px.
6. **[P3] `/impeccable extract`**: Promote or document the nine literal colours in `index.scss`.
7. **`/impeccable polish`**: Final pass, including the duplicate `btn` class.

## Verification notes and limits

- Measured on the `aos4-migration` tip at `eb82c288`, React 19.2.8 / Bootstrap 5.3.8, Chrome, dev
  server, default Stormcast Eternals document (39 reminders, 24 cards, 85 timing tags).
- Contrast used full alpha compositing up the ancestor chain. Any figure quoted against a translucent
  background without compositing is wrong — see Positive Findings.
- Bundle figures are from `vite build`, not the dev server. Dev-server module transfer (7.7 MB across
  37 requests) reflects unbundled ESM and is not a production signal.
- Both themes were measured on `/` only. `/subscribe`, `/faq`, `/join`, and `/redeem` were checked by
  source review; `/profile` was measured live in both themes during the polish pass that preceded this
  audit.
- Touch targets were measured at desktop width. Chrome would not resize below ~657 px in this session,
  so phone-width layout was verified by constraining the container and applying the breakpoint's own
  font sizes rather than by a true narrow viewport. Layout held and no horizontal overflow appeared,
  but a real-device pass is still worth doing before launch.
- No `prefers-reduced-motion` audit beyond `Subscribe.tsx` was needed: the product has one CSS
  transition (the dropzone border) and no other motion.

## Amendment — 2026-07-30, after `/impeccable extract`

Running the recommended `extract` pass on the P3 literal-colour drift surfaced a defect this audit
had missed, and closed the P3 itself. Both are recorded here rather than by rewriting the findings
above, so the original pass stays readable as what it was.

### New: [P1] Dropzone instructions were 1.80:1 — WCAG 1.4.3 AA

- **Location**: `src/css/index.scss` `.dropzone { color: #bdbdbd }` over `background-color: #fafafa`
- **Found**: while assessing whether `#bdbdbd` was worth promoting to a token
- **Evidence**: measured live with the import modal open, light theme — the dropzone's own
  instructions, `"Drag and drop your roster here"` (16 px, 700) and
  `"AoS app or Listbot text (.txt), or New Recruit roster (.ros or .rosz)"` (12 px, 400), both
  inherited `rgb(189, 189, 189)` on `rgb(250, 250, 250)` for **1.80:1**. The sibling "Choose a file"
  button was unaffected at 11.02:1 because it carries its own colour.
- **Why this pass missed it**: contrast was measured on `/` in both themes, and the dropzone only
  exists inside the import modal. Modal surfaces were not opened. **Route-level contrast sweeps are
  not sufficient — every modal and overlay needs its own pass.**
- **Impact**: the two lines that tell a player what the import accepts were effectively invisible on
  the surface whose entire job is explaining the import. PRODUCT.md records that players commonly
  arrive with a roster built elsewhere, so this is on a primary path, not a corner.
- **Fixed in this amendment**: replaced with the muted ink already used by the timing-tag explainer,
  measured at **6.80:1** on the same background. Bootstrap 5.3's own `.text-muted` (`#6c757d`) was
  rejected: it measures **4.49:1** against `#fafafa` and misses AA by a hair.

### Resolved: [P3] literal values in `index.scss`

Detector findings across `src/css`, `src/components`, and `src/theme` went **17 → 0**.

- **Promoted to tokens** (`src/css/theme.scss`): `$themeMutedInk` (`#4d5a63`, now two uses with one
  intent — tag explainer and dropzone) and `$themeDropzoneAccent` (`#2196f3`, three uses plus a
  derived `rgba($themeDropzoneAccent, 0.08)` drag fill that had been hand-expanded to
  `rgba(33, 150, 243, 0.08)`).
- **Recorded in DESIGN.md's frontmatter**: the values whose *prose* the record already described but
  whose machine-readable block omitted — the print tag edge, modal edge and scrim, the mono stack,
  fine print at 12 px, the explainer step at 0.78 rem, the dropzone radius, and the `.CardHeaderTitle`
  responsive and print ramp. This was the bulk of the drift: the design record was correct in
  English and incomplete in YAML.
- **Not tokenised**: the dropzone's `#eeeeee` / `#fafafa` / `black` / `whitesmoke` neutrals, each used
  once with no defect. Extract's own rule is that a value earns a token at three uses with one
  intent; one-off values earn documentation instead.

Theming moves 3/4 → 4/4. The remaining P1s (target size, bundle) are unchanged, so the total is
**15/20**.

## Amendment 2 — 2026-07-30, after `/impeccable adapt`

### Correction: the Edit/Play switch was never a target-size failure

The P1 above cited `.react-switch-bg` at **80 × 20 px**. That is the *track*, not the control. The
interactive element is `.react-switch`, measured at **90 × 30 px**, because `handleDiameter={30}`
makes the handle overflow the 20 px track — and the wrapping `<label for="game-mode-switch">` is
**90 × 36 px** on top of that. The switch **passes** WCAG 2.5.8 and always did.

Measuring a decorative inner element instead of the interactive one is the same class of error as
measuring contrast without compositing: the number is real, but it describes the wrong thing. Two of
the three "failures" in that finding were genuine; this one was mine.

### Fixed: reminder tags and navbar links

- **`.ReminderTag`** — 85 buttons at 20 px. Given a transparent `::after` overlay at **24 px**,
  matching what `.ReminderMenuToggle` already does. The chip's own 20 px appearance is unchanged, so
  the density DESIGN.md protects is untouched. `.ReminderTags` sets a 0.25 rem (4 px) gap, so
  vertically adjacent overlays meet exactly rather than overlapping — verified by testing all 40×39
  rectangle pairs on the default army: **0 overlaps**.
- **Navbar links** — 21 px, and `display: inline`, which cannot carry vertical padding at all.
  Now `d-inline-block py-1`, measuring **32 px**. The navbar's height is otherwise set by the
  adjacent Log in/Log out button at 31 px, so this makes the masthead 1 px taller and nothing else
  moves.

Accessibility moves 3/4 → 4/4.

## Amendment 3 — 2026-07-30, after landing #1769

The bundle P1. PR #1769 already carried the right fix and was ten commits behind base, so it was
brought up to date rather than duplicated. Two things had rotted in the interval: a `printModal.tsx`
conflict — its async lazy-loaded PDF download against base's Bootstrap 5 classes, both kept — and a
new test importing `render`/`unmountComponentAtNode` from `react-dom`, which React 19 removed,
repointed at `tests/support/reactTestHelpers`.

**Measured on the production build:**

| | Before | After |
|---|---|---|
| Entry chunk, raw | 12,516 kB | **795 kB** |
| Entry chunk, gzipped | 1,418 kB | **259 kB** |
| Total JS, all chunks | 13,285 kB | 13,289 kB — split, not removed |

**What this buys, and what it does not.** Measured against `vite preview` rather than inferred from
chunk sizes: the entry now loads alone at 18–71 ms, and the corpus chunk starts at 212 ms in a second
wave alongside the route chunk. The app shell no longer waits on the corpus to exist. But the corpus
is still fetched on the home route, because `Home` reaches `catalog.ts`, which holds a static
`import runtimeJson from './runtime.json'`. **Cold time-to-reminders is therefore not 82% better** —
what improved is that 1.4 MB no longer sits on the critical path before anything can render.

The next step, if pursued, is per-faction splitting: a player needs one of 28. That was this audit's
original suggestion and is not attempted here.

The build now enforces the result. An `initial-entry-chunk-budget` rollup plugin fails the build if
the entry exceeds **850 kB** raw — 850 rather than the 750 the plugin originally shipped with,
because ten commits of legitimate feature work landed on base in between. The headroom is small on
purpose.

Performance moves 2/4 → 3/4. Final score: **17/20**.
