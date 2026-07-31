# Mobile & Accessibility Audit — `aos4-migration`

Date: 2026-07-28
Scope: browser UI on the `aos4-migration` branch (`src/components/`, `src/css/`, `src/theme/`, `index.html`)
Method: source review plus live DOM measurement against the Vite dev server (`yarn start`), default
Stormcast Eternals document, 39 reminders rendered.
Command: `/impeccable audit`

This is a **report only**. No UI code was changed. Every finding below was verified against the running
app or against the exact source line cited; measured values are quoted verbatim.

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | 24 collapsible card headers are `role="button"` with no `aria-expanded` and no Space-key handler |
| 2 | Performance | 2/4 | Two unthrottled `resize` listeners re-render the whole reminder tree; demo videos `preload="auto"` |
| 3 | Responsive Design | 2/4 | Two conflicting breakpoint systems (JS `<=480`, CSS `<=575.98`); primary per-reminder control is 16×24 px |
| 4 | Theming | 3/4 | Token system is coherent and contrast passes; `theme-color` is hardcoded `#ffffff` against a dark masthead |
| 5 | Implementation Integrity | 2/4 | Subscribe page sells five features the cutover removed and links to an unrouted `/stats` |
| **Total** | | **11/20** | **Acceptable — significant work needed** |

## Implementation Integrity Verdict

**Pass, with material drift.** The mechanical detector
(`scripts/detect.mjs --json src/components src/css src/theme`) returned `[]` — no generic-template
markers, no design-system drift, no decorative filler. The visual system is genuinely product-specific:
one token file (`src/css/theme.scss`), one `ITheme` contract with light/dark implementations
(`src/theme/light.ts`, `src/theme/dark.ts`), and components that consume `theme.*` rather than
hardcoding colour. That is the incumbent AoS Reminders identity and it is intact.

The drift is in **content truth, not visual language**. The Subscribe page still advertises AoS 3
capabilities the migration deleted, and one advertised route was never registered. AGENTS.md requires
stale AoS 3 copy and feature claims to be removed or rewritten while retaining the visual hierarchy;
that has not happened on `/subscribe`. Two dead utility classes (`display-5`, `d-none d-block`) mean two
layout intentions silently never took effect.

## Executive Summary

- Audit Health Score: **11/20** (Acceptable — significant work needed)
- Issues found: **1 P0, 9 P1, 7 P2, 6 P3** (23 total)
- Top 5:
  1. **[P0]** `/subscribe` sells five removed features to paying users, and links to a route that does not exist.
  2. **[P1]** The only per-reminder control is a **16 × 24 px** hit target, repeated 39 times on the default army.
  3. **[P1]** 24 collapsible headers are keyboard-reachable but ignore Space and expose no `aria-expanded`.
  4. **[P1]** Heading structure goes `h1 → h4` (24 times) with no `h2`/`h3`, and the level flips to `h5` below 480 px.
  5. **[P1]** Subscribe demo videos cannot autoplay on iOS (`muted: false`, `playsInline: false`) and have no pause control.
- Recommended next steps: `/impeccable harden` for the stale-copy and dead-route P0, then
  `/impeccable adapt` for touch targets and the breakpoint split, then `/impeccable audit` to re-score.

## Detailed Findings by Severity

### P0 — Blocking

#### [P0] Subscribe page sells features the AoS 4 cutover removed

- **Location**: `src/components/routes/Subscribe.tsx:128-145` (`CurrentFeatures`), `:60-80` (`ExamplesRow`)
- **Category**: Implementation Integrity
- **Evidence**: live DOM of `/subscribe` lists, verbatim:
  `"NEW: Import lists from the new Warhammer App!"`,
  `"Import your army lists instantly from Azyr, Warscroll Builder, and Battlescribe."`,
  `"Save, load, update, and delete your army lists from anywhere on any device - even offline!"`,
  `"Share army lists with your friends!"`, `"Access to advanced stats!"`.
  Two demo videos still show `import_demo.mp4` and `save_load_demo.mp4`.
- **Impact**: AGENTS.md records that importers, saved armies, and the AoS 3 sharing path were deleted in
  the cutover. Every claim above is now false, on the one page that takes money. A subscriber who pays
  for Warhammer App import receives nothing. This is a refund-and-trust problem, not a copy nit.
- **Standard**: AGENTS.md — "Remove or rewrite stale AoS 3 copy and feature claims while retaining the
  surrounding visual hierarchy and interaction pattern."
- **Recommendation**: Rewrite the feature list against what AoS 4 actually ships today (notes, dark mode,
  PDF export). Retire or re-record the two import/save demo videos. Keep the card layout, `lead`
  typography, and pricing grid exactly as they are — this is a content correction, not a redesign.
- **Suggested command**: `/impeccable harden`

#### [P0-adjacent] `/stats` is linked but never routed

- **Location**: `src/components/routes/Subscribe.tsx:134` links `ROUTES.STATS` (`src/utils/env.ts:23`);
  `src/components/App.tsx:25-32` registers HOME, FAQ, JOIN, REDEEM, SUBSCRIBE, PROFILE — **no STATS**.
- **Category**: Implementation Integrity
- **Impact**: "Access to advanced stats!" is a live `<a href="/stats">`. Clicking it inside the SPA
  matches no `<Route>`, so the `<Switch>` renders nothing — a blank page under the navbar, with no 404
  and no way back except browser Back. Rolled into the P0 above because the fix is the same edit.
- **Recommendation**: Remove the claim and the link, or register a real route. Do not leave a
  `<Link>` to an unrouted path.
- **Suggested command**: `/impeccable harden`

### P1 — Major

#### [P1] Reminder options control is a 16 × 24 px touch target

- **Location**: `src/components/info/reminders.tsx:89-95` — `Dropdown.Toggle` with `btn btn-link border-0 p-0`
- **Category**: Responsive / Accessibility
- **Evidence**: measured on the default army — `{ w: 16, h: 24 }`, and **39 such toggles** on one screen.
- **Impact**: This ellipsis is the *only* way to hide a rule, add a note, or reach the source links. At
  16 px wide it is roughly a third of a fingertip. On a phone, mis-taps land on the drag handle beside it
  and start a drag instead. Motor-impaired users on any device are worst hit.
- **WCAG**: 2.5.8 Target Size (Minimum), AA — requires 24 × 24 CSS px. Width fails. Apple HIG and
  Material both ask for 44 px.
- **Recommendation**: Replace `p-0` with padding that yields at least 44 × 44 px on touch
  (`p-2` plus a min-width), keeping the icon glyph at its current visual size so the masthead rhythm is
  unchanged. Nothing visible needs to grow — only the hit box.
- **Suggested command**: `/impeccable adapt`

#### [P1] 24 collapsible headers ignore the Space key

- **Location**: `src/components/info/reminders.tsx:193-199`, `src/components/input/army_builder.tsx:105-111`
- **Category**: Accessibility
- **Evidence**: dispatching `key: ' '` on a focused header left the body expanded (`afterSpace: true`);
  `key: 'Enter'` collapsed it (`afterEnter: false`). Handler is `event.key === 'Enter' && toggle()`.
- **Impact**: Every native button and every `role="button"` in the ARIA Authoring Practices activates on
  both Enter and Space. Keyboard users who press Space — the more common choice for buttons — get
  nothing, and on a `div` Space also scrolls the page, so the app appears to jump instead of respond.
- **WCAG**: 2.1.1 Keyboard, A.
- **Recommendation**: Handle `' '` alongside `'Enter'` and `preventDefault()` on Space to suppress the
  scroll. Better: make these headers real `<button>` elements — they are already styled by
  `theme.cardHeader`, so appearance would not change.
- **Suggested command**: `/impeccable harden`

#### [P1] Collapsible headers expose no `aria-expanded`

- **Location**: same two files as above
- **Category**: Accessibility
- **Evidence**: `.card-header[role="button"]` count **24**, of which **0** carry `aria-expanded`.
- **Impact**: A screen reader announces "Units, button" whether the panel is open or shut. The only
  other cue is a chevron marked `aria-hidden`. Users cannot tell current state, and the collapsed count
  suffix (`Units (3)`) only renders when collapsed, so there is no stable state signal at all.
- **WCAG**: 4.1.2 Name, Role, Value, A.
- **Recommendation**: Add `aria-expanded={isExpanded}` and `aria-controls` pointing at the body id.
- **Suggested command**: `/impeccable harden`

#### [P1] Heading structure jumps `h1 → h4` and changes level by viewport

- **Location**: `src/components/info/reminders.tsx:202-206`, `src/components/input/army_builder.tsx:114-124`
- **Category**: Accessibility
- **Evidence**: home page heading list is `H1: Age of Sigmar Reminders` followed by **24 consecutive
  `H4`s** — no `h2`, no `h3`. Forcing the mobile branch (`innerWidth` 390) turns the same 24 headings
  into `H5`.
- **Impact**: Screen reader users navigate long pages by heading level. A flat run of 24 `h4`s under a
  lone `h1` gives no structure — the builder groups and the phase groups are indistinguishable
  siblings. Worse, the same content is `h4` on desktop and `h5` on a phone: semantic depth is being used
  as a font-size knob.
- **WCAG**: 1.3.1 Info and Relationships, A (2.4.10 Section Headings, AAA).
- **Recommendation**: Fix the level in markup (`h2` for both group types, since both sit directly under
  the page `h1`) and drive the size difference from `.CardHeaderTitle` in `index.scss`, which already has
  per-breakpoint `font-size` rules at 575.98/395/374 px.
- **Suggested command**: `/impeccable typeset`

#### [P1] Subscribe demo videos cannot play on iOS and never stop

- **Location**: `src/components/routes/Subscribe.tsx:186-196`
- **Category**: Responsive / Accessibility / Performance
- **Evidence**: measured attributes — `{ autoplay: true, loop: true, muted: false, playsInline: false,
  controls: false, preload: "auto" }`.
- **Impact**: Mobile Safari and Android Chrome block autoplay unless the video is `muted`; iOS
  additionally forces fullscreen without `playsinline`. On a phone these demos silently never start —
  the visitor sees a frozen poster on the page that exists to convert them. On desktop they loop forever
  with no pause control.
- **WCAG**: 2.2.2 Pause, Stop, Hide, A — auto-playing motion lasting over 5 s must be pausable.
- **Recommendation**: Add `muted` and `playsInline`; add `controls` (or a pause affordance) to satisfy
  2.2.2; drop `preload="auto"` to `metadata` so phones do not fetch three videos up front; gate autoplay
  behind `prefers-reduced-motion`. Note this finding is moot for the two import/save demos if the P0
  copy fix retires them.
- **Suggested command**: `/impeccable adapt`

#### [P1] Print modal labels point at element IDs that do not exist

- **Location**: `src/components/print/printModal.tsx:76` (`htmlFor="printLayout"`), `:91` (`htmlFor="printPageSize"`)
- **Category**: Accessibility
- **Evidence**: with the modal open, `label[for]` elements whose target is missing:
  `[{ for: "printLayout", text: "Layout" }, { for: "printPageSize", text: "Page size" }]`. The radios are
  actually `printLayout-compact`, `printLayout-standard`, `printPageSize-a4`, `printPageSize-letter`.
- **Impact**: "Layout" and "Page size" are orphan labels — they name nothing. A screen reader user
  tabbing into the radio group hears "A4, radio button, 1 of 2" with no idea it is the page size. The
  group also has no `fieldset`/`legend` (measured: **0 fieldsets** in the modal), so there is no grouping
  semantic to fall back on.
- **WCAG**: 1.3.1 Info and Relationships, A; 4.1.2 Name, Role, Value, A.
- **Recommendation**: Wrap each `RadioGroup` in `<fieldset>` with the current label text as `<legend>`,
  and drop the broken `htmlFor`. Visual output is identical.
- **Suggested command**: `/impeccable harden`

#### [P1] Modal has no max-height inside a non-scrolling overlay

- **Location**: `src/css/index.scss:148-179` (`.Modal-Light`, `.Modal-Overlay`)
- **Category**: Responsive
- **Evidence**: measured on the open print modal — `maxHeight: "none"`, `overflowY: "visible"`,
  `position: "absolute"`, rendered height **462.5 px**; overlay is `position: fixed` with
  `overflowY: "visible"`.
- **Impact**: The modal is centred with `top: 50%; transform: translate(-50%, -50%)`. When content is
  taller than the viewport, the top half moves above `y = 0` and neither the modal nor the fixed overlay
  scrolls — it is unreachable. At 462 px the print modal already exceeds a phone in landscape (390 px
  tall), where the heading and the Layout radios are cut off. Any future modal with more content fails
  in portrait too.
- **Recommendation**: Add `max-height: 90vh; overflow-y: auto;` to `.Modal-Light` and
  `max-width: calc(100vw - 2rem)`. One rule, inherited by `.Modal-Dark` and `.Modal-Transparent` via the
  existing `@extend`.
- **Suggested command**: `/impeccable adapt`

#### [P1] FAQ instructional screenshots have empty alt text

- **Location**: `src/components/routes/Faq.tsx:63-73`
- **Category**: Accessibility
- **Evidence**: both images render with `alt: ""` **and** `role="img"` — a contradiction: `alt=""` marks
  an image decorative, `role="img"` insists it is meaningful.
- **Impact**: `faq_continue_with_google.png` and `faq_unsubscribe.png` are the instruction. The body text
  says click "Continue with Google" and "Cancel Subscription"; the screenshot is what shows *where*. A
  screen reader user gets silence, on the page people reach when they are already locked out or trying to
  stop being billed.
- **WCAG**: 1.1.1 Non-text Content, A.
- **Recommendation**: Write real `alt` describing the action shown, and remove the redundant `role="img"`.
- **Suggested command**: `/impeccable clarify`

#### [P1] Edit/Play labels are focusable no-ops without state

- **Location**: `src/components/page/homeHeader.tsx:57-92`
- **Category**: Accessibility
- **Evidence**: two `span[role="button"]`, measured **29.2 × 32 px**, `aria-pressed: null`. Tab order is
  `Edit` → switch input → `Play` — three stops for one binary control. Each span only fires when it is
  *not* the current mode (`onClick={() => isGameMode && onToggleGameMode()}`).
- **Impact**: A keyboard user tabs to "Edit" while already in Edit mode, presses Enter, and nothing
  happens — a focusable control that does nothing, with no disabled state to explain why. Both spans also
  handle Enter only, not Space, and both are below the 44 px touch minimum.
- **WCAG**: 2.1.1 Keyboard, A; 4.1.2 Name, Role, Value, A.
- **Recommendation**: The `react-switch` input already carries `aria-label="Edit or play mode"` and is
  correctly associated with its `<label>`. Make the two text labels plain non-focusable `<span>`s (keep
  the click-to-toggle convenience, drop `role`/`tabIndex`) so the switch is the single keyboard control.
- **Suggested command**: `/impeccable harden`

### P2 — Minor

#### [P2] No `main` or `nav` landmarks on any route

- **Location**: `src/components/App.tsx:22`, `src/components/page/navbar_wrapper.tsx:10-15`
- **Category**: Accessibility
- **Evidence**: measured on `/`, `/faq`, `/subscribe` — `{ main: 0, nav: 0, header: 1, footer: 0 }`.
- **Impact**: Screen reader users jump between landmarks to skip repeated navigation. With only a bare
  `<header>`, every visit to the reminders page means tabbing past the navbar, the masthead links, the
  mode switch, and the faction select before reaching content. There is also no skip link.
- **WCAG**: 1.3.1 Info and Relationships, A (2.4.1 Bypass Blocks, A).
- **Recommendation**: Wrap the routed content in `<main>`, the navbar links in `<nav>`, the footer in
  `<footer>`. Zero visual change — these are display-block elements replacing `div`s.
- **Suggested command**: `/impeccable harden`

#### [P2] Two conflicting breakpoint systems

- **Location**: `src/components/aos4/useIsMobile.ts:3` (`480`), `src/utils/hooks/useWindowSize.tsx:29`
  (`480`) vs `src/css/index.scss:236` (`575.98px`) and `src/css/theme.scss:13-20` (Bootstrap `sm: 576px`)
- **Category**: Responsive
- **Evidence**: forcing `innerWidth: 520` keeps the **desktop** JS branch (`H4` titles, `py-2` headers,
  centred layout) while the CSS `@media (max-width: 575.98px)` block — smaller `CardHeaderTitle`, extra
  modal padding — is already active.
- **Impact**: Every viewport from 481 px to 575 px gets mobile typography with desktop layout logic.
  That band includes foldables unfolded, small tablets in portrait, and any phone in landscape. It is a
  split-brain responsive system where neither half knows what the other decided.
- **Recommendation**: Pick one source of truth. Either raise both JS hooks to 576 to match Bootstrap's
  `sm`, or drive the JS from `matchMedia('(max-width: 575.98px)')` so the breakpoint is defined once.
- **Suggested command**: `/impeccable adapt`

#### [P2] FAQ screenshots are never hidden on small screens

- **Location**: `src/components/routes/Faq.tsx:64`
- **Category**: Responsive
- **Evidence**: wrapper class is `col-auto d-none d-block d-sm-block d-md-block d-lg-block`. Measured:
  `d-none d-block` resolves to `display: block` — Bootstrap emits `.d-block` after `.d-none` at equal
  specificity, so `d-none` is dead. Both images render at **200 px** wide on every viewport.
- **Impact**: The `d-none` + `d-sm-block` pairing shows the author intended to hide these on `xs`.
  Instead a 200 × 250 screenshot sits beside the text on a 320 px phone, squeezing the answer into a
  narrow column. The stated intent never took effect.
- **Recommendation**: Use `d-none d-sm-block` alone. Decide deliberately whether phones should see the
  screenshot; if yes, let it go full-width below the text rather than beside it.
- **Suggested command**: `/impeccable adapt`

#### [P2] `theme-color` is white against a dark masthead

- **Location**: `index.html:30`
- **Category**: Theming
- **Evidence**: `<meta name="theme-color" content="#ffffff">`; masthead is `$themeDarkBluePrimary`
  `#063647` (light theme) / `$themeDarkBlueSecondary` `#182633` (dark theme).
- **Impact**: On Android Chrome and iOS Safari the browser chrome tints white while the page directly
  beneath it is near-black. Installed as a PWA (a manifest is present) the status bar clashes with the
  app on first paint. Subscribers on dark theme get the worst of it.
- **Recommendation**: Set `theme-color` to `#063647`, and add a
  `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#182633">` companion.
- **Suggested command**: `/impeccable adapt`

#### [P2] Two unthrottled resize listeners re-render the reminder tree

- **Location**: `src/utils/hooks/useWindowSize.tsx:11-22`, `src/components/aos4/useIsMobile.ts:10-15`
- **Category**: Performance
- **Evidence**: both hooks call `setState` on every `resize` event with no throttle or `requestAnimationFrame`.
  `useIsMobile` is consumed by `army_builder`, `reminders` (per card), and `homeHeader`; `useWindowSize`
  by `navbar`, `navbar_wrapper`, `link`, `Subscribe`.
- **Impact**: On mobile, showing or hiding the URL bar fires a burst of resize events. Each one sets
  state in many component instances at once, re-rendering a tree that held **39 reminders** and 24 cards
  in the default army. `useWindowSize` stores `height` too, so vertical-only changes — exactly what the
  URL bar causes — trigger re-renders that cannot change any layout decision.
- **Recommendation**: Throttle via `requestAnimationFrame`, and have `useIsMobile` bail out when the
  boolean has not changed (`setIsMobile(prev => next === prev ? prev : next)`). Drop `height` from
  `useWindowSize` unless a consumer needs it.
- **Suggested command**: `/impeccable optimize`

#### [P2] `aria-label` overrides visible link text

- **Location**: `src/components/helpers/link.tsx:13-17` — `LinkNewTab` always sets `aria-label={label}`
- **Category**: Accessibility
- **Evidence**: footer release-notes link has visible text `AoS Reminders v5.2.9 - Release Notes` and
  accessible name `GithubLatestRelease` (`src/components/page/footer.tsx:44-48`). Subscribe measured
  pairs: visible `"on Github!"` / name `"Github"`; visible `""` / name `"Video URL"`.
- **Impact**: The accessible name must contain the visible label. Voice-control users say "click AoS
  Reminders release notes" and nothing matches, because the name is an analytics slug. Screen reader
  users hear `GithubLatestRelease`.
- **WCAG**: 2.5.3 Label in Name, A.
- **Recommendation**: Stop defaulting `aria-label` to the analytics `label`. Only set `aria-label` when
  the link has no visible text (the icon-only `LinkButton` case at `link.tsx:37-38`), and make it start
  with the visible text otherwise.
- **Suggested command**: `/impeccable clarify`

#### [P2] Icon-only contact buttons on mobile

- **Location**: `src/components/helpers/link.tsx:26-42`, used by `src/components/page/contact.tsx`
- **Category**: Responsive
- **Evidence**: below 480 px `LinkButton` renders `{isMobile ? '' : ' ${text}'}` — icon only, inside
  `btn-sm`.
- **Impact**: Github, Email, and Discord collapse to three unlabelled glyphs in the footer at `btn-sm`
  size. The accessible name survives via `aria-label`, so this is a sighted-touch issue: small targets
  and no text to disambiguate three similar dark circles.
- **Recommendation**: Keep the labels and let the row wrap, or raise the touch target to 44 px if the
  icon-only treatment is deliberate.
- **Suggested command**: `/impeccable adapt`

#### [P2] Reminder note textarea can be resized past its container

- **Location**: `src/css/index.scss:115-122` — `.NoteInput { width: 95%; resize: both; }`
- **Category**: Responsive
- **Impact**: `resize: both` lets a user drag the textarea wider than the card on a phone, producing
  horizontal page scroll that persists until the note is closed.
- **Recommendation**: `resize: vertical` and `max-width: 100%`.
- **Suggested command**: `/impeccable adapt`

### P3 — Polish

- **[P3] `display-5` is a dead class.** `src/components/page/homeHeader.tsx:41,98`. Measured:
  `display5DefinedInCss: false` — Bootstrap 4.6 ships `display-1`…`display-4` only; `display-5` arrived
  in Bootstrap 5. The `h1` renders at the browser default **40 px**, not a display size, and the army-name
  `h2` inherits the same dead class so it renders at `h2` default. Both masthead headings are sized by
  accident. Use `display-4`, or set an explicit size. *(`/impeccable typeset`)*
- **[P3] `img width="120px"` is invalid and causes layout shift.** `src/components/routes/Subscribe.tsx:106`
  — the HTML `width` attribute takes a unitless number; `"120px"` is ignored. No `height` either, so the
  logo has no reserved space and the intro text jumps on load. *(`/impeccable optimize`)*
- **[P3] No `loading="lazy"` on any image.** Measured `loading: null` on both FAQ screenshots and the
  Subscribe logo. *(`/impeccable optimize`)*
- **[P3] `.DisclaimerText` is 11 px.** `src/css/index.scss:38-40`, below the 12 px `small` default and
  well under comfortable mobile reading size. *(`/impeccable typeset`)*
- **[P3] `text-nowrap` on mobile card titles is a latent overflow.** `src/components/info/reminders.tsx:203`.
  Measured today's longest label `"Heroes Of The First Forged"` at **214.4 px** (1.1 rem) against a
  ~292 px budget on a 390 px phone, so it currently fits — but the guard is absent, and a longer faction
  or phase label from a future corpus will overflow horizontally rather than wrap. The mobile branch in
  `army_builder.tsx:116` already omits `text-nowrap`; the two are inconsistent. *(`/impeccable harden`)*
- **[P3] New-tab links are not announced.** `LinkNewTab` sets `target="_blank"` with no visible or
  assistive cue. WCAG 3.2.5 (AAA, advisory). *(`/impeccable clarify`)*

## Patterns & Systemic Issues

1. **`div` + `role="button"` instead of `<button>`, four times.** `reminders.tsx:193`,
   `army_builder.tsx:105`, and both `homeHeader.tsx` spans. Every instance repeats the same three
   defects: Enter-only key handling, no state attribute, and a hand-rolled focus surface. One shared
   `CollapsibleHeader` built on a real `<button>` would fix 24 live controls at once and cost nothing
   visually — `theme.cardHeader` already supplies the appearance.
2. **Semantic level used as a size control.** Headings switch `h4`↔`h5` on `isMobile`, and `display-5`
   was reached for instead of a font-size rule. `index.scss` already carries per-breakpoint
   `.CardHeaderTitle` sizes at 575.98/395/374 px — the CSS is the right home for this and is being
   bypassed.
3. **Responsive decisions split between JS and CSS with different thresholds.** Two hooks say 480, the
   stylesheet and Bootstrap say 576. Any component mixing both is wrong somewhere in that 95 px band.
4. **Touch targets sized by icon rather than by finger.** 16 × 24 px reminder toggle, 29 × 32 px
   Edit/Play, `btn-sm` icon-only contact buttons. No component sets a minimum.
5. **Copy outlived the code.** The Subscribe page, the demo videos, and the `/stats` route describe an
   app that no longer exists. The migration retired the modules but not the marketing.

## Positive Findings

Worth protecting as the fixes land:

- **The detector is clean.** `[]` findings across `src/components`, `src/css`, `src/theme` — no generic
  scaffolding, no drift, no filler content.
- **Contrast passes.** Verified by computation: card header `#1c7595` on white text = **5.21:1**; masthead
  `#063647` on white = **12.9:1**; dark-theme muted `text-white-75` on `#182633` = **9.22:1**. All clear
  AA for their sizes. The palette is doing real work.
- **The theming contract is genuinely good.** `ITheme` forces every surface through named slots, both
  implementations satisfy it, and subscriber theme persistence is wired through
  `useTheme` + `SubscriptionApi.updateTheme`. This is a real token system, not scattered classes.
- **Focus indicators survive.** Measured `outline: auto 1px` with `:focus-visible` matching on the custom
  headers — no `outline: none` anywhere in the stylesheet. Tab order follows DOM order.
- **The a11y basics that exist are correct.** The `react-switch` `id`/`htmlFor` pairing resolves to a real
  `input[role="switch"]`; the spinner carries `sr-only` "Loading..." with `role="status"`; every
  `react-select` has `aria-label`; decorative chevrons are `aria-hidden`; the reminder dropdown toggles
  and note textareas have per-reminder accessible names (`Options for DEPLOY UNIT`).
- **Print behaviour is deliberate.** `d-print-none` is applied consistently, and `index.scss` has a real
  `@media print` block that forces text to black and controls card padding.
- **The AoS 4 view-model boundary held.** Components consume `createAos4BuilderViewModel` /
  `createAos4ReminderViewModel` and contain no rules logic, exactly as AGENTS.md requires.

## Recommended Actions

1. **[P0] `/impeccable harden`** — rewrite the Subscribe feature list against shipped AoS 4 capability,
   retire the import/save demos, and remove or route `/stats`. Highest impact: it is the paid surface and
   the only finding that costs the project trust.
2. **[P1] `/impeccable adapt`** — touch targets (16 × 24 reminder toggle first), modal `max-height`,
   video `muted`/`playsInline`, FAQ `d-none d-block`, and unify the 480/576 breakpoint split.
3. **[P1] `/impeccable harden`** — Space-key handling and `aria-expanded` on the 24 collapsible headers,
   `fieldset`/`legend` in the print modal, `main`/`nav` landmarks, and the Edit/Play focus no-ops.
   Best done as one shared `CollapsibleHeader` component per systemic issue #1.
4. **[P1] `/impeccable typeset`** — fix the `h1 → h4` jump to `h1 → h2`, stop varying heading level by
   viewport, and replace the dead `display-5`.
5. **[P1] `/impeccable clarify`** — real `alt` text on the FAQ screenshots; stop letting the analytics
   `label` override visible link text.
6. **[P2] `/impeccable optimize`** — throttle the two resize listeners, add `loading="lazy"`, fix the
   `width="120px"` attribute and add `height`.
7. **[P3] `/impeccable polish`** — final pass once the above land.

Re-run `/impeccable audit` after the fixes to re-score. Expected ceiling after items 1–5: **17–18/20**.

## Verification notes and limits

- Measurements were taken against `yarn start` (Vite 5.3.6) on the branch as of 2026-07-28, default
  Stormcast Eternals document, 39 reminders, 24 collapsible cards, light theme.
- Chrome window resizing was refused by the maximized window, so CSS media-query behaviour below 576 px
  was **not** exercised live. Mobile findings were established three ways instead: measuring rendered
  geometry in the DOM, forcing the JS mobile branch by overriding `window.innerWidth` (confirmed the
  `H4`→`H5` swap and the 520 px split-brain), and reading the `@media` blocks in `index.scss` directly.
  A device-emulation pass at 320/375/390/414/540 px would still be worth running before the fixes ship.
- Contrast ratios are computed from the WCAG relative-luminance formula against the tokens in
  `theme.scss`, not sampled from screenshots.
- Two findings I checked and **withdrew** rather than report: missing focus indicators (the UA ring is
  present and `:focus-visible` matches — an earlier programmatic-focus reading was misleading) and a
  broken `label`/`htmlFor` on the game-mode switch (`react-switch` does place the `id` on a real
  `input[role="switch"]`).
