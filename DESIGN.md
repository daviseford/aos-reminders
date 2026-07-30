---
name: AoS Reminders
description: Phase-ordered Age of Sigmar reminders, built to be read at the table and printed on paper.
colors:
  deep-harbour-teal: "#063647"
  midnight-slate: "#182633"
  signal-teal: "#1c7595"
  profile-wash: "rgba(28, 117, 149, 0.15)"
  pale-gray: "#e9ecef"
  note-blue: "#1237c7"
  ink: "#212529"
  paper: "#ffffff"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.2
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.03em"
rounded:
  none: "0"
  chip: "3px"
  md: "0.25rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "3rem"
  card-y: "0.75rem"
  card-x: "1.25rem"
components:
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  card-dark:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
  card-header:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    padding: "0.5rem 1.25rem"
  card-header-mobile:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    padding: "1rem"
  masthead:
    backgroundColor: "{colors.deep-harbour-teal}"
    textColor: "{colors.paper}"
    typography: "{typography.display}"
  masthead-dark:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.paper}"
    typography: "{typography.display}"
  button-toolbar:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
    width: "100%"
  button-toolbar-dark:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
    width: "100%"
  reminder-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "0.1rem 0.4rem"
  modal:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.5%"
  modal-dark:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "1.5%"
---

# Design System: AoS Reminders

## Overview

**Creative North Star: "The Field Manual"**

This is an issued reference, not an experience. A field manual earns trust by being complete,
densely typeset, identically organised every time you open it, and legible in bad conditions — and
by having nothing in it that isn't needed. The visual system exists to get a rule in front of a
player who is mid-turn with dice in one hand, and then get out of the way. Every decoration is
weight the player has to carry.

The system is deliberately built on Bootstrap 4.6 defaults with a small, specific palette laid over
the top. That is a decision, not neglect: a manual uses standard-issue components so the *content*
is the only thing that varies between pages. Two colours carry the entire structural language — a
near-black teal for the masthead and a mid teal for every section header — and everything else is
neutral. Surfaces are flat; a hairline border and a background shift do all the separating.

Paper is a first-class output, not an export feature. The screen and the printed sheet are two
renderings of the same manual, and the system is designed so that removing colour costs nothing:
tags fall back to bordered outlines, text forces to black, and structure survives in the borders
and the type hierarchy. If a design decision only reads in colour, it will not survive contact with
the table.

**Key Characteristics:**

- Density over whitespace; the screen is a reference sheet, not a landing page
- Two structural colours, everything else neutral
- Flat surfaces, hairline borders, no shadows on anything that doesn't physically move
- System fonts only — no web font is loaded, and none should be
- Every surface has a defined print behaviour
- Light and dark are a real contract (`ITheme`), not a class swap

## Colors

A cold, near-monochrome palette: two teals doing structural work against neutral paper or slate,
with colour reserved for meaning rather than decoration.

### Primary

- **Deep Harbour Teal** (`#063647`): The masthead and page header in light theme. Almost black at a
  glance, and the darkest thing on the page — it anchors the top of the document the way a manual's
  cover band does. Also the browser `theme-color`, so installed PWA chrome matches the page.
- **Signal Teal** (`#1c7595`): Every collapsible card header, in both themes. This is the single
  most repeated colour in the product — roughly 24 instances on a default army — and it means one
  thing: *a section starts here*. It also carries into the PDF as the rule colour and subtitle
  colour, which is why it must stay legible when desaturated.

### Secondary

- **Midnight Slate** (`#182633`): The dark theme's surface and masthead. Cooler and lighter than
  Deep Harbour Teal, because in dark theme it is a *background* rather than an anchor, and needs to
  sit behind body text at length.
- **Note Blue** (`#1237c7`): Player-authored notes in PDF export. The one place a saturated colour
  appears, and it marks the one thing on the page the player wrote themselves.

### Neutral

- **Ink** (`#212529`): Body text and rule text in light theme.
- **Paper** (`#ffffff`): Card bodies and page background in light theme; all text in dark theme.
- **Pale Gray** (`#e9ecef`): Borders and dividers in dark theme, the mode switch handle, and
  textarea outlines.
- **Profile Wash** (`rgba(28, 117, 149, 0.15)`): Signal Teal at 15% behind profile card headers —
  the same accent, quieted, on the account screens where nothing is time-critical.

Muted text is expressed as opacity rather than a separate token: `text-white-75`
(`rgba(255,255,255,0.75)`) in dark theme, Bootstrap's `text-muted` in light.

### Named Rules

**The Slot Rule.** No component hardcodes a colour. Every surface reads a named slot from `ITheme`
(`theme.cardBody`, `theme.text`, `theme.reminderHeader`), and light and dark supply their own
values. A literal hex in a component is a defect — it will be wrong in one of the two themes.

**The Meaning-Only Colour Rule.** Colour marks structure (Signal Teal = section header) or
authorship (Note Blue = the player's own words). It never decorates, and it never carries
information alone: the reminder tags pair every tone with a distinct text label, because the tone
disappears in print and for colour-blind players.

**The Vestigial Token Rule.** `$themeDarkBlueTertiary` (`#073647`), `$themeRed` (`#a12f48`), and
`$themeYellow` (`#e0d51f`) are declared in `theme.scss` and used nowhere. They are not part of the
system. Do not reach for them to solve a new problem — introduce a token deliberately or reuse an
existing one. (`$themeLightPurple` `#93a9fa` is likewise only reached as a hardcoded literal in
`src/theme/dark.ts`, where a stale comment misattributes it to `$themeYellow`.)

## Typography

**Display Font:** none — the system UI stack (`-apple-system, BlinkMacSystemFont, "Segoe UI",
"Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`)
**Body Font:** the same stack
**Label/Mono Font:** `source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace` for `code`
only

**Character:** Native, invisible, and instant. No web font is loaded anywhere in the product, and
none should be — a render-blocking font request is paid for at a game venue on bad signal, by a
player who needs a rule now. The type does no expressive work; the hierarchy and the density do it.

### Hierarchy

- **Display** (500, 2.5rem, 1.2): the masthead `h1`, "Age of Sigmar Reminders". One per page.
  Drops to 1.5rem in print.
- **Title** (500, 1.5rem, 1.2): `.CardHeaderTitle` — every collapsible card header, and the army
  name in Play mode. Steps down responsively to 1.1rem below 576px, 1rem below 395px, and 0.8rem
  below 374px; 1.1rem in print.
- **Body** (400, 1rem, 1.5): rule Trigger/Declare/Effect text, the substance of the product. Falls
  to 0.9rem in print to fit more per page.
- **Label** (700, 0.7rem, 1.35, `0.03em`, uppercase): the reminder timing tags. Small, wide-tracked,
  and the only uppercase in the product.
- **Fine print** (400, 11–12px): `small` is 12px; `.DisclaimerText` is 11px for the Games Workshop
  disclaimer.

Notes render italic (`.NoteText`), in both the screen and the PDF, so the player's own words are
distinguishable from rules text at a glance.

### Named Rules

**The Level-Is-Not-Size Rule.** Heading level is document structure; font size is CSS. Card titles
are `<h2>` at every viewport because they all sit directly under the page `<h1>`, and
`.CardHeaderTitle` changes their size across four breakpoints. Never swap heading level to make
something smaller — that was a real defect in this codebase and it is fixed.

**The Uppercase Reservation Rule.** Uppercase is reserved for the timing tags. It is a signal that
something is a machine-derived facet rather than rules prose, and it stops working the moment
anything else adopts it.

## Layout

Bootstrap 4.6's 12-column grid, with a custom `xxl: 1900px` tier added to the default five
(`sm: 576`, `md: 768`, `lg: 1025`, `xl: 1200`). Containers cap at 1610px at `xxl`.

The page is a single centred column of stacked cards. The reminder column sits at
`col col-sm-11 col-md-10 col-lg-10 col-xl-8` — deliberately narrower than the builder above it,
because rule text is read in sentences and the builder is scanned in lists. The builder is a
three-up grid on desktop (`col-md-6 col-lg-4`) and the toolbar is a seven-button responsive row
(`col-6 col-sm-4 col-lg`).

**Mobile is a different layout, not a narrower one.** Below 576px: collapsed builder cards drop to
`col w-50` and tile two-up so the whole builder is visible without scrolling; group titles switch
to shorter `mobileTitle` variants ("Formations", "Artefacts", "Manifestations"); card header
padding grows from `0.5rem 1.25rem` to a uniform `1rem`; reminder cards start collapsed rather than
expanded, so the player lands on a list of phases instead of a wall of text.

Spacing is Bootstrap's `1rem`-based scale used at the low end — `0.25`/`0.5`/`1rem` do almost all
the work. Cards use `0.75rem` vertical and `1.25rem` horizontal internal padding. The rhythm is
tight on purpose.

### Named Rules

**The One Breakpoint Rule.** The mobile breakpoint is 575.98px and it is defined once, in
`src/utils/breakpoints.ts`. The JS hooks derive from it via `matchMedia` and the stylesheet's media
queries use the same number. Two systems disagreeing about where mobile starts was a real defect
here; never reintroduce a second threshold.

**The Print Parity Rule.** Every surface declares its paper behaviour. Chrome that must not print
carries `d-print-none`; content that must print gets a rule in the `@media print` block. Neither is
optional — a new surface with no print decision is unfinished.

## Elevation & Depth

**Flat by default; borders do the work.** There are no `box-shadow` values anywhere in the
stylesheet. Separation comes from a 1px border plus a background shift: in light theme a
`rgba(0,0,0,0.125)` hairline against white, in dark theme an explicit `border-dark` or Pale Gray
edge against Midnight Slate. Card headers separate from bodies by colour alone.

This is not minimalism for its own sake. Shadows vanish in print, so a system that used elevation
to convey structure would lose that structure on paper — and paper is a primary output here.
Borders survive the trip.

### Shadow Vocabulary

One exception, and it is a physical control:

- **Switch handle** (`box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.6)`; active
  `0px 0px 1px 10px rgba(0, 0, 0, 0.2)`): the Edit/Play and theme toggles. The shadow reads as a
  handle that moves, which is exactly what it is.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest and flat in motion. A shadow is only
permitted on a control that physically travels. If a new element needs to feel separated, give it a
border and a background, not a shadow.

## Shapes

A quiet, near-rectilinear form language with only two radii in play.

- **Cards, buttons, inputs, and badges**: Bootstrap's default gently-rounded corner (`0.25rem`).
- **Reminder tags**: a tighter 3px, so they read as chips rather than small buttons.
- **Modals: square** (`0`, with a 1px border). `.Modal-Light` sets a border and no radius, which
  makes the modal the only sharp-cornered surface in the product — it sits above the page rather
  than in it.
- **Notes**: a dashed 1px border (2px in dark theme) around player-authored text, sized
  `width: max-content` up to 95%, so the box hugs what was written. Dashed is doing semantic work:
  it marks the content as provisional and personal against the solid-bordered rules cards.

Icons are `react-icons` line glyphs (Font Awesome and Material) at text size, `aria-hidden` when
decorative.

### Named Rules

**The Dashed-Means-Yours Rule.** A dashed border marks player-authored content — notes on screen,
and the import dropzone awaiting a file. Rules content is never dashed.

## Components

The character line for all of them: **issued, not styled.** Controls look like standard-issue
equipment — outlined, uniform, immediately legible, with no per-component expression. The content
varies; the instruments do not.

### Buttons

- **Shape:** gently rounded (`0.25rem`), Bootstrap default padding (`0.375rem 0.75rem`).
- **Toolbar (primary pattern):** full-width outline buttons, `btn-outline-dark` in light theme and
  `btn-outline-light` in dark, laid out `col-6 col-sm-4 col-lg`. Each carries a leading icon at
  `mr-2` and a `text-nowrap` label. Outline rather than filled because seven of them sit in one
  row — seven filled buttons would out-shout the reminders below.
- **Navbar:** `btn btn-outline-light btn-sm mx-2` against the teal masthead.
- **Disabled:** used semantically, not decoratively — `Show Hidden` disables at zero hidden, and
  the subscriber actions disable while auth or subscription state is resolving.
- **Hover / Focus:** Bootstrap defaults, untouched. No `outline: none` appears anywhere in the
  stylesheet and `:focus-visible` is honoured; the reminder tags add an explicit
  `2px solid #1c7595` ring at `1px` offset.

### Chips

The reminder timing tags — the one genuinely bespoke component in the system.

- **Style:** uppercase 0.7rem/700 at `0.03em` tracking, `0.1rem 0.4rem` padding, 3px radius, 1px
  border, `cursor: help`.
- **Tones:** seven semantic tones — active, reaction, passive, your-turn, enemy-turn, neutral, and
  usage — each defined *per theme* via the `tag-tones` mixin, never by the tone class alone. Usage
  tags are dashed to separate a constraint from a classification.
- **State:** each tag is a real `<button>` that toggles an inline expansion, because touch devices
  never hover and the abbreviations are not self-explanatory. `title` covers mouse, `aria-label`
  covers assistive tech.
- **Print:** all fills drop to transparent, text to black, border to `rgba(0,0,0,0.45)`. Weight and
  border carry the distinction on paper.

### Cards / Containers

- **Corner Style:** `0.25rem`.
- **Background:** white in light theme, Midnight Slate in dark.
- **Shadow Strategy:** none — see Elevation.
- **Border:** 1px hairline; dark theme adds an explicit `border border-dark`.
- **Internal Padding:** `0.75rem` vertical / `1.25rem` horizontal, tightening to `0.75rem` vertical
  on the reminder body below 576px and to `0.5rem` in print.
- **Header:** Signal Teal with white text, containing a full-width `<button>` that carries the
  padding so the entire header is the hit area, an `<h2>` title, and a Material expand/collapse
  chevron. Collapsed headers on mobile append a selection count (`Units (3)`).

### Inputs / Fields

- **Selects:** `react-select`, themed through `theme.selectTheme` — light theme uses the library
  default, dark overrides eleven neutral/primary slots to sit on Midnight Slate. Always carries an
  `aria-label`.
- **Note textarea:** `.NoteInput`, 95% width, `resize: vertical` only (horizontal resize let users
  drag it past the card and scroll the page sideways), inheriting theme background and text.
- **Dropzone:** dashed 2px, `#eeeeee` on `#fafafa` in light and Pale Gray on black in dark, with a
  `#2196f3` border on focus and drag-over.

### Navigation

- **Style:** bold light links (`font-weight-bold text-light mx-2`) directly on the masthead colour,
  inside `<header>` → `<nav aria-label="Main">`. No underline, no active-state treatment — the
  current route's own link is simply omitted.
- **Content:** signed out, `Subscribe` / `FAQ` / `Log in`; signed in, `Profile` / `Log out`.
  A sale renders a `badge badge-pill badge-danger` discount chip, suppressed below 335px.
- **Mobile:** the row narrows from 75% to 100% width; links do not collapse into a menu.

### Signature Component: the Edit/Play switch

The product's one true mode control, and the only place the system spends any expressive budget: an
80×20px `react-switch` in Signal Teal with a Pale Gray handle, flanked by the words `Edit` and
`Play`, the active one bolded. The words are click-to-toggle for the mouse but deliberately **not**
focusable — the switch is the single keyboard control, because a focusable label that only fires in
the opposite mode is a dead stop in the tab order.

## Do's and Don'ts

### Do:

- **Do** read colour from an `ITheme` slot (`theme.cardBody`, `theme.text`) and verify any change
  in both light and dark before accepting it.
- **Do** give every new surface an explicit print behaviour — `d-print-none` for chrome, or a rule
  in the `@media print` block for content.
- **Do** size touch targets by the finger, not the glyph: 44×44px on touch, 24×24px absolute
  minimum (WCAG 2.5.8). Grow the hit box with a pseudo-element overlay when the visual size must
  stay put, as `.ReminderMenuToggle` does.
- **Do** use a real `<button>`, `<fieldset>`/`<legend>`, `<main>`, or `<nav>` rather than ARIA on a
  `div`. The native element is almost always the fix that also renders identically.
- **Do** derive responsive decisions from `src/utils/breakpoints.ts` so JS and CSS agree.
- **Do** pair every colour-coded state with a text label, because the colour is gone in print.
- **Do** reuse the established primitives — collapsible card, outline toolbar button, timing chip —
  when new AoS 4 data needs a new treatment.

### Don't:

- **Don't** introduce a web font, or any render-blocking resource on the reminders path.
- **Don't** add a `box-shadow` to anything that doesn't physically move.
- **Don't** hardcode a hex in a component, or reach for `$themeRed`, `$themeYellow`, or
  `$themeDarkBlueTertiary` — they are declared but unused and are not part of the system.
- **Don't** change heading level to change text size. Set the size in `.CardHeaderTitle`.
- **Don't** use uppercase outside the timing tags.
- **Don't** trade density for whitespace on the reminders screen. It is a reference sheet read
  under time pressure, not a marketing page.
- **Don't** restyle as a side effect of an accessibility or correctness fix. Choose the variant that
  renders identically, state the delta, and let the user accept it.
- **Don't** introduce a second visual language for AoS 4 data, a "migration workbench" aesthetic, or
  a broad reskin. The live site is the baseline and a redesign requires an explicit request.
