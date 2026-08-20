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
  action-blue: "#0070e8"
  success-green: "#28a745"
  danger-red: "#dc3545"
  warning-amber: "#ffc107"
  info-cyan: "#17a2b8"
  muted-ink: "#4d5a63"
  dropzone-accent: "#2196f3"
  modal-edge: "#000000"
  modal-scrim: "rgba(0, 0, 0, 0.9)"
  print-tag-edge: "rgba(0, 0, 0, 0.45)"
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
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.03em"
  explainer:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.35
    fontStyle: "italic"
  fine-print:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  title-compact:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: 1.2
  body-print:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
titleSizes:
  base: "1.5rem"
  sm: "1.1rem"
  xs: "1rem"
  xxs: "0.8rem"
  print: "1.1rem"
bodySizes:
  base: "1rem"
  print: "0.9rem"
rounded:
  none: "0"
  none-dropzone: "2px"
  chip: "3px"
  md: "0.25rem"
  pill: "10rem"
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
  button-cta:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    width: "100%"
  reminder-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "0.1rem 0.4rem"
  badge-official:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.25em 0.6em"
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

The system is deliberately built on Bootstrap defaults with a small, specific palette laid over
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
- Two structural colours plus Bootstrap's semantic set; nothing decorative
- Flat surfaces, hairline borders, no shadows on anything that doesn't physically move
- System fonts only — no web font is loaded, and none should be
- Every surface has a defined print behaviour
- Light and dark are a real contract (`ITheme`), not a class swap

## Colors

Two teals doing structural work against neutral paper or slate, plus Bootstrap's semantic set for
actions and status. Colour is reserved for meaning; nothing here is decorative.

The teals are the project's own and carry the identity. The semantic colours are Bootstrap's stock
signal set — a deliberate consequence of the Field Manual thesis, since standard signal colours are
the ones a reader already knows. They are listed below because they are real, frequent, and
user-facing, not because they were designed.

Three of them are no longer Bootstrap's *current* defaults. Bootstrap 5 re-picked `$blue`, `$green`,
and `$cyan`, and `$dark` moved a step darker; `src/css/theme.scss` pins all four back to the 4.6
values the product was built on. See "Parity pins" under Layout — the hexes below are the truth, and
the framework's own defaults are not.

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

### Semantic

Bootstrap's signal set, reached through utility classes in JSX rather than through `theme.scss`.
They do not appear on the reminders surface, which is the point: seeing one means something
happened.

- **Action Blue** (`#0070e8`, `$primary`): `btn-primary` on every commitment control — the three
  Subscribe CTAs, gift purchase, redemption. Also `badge bg-primary` on the `Official` marker beside a
  Games Workshop source link, which is the one place it appears on the reminders screen. It is the
  most saturated colour in the product and it means *this is the action* or *this is authoritative*.

  It was `#007bff` — Bootstrap 4.6's `$blue`, pinned as a parity value — until that measured 3.98:1
  against the white text it carries, under the 4.5:1 floor this product treats as correctness rather
  than enhancement. `#0070e8` is the nearest hue clearing it, at 4.69:1. This is the one signal colour
  that is *not* a 4.6 pin, and the ratio is the reason: a control that takes money is the last place
  to inherit a framework's old default. Body links derive from the same token and were failing at the
  same ratio; they clear it now too.
- **Danger Red** (`#dc3545`): destructive confirmation buttons, `alert-danger` on failed saves,
  shares, and imports, and the `bg-danger` sale flash in the navbar and on plan cards.
- **Success Green** (`#28a745`): confirmed saves and completed subscription state.
- **Warning Amber** (`#ffc107`) and **Info Cyan** (`#17a2b8`): subscription status text on
  `/profile`, and `alert-info` guidance in the saved-armies and profile flows.

### Named Rules

**The Signal-Colour Rule.** The semantic colours are for state, action, and authority — never for
emphasis or decoration. A saturated colour on the reminders surface should be so rare it reads as
information: today the only one is the `Official` badge.

Muted text is expressed as opacity rather than a separate token: `text-white-75`
(`rgba(255,255,255,0.75)`) in dark theme, Bootstrap's `text-muted` in light.

### Named Rules

**The Slot Rule.** No component hardcodes a colour. Every surface reads a named slot from `ITheme`
(`theme.cardBody`, `theme.text`, `theme.reminderHeader`), and light and dark supply their own
values. A literal hex in a component is a defect — it will be wrong in one of the two themes.

Three slots are deliberately the *same string* in both themes and are declared once, in
`invariantButtons` in `theme/helperClasses`, so the two theme files cannot drift apart:
`theme.commitButton` (`btn-primary`), `theme.destructiveButton` (`btn-danger`), and
`theme.alertActionButton` (`btn-sm btn-outline-dark`). The first two carry a *decision*, and a
decision must read with the same weight in both themes; the third lives on an alert, below. A
`themeButtonSlots` test asserts the invariance, because the failure it prevents is invisible in
whichever theme you happen to be developing in.

That is the whole invariant set. Everything else that varies by surface still varies by theme.

**The Alert Surface Rule.** A Bootstrap `alert-*` keeps its light palette in *both* themes. Nothing
in this product sets `data-bs-theme`, so the alert backgrounds never invert — `alert-info` is
`#d1ecf1` on a Midnight Slate page exactly as it is on a white one.

An alert is therefore the one surface where the Slot Rule runs backwards. A slot exists so light and
dark can supply their own value; on an alert, the dark value is resolved against a light ground and
the contrast inverts. `theme.genericButton` was `btn-outline-light` in dark theme, and on
`alert-info` it measured **1.17:1** — the Load confirmation in `My Armies` was invisible to every
dark-theme subscriber until #1963.

A control on an alert therefore has to clear **two** bars, and the second is the one that is easy to
miss:

1. **Theme-invariant.** Its class must be the same string in both themes — `theme.alertActionButton`,
   `theme.commitButton`, `theme.destructiveButton`, or a literal Bootstrap signal class. Never a slot
   that differs between `light.ts` and `dark.ts`; check the two files before putting any slot on an
   alert.
2. **4.5:1 against the alert's own fixed background.** Invariance only guarantees the control is
   equally wrong in both themes. `btn-outline-secondary` draws its ink at `#6c757d`, which on
   `alert-warning` `#fff3cd` measures **4.23:1** — theme-invariant, and still under the floor. It
   was the retry control on `/profile` and `/subscribe` until this was written down. `btn-success`
   fails the same way from the other direction: white on `#28a745` is **3.13:1**, and it was the
   `Resubscribe` link on the expired-subscription alert.

`theme.alertActionButton` exists to be the answer to both: `btn-outline-dark` puts `#343a40` ink on
`alert-warning` at 10.4:1, and clears every other alert background by at least 8.6:1. (`$dark` is
pinned to 4.6's `$gray-800`, so the ink is `#343a40` and not Bootstrap 5's `#212529` — a small
reminder to measure in the compiled bundle rather than from the framework's documented default.)
Where the control does not recover from what the alert reports, prefer moving it onto the
surrounding themed surface instead.

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
- **Lead** (300, 1.25rem, 1.5): Bootstrap's `.lead`, the standing-prose role — Subscribe's intro and
  feature list, modal explanations, the loading message, and account-flow guidance. It is the voice
  the product uses when it is *talking to* the player rather than quoting a rule, so it appears on
  every surface except the reminders themselves. The light 300 weight is what distinguishes it from
  Body at a glance.
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

Bootstrap 5.3's 12-column grid, with `lg` moved to 1025px and `xxl` to 1900px (`sm: 576`,
`md: 768`, `lg: 1025`, `xl: 1200`, `xxl: 1900`). Containers cap at 1610px at `xxl`. The gutter is
30px, not Bootstrap 5's 1.5rem — see below.

### Named Rules

**The Parity Pin Rule.** The product moved from Bootstrap 4.6 to 5.3 for technical reasons only, and
`src/css/theme.scss` carries a block of overrides that hold the 4.6 defaults in place: the gutter,
the border radii, the card spacers, the badge metrics, link decoration, the focus-ring width, the
signal colours, and RFS (off). Each one is a value this record describes, and each is annotated in
the stylesheet with the 5.3 default it replaces.

Those pins are the system, not legacy debris. Changing one is a design decision with a visible
consequence, so it needs the same deliberation as any other change here — do not "modernise" them
to the framework defaults as tidy-up. Equally, do not assume an unpinned Bootstrap 5 default matches
what this document says: if a value matters, check `theme.scss` first.

Three compatibility rules sit below the Bootstrap import for behaviour that no variable controls:
`.card`/`.card-body` colour and padding, the bare `<label>` bottom margin (with the radio-label
exception), and gutters for the handful of `col-*` elements that live outside a `.row`. Bootstrap 5
also applies gutters to *every* direct child of a `.row`, where 4.6 only styled `col`-classed
children; five non-column row children opt out with `px-0` and carry a comment saying so.

The page is a single centred column of stacked cards. The reminder column sits at
`col col-sm-11 col-md-10 col-lg-10 col-xl-8` — deliberately narrower than the builder above it,
because rule text is read in sentences and the builder is scanned in lists. The builder is a
three-up grid on desktop (`col-md-6 col-lg-4`) and the toolbar is a seven-button responsive row
(`col-6 col-sm-4 col-lg`).

**Mobile is a different layout, not a narrower one.** Below 576px: collapsed builder cards drop to
`col w-50` and tile two-up so the whole builder is visible without scrolling; group titles switch
to shorter `mobileTitle` variants ("Formations", "Artefacts", "Manif. Lores"); card header
padding grows from `0.5rem 1.25rem` to a uniform `1rem`; reminder cards start collapsed rather than
expanded, so the player lands on a list of phases instead of a wall of text.

Spacing is Bootstrap's `1rem`-based scale used at the low end — `0.25`/`0.5`/`1rem` do almost all
the work. Card bodies use `1.25rem` all round and card headers `0.75rem` vertical / `1.25rem`
horizontal. The rhythm is tight on purpose.

**Section bands.** A full-bleed horizontal band marks a major section break on the account routes —
today the pricing block and the mobile demo on `/subscribe`. It is a theme slot,
`theme.sectionBand`: `bg-light` in light theme, and the page colour in dark, where the card borders
do the separating instead (see Elevation). A band is a plain `<div>` with vertical padding, never a
`.row` — a bare Bootstrap row carries −15px margins and will overflow the viewport and scroll the
page sideways, which it did on `/subscribe` at every width until it was fixed.

### Named Rules

**The One Breakpoint Rule.** The mobile breakpoint is 575.98px and it is defined once, in
`src/utils/breakpoints.ts`. The JS hooks derive from it via `matchMedia` and the stylesheet's media
queries use the same number. Two systems disagreeing about where mobile starts was a real defect
here; never reintroduce a second threshold.

**The Print Parity Rule.** Every surface declares its paper behaviour. Chrome that must not print
carries `d-print-none`; content that must print gets a rule in the `@media print` block. Neither is
optional — a new surface with no print decision is unfinished.

## Elevation & Depth

**Flat by default; borders do the work.** `src/css/` declares no `box-shadow` of its own, and
Bootstrap ships with `$enable-shadows: false`, so component surfaces are flat unless something opts
in. Separation comes from a 1px border plus a background shift: in light theme a
`rgba(0,0,0,0.125)` hairline against white, in dark theme an explicit `border-dark` or Pale Gray
edge against Midnight Slate. Card headers separate from bodies by colour alone.

This is not minimalism for its own sake. Shadows vanish in print, so a system that used elevation
to convey structure would lose that structure on paper — and paper is a primary output here.
Borders survive the trip.

"Flat by default" is the default, not an absolute: three things opt in, and all three are listed
below. Reading only `src/css/` will miss two of them, because they arrive as Bootstrap utility
classes in JSX and as a prop on a third-party control.

### Shadow Vocabulary

Three, in descending order of how deliberate they look:

- **Switch handle** (`box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.6)`; active
  `0px 0px 1px 10px rgba(0, 0, 0, 0.2)`): the Edit/Play toggle (`src/components/page/homeHeader.tsx`)
  and the theme toggle (`src/components/routes/Profile.tsx`), both passed as props to `react-switch`.
  The shadow reads as a handle that moves, which is exactly what it is.
- **Focus ring** (`box-shadow: 0 0 0 0.2rem <tinted>`, Bootstrap's `$input-btn-focus-box-shadow`):
  how Bootstrap draws focus on buttons and inputs. Not decorative and not optional — it is the
  visible keyboard-focus indicator, and nothing may suppress it.
- **Card lift** (`shadow-sm`, `0 .125rem .25rem rgba(0,0,0,.075)`): exactly two places — the
  subscription plan cards (`payment/pricingPlans.tsx`) and the FAQ section cards
  (`routes/Faq.tsx`). Both are standalone marketing/reference cards on secondary
  routes, not part of the reminders surface, and neither is reproduced by the reminder or builder
  cards. Treat it as incumbent, not as licence to spread `shadow-sm` onto the game screen.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat unless they earn otherwise, and the reminders and
builder surfaces are flat without exception. Two things earn it: a control that physically travels
(the switch handles) and the focus ring, which is an accessibility requirement rather than a
depth choice. `shadow-sm` on the plan and FAQ cards predates this record and is preserved as
incumbent. If a new element needs to feel separated, give it a border and a background.

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
  `me-2` and a `text-nowrap` label. Outline rather than filled because seven of them sit in one
  row — seven filled buttons would out-shout the reminders below.
- **Navbar:** `btn btn-outline-light btn-sm mx-2` against the teal masthead.
- **Commitment (`theme.commitButton`, `btn-primary`, Action Blue):** the only *filled* buttons in
  the product, reserved for the one control in a view that commits — the three Subscribe CTAs, gift
  purchase, redemption, and in the modal family `Save`, `Import Army`, `Load a copy`,
  `Load this army`, `Download PDF`, `Create share link`. Filled-vs-outline is the hierarchy: outline
  for everything reversible, filled for the one control that commits. `theme.destructiveButton`
  (`btn-danger`) fills likewise for the control that destroys — the row `Delete` in `My Armies`,
  `Overwrite it instead` in `Save Army`, and the confirm in `GenericDestructiveModal`.
  `btn-success` fills nothing: white on Bootstrap's green measures 3.13:1, under the 4.5:1 floor,
  and green as a *commit* colour also collided with green as a *confirmed-write* colour on alerts.
- **Cancel and close:** always `theme.genericButton`, or `btn-close` where a modal has a corner
  dismiss. Red is for destroying data, never for leaving. Four controls whose job was cancel or
  close — in `Import Army` (twice), `Shared Army`, and `Print` — carried `modalDangerClass` and
  rendered as filled red in dark theme, which made the way out of each modal its loudest element.
- **Segmented / pressed:** Bootstrap's own `.active` on `theme.genericButton`, alongside
  `aria-pressed` — the `Paste roster` / `Upload roster` pair in `Import Army`. The selected segment
  fills with the outline button's own ink (11.5:1 in light, 19.9:1 in dark) rather than taking a
  signal colour, so "the one you picked" does not read as a status. It was `btn-info`, at 3.04:1.
- **The filled signal classes that are not used:** `btn-success` (3.13:1) and `btn-info` (3.04:1)
  both put white on a mid-tone at ratios under the floor, and neither appears in the codebase.
  `btn-warning` and `btn-light` take dark text and pass, but have no role here. If a new filled
  colour is ever needed, measure it in the compiled bundle first — `$min-contrast-ratio` is pinned
  to 2.5 to preserve 4.6's text-colour choices, so Bootstrap will *not* stop you.
- **Width:** full-width is the dominant shape — `d-block w-100`, 14 uses (Bootstrap 5 dropped
  `.btn-block`). Buttons in this product are full-width in
  their column far more often than they are inline.
- **Disabled:** used semantically, not decoratively — `Show Hidden` disables at zero hidden, and
  the subscriber actions disable while auth or subscription state is resolving.
- **Hover / Focus:** Bootstrap defaults, untouched. No `outline: none` appears anywhere in the
  stylesheet and `:focus-visible` is honoured; the reminder tags add an explicit
  `2px solid #1c7595` ring at `1px` offset.

### Chips

The reminder timing tags — the one genuinely bespoke component in the system.

- **Style:** uppercase 0.7rem/700 at `0.03em` tracking, `0.1rem 0.4rem` padding, 3px radius, 1px
  border, `cursor: help`.
- **Tones:** semantic tones — cost, active, reaction, passive, your-turn, enemy-turn, neutral,
  usage, priority, source, and provenance — each defined *per theme* via the `tag-tones` mixin,
  never by the tone class alone. Cost is a quiet outline naming a resource spent to use the rule;
  usage tags are dashed to separate a constraint from a classification.
  Source (filled purple) names something the player picked; provenance is its quieter outline-only
  cousin naming a game-wide origin — the core rules, the season, the battletome's battle traits.
- **State:** each tag is a real `<button>` that toggles an inline expansion, because touch devices
  never hover and the abbreviations are not self-explanatory. `title` covers mouse, `aria-label`
  covers assistive tech.
- **Print:** all fills drop to transparent, text to black, border to `rgba(0,0,0,0.45)`. Weight and
  border carry the distinction on paper.

### Badges

Bootstrap badges, almost always pill-shaped: `badge rounded-pill`, kept at 4.6's `10rem` radius and
`.6em` horizontal padding by a rule in `theme.scss` (Bootstrap 5's `.rounded-pill` sets the radius
and nothing else). The one exception is the inline `Sale!` flash beside a plan title, which is a
plain `badge`.

- **`Official`** (`badge bg-primary`, Action Blue): beside a Games Workshop source in the reminder
  overflow menu. Marks authority, and is the only saturated colour on the reminders surface.
- **Sale flash** (`bg-danger`): the discount percentage in the navbar and on plan cards.
  Suppressed below 335px, where the navbar has no room for it.
- **Selection count**: rendered as plain text in the card title (`Units (3)`), not a badge —
  deliberate, since it is a state readout rather than an attention marker.

### Alerts

Bootstrap alerts — ten typed instances across the account flows — are the standard way this product
reports the outcome of an account operation. Never a toast, never a modal. `alert-danger` for a failed save, share, or import;
`alert-warning` for a recoverable problem; `alert-success` for a confirmed write; `alert-info` for
standing guidance. They render inline in the modal or panel that owns the action, so the message
sits where the failure happened. They carry `role="alert"` where the content is not present at
first render.

An alert may carry a control that recovers from what it reports — the retry on `/profile` and
`/subscribe` (`theme.alertActionButton`), the dismiss on the notification banner. Its class must
clear both bars in The Alert Surface Rule: theme-invariant *and* 4.5:1 against the alert's own
background.

It never carries a *decision*. A confirmation goes on the themed surface of whatever it is
confirming, adjacent to the control that raised it, for two reasons: the alert's live-region role
announces its text without moving focus to anything inside it, and an alert placed after the list it
refers to can be arbitrarily far from the row that raised it. `My Armies` did both until #1963.

One live exception, and it is unresolved rather than blessed: `Overwrite it instead` in `Save Army`
is a decision sitting on an `alert-warning`. It is placed there because the duplicate-name warning
is the only place the alternative makes sense, and the alert wraps its message in `role="status"`
with the button *outside* the live region so focus can reach it. It clears both contrast bars
(`theme.destructiveButton`, 4.53:1). It still contradicts this paragraph, and the honest fix is
probably to move the pair onto the modal's own surface. Treat it as open.

### Inputs / Fields

- **Text inputs:** Bootstrap `form-control` (12 uses), `form-control-sm` in dense modal rows. Always
  paired with a real `<label>` — several are `visually-hidden` where the surrounding copy already names the
  field.
- **Selects:** `react-select`, themed through `theme.selectTheme` — light theme uses the library
  default, dark overrides eleven neutral/primary slots to sit on Midnight Slate. Always carries an
  `aria-label`.
- **Note textarea:** `.NoteInput`, 95% width, `resize: vertical` only (horizontal resize let users
  drag it past the card and scroll the page sideways), inheriting theme background and text.
- **Dropzone:** dashed 2px, `#eeeeee` on `#fafafa` in light and Pale Gray on black in dark, with a
  `#2196f3` border on focus and drag-over.
- **Gift purchase table:** Paper with Ink text in light theme; Midnight Slate with Paper text and
  Pale Gray dividers in dark theme. The quantity fields use the matching page surface so the table
  never introduces a light island on the dark profile route.

### Loading and empty states

- **Spinner:** Bootstrap `spinner-border`, with `spinner-border-sm` inline in buttons. Always
  accompanied by `visually-hidden` "Loading..." text under `role="status"`, so the state is announced and
  not merely animated.
- **Suspense fallbacks:** `LoadingHeader` and `LoadingBody` stand in for the navbar and routed
  content, so the masthead does not collapse while a lazy route resolves. `LoadingBody` is two
  static lines and stays that way — a pulse and a fade were built for it and deliberately rejected.
  See The Dead Class Rule. Home's catalog-bound half goes further: `LoadingArmy` is the same two
  static lines on a `fixed`, viewport-sized overlay (`.LoadingSplash`), held by the shell until the
  bound child has committed — the Suspense fallback alone would lift one commit early, and an
  in-flow band under the painted masthead read as a half-built page. Splash, then the finished
  screen, in one commit.

### Cards / Containers

- **Corner Style:** `0.25rem`.
- **Background:** white in light theme, Midnight Slate in dark.
- **Shadow Strategy:** none. The reminder and builder cards carry no `shadow-sm`; the plan and FAQ
  cards do — see Elevation.
- **Border:** 1px hairline; dark theme adds an explicit `border border-dark`.
- **Internal Padding:** `1.25rem` on all four sides of `.card-body`, tightening to `0.75rem`
  vertical on the reminder body below 576px and to `0.5rem` in print. (Bootstrap 4.6's `.card-body`
  took `$card-spacer-x` as a single value, so its vertical padding was 1.25rem and `$card-spacer-y`
  never reached it; 5.x corrected that to `0.75rem 1.25rem`, and `theme.scss` pins the old
  behaviour. `$card-spacer-y` still drives the header, below.)
- **Header:** Signal Teal with white text, containing a full-width `<button>` that carries the
  padding so the entire header is the hit area, an `<h2>` title, and a Material expand/collapse
  chevron. Collapsed headers on mobile append a selection count (`Units (3)`).

### Navigation

- **Style:** bold light links (`fw-bold text-light mx-2`) directly on the masthead colour,
  inside `<header>` → `<nav aria-label="Main">`. No underline, no active-state treatment — the
  current route's own link is simply omitted.
- **Content:** signed out, `Subscribe` / `FAQ` / `Log in`; signed in, `Profile` / `Log out`.
  A sale renders a `badge rounded-pill bg-danger` discount chip, suppressed below 335px.
- **Mobile:** the row narrows from 75% to 100% width; links do not collapse into a menu.

### Signature Component: the Edit/Play switch

The product's one true mode control, and the only place the system spends any expressive budget: an
80×20px `react-switch` in Signal Teal with a Pale Gray handle, flanked by the words `Edit` and
`Play`, the active one bolded. The words are click-to-toggle for the mouse but deliberately **not**
focusable — the switch is the single keyboard control, because a focusable label that only fires in
the opposite mode is a dead stop in the tab order.

### Named Rules

**The Dead Class Rule.** A class in JSX that no rule defines is a design intention that silently
never happened, and this codebase has a habit of them. Checked against the compiled bundle, three
are live in `src/components/` today:

| Class | Where | What was intended |
| --- | --- | --- |
| `btn-pill` | `payment/pricingPlans.tsx` | A rounded Subscribe CTA (`rounded-pill` is the real class) |
| `btn-md` | `routes/Profile.tsx` | A medium button; Bootstrap only ships `btn-sm`/`btn-lg` |
| `pricing-card-title` | `payment/pricingPlans.tsx` | Carried over from a Bootstrap example |

`pulsate-fwd` and `fade-out` on the suspense fallback left this table by being **removed**, and that
closes the one question this record used to carry as open. It said the loading screen "asked for a
pulse and a fade and got neither, so the absence of motion there is an accident, not a decision",
and to treat it as unsettled.

It is settled: the loading screen holds still. Both animations were built and reviewed against the
real fallback in both themes before the call was made, so this is a decision about the product and
not an omission — the pulse read as more presence than a two-line placeholder wants, and the
product's stillness turned out to be worth more than the reassurance it bought. The classes are
gone from `suspenseFallbacks.tsx` rather than left sitting there, because a dead class is exactly
what would let this switch itself back on during a future stylesheet change.

So the product has essentially no motion, and now by decision at every point: the only transition in
the stylesheet is the dropzone's border on drag-over. Do not define `pulsate-fwd` or `fade-out`.
Adding motion anywhere is a design change that needs asking for, and the reminders surface is the
last place to try it.

Verify a new utility class exists before relying on it — `grep` the compiled CSS, not your memory of
which Bootstrap version this is. Two more entries left this table the same way. `g-0` on the FAQ row
was Bootstrap 5 syntax written while the project was still on 4.6, so it had never done anything,
and the 5.3 upgrade would have brought it to life and narrowed every FAQ card. It was deleted rather
than honoured, because reviving a style that has never shipped is a design change — the same
reasoning that retired `pulsate-fwd` and `fade-out`. `h-md-250` on the same row left with the FAQ
rebuild that replaced that layout outright. That is the general remedy for this table: a dead class
is removed or implemented deliberately, never left to switch itself on during an upgrade.

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
- **Do** build a full-bleed band as a padded `<div>` with `theme.sectionBand`, never as a bare
  `.row` — a row outside a container overflows the viewport by 15px and scrolls the page sideways.
- **Do** pair every colour-coded state with a text label, because the colour is gone in print.
- **Do** reuse the established primitives — collapsible card, outline toolbar button, timing chip —
  when new AoS 4 data needs a new treatment.

### Don't:

- **Don't** introduce a web font, or any render-blocking resource on the reminders path.
- **Don't** add a `box-shadow` to a new element. The switch handles, Bootstrap's focus ring, and the
  incumbent `shadow-sm` on the plan and FAQ cards are the whole vocabulary; never put one on the
  reminders or builder surface.
- **Don't** suppress Bootstrap's focus ring — it is a `box-shadow`, and removing it removes the
  visible keyboard-focus indicator.
- **Don't** hardcode a hex in a component, or reach for `$themeRed`, `$themeYellow`, or
  `$themeDarkBlueTertiary` — they are declared but unused and are not part of the system.
- **Don't** put a theme-varying slot inside a Bootstrap `alert-*`, or a decision of any kind. Alert
  palettes stay light in both themes, so `btn-outline-light` vanishes on one — this shipped at
  1.17:1. And don't stop at invariance: `btn-outline-secondary` (4.23:1 on `alert-warning`) and
  `btn-success` (3.13:1) are the same string in both themes and both shipped under the floor. Reach
  for `theme.alertActionButton`. See The Alert Surface Rule.
- **Don't** change heading level to change text size. Set the size in `.CardHeaderTitle`.
- **Don't** use uppercase outside the timing tags.
- **Don't** use a filled button for a reversible action. Filled (`btn-primary`) is reserved for the
  control that commits; everything else is outline.
- **Don't** reach for a Bootstrap 4 utility. This is Bootstrap 5.3 — `ml-*`/`mr-*`, `sr-only`,
  `badge-primary`, `badge-pill`, `btn-block`, `no-gutters`, `font-weight-bold`, and the
  `custom-control` form family are all gone. `btn-md` is in the trap in both versions and is still
  live in the codebase today.
- **Don't** replace a parity pin in `theme.scss` with the Bootstrap 5 default without deciding to
  change the design. Each pin holds a value this document specifies, and each is annotated with the
  default it overrides.
- **Don't** trade density for whitespace on the reminders screen. It is a reference sheet read
  under time pressure, not a marketing page.
- **Don't** restyle as a side effect of an accessibility or correctness fix. Choose the variant that
  renders identically, state the delta, and let the user accept it.
- **Don't** introduce a second visual language or a broad reskin. The live site is the baseline and
  a redesign requires an explicit request.
